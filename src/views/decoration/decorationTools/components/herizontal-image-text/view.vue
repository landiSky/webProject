<!-- 横图叠文 -->
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
        <t-image
          :src="`/server/web/file/download?name=${item?.src}&productId=${
            data?.productId || ''
          }`"
          :preview="false"
        />
        <div class="image-item-content">
          <span class="image-title">{{ item?.title || '小标题' }}</span>
          <span class="image-desc">{{
            item?.desc || '我是副标题我是副标题我是副标题我是副标题'
          }}</span>
          <span
            v-if="item?.linkType !== 2"
            class="image-link"
            @click="clickLink(item?.linkType, item?.linkUrl)"
            >查看详情>>
          </span>
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

const checkConfigList = (list: []) => {
  // console.log('checkConfigList', list);
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    console.log('竖图遍历', item);
    return (
      item.title &&
      item.title.length <= 8 &&
      item.desc &&
      item.desc.length <= 30 &&
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
      data?.value?.mainTitle.length > 20 ||
      !checkConfigList(data?.value?.configValue)
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
  width: 100%;
  // height: calc(@factor * 280px);
  .vertical-image-text-title {
    margin: calc(@factor * 20px) 0;
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
  }

  .image-box {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: calc(@factor * 20px);

    .image-item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: calc(@factor * 210px);
      height: calc(@factor * 121px);
      margin: 0 calc(@factor * 7px);

      .image-item-content {
        position: absolute;
        top: calc(@factor * 19px);
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: calc(@factor * 124px);
        padding: 0 calc(@factor * 12px);
        border-radius: 6px;

        .image-title {
          color: #1d2129;
          font-weight: 500;
          font-size: calc(@factor * 8px);
          line-height: calc(@factor * 12px);
          text-align: left;
        }

        .image-desc {
          display: -webkit-box;
          width: 100%;
          margin: 10px 0;
          margin-top: calc(@factor * 12px);
          margin-bottom: calc(@factor * 5px);
          overflow: hidden;
          color: #4e5969;
          font-size: calc(@factor * 7px);
          line-height: calc(@factor * 11px);
          white-space: normal;
          text-align: left;
          text-overflow: ellipsis;
          word-wrap: break-word;
          -webkit-line-clamp: 7;
          -webkit-box-orient: vertical;
        }

        .image-link {
          color: #1664ff;
          font-size: calc(@factor * 7px);
          line-height: calc(@factor * 11px);
          cursor: pointer;
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

::v-deep(.tele-image) {
  display: contents;

  .tele-image-img {
    width: 100%;
    height: 100%;
    object-fit: cover !important;
  }
}
// .is-preview {
//   transform: scale(2); /* 将元素的尺寸放大2倍 */
//   transform-origin: center center; /* 设置缩放中心点 */
// }
</style>
