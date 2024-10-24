<template>
  <!-- 组件装修区域 -->
  <div
    class="page-editor"
    :class="{ blueBorder: flickering }"
    :style="{
      width: isPreview ? '100vw' : '722px',
    }"
  >
    <div
      v-if="openType === String(ChannelType.PLATFORM_PRODUCT_DETAIL)"
      class="product-bg"
    >
      <div class="product-text"></div>
    </div>
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
          filter=".unmover"
          :prevent-on-filter="false"
          :force-fallback="true"
          :scroll="true"
          :disabled="isPreview"
          :group="{ name: 'vehicle-station' }"
          :list="toolList"
          :move="onMove"
          @end="endSort"
          @add="insertSort"
        >
          <template #item="{ element, index }">
            <transition
              name="el-fade-in-linear"
              :class="{
                unmover:
                  element === 'ChannelHeader' || element === 'HomeHeader',
              }"
            >
              <div v-show="true">
                <ViewComponentWrap
                  :ref="(el: any) => { setItemRef(el, index)}"
                  :is-preview="isPreview"
                  :is-click="isClick"
                  :data="componentsList[index]"
                  :component-index="index"
                  :component-style="bgStyle(index)"
                  :select-component-index="selectIndex"
                  @select="selectComponent"
                  @close="close"
                ></ViewComponentWrap>
                <t-space
                  v-if="
                    selectIndex === index &&
                    !isPreview &&
                    element !== 'HomeHeader' &&
                    element !== 'ChannelHeader'
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
    <!-- 预览，保存，发布 按钮框
     openModel为0 是编辑模式，1为预览模式 -->
    <div v-if="openModel === 0" class="floating_btn-box">
      <!-- <t-space size="large" class="icons-container">
        <div class="icon-text-container" @click="controlPreview">
          <icon-eye v-if="!isPreview" :size="24" />
          <icon-eye-invisible v-if="isPreview" :size="24" />
          <span style="font-size: 12px">预览</span>
        </div>
        <div class="icon-text-container" @click="clickSave">
          <iconpark-icon name="saveLocal" :size="24" />
          <span style="font-size: 12px">保存</span>
        </div>
        <div class="icon-text-container" @click="clickSaveRemote">
          <iconpark-icon name="saveRemote" :size="24" />
          <span style="font-size: 12px">发布</span>
        </div>
      </t-space> -->
      <t-space size="small" class="icons-container">
        <t-button class="icon-text-container" @click="controlPreview">
          <template #icon>
            <icon-eye v-if="!isPreview" :size="24" />
            <icon-eye-invisible v-if="isPreview" :size="24" />
          </template>
          <template #default> {{ isPreview ? '取消预览' : '预览' }}</template>
        </t-button>
        <t-button class="icon-text-container" @click="clickSave">
          <template #icon>
            <iconpark-icon name="saveLocal" :size="24" />
          </template>
          <template #default>保存</template>
        </t-button>
        <t-button class="icon-text-container" @click="clickSaveRemote">
          <template #icon>
            <iconpark-icon name="saveRemote" :size="24" />
          </template>
          <template #default>发布</template>
        </t-button>
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
import ViewComponentWrap from './view-component-wrap.vue';
import { channelName, LinkType } from './constant';
import { ToolData, tools, toolsGroup } from './config/tools';

const broadcastChannel = new BroadcastChannel(channelName);
const route = useRoute();
const router = useRouter();
const componentsList = ref<any[]>([]);
const toolList = ref<any[]>([]);
const selectIndex = ref(-1);

const isPreview = ref(false);
const isClick = ref(false);

// 是否是第一次使用
const isFirstUse = ref(false);

const flickering = ref(false);

// 定时器
const timer = ref();

const viewComponentWrapRef = ref<any[]>([]);

const colorIndex = ref(-1);

const decorationJson = ref('');

const openType = ref();

const interceptFlag = ref(false);

const proId = ref('');

