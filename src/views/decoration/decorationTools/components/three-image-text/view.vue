<!-- 竖图文 -->
<template>
  <div class="vertical-image-text-box" :class="{ 'is-preview': isPreview }">
    <div class="vertical-image-text-title">{{
      data?.mainTitle || '主标题'
    }}</div>
    <div class="image-box">
      <div
        v-for="(item, index) in data?.configValue"
        :key="index"
        class="image-item"
      >
        <img :src="item?.src" fit="cover" :preview="false" class="image-cls" />
        <div class="image-item-content">
          <span class="image-title">{{ item?.title || '小标题' }}</span>
          <span class="image-desc">{{ item?.desc || '图片简介' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, watch } from 'vue';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});

const { data, isPreview } = toRefs(props);

const clickLink = (type: number, url: string) => {
  if (type === 0) {
    // 外部链接
    window.open(url);
  } else if (type === 1) {
    // TODO: 商品搜索页
  }
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
const checkConfigList = (list: []) => {
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    console.log('竖图遍历', item);
    return (
      !item.title ||
      !item.desc ||
      !item.src ||
      (item.linkType === 2 && !item.linkUrl)
    );
  });
};

const validate = () => {
  return new Promise((resolve, reject) => {
    if (
      // 可能需要完善校验逻辑
      !data?.value?.mainTitle ||
      checkConfigList(data?.value?.configValue.value)
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

.vertical-image-text-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: calc(@factor * 720px);
  height: calc(@factor * 380px);

  .vertical-image-text-title {
    width: calc(@factor * 600px);
    margin: calc(@factor * 29px) 0;
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 18px);
  }

  .image-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    // height: calc(@factor * 256px);
    // margin-top: calc(@factor * 29px);
    // background-color: red;
    .image-item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: calc(@factor * 190px);
      height: calc(@factor * 256px);
      margin: 0 calc(@factor * 7px);
      border-radius: 6px;

      .image-cls {
        width: 100%;
        height: calc(@factor * 114px);
        border-radius: 6px;
      }

      .image-item-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        height: calc(@factor * 162px);
        margin-top: -20px;
        padding: 12px;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 1), #eee);
        border-radius: 6px;

        .image-title {
          color: #1d2129;
          font-weight: 500;
          font-size: calc(@factor * 8px);
        }

        .image-desc {
          display: -webkit-box;
          width: 100%;
          margin: 10px 0;
          overflow: hidden;
          color: #4e5969;
          font-size: calc(@factor * 7px);
          white-space: normal;
          text-align: left;
          text-overflow: ellipsis;
          word-wrap: break-word;
          -webkit-line-clamp: 7;
          -webkit-box-orient: vertical;
        }
      }
    }

    .image-item:hover {
      box-shadow: 6px 6px 20px 2px #7e7e7e40;
      transform: scale(1.05);
      transition: 0.5s;
    }
  }
}
// .is-preview {
//   transform: scale(2); /* 将元素的尺寸放大2倍 */
//   transform-origin: center center; /* 设置缩放中心点 */
// }
</style>
