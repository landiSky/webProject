<template>
  <t-modal
    v-model:visible="showModal"
    fullscreen
    title-align="start"
    :closable="false"
    :on-before-ok="onConfirm"
    class="fullscreen-modal"
    @cancel="emit('cancel')"
  >
    <template #title>
      <span class="title-left" @click="goback">
        <!-- <icon-left /> -->
        <span>返回</span>
      </span>
      <span style="margin-left: 42%">
        {{ data.id ? '编辑用户' : '新建用户' }}
      </span>
    </template>
    <div class="modal-body">
      <t-form
        ref="formRef"
        :model="formModel"
        :label-col-props="{ span: 4 }"
        :rules="formRules"
      >
        <t-form-item label="姓名" field="nickName">
          <t-input
            v-model="formModel.nickName"
            :max-length="{
              length: 20,
              errorOnly: true,
            }"
            allow-clear
            show-word-limit
            placeholder="请输入姓名"
          >
          </t-input>
        </t-form-item>
        <t-form-item label="账号" field="username">
          <t-input
            v-model="formModel.username"
            :max-length="{
              length: 50,
              errorOnly: true,
            }"
            :disabled="props.data?.id"
            allow-clear
            show-word-limit
            placeholder="支持字母、数字，'-'和'_',不可以符号开头,长度不超过50个字符"
          >
          </t-input>
        </t-form-item>
        <t-form-item v-if="!props.data?.id" label="密码" field="password">
          <t-input-password
            v-model="formModel.password"
            allow-clear
            placeholder="请输入8-18个字符的密码，字母、符号、数字，区分大小写"
          >
          </t-input-password>
        </t-form-item>
        <t-form-item label="性别" name="sex">
          <t-radio-group v-model="formModel.sex">
            <t-radio :value="1">男</t-radio>
            <t-radio :value="0">女</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="手机号" field="phone">
          <t-input
            v-model="formModel.phone"
            allow-clear
            placeholder="请输入11位手机号"
          >
          </t-input>
        </t-form-item>
        <t-form-item label="邮箱" field="email">
          <t-input
            v-model="formModel.email"
            allow-clear
            placeholder="请输入邮箱"
          >
          </t-input>
        </t-form-item>

        <t-form-item label="备注" field="comments">
          <t-textarea
            v-model="formModel.comments"
            placeholder="请输入备注"
            :max-length="{
              length: 200,
              errorOnly: true,
            }"
            show-word-limit
            allow-clear
          />
        </t-form-item>
      </t-form>
    </div>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
// import { usersDetail, usersAdd, usersUpdate } from '@/api/user-depart';
import { Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
});

const emit = defineEmits(['confirm', 'cancel']);
const showModal = ref(true);
const formRef = ref();

const formModel = ref({
  username: null,
  deptId: undefined,
  password: null,
  nickName: null,
  sex: null,
  roleIds: [],
  email: null,
  phone: null,
  comments: null,
});

const formRules = {
  nickName: [
    { required: true, message: '请输入姓名' },
    { maxLength: 20, message: '长度不超过20个字符' },
  ],
  comments: [{ maxLength: 200, message: '长度不超过200个字符' }],
};

const goback = () => {
  // showModal.value = false;
  emit('cancel');
};

const getUserDetail = () => {
  // 调后端接口
  // loading.value = true;
  // usersDetail({ id: props.data?.id })
  //   .then((res) => {
  //     formModel.value = res || {};
  //     formModel.value.roleIds = res?.roles.map(
  //       (item: { [name: string]: any }) => item.id
  //     );
  //   })
  //   .catch(() => {})
  //   .finally(() => {
  //     loading.value = false;
  //   });
};

onMounted(() => {
  if (props.data?.id) {
    getUserDetail();
  }
});

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      // 调后端接口
      // const api = props.data.id ? usersUpdate : usersAdd;
      // api(formModel.value)
      //   .then(() => {
      //     emit('confirm');
      //     Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
      //     done(true);
      //   })
      //   .catch(() => {
      //     done(false);
      //   });

      // mock数据
      Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
      done(true);
    } else {
      done(false);
    }
  });
};
</script>

<style lang="less" scoped>
.title-left {
  margin-left: 10px;
  cursor: pointer;

  span {
    margin-left: 15px;
  }
}

.modal-body {
  display: flex;
  justify-content: center;
  height: 100%;
  padding-top: 32px;
  overflow: auto;
  background-color: #fff;

  .tele-form {
    max-width: 652px;
  }
}
</style>
