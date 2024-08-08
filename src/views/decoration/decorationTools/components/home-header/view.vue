<template>
  <div class="home-header">
    <div class="mask"></div>
    <div class="top-box">
      <!--  @mouseenter="setShow(0)"
        @mouseleave="setShow(-1)" -->
      <div class="top-left-box">
        <!-- v-if="tipshow === 0" -->
        <div class="tip-box">
          <div class="hover-header">{{ data?.configValue[0].title }}</div>
          <div class="hover-content">
            <div class="hover-desc">{{ data?.configValue[0].desc }} </div>
            <p
              @click="
                clickLink(
                  data?.configValue[0].linkType,
                  data?.configValue[0].linkUrl
                )
              "
            >
              查看更多
              <icon-right />
            </p>
          </div>
        </div>
      </div>

      <div class="top-right-box">
        <!-- v-if="tipshow === 1" -->
        <div class="tip-box">
          <div class="hover-header">{{ data?.configValue[1].title }}</div>
          <div class="hover-content">
            <div class="hover-desc">{{ data?.configValue[1].desc }} </div>
            <p
              @click="
                clickLink(
                  data?.configValue[1].linkType,
                  data?.configValue[1].linkUrl
                )
              "
              >查看更多<icon-right />
            </p>
          </div>
        </div>
      </div>
      <div class="bottom-left-box">
        <!-- v-if="tipshow === 3" -->
        <div class="tip-box">
          <div class="hover-header">{{ data?.configValue[2].title }}</div>
          <div class="hover-content">
            <div class="hover-desc">{{ data?.configValue[2].desc }} </div>
            <p
              @click="
                clickLink(
                  data?.configValue[2].linkType,
                  data?.configValue[2].linkUrl
                )
              "
              >查看更多<icon-right />
            </p>
          </div>
        </div>
      </div>
      <div class="bottom-right-box">
        <!-- v-if="tipshow === 2" -->
        <div class="tip-box">
          <div class="hover-header">{{ data?.configValue[3].title }}</div>
          <div class="hover-content">
            <div class="hover-desc">{{ data?.configValue[3].desc }} </div>
            <p
              @click="
                clickLink(
                  data?.configValue[3].linkType,
                  data?.configValue[3].linkUrl
                )
              "
              >查看更多 <icon-right />
            </p>
          </div>
        </div>
      </div>

      <div class="video-box">
        <video
          src="../../../../../assets/video/home-bg.mp4"
          style="width: 100%; height: 100%; object-fit: fill"
          autoplay
          loop
          muted
        />
      </div>
    </div>
    <div class="mask right-mask"></div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, onMounted, onBeforeUnmount } from 'vue';

const tipshow = ref(-1);

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});

const timer = ref();

const { data, isPreview } = toRefs(props);

// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});

const maskWidthFactor = computed(() => {
  return isPreview.value ? 1 : 0;
});

// const topBoxWidth = computed(() => {
//   return isPreview.value ? '1920px' : '720px';
// });
const topBoxHeight = computed(() => {
  return isPreview.value ? '100%' : '263px';
});

const checkConfigList = (list: any) => {
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    return (
      item.title &&
      item.desc &&
      (item.linkType === 2 || (item.linkType !== 2 && item.linkUrl))
    );
  });
};
const validate = () => {
  return new Promise((resolve, reject) => {
    if (!checkConfigList(Object.values(data?.value?.configValue))) {
      return reject();
    }
    return resolve('');
  });
};

const emit = defineEmits(['golink']);
const clickLink = (type: number, url: string) => {
  emit('golink', { type, url });
};
// 实现轮流显示效果（未使用）
const startTimer = () => {
  timer.value = setInterval(() => {
    if (tipshow.value === -1 || tipshow.value === 3) {
      tipshow.value = 0;
    } else {
      tipshow.value += 1;
    }
  }, 3800);
};

const endTimer = () => {
  clearInterval(timer.value);
};

// 未使用
const setShow = (index: number) => {
  if (index < 0) {
    startTimer();
  } else {
    endTimer();
    tipshow.value = index;
  }
};

onMounted(() => {
  // startTimer();
});

onBeforeUnmount(() => {
  // endTimer();
});

defineExpose({
  validate,
});
</script>

<style scoped lang="less">
@factor: v-bind(num);
@widthFactor: v-bind(maskWidthFactor);
// @topBoxWidth: v-bind(topBoxWidth);
@topBoxHeight: v-bind(topBoxHeight);

@keyframes fadeIn {
  0%,
  10% {
    opacity: 0;
    scale: 0.2;
  }

  100% {
    opacity: 1;
    scale: 1;
  }
}

