<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
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
      <t-button type="primary" :loading="btnLoading" @click="clickNextStep"
        >下一步</t-button
      >
    </template>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineEmits, reactive, ref, onMounted } from 'vue';
import { apiHasCompany, apiHasCompanyShow } from '@/api/authentication';
import { Message, Modal } from '@tele-design/web-vue';

const emit = defineEmits(['confirm', 'cancel']);

const formRef = ref();
const visible = ref(true);
const btnLoading = ref(false);

const state = reactive<{ formModel: Record<string, string | undefined> }>({
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
      btnLoading.value = true;
      apiHasCompany(state.formModel)
        .then((data) => {
          const { companyAuth, nodeAuth, phone } = data;

          if (companyAuth || nodeAuth) {
            const title = nodeAuth ? '企业节点认证' : '企业认证';

            visible.value = false;
            Modal.warning({
              title: `${title}重复`,
              okText: '好的',
              titleAlign: 'start',
              hideCancel: true,
              content: `该企业已完成「${title}」，如需申请加入企业，请咨询企业联系人，联系方式：${
                phone || '-'
              }。`,
              onOk: () => {
                emit('confirm');
              },
            });
          } else {
            emit('confirm');
          }
        })
        .catch(() => {})
        .finally(() => {
          btnLoading.value = false;
        });
    } else {
      done(false);
    }
  });
};

onMounted(() => {
  apiHasCompanyShow().then((data: Record<string, any>) => {
    const { companyName, creditCode, legalPersonName } = data;
    state.formModel = { companyName, creditCode, legalPersonName };
  });
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
