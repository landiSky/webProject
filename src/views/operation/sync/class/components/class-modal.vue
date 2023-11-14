<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :on-before-ok="onConfirm"
    @cancel="emit('cancel')"
  >
    <template #title> {{ isEdit ? '编辑' : '新增' }}商品分类 </template>
    <t-form ref="formRef" :model="formModel" :rules="formRules">
      <t-form-item field="name" label="分类名称">
        <t-input
          v-model.trim="formModel.name"
          placeholder="请输入分类名称"
          :max-length="{
            length: 50,
            errorOnly: true,
          }"
          allow-clear
          show-word-limit
        />
      </t-form-item>

      <t-form-item field="note" label="备注">
        <t-textarea
          v-model.trim="formModel.remark"
          placeholder="请输入备注"
          :max-length="{
            length: 200,
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
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
import { addClass, updateClass } from '@/api/operation/sync-class';
import { Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  parentId: null,
});

const emit = defineEmits(['confirm', 'cancel']);

const formRef = ref();
const visible = ref(true);

const isEdit = computed(() => Boolean(props.data.id ?? false));
const formModel = ref({
  parentId: null,
  id: null,
  name: '',
  remark: '',
});

const formRules = {
  name: [
    { required: true, message: '请输入分类名称' },
    { maxLength: 50, message: '长度不超过50个字符' },
  ],
  note: [
    { required: false, message: '请输入备注' },
    { maxLength: 200, message: '长度不超过200个字符' },
  ],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      const api = isEdit.value ? updateClass : addClass;
      console.log(formModel.value);
      api(formModel.value)
        .then((res) => {
          if (res.code === 200) {
            emit('confirm');
            Message.success(`${isEdit.value ? '编辑' : '新增'}类型成功`);
            done(true);
          } else {
            Message.success(res.message);
            done(false);
          }
        })
        .catch(() => {
          done(false);
        });
      // emit('confirm');
      // Message.success(`${isEdit.value ? '编辑' : '新增'}类型成功`);
      // done(true);
    } else {
      done(false);
    }
  });
};

onMounted(() => {
  if (props.data) {
    formModel.value.id = props.data.id;
    formModel.value.name = props.data.name;
    formModel.value.remark = props.data.remark;
  }
  if (props.parentId) {
    formModel.value.parentId = props.parentId;
  }
});
</script>

<style scoped lang="less"></style>
