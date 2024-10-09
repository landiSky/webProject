<template>
  <div class="single-image">
    <div class="single-image-title">{{ data?.mainTitle || '主标题' }}</div>
    <t-image
      :src="`/server/web/file/download?name=${
        data?.configValue?.src
      }&productId=${data?.productId || ''}`"
      :preview="false"
      class="image-box"
      :class="{ 'mouse-cursor': data?.configValue?.linkType != 2 }"
      @click="
        clickLink(data?.configValue?.linkType, data?.configValue?.linkUrl)
      "
    ></t-image>
    <div class="single-image-desc">{{
      data?.configValue?.desc ||
      '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是'
    }}</div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});

const { data, isPreview } = toRefs(props);
const emit = defineEmits(['golink']);
const clickLink = (type: number, url: string) => {
  emit('golink', { type, url });
};

// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});

const validate = () => {
  return new Promise((resolve, reject) => {
    if (
      // TODO 可能需要完善校验逻辑
      !data?.value?.mainTitle ||
      data?.value?.mainTitle.length > 20 ||
      !data?.value?.configValue?.desc ||
      data?.value?.configValue?.desc.length > 60 ||
      ((!data?.value?.configValue?.linkUrl ||
        data?.value?.configValue?.linkUrl.length > 500) &&
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
  width: 100%;
  padding-bottom: calc(@factor * 20px);

  .single-image-title {
    width: calc(@factor * 720px);
    margin: calc(@factor * 20px) 0 calc(@factor * 10px);
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
    // background-color: red;
  }

  .image-box {
    margin-top: calc(@factor * 10px);
  }

  .image-box:hover {
    z-index: 2;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    transform: scale(1.01);
    transition: transform 0.5s, box-shadow 0.5s;
  }

  .single-image-desc {
    display: -webkit-box;
    width: calc(@factor * 600px);
    margin-top: calc(@factor * 9px);
    padding: 0 calc(@factor * 12px);
    overflow: hidden;
    color: #4e5969;
    font-weight: 500;
    font-size: calc(@factor * 8px);
    line-height: calc(@factor * 12px);
    white-space: normal;
    text-align: left;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

// .single-image:hover {
//   z-index: 2;
//   box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
//   transform: scale(1.02); /* 放大到原来的110% */
//   transition: transform 0.5s, box-shadow 0.5s;
// }
::v-deep(.tele-image) {
  .tele-image-img {
    width: calc(@factor * 600px) !important;
    height: calc(@factor * 260px) !important;
    object-fit: cover !important;
  }
}

.mouse-cursor {
  cursor: pointer;
}
</style>
