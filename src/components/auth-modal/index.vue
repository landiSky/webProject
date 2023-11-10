<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :height="280"
    :body-style="{ padding: '20px' }"
    @cancel="emit('cancel')"
    @close="emit('cancel')"
  >
    <template #title> 认证企业信息 </template>
    <t-form
      ref="formRef"
      :model="state.formModel"
      :rules="formRules"
      class="authForm"
      auto-label-width
    >
      <t-form-item field="companyName" label="企业名称">
        <t-input
          v-model="state.formModel.companyName"
          placeholder="请输入企业名称"
          allow-clear
        />
      </t-form-item>

      <t-form-item field="creditCode" label="统一社会信用代码">
        <t-input
          v-model="state.formModel.creditCode"
          placeholder="请输入统一社会信用代码"
          allow-clear
        />
      </t-form-item>
      <t-form-item field="legalPersonName" label="法人姓名">
        <t-input
          v-model="state.formModel.legalPersonName"
          placeholder="请输入法人姓名"
          allow-clear
        />
      </t-form-item>
    </t-form>
    <template #footer>
      <t-button type="primary" @click="clickNextStep">下一步</t-button>
    </template>
  </t-modal>
</template>

<script lang="ts" setup>
import {
  h,
  defineProps,
  defineEmits,
  reactive,
  ref,
  onMounted,
  computed,
} from 'vue';
import { apiHasCompany } from '@/api/authentication';
import { Message, Modal } from '@tele-design/web-vue';
import { CompanyAuthStatus } from '@/enums/common';

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
    companyName: undefined,
    creditCode: undefined,
    legalPersonName: undefined,
  },
});

const formRules = {
  companyName: [{ required: true, message: '请输入企业名称' }],
  creditCode: [{ required: true, message: '请输入统一社会信用代码' }],
  legalPersonName: [{ required: true, message: '请输入法人姓名' }],
};

const clickNextStep = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      // apiHasCompany(state.formModel)
      //   .then((data) => {
      const data = {
        nodeAuth: true,
        companyAuth: false,
        mobile: '15210602855',
      };
      const { companyAuth, nodeAuth, mobile } = data;
      const title = nodeAuth ? '企业节点认证' : '企业认证';

      Modal.warning({
        title: `${title}重复`,
        okText: '好的',
        hideCancel: true,
        content: `该企业已完成「企业节点认证」，如需申请加入企业，请咨询企业联系人，联系方式：13233332222。`,
      });
      // })
      // .catch(() => {})
      // .finally(() => {
      //   emit('confirm');
      // });
    } else {
      done(false);
    }
  });
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
  if (isEdit.value) {
    // 这里分两种情况
    // 一是编辑信息从列表传入
    // 二是从接口获取
    // getDetail();
  }
});
</script>

<style scoped lang="less" scope>
.authForm {
  :deep(.tele-form-item) {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
