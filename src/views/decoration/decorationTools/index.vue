<template>
  <div
    class="page-editor"
    :class="{ blueBorder: flickering }"
    :style="{
      width: isPreview ? '100%' : '720px',
    }"
  >
    <div v-if="openType === 5" class="product-bg"></div>
    <div v-if="!componentsList.length && !isPreview" class="empty-box"
      >拖动左侧组件，到当前区域进行楼层配置
    </div>
    <t-layout>
      <t-layout-content>
        <draggable
          item-key="index"
          ghost-class="ghost"
          animation="300"
          drag-class="dragClass"
          class="components-wrap"
          :force-fallback="true"
          :scroll="true"
          :disabled="isPreview"
          :group="{ name: 'vehicle-station' }"
          :list="toolList"
          :move-threshold="20"
          @end="endSort"
          @add="insertSort"
        >
          <template #item="{ element, index }">
            <transition name="el-fade-in-linear">
              <div v-show="true">
                <ViewComponentWrap
                  :ref="(el: any) => { setItemRef(el, index)}"
                  :is-preview="isPreview"
                  :data="componentsList[index]"
                  :component-index="index"
                  :component-style="bgStyle(index)"
                  :select-component-index="selectIndex"
                  @select="selectComponent"
                  @close="close"
                ></ViewComponentWrap>
                <!-- element !== 'HomeHeader' 后续可以考虑写个方法 -->
                <t-space
                  v-if="
                    selectIndex === index &&
                    !isPreview &&
                    element !== 'HomeHeader'
                  "
                  class="select_config-box"
                >
                  <iconpark-icon
                    :size="12"
                    name="componentDel"
                    style="
                      padding: 5px;
                      border: 1px solid #86909c;
                      border-radius: 2px;
                      cursor: pointer;
                    "
                    @click="deleteComponent(index)"
                  />
                  <iconpark-icon
                    v-if="!isMaxNum"
                    name="componentCopy"
                    :size="12"
                    style="
                      padding: 5px;
                      border: 1px solid #86909c;
                      border-radius: 2px;
                      cursor: pointer;
                    "
                    @click="copyComponent(index)"
                  />
                  <t-popover
                    v-if="element !== 'ImageOverlapText'"
                    trigger="hover"
                  >
                    <iconpark-icon
                      name="componentBg"
                      :size="12"
                      style="
                        padding: 5px;
                        border: 1px solid #86909c;
                        border-radius: 2px;
                        cursor: pointer;
                      "
                    />
                    <template #content>
                      <div class="color-picker">
                        <div
                          v-for="(item, i) in colorList"
                          :key="i"
                          :class="[
                            item.cssClass,
                            {
                              'is-active':
                                `${item.color0}${item.color1}` ===
                                componentsList[selectIndex].bgColor,
                            },
                          ]"
                          @click="changeColor(i)"
                        ></div>
                      </div>
                    </template>
                  </t-popover>
                </t-space>
              </div>
            </transition>
          </template>
        </draggable>
      </t-layout-content>
    </t-layout>
    <div v-if="openModel === 0" class="floating_btn-box">
      <t-space size="medium">
        <icon-eye v-if="!isPreview" :size="24" @click="clickPreview" />
        <icon-eye-invisible v-if="isPreview" :size="24" @click="notPreview" />
        <iconpark-icon name="saveLocal" :size="24" @click="clickSave" />
        <iconpark-icon name="saveRemote" :size="24" @click="clickSaveRemote" />
      </t-space>
    </div>
    <div v-if="openModel === 1" class="floating_footer-box">
      <t-space :size="12">
        <t-button @click="edit">编辑</t-button>
        <t-button type="primary" @click="clickSaveRemote">发布</t-button>
      </t-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue';
import draggable from 'vuedraggable';
import eventBus from '@/utils/bus';
import { useRoute, useRouter } from 'vue-router';
import {
  apiGetNavData,
  apiUpdateNavData,
} from '@/api/decoration/decoration-tools';
import { Message, Modal } from '@tele-design/web-vue';
import { ChannelType } from '@/enums/decoration';
import { Translate } from '@icon-park/vue-next';
import { goodsDetail } from '@/api/goods-manage';
import ViewComponentWrap from './view-component-wrap.vue';
import { channelName, LinkType } from './constant';
import { ToolData, tools } from './config/tools';

