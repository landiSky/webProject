<template>
  <t-modal
    v-model:visible="showModal"
    :width="520"
    :height="232"
    class="label-modal-container"
    body-class="label-modal-body"
    :ok-loading="props.confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>{{ props.title }}</template>
    <t-form
      ref="formRef"
      :model="form"
      :label-col-props="{ span: 4, offset: 0 }"
    >
      <t-form-item field="" label="分组">
        <span>{{ props.groupRowRecord?.name }}</span>
      </t-form-item>
      <t-form-item
        field="name"
        label="标签名称"
        :rules="[
          { required: true, message: '分组名称不允许为空' },
          { maxLength: 20, message: '不允许超过20个字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-input
          v-model="form.name"
          placeholder="请输入"
          :max-length="20"
          allow-clear
          show-word-limit
        />
      </t-form-item>
    </t-form>
  </t-modal>
</template>

<script setup lang="ts">
// @ts-nocheck
import {
  defineProps,
  defineEmits,
  computed,
  reactive,
  ref,
  onMounted,
  watch,
} from 'vue';

const emits = defineEmits(['onConfirm', 'onCancel']);

const props = defineProps({
  visible: Boolean,
  confirmLoading: Boolean,
  title: String,
  labelEditData: Object,
  groupRowRecord: Object,
});

const formRef = ref();

const form = reactive<{
  name: string;
}>({
  name: '',
});

const showModal = computed(() => props.visible);

watch(
  () => props.labelEditData,
  (newVal) => {
    console.log('watch', newVal);
    if (newVal) {
      form.name = newVal.name;
    }
  },
  {
    immediate: true,
  }
);

const handleOk = () => {
  formRef.value.validate((errors: undefined) => {
    if (!errors) {
      emits('onConfirm', form);
    }
  });
};

const handleCancel = () => {
  emits('onCancel');
};

onMounted(() => {
  console.log('label onmouted', props.labelEditData);
});
</script>
