<template>
  <t-modal
    v-model:visible="visible"
    :width="642"
    :height="378"
    :on-before-ok="onConfirm"
    :ok-text="isEdit ? '完成' : '完成'"
    @cancel="onConfirmflag"
  >
    <!-- "下一步:角色授权" -->
    <template #title>
      {{ isEdit ? '编辑' : '新增' }}角色{{
        isEdit ? '' : ':基本信息 '
      }}</template
    >
    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item field="roleName" label="角色名称" validate-trigger="blur">
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

      <t-form-item field="remark" label="角色描述">
        <t-textarea
          v-model="state.formModel.remark"
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
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

import { apiRoleAdd } from '@/api/system/role';
import { Message } from '@tele-design/web-vue';

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);

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
    remark: undefined,
    id: undefined,
  },
});

const formRules = {
  roleName: [
    {
      required: true,
      message: isEdit.value ? '角色名称不能为空' : '请输入角色名称',
      validator: (value: any, cb: any) => {
        // @ts-ignore
        if (!state.formModel.roleName?.split(' ').join('')) {
          return cb('请输入角色名称');
        }
        return cb();
      },
    },
    { maxLength: 20, message: '长度不超过50个字符' },
  ],
  remark: [{ maxLength: 100, message: '长度不超过100个字符' }],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!isEdit.value) {
      if (!errors) {
        apiRoleAdd({
          roleName: state.formModel.roleName,
          remark: state.formModel.remark,
          companyId: userInfoByCompany.value?.companyId,
        })
          .then((res) => {
            Message.success('新增成功');
            emit('confirm');

            done(true);
            console.log(res, 'res');
          })
          .catch((err) => {
            done(false);
          });
      } else {
        done(false);
      }
    } else if (isEdit.value) {
      // 编辑

      if (!errors) {
        apiRoleAdd({
          roleName: state.formModel.roleName,
          remark: state.formModel.remark,
          companyId: userInfoByCompany.value?.companyId,
          id: state.formModel.id,
        })
          .then((res) => {
            Message.success('编辑成功');
            emit('confirm');
            done(true);
          })
          .catch((err) => {
            done(false);
          });
      } else {
        done(false);
      }
    }
  });
};
const onConfirmflag = () => {
  emit('cancel');
  // state.formModel = {
  //   roleName: undefined,
  //   remark: undefined,
  //   id: undefined,
  // };
};

onMounted(() => {
  if (isEdit.value) {
    // 这里分两种情况
    // 一是编辑信息从列表传入
    console.log(props.data);
    const { roleName, remark, id } = props?.data
      ? props.data
      : { roleName: '', remark: '', id: '' };
    state.formModel = { roleName, remark, id };
    // 二是从接口获取
    // getDetail();
  } else if (props.data) {
    const { roleName, remark, id } = props?.data
      ? props.data
      : { roleName: '', remark: '', id: '' };
    state.formModel = { roleName, remark, id };
  }
});
</script>

<style scoped lang="less"></style>