const broadcastChannel = new BroadcastChannel(channelName);
const route = useRoute();
const router = useRouter();
const componentsList = ref<any[]>([]);
const toolList = ref<any[]>([]);
const selectIndex = ref(-1);

const isPreview = ref(false);

// 是否是第一次使用
const isFirstUse = ref(false);

const flickering = ref(false);

// const popupShow = ref(false);
// 定时器
const timer = ref();

const viewComponentWrapRef = ref<any[]>([]);

const colorIndex = ref(-1);

const decorationJson = ref('');

const openType = ref(-1);

const interceptFlag = ref(true);

const proId = ref('');

// 打开模式 0-普通编辑模式 1-外部预览模式
const openModel = ref(-1);

// 配置背景色列表（后续如果需要支持选中返显效果，需要给组件增加一个cssClass字段跟列表中的字段做匹配）
const colorList = ref([
  { cssClass: 'bg_color-1', color0: '#ffffff', color1: '' },
  { cssClass: 'bg_color-2', color0: '#F5F6FB', color1: '' },
  { cssClass: 'bg_color-3', color0: '#EBF0F4', color1: '' },
  { cssClass: 'bg_color-4', color0: '#ffffff', color1: '#e2ecff' },
]);

// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});

// 处理背景色的字符串，1-非渐变色，就返回一个颜色值，2-渐变色，切割为两个颜色值
function handleBgColor(color: string) {
  // 检查字符串是否包含两个 '#'
  if (
    color?.includes('#') &&
    color.indexOf('#', color.indexOf('#') + 1) !== -1
  ) {
    // 找到第一个 '#' 后面的索引
    const secondHashIndex = color.indexOf('#', color.indexOf('#') + 1);

    // 使用 ES6 字符串切片语法切割字符串
    const firstSubstring = color.slice(0, secondHashIndex);
    const secondSubstring = color.slice(secondHashIndex);

    // 返回切割后的子串数组
    return [firstSubstring, secondSubstring];
  }

  // 如果不包含两个 '#'，返回 原字符串 或抛出错误
  return [color];
}

// 让边框闪烁
const flickerBorder = (n: number) => {
  let count = n;
  // 800毫秒循环一次
  timer.value = setInterval(() => {
    if (count > 0) {
      if (flickering.value) {
        count -= 1;
      }
      flickering.value = !flickering.value;
    } else {
      console.log('闪烁停止');
      clearInterval(timer.value);
      flickering.value = false;
      // popupShow.value = false;
    }
  }, 800);
};

// 设置组件背景样式
const bgStyle = (index: number) => {
  const colorList = handleBgColor(componentsList.value[index]?.bgColor);
  if (colorList.length === 2) {
    // 渐变色
    return {
      background: `linear-gradient(to bottom, ${colorList[0]}, ${colorList[1]})`,
    };
  }
  // 非渐变色
  return {
    backgroundColor: colorList[0],
  };
};

// 设置组件背景色值
const changeColor = (val: number) => {
  colorIndex.value = val;
  componentsList.value[selectIndex.value].bgColor =
    colorList.value[colorIndex.value]?.color0 +
    colorList.value[colorIndex.value]?.color1;
};

// 左侧工具栏拖入后在列表中的位置
const onEnd = (index: number) => {
  selectIndex.value = index;
};

// 判断组件数量是否大于10个上限
const isMaxNum = computed(() => {
  return componentsList.value.length >= 10;
});

// 移除当前组件
const deleteComponent = (index: number) => {
  componentsList.value.splice(index, 1);
  toolList.value.splice(index, 1);
  // 删除ref对象
  viewComponentWrapRef.value.splice(index, 1);
  // 删除当前的组件,将下个组件数据传递给配置组件,直到删完所有组件
  eventBus.emit('selectComponent', componentsList.value[index]);
};

