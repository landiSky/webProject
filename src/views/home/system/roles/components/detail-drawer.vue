<template>
  <t-drawer
    width="400px"
    :visible="visible"
    closable
    :footer="false"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <template #title>
      <div>部门详情</div>
    </template>
    <t-button type="primary" @click="handleEdit">
      <template #icon> <icon-edit /> </template>
      编辑
    </t-button>
    <t-descriptions
      :column="1"
      :align="{ label: 'right' }"
      style="margin-top: 16px"
    >
      <t-descriptions-item label="角色名称">{{
        data.roleName || '-'
      }}</t-descriptions-item>
      <t-descriptions-item label="角色编码">{{
        data.roleCode || '-'
      }}</t-descriptions-item>
      <t-descriptions-item label="创建人">{{
        data.createdBy || '-'
      }}</t-descriptions-item>
      <t-descriptions-item label="创建时间">{{
        data.createdTime || '-'
      }}</t-descriptions-item>
      <t-descriptions-item label="描述">{{
        data.roleDesc || '-'
      }}</t-descriptions-item>
    </t-descriptions>
  </t-drawer>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, defineEmits } from 'vue';

const itemInfo = ref<{ [name: string]: string | number }>({});
const visible = ref(true);

const emit = defineEmits(['cancel', 'edit']);

const props = defineProps({
  data: {
    // 从父组件传过来的对象
    type: Object,
    default() {
      return {};
    },
  },
});

onMounted(() => {
  itemInfo.value = props.data;
});

const handleCancel = () => {
  emit('cancel');
};

const handleEdit = () => {
  emit('edit', props.data);
};
</script>
