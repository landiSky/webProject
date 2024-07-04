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
      :is="ComponentsMap[data?.name]?.view()"
      ref="viewComponentRef"
      :data="data?.value"
      :is-preview="isPreview"
      :bg-color="data?.bgColor"
      :style="componentStyle"
      @click="clickComponent"
    ></component>

    <!-- <t-drawer
      :width="600"
      :visible="visible"
      unmount-on-close
      @ok="clickConfirm"
      @cancel="clickClose"
    >
      <template #title> {{ data?.name }} </template>
      <div class="form-component-popover">
        <component
          :is="ComponentsMap[data?.name].uiConfig()"
          ref="formComponentRef"
          :data="data?.value"
        ></component>
      </div>
    </t-drawer> -->
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  computed,
  defineAsyncComponent,
  onMounted,
  watch,
} from 'vue';
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

const visible = computed(() => {
  return (
    componentIndex?.value === selectComponentIndex?.value && drawerVisible.value
  );
});

const formComponentRef = ref();

const viewComponentRef = ref();

const validateError = ref(false);

// 需要加载的组件集合
// const components = ref(new Map<string, any>());
// components.value.set(
//   'SingleImage',
//   defineAsyncComponent(() => import('./components/single-image/view.vue'))
// );

// const componentsConfig = ref(new Map<string, any>());

// componentsConfig.value.set(
//   'SingleImageConfig',
//   defineAsyncComponent(() => import('./components/single-image/ui-config.vue'))
// );

// const getConfig = (name: string) => {
//   defineAsyncComponent(() => import(name));
// };

const clickConfirm = () => {
  console.log(
    '点击保存按钮：',
    formComponentRef.value,
    formComponentRef.value.form.title
  );

  formComponentRef.value.formRef.validate((valid: any) => {
    if (!valid) {
      emit('confirm', formComponentRef.value.form);
      drawerVisible.value = false;
    }
  });
};

const clickClose = () => {
  drawerVisible.value = false;
  emit('close');
};

const clickComponent = () => {
  console.log('选中组件:', isPreview.value);
  validateError.value = false;
  // if (isPreview.value) return;
  emit('select', componentIndex?.value);
  // drawerVisible.value = true;
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
onMounted(() => {
  // console.log('data==', data);
});

// watch(
//   () => data,
//   (val) => {
//     console.log('data11==', val);
//   },
//   { deep: true, immediate: true }
// );

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
  // height: 400px;
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
