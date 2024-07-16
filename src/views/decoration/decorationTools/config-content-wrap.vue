<!-- config-content.vue -->
<template>
  <div class="component-config">
    <component
      :is="ComponentsMap[data?.name]?.uiConfig()"
      ref="formComponentRef"
      :data="data"
    ></component>
    <!-- <div v-if="data" class="btn-group">
      <t-space :size="60">
        <t-button type="primary" @click="clickConfirm">保存</t-button>
      </t-space>
    </div> -->
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
} from 'vue';
import ComponentsMap from '@/views/decoration/decorationTools/config/components-map';
import eventBus from '@/utils/bus';

const data = ref();
const formComponentRef = ref();
// 配置项是list的组件
const listType = ['VerticalImageText', 'ThreeImageText', 'LeftRightImageText'];

watch(
  () => formComponentRef?.value?.form,
  (val: any) => {
    // 实时监测form数据变化
    if (val) {
      console.log('form配置数据变化：', val, data.value.name);
      eventBus.emit('config-event', {
        type: !listType.includes(data.value.name),
        msgData: formComponentRef.value.form,
      });
    }
  },
  { deep: true }
);

// 接收bus事件
const handleMyEvent = (payload: any) => {
  console.log('配置内容组件接收到事件:', payload);
  data.value = payload;
};

onMounted(() => {
  eventBus.on('selectComponent', handleMyEvent);
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
