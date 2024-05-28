<template>
  <div class="review-modal">
    <t-modal
      v-model:visible="visible"
      :width="572"
      :height="390"
      :on-before-ok="onConfirm"
      ok-text="确定"
      @cancel="emitflag"
    >
      <template #title> 评价订单 </template>
      <div class="reviewContent">
        <div class="row-review">
          <div>总体评价</div>
          <t-rate
            v-model="reviewContent.totalStar"
            :default-value="0"
            allow-half
          />
          <span v-if="reviewContent.totalStar !== 0"
            >{{ reviewContent.totalStar }}星
          </span>
        </div>
        <div class="row-review">
          <div>产品评价</div>
          <t-rate
            v-model="reviewContent.productStar"
            :default-value="0"
            allow-half
          />
          <span v-if="reviewContent.productStar !== 0"
            >{{ reviewContent.productStar }}星</span
          >
        </div>
        <div class="row-review">
          <div>服务评价</div>
          <t-rate
            v-model="reviewContent.serviceStar"
            :default-value="0"
            allow-half
          />
          <span v-if="reviewContent.serviceStar !== 0"
            >{{ reviewContent.serviceStar }}星</span
          >
        </div>
        <div class="row-review">
          <div>交付评价</div>
          <t-rate
            v-model="reviewContent.deliveryStar"
            :default-value="0"
            allow-half
          />
          <span v-if="reviewContent.deliveryStar !== 0"
            >{{ reviewContent.deliveryStar }}星</span
          >
        </div>

        <div class="row-review-content">
          <t-textarea
            v-model="reviewContent.content"
            placeholder="请输入评价详情"
            :max-length="300"
            allow-clear
            show-word-limit
          />
        </div>
      </div>
    </t-modal>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, ref, onMounted } from 'vue';
import { Message } from '@tele-design/web-vue';
import { orderEvaluate } from '@/api/order';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);
const reviewContent = ref({
  totalStar: 0,
  productStar: 0,
  serviceStar: 0,
  deliveryStar: 0,
  content: '',
});
const visible = ref(true);
const state = reactive({
  formModel: {
    userId: '',
    companyId: '',
    orderId: '',
  },
});
const onConfirm = (done: (closed: boolean) => void) => {
  if (
    reviewContent.value.totalStar === 0 ||
    reviewContent.value.productStar === 0 ||
    reviewContent.value.serviceStar === 0 ||
    reviewContent.value.deliveryStar === 0
  ) {
    Message.warning('请先评价订单');
    done(false);
  } else {
    // 提交接口
    orderEvaluate({
      ...state.formModel,
      totalStar: reviewContent.value.totalStar,
      productStar: reviewContent.value.productStar,
      serviceStar: reviewContent.value.serviceStar,
      deliveryStar: reviewContent.value.deliveryStar,
      content: reviewContent.value.content,
    }).then((res) => {
      done(true);
      emit('confirm');
    });
  }
};
const emitflag = () => {
  emit('cancel');
};

onMounted(() => {
  const { userId, companyId, orderId } = props.data;
  state.formModel = { userId, companyId, orderId };
  console.log('props.data', props.data);
});
</script>

<style scoped lang="less">
// .review-modal {
//   :deep(.tele-modal-body) {
//     padding: 0 !important;
//   }
// }
.reviewContent {
  .row-review {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 4px;
    color: #4e5969;
    font-size: 12px;

    > div {
      margin-right: 12px;
    }

    ::v-deep(.tele-icon) {
      width: 20px;
      height: 20px;
    }
  }

  .row-review-content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 10px;
    color: #4e5969;
    font-size: 12px;
  }
}
</style>
