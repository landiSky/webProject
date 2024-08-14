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
      :id="uid"
      ref="viewComponentRef"
      :data="data"
      :is-preview="isPreview"
      :bg-color="data?.bgColor"
      :style="componentStyle"
      @golink="linked"
      @click.stop="clickComponent"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted } from 'vue';
import ComponentsMap from '@/views/decoration/decorationTools/config/components-map';
import { useRouter } from 'vue-router';
import { Message } from '@tele-design/web-vue';
import { apiProductDetail } from '@/api/wow/mall';

const router = useRouter();
const emit = defineEmits(['confirm', 'close', 'select']);

const props = defineProps({
  data: Object,
  componentStyle: Object,
  componentIndex: Number,
  selectComponentIndex: Number,
  isPreview: Boolean,
  isClick: Boolean,
  uid: String,
});

const { data, componentIndex, selectComponentIndex, isPreview, isClick, uid } =
  toRefs(props);

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
// 统一处理链接点击事件
const linked = (data: any) => {
  console.log(isPreview.value, isClick.value);
  if (!isPreview.value || isClick.value) return;
  const { type, url } = data;
  if (type === 0) {
    // 外部链接
    window.open(url);
  } else if (type === 1) {
    console.log('商品链接点击', url);
    apiProductDetail({ id: url }).then((res: any) => {
      if (Number(res?.status) !== 1) {
        Message.warning('该商品已下架，无法进行查看');
        return;
      }
      router.push({
        name: 'wowMallDetail',
        params: { id: url },
      });
    });
  }
};
onMounted(() => {
  console.log('渲染组件:', props?.data);
});

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
    z-index: 2;
    box-sizing: border-box;
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
