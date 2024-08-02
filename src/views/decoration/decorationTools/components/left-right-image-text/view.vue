<template>
  <div class="lr-image-text-box">
    <div class="lr-image-text-title">{{ data?.mainTitle || '主标题' }}</div>
    <t-carousel :auto-play="true" class="image-box" show-arrow="never">
      <t-carousel-item v-for="(item, index) in data?.configValue" :key="index">
        <div class="image-item">
          <div class="image-item-content">
            <div class="image-title">{{ item?.title || '小标题' }}</div>
            <div class="image-desc">{{ item?.desc || '图片简介' }}</div>
            <span
              v-if="item?.linkType !== 2"
              class="image-link"
              @click="clickLink(item?.linkType, item?.linkUrl)"
              >查看详情>>
            </span>
          </div>
          <img
            :src="`/server/web/file/download?name=${item?.src}`"
            fit="cover"
            class="image-cls"
          />
        </div>
      </t-carousel-item>
    </t-carousel>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, watch, onMounted } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
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
    console.log('vertical image data左侧内容', val);
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
      item.title &&
      item.desc &&
      item.src &&
      (item.linkType === 2 || (item.linkType !== 2 && item.linkUrl))
    );
  });
};

const validate = () => {
  return new Promise((resolve, reject) => {
    if (
      // 可能需要完善校验逻辑
      !data?.value?.mainTitle ||
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

.lr-image-text-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: calc(@factor * 720px);
  height: calc(@factor * 380px);

  .lr-image-text-title {
    width: calc(@factor * 600px);
    margin: calc(@factor * 29px) 0;
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 18px);
  }

  .image-box {
    width: calc(@factor * 600px);
    height: calc(@factor * 260px);
    // margin-top: calc(@factor * 29px);
    .image-item {
      position: relative;
      // display: block;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;

      .image-item-content {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: calc(@factor * 300px);
        height: calc(@factor * 192px);
        margin-right: 15.5px;
        padding: calc(@factor * 11px) 0;

        .image-title {
          width: 100%;
          height: calc(@factor * 34px);
          padding: 0 calc(@factor * 11px);
          color: #1d2129;
          font-weight: 500;
          font-size: calc(@factor * 8px);
          line-height: calc(@factor * 34px);
          text-align: left;
          text-overflow: ellipsis;
          border-bottom: 1px solid #e2e2e2;
          // background-color: white;
        }

        .image-desc {
          display: -webkit-box;
          width: 100%;
          margin: 10px 0;
          padding: 0 calc(@factor * 11px);
          overflow: hidden;
          color: #4e5969;
          font-size: calc(@factor * 7px);
          line-height: calc(@factor * 18px);
          white-space: pre-wrap;
          text-align: left;
          text-overflow: ellipsis;
          word-wrap: break-word;
          -webkit-line-clamp: 7;
          -webkit-box-orient: vertical;
        }

        .image-link {
          display: inline-block;
          padding: 0 calc(@factor * 11px);
          color: #1664ff;
          font-size: calc(@factor * 7px);
          cursor: pointer;
        }
      }
    }

    .image-cls {
      width: calc(@factor * 324.5px);
      height: calc(@factor * 301px);
    }

    :deep(.tele-carousel-indicator-dot .tele-carousel-indicator-item) {
      width: 57.5px;
      height: 5px;
      border-radius: 1px;
    }

    :deep(.tele-carousel-indicator-item) {
      background-color: #e9e9e966;
    }

    :deep(.tele-carousel-indicator-wrapper-bottom) {
      bottom: -35px;
    }

    :deep(.tele-carousel-indicator-item:hover) {
      background: #e0d9d9;
    }

    :deep(.tele-carousel-indicator-item-active) {
      background: #eaeaea;
    }

    :deep(.tele-carousel-indicator-wrapper-bottom) {
      background: transparent;
    }

    :deep(.tele-carousel-item-slide-out) {
      display: none;
      // animation: xxx;
    }
  }

  .lr-image-text-desc {
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
// .is-preview {
//   transform: scale(2); /* 将元素的尺寸放大2倍 */
//   transform-origin: 0 0; /* 设置缩放中心点 */
// }
</style>
