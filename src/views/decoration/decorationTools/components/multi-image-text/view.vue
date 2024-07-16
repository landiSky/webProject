<!-- 多图文:style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')' }"-->
<template>
  <div class="multi-image-text-box" style="position: relative">
    <div class="multi-image-text-title">{{ data?.mainTitle || '主标题' }}</div>
    <div class="image-box" style="position: relative">
      <div
        v-for="(item, index) in data?.configValue"
        :key="index"
        :style="boxStyle"
        class="image-item"
      >
        <span class="image-title">{{ item?.title || '小标题' }}</span>
        <t-image
          :src="`/server/web/file/download?name=${item?.src}`"
          :preview="false"
          class="image-cls"
        />
        <span class="image-desc">{{ item?.desc || '图片简介' }}</span>
        <span
          v-if="item?.linkType !== 2"
          class="image-link"
          @click="clickLink(item?.linkType, item?.linkUrl)"
          >查看详情>>
        </span>
      </div>
    </div>
    <div v-if="showArrow" class="left-icon-box" @click="clickLeft">
      <icon-left :style="{ color: atEndOfList ? '#C9CDD4' : '#1d2129' }" />
    </div>
    <div v-if="showArrow" class="right-icon-box" @click="clickRight">
      <icon-right :style="{ color: atHeadOfList ? '#C9CDD4' : '#1d2129' }" />
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
const currentOffset = ref(0);
const windowSize = ref(4);
const paginationFactor = 163 * num.value;

const boxStyle = computed(() => {
  return {
    transform: `translateX(${currentOffset.value}px)`,
  };
});
// 当前开始的索引，展示往后4张图片
// const curShowIndex = ref(0);
// const listLength = computed(() => {
//   const list: any[] = Object.values(data?.value?.configValue);
//   console.log('list0000000', list, data?.value?.configValue);
//   return list.length;
// });

// const currentOffset = computed(() => {
//   return (

//   );
// });

const showArrow = computed(() => {
  return Object.values(data?.value?.configValue).length > 4;
});

const atEndOfList = computed(() => {
  const n =
    paginationFactor *
    -1 *
    (Object.values(data?.value?.configValue).length - windowSize.value);
  console.log('atEndOfList', atEndOfList, n);
  return currentOffset.value <= n;
});

const atHeadOfList = computed(() => {
  return currentOffset.value === 0;
});

const moveCarousel = (direction: number) => {
  if (direction === 1 && !atEndOfList.value) {
    currentOffset.value -= paginationFactor;
    console.log('offset', currentOffset.value);
  } else if (direction === -1 && !atHeadOfList.value) {
    currentOffset.value += paginationFactor;
    console.log('offset', currentOffset.value);
  }
};

const clickLink = (type: number, url: string) => {
  if (type === 0) {
    // 外部链接
    window.open(url);
  } else if (type === 1) {
    // TODO: 商品搜索页
  }
};

watch(
  () => props.data,
  (val: any) => {
    console.log('multi image data', val);
    currentOffset.value =
      paginationFactor *
      -1 *
      (Object.values(data?.value?.configValue).length - windowSize.value);
  },
  { immediate: true, deep: true }
);

// const initTranslateXList = () => {
//   const list: number[] = [];
//   let n = 0;
//   Object.values(data?.value?.configValue).forEach(
//     (item: any, index: number) => {
//       n += index * 30 * num.value;
//       list.push(n);
//     }
//   );
//   return list;
// };

// const dataListChangeRight = () => {
//   console.log('9090901111000000', translateXList.value);
//   intervalId = setInterval(() => {
//     translateXList.value.forEach((item, i) => {
//       console.log('9090901111000000', item, i);
//       if (item <= 148 * num.value) {
//         console.log('移动到位了');
//         // 跳出定时循环
//         clearInterval(intervalId);
//       } else {
//         translateXList.value[i] = item + 10;
//         console.log('移动中。。。', translateXList.value);
//       }
//     });
//   }, 10);
// };

const clickLeft = () => {
  moveCarousel(1);
};
const clickRight = () => {
  moveCarousel(-1);
};

const checkConfigList = (list: []) => {
  console.log('竖图遍历000', list.length);
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    console.log('竖图遍历000', item);
    return (
      !item.title ||
      !item.desc ||
      !item.src ||
      (item.linkType === 2 && !item.linkUrl)
    );
  });
};

const validate = () => {
  return new Promise((resolve, reject) => {
    if (
      // 可能需要完善校验逻辑
      !data?.value?.mainTitle ||
      checkConfigList(data?.value?.configValue.value)
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
  height: calc(@factor * 340px);

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
    height: calc(@factor * 260px);
    padding-left: calc(@factor * 33px);
    // background-color: rgb(168, 158, 158);
    overflow: hidden;

    .image-item {
      position: relative;
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: calc(@factor * 148px);
      min-width: calc(@factor * 148px);
      max-width: calc(@factor * 148px);
      height: calc(@factor * 180px);
      margin: 0 calc(@factor * 7.5px);
      background-color: white;
      transition: transform 200ms ease-out, box-shadow 0.4s ease;

      .image-title {
        overflow: hidden;
        color: #1d2129;
        font-weight: 500;
        font-size: calc(@factor * 8px);
        line-height: calc(@factor * 26px);
        white-space: normal;
        text-align: center;
      }

      .image-desc {
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(@factor * 110px);
        margin: calc(@factor * 5px) 0;
        overflow: hidden;
        color: #4e5969;
        font-size: calc(@factor * 7px);
        white-space: normal;
        text-align: left;
        text-overflow: ellipsis;
      }

      .image-link {
        color: #1664ff;
        font-size: calc(@factor * 7px);
        cursor: pointer;
      }
      // .image-cls {
      //   width: calc(@factor * 100px);
      //   height: calc(@factor * 100px);
      //   margin-top: calc(@factor * 5px);

      //   .tele-image-img {
      //     width: calc(@factor * 100px) !important;
      //     height: calc(@factor * 100px) !important;
      //     object-fit: cover !important;
      //   }
      // }
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

::v-deep(.tele-image) {
  .tele-image-img {
    width: calc(@factor * 100px) !important;
    height: calc(@factor * 100px) !important;
    object-fit: cover !important;
  }
}
// .is-preview {
//   transform: scale(2); /* 将元素的尺寸放大2倍 */
//   transform-origin: 0 0; /* 设置缩放中心点 */
// }
</style>
