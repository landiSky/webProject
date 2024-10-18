<!-- FloatingButtonBox.vue -->
<template>
  <div v-if="openModel === 0" class="floating_btn-box">
    <t-space size="small" class="icons-container">
      <t-button class="icon-text-container" @click="controlPreview">
        <template #icon>
          <icon-eye v-if="!isPreview" :size="24" />
          <icon-eye-invisible v-if="isPreview" :size="24" />
        </template>
        <template #default>预览</template>
      </t-button>
      <t-button class="icon-text-container" @click="clickSave">
        <template #icon>
          <iconpark-icon name="saveLocal" :size="24" />
        </template>
        <template #default>保存</template>
      </t-button>
      <t-button class="icon-text-container" @click="clickSaveRemote">
        <template #icon>
          <iconpark-icon name="saveRemote" :size="24" />
        </template>
        <template #default>发布</template>
      </t-button>
    </t-space>
  </div>
</template>

<script lang="ts" setup>
import eventBus from '@/utils/bus';
import { useDecorationStore } from '@/store/modules/decoration';
import { watchEffect, onMounted, ref } from 'vue';

const store = useDecorationStore();

const { isPreview, setPreview } = store;

const openModel = ref(0);

const controlPreview = () => {
  eventBus.emit('message-preview');
};
const clickSave = () => {
  eventBus.emit('message-save');
};

const clickSaveRemote = () => {
  eventBus.emit('message-saveRemote');
};

watchEffect(() => {
  console.log('isPreview changed:', isPreview);
});

const setOpenModel = (newValue) => {
  openModel.value = newValue;
};

onMounted(() => {
  eventBus.on('openModelChange', setOpenModel);
});
</script>

<style scoped lang="less">
.floating_btn-box {
  position: fixed;
  bottom: 15px;
  left: auto;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 40px;
  background-color: white;
  border-radius: 2px;
  cursor: pointer;

  .icons-container {
    .icon-text-container {
      display: flex;
      gap: 4px;
      align-items: center;
      justify-content: center;
      width: 76px;
      height: 36px;
      padding: 6px 12px 6px 12px;
      background: #f2f3f8;
      border-radius: 2px 0 0 0;
    }
  }
}
</style>
