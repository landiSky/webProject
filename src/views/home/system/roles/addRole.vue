<template>
  <t-modal
    v-model:visible="visible"
    :on-before-ok="handleOk"
    @cancel="emit('cancel')"
  >
    <template #title> {{ props.isEdit ? '编辑角色' : '新建角色' }} </template>
    <t-form ref="formRef" :model="form">
      <t-form-item
        field="roleName"
        label="角色名称"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: true, message: '请输入角色名称' }]"
        required
      >
        <t-input
          v-model="form.roleName"
          placeholder="请输入"
          :max-length="50"
          allow-clear
          show-word-limit
        />
      </t-form-item>

      <t-form-item
        field="roleDescription"
        label="角色描述"
        validate-trigger="input"
      >
        <t-textarea
          v-model="form.roleDesc"
          placeholder="请输入"
          :max-length="100"
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
import { defineProps, defineEmits, reactive, ref, onMounted } from 'vue';
import { apiRoleAdd, apiRoleUpdate } from '@/api/role-manage';
import { Message } from '@tele-design/web-vue';

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  roleInfo: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const formRef = ref();
const visible = ref(true);
const form: any = reactive({
  roleName: undefined,
  roleDesc: undefined,
});

function handleOk(done: (closed: boolean) => void) {
  formRef.value.validate().then(async (v: boolean) => {
    if (!v) {
      // v == undefined 时验证通过
      const api = props.isEdit ? apiRoleUpdate : apiRoleAdd;
      const params = props.isEdit ? { ...form, id: props.roleInfo.id } : form;
      api(params)
        .then(() => {
          formRef.value.resetFields();
          emit('confirm');
          done(true);
          Message.success(`${props.isEdit ? '编辑' : '新建'}成功`);
        })
        .catch(() => {
          done(false);
        });
    } else {
      done(false);
    }
  });
}

onMounted(() => {
  console.log('addRole.vue:93');
  if (props.isEdit) {
    const { roleName, roleDesc } = props.roleInfo;
    form.roleName = roleName;
    form.roleDesc = roleDesc;
  }
});
</script>

<style scoped lang="less"></style>
