<!-- 竖图文 -->
<template>
  <div class="vertical-image-text-box">
    <div class="vertical-image-text-title">{{
      getInterceptString(data?.mainTitle, 20) || '主标题'
    }}</div>
    <div class="image-box">
      <div
        v-for="(item, index) in data?.configValue"
        :key="index"
        class="image-item"
        :class="[index === curUnFoldIndex ? 'itemhover' : '']"
        @mouseenter="unfold(index)"
      >
        <img
          :src="`/server/web/file/download?name=${item?.src}&productId=${
            data?.productId || ''
          }`"
          fit="cover"
          :preview="false"
          class="image-cls"
        />
        <div class="image-item-content">
          <span class="image-title">{{
            getInterceptString(item?.title, 6) || '小标题'
          }}</span>
          <span class="image-desc">{{
            getInterceptString(item?.desc, 200) ||
            '我是简介我是简介我是简介我是简介'
          }}</span>
          <span
            v-if="item?.linkType !== 2"
            class="image-link"
            @click="clickLink(item?.linkType, item?.linkUrl)"
            >详情>>
          </span>
        </div>
        <div class="mask-box" :class="[`mask-box${index + 1}`]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, watch } from 'vue';
import { getInterceptString } from '@/utils';

const props = defineProps({
  data: Object,
  isPreview: Boolean,
});
const emit = defineEmits(['golink']);
const curUnFoldIndex = ref(1);
const { data, isPreview } = toRefs(props);

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

const unfold = (index: number) => {
  curUnFoldIndex.value = index;
};

// 动态倍数
const num = computed(() => {
  return isPreview.value ? 2 : 1;
});
const checkConfigList = (list: any) => {
  if (!list || list.length === 0) return false;
  return list.every((item: any) => {
    return (
      item.title &&
      item.title.length <= 6 &&
      item.desc &&
      item.desc.length <= 200 &&
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
      data?.value?.mainTitle.length > 20 ||
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

@keyframes fadeIn {
  0%,
  40% {
    opacity: 0;
  }

  50% {
    opacity: 0.7;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0%,
  20% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes maskFadeIn {
  0%,
  40% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.vertical-image-text-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding-bottom: calc(@factor * 20px);
  // height: calc(@factor * 380px);
  .vertical-image-text-title {
    width: calc(@factor * 720px);
    margin: calc(@factor * 20px) 0 calc(@factor * 10px);
    overflow: hidden;
    color: #1d2129;
    font-weight: 500;
    font-size: calc(@factor * 12px);
    line-height: calc(@factor * 14px);
  }

  .image-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(@factor * 240px);
    padding: 0 calc(@factor * 2.5px);
    // background-color: red;
    .image-item {
      position: relative;
      display: block;
      width: calc(@factor * 96px);
      height: calc(@factor * 230px);
      padding: 0 calc(@factor * 2.5px);
      background-color: transparent;
      transition: width 0.5s;

      .mask-box {
        position: absolute;
        z-index: 1;
        width: calc(@factor * 91px);
        height: calc(@factor * 230px);
        padding: 0 calc(@factor * 2.5px);
        animation: maskFadeIn 0.8s ease 1;
      }
      //默认展开的cls
      .mask-box1,
      .mask-box5 {
        background: linear-gradient(
          180deg,
          #00fff0 0%,
          rgba(128, 179, 255, 0.7) 50%,
          rgba(255, 255, 255, 0.2) 100%
        );
        animation: maskFadeIn 0.8s ease 1;
      }

      .mask-box2,
      .mask-box3,
      .mask-box4 {
        background: linear-gradient(
          180deg,
          #06f 0%,
          rgba(128, 179, 255, 0.7) 50%,
          rgba(255, 255, 255, 0.2) 100%
        );
        animation: maskFadeIn 0.8s ease 1;
      }

      .image-cls {
        float: right;
        width: calc(@factor * 91px);
        height: 100%;
        transition: width 0.5s;
      }

      .image-item-content {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding: calc(@factor * 10px);
        animation: fadeOut 1s ease 1;

        .image-title {
          color: #fff;
          font-weight: 500;
          font-size: calc(@factor * 8px);
          line-height: calc(@factor * 12px);
          text-align: left;
        }

        .image-desc {
          display: -webkit-box;
          // width: calc(@factor * 70px);
          margin: calc(@factor * 5px) 0;
          overflow: hidden;
          font-size: calc(@factor * 7px);
          line-height: calc(@factor * 11px);
          white-space: normal;
          text-align: left;
          text-overflow: ellipsis;
          word-wrap: break-word;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .image-link {
          color: #fff;
          font-size: calc(@factor * 7px);
          cursor: pointer;
        }
      }
    }

    .itemhover::before {
      position: absolute;
      top: 0;
      right: calc(@factor * 2.5px);
      bottom: 0;
      left: calc(@factor * 2.5px);
      background: linear-gradient(
        to right,
        rgb(236, 239, 245) 50%,
        rgba(207, 220, 244, 0.8)
      );
      content: '';
    }

    // .image-item:hover::before {
    //   position: absolute;
    //   top: 0;
    //   right: calc(@factor * 2.5px);
    //   bottom: 0;
    //   left: calc(@factor * 2.5px);
    //   background: linear-gradient(
    //     to right,
    //     rgb(236, 239, 245) 40%,
    //     rgba(207, 220, 244, 0.8)
    //   );
    //   content: '';
    // }

    // .image-item:hover {
    //   width: calc(@factor * 204px);
    //   .mask-box {
    //     background: transparent;
    //     animation: fadeIn 1s ease 1;
    //   }
    //   .image-cls {
    //     float: right;
    //     width: calc(@factor * 120px);
    //     height: 100%;
    //   }

    //   .image-item-content {
    //     animation: fadeIn 1s ease 1;

    //     .image-title,
    //     .image-link {
    //       color: #1d2129;
    //     }

    //     .image-desc {
    //       display: -webkit-box;
    //       // width: calc(@factor * 182px);
    //       -webkit-line-clamp: 6;
    //       color: #4e5969;
    //     }
    //   }
    // }
    .itemhover {
      width: calc(@factor * 204px);

      .mask-box {
        background: transparent;
        animation: fadeIn 1s ease 1;
      }

      .image-cls {
        float: right;
        width: calc(@factor * 108px);
        height: 100%;
      }

      .image-item-content {
        animation: fadeIn 0.8s ease 1;

        .image-title,
        .image-link {
          color: #1d2129;
        }

        .image-desc {
          display: -webkit-box;
          width: calc(@factor * 182px);
          overflow: visible;
          color: #4e5969;
          line-height: calc(@factor * 11px);
          -webkit-line-clamp: unset;
        }
      }
    }
  }
}
</style>
