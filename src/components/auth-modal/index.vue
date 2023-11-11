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
      <t-form-item field="roleName" label="企业名称">
        <t-input
          v-model="state.formModel.roleName"
          placeholder="请输入"
          allow-clear
        />
      </t-form-item>

      <t-form-item field="roleDesc" label="统一社会信用代码">
        <t-input
          v-model="state.formModel.roleName"
          placeholder="请输入"
          allow-clear
        />
      </t-form-item>
      <t-form-item field="roleDesc" label="法人姓名">
        <t-input
          v-model="state.formModel.roleName"
          placeholder="请输入"
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
  },
});

const formRules = {
  roleName: [
    { required: true, message: '请输入姓名' },
    { maxLength: 20, message: '长度不超过20个字符' },
  ],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
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

const clickNextStep = () => {
  emit('confirm');
};
onMounted(() => {
  if (isEdit.value) {
    // 这里分两种情况
    // 一是编辑信息从列表传入
    const { roleName, roleDesc } = props.data;
    state.formModel = { roleName, roleDesc };

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
