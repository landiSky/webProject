<template>
  <div
    class="page-editor"
    :style="{
      width: isPreview ? '100%' : '720px',
    }"
  >
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
          @end="endSort"
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
                  @confirm="confirm"
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
                  <t-popover
                    trigger="click"
                    popup-container="select_config-box"
                  >
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
      <!-- <t-layout-sider style="width: 442px; overflow: hidden">
          <div class="component-config">
            <component
              :is="ComponentsMap[curSelectedComponent?.name]?.uiConfig()"
              ref="formComponentRef"
              :data="curSelectedComponent?.value"
            ></component>
          </div>
        </t-layout-sider> -->
      <!-- <t-layout-footer>Footer</t-layout-footer> -->
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
        <t-button type="primary" @click="publish">发布</t-button>
      </t-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import draggable from 'vuedraggable';
import eventBus from '@/utils/bus';
import { parseQuery, useRoute } from 'vue-router';
import ViewComponentWrap from './view-component-wrap.vue';

const route = useRoute();

const componentsList = ref<any[]>([]);

const selectIndex = ref(-1);

const isPreview = ref(false);

const viewComponentWrapRef = ref<any[]>([]);

const colorIndex = ref(-1);

// 打开模式 0-普通编辑模式 1-外部预览模式
const openModel = ref();

// 配置背景色列表（后续如果需要支持选中返显效果，需要给组件增加一个cssClass字段跟列表中的字段做匹配）
const colorList = ref([
  { cssClass: 'bg_color-1', color0: '#ffffff' },
  { cssClass: 'bg_color-2', color0: '#F5F6FB' },
  { cssClass: 'bg_color-3', color0: '#EBF0F4' },
  { cssClass: 'bg_color-4', color0: '#ffffff', color1: '#e2ecff' },
]);

watch(
  () => componentsList.value,
  (val: any) => {
    console.log('watch componentsList:', val);
  },
  {
    deep: true,
    immediate: true,
  }
);

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

// 设置组件背景样式
const bgStyle = (index: number) => {
  const colorList = handleBgColor(componentsList.value[index]?.bgColor);
  console.log(colorList, colorList);
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
  console.log('changeColor:', val, componentsList.value);
};

// 左侧工具栏拖入后在列表中的位置
const onEnd = (index: number) => {
  selectIndex.value = index;
  console.log('onEnd:', selectIndex.value);
};

// 移除当前组件
const deleteComponent = (index: number) => {
  componentsList.value.splice(index, 1);
  console.log('deleteComponent:', index);
};

// 复制当前组件，并插入到当前组件index后面
const copyComponent = (index: number) => {
  const component = componentsList.value[index];

  const firstHalf = componentsList.value.slice(0, index);
  const secondHalf = componentsList.value.slice(index);
  componentsList.value = [...firstHalf, component, ...secondHalf];
  selectIndex.value = index + 1;
  console.log('componentsList:', componentsList.value);
};

// 动态设置组件的ref
const setItemRef = (el: any, index: number) => {
  if (el) {
    viewComponentWrapRef.value[index] = el;
  }
};

// 保存组件列表的json数据到本地
const clickSave = () => {
  console.log('viewComponentWrapRef:', viewComponentWrapRef.value);
  const childForm = () => {
    return viewComponentWrapRef.value.map((item: any) => {
      return item.validate();
    });
  };
  Promise.all(childForm())
    .then((data: any) => {
      // 先清除本地存储
      // localStorage.removeItem('componentsList');
      localStorage.setItem(
        'componentsList',
        JSON.stringify(componentsList.value)
      );
      console.log('保存成功:', data);
    })
    .catch(() => {
      console.log('保存失败');
    });
};
// 保存组件列表的json数据到远程
const clickSaveRemote = () => {
  console.log('viewComponentWrapRef:', viewComponentWrapRef.value);
  const childForm = () => {
    return viewComponentWrapRef.value.map((item: any) => {
      return item.validate();
    });
  };
  Promise.all(childForm())
    .then((data: any) => {
      // TODO 远程保存接口
      console.log('保存成功:', data);
    })
    .catch(() => {
      console.log('保存失败111');
    });
};

// 从新排序
const endSort = () => {
  console.log('endSort0000:', componentsList.value);
  clickSave();
};
// 从配置抽屉返回的数据
const confirm = (data: any) => {
  componentsList.value[selectIndex.value].value = { ...data };
  console.log('配置完成:', selectIndex.value, data);
};

const close = () => {
  componentsList.value[selectIndex.value].visible = false;
};

// // 选中一个组件
// const clickViewComponent = (index: number) => {
//   console.log('clickViewComponent:', index);
//   selectIndex.value = index;
//   // componentsList.value[index].visible = !componentsList.value[index].visible;
//   console.log('componentsList.value:', componentsList.value);
// };

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
  console.log('selectComponent:', index);
  if (!isPreview.value) {
    eventBus.emit('selectComponent', componentsList.value[selectIndex.value]);
  } else {
    // linkType :0-链接（点击跳转链接），1-产品（点击跳到搜索产品结果页）
    console.log(
      '选中的组件:',
      componentsList.value[selectIndex.value].value?.linkType
    );
    const type = componentsList.value[selectIndex.value].value?.linkType;
    if (type === 0) {
      window.open(
        componentsList.value[selectIndex.value].value?.linkUrl,
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

// 发布
const publish = () => {
  // openModel.value = 0;
  // eventBus.emit('preview-event', false);
  // TODO 发布接口
};

// 接收bus事件
const handleMyEvent = (payload: any) => {
  console.log('handleMyEvent:', payload);
  selectIndex.value = payload;
};

watch(
  () => route.query.model,
  (nV) => {
    openModel.value = parseInt(`${nV}`, 10);
    if (openModel.value === 1) {
      isPreview.value = true;
      setTimeout(() => {
        eventBus.emit('preview-event', true);
      }, 200);
    }
  },
  { immediate: true }
);

onMounted(() => {
  eventBus.on('insertIndex', handleMyEvent);
  // config-event
  eventBus.on('config-event', (data: any) => {
    console.log('config-event:', data);
    componentsList.value[selectIndex.value].value = { ...data };
    console.log('配置完成:', selectIndex.value, data);
  });
  // 从后台获取json数据
  const localStorageData = localStorage.getItem('componentsList');
  if (localStorageData) {
    componentsList.value = JSON.parse(localStorageData);
    console.log('获得的json数据:', componentsList.value);
  }
});
</script>

<style scoped lang="less">
.page-editor {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // overflow-y: auto;
  // background-color: #981313;
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

.components-wrap {
  width: 100%;
  height: 100%;
}

.select_config-box {
  position: absolute;
  left: 42%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 104px;
  height: 24px;
  margin-top: 20px;
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
