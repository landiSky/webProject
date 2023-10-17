<template>
  <t-modal
    v-model:visible="visible"
    :width="642"
    :height="378"
    :on-before-ok="onConfirm"
    :ok-text="isEdit ? '完成' : '下一步:角色授权'"
    @cancel="emit('cancel')"
  >
    <!-- "下一步:角色授权" -->
    <template #title>
      {{ isEdit ? '编辑' : '新增' }}角色{{
        isEdit ? '' : ':基本信息 '
      }}</template
    >
    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item field="roleName" label="角色名称">
        <t-input
          v-model="state.formModel.roleName"
          placeholder="请输入"
          :max-length="{
            length: 50,
            errorOnly: true,
          }"
          allow-clear
          show-word-limit
        />
      </t-form-item>

      <t-form-item field="roleDesc" label="角色描述">
        <t-textarea
          v-model="state.formModel.roleDesc"
          placeholder="请输入"
          :max-length="{
            length: 100,
            errorOnly: true,
          }"
          allow-clear
          show-word-limit
          :auto-size="{
            minRows: 2,
            maxRows: 5,
          }"
        />
      </t-form-item>
    </t-form>
  </t-modal>
  <div> </div>
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
  startlist: {
    type: String,
  },
});

const emit = defineEmits(['confirm', 'cancel', 'getValue']);

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
  // emit('onEditModalConfirm');
  // emit('confirm');
  formRef.value.validate((errors: any) => {
    if (props.data === undefined) {
      if (!errors) {
        // 新增
        emit('confirm', state.formModel);

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
    } else {
      // 编辑
      emit('cancel');
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
  // if (isEdit.value) {
  // 这里分两种情况
  // 一是编辑信息从列表传入
  const { roleName, roleDesc } = props?.data
    ? props.data
    : { roleName: '', roleDesc: '' };
  state.formModel = { roleName, roleDesc };
  // 二是从接口获取
  // getDetail();
  // }
});
</script>

<style scoped lang="less"></style>
