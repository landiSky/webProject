<template>
  <div class="carousel-image-text-box" style="position: relative">
    <div class="carousel-box">
      <div class="carousel-image-text-title">{{
        getInterceptString(data?.mainTitle, 20) || '主标题'
      }}</div>
      <!-- 轮播图 -->
      <t-carousel
        class="image-box"
        animation-name="card"
        :auto-play="true"
        indicator-type="dot"
        indicator-position="outer"
        show-arrow="never"
        :current="carouselCurrent"
        @change="currentChange"
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
                getInterceptString(item?.desc, 120) ||
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
      <!-- 按钮 -->
      <div class="instructions">
        <div
          class="instructions-left"
          @click="about('Left', carouselCurrent)"
        ></div>
        <div
          class="instructions-right"
          @click="about('right', carouselCurrent)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, watch, onMounted } from 'vue';
import { getInterceptString } from '@/utils';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});

const { data, isPreview } = toRefs(props);
// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});

// 轮播图组件相关属性及方法
const carouseSize = ref(0);
const carouselCurrent = ref(1 as number);
const currentClick = (num: number) => {
  carouselCurrent.value = num;
};
const currentChange = (index: number) => {
  carouselCurrent.value = index;
};
const about = (name: string, num: number) => {
  if (name === 'Left') {
    carouselCurrent.value = num === 1 ? carouseSize.value : num - 1;
  } else if (name === 'right') {
    carouselCurrent.value = num === carouseSize.value ? 1 : num + 1;
  }
};

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
    // console.log('carouseSize', data?.value?.configValue.length);
    currentOffset.value =
      paginationFactor *
      -1 *
      (Object.values(data?.value?.configValue).length - windowSize.value);
    // 获取轮播图中的图片个数
    carouseSize.value = data?.value?.configValue.length;
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
            transform: translateY(200px);
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

    .instructions {
      position: relative;
      bottom: 35px;
      display: flex;
      gap: 140px;
      align-items: center;
      justify-content: center;
      height: 32px;
      //overflow: hidden;
      .instructions-left {
        width: 24px;
        height: 24px;
        background: url(@/assets/images/devCenter/left_arrow_01.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }

      .instructions-left:hover {
        opacity: 0.5;
      }

      .instructions-right {
        width: 24px;
        height: 24px;
        margin-left: 0;
        background: url(@/assets/images/devCenter/right_arrow_01.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }

      .instructions-right:hover {
        opacity: 0.5;
      }
    }
  }
}

:deep(.tele-carousel-indicator-outer) {
  gap: 6px;
  align-items: center;
}

:deep(.tele-carousel-indicator-item) {
  width: 8px;
  height: 8px; /* 假设默认高度的2倍 */
  background: #1664ff;
  opacity: 0.5;
}

:deep(.tele-carousel-indicator-item-active) {
  width: 16px;
  height: 16px;
  background: #1664ff;
  opacity: 1;
}

::v-deep(.tele-image) {
  .tele-image-img {
    width: calc(@factor * 480px) !important;
    height: calc(@factor * 260px) !important;
    object-fit: cover !important;
  }
}
</style>
