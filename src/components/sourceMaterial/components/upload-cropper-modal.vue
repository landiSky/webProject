<template>
  <div class="upload-cropper-contaier">
    <t-upload-cropper
      v-if="visible"
      :cropper-props="cropperProps"
      :src="`/server/web/file/download?name=${props.fileName}`"
      :is-re-upload="false"
      :on-before-ok="onBeforeOk"
      @error="error"
      @close="close"
      @cancel="cancel"
      @success="success"
    >
    </t-upload-cropper>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits } from 'vue';
import { Message } from '@tele-design/web-vue';
import $http from '@/utils/http';
import { getToken } from '@/utils/auth';
import axios from 'axios';

const props = defineProps({
  visible: Boolean,
  fileName: String,
});

const emit = defineEmits(['onClose']);

const visible = computed(() => props.visible);

const cropperProps = {
  stencilSize: {
    width: 120,
    height: 120,
  },
};

const error = (err: any) => {
  Message.error(err);
};

const cancel = () => {
  visible.value = false;
};

const close = () => {
  console.log('close');
  emit('onClose');
};

// 裁剪成功
// const success = (currentFile) => {
//   console.log('裁剪成功:', currentFile);
//   const value = {
//     ...currentFile,
//     url: URL.createObjectURL(currentFile.file),
//   };
//   console.log('value', value);
// };

const onBeforeOk = (file: any) => {
  const form = new FormData();

  // const blob = URL.createObjectURL(file);
  // const newfile = new File([blob], '', {
  //   type: blob.type,
  //   lastModified: Date.now(),
  // });
  console.log('file', file);
  form.append('file', file);
  // form.append('fileField', 'image');
  // console.log('onBeforeOk', blob, newfile, form);
  return new Promise((resolve, reject) => {
    $http
      .post('/server/web/file/upload', form, {
        // headers: { Authorization: `${getToken()}` },
      })
      .then(() => {
        Message.error('上传成功');
        resolve(true);
      })
      .catch(() => {
        Message.error('上传失败');
        reject();
      });
  });
};
</script>
