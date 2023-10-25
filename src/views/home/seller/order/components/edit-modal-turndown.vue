<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :on-before-ok="onConfirm"
    @cancel="emit('cancel')"
  >
    <template #title> 修改订单价格 </template>

    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item :hide-label="true">
        <div>请选择驳回原因</div>
      </t-form-item>

      <!-- <t-form-item :hide-label="true" field="radio"> -->
      <div>
        <t-radio-group direction="vertical" @change="radioChange">
          <t-radio value="1">未收到打款信息</t-radio>
          <t-radio value="2">支付金额与订单实际付款金额不一致 </t-radio>
          <t-radio value="3">上传凭证不清晰无法查验</t-radio>
          <t-radio value="4">其他 </t-radio>
        </t-radio-group>
      </div>
      <!-- </t-form-item> -->
      <t-form-item v-if="radiofalg" :hide-label="true" field="prooftext">
        <t-textarea
          v-model="state.formModel.prooftext"
          placeholder="请输入"
          :max-length="500"
          allow-clear
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
// import { roleUpdate, roleAdd } from '@/api/role-manage';
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
    roleName: undefined,
    roleDesc: undefined,
    amount: undefined,
    prooftext: undefined,
  },
});
const radiofalg = ref(false);
const radiotext = ref('');
const formRules = {
  prooftext: [{ required: true, message: '请输入' }],
};

const onConfirm = () => {
  if (radiotext.value === '') {
    Message.error('错误文本!');
  } else {
    //   const api = isEdit.value ? roleUpdata : roleAdd; // 这里是新增、编辑不是一个接口
    //   api(state.formModel)
    //     .then(() => {
    //       emit('confirm');
    //       Message.success(`${isEdit.value ? '编辑' : '新增'}用户成功`);
    //       done(true);
    //     })
    //     .catch(() => {
    //       done(false);
    //     });

    formRef.value.validate((errors: any) => {
      if (!errors) {
        console.log(state.formModel);
        emit('confirm');
      } else {
        // done(false);
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
// 单选框
const radioChange = (value: string) => {
  console.log(value);
  if (value === '4') {
    radiofalg.value = true;
  } else {
    radiofalg.value = false;
  }
};
onMounted(() => {
  if (isEdit.value) {
    // 这里分两种情况
    // 一是编辑信息从列表传入
    const { roleName, roleDesc, amount, prooftext } = props.data;
    state.formModel = { roleName, roleDesc, amount, prooftext };

    // 二是从接口获取
    // getDetail();
  }
});
</script>

<style scoped lang="less"></style>