// 首页顶部组件
const homeHeader = {
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
      linkType: LinkType.BLANK,
      linkUrl: '',
    },
    {
      title: '小标题',
      desc: '图片描述',
      src: '',
      linkType: LinkType.BLANK,
      linkUrl: '',
    },
    {
      title: '小标题',
      desc: '图片描述',
      src: '',
      linkType: LinkType.BLANK,
      linkUrl: '',
    },
    {
      title: '小标题',
      desc: '图片描述',
      src: '',
      linkType: LinkType.BLANK,
      linkUrl: '',
    },
  ],
};
// 频道页头部组件
const channelHeader = {
  chineseName: '频道页头图',
  maxNum: 3,
  name: 'ChannelHeader',
  mainTitle: '我是主标题',
  configValue: {
    title: '标题',
    desc: '我是简介我是简介我是简介我是简介我是简介我是简介我是简介',
    src: '4e0c5c42-16ac-42b0-a462-672cdb540ffe.jpg',
    linkType: LinkType.BLANK,
    linkUrl: '',
  },
};

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
// const onEnd = (index: number) => {
//   selectIndex.value = index;
// };

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
  if (openType.value === String(ChannelType.PLATFORM_PRODUCT_DETAIL)) {
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
          console.log('平道页面保存成功', res);
          Message.success('保存成功');
          interceptFlag.value = false;
          // 通知主tab页刷新
          broadcastChannel.postMessage(
            JSON.stringify({ name: 'chnnelPageRefresh', data: '' })
          );
        });
      },

      onCancel: () => {},
    });
  }
};
// 保存组件列表的json数据到远程
const clickSaveRemote = () => {
  console.log('远端保存', viewComponentWrapRef.value);
  const childForm = () => {
    return viewComponentWrapRef.value.map((item: any) => {
      return item.validate();
    });
  };

  Promise.all(childForm())
    .then(() => {
      if (componentsList.value.length === 0) {
        Message.error('请先添加组件并配置完成再发布');
        return;
      }
      const { id } = route.query;
      const json = JSON.stringify(componentsList.value);
      // 分情况处理：普通渠道装修；商品详情装修
      if (openType.value === String(ChannelType.PLATFORM_PRODUCT_DETAIL)) {
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
    .catch((e) => {
      Message.error('未完成详情配置');
      console.log('未完成详情配置', e);
    });
};

const onMove = (event: any) => {
  console.log('onMove 事件', event);
  let res = true;
  if (
    event.relatedContext.element === 'ChannelHeader' ||
    event.relatedContext.element === 'HomeHeader'
  ) {
    res = false;
  }
  return res;
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
  // 内容交换
  componentsList.value[newIndex] = newIndexData;
  componentsList.value[oldIndex] = oldIndexData;
  // 选中一个组件并发送消息给配置区
  if (!isPreview.value) {
    selectIndex.value = oldIndex;
    eventBus.emit(
      'selectComponent',
      JSON.parse(JSON.stringify(componentsList.value[selectIndex.value]))
    );
  }
};

const insertSort = (event: any) => {
  let res = true;
  const { oldIndex, newIndex } = event; // oldIndex表示左侧装修组件的位置, newIndex-被拖拽区域的位置
  // todo
  selectIndex.value = newIndex;
  const componentName = toolsGroup[oldIndex].text || '';
  const addToolData = JSON.parse(JSON.stringify(ToolData[componentName]));
  componentsList.value.splice(newIndex, 0, addToolData);
  console.log(
    '----被拖拽区域收到新增组件事件 触发选中组件--：',
    event.newIndex,
    componentsList.value,
    toolList.value,
    oldIndex,
    newIndex
  );
  if (
    newIndex === 0 &&
    openType.value !== String(ChannelType.PLATFORM_PRODUCT_DETAIL)
  ) {
    res = false;
    componentsList.value.splice(newIndex, 1);
    toolList.value.splice(newIndex, 1);
    viewComponentWrapRef.value.splice(newIndex, 1);
    return res;
  }
  if (componentsList.value.length > 10) {
    // 此处 res 值没什么实际作用
    res = false;
    // 删除componentsList的第index个元素
    componentsList.value.splice(newIndex, 1);
    toolList.value.splice(newIndex, 1);
    viewComponentWrapRef.value.splice(newIndex, 1);
    Message.error('组件数量不能超过10个');
    console.log('触发选中组件--', componentsList.value, toolList.value);
    return res;
  }
  if (!isPreview.value) {
    eventBus.emit(
      'selectComponent',
      JSON.parse(JSON.stringify(componentsList.value[newIndex]))
    );
  }
  return res;
};

const close = () => {
  componentsList.value[selectIndex.value].visible = false;
};

const clickPreview = () => {
  isClick.value = true;
  isPreview.value = true;
  eventBus.emit('previewEvent', true);
};

const notPreview = () => {
  isClick.value = true;
  isPreview.value = false;
  eventBus.emit('previewEvent', false);
};

const controlPreview = () => {
  if (isPreview.value === false) {
    clickPreview();
  } else if (isPreview.value === true) {
    notPreview();
  }
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
  isClick.value = true;
  isPreview.value = false;
  eventBus.emit('previewEvent', false);
};

watch(
  () => route.query.model,
  (nV) => {
    openModel.value = parseInt(`${nV}`, 10);
    isClick.value = true;
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
    console.log('watchwatch', type);
    openType.value = type;
    if (openType.value === String(ChannelType.PLATFORM_PRODUCT_DETAIL)) {
      // interceptFlag.value = false;
    } else {
      // interceptFlag.value = true;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

// 数组插入第一个元素--homeheader
const insertFirst = (type: any) => {
  console.log('insertFirst', type);
  // 首页
  if (type === String(ChannelType.PLATFORM_HOME)) {
    if (componentsList.value[0]?.name !== 'HomeHeader') {
      toolList.value.unshift('HomeHeader');
      componentsList.value.unshift(homeHeader);
    }
  } else if (
    type !== String(ChannelType.PLATFORM_HOME) &&
    type !== String(ChannelType.PLATFORM_PRODUCT_DETAIL)
  ) {
    if (componentsList.value[0]?.name !== 'ChannelHeader') {
      toolList.value.unshift('ChannelHeader');
      componentsList.value.unshift(channelHeader);
    }
  }
};

const getNavData = (type: number) => {
  apiGetNavData({ id: type })
    .then((res: any) => {
      // decorationJson.value = res.data[0].detail;
      const { status, detail, draftDetail } = res.data[0] || {};
      console.log('getNavDatagetNavDatagetNavData', res.data);
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
      insertFirst(type);
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
  (vn, vo = 0) => {
    if (isFirstUse.value && vn > 0) {
      secondFlicker();
    }
    // vn vo 差的绝对值==1
    if (Math.abs(vn - vo) === 1) {
      interceptFlag.value = true;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  eventBus.emit('updateNavData');
  // 二次弹框不能定制，只有系统弹框
  window.addEventListener('beforeunload', (event) => {
    componentsList.value = [...componentsList.value];
    if (interceptFlag.value) {
      console.log('有装修数据，是否确认离开？');
      event.preventDefault();
    }
  });
  // config-event
  eventBus.on('configEvent', (data: any) => {
    const jsonData = JSON.parse(JSON.stringify(data));
    // 拼图文组件特殊处理
    if (componentsList.value[selectIndex.value]?.name === 'SpliceImageText') {
      const { mainTitle, configValue1, configValue2 } = jsonData.msgData;
      (componentsList.value[selectIndex.value] || {}).mainTitle = mainTitle;
      (componentsList.value[selectIndex.value] || {}).configValue1 =
        configValue1;
      (componentsList.value[selectIndex.value] || {}).configValue2 =
        configValue2;
      return;
    }
    // 开始赋值
    console.log('接收的数据', jsonData.msgData);
    if (jsonData.type) {
      // 对象类型的配置项
      const { mainTitle, ...objData } = jsonData.msgData;
      componentsList.value[selectIndex.value].mainTitle = mainTitle;
      componentsList.value[selectIndex.value].configValue = objData;
    } else {
      // 数组类型的配置项
      componentsList.value[selectIndex.value].mainTitle =
        jsonData.msgData.mainTitle;
      componentsList.value[selectIndex.value].configValue = [
        ...jsonData.msgData.list,
      ];
    }
    console.log(
      'index接收的配置区域信息',
      JSON.parse(JSON.stringify(componentsList.value))
    );
  });
  // openType.value = parseInt(`${route.query.type}`, 10);
  console.log('openType.value', openType.value);
  if (openType.value !== String(ChannelType.PLATFORM_PRODUCT_DETAIL)) {
    // 非商品详情装修的情况
    getNavData(openType.value);
  } else {
    const { proId } = route.query;
    if (proId) {
      // goodsDetail(`${proId}`).then((res) => {
      const res = JSON.parse(localStorage.getItem('goodsDetail') || '{}');
      console.log('res', res);
      const { draftStatus, draftDetail, detail, versionType } = res;
      /* 这里把装修视图的版本判断去掉了，因为一旦进入装修页面就代表是走的装修数据 */
      // if (versionType === 1) {
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
      // }
      // 兼容老版本走装修
      // else if (versionType === 0 && draftStatus !== null) {
      //   if (draftStatus === 0) {
      //     // 草稿状态
      //     if (!draftDetail) return;
      //     componentsList.value = JSON.parse(draftDetail);
      //     toolList.value = componentsList.value.map((item) => {
      //       return item.name;
      //     });
      //   } else {
      //     // 发布状态
      //     if (!detail) return;
      //     componentsList.value = JSON.parse(detail);
      //     toolList.value = componentsList.value.map((item) => {
      //       return item.name;
      //     });
      //   }
      // }
      // else {
      // 旧版数据丢弃
      // }
      // });
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
        // 成功
        Message.success(msg);
        interceptFlag.value = false;
        setTimeout(() => {
          if (msg === '发布成功') {
            window.close();
          }
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
  margin: 0 auto;
  // overflow-y: auto;
  // background-color: #981313;
  .product-bg {
    position: relative;
    width: 100%;
    height: calc(@factor * 280px);
    background: url(../../../assets/images/wow/mall/mall-bg.jpg);
    background-repeat: no-repeat;
    background-size: cover;

    .product-text {
      position: absolute;
      top: 10%;
      left: 15%;
      width: calc(@factor * 228px);
      height: calc(@factor * 220px);
      background: url(../../../assets/images/decoration/pro-txt.png);
      background-repeat: no-repeat;
      background-size: cover;
    }
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
    bottom: 10px;
    left: auto;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 40px;
    background-color: white;
    border-radius: 2px;
    cursor: pointer;

    .icons-container {
      .icon-text-container {
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: center;
        min-width: 76px;
        height: 36px;
        padding: 6px 12px 6px 12px;
        background: #f2f3f8;
        border-radius: 2px 0 0 0;
      }
    }
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

  :deep(.tele-btn-size-medium:not(.tele-btn-only-icon) .tele-btn-icon) {
    margin-right: 0;
    margin-bottom: -4px;
    padding-bottom: 0;
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
  // left: 50%;
  right: 0;
  z-index: 1000;
  display: flex;
  height: 24px;
  margin-top: 2px;
  margin-right: 2px;
  // transform: translateX(-50%);
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
