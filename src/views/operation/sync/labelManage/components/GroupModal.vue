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
    <t-form
      ref="formRef"
      :model="form"
      :label-col-props="{ span: 4, offset: 0 }"
    >
      <t-form-item
        field="name"
        label="分组名称"
        :rules="[
          { required: true, message: '分组名称不允许为空' },
          { minLength: 4, message: '只能输入4个字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-input v-model="form.name" placeholder="请输入" />
      </t-form-item>
      <t-form-item
        field="type"
        label="前台筛选"
        :rules="[
          {
            required: true,
            validator: validateRadio,
            message: '前台筛选不允许为空',
          },
        ]"
      >
        <t-radio-group v-model="form.type">
          <t-tooltip
            :default-popup-visible="typeDisabled"
            content="前台展示分组超过三组"
          >
            <t-radio :value="1" :disabled="typeDisabled">是</t-radio>
          </t-tooltip>
          <t-radio :value="0">否</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item field="remark" label="备注">
        <t-textarea
          v-model="form.remark"
          placeholder="请输入"
          :max-length="500"
          allow-clear
          show-word-limit
        />
      </t-form-item>
    </t-form>
  </t-modal>
</template>

<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  computed,
  reactive,
  ref,
  onMounted,
} from 'vue';
import { fetchFilterData } from '@/api/inventory/labelManage';

const emits = defineEmits(['onConfirm', 'onCancel']);

const props = defineProps({
  visible: Boolean,
  confirmLoading: Boolean,
  title: String,
});

const formRef = ref();
const typeDisabled = ref(false);

const form = reactive<{
  name: string;
  type: number;
  remark: string;
}>({
  name: '',
  type: 3,
  remark: '',
});

const showModal = computed(() => props.visible);

const validateRadio = (value: number, callback: (error?: string) => void) => {
  if (![0, 1].includes(value)) {
    callback('前台筛选不能为空');
  } else {
    callback();
  }
};

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
  console.log('onmountd');
  fetchFilterData().then((res) => {
    console.log('res', res);
    if (res.code === 200) {
      form.type = res.data > 3 ? 0 : 1;
      typeDisabled.value = res.data > 3;
    }
  });
});
</script>
