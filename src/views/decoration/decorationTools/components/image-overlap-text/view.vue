<template>
  <div class="image-overlap-text">
    <div class="image-overlap-text-title">
      <span>{{ data?.mainTitle || '主标题' }}</span>
    </div>
    <div class="mask"></div>
    <t-space class="image-overlap-text-content" fill :size="15 * num">
      <div class="mask"></div>
      <div
        v-for="(item, index) in data?.configValue"
        :key="index"
        class="image-overlap-item"
      >
        <img
          class="item-overlap-item-hover"
          src="@/assets/images/decoration/image-overlap-text-hover.png"
          alt=""
        />
        <t-space class="item-card" :size="5 * num" direction="vertical">
          <div class="image-overlap-item-icon">
            <img
              :src="`/server/web/file/download?name=${item?.src}&productId=${
                data?.productId || ''
              }`"
              alt=""
            />
          </div>
          <div class="image-overlap-item-title">{{
            item?.title || '小标题'
          }}</div>
          <div class="image-overlap-item-desc">{{
            item?.desc || '我是副标题我是副标题我是副标题我是副标题'
          }}</div>
          <t-space
            v-if="item.linkType !== LinkType.BLANK"
            direction="vertical"
            align="center"
            :size="5 * num"
          >
            <div
              class="image-overlap-item-btn"
              @click="clickLink(item.linkType, item.linkUrl)"
              >查看详情>>
            </div>
            <div class="view-detail-line"></div>
          </t-space>
        </t-space>
      </div>
    </t-space>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref } from 'vue';

import item1 from '@/assets/images/decoration/image-overlap-text-1.png';
import item2 from '@/assets/images/decoration/image-overlap-text-2.png';
import item3 from '@/assets/images/decoration/image-overlap-text-3.png';

import { LinkType } from '../../constant';
import type { IList } from './type';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});

const { data, isPreview } = toRefs(props);

const emit = defineEmits(['golink']);
const clickLink = (type: number, url: string) => {
  emit('golink', { type, url });
};
const getDefaultImg = (index: number) => {
  if (index === 1) return item1;
  if (index === 2) return item2;
  return item3;
};

// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});

const validateConfigValue = () => {
  const { configValue } = data?.value || {};
  if (!configValue || !configValue.length) return false;
  let flag = true;
  configValue.forEach((item: IList) => {
    if (!item.title || !item.desc || !item.src || !item.linkType) {
      flag = false;
    }
    if (item.linkType && item.linkType !== LinkType.BLANK && !item.linkUrl) {
      flag = false;
    }
  });
  return flag;
};

const checkConfigList = (list: []) => {
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    console.log('竖图遍历', item);
    return (
      item.title &&
      item.title.length < 6 &&
      item.desc &&
      item.desc.length < 30 &&
      item.src &&
      (item.linkType === 2 ||
        (item.linkType !== 2 && item.linkUrl && item.linkUrl.length < 500))
    );
  });
};

const validate = () => {
  console.log('图叠', data?.value);
  return new Promise((resolve, reject) => {
    if (
      !data?.value?.mainTitle ||
      data?.value?.mainTitle.length > 10 ||
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

.image-overlap-text {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  // height: calc(@factor * 340px);
  width: 100%;
  background: #fff;

  .image-overlap-text-title {
    width: 100%;
    height: calc(@factor * 42px);
    padding: calc(@factor * 20px) 0 calc(@factor * 10px);
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
    background-color: #fff;
  }

  .image-overlap-text-content {
    z-index: 1;
    justify-content: center;
    width: 100%;
    height: calc(@factor * 260px);
    background: url('@/assets/images/decoration/image-overlap-bg.png') center
      no-repeat;
    background-size: 100%;

    .mask {
      position: absolute;
      top: calc(@factor * 34px);
      left: 0;
      z-index: 2;
      width: 100%;
      height: calc(@factor * 200px);
      // background-color: red;
      // opacity: 0.3;
      background: linear-gradient(
        to top,
        rgba(151, 189, 249, 0) 0%,
        rgba(255, 255, 255, 0.6) 80%,
        rgba(255, 255, 255, 1) 98%,
        rgba(255, 255, 255, 1) 100%
      );
    }
  }

  .image-overlap-item {
    position: relative;
    z-index: 3;
    align-items: center;
    justify-content: center;
    width: calc(@factor * 148px);
    height: calc(@factor * 180px);
    background: #fffffff5;
    // cursor: pointer;
    // transition: all 0.3s;
    .item-overlap-item-hover {
      width: 100%;
      opacity: 0;
    }

    .item-card {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding-top: calc(@factor * 38px);
      transition: all 0.3s ease-out;
    }

    &:hover {
      // background: url('@/assets/images/decoration/image-overlap-text-hover.png')
      //   center no-repeat;
      // background-size: 100%;
      .item-overlap-item-hover {
        opacity: 1;
      }

      &::before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: linear-gradient(
          180deg,
          rgba(0, 104, 179, 0.5) 42.34%,
          rgba(22, 100, 255, 0.5) 100%
        );
        content: '';
      }

      .item-card {
        padding-top: calc(@factor * 12px);
        transition: padding-top 0.3s ease-out;
      }

      .image-overlap-item-title {
        z-index: 2;
        color: #fff;
      }

      .image-overlap-item-desc,
      .image-overlap-item-btn,
      .view-detail-line {
        z-index: 2;
        display: block;
        color: #fff;
      }
    }
  }

  .image-overlap-item-icon {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(@factor * 82px);
    height: calc(@factor * 82px);
    background: #fff;
    border: calc(@factor * 0.5px) solid #d1f6fb;
    border-radius: 100%;
    box-shadow: 0 calc(@factor * 2px) calc(@factor * 2px) 0 #4ce9ff63 inset;

    img {
      width: calc(@factor * 70px);
      height: calc(@factor * 70px);
      border-radius: 100%;
    }
  }

  .image-overlap-item-title {
    max-width: calc(@factor * 112px);
    padding: calc(@factor * 5px) 0;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 8px);
    line-height: calc(@factor * 12px);
    text-align: center;
  }

  .image-overlap-item-desc {
    display: -webkit-box;
    display: none;
    max-width: calc(@factor * 112px);
    overflow: hidden;
    color: #4e5969;
    font-weight: 500;
    font-size: calc(@factor * 7px);
    white-space: normal;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .image-overlap-item-btn {
    display: none;
    justify-content: center;
    font-weight: 400;
    font-size: calc(@factor * 7px);
    line-height: calc(@factor * 11px);
    text-align: center;
    cursor: pointer;
  }

  .view-detail-line {
    display: none;
    width: calc(@factor * 40px);
    height: calc(@factor * 3px);
    background: #fff;
    border-radius: calc(@factor * 1px);
  }
}
</style>
