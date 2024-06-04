<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :on-before-ok="onConfirm"
    popup-container="#modalPrice"
    @cancel="emit('cancel')"
  >
    <template #title> 修改订单价格 </template>
    <t-form
      ref="formRef"
      :model="state.formModel"
      :rules="formRules"
      auto-label-width
    >
      <t-form-item label="订单号">
        <span>{{ state.formModel.orderid }}</span>
      </t-form-item>

      <t-form-item label="当前价格">
        <p
          v-if="state.formModel.currentamount"
          style="font-weight: 500; font-size: 14px"
          >￥{{ state.formModel.currentamount }}</p
        >
        <p v-else style="font-weight: 500; font-size: 14px">面议</p>
      </t-form-item>
      <t-form-item
        field="amount"
        label="修改金额"
        :validate-trigger="['change', 'input']"
      >
        <t-input-number
          v-model="state.formModel.amount"
          placeholder="请输入"
          class="input-demo"
          :precision="2"
          :step="1"
          :min="0.0"
          allow-clear
          model-event="input"
        />
      </t-form-item>
    </t-form>
    <template #footer>
      <div
        style="
          flex: 1;
          float: left;
          max-width: 70%;
          padding-top: 4px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        "
      >
        <span style="margin-right: 10px; color: #4e5969; font-size: 12px"
          >买家需支付金额</span
        >
        <span
          style="
            padding-bottom: 10px;
            color: #e63f3f;
            font-weight: 500;
            font-size: 16px;
          "
        >
          ￥{{ needPaySum }}
        </span>
      </div>
      <t-button variant="outline" @click="emit('cancel')">取消</t-button>
      <t-button type="primary" @click="onConfirm">确定</t-button>
    </template>
  </t-modal>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  reactive,
  ref,
  onMounted,
  computed,
  watch,
} from 'vue';
import { amountUpdata } from '@/api/seller/order';

import { Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);

const formRef = ref();
const visible = ref(true);
const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性

const state = reactive({
  formModel: {
    id: '',
    currentamount: '',
    amount: '' || 0,
    orderid: '',
  },
});
// 买家需支付金额
const needPaySum = computed(() => {
  if (state.formModel.currentamount && !state.formModel.amount) {
    console.log('当前', state.formModel.currentamount);
    return state.formModel.currentamount;
  }
  console.log('修改', state.formModel.amount);
  return state.formModel.amount
    ? state.formModel.amount.toFixed(2)
    : (0.0).toFixed(2);
});

const formRules = {
  amount: [
    {
      required: true,
      message: '请输入金额',
    },
    {
      match: /^\d+(.\d{1,2})?$/,
      message: '只可输入小数点后两位或大于等于0的整数',
    },
    {
      validator: (value: any, cb: any) => {
        if (state.formModel.amount < 0) {
          return cb('输入金额不能小于0');
        }
        if (state.formModel.amount > 100000000) {
          return cb('输入金额不能大于 100,000,000');
        }
        return cb();
      },
    },
  ],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      amountUpdata({
        // id: state.formModel.id,
        // couponMoney: state.formModel.amount,
        orderId: state.formModel.id,
        realityPrice: needPaySum.value,
      })
        .then(() => {
          emit('confirm');
          Message.success('金额修改成功');
          done(true);
        })
        .catch(() => {
          done(false);
        });
    } else {
      done(false);
    }
  });
};

onMounted(() => {
  // if (isEdit.value) {
  // 这里分两种情况
  // 一是编辑信息从列表传入
  // const { roleName, roleDesc, amount } = props.data;
  // { roleName, roleDesc, amount };
  const { currentamount, id, amount, orderid } = props.data;

  state.formModel = { id, currentamount, amount, orderid };

  // 二是从接口获取
  // getDetail();
  // }
});
</script>

<style scoped lang="less"></style>