const deepCopy: any = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map(deepCopy);
  }
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce(
      (copy: any, key: string) => {
        copy[key] = deepCopy(obj[key]);
        return copy;
      },
      Array.isArray(obj) ? [] : {}
    );
  }
  return obj;
};

// 复制当前组件，并插入到当前组件index后面
const copyComponent = (index: number) => {
  const component = deepCopy(componentsList.value[index]) as any;
  const firstHalf = componentsList.value.slice(0, index);
  const secondHalf = componentsList.value.slice(index);
  componentsList.value = [...firstHalf, component, ...secondHalf];
  const firstHalfTool = toolList.value.slice(0, index);
  const secondHalfTool = toolList.value.slice(index);
  toolList.value = [...firstHalfTool, component.name, ...secondHalfTool];
  selectIndex.value = index;
};

// 动态设置组件的ref
const setItemRef = (el: any, index: number) => {
  if (el) {
    viewComponentWrapRef.value[index] = el;
  }
};

const closeTip = (msg: string) => {
  Message.success(msg);
  setTimeout(() => {
    interceptFlag.value = false;
    window.close();
  }, 900);
};

// 保存组件列表的json数据到本地
const clickSave = () => {
  // 先清除本地存储
  const { id } = route.query;
  if (componentsList.value.length === 0) {
    Message.error('请先添加组件并配置完成再保存');
    return;
  }
  const json = JSON.stringify(componentsList.value);
  if (openType.value === ChannelType.PLATFORM_PRODUCT_DETAIL) {
    // 给goods-add 发消息保存内容, 如果goods-add 页面没有填写基础信息，则保存失败，需要给用户在这页提示出来
    broadcastChannel.postMessage(
      JSON.stringify({ name: 'product_detail', status: 0, data: json })
    );
  } else {
    // 二次弹框
    Modal.info({
      title: '确认保存',
      content: '保存后，当前编辑内容将保存到草稿',
      titleAlign: 'start',
      hideCancel: false,
      okText: '保存',
      onOk: () => {
        // 保存远程
        apiUpdateNavData({
          id,
          status: 0,
          draftDetail: json,
        }).then((res: any) => {
          // 通知主tab页刷新
          broadcastChannel.postMessage(
            JSON.stringify({ name: 'chnnelPageRefresh', data: '' })
          );
          closeTip('保存成功');
        });
      },

      onCancel: () => {},
    });
  }
};
// 保存组件列表的json数据到远程
const clickSaveRemote = () => {
  const childForm = () => {
    console.log('childForm', viewComponentWrapRef.value);
    return viewComponentWrapRef.value.map((item: any) => {
      return item.validate();
    });
  };
  Promise.all(childForm())
    .then((data: any) => {
      if (componentsList.value.length === 0) {
        Message.error('请先添加组件并配置完成再发布');
        return;
      }
      const { id } = route.query;
      const json = JSON.stringify(componentsList.value);
      // 分情况处理：普通渠道装修；商品详情装修
      if (openType.value === ChannelType.PLATFORM_PRODUCT_DETAIL) {
        // 给goods-add 发消息保存内容, 如果goods-add 页面没有填写基础信息，则保存失败，需要给用户在这页提示出来
        broadcastChannel.postMessage(
          JSON.stringify({ name: 'product_detail', status: 1, data: json })
        );
      } else {
        // 二次弹框
        Modal.info({
          title: '确认保存并发布',
          content: '发布后，当前编辑内容将发布到网站前台',
          titleAlign: 'start',
          hideCancel: false,
          okText: '保存并发布',
          onOk: () => {
            // 保存远程
            apiUpdateNavData({
              id,
              status: 1,
              detail: json,
            }).then((res: any) => {
              // 通知主tab页刷新
              broadcastChannel.postMessage(
                JSON.stringify({ name: 'chnnelPageRefresh', data: '' })
              );
              closeTip('发布成功');
            });
          },

          onCancel: () => {},
        });
      }
    })
    .catch(() => {
      Message.error('未完成详情配置');
    });
};

