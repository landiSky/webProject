<template>
  <div
    class="view-component-wrap-box"
    :class="{
      'active': componentIndex === selectComponentIndex && !isPreview,
      'is-preview': isPreview,
      'is-error': validateError,
    }"
  >
    <component
      :is="ComponentsMap[data?.name]?.view"
      ref="viewComponentRef"
      :data="data"
      :is-preview="isPreview"
      :bg-color="data?.bgColor"
      :style="componentStyle"
      @click.stop="clickComponent"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, onMounted } from 'vue';
import ComponentsMap from '@/views/decoration/decorationTools/config/components-map';

const emit = defineEmits(['confirm', 'close', 'select']);

const props = defineProps({
  data: Object,
  componentStyle: Object,
  componentIndex: Number,
  selectComponentIndex: Number,
  isPreview: Boolean,
});

const { data, componentIndex, selectComponentIndex, isPreview } = toRefs(props);

const drawerVisible = ref(false);

// const visible = computed(() => {
//   return (
//     componentIndex?.value === selectComponentIndex?.value && drawerVisible.value
//   );
// });

// const formComponentRef = ref();

const viewComponentRef = ref();

const validateError = ref(false);

// const clickConfirm = () => {
//   console.log(
//     '点击保存按钮：',
//     formComponentRef.value,
//     formComponentRef.value.form.title
//   );

//   formComponentRef.value.formRef.validate((valid: any) => {
//     if (!valid) {
//       emit('confirm', formComponentRef.value.form);
//       drawerVisible.value = false;
//     }
//   });
// };

// const clickClose = () => {
//   drawerVisible.value = false;
//   emit('close');
// };

const clickComponent = () => {
  console.log('选中组件:', componentIndex?.value);
  validateError.value = false;
  emit('select', componentIndex?.value);
};

const validate = () => {
  return new Promise((resolve, reject) => {
    viewComponentRef.value
      .validate()
      .then(() => {
        console.log('组件-校验成功');
        validateError.value = false;
        return resolve('');
      })
      .catch(() => {
        console.log('组件-校验失败');
        validateError.value = true;
        return reject();
      });
  });
};
onMounted(() => {});

defineExpose({
  drawerVisible,
  validate,
});
</script>

<style scoped lang="less">
.form-component-popover {
  padding-top: 20px;

  .tele-space-align-end {
    justify-content: flex-end;
  }
}

.view-component-wrap-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;

  &:hover {
    background-color: #f2f3f8;
  }

  &.active {
    border: 1px solid #1664ff;
  }

  &.is-error {
    border: 1px solid red;
  }

  &.is-preview {
    &:hover {
      background-color: transparent;
    }
  }
}
</style>
