<template>
  <div
    class="page-editor"
    :class="{ blueBorder: flickering }"
    :style="{
      width: isPreview ? '100%' : '720px',
    }"
  >
    <t-popover position="rt" :popup-visible="isFirstUse">
      <div
        :style="{
          position: 'absolute',
          top: '50px',
          left: '-230px',
          color: 'transparent',
        }"
      >
        .
      </div>
      <template #title> 操作引导 </template>
      <template #content>
        <p>拖动左侧icon到指定区域，松开</p>
        <p>鼠标完成模版添加</p>
      </template>
    </t-popover>
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
          :list="componentsList"
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
                  :data="element"
                  :component-index="index"
                  :component-style="bgStyle(index)"
                  :select-component-index="selectIndex"
                  @select="selectComponent"
                  @close="close"
                ></ViewComponentWrap>
                <div
                  v-if="selectIndex === index && !isPreview"
                  class="select_config-box"
                >
                  <iconpark-icon
                    :size="12"
                    name="componentDel"
                    style="
                      padding: 5px;
                      border: 1px solid #86909c;
                      border-radius: 2px;
                    "
                    @click="deleteComponent(index)"
                  />
                  <iconpark-icon
                    name="componentCopy"
                    :size="12"
                    style="
                      padding: 5px;
                      border: 1px solid #86909c;
                      border-radius: 2px;
                    "
                    @click="copyComponent(index)"
                  />
                  <t-popover trigger="hover">
                    <iconpark-icon
                      name="componentBg"
                      :size="12"
                      style="
                        padding: 5px;
                        border: 1px solid #86909c;
                        border-radius: 2px;
                      "
                    />

                    <template #content>
                      <div class="color-picker">
                        <div
                          v-for="(item, index) in colorList"
                          :key="index"
                          :class="[
                            item.cssClass,
                            { 'is-active': colorIndex === index },
                          ]"
                          @click="changeColor(index)"
                        ></div>
                      </div>
                    </template>
                  </t-popover>
                </div>
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
import {
  ref,
  watch,
  onMounted,
  computed,
  nextTick,
  onBeforeUnmount,
} from 'vue';
import draggable from 'vuedraggable';
import eventBus from '@/utils/bus';
import { useRoute } from 'vue-router';
import {
  apiGetIsFirstUseDecoration,
  apiGetNavData,
  apiUpdateNavData,
} from '@/api/decoration/decoration-tools';
import { Message, Modal } from '@tele-design/web-vue';
import { ChannelType } from '@/enums/decoration';
import { Translate } from '@icon-park/vue-next';
import ViewComponentWrap from './view-component-wrap.vue';
import { channelName } from './constant';

const broadcastChannel = new BroadcastChannel(channelName);
const route = useRoute();
const componentsList = ref<any[]>([]);
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
  { cssClass: 'bg_color-1', color0: '#ffffff' },
  { cssClass: 'bg_color-2', color0: '#F5F6FB' },
  { cssClass: 'bg_color-3', color0: '#EBF0F4' },
  { cssClass: 'bg_color-4', color0: '#ffffff', color1: '#e2ecff' },
]);

// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});

