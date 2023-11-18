<template>
  <div class="container" :class="{ hasBg: props.bgIndex % 2 === 0 }">
    <div class="title">{{ props.templateData.moduleName }}</div>
    <div class="list">
      <img
        :style="{ height: imgHeight }"
        :src="`/server/web/file/download?name=${props.templateData.picUrl}&productId=${props.productId}`"
        alt=""
      />
      <span ref="wrapRef" class="wrap">
        <span class="subtitle">{{ block1.name }}</span>
        <span class="desc">{{ block1.desc }}</span>
        <span class="subtitle">{{ block2.name }}</span>
        <span class="desc">{{ block2.desc1 }}</span>
        <span class="desc">{{ block2.desc2 }}</span>
        <span class="desc">{{ block2.desc3 }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineProps } from 'vue';

const props = defineProps({
  templateData: {
    type: Object,
    default: () => {},
  },
  bgIndex: {
    type: Number,
    default: 0,
  },
  productId: String,
});

const wrapRef = ref();
const imgHeight = ref();

onMounted(() => {
  imgHeight.value = `${wrapRef.value.offsetHeight}px`;
});

// eslint-disable-next-line vue/no-setup-props-destructure
const [block1, block2] = props.templateData.blockList;
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-bottom: 20px;
  padding: 20px;

  &.hasBg {
    background-color: #fff;
  }

  .title {
    margin-bottom: 8px;
    padding: 12px 0;
    color: #1d2129;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px; /* 140% */
  }

  .list {
    display: flex;
    justify-content: start;

    img {
      width: 480px;
      //   height: 128px;
      margin-right: 24px;
    }

    .wrap {
      display: flex;
      flex-direction: column;

      .subtitle {
        margin-bottom: 8px;
        color: #1d2129;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px; /* 150% */
      }

      .desc {
        margin-bottom: 20px;
        color: #4e5969;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px; /* 157.143% */
      }
    }
  }
}
</style>
