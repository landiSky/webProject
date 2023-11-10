<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :on-before-ok="onConfirm"
    @cancel="emit('cancel')"
  >
    <template #title> 修改订单价格 </template>
    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item label="订单号">
        <span>{{ state.formModel.id }}</span>
        <!-- <t-input
          v-model="state.formModel.roleName"
          placeholder="请输入"
          :max-length="{
            length: 50,
            errorOnly: true,
          }"
          allow-clear
          show-word-limit 
        /> -->
      </t-form-item>

      <t-form-item label="当前价格">
        <p style="font-weight: 500; font-size: 14px"
          >￥{{ state.formModel.currentamount }}</p
        >
        <!-- <t-select
          v-model="state.formModel.roleDesc"
          placeholder="请选择"
          multiple
        >
          <t-option v-for="(item, index) in roleSelect" :key="index">{{
            item.name
          }}</t-option>
        </t-select> -->
      </t-form-item>
      <t-form-item field="amount" label="修改金额">
        <t-input-number
          v-model="state.formModel.amount"
          placeholder="请输入"
          :min="1"
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
    id: '',
    currentamount: '',
    amount: '',
  },
});

const formRules = {
  amount: [
    { required: true, message: '请输入' },
    {
      match: /^[1-9]\d*$/ || /^(-?\d+)(\.\d{1,2})?$/,
      message: '请输入正确金额',
    },
  ],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      console.log(state.formModel);

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
      emit('confirm');
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
  console.log(props.data, 'props.data');
  const { currentamount, id, amount } = props.data;
  console.log(currentamount, id);

  state.formModel = { id, currentamount, amount };

  // 二是从接口获取
  // getDetail();
  // }
});
</script>

<style scoped lang="less"></style>
