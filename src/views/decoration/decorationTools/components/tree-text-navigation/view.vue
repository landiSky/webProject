<!-- 树状文本导航 -->
<template>
  <div class="nav-image-text-box">
    <div class="nav-image-text-title">
      {{ data?.mainTitle || '主标题' }}
    </div>
    <div class="nav-image-text-content">
      <t-tabs :default-active-key="defaultKey" lazy-load position="left">
        <t-tab-pane
          v-for="(item, index) in dataSortList"
          :key="index"
          :title="item.navTitle"
        >
          <div class="item-content">
            <div
              v-for="(contentItem, contentIndex) in item.contentList"
              :key="contentIndex"
              :class="{ 'mouse-cursor': contentItem?.linkType != 2 }"
              @click="clickLink(contentItem?.linkType, contentItem?.linkUrl)"
            >
              <div class="content-block">
                <div class="timezone">
                  <div class="timeDay">{{
                    formattedDate(contentItem.time).day
                  }}</div>
                  <div class="timeSlash">/</div>
                  <div class="timeContext">
                    <div class="timeMonth">
                      {{ formattedDate(contentItem.time).month }}月
                    </div>
                    <div class="timeYear">
                      {{ formattedDate(contentItem.time).year }}
                    </div>
                  </div>
                </div>
                <div class="line"></div>
                <div class="area">
                  <div class="headline">{{ contentItem.name }}</div>
                  <div class="introduce">{{ contentItem.desc }}</div>
                </div>
              </div>
              <t-divider />
            </div>
          </div>
        </t-tab-pane>
      </t-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, watch } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
  isPreview: Boolean,
});

const defaultKey = ref<number>(0);

const { data, isPreview } = toRefs(props);
const letterReg = /^[a-zA-Z\u4e00-\u9fa5]+$/;

const emit = defineEmits(['golink']);
const clickLink = (type: number, url: string) => {
  emit('golink', { type, url });
};

watch(
  () => props.data,
  (val: any) => {
    console.log('vertical image data左侧内容', val);
    defaultKey.value = 0;
  },
  { immediate: true, deep: true }
);

// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});
// 动态排序
const dataSortList = computed(() => {
  if (!isPreview.value) {
    return data?.value?.configValue;
  }
  const configValue = JSON.parse(JSON.stringify(data?.value?.configValue));
  const sortList = configValue.map((item: any) => {
    const params = item;
    const contentList = item.contentList.sort((front: any, after: any) => {
      return new Date(after.time).getTime() - new Date(front.time).getTime();
    });
    return {
      ...params,
      contentList,
    };
  });
  return sortList;
});
const checkContentBlockList = (list: []) => {
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    return (
      item.name &&
      item.name.length <= 40 &&
      letterReg.test(item.name) &&
      item.desc &&
      item.desc.length <= 200 &&
      (item.linkType === 2 ||
        (item.linkType !== 2 && item.linkUrl && item.linkUrl.length <= 500))
    );
  });
};
const checkConfigList = (list: []) => {
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    return (
      item.navTitle &&
      item.navTitle.length <= 6 &&
      letterReg.test(item.navTitle) &&
      checkContentBlockList(item.contentList)
    );
  });
};

const formattedDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return {
    year: `${year}`,
    month: `${month}`,
    day: `${day}`,
  };
};

