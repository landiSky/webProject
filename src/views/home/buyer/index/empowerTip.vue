<template>
  <t-modal
    v-model:visible="showModal"
    :width="800"
    :height="611"
    modal-class="modal-container"
    :modal-style="{
      background: 'linear-gradient(180deg, #e5efff 0%, #ffffff 100%)',
    }"
    :ok-loading="props.confirmLoading"
    :simple="true"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>
      <div class="title" style="margin: 0">{{ props.title }}</div>
    </template>
    <template #footer>
      <t-button @click="handleCancel">取消</t-button>
      <t-button type="primary" @click="handleOk">确认授权</t-button>
    </template>
    <div v-if="!showText" class="modal-body">
      <div class="picture"></div>
      <div class="title">智数通平台将获得以下权限</div>
      <div class="explain">
        <div class="explain-icon"></div>
        <div>读取你的登录状态信息</div>
      </div>
      <div class="explain">
        <div class="explain-icon"></div>
        <div>获取你的公开信息（登录名、昵称、头像等）</div>
      </div>
      <div class="explain">
        <div class="explain-icon"></div>
        <div
          >使用身份认证信息（姓名/企业名称、手机号、证件号码等）办理业务（如完成服务开通认证等）</div
        >
      </div>
      <div class="details">
        <t-link :hoverable="false" @click="clickSwitch">查看详情</t-link>
        <icon-down />
        <!-- <icon-up /> -->
      </div>
    </div>
    <div v-else class="text-field"> 占位 </div>
  </t-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, ref } from 'vue';

const emits = defineEmits(['confirm', 'cancel']);

const props = defineProps({
  visible: Boolean,
  confirmLoading: Boolean,
  title: String,
  empowerTipData: Object,
  companyId: String,
});

const showModal = computed(() => props.visible);

const showText = ref(false);
const clickSwitch = () => {
  showText.value = true;
};
const handleOk = () => {
  emits('confirm');
};

const handleCancel = () => {
  emits('cancel');
};

onMounted(async () => {});
</script>

<style scoped lang="less">
.modal-container {
  .modal-body {
    margin: 0 28px;
  }

  .picture {
    width: 281px;
    height: 201px;
    margin: auto;
    background: url('./image/security_01.png') no-repeat;
    background-size: 100%;
  }

  .title {
    width: 100%;
    height: 28px;
    margin: 20px 0;
    color: rgba(29, 33, 41, 1);
    font-weight: 400;
    font-size: 20px;
    font-family: PingFang SC;
    line-height: 28px;
    text-align: center;
  }

  .explain {
    display: flex;
    gap: 10px;
    align-items: center;
    height: 39px;
    color: rgba(78, 89, 105, 1);
    font-weight: 400;
    font-size: 14px;
    font-family: PingFang SC;
  }

  .explain-icon {
    width: 13px;
    height: 10px;
    background: url('./image/security_02.png') no-repeat;
    background-size: 100%;
  }

  .details {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    height: 51px;
    border-top: 1px dashed #bedcff;
  }

  .text-field {
    padding: 16px 0 16px 16px;
    background: rgba(255, 255, 255, 1);
  }
}
</style>
