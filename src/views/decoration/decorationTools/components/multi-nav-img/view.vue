<!-- 多导航图 -->
<template>
  <div class="nav-image-text-box">
    <div class="nav-image-text-title">
      {{ getInterceptString(data?.mainTitle, 20) || '主标题' }}
    </div>
    <div class="nav-image-text-content">
      <t-tabs :default-active-key="defaultKey" lazy-load>
        <t-tab-pane
          v-for="(item, index) in data?.configValue"
          :key="index"
          :title="getInterceptString(item.navTitle, 30) || '子导航'"
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
import { getInterceptString } from '@/utils';

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
      item.navTitle.length <= 30 &&
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
    margin: calc(@factor * 24px) auto calc(@factor * 12px);
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
  }

  .nav-image-text-content {
    :deep(.tele-tabs-nav::before) {
      width: calc(@factor * 600px);
      margin: 0 auto;
    }

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
      margin-top: calc(@factor * 16px);
    }

    .item-image {
      margin-bottom: calc(@factor * 24px);

      .image-cls {
        width: calc(@factor * 600px);
        height: calc(@factor * 260px);
      }

      .image-cls:hover {
        z-index: 2;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        transform: scale(1.01);
        transition: transform 0.5s, box-shadow 0.5s;
      }
    }
  }

  .mouse-cursor {
    cursor: pointer;
  }
}
</style>
