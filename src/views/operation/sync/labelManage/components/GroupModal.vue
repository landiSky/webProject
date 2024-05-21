<template>
  <t-modal
    v-model:visible="showModal"
    :width="520"
    :height="324"
    class="label-modal-container"
    body-class="label-modal-body"
    :ok-loading="props.confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>{{ props.title }}</template>
    <t-form ref="formRef">
      <!-- <t-form-item
        field="name"
        label="分组名称"
        :rules="[
          { required: true, message: 'name is required' },
          { minLength: 5, message: 'must be greater than 5 characters' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-input v-model="form.name" placeholder="请输入" />
      </t-form-item> -->
    </t-form>
  </t-modal>
  <div>新增分组</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, reactive } from 'vue';
// import { fetchLabel } from '@/api/inventory/fetchLabel';

const emits = defineEmits(['onConfirm', 'onCancel']);

const props = defineProps({
  visible: Boolean,
  confirmLoading: Boolean,
  title: String,
});

const form = reactive({
  name: '',
});

const showModal = computed(() => props.visible);

const handleOk = () => {
  emits('onConfirm');
};

const handleCancel = () => {
  emits('onCancel');
};
</script>
