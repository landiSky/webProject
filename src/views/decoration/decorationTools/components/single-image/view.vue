<template>
  <div class="single-image">
    <div class="single-image-title">{{
      data?.configValue?.title || '主标题'
    }}</div>
    <t-image
      :src="`/server/web/file/download?name=${data?.configValue?.src}`"
      :preview="false"
      style="cursor: pointer"
      @click="
        clickLink(data?.configValue?.linkType, data?.configValue?.linkUrl)
      "
    ></t-image>
    <div class="single-image-desc">{{
      data?.configValue?.desc || '图片描述'
    }}</div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref } from 'vue';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});

const { data, isPreview } = toRefs(props);
const emit = defineEmits(['golink']);
const clickLink = (type: number, url: string) => {
  emit('golink', { type, url });
};

const imageBoxW = computed(() => {
  return isPreview.value ? 1200 : 600;
});

const imageBoxH = computed(() => {
  return isPreview.value ? 520 : 260;
});
// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});
const validate = () => {
  return new Promise((resolve, reject) => {
    if (
      // TODO 可能需要完善校验逻辑
      !data?.value?.configValue?.title ||
      !data?.value?.configValue?.desc ||
      (!data?.value?.configValue?.linkUrl &&
        data?.value?.configValue?.linkType !== 2)
    ) {
      return reject();
    }
    return resolve('');
  });
};

defineExpose({
  validate,
});
</script>

<style scoped lang="less">
@factor: v-bind(num);

.single-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: calc(@factor * 720px);
  height: calc(@factor * 415px);

  .single-image-title {
    width: calc(@factor * 600px);
    margin: calc(@factor * 29px) 0;
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 18px);
  }

  // .image-box {
  //   width: 600px;
  //   height: 260px;
  // }
  .single-image-desc {
    display: -webkit-box;
    width: calc(@factor * 600px);
    margin-top: calc(@factor * 9px);
    overflow: hidden;
    color: #4e5969;
    font-weight: 500;
    font-size: calc(@factor * 8px);
    white-space: normal;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

::v-deep(.tele-image) {
  .tele-image-img {
    width: calc(@factor * 600px) !important;
    height: calc(@factor * 260px) !important;
    object-fit: cover !important;
  }
}
// .is-preview {
//   transform: scale(2); /* 将元素的尺寸放大2倍 */
//   transform-origin: 0 0; /* 设置缩放中心点 */
// }
</style>