const curSelectedComponent = computed(() => {
  return componentsList.value[selectIndex.value];
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
    (colorList.value[colorIndex.value]?.color1 ?? '');
};

// 左侧工具栏拖入后在列表中的位置
const onEnd = (index: number) => {
  selectIndex.value = index;
};

// 移除当前组件
const deleteComponent = (index: number) => {
  componentsList.value.splice(index, 1);
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
  selectIndex.value = index;
};

// 动态设置组件的ref
const setItemRef = (el: any, index: number) => {
  if (el) {
    viewComponentWrapRef.value[index] = el;
  }
};

// 保存组件列表的json数据到本地
const clickSave = () => {
  // 先清除本地存储
  const { type } = route.query;
  if (openType.value === ChannelType.PLATFORM_PRODUCT_DETAIL) {
    const json =
      componentsList.value.length > 0
        ? JSON.stringify(componentsList.value)
        : '';
    // 保存草稿
    localStorage.setItem(
      proId.value,
      JSON.stringify({ setOk: false, data: json })
    );
    broadcastChannel.postMessage(
      JSON.stringify({ name: 'product_detail', data: '' })
    );
    window.close();
  } else {
    localStorage.removeItem(`componentsList${type}`);
    localStorage.setItem(
      `componentsList${type}`,
      JSON.stringify(componentsList.value)
    );
    console.log('保存成功:', componentsList.value);

    broadcastChannel.postMessage(
      JSON.stringify({ name: 'chnnelPageRefresh', data: '' })
    );
  }
};
// 保存组件列表的json数据到远程
const clickSaveRemote = () => {
  const childForm = () => {
    return viewComponentWrapRef.value.map((item: any) => {
      return item.validate();
    });
  };
  Promise.all(childForm())
    .then((data: any) => {
      console.log('校验成功:', data);
      if (componentsList.value.length === 0) {
        Message.error('请先添加组件');
        return;
      }
      const { id } = route.query;
      const json = JSON.stringify(componentsList.value);
      // 分情况处理：普通渠道装修；商品详情装修
      if (openType.value === ChannelType.PLATFORM_PRODUCT_DETAIL) {
        // 商品详情装修
        // tab间通信，发送json数据到tab页
        localStorage.setItem(
          proId.value,
          JSON.stringify({ setOk: true, data: json })
        );
        broadcastChannel.postMessage(
          JSON.stringify({ name: 'product_detail', data: '' })
        );
        window.close();
        return;
      }

      // 二次弹框
      Modal.info({
        title: '确认保存并发布',
        content: '发布后，当前编辑内容将发布到网站前台',
        titleAlign: 'start',
        hideCancel: false,
        okText: '保存并发布',
        onOk: () => {
          // 保存本地
          clickSave();
          // 保存远程
          apiUpdateNavData({
            id,
            detail: json,
          }).then((res: any) => {
            Message.success('保存成功');
            // 通知主tab页刷新
            broadcastChannel.postMessage(
              JSON.stringify({ name: 'chnnelPageRefresh', data: '' })
            );
          });
        },
        onCancel: () => {},
      });
    })
    .catch(() => {
      console.log('保存失败');
      Message.error('保存失败');
    });
};

// 从新排序
const endSort = () => {
  console.log('endSort0000:', componentsList.value);
  // clickSave();
};

const insertSort = (event: any) => {
  if (!isPreview.value) {
    console.log('endSort11111:', event.newIndex);
    eventBus.emit('selectComponent', componentsList.value[event.newIndex]);
  }
};

const close = () => {
  componentsList.value[selectIndex.value].visible = false;
};

const clickPreview = () => {
  isPreview.value = true;
  eventBus.emit('preview-event', true);
};

const notPreview = () => {
  isPreview.value = false;
  eventBus.emit('preview-event', false);
};

// 选中组件回调
const selectComponent = (index: number) => {
  selectIndex.value = index;
  console.log('收到选中组件事件:', index);
  console.log(
    '打印选中组件的值：',
    JSON.parse(JSON.stringify(componentsList.value))
  );
  if (!isPreview.value) {
    eventBus.emit('selectComponent', componentsList.value[selectIndex.value]);
    console.log(
      '选中1111',
      componentsList.value[selectIndex.value],
      selectIndex.value
    );
  } else {
    // linkType :0-链接（点击跳转链接），1-产品（点击跳到搜索产品结果页）
    console.log(
      '选中的组件00:',
      componentsList.value[selectIndex.value].configValue?.linkType
    );
    const type = componentsList.value[selectIndex.value].configValue?.linkType;
    if (type === 0) {
      window.open(
        componentsList.value[selectIndex.value].configValue?.linkUrl,
        '_blank'
      );
    } else if (type === 1) {
      // 跳转到搜索产品结果页
      console.log('跳转到搜索产品结果页');
    }
  }
};

// 进入编辑模式
const edit = () => {
  openModel.value = 0;
  isPreview.value = false;
  eventBus.emit('preview-event', false);
};

// 接收bus事件
const handleMyEvent = (payload: any) => {
  console.log('监听到insertIndex事件，获取到index:', payload);
  selectIndex.value = payload;
};

watch(
  () => route.query.model,
  (nV) => {
    openModel.value = parseInt(`${nV}`, 10);
    if (openModel.value === 1) {
      isPreview.value = true;
      setTimeout(() => {
        eventBus.emit('preview-event', isPreview.value);
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
    if (openType.value === 5) {
      console.log('open model1', openModel.value);
      interceptFlag.value = false;
    } else {
      interceptFlag.value = true;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const getNavData = (type: number) => {
  apiGetNavData({ type })
    .then((res: any) => {
      decorationJson.value = res.data[0].detail;
      console.log('装修数据000', res.data[0].detail);
      if (decorationJson.value && decorationJson.value !== '[]') {
        componentsList.value = JSON.parse(decorationJson.value);
        console.log('有装修数据', componentsList.value);
      } else {
        console.log(
          '没有装修数据',
          decorationJson.value,
          typeof decorationJson.value,
          componentsList.value
        );
        const localStorageData = localStorage.getItem(
          `componentsList${openType.value}`
        );
        if (localStorageData) {
          componentsList.value = JSON.parse(localStorageData);
        }
      }
    })
    .catch();
};

// 开场第一次闪烁两次
const firstFlicker = () => {
  // popupShow.value = true;
  flickering.value = true;
  setTimeout(() => {
    flickerBorder(2);
  }, 2000);
};
// 拖入组件后闪烁一次
const secondFlicker = () => {
  flickering.value = true;
  setTimeout(() => {
    flickerBorder(2);
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
  console.log('装修index页面');
  // 二次弹框不能定制，只有系统弹框
  window.addEventListener('beforeunload', (event) => {
    if (interceptFlag.value) {
      console.log('有装修数据，是否确认离开？');
      event.preventDefault();
    }
  });
  eventBus.on('insertIndex', handleMyEvent);
  // config-event
  eventBus.on('config-event', (data: any) => {
    console.log(
      '接收的config信息',
      data.msgData,
      componentsList.value[selectIndex.value]
    );
    // 平图文组件特殊处理
    if (componentsList.value[selectIndex.value]?.name === 'SpliceImageText') {
      const { mainTitle, configValue1, configValue2 } = data.msgData;
      componentsList.value[selectIndex.value].mainTitle = mainTitle;
      componentsList.value[selectIndex.value].configValue1 = configValue1;
      componentsList.value[selectIndex.value].configValue2 = configValue2;
      return;
    }
    if (data.type) {
      // 对象类型的配置项
      componentsList.value[selectIndex.value].configValue = { ...data.msgData };
    } else {
      // 数组类型的配置项
      componentsList.value[selectIndex.value].mainTitle =
        data.msgData.mainTitle;
      componentsList.value[selectIndex.value].configValue = [
        ...data.msgData.list,
      ];
    }
  });
  openType.value = parseInt(`${route.query.type}`, 10);
  console.log('1111111111111111');
  if (openType.value !== ChannelType.PLATFORM_PRODUCT_DETAIL) {
    // 非商品详情装修的情况
    getNavData(openType.value);
  } else {
    // 商品详情装修的情况，注意监听时机，如果监听晚于发送可能收不到
    // broadcastChannel.addEventListener('message', (event) => {
    //   const { name, data } = JSON.parse(event.data);
    //   if (name === 'product_detail') {
    //     console.log('商品详情装修数据', data);
    //     componentsList.value = JSON.parse(data);
    //   }
    // });
    proId.value = `pro_${route.query.pro_id}`;
    const storage = localStorage.getItem(proId.value);
    if (storage) {
      const { data } = JSON.parse(storage);
      if (data) {
        componentsList.value = JSON.parse(data);
      }
    }
  }
  console.log('2222222222222222222');
  apiGetIsFirstUseDecoration().then((res: any) => {
    if (!res) {
      console.log('第一次使用装修', res);
      isFirstUse.value = true;
      firstFlicker();
    }
  });
});

onBeforeUnmount(() => {
  // 释放资源
  window.removeEventListener('beforeunload', (event) => {});
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
    z-index: 9999;
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
    z-index: 9999;
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
  left: 42%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 104px;
  height: 24px;
  margin-top: 4px;
  cursor: pointer;
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
