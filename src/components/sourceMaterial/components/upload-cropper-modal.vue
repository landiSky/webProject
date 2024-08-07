<template>
  <div class="upload-cropper-contaier">
    <t-upload-cropper
      v-if="visible"
      :cropper-props="cropperProps"
      :modal-props="{
        width:
          cropperProps?.stencilSize?.width < 480
            ? 480
            : cropperProps?.stencilSize?.width,
      }"
      :area-height="
        cropperProps?.stencilSize?.height < 240
          ? 240
          : cropperProps?.stencilSize?.height
      "
      :name="props.fileName"
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

const props = defineProps({
  visible: Boolean,
  fileName: String,
  cropperProps: {
    type: Object,
    dfault: () => {
      return {
        stencilSize: {
          width: 120,
          height: 120,
        },
      };
    },
  },
});

const emit = defineEmits(['onClose', 'onSuccess']);

const visible = computed(() => props.visible);

const error = (err: any) => {
  console.log('error', err);
  Message.error(err.message);
};

const cancel = () => {
  emit('onClose');
};

const close = () => {
  emit('onClose');
};

// 裁剪成功
const success = (currentFile: any) => {
  console.log('裁剪成功:', currentFile);
  const value = {
    ...currentFile,
    url: URL.createObjectURL(currentFile.file),
  };
  // emit('onSuccess', value);
  console.log('value', value);
};

const onBeforeOk = (file: any) => {
  const form = new FormData();

  // const blob = URL.createObjectURL(file);
  // const newfile = new File([blob], '', {
  //   type: blob.type,
  //   lastModified: Date.now(),
  // });
  form.append('file', file);
  form.append('type', '1');
  // form.append('fileField', 'image');
  // console.log('onBeforeOk', blob, newfile, form);
  return new Promise((resolve, reject) => {
    $http
      .post('/server/web/file/upload', form, {})
      .then((res: any) => {
        emit('onSuccess', res);
        Message.success('上传成功');
        resolve(true);
      })
      .catch(() => {
        // Message.error(e.message);
        reject();
      });
  });
};
</script>
