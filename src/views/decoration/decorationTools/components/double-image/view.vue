<!-- 双图 -->
<template>
  <div class="double-image-box" :class="{ 'is-preview': isPreview }">
    <div class="double-image-title">{{
      getInterceptString(data?.mainTitle, 20) || '主标题'
    }}</div>
    <div class="image-box">
      <div
        v-for="(item, index) in data?.configValue"
        :key="index"
        class="image-item"
      >
        <div class="image-title">{{
          getInterceptString(item?.title, 30) || '子标题'
        }}</div>
        <t-image
          :src="`/server/web/file/download?name=${item?.src}&productId=${
            data?.productId || ''
          }`"
          :preview="false"
          class="image-hover"
          :class="{ 'mouse-cursor': data?.configValue?.linkType != 2 }"
          @click="
            clickLink(data?.configValue?.linkType, data?.configValue?.linkUrl)
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, watch } from 'vue';
import { getInterceptString } from '@/utils';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});
const { data, isPreview } = toRefs(props);
const letterReg = /^[a-zA-Z\u4e00-\u9fa5]+$/;

const emit = defineEmits(['golink']);
const clickLink = (type: number, url: string) => {
  emit('golink', { type, url });
};

watch(
  () => props.data,
  (val: any) => {
    console.log('vertical image data', val);
  },
  { immediate: true, deep: true }
);

// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});
const checkConfigList = (list: any) => {
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    return (
      item.title &&
      item.title.length <= 30 &&
      letterReg.test(item.title) &&
      item.src &&
      (item.linkType === 2 ||
        (item.linkType !== 2 && item.linkUrl && item.linkUrl.length <= 500))
    );
  });
};

const validate = () => {
  return new Promise((resolve, reject) => {
    if (
      // 可能需要完善校验逻辑
      !data?.value?.mainTitle ||
      !letterReg.test(data?.value?.mainTitle) ||
      data?.value?.mainTitle.length > 20 ||
      !checkConfigList(Object.values(data?.value?.configValue))
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

.double-image-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: calc(@factor * 327px);
  //color: #ffffff;
  .double-image-title {
    width: calc(@factor * 720px);
    height: calc(@factor * 52px);
    padding: calc(@factor * 24px) 0 calc(@factor * 12px) 0;
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
    //当文本溢出容器时，在文本末尾显示省略号（...）
    text-overflow: ellipsis;
    // background-color: red;
  }

  .image-box {
    display: flex;
    gap: 30px;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(@factor * 275px);
    padding: calc(@factor * 12px) calc(@factor * 60px) calc(@factor * 24px)
      calc(@factor * 60px);

    .image-item {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: calc(@factor * 8px);
      width: calc(@factor * 292.5px);
      height: calc(@factor * 239px);
      //margin: calc(@factor * 10px) calc(@factor * 7px) calc(@factor * 20px);
      border-radius: 6px;

      .image-title {
        color: #1d2129;
        font-weight: 400;
        font-size: calc(@factor * 8px);
        text-align: left;
        text-overflow: ellipsis;
      }

      .image-hover:hover {
        box-shadow: 6px 6px 20px 2px #7e7e7e40;
        transform: scale(1.05);
        transition: 0.5s;
      }
    }
  }
}

::v-deep(.tele-image) {
  .tele-image-img {
    //width: calc(@factor * 290px) !important;
    width: 100% !important;
    height: calc(@factor * 219px) !important;
    object-fit: cover !important;
    border-radius: 6px;
  }
}
// .is-preview {
//   transform: scale(2); /* 将元素的尺寸放大2倍 */
//   transform-origin: center center; /* 设置缩放中心点 */
// }
.mouse-cursor {
  cursor: pointer;
}
</style>
