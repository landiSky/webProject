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

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ThreeButton',
  props: {
    openModel: Number,
    isPreview: Boolean,
  },
  emits: ['controlPreview', 'clickSave', 'clickSaveRemote'],
  methods: {
    controlPreview() {
      this.$emit('controlPreview');
    },
    clickSave() {
      this.$emit('clickSave');
    },
    clickSaveRemote() {
      this.$emit('clickSaveRemote');
    },
  },
});
</script>

<style scoped></style>
