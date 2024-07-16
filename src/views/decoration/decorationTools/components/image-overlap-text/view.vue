<template>
  <div class="image-overlap-text">
    <div class="image-overlap-text-title">
      {{ data?.mainTitle || '主标题' }}
    </div>
    <t-space class="image-overlap-text-content" fill :size="15 * num">
      <t-space
        v-for="(item, index) in data?.configValue"
        :key="index"
        :size="5 * num"
        direction="vertical"
        class="image-overlap-item"
      >
        <div class="image-overlap-item-icon">
          <img :src="item?.src || getDefaultImg(index + 1)" alt="" />
        </div>
        <div class="image-overlap-item-title">{{ item?.title }}</div>
        <div class="image-overlap-item-desc">{{ item?.desc }}</div>
        <t-space
          v-if="item.linkType !== LinkType.BLANK"
          class="image-overlap-item-btn"
          direction="vertical"
          align="center"
          :size="5 * num"
        >
          <div>查看详情>></div>
          <div class="view-detail-line"></div>
        </t-space>
      </t-space>
    </t-space>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref } from 'vue';

import item1 from '@/assets/images/decoration/image-overlap-text-1.png';
import item2 from '@/assets/images/decoration/image-overlap-text-2.png';
import item3 from '@/assets/images/decoration/image-overlap-text-3.png';

import { LinkType } from '../../constant';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});

const { data, isPreview } = toRefs(props);

const getDefaultImg = (index: number) => {
  if (index === 1) return item1;
  if (index === 2) return item2;
  return item3;
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

.image-overlap-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(@factor * 720px);
  height: calc(@factor * 340px);
  background: #fff;

  .image-overlap-text-title {
    width: 100%;
    padding: calc(@factor * 29px) 0;
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 18px);
    background-color: #fff;
  }

  .image-overlap-text-content {
    justify-content: center;
    width: 100%;
    height: calc(@factor * 260px);
    // background: linear-gradient(180deg, #ffffff 0%, #1664ff 100%);
    background: url('@/assets/images/decoration/image-overlap-bg.png') center
      no-repeat;
    background-size: 100%;
  }

  .image-overlap-item {
    position: relative;
    align-items: center;
    justify-content: center;
    width: calc(@factor * 148px);
    height: calc(@factor * 179.5px);
    background: #fffffff5;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: url('@/assets/images/decoration/image-overlap-text-hover.png')
        center no-repeat;
      background-size: 100%;

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

      .image-overlap-item-title {
        z-index: 2;
        color: #fff;
      }

      .image-overlap-item-desc,
      .image-overlap-item-btn {
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
    }
  }

  .image-overlap-item-title {
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 8px);
    line-height: calc(@factor * 12px);
    text-align: center;
  }

  .image-overlap-item-desc {
    display: -webkit-box;
    display: none;
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

    .view-detail-line {
      width: calc(@factor * 40px);
      height: calc(@factor * 3px);
      background: #fff;
      border-radius: calc(@factor * 1px);
    }
  }
}
</style>
