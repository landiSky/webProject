<!-- 图标叠文:style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')' }"-->
<template>
  <div class="multi-icon-text-box" style="position: relative">
    <div class="multi-icon-text-title">{{ data?.mainTitle || '主标题' }}</div>
    <div class="image-box" style="position: relative">
      <div
        v-for="(item, index) in data?.configValue"
        :key="index"
        class="content-item"
      >
        <t-image
          :src="`/server/web/file/download?name=${item?.src}&productId=${
            data?.productId || ''
          }`"
          :preview="false"
          class="image-item"
        />
        <div class="text-item">
          <span class="image-title">{{ item?.title || '小标题' }}</span>
          <span class="image-desc">{{
            item?.desc || '我是副标题我是副标题我是副标题我是副标题'
          }}</span>
          <span
            v-if="item?.linkType !== 2"
            class="image-link"
            @click="clickLink(item?.linkType, item?.linkUrl)"
            >查看详情>>
          </span>
        </div>
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
  console.log('竖图遍历000', list.length);
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    console.log('竖图遍历000', item);
    return (
      item.title &&
      item.title.length <= 8 &&
      item.desc &&
      item.desc.length <= 100 &&
      item.src &&
      (item.linkType === 2 ||
        (item.linkType !== 2 && item.linkUrl && item.linkUrl.length <= 500))
    );
  });
};

const validate = () => {
  console.log('开始检验了000', data?.value);
  return new Promise((resolve, reject) => {
    if (
      // 可能需要完善校验逻辑
      !data?.value?.mainTitle ||
      !checkConfigList(Object.values(data?.value?.configValue))
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

.multi-icon-text-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: calc(@factor * 720px);
  height: auto;
  // height: calc(@factor * 340px);
  .multi-icon-text-title {
    width: 100%;
    margin: calc(@factor * 20px) 0 calc(@factor * 17px);
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
  }

  .image-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    width: calc(@factor * 720px);
    padding-bottom: calc(@factor * 20px);
    // height: calc(@factor * 260px);
    padding-left: calc(@factor * 33px);
    // background-color: rgb(168, 158, 158);
    overflow: hidden;

    .content-item {
      position: relative;
      display: inline-block;
      display: flex;
      justify-content: flex-start;
      width: calc(@factor * 195px);
      height: calc(@factor * 104px);
      margin-top: calc(@factor * 12px);
      margin-right: calc(@factor * 15px);
      padding: calc(@factor * 4px);
      text-align: left;
      background-color: white;
      transition: transform 200ms ease-out, box-shadow 0.4s ease;

      .text-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .image-item {
        width: calc(@factor * 40px);
        height: calc(@factor * 40px);
        margin-right: calc(@factor * 5px);

        :deep(.tele-image-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .image-title {
        display: inline-block;
        margin-bottom: calc(@factor * 5px);
        overflow: hidden;
        color: #1d2129;
        font-weight: 500;
        font-size: calc(@factor * 8px);
        line-height: calc(@factor * 12px);
        white-space: normal;
        text-align: center;
      }

      .image-desc {
        display: inline-block;
        width: calc(@factor * 142px);
        margin-bottom: calc(@factor * 5px);
        // overflow: hidden;
        color: #4e5969;
        font-size: calc(@factor * 7px);
        line-height: calc(@factor * 11px);
        white-space: normal;
        text-overflow: ellipsis;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .image-link {
        color: #1664ff;
        font-size: calc(@factor * 7px);
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

    .image-item:hover {
      box-shadow: 6px 6px 10px 6px #7e7e7e40;
      // transform: scale(1.05);//和平移效果冲突，暂时去掉
      // transition: 0.5s;
      // filter: blur(1px); /* 轻微模糊 */
    }
  }

  .left-icon-box {
    position: absolute;
    top: 58%;
    left: calc(@factor * 24px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(@factor * 24px);
    height: calc(@factor * 24px);
    background-color: #ffffffe5;
    border-radius: 50%;
    box-shadow: 0 1.68px 6.74px 0 #0000001a;
    cursor: pointer;
  }

  .right-icon-box {
    position: absolute;
    top: 58%;
    right: calc(@factor * 24px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(@factor * 24px);
    height: calc(@factor * 24px);
    background-color: #ffffffe5;
    border-radius: 50%;
    box-shadow: 0 1.68px 6.74px 0 #0000001a;
    cursor: pointer;
  }
}

// ::v-deep(.tele-image) {
//   .tele-image-img {
//     width: calc(@factor * 80px) !important;
//     height: calc(@factor * 80px) !important;
//     object-fit: cover !important;
//   }
// }
// .is-preview {
//   transform: scale(2); /* 将元素的尺寸放大2倍 */
//   transform-origin: 0 0; /* 设置缩放中心点 */
// }
</style>
