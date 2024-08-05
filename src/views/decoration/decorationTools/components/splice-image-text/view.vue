<!-- 多图文:style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')' }"-->
<template>
  <div class="multi-image-text-box" style="position: relative">
    <div class="multi-image-text-title">{{ data?.mainTitle || '主标题' }}</div>
    <div class="image-box" style="position: relative">
      <div class="left-box">
        <span class="image-title">{{
          data?.configValue1?.subTitle || '主标题'
        }}</span>
        <t-carousel
          :auto-play="true"
          animation-name="fade"
          class="left-carousel-cls"
          show-arrow="always"
          direction="vertical"
          indicator-position="right"
          indicator-type="never"
        >
          <t-carousel-item
            v-for="(item, index) in data?.configValue1?.config"
            :key="index"
          >
            <div class="image-item">
              <div class="image-content">
                <t-image
                  :src="`/server/web/file/download?name=${item?.src}`"
                  :preview="false"
                />
                <div class="image-desc-box">
                  <span class="image-little-title">{{
                    item?.title || '小标题'
                  }}</span>
                  <span class="image-desc">{{
                    item?.desc || '我是简介我是简介我是简介我是简介我是简介'
                  }}</span>
                  <span class="image-index">{{
                    `${index + 1}/${data?.configValue1?.config.length}`
                  }}</span>
                </div>
              </div>
              <span
                v-if="item?.linkType !== 2"
                class="image-link"
                @click="clickLink(item?.linkType, item?.linkUrl)"
                >查看详情>>
              </span>
            </div>
          </t-carousel-item>
        </t-carousel>
      </div>
      <div class="right-box">
        <span class="image-title">{{
          data?.configValue2?.subTitle || '主标题'
        }}</span>
        <t-carousel
          :auto-play="true"
          animation-name="fade"
          class="right-carousel-cls"
          show-arrow="always"
          direction="vertical"
          indicator-position="right"
          indicator-type="never"
        >
          <t-carousel-item
            v-for="(item, index) in data?.configValue2?.config"
            :key="index"
          >
            <div class="image-item">
              <div class="image-content">
                <t-image
                  :src="`/server/web/file/download?name=${item?.src}`"
                  :preview="false"
                />
                <div class="image-desc-box">
                  <span class="image-little-title">{{
                    item?.title || '小标题'
                  }}</span>
                  <span class="image-desc">{{ item?.desc || '图片简介' }}</span>
                  <span class="image-index">{{
                    `${index + 1}/${data?.configValue2?.config.length}`
                  }}</span>
                </div>
              </div>
              <span
                v-if="item?.linkType !== 2"
                class="image-link"
                @click="clickLink(item?.linkType, item?.linkUrl)"
                >查看详情>>
              </span>
            </div>
          </t-carousel-item>
        </t-carousel>
      </div>
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

