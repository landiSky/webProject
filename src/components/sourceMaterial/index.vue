<template>
  <t-upload
    list-type="picture-card"
    action="/"
    :default-file-list="fileList"
    image-preview
    :limit="1"
    :on-before-remove="onBeforeRemove"
    @change="handleChange"
  >
    <template #remove-icon>
      <iconpark-icon name="replace" size="16px"></iconpark-icon>
    </template>
  </t-upload>
  <Source
    v-if="showSource"
    :visible="showSource"
    :confirm-loading="confirmLoading"
    title="素材库"
    @on-confirm="onConfirm"
    @on-cancel="onCancel"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Source from './components/source.vue';

const showSource = ref(false);

const confirmLoading = ref(false);

const fileList = ref([
  {
    uid: '-2',
    name: '20200717-103937.png',
    url: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
  },
]);

const onBeforeRemove = (fileItem: any) => {
  console.log('onBeforeRemove', fileItem);
  showSource.value = true;
};

const onConfirm = () => {
  // console.log('onConfirm');
};

const onCancel = () => {
  showSource.value = false;
};

const handleChange = (info: any) => {
  //   console.log('handleChange1', info);
  //   if (info.file.status === 'removed') {
  //     console.log('handleChange2', info);
  //     // 当试图删除文件时阻止操作
  //     fileList.value = [...fileList.value]; // 重新设置fileList状态以防止组件响应删除操作
  //   } else {
  //     fileList.value = info.fileList;
  //   }
};
</script>

<style scoped lang="less"></style>