.home-header {
  position: relative;
  width: 100%;
  max-width: 1920px;
  max-height: 700px;
  // height: 698px;
  // min-width: 720px;
  // min-height: 500px;
  // margin: 0 auto;
  // background-color: #0a4a90;
  .mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -365px;
    z-index: 2;
    width: calc(@widthFactor * 540px);
    // height: calc(@factor * 350px);
    background: linear-gradient(90deg, #f2f6fb 70%, rgba(224, 243, 250, 0));
  }

  .right-mask {
    right: -365px;
    left: auto;
    transform: matrix(-1, 0, 0, 1, 0, 0);
  }

  .top-box {
    position: relative;
    // width: calc(@topBoxWidth - 2px);
    height: calc(@topBoxHeight - 0px);
    max-height: 700px;
    background-color: transparent; //注意这里

    .video-box {
      z-index: -1;
      width: 100%;
      // height: 100px;
    }

    .top-left-box {
      position: absolute;
      top: 10%;
      left: 36%;
      z-index: 1000;
      width: calc(@factor * 100px);
      height: calc(@factor * 100px);
      background-color: transparent;

      .tip-box {
        margin-top: calc(@factor * 40px);
        margin-left: calc(@factor * -130px);
        animation: fadeIn 0.5s ease 1;
      }

      &:hover {
        .tip-box {
          width: calc(@factor * 144px) !important;
          transform: scale(1);
        }
      }
    }

    .top-right-box {
      position: absolute;
      top: 8%;
      left: 58%;
      z-index: 1000;
      width: calc(@factor * 100px);
      height: calc(@factor * 100px);
      background-color: transparent;

      .tip-box {
        margin-top: calc(@factor * 40px);
        margin-left: calc(@factor * 70px);
        animation: fadeIn 0.5s ease 1;
      }

      &:hover {
        .tip-box {
          width: calc(@factor * 144px) !important;
          transform: scale(1);
        }
      }
    }

    .bottom-left-box {
      position: absolute;
      top: 56%;
      left: 35%;
      z-index: 1000;
      width: calc(@factor * 100px);
      height: calc(@factor * 100px);
      background-color: transparent;

      .tip-box {
        margin-top: calc(@factor * 30px);
        margin-left: calc(@factor * -121px);
        animation: fadeIn 0.5s ease 1;
      }

      &:hover {
        .tip-box {
          width: calc(@factor * 144px) !important;
          transform: scale(1);
        }
      }
    }

    .bottom-right-box {
      position: absolute;
      top: 56%;
      left: 58%;
      z-index: 1000;
      width: calc(@factor * 100px);
      height: calc(@factor * 100px);
      background-color: transparent;

      .tip-box {
        margin-top: calc(@factor * 30px);
        margin-left: calc(@factor * 80px);
        animation: fadeIn 0.5s ease 1;
      }

      &:hover {
        .tip-box {
          width: calc(@factor * 144px) !important;
          transform: scale(1);
        }
      }
    }

    .tip-box {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      width: calc(@factor * 144px) !important;
      border: 1px solid #fff;
      border-radius: 2px;
      transform: scale(0.8);
      visibility: visible;
      opacity: 1;
      transition: opacity 0.5s ease, transform 0.5s ease;

      .hover-header {
        // display: block;
        width: calc(@factor * 143px);
        height: calc(@factor * 27px);
        padding-right: calc(@factor * 10px);
        padding-left: calc(@factor * 12px);
        overflow: hidden;
        color: #0a4a90;
        font-weight: 500;
        font-size: calc(@factor * 10px);
        line-height: calc(@factor * 27px);
        white-space: nowrap;
        text-align: left;
        text-overflow: ellipsis;
        background-color: #ffffff60;
      }

      .hover-content {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        width: calc(@factor * 143px);
        font-size: calc(@factor * 7px);
        background-color: #bcf6ff80;
        // background-color: red;
        .hover-desc {
          display: -webkit-box;
          width: 100%;
          margin-top: calc(@factor * 6px);
          padding: 0 calc(@factor * 12px);
          overflow: hidden;
          color: #4e5969;
          font-size: calc(@factor * 7px);
          // height: calc(@factor * 17px);
          line-height: calc(@factor * 12px);
          white-space: normal;
          text-align: left;
          text-overflow: ellipsis;
          // word-wrap: break-word;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        p {
          padding-top: calc(@factor * 4px);
          padding-right: calc(@factor * 12px);
          padding-bottom: calc(@factor * 8px);
          padding-left: calc(@factor * 12px);
          color: #1664ff;
          text-align: left;
          cursor: pointer;
        }
      }
    }

    .tip-box::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
      background: inherit;
      backdrop-filter: blur(3px);
      content: '';
    }
  }
}
</style>
