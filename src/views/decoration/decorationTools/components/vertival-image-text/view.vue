<!-- 竖图文 -->
<template>
  <div class="vertical-image-text-box">
    <div class="vertical-image-text-title">{{
      data?.mainTitle || '主标题'
    }}</div>
    <div class="image-box">
      <div
        v-for="(item, index) in data?.configValue"
        :key="index"
        class="image-item"
      >
        <img
          :src="`/server/web/file/download?name=${item?.src}&productId=${data?.productId}`"
          fit="cover"
          :preview="false"
          class="image-cls"
        />
        <div class="image-item-content">
          <span class="image-title">{{ item?.title || '小标题' }}</span>
          <span class="image-desc">{{
            item?.desc || '我是简介我是简介我是简介我是简介'
          }}</span>
          <span
            v-if="item?.linkType !== 2"
            class="image-link"
            @click="clickLink(item?.linkType, item?.linkUrl)"
            >详情>>
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
const emit = defineEmits(['golink']);

const { data, isPreview } = toRefs(props);

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
    // flex-wrap: wrap;
    height: calc(@factor * 230px);
    // margin-top: calc(@factor * 29px);
    .image-item {
      position: relative;
      display: block;
      width: calc(@factor * 91px);
      height: calc(@factor * 230px);
      margin: 0 calc(@factor * 2px);
      transition: width 0.8s;

      .image-cls {
        width: 100%;
        height: 100%;
      }
      // .image-cls:hover {
      // }
      .image-item-content {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 20px;

        .image-title {
          color: #fff;
          font-weight: 500;
          font-size: calc(@factor * 8px);
        }

        .image-desc {
          display: -webkit-box;
          width: calc(@factor * 70px);
          margin: 10px 0;
          overflow: hidden;
          font-size: calc(@factor * 7px);
          white-space: normal;
          text-align: left;
          text-overflow: ellipsis;
          word-wrap: break-word;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .image-link {
          color: #fff;
          font-size: calc(@factor * 7px);
          cursor: pointer;
        }
      }
    }

    .image-item:hover::before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0.9),
        rgba(199, 221, 255, 0.9)
      );
      content: '';
    }

    .image-item:hover {
      width: calc(@factor * 91px * 2.3);

      .image-item-content {
        .image-title,
        .image-link {
          color: #1d2129;
        }

        .image-desc {
          display: -webkit-box;
          width: calc(@factor * 70px * 2.3);
          -webkit-line-clamp: 6;
          color: #4e5969;
        }
      }
    }
  }

  .vertical-image-text-desc {
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
