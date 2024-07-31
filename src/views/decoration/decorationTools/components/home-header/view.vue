<template>
  <div class="home-header">
    <div class="top-box">
      <div class="top-left-box">
        <div class="tip-box">
          <div class="hover-header">{{ data?.configValue[0].title }}</div>
          <div class="hover-content">
            <div class="hover-desc">{{ data?.configValue[0].desc }} </div>
            <p @click="clickLink(data?.configValue[0].linkUrl)">
              查看更多<icon-right
            /></p>
          </div>
        </div>
      </div>

      <div class="top-right-box">
        <div class="tip-box">
          <div class="hover-header">{{ data?.configValue[1].title }}</div>
          <div class="hover-content">
            <div class="hover-desc">{{ data?.configValue[1].desc }} </div>
            <p @click="clickLink(data?.configValue[1].linkUrl)"
              >查看更多<icon-right
            /></p>
          </div>
        </div>
      </div>
      <div class="bottom-left-box">
        <div class="tip-box">
          <div class="hover-header">{{ data?.configValue[2].title }}</div>
          <div class="hover-content">
            <div class="hover-desc">{{ data?.configValue[2].desc }} </div>
            <p @click="clickLink(data?.configValue[2].linkUrl)"
              >查看更多<icon-right
            /></p>
          </div>
        </div>
      </div>
      <div class="bottom-right-box">
        <div class="tip-box">
          <div class="hover-header">{{ data?.configValue[3].title }}</div>
          <div class="hover-content">
            <div class="hover-desc">{{ data?.configValue[3].desc }} </div>
            <p @click="clickLink(data?.configValue[3].linkUrl)"
              >查看更多<icon-right
            /></p>
          </div>
        </div>
      </div>
      <div class="video-box">
        <video
          src="../../../../../assets/video/home-bg.mp4"
          style="width: 100%; height: 100%"
          autoplay
          loop
          muted
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref } from 'vue';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});

const { data, isPreview } = toRefs(props);

// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2.6667 : 1;
});
const checkConfigList = (list: any) => {
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    return item.title && item.desc && item.linkUrl;
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
const clickLink = (url: string) => {
  emit('golink', { type: 0, url });
};

defineExpose({
  validate,
});
</script>

<style scoped lang="less">
@factor: v-bind(num);

.home-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  // width: calc(@factor * 960px);
  // height: calc(@factor * 350px);
  .top-box {
    position: relative;
    width: calc(@factor * 716px);
    height: calc(@factor * 262px);
    // background-color: red;
    .video-box {
      z-index: -1;
      width: 100%;
      height: 100%;
    }

    .top-left-box {
      position: absolute;
      top: 10%;
      left: 35%;
      z-index: 3000;
      width: calc(@factor * 100px);
      height: calc(@factor * 100px);
      background-color: transparent;

      .tip-box {
        margin-left: calc(@factor * -100px);
      }

      &:hover {
        .tip-box {
          width: calc(@factor * 121px) !important;
          margin-left: calc(@factor * -100px);
          transform: scale(1);
          visibility: visible;
          opacity: 1;
        }
      }
    }

    .top-right-box {
      position: absolute;
      top: 5%;
      left: 57%;
      z-index: 3000;
      width: calc(@factor * 100px);
      height: calc(@factor * 100px);

      .tip-box {
        margin-left: calc(@factor * 80px);
      }

      &:hover {
        .tip-box {
          width: calc(@factor * 121px) !important;
          margin-left: calc(@factor * 80px);
          border: 1px solid #fff;
          border-radius: 2px;
          transform: scale(1);
          visibility: visible;
          opacity: 1;
        }
      }
    }

    .bottom-left-box {
      position: absolute;
      top: 54%;
      left: 34%;
      z-index: 3000;
      width: calc(@factor * 100px);
      height: calc(@factor * 100px);
      background-color: transparent;

      .tip-box {
        margin-left: calc(@factor * -100px);
      }

      &:hover {
        .tip-box {
          width: calc(@factor * 121px) !important;
          margin-left: calc(@factor * -100px);
          border: 1px solid #fff;
          border-radius: 2px;
          transform: scale(1);
          visibility: visible;
          opacity: 1;
        }
      }
    }

    .bottom-right-box {
      position: absolute;
      top: 50%;
      left: 56%;
      z-index: 3000;
      width: calc(@factor * 100px);
      height: calc(@factor * 100px);
      background-color: transparent;

      .tip-box {
        margin-left: calc(@factor * 80px);
      }

      &:hover {
        .tip-box {
          width: calc(@factor * 121px) !important;
          margin-left: calc(@factor * 80px);
          border: 1px solid #fff;
          border-radius: 2px;
          transform: scale(1);
          visibility: visible;
          opacity: 1;
        }
      }
    }

    .tip-box {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      width: calc(@factor * 121px) !important;
      border: 1px solid #fff;
      border-radius: 2px;
      transform: scale(0.9);
      visibility: visible;
      opacity: 1;
      transition: opacity 0.5s ease, transform 0.5s ease;

      .hover-header {
        width: calc(@factor * 121px);
        height: calc(@factor * 21px);
        padding-left: calc(@factor * 12px);
        color: #1664ff;
        font-weight: 500;
        font-size: calc(@factor * 9.4px);
        line-height: calc(@factor * 21px);
        text-align: left;
        background-color: transparent;
      }

      .hover-content {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        width: calc(@factor * 120px);
        font-size: calc(@factor * 5.38px);
        background-color: #bcf6ff80;

        .hover-desc {
          display: -webkit-box;
          width: 100%;
          margin-top: calc(@factor * 4px);
          padding: 0 calc(@factor * 9px);
          overflow: hidden;
          color: #4e5969;
          font-size: calc(@factor * 6px);
          // height: calc(@factor * 17px);
          line-height: calc(@factor * 8px);
          white-space: normal;
          text-align: left;
          text-overflow: ellipsis;
          word-wrap: break-word;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        p {
          width: 100%;
          padding: calc(@factor * 4px) calc(@factor * 9px);
          color: #1664ff;
          text-align: left;
          cursor: pointer;
        }
      }
    }
  }
}

::v-deep(.tele-image) {
  .tele-image-img {
    width: calc(@factor * 600px) !important;
    height: calc(@factor * 260px) !important;
    object-fit: cover !important;
  }
}

::v-deep(.tele-trigger-popup) {
  .tele-trigger-popup-wrapper {
    .tele-popover-popup-content {
      width: calc(@factor * 121px) !important;
      height: calc(@factor * 62px) !important;
      padding: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      background-color: transparent;

      .tele-popover-title {
        width: 100%;

        .content-header {
          position: relative;
          display: flex !important;
          align-items: flex-start;
          justify-content: space-between !important;
          height: calc(@factor * 21px);
          background-color: transparent !important;

          span {
            margin-left: calc(@factor * 12px);
            font-weight: 500;
            font-size: calc(@factor * 9.4px);
            line-height: calc(@factor * 21px);
          }
        }
      }

      .tele-popover-content {
        width: 100%;
        height: calc(@factor * 41px);

        .hover-content {
          position: relative;
          display: flex !important;
          flex-direction: column;
          align-items: flex-start !important;
          // justify-content: flex-start !important;
          height: 100%;
          padding: calc(@factor * 6px) calc(@factor * 6px) 0 calc(@factor * 6px);
          color: #4e5969;
          font: PingFang SC;
          font-size: calc(@factor * 5.3px);
          background-color: #bcf6ff80;

          .hover-desc {
            display: -webkit-box;
            flex: 1;
            width: 100%;
            overflow: hidden;
            font-size: calc(@factor * 6px);
            white-space: normal;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .hover-more {
            margin-bottom: calc(@factor * 7px);
            color: #1664ff;
            cursor: pointer;
          }
          // .img_top-left {
          //   position: absolute;
          //   bottom: 4px;
          //   left: 0;
          // }
          // .img_top-right {
          //   position: absolute;
          //   bottom: 4px;
          //   right: 0;
          // }
        }
      }
    }

    .tele-trigger-arrow {
      visibility: hidden;
    }
  }
}
</style>