const validate = () => {
  return new Promise((resolve, reject) => {
    if (
      // 可能需要完善校验逻辑
      !data?.value?.mainTitle ||
      !letterReg.test(data?.value?.mainTitle) ||
      data?.value?.mainTitle.length > 20 ||
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

.nav-image-text-box {
  align-items: center;
  width: 100%;
  height: calc(@factor * 403px);

  .nav-image-text-title {
    position: relative;
    width: calc(@factor * 130px);
    margin: calc(@factor * 24px) auto calc(@factor * 24px);
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
  }

  .nav-image-text-content {
    width: calc(@factor * 600px);
    margin: calc(@factor * 12px) auto calc(@factor * 24px);

    :deep(.tele-tabs-nav-vertical .tele-tabs-nav-ink) {
      display: none;
    }

    :deep(.tele-tabs-nav::before) {
      display: none;
    }

    :deep(.tele-tabs-nav-tab) {
      justify-content: center;
    }

    :deep(.tele-tabs-tab) {
      width: calc(@factor * 124px);
      height: calc(@factor * 27px);
      margin-top: calc(@factor * 4px);
      padding: calc(@factor * 8px) calc(@factor * 12px);
      // max-width: calc(@factor * 60px);
      color: #4e5969;
      font-weight: 500;
      font-size: calc(@factor * 8px);
      text-align: left;
      border: 1px solid #e5e8ef;
      border-radius: 4px;

      &.tele-tabs-tab-active {
        color: #1664ff;
        border: 1px solid #1664ff;
      }
    }

    :deep(.tele-tabs-tab:first-child) {
      margin-top: 0;
    }

    :deep(.tele-tabs-left.tele-tabs-vertical .tele-tabs-content) {
      padding-left: calc(@factor * 12px);
    }

    :deep(.tele-tabs-tab-title) {
      display: -webkit-box;
      padding: 0;
      overflow: hidden;
      color: #1d2129;
      font-weight: 500;
      font-size: calc(@factor * 7px);
      font-family: PingFang SC;
      line-height: calc(@factor * 11px);
      white-space: normal;
      text-align: left;
      text-overflow: ellipsis;
      word-wrap: break-word;
      word-break: break-all;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    :deep(.tele-tabs-nav-type-line .tele-tabs-tab-title::before) {
      background-color: #fff;
    }

    .item-content {
      display: flex;
      flex-direction: column;
      gap: calc(@factor * 10px);
      height: calc(@factor * 325px);
      padding: calc(@factor * 10px);
      overflow: auto;
      background: linear-gradient(
        232.67deg,
        #e9edf5 -13.08%,
        rgba(247, 248, 250, 0) 77.6%
      );
      border: 1px solid rgba(229, 232, 239, 1);
      border-radius: 4px;

      .content-block {
        display: flex;
        flex-direction: row;
        color: #1d2129;
        font-family: PingFang SC;

        .timezone {
          display: flex;
          align-items: center;
          font-weight: 400;
          text-align: left;

          .timeDay {
            width: calc(@factor * 21px);
            height: calc(@factor * 22px);
            color: #1d2129;
            font-size: calc(@factor * 18px);
            line-height: calc(@factor * 22px);
          }

          .timeSlash {
            margin: 0 calc(@factor * 2px);
            color: #86909c;
            font-size: calc(@factor * 10px);
            line-height: calc(@factor * 19px);
          }

          .timeContext {
            width: calc(@factor * 16px);
            height: calc(@factor * 21px);

            .timeMonth {
              color: #1d2129;
              font-size: calc(@factor * 7px);
              line-height: calc(@factor * 11px);
            }

            .timeYear {
              color: #1d2129;
              font-size: calc(@factor * 6px);
              line-height: calc(@factor * 10px);
            }
          }
        }

        .line {
          width: 1px;
          margin: 0 calc(@factor * 12px);
          background: #e5e8ef;
        }

        .area {
          .headline {
            display: -webkit-box;
            overflow: hidden;
            color: rgba(29, 33, 41, 1);
            font-weight: 500;
            font-size: calc(@factor * 8px);
            line-height: calc(@factor * 12px);
            white-space: normal;
            text-align: left;
            text-overflow: ellipsis;
            word-wrap: break-word;
            word-break: break-all;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }

          .introduce {
            display: -webkit-box;
            margin-top: 12px;
            overflow: hidden;
            color: rgba(78, 89, 105, 1);
            font-weight: 400;
            font-size: calc(@factor * 7px);
            line-height: calc(@factor * 11px);
            white-space: normal;
            text-align: left;
            text-overflow: ellipsis;
            word-wrap: break-word;
            word-break: break-all;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }

  .mouse-cursor {
    cursor: pointer;
  }
}
</style>
