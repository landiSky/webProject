<template>
  <div class="channel_header-box">
    <t-image
      :src="`/server/web/file/download?name=${
        data?.configValue?.src
      }&productId=${data?.productId || ''}`"
      :preview="false"
      class="image-cls"
      width="100%"
    >
    </t-image>
    <div class="contnet-box">
      <div class="header-title"
        >{{ getInterceptString(data?.mainTitle, 20) || '主标题' }}
      </div>
      <div class="header-desc"
        >{{
          getInterceptString(data?.configValue?.desc, 500) ||
          '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是'
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';
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
const validate = () => {
  return new Promise((resolve, reject) => {
    if (
      // TODO 可能需要完善校验逻辑
      !data?.value?.mainTitle ||
      data?.value?.mainTitle.length > 20 ||
      !data?.value?.configValue?.desc ||
      data?.value?.configValue?.desc.length > 500
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
  width: 100%;
  height: auto;
  background-color: transparent;

  .contnet-box {
    position: absolute;
    top: calc(@factor * 10%);
    left: calc(@factor * 7%);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: calc(@factor * 240px);

    .header-title {
      margin-bottom: calc(@factor * 15px);
      overflow: hidden;
      color: #000;
      font-weight: 500;
      font-size: calc(@factor * 12px);
      line-height: calc(@factor * 16px);
    }

    .header-desc {
      display: -webkit-box;
      width: 100%;
      color: #4e5969;
      font-size: calc(@factor * 7px);
      line-height: calc(@factor * 11px);
      text-align: left;
      word-break: break-all;
    }
  }
}

::v-deep(.tele-image) {
  .tele-image-img {
    width: 100%;
    height: calc(@factor * 280px) !important;
    object-fit: cover !important;
  }
}

// .mouse-cursor {
//   cursor: pointer;
// }
</style>
