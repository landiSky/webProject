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
          <t-rate v-model="reviewContent.total" :default-value="0" allow-half />
          <span v-if="reviewContent.total !== 0"
            >{{ reviewContent.total }}星
          </span>
        </div>
        <div class="row-review">
          <div>产品评价</div>
          <t-rate
            v-model="reviewContent.product"
            :default-value="0"
            allow-half
          />
          <span v-if="reviewContent.product !== 0"
            >{{ reviewContent.product }}星</span
          >
        </div>
        <div class="row-review">
          <div>服务评价</div>
          <t-rate
            v-model="reviewContent.server"
            :default-value="0"
            allow-half
          />
          <span v-if="reviewContent.server !== 0"
            >{{ reviewContent.server }}星</span
          >
        </div>
        <div class="row-review">
          <div>交付评价</div>
          <t-rate
            v-model="reviewContent.logistics"
            :default-value="0"
            allow-half
          />
          <span v-if="reviewContent.logistics !== 0"
            >{{ reviewContent.logistics }}星</span
          >
        </div>

        <div class="row-review-content">
          <t-textarea
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

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);
const reviewContent = ref({
  total: 0,
  product: 0,
  server: 0,
  logistics: 0,
  content: '8989898989898989',
  date: '2024-10-20',
});
const visible = ref(true);
const state = reactive({
  formModel: {
    id: '',
  },
});
const onConfirm = (done: (closed: boolean) => void) => {
  if (
    reviewContent.value.total === 0 ||
    reviewContent.value.product === 0 ||
    reviewContent.value.server === 0 ||
    reviewContent.value.logistics === 0
  ) {
    Message.warning('请先评价订单');
    done(false);
  } else {
    // todo 提交接口
    done(true);
    emit('confirm');
  }
};
const emitflag = () => {
  emit('cancel');
};

onMounted(() => {
  const { id } = props.data;
  state.formModel = { id };
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
