<template>
  <div class="carousel-image-text-box" style="position: relative">
    <div class="carousel-box">
      <div class="carousel-image-text-title">{{
        data?.mainTitle || '主标题'
      }}</div>
      <t-carousel
        class="image-box"
        animation-name="card"
        :auto-play="true"
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
              :src="`/server/web/file/download?name=${item?.src}&productId=${
                data?.productId || ''
              }`"
              :preview="false"
              :style="{
                width: '100%',
              }"
              class="image-cls"
            />
            <div class="image-content">
              <span class="image-desc">{{
                item?.desc ||
                '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介'
              }}</span>
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

const emit = defineEmits(['golink']);
const clickLink = (type: number, url: string) => {
  emit('golink', { type, url });
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
  console.log('轮播图校验', list);
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    console.log('轮播图校验', item);
    return (
      // item.title &&
      item.desc &&
      item.desc.length <= 120 &&
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
      !checkConfigList(Object.values(data?.value?.configValue))
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
  width: 100%;

  .carousel-box {
    width: calc(@factor * 720px);
    margin: 0 auto;

    .carousel-image-text-title {
      margin: calc(@factor * 20px) 0;
      color: #1d2129;
      font-weight: 500;
      font-size: calc(@factor * 12px);
      line-height: calc(@factor * 14px);
    }

    .image-box {
      width: 100%;
      height: calc(@factor * 280px);
      // background: #fff;
      .image-item {
        width: calc(@factor * 510px);
        height: calc(@factor * 260px);
        padding: 0 calc(@factor * 15px);
        overflow: hidden;
        // background: #fff;
        .image-cls {
          height: calc(@factor * 260px);
        }

        .content-area {
          position: relative;

          &:hover .image-content {
            transform: translateY(0);
          }

          .image-content {
            position: absolute;
            bottom: 0;
            left: 0;
            // bottom: calc(@factor * 24px);
            // left: calc(@factor * 24px);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: calc(@factor * 480px);
            height: calc(@factor * 90px);
            padding: 26px 0 0 24px;
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.12) 0%,
              #000 100%
            );
            transform: translateY(100px);
            transition: transform 0.5s;

            .image-desc {
              display: flex;
              // align-items: center;
              // justify-content: center;
              width: calc(@factor * 370px);
              margin: calc(@factor * 5px) 0;
              overflow: hidden;
              color: rgba(255, 255, 255, 1);
              font-weight: calc(@factor * 400px);
              font-size: calc(@factor * 7px);
              font-family: PingFang SC;
              line-height: calc(@factor * 11px);
              white-space: normal;
              text-align: left;
              text-overflow: ellipsis;
            }

            .image-link {
              color: #fff;
              font-weight: 400;
              font-size: calc(@factor * 7px);
              font-family: PingFang SC;
              line-height: 11px;
              text-align: left;
              cursor: pointer;
            }
          }
        }
      }

      ::v-deep(.tele-carousel-indicator-wrapper-bottom) {
        background: none;
      }

      ::v-deep(.tele-carousel-arrow > div) {
        width: calc(@factor * 24px);
        height: calc(@factor * 24px);

        svg {
          width: calc(@factor * 16px);
          height: calc(@factor * 16px);
        }
      }
    }
  }
}

::v-deep(.tele-image) {
  .tele-image-img {
    width: calc(@factor * 480px) !important;
    height: calc(@factor * 260px) !important;
    object-fit: cover !important;
  }
}
</style>
