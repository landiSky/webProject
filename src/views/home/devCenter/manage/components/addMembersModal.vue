<template>
  <t-modal
    v-model:visible="showModal"
    :width="520"
    :height="192"
    class="modal-container"
    body-class="modal-body"
    :ok-loading="props.confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>{{ props.title }}</template>
    <template #footer>
      <t-button @click="handleCancel">取消</t-button>
      <t-button type="primary" @click="handleOk">确定</t-button>
    </template>
    <t-form
      ref="formRef"
      :model="form"
      :label-col-props="{ span: 5, offset: 0 }"
      :wrapper-col-props="{ span: 17, offset: 0 }"
    >
      <t-form-item field="selectList" label="添加企业成员">
        <t-select v-model="form.selectList" placeholder="请选择" multiple>
          <t-option
            v-for="item in form.memberIdList"
            :key="item.memberId"
            :value="item.memberId"
            >{{ item.username }}</t-option
          >
        </t-select>
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
import { fetchCompanyMember } from '@/api/devCenter/manage';

const emits = defineEmits(['onConfirm', 'onCancel']);

const props = defineProps({
  visible: Boolean,
  confirmLoading: Boolean,
  title: String,
  labelEditData: Object,
  groupRowRecord: Object,
  companyId: String,
  memberList: {
    type: Array,
    default() {
      return [];
    },
  },
});

const showModal = computed(() => props.visible);

const formRef = ref();

const form = reactive<{
  memberIdList: Record<string, any>;
  selectList: Record<string, any>;
}>({
  memberIdList: [],
  selectList: [],
});

const handleOk = () => {
  formRef.value.validate((errors: undefined) => {
    if (!errors) {
      // 过滤数据
      const result = form.memberIdList.filter((item: any) =>
        form.selectList.includes(item.memberId)
      );
      emits('onConfirm', result);
    }
  });
};

const handleCancel = () => {
  emits('onCancel');
};

onMounted(async () => {
  console.log('props.memberList', props.memberList);
  await fetchCompanyMember(props.companyId).then((res: any) => {
    if (res.code === 200) {
      form.memberIdList = res.data;
      form.selectList = props?.memberList.map((item: any) => item.memberId);

      console.log('memberList', form.selectList, form.memberIdList);
    } else {
      form.memberIdList = [];
    }
  });
});
</script>
