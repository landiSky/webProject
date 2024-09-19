<template>
  <div
    class="tele-upload-picture-card picture-card-container"
    @click="onButtonClick"
  >
    <div class="tele-upload-picture-card-text" style="cursor: pointer">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        class="tele-icon tele-icon-plus"
        stroke-width="4"
        stroke-linecap="butt"
        stroke-linejoin="miter"
      >
        <path d="M5 24h38M24 5v38"></path>
      </svg>
      <div style="margin-top: 10px; font-weight: 500; font-size: 12px"
        >点击上传</div
      >
    </div>
  </div>

  <t-upload
    v-if="previewList.length"
    list-type="text"
    action="/"
    :default-file-list="fileList"
    image-preview
    :limit="1"
    :on-button-click="onButtonClick"
  >
  </t-upload>
  <Source
    v-if="showSource"
    :visible="showSource"
    :confirm-loading="confirmLoading"
    title="应用图标"
    :picture-width="props?.pictureWidth"
    :picture-height="props?.pictureHeight"
    @on-confirm="onConfirm"
    @on-cancel="onCancel"
  />
</template>

<script lang="ts" setup>
import { ref, defineEmits, defineProps } from 'vue';
import { fetchClassList } from '@/api/goods-manage';
import Source from './components/source.vue';

const emits = defineEmits(['onConfirm']);
const props = defineProps({
  pictureWidth: {
    type: Number,
    default: 144,
  },
  pictureHeight: {
    type: Number,
    default: 144,
  },
});
const showSource = ref(false);

const previewList = ref([]);

const confirmLoading = ref(false);

const fileList = ref([
  {
    uid: '-2',
    name: '20200717-103937.png',
    url: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
  },
]);

const onButtonClick = () => {
  console.log('onButtonClick');
  showSource.value = true;
  return false;
  // showSource.value = true;
};

// 成功
const onConfirm = (value: object) => {
  console.log('last onConfirm', value);
  emits('onConfirm', value);
  showSource.value = false;
};

const onCancel = () => {
  showSource.value = false;
};
</script>

<style scoped lang="less">
.tele-upload-picture-card {
  width: 100px;
  height: 100px;
}
</style>
