<!-- config-content.vue -->
<template>
  <div class="component-config">
    <component
      :is="ComponentsMap[data?.name]?.uiConfig()"
      ref="formComponentRef"
      :data="data"
      :goods-list="goodsList"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watch,
  ref,
  onUnmounted,
} from 'vue';
import ComponentsMap from '@/views/decoration/decorationTools/config/components-map';
import eventBus from '@/utils/bus';
import { apiGetProductList } from '@/api/decoration/decoration-tools';

type GoodsItem = {
  name: string;
  id: string;
};
const data = ref();
const goodsList = ref<GoodsItem[]>([]);
const formComponentRef = ref();
// 配置项是list的组件
const listType = [
  'VerticalImageText',
  'ThreeImageText',
  'MultiImageText',
  'HerizontalImageText',
  'IconImageText',
  'LeftRightImageText',
  'CarouselImageText',
  'ImageOverlapText',
];

watch(
  () => formComponentRef?.value?.form,
  (val: any) => {
    // 实时监测form数据变化
    if (val) {
      console.log('form配置数据变化：', val, data.value.name);
      // formComponentRef.value.validate();
      eventBus.emit('config-event', {
        type: !listType.includes(data.value.name),
        msgData: formComponentRef.value.form,
      });
    }
  },
  { deep: true }
);

const getGoodsList = () => {
  apiGetProductList().then((res: any) => {
    goodsList.value = res;
  });
};

// 接收bus事件
const handleMyEvent = (payload: any) => {
  console.log('收到配置消息', payload);
  data.value = payload || {};
  getGoodsList();
};

onMounted(() => {
  eventBus.on('selectComponent', handleMyEvent);
});
onUnmounted(() => {
  // 组件销毁时，移除监听
  eventBus.off('selectComponent');
});
</script>

<style scoped lang="less">
.component-config {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  .btn-group {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    // position: absolute;
    // bottom: 0;
    // right: 0;
    height: 50px;
    border-top: 1px solid #e5e8ef;
  }
}
</style>
