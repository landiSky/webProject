<!-- 只解析预览json数据 -->
<template>
  <div
    class="page-box"
    :style="{
      width: '100%',
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
          :disabled="true"
          :group="{ name: 'vehicle-station' }"
          :list="componentsList"
        >
          <template #item="{ element, index }">
            <transition name="el-fade-in-linear">
              <div v-show="true">
                <ViewComponentWrap
                  :ref="(el: any) => { setItemRef(el, index)}"
                  :is-preview="true"
                  :data="{ ...element, productId }"
                  :component-index="index"
                  :component-style="bgStyle(index)"
                  @select="selectComponent"
                ></ViewComponentWrap>
              </div>
            </transition>
          </template>
        </draggable>
      </t-layout-content>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import draggable from 'vuedraggable';
import { useRoute } from 'vue-router';
import ViewComponentWrap from './view-component-wrap.vue';

const props = defineProps({
  componentsList: {
    type: Array,
    default: () => [],
  },
  productId: {
    type: String,
    default: () => '',
  },
});

const route = useRoute();

// const componentsList = ref<any[]>([]);

const selectIndex = ref(-1);

const viewComponentWrapRef = ref<any[]>([]);

watch(
  () => props.componentsList,
  (val: any) => {
    console.log('watch componentsList:', val);
    console.log('watch productid:', props);
  },
  {
    deep: true,
    immediate: true,
  }
);

// 处理背景色的字符串，1-非渐变色，就返回一个颜色值，2-渐变色，切割为两个颜色值
function handleBgColor(color: string) {
  if (!color) {
    return ['#ffffff'];
  }
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
  const colorList = handleBgColor(
    (props.componentsList[index] as any).bgColor ?? ''
  );
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

// 动态设置组件的ref
const setItemRef = (el: any, index: number) => {
  if (el) {
    viewComponentWrapRef.value[index] = el;
  }
};

// 选中组件回调
const selectComponent = (index: number) => {
  console.log('点击选择组件返回:', index);
  // linkType :0-链接（点击跳转链接），1-产品（点击跳到搜索产品结果页）
  const type = (props.componentsList[index] as any).value?.linkType;
  if (type === 0) {
    window.open((props.componentsList[index] as any).value?.linkUrl, '_blank');
  } else if (type === 1) {
    // 跳转到搜索产品结果页
    console.log('跳转到搜索产品结果页');
  }
};

onMounted(() => {
  //   // 从后台获取json数据
  //   const localStorageData = localStorage.getItem('componentsList');
  //   if (localStorageData) {
  //     componentsList.value = JSON.parse(localStorageData);
  //     console.log('获得的json数据:', componentsList.value);
  //   }
});
</script>

<style scoped lang="less">
.page-box {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // overflow-y: auto;
  // background-color: #981313;
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
