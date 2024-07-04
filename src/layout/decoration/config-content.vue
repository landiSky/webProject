<!-- config-content.vue -->
<template>
  <div class="component-config">
    <component
      :is="ComponentsMap[data?.name]?.uiConfig()"
      ref="formComponentRef"
      :data="data"
    ></component>
    <div v-if="data" class="btn-group">
      <t-space :size="60">
        <!-- <t-button @click="$emit('cancel')">取消</t-button> -->
        <t-button type="primary" @click="clickConfirm">保存</t-button>
      </t-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  ref,
} from 'vue';
import ComponentsMap from '@/views/decoration/decorationTools/config/components-map';
import eventBus from '@/utils/bus';

const data = ref();
const formComponentRef = ref();
const clickConfirm = () => {
  console.log(
    '点击保存按钮：',
    formComponentRef.value,
    formComponentRef.value.form.title
  );

  // 不做校验，直接bus事件发出
  eventBus.emit('config-event', formComponentRef.value.form);

  //   formComponentRef.value.formRef.validate((valid: any) => {
  //     if (!valid) {
  //       emit('confirm', formComponentRef.value.form);
  //     }
  //   });
};

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
