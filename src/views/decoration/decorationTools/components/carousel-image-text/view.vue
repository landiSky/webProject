<template>
  <div class="carousel-image-text-box" style="position: relative">
    <div class="carousel-image-text-title">{{
      data?.mainTitle || '主标题'
    }}</div>
    <t-carousel
      class="image-box"
      animation-name="card"
      :auto-play="false"
      indicator-type="outer"
      show-arrow="hover"
    >
      <t-carousel-item
        v-for="(item, index) in data?.configValue"
        :key="index"
        class="image-item"
      >
        <!-- <span class="image-title">{{ item?.title || '小标题' }}</span> -->
        <div class="content-area">
          <t-image
            :src="`/server/web/file/download?name=${item?.src}`"
            :preview="false"
            :style="{
              width: '100%',
            }"
            class="image-cls"
          />
          <div class="image-content">
            <span class="image-desc">{{ item?.desc || '图片简介' }}</span>
            <span
              v-if="item?.linkType !== 2"
              class="image-link"
              @click="clickLink(item?.linkType, item?.linkUrl)"
              >查看详情>>
            </span>
          </div>
        </div>
      </t-carousel-item>
    </t-carousel>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, watch, onMounted } from 'vue';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});

const { data, isPreview } = toRefs(props);
// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});
const currentOffset = ref(0);
const windowSize = ref(4);
const paginationFactor = 163 * num.value;

const atEndOfList = computed(() => {
  const n =
    paginationFactor *
    -1 *
    (Object.values(data?.value?.configValue).length - windowSize.value);
  console.log('atEndOfList', atEndOfList, n);
  return currentOffset.value <= n;
});

const atHeadOfList = computed(() => {
  return currentOffset.value === 0;
});

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
    console.log('multi image data', val);
    currentOffset.value =
      paginationFactor *
      -1 *
      (Object.values(data?.value?.configValue).length - windowSize.value);
  },
  { immediate: true, deep: true }
);

const checkConfigList = (list: any) => {
  console.log('竖图遍历000', list.length);
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    console.log('竖图遍历000', item);
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
      checkConfigList(Object.values(data?.value?.configValue))
    ) {
      return reject();
    }
    return resolve('');
  });
};

onMounted(() => {});

defineExpose({
  validate,
});
</script>

<style scoped lang="less">
@factor: v-bind(num);

.carousel-image-text-box {
  width: calc(@factor * 720px);
  // height: calc(@factor * 340px);
  .carousel-image-text-title {
    margin: calc(@factor * 29px) 0 calc(@factor * 54px);
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 18px);
  }

  .image-box {
    width: 100%;
    height: calc(@factor * 308px);
    background: #fff;

    .image-item {
      width: calc(@factor * 480px);
      height: calc(@factor * 260px);
      padding: 0 calc(@factor * 15px);
      overflow: hidden;
      background: #fff;

      .image-cls {
        height: calc(@factor * 260px);
      }

      .content-area {
        position: relative;

        .image-content {
          position: absolute;
          bottom: calc(@factor * 24px);
          left: calc(@factor * 24px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .image-desc {
            display: flex;
            align-items: center;
            justify-content: center;
            width: calc(@factor * 110px);
            margin: calc(@factor * 5px) 0;
            overflow: hidden;
            color: #4e5969;
            font-size: calc(@factor * 7px);
            white-space: normal;
            text-align: left;
            text-overflow: ellipsis;
          }

          .image-link {
            color: #1664ff;
            font-size: calc(@factor * 7px);
            cursor: pointer;
          }
        }
      }
    }

    ::v-deep(.tele-carousel-indicator-wrapper-bottom) {
      background: none;
    }
  }
}

::v-deep(.tele-image) {
  .tele-image-img {
    width: calc(@factor * 450px) !important;
    height: calc(@factor * 260px) !important;
    object-fit: cover !important;
  }
}
</style>
