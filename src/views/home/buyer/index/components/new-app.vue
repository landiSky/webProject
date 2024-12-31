<template>
  <t-modal
    v-model:visible="showModal"
    :width="832"
    :height="485"
    title-align="start"
    modal-class="modal-container-app"
    @cancel="handleCancel"
  >
    <template #title> 创建新应用 </template>
    <template #footer>
      <t-button @click="handleCancel">取消</t-button>
      <t-button type="primary" @click="handleOk">确认</t-button>
    </template>
    <div class="new-app-box">
      <EmptyStateView :tabs-application="tabsApplication" />
    </div>
  </t-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, ref } from 'vue';
// 空状态视图展示
import EmptyStateView from './empty-state-view.vue';

const emits = defineEmits(['confirm', 'cancel']);

const props = defineProps({
  visible: Boolean,
  tabsApplication: String,
});

const showModal = computed(() => props.visible);

const handleOk = () => {
  emits('confirm');
};

const handleCancel = () => {
  emits('cancel');
};

onMounted(async () => {});
</script>

<style scoped lang="less">
.modal-container-app {
  .modal-body {
    margin: 0 20px;
  }

  .new-app-box {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>
