<template>
  <div class="nav-image-text-box">
    <div class="nav-image-text-title">
      {{ data?.mainTitle || '主标题' }}
    </div>
    <div class="nav-image-text-content">
      <t-tabs :default-active-key="defaultKey" lazy-load>
        <t-tab-pane
          v-for="(item, index) in data?.configValue"
          :key="index"
          :title="item.navTitle"
        >
          <div class="item-content">
            <div class="item-title-section">
              <div class="item-title">{{
                item?.title || '名称名称名称名称名称名称名称名称名称名称'
              }}</div>
              <div
                v-if="item?.linkType !== 2"
                class="image-link"
                @click="clickLink(item?.linkType, item?.linkUrl)"
                >查看详情>>
              </div>
            </div>
            <div class="item-desc">{{
              item?.desc ||
              '简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字'
            }}</div>
          </div>
        </t-tab-pane>
      </t-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, watch, onMounted } from 'vue';

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

console.log('props data', data.value.configValue);

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
const checkConfigList = (list: []) => {
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    console.log('竖图遍历', item);
    return (
      item.navTitle &&
      item.navTitle.length <= 6 &&
      letterReg.test(item.navTitle) &&
      item.desc &&
      item.desc.length <= 400 &&
      item.title &&
      item.title.length <= 20 &&
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
      !letterReg.test(data?.value?.mainTitle) ||
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
  // display: flex;
  // flex-direction: column;
  align-items: center;
  // justify-content: flex-start;
  width: 100%;
  height: calc(@factor * 191px);

  .nav-image-text-title {
    position: relative;
    width: calc(@factor * 720px);
    margin: calc(@factor * 20px) auto;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
  }

  .nav-image-text-content {
    :deep(.tele-tabs-nav-tab) {
      justify-content: center;
    }

    :deep(.tele-tabs-tab) {
      color: #4e5969;
      font-weight: 500;
      font-size: calc(@factor * 8px);

      &.tele-tabs-tab-active {
        color: #1664ff;
      }
    }

    .item-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .item-title-section {
      display: flex;
      justify-content: space-between;
      width: calc(@factor * 600px);
      margin-top: calc(@factor * 16px);
      line-height: calc(@factor * 12px);
    }

    .item-title {
      color: #4e5969;
      font-weight: 500;
      font-size: calc(@factor * 8px);
      text-align: left;
    }

    .image-link {
      // margin-top: calc(@factor * 2px);
      color: #1664ff;
      font-weight: 400;
      font-size: calc(@factor * 7px);
      font-family: PingFang SC;
      text-align: left;
      cursor: pointer;
    }

    .item-desc {
      width: calc(@factor * 600px);
      margin-top: calc(@factor * 11px);
      margin-bottom: calc(@factor * 8px);
      color: #4e5969;
      font-size: calc(@factor * 7px);
      line-height: calc(@factor * 11px);
      white-space: normal;
      text-align: left;
      text-overflow: ellipsis;
    }

    .item-image {
      margin-bottom: calc(@factor * 24px);
      overflow: hidden;

      .image-cls {
        width: calc(@factor * 600px);
        height: calc(@factor * 260px);
      }
    }
  }
}
</style>
