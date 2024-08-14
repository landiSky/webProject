<template>
  <div class="channel_header-box">
    <t-image
      :src="`/server/web/file/download?name=${
        data?.configValue?.src
      }&productId=${data?.productId || ''}`"
      :preview="false"
      class="image-cls"
    >
    </t-image>
    <div class="contnet-box">
      <div class="header-title"
        >{{ data?.configValue?.title || '主标题' }}
      </div>
      <div class="header-desc"
        >{{
          data?.configValue?.desc ||
          '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是'
        }}
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
  return isPreview.value ? 2 : 1;
});
const validate = () => {
  return new Promise((resolve, reject) => {
    if (
      // TODO 可能需要完善校验逻辑
      !data?.value?.configValue?.title ||
      !data?.value?.configValue?.desc
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

.channel_header-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: calc(@factor * 720px);
  height: calc(@factor * 280px);

  .contnet-box {
    position: absolute;
    top: calc(@factor * 90px);
    left: calc(@factor * 70px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: calc(@factor * 228px);
    height: calc(@factor * 100px);
    // background-color: red;
    .header-title {
      margin-bottom: calc(@factor * 15px);
      overflow: hidden;
      color: #000;
      font-weight: 500;
      font-size: calc(@factor * 14px);
      line-height: calc(@factor * 14px);
    }

    .header-desc {
      display: -webkit-box;
      width: 100%;
      overflow: hidden;
      color: #4e5969;
      font-size: calc(@factor * 7px);
      line-height: calc(@factor * 11px);
      white-space: normal;
      text-align: left;
      text-overflow: ellipsis;
      word-wrap: break-word;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

::v-deep(.tele-image) {
  .tele-image-img {
    width: calc(@factor * 718px) !important;
    height: calc(@factor * 280px) !important;
    object-fit: cover !important;
  }
}

// .mouse-cursor {
//   cursor: pointer;
// }
</style>
