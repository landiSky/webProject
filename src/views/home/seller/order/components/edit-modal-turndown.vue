<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :height="500"
    :on-before-ok="onConfirm"
    @cancel="emit('cancel')"
  >
    <template #title> 驳回凭证 </template>

    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item :hide-label="true">
        <div>请选择驳回原因</div>
      </t-form-item>
      <t-form-item :hide-label="true" field="rejectType">
        <!-- <div> -->
        <t-radio-group
          v-model="state.formModel.rejectType"
          direction="vertical"
          @change="radioChange"
        >
          <t-radio value="0">未收到打款信息</t-radio>
          <t-radio value="1">支付金额与订单实际付款金额不一致 </t-radio>
          <t-radio value="2">上传凭证不清晰无法查验</t-radio>
          <t-radio value="3">其他 </t-radio>
        </t-radio-group>
        <!-- </div> -->
      </t-form-item>
      <!-- <t-form-item :hide-label="true" field="radio"> -->

      <!-- </t-form-item> -->
      <t-form-item
        v-if="radiofalg"
        :hide-label="true"
        field="rejectReasonDetail"
      >
        <t-textarea
          v-model="state.formModel.rejectReasonDetail"
          placeholder="请输入"
          :max-length="500"
          show-word-limit
        />
      </t-form-item>
    </t-form>
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
} from 'vue';

import { sellerTurndown } from '@/api/seller/order';
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
// const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    id: '',
    rejectType: '',
    rejectReasonDetail: undefined,
  },
});
const radiofalg = ref(false);
const radiotext = ref('');

// 单选框
const radioChange = (value: string) => {
  console.log(value);
  radiotext.value = value;
  if (value === '3') {
    radiofalg.value = true;
  } else {
    radiofalg.value = false;
  }
};
const formRules = {
  rejectReasonDetail: [{ required: true, message: '请输入驳回原因' }],
};
const onConfirm = (done: (closed: boolean) => void) => {
  console.log(radiotext.value);
  if (radiotext.value === '') {
    Message.error('至少选一项');
    done(false);
  } else {
    formRef.value.validate((errors: any) => {
      console.log(state.formModel, 'state.formModel');
      if (!errors) {
        sellerTurndown({
          id: state.formModel.id,
          rejectType: state.formModel.rejectType,
          rejectReasonDetail: state.formModel.rejectReasonDetail,
        }).then((res) => {
          console.log(state.formModel);
          emit('confirm');
          done(true);
        });
      } else {
        done(false);
      }
    });
  }
};

// const getDetail = () => {

//   usersDetail({ id: props.data?.id })
//     .then((res: Record<string, any>) => {
//       const { roleName, roleDesc } = res || {};
//       state.formModel = { roleName, roleDesc };
//     })
//     .catch(() => {});
// };

onMounted(() => {
  // if (isEdit.value) {
  // 这里分两种情况
  // 一是编辑信息从列表传入
  const { id } = props.data;
  state.formModel.id = id;

  // 二是从接口获取
  // getDetail();
  // }
});
</script>

<style scoped lang="less"></style>