const emit = defineEmits(['golink']);
const clickLink = (type: number, url: string) => {
  emit('golink', { type, url });
};

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
  console.log('品图文开始校验了', data);
  return new Promise((resolve, reject) => {
    if (
      // 可能需要完善校验逻辑
      !data?.value?.mainTitle ||
      !data?.value?.configValue1?.subTitle ||
      !checkConfigList(Object.values(data?.value?.configValue1?.config)) ||
      !data?.value?.configValue2?.subTitle ||
      !checkConfigList(Object.values(data?.value?.configValue2?.config))
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

.multi-image-text-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: calc(@factor * 720px);
  height: calc(@factor * 275px);

  .multi-image-text-title {
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
    width: calc(@factor * 718px);
    height: calc(@factor * 195px);
    overflow: hidden;
    // padding-left: calc(@factor * 33px);
    background-color: #353535;

    .left-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: calc(@factor * 360px);
      height: calc(@factor * 195px);
      padding: calc(@factor * 20px) calc(@factor * 40px) 0 calc(@factor * 30px);
      background-color: #1664ff;
      clip-path: polygon(0 0, 86% 0, 100% 100%, 0 100%);

      .left-carousel-cls {
        width: 100%;
        height: calc(@factor * 139px);

        .image-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          width: 100%;
          height: 100%;
          margin: calc(@factor * 6px) 0 calc(@factor * 12px) 0;

          .image-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-bottom: calc(@factor * 12px);
            padding: calc(@factor * 8px) calc(@factor * 5px);

            .image-desc-box {
              position: relative;
              display: flex;
              flex: 1;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              height: 100%;
              padding: calc(@factor * 8px);

              .image-index {
                position: absolute;
                top: calc(@factor * 32px);
                right: calc(@factor * 18px);
                font-weight: 500;
                font-size: calc(@factor * 8px);
              }

              .image-little-title {
                margin-bottom: calc(@factor * 6px);
                padding-left: calc(@factor * 3px);
                color: #fff;
                font-weight: 500;
                font-size: calc(@factor * 10px);
                line-height: calc(@factor * 28px);
              }

              .image-desc {
                width: calc(@factor * 110px);
                height: calc(@factor * 22px);
                padding: calc(@factor * 4px);
                overflow: hidden;
                color: #fff;
                font-size: calc(@factor * 7px);
                white-space: normal;
                text-align: left;
                text-overflow: ellipsis;
                word-wrap: break-word;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
            }
          }

          .image-link {
            margin-left: calc(@factor * 5px);
            color: #fff;
            font-size: calc(@factor * 7px);
            line-height: calc(@factor * 11px);
            cursor: pointer;
          }

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
          }
        }
      }

      .image-title {
        width: 100%;
        padding: calc(@factor * 10px);
        overflow: hidden;
        color: #fff;
        font-weight: 500;
        font-size: calc(@factor * 18px);
        white-space: normal;
        text-align: left;
      }

      ::v-deep(.tele-carousel-arrow) {
        position: absolute;
        top: calc(@factor * 16px);
        right: calc(@factor * 30px);
        display: flex;
        flex-direction: column-reverse;
        align-items: space-around;
        height: calc(@factor * 68px) !important;

        .tele-carousel-arrow-top {
          width: calc(@factor * 12px);
          height: calc(@factor * 12px);
        }

        svg {
          width: calc(@factor * 6px);
          height: calc(@factor * 6px);
        }

        .tele-carousel-arrow-bottom {
          width: calc(@factor * 12px);
          height: calc(@factor * 12px);
        }
      }
    }

    .right-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: calc(@factor * 360px);
      height: calc(@factor * 195px);
      padding: calc(@factor * 20px) calc(@factor * 40px) 0 calc(@factor * 30px);

      .right-carousel-cls {
        width: 100%;
        height: calc(@factor * 139px);

        .image-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-start;
          width: 100%;
          height: 100%;
          margin: calc(@factor * 6px) 0 calc(@factor * 12px) 0;

          .image-content {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-bottom: calc(@factor * 12px);
            padding: calc(@factor * 8px) calc(@factor * 5px);

            .image-desc-box {
              position: relative;
              display: flex;
              flex: 1;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              height: 100%;
              padding: calc(@factor * 8px) 0 calc(@factor * 8px)
                calc(@factor * 36px);
              background-color: #353535;

              .image-index {
                position: absolute;
                top: calc(@factor * 32px);
                left: calc(@factor * 12px);
                font-weight: 500;
                font-size: calc(@factor * 8px);
              }

              .image-little-title {
                margin-bottom: calc(@factor * 6px);
                padding-left: calc(@factor * 3px);
                color: #fff;
                font-weight: 500;
                font-size: calc(@factor * 10px);
                line-height: calc(@factor * 28px);
              }

              .image-desc {
                width: calc(@factor * 110px);
                height: calc(@factor * 22px);
                padding: calc(@factor * 4px);
                overflow: hidden;
                color: #fff;
                font-size: calc(@factor * 7px);
                white-space: normal;
                text-align: left;
                text-overflow: ellipsis;
                word-wrap: break-word;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
            }
          }

          .image-link {
            margin-right: calc(@factor * 5px);
            color: #fff;
            font-size: calc(@factor * 7px);
            line-height: calc(@factor * 11px);
            cursor: pointer;
          }

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
          }
        }
      }

      .image-title {
        width: 100%;
        padding: calc(@factor * 10px);
        overflow: hidden;
        overflow: hidden;
        color: #fff;
        font-weight: 500;
        font-size: calc(@factor * 18px);
        white-space: normal;
        text-align: right;
      }

      ::v-deep(.tele-carousel-arrow) {
        position: absolute;
        top: calc(@factor * 16px);
        left: calc(@factor * 24px);
        display: flex;
        flex-direction: column-reverse;
        align-items: space-around;
        height: calc(@factor * 68px) !important;
        background-color: #fff;

        .tele-carousel-arrow-top {
          width: calc(@factor * 12px);
          height: calc(@factor * 12px);
        }

        svg {
          width: calc(@factor * 6px);
          height: calc(@factor * 6px);
        }

        .tele-carousel-arrow-bottom {
          width: calc(@factor * 12px);
          height: calc(@factor * 12px);
        }
      }
    }
  }
}

::v-deep(.tele-image) {
  .tele-image-img {
    width: calc(@factor * 122px) !important;
    height: calc(@factor * 68px) !important;
    object-fit: cover !important;
    border-radius: calc(@factor * 8px) !important;
  }
}

// .is-preview {
//   transform: scale(2); /* 将元素的尺寸放大2倍 */
//   transform-origin: 0 0; /* 设置缩放中心点 */
// }
</style>