// 从新排序
const endSort = (event: any) => {
  const { newIndex, oldIndex } = event;
  const newIndexData = JSON.parse(
    JSON.stringify(componentsList.value[oldIndex])
  );
  const oldIndexData = JSON.parse(
    JSON.stringify(componentsList.value[newIndex])
  );
  componentsList.value[newIndex] = newIndexData;
  componentsList.value[oldIndex] = oldIndexData;
};

const insertSort = (event: any) => {
  const { oldIndex, newIndex } = event; // oldIndex表示左侧装修组件的位置, newIndex-被拖拽区域的位置
  // todo
  selectIndex.value = newIndex;
  const addToolData = JSON.parse(JSON.stringify(ToolData[tools[oldIndex]]));
  componentsList.value.splice(newIndex, 0, addToolData);
  console.log(
    '----被拖拽区域收到新增组件事件 触发选中组件--：',
    event.newIndex,
    componentsList.value
  );
  if (!isPreview.value) {
    eventBus.emit(
      'selectComponent',
      JSON.parse(JSON.stringify(componentsList.value[newIndex]))
    );
  }
};

const close = () => {
  componentsList.value[selectIndex.value].visible = false;
};

const clickPreview = () => {
  isPreview.value = true;
  eventBus.emit('previewEvent', true);
};

const notPreview = () => {
  isPreview.value = false;
  eventBus.emit('previewEvent', false);
};

// 选中组件回调
const selectComponent = (index: number) => {
  selectIndex.value = index;
  if (!isPreview.value) {
    eventBus.emit('selectComponent', componentsList.value[selectIndex.value]);
    console.log(
      '选中1111',
      componentsList.value[selectIndex.value],
      selectIndex.value
    );
  }
};

// 进入编辑模式
const edit = () => {
  openModel.value = 0;
  isPreview.value = false;
  eventBus.emit('previewEvent', false);
};

// 接收bus事件
const handleMyEvent = (payload: any) => {
  console.log('index.vue 监听到insertIndex事件，获取到index:', payload);
  // selectIndex.value = payload;
};

