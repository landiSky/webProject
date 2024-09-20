<!-- 三图 -->
<template>
  <div class="vertical-image-text-box" :class="{ 'is-preview': isPreview }">
    <div class="vertical-image-text-title">{{
      data?.mainTitle || '主标题'
    }}</div>
    <div class="image-box">
      <div
        v-for="(item, index) in data?.configValue"
        :key="index"
        class="image-item"
      >
        <span class="image-title">{{ item?.title || '小标题' }}</span>
        <t-image
          :src="`/server/web/file/download?name=${item?.src}&productId=${
            data?.productId || ''
          }`"
          :preview="false"
          :class="{ 'mouse-cursor': item?.linkType != 2 }"
          @click="clickLink(item?.linkType, item?.linkUrl)"
        ></t-image>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, watch } from 'vue';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});
const { data, isPreview } = toRefs(props);

const emit = defineEmits(['golink']);
const clickLink = (type: number, url: string) => {
  emit('golink', { type, url });
};

watch(
  () => props.data,
  (val: any) => {
    console.log('vertical image data', val);
  },
  { immediate: true, deep: true }
);

// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});
const checkConfigList = (list: any) => {
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    return (
      item.title &&
      item.title.length < 20 &&
      item.src &&
      (item.linkType === 2 ||
        (item.linkType !== 2 && item.linkUrl && item.linkUrl.length < 500))
    );
  });
};

const validate = () => {
  return new Promise((resolve, reject) => {
    if (
      // 可能需要完善校验逻辑
      !data?.value?.mainTitle ||
      data?.value?.mainTitle.length > 10 ||
      !checkConfigList(Object.values(data?.value?.configValue))
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

.vertical-image-text-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  .vertical-image-text-title {
    width: calc(@factor * 130px);
    margin: calc(@factor * 24px) 0 calc(@factor * 12px);
    overflow: hidden;
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
  }

  .image-box {
    display: flex;
    gap: calc(@factor * 15px);
    align-items: center;
    justify-content: flex-start;
    margin-top: calc(@factor * 12px);
    padding-bottom: calc(@factor * 24px);

    .image-item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: calc(@factor * 190px);

      .image-title {
        margin-bottom: calc(@factor * 8px);
        overflow: hidden;
        color: #1d2129;
        font-weight: 400;
        font-size: calc(@factor * 8px);
        font-family: PingFang SC;
        line-height: calc(@factor * 12px);
        white-space: nowrap;
        text-align: left;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
      }
    }

    .image-item:hover {
      box-shadow: 6px 6px 20px 2px #7e7e7e40;
      transform: scale(1.05);
      transition: 0.5s;
    }
  }
}

::v-deep(.tele-image) {
  .tele-image-img {
    width: calc(@factor * 190px) !important;
    height: calc(@factor * 253px) !important;
    object-fit: cover !important;
  }
}

.mouse-cursor {
  cursor: pointer;
}
</style>
