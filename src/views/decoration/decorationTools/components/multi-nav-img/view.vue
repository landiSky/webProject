<!-- 多导航图 -->
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
            <div class="item-image">
              <img
                :src="`/server/web/file/download?name=${item?.src}&productId=${
                  data?.productId || ''
                }`"
                fit="cover"
                class="image-cls"
                :class="{ 'mouse-cursor': item?.linkType != 2 }"
                @click="clickLink(item?.linkType, item?.linkUrl)"
              />
            </div>
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
    return (
      item.navTitle &&
      item.navTitle.length <= 6 &&
      letterReg.test(item.navTitle) &&
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
  // height: calc(@factor * 405px);
  height: calc(@factor * 378px);

  .nav-image-text-title {
    position: relative;
    display: -webkit-box;
    width: calc(@factor * 130px);
    margin: calc(@factor * 24px) auto calc(@factor * 12px);
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
    white-space: normal;
    text-overflow: ellipsis;
    word-wrap: break-word;
    word-break: break-all;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .nav-image-text-content {
    :deep(.tele-tabs-nav-tab) {
      justify-content: center;
    }

    :deep(.tele-tabs-tab) {
      max-width: calc(@factor * 60px);
      margin: 0 calc(@factor * 10px);
      color: #4e5969;
      font-weight: 500;
      font-size: calc(@factor * 8px);

      &.tele-tabs-tab-active {
        color: #1664ff;
      }
    }

    :deep(.tele-tabs-tab-title) {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
    }

    .item-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: calc(@factor * 16px);
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

  .mouse-cursor {
    cursor: pointer;
  }
}
</style>