watch(
  () => route.query.model,
  (nV) => {
    openModel.value = parseInt(`${nV}`, 10);
    if (openModel.value === 1) {
      isPreview.value = true;
      setTimeout(() => {
        eventBus.emit('previewEvent', isPreview.value);
      }, 10);
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => route.query,
  () => {
    const { type } = route.query;
    console.log('open model0', route.query);
    openType.value = parseInt(`${type}`, 10);
    if (openType.value === ChannelType.PLATFORM_PRODUCT_DETAIL) {
      console.log(openType.value, ChannelType);

      // interceptFlag.value = false;
    } else {
      interceptFlag.value = true;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

// 数组插入第一个元素--homeheader
const insertFirst = () => {
  componentsList.value.unshift({
    chineseName: '首页top',
    maxNum: 3,
    icon: 'singleImg',
    name: 'HomeHeader',
    mainTitle: '我是主标题',
    configValue: [
      {
        title: '小标题',
        desc: '图片描述',
        src: '',
        linkType: LinkType.LINK,
        linkUrl: 'http://www.baidu.com',
      },
      {
        title: '小标题',
        desc: '图片描述',
        src: '',
        linkType: LinkType.LINK,
        linkUrl: 'http://www.baidu.com',
      },
      {
        title: '小标题',
        desc: '图片描述',
        src: '',
        linkType: LinkType.LINK,
        linkUrl: 'http://www.baidu.com',
      },
      {
        title: '小标题',
        desc: '图片描述',
        src: '',
        linkType: LinkType.LINK,
        linkUrl: 'http://www.baidu.com',
      },
    ],
  });
};

const getNavData = (type: number) => {
  apiGetNavData({ type })
    .then((res: any) => {
      // decorationJson.value = res.data[0].detail;
      const { status, detail, draftDetail } = res.data[0];
      console.log('装修数据000', res.data[0].detail);
      if (status) {
        if (detail && detail !== '[]') {
          componentsList.value = JSON.parse(detail);
          toolList.value = componentsList.value.map((item) => {
            return item.name;
          });
        }
        console.log('有装修数据', componentsList.value, toolList.value);
      } else {
        console.log(
          '没有装修数据',
          decorationJson.value,
          typeof decorationJson.value,
          componentsList.value
        );
        // const localStorageData = localStorage.getItem(
        //   `componentsList${openType.value}`
        // );
        // if (localStorageData) {
        //   componentsList.value = JSON.parse(localStorageData);
        // }
        if (draftDetail && draftDetail !== '[]') {
          componentsList.value = JSON.parse(draftDetail);
          toolList.value = componentsList.value.map((item) => {
            return item.name;
          });
        }
      }
    })
    .catch()
    .finally(() => {
      if (type === ChannelType.PLATFORM_HOME) {
        // 首页装修，默认把首页组件放到第一个
        if (componentsList.value.length > 0) {
          if (componentsList.value[0].name !== 'HomeHeader') {
            insertFirst();
          }
        } else if (componentsList.value.length === 0) {
          insertFirst();
        }
      }
    });
};

// 开场第一次闪烁两次
const firstFlicker = () => {
  setTimeout(() => {
    flickering.value = true;
    flickerBorder(2);
  }, 2000);
};
// 拖入组件后闪烁一次
const secondFlicker = () => {
  setTimeout(() => {
    flickering.value = true;
    flickerBorder(1);
  }, 1000);
  isFirstUse.value = false;
};

watch(
  () => componentsList.value.length,
  (vn, vo) => {
    if (isFirstUse.value && vn > 0) {
      secondFlicker();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  // 二次弹框不能定制，只有系统弹框
  window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload111 inner', interceptFlag.value);
    componentsList.value = [...componentsList.value];
    if (interceptFlag.value) {
      console.log('有装修数据，是否确认离开？');
      event.preventDefault();
    }
  });
  // eventBus.on('insertIndex', handleMyEvent);
  // config-event
  eventBus.on('configEvent', (data: any) => {
    const jsonData = JSON.parse(JSON.stringify(data));
    console.log(
      'index 接收的config信息',
      jsonData,
      selectIndex.value,
      JSON.parse(JSON.stringify(componentsList.value))
    );
    // 平图文组件特殊处理
    if (componentsList.value[selectIndex.value]?.name === 'SpliceImageText') {
      const { mainTitle, configValue1, configValue2 } = jsonData.msgData;
      (componentsList.value[selectIndex.value] || {}).mainTitle = mainTitle;
      (componentsList.value[selectIndex.value] || {}).configValue1 =
        configValue1;
      (componentsList.value[selectIndex.value] || {}).configValue2 =
        configValue2;
      return;
    }
    if (jsonData.type) {
      // 对象类型的配置项
      componentsList.value[selectIndex.value].configValue = {
        ...jsonData.msgData,
      };
      console.log('对象类型复制00', componentsList.value);
    } else {
      // 数组类型的配置项
      componentsList.value[selectIndex.value].mainTitle =
        jsonData.msgData.mainTitle;
      componentsList.value[selectIndex.value].configValue = [
        ...jsonData.msgData.list,
      ];
      console.log(
        'index 接收的config信息end',
        JSON.parse(JSON.stringify(componentsList.value))
      );
    }
  });
  openType.value = parseInt(`${route.query.type}`, 10);
  if (openType.value !== ChannelType.PLATFORM_PRODUCT_DETAIL) {
    // 非商品详情装修的情况
    getNavData(openType.value);
  } else {
    const { proId } = route.query;
    if (proId) {
      goodsDetail(`${proId}`).then((res) => {
        console.log('商品详情数据000111', res);
        const { draftStatus, draftDetail, detail, versionType } = res;
        if (versionType === 1) {
          // 新版装修数据
          if (draftStatus === 0) {
            // 草稿状态
            if (!draftDetail) return;
            componentsList.value = JSON.parse(draftDetail);
            toolList.value = componentsList.value.map((item) => {
              return item.name;
            });
          } else {
            // 发布状态
            if (!detail) return;
            componentsList.value = JSON.parse(detail);
            toolList.value = componentsList.value.map((item) => {
              return item.name;
            });
          }
        } else {
          // 旧版数据丢弃
        }
      });
    }
  }
  // 接收首次使用装修的消息
  eventBus.on('isFirstUseDecoration', (data: any) => {
    if (data) {
      isFirstUse.value = true;
      firstFlicker();
    }
  });
  // 接收外部页面的消息
  broadcastChannel.addEventListener('message', (event) => {
    const { name, status, msg } = JSON.parse(event.data);
    if (name === 'product_detail_save') {
      if (status) {
        // 保存成功
        Message.success(msg);
        setTimeout(() => {
          interceptFlag.value = false;
          window.close();
        }, 900);
      } else {
        // 失败
        Message.error(msg);
      }
    }
  });
});

onBeforeUnmount(() => {
  // bus 关闭监听
  // eventBus.off('insertIndex');
  eventBus.off('configEvent');
  eventBus.off('isFirstUseDecoration');
  // tab 关闭拦截关闭
  interceptFlag.value = false;
  window.removeEventListener('beforeunload', (event) => {});
  // 关闭消息通道
  broadcastChannel.close();
});
</script>

<style scoped lang="less">
@factor: v-bind(num);

.page-editor {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  // overflow-y: auto;
  // background-color: #981313;
  .product-bg {
    width: calc(@factor * 718px);
    height: calc(@factor * 280px);
    margin-top: 20px;
    background: url(../../../assets/images/decoration/product_bg.png);
    background-size: cover;
  }

  .empty-box {
    position: fixed;
    top: 40%;
    width: 614px;
    height: 134px;
    margin-top: 20px;
    padding: 60px 0;
    color: #1d2129;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    background-color: white;
    // z-index: -1;
    //虚线
    border: 1px dashed #c9cdd4;
    border-radius: 8px;
  }

  .component-config {
    width: 442px;
    height: 100%;
  }

  :deep(.tele-layout-header),
  :deep(.tele-layout-footer),
  :deep(.tele-layout-sider-children),
  :deep(.tele-layout-content) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    font-stretch: condensed;
    text-align: center;
  }

  :deep(.tele-layout-header) {
    align-items: flex-end;
    height: 64px;
    padding: 16px;
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.tele-layout-sider) {
    width: 206px;
    min-width: 0;
    max-width: 500px;
    height: 100%;
  }

  :deep(.tele-layout-content) {
    height: 100%;
  }

  .floating_btn-box {
    position: fixed;
    bottom: 24px;
    left: 130px;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 152px;
    height: 42px;
    background-color: white;
    border-radius: 2px;
    cursor: pointer;
  }

  .floating_footer-box {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 68px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }

  ::v-deep(.tele-layout) {
    width: 100%;
  }
}

.blueBorder {
  border: 1px solid #1664ff;
  border-radius: 4px;
}

.components-wrap {
  width: 100%;
  height: 100%;
}

.select_config-box {
  position: absolute;
  left: 50%;
  z-index: 1000;
  display: flex;
  height: 24px;
  margin-top: 4px;
  transform: translateX(-50%);
}

::v-deep(.tele-radio-button.tele-radio-checked) {
  background-color: transparent !important;
}

::v-deep(.tele-radio-group-button) {
  background-color: white !important;
}

.color-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .bg_color-1 {
    width: 24px;
    height: 24px;
    margin: 0 10px;
    background-color: #fff;
    border: 1px solid #86909c;
    border-radius: 2px;
  }

  .bg_color-2 {
    width: 24px;
    height: 24px;
    margin: 0 10px;
    background-color: #f5f6fb;
    border: 1px solid #86909c;
    border-radius: 2px;
  }

  .bg_color-3 {
    width: 24px;
    height: 24px;
    margin: 0 10px;
    background-color: #ebf0f4;
    border: 1px solid #86909c;
    border-radius: 2px;
  }

  .bg_color-4 {
    width: 24px;
    height: 24px;
    margin: 0 10px;
    background: linear-gradient(to bottom, #fff, #e2ecff);
    border: 1px solid #86909c;
    border-radius: 2px;
  }

  .is-active {
    border: 1px solid #1664ff;
  }
}

.is-hidden {
  display: none;
}

.dragClass {
  border: 1px solid #1664ff;
  border-radius: 8px;
}

.ghost {
  background-color: #e8f4ff !important;
}
</style>
