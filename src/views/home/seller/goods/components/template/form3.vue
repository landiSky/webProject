<template>
  <t-form
    ref="formRef"
    :model="form"
    :label-col="{ span: 4 }"
    label-align="left"
    auto-label-width
  >
    <t-form-item
      field="moduleName"
      label="模块标题"
      :rules="[
        { required: true, message: '请输入模块标题' },
        { maxLength: 10, message: '最多允许输入10个字符' },
      ]"
      :validate-trigger="['change', 'input']"
    >
      <t-input
        v-model="form.moduleName"
        placeholder="请输入模块标题"
        :max-length="{ length: 10, errorOnly: true }"
        allow-clear
        show-word-limit
      />
    </t-form-item>
    <t-form-item
      field="picUrl"
      label="配图"
      :rules="[
        {
          required: true,
          validator: (value: string, cb: any) => imgValid(value, cb),
        },
      ]"
      validate-trigger="[]"
    >
      <div>
        <t-upload
          list-type="picture-card"
          :file-list="
            form.picUrl
              ? [{ url: `/server/web/file/download?name=${form.picUrl}` }]
              : []
          "
          :headers="{
            Authorization: `Bearer ${getToken()}`,
          }"
          action="/server/web/file/upload"
          accept=".jpg,.png,.bmp,.gif,jpeg"
          :limit="1"
          tip="点击上传"
          image-preview
          @before-upload="(file: Record<string, any>) => onBeforeUpload(file)"
          @change="(fileList: any) => onUploadChange(fileList)"
          @success="onUploadSuccess"
        >
        </t-upload>
        <span class="uploadTips">
          建议图片尺寸：200px *
          200px，支持jpg、png、bmp、gif、jpeg文件格式，文件大小限制10M以内。
        </span>
      </div>
    </t-form-item>
    <t-divider />
    <span class="header"> <span class="leftDivider"></span>区块一</span>
    <t-form-item
      field="blockList.0.name"
      label="区块标题"
      :rules="[
        {
          required: true,
          validator: (value: string, cb: any) => itemValid(20, '请输入区块标题', value, cb),
        },
      ]"
      :validate-trigger="['change', 'input']"
    >
      <t-input
        v-model="form.blockList[0].name"
        placeholder="请输入区块标题"
        :max-length="{ length: 20, errorOnly: true }"
        allow-clear
        show-word-limit
      />
    </t-form-item>
    <t-form-item
      field="blockList.0.desc"
      label="区块简介"
      :rules="[
        {
          required: true,
          validator: (value: string, cb: any) => itemValid(64, '请输入区块简介', value, cb),
        },
      ]"
      :validate-trigger="['change', 'input']"
    >
      <t-textarea
        v-model="form.blockList[0].desc"
        placeholder="请输入区块简介"
        :max-length="{ length: 64, errorOnly: true }"
        allow-clear
        show-word-limit
      />
    </t-form-item>
    <t-divider />
    <span class="header"> <span class="leftDivider"></span>区块二</span>
    <t-form-item
      field="blockList.1.name"
      label="区块标题"
      :rules="[
        {
          required: true,
          validator: (value: string, cb: any) => itemValid(20, '请输入区块标题', value, cb),
        },
      ]"
      :validate-trigger="['change', 'input']"
    >
      <t-input
        v-model="form.blockList[1].name"
        placeholder="请输入区块标题"
        :max-length="{ length: 20, errorOnly: true }"
        allow-clear
        show-word-limit
      />
    </t-form-item>
    <t-form-item
      field="blockList.1.desc1"
      label="简介1"
      :rules="[
        {
          required: true,
          validator: (value: string, cb: any) => itemValid(50, '请输入简介1', value, cb),
        },
      ]"
      :validate-trigger="['change', 'input']"
    >
      <t-textarea
        v-model="form.blockList[1].desc1"
        placeholder="请输入简介1"
        :max-length="{ length: 50, errorOnly: true }"
        allow-clear
        show-word-limit
      />
    </t-form-item>
    <t-form-item
      field="blockList.1.desc2"
      label="简介2"
      :rules="[
        {
          required: true,
          validator: (value: string, cb: any) => itemValid(50, '请输入简介2', value, cb),
        },
      ]"
      :validate-trigger="['change', 'input']"
    >
      <t-textarea
        v-model="form.blockList[1].desc2"
        placeholder="请输入简介2"
        :max-length="{ length: 50, errorOnly: true }"
        allow-clear
        show-word-limit
      />
    </t-form-item>
    <t-form-item
      field="blockList.1.desc3"
      label="简介3"
      :rules="[
        {
          required: true,
          validator: (value: string, cb: any) => itemValid(50, '请输入简介3', value, cb),
        },
      ]"
      :validate-trigger="['change', 'input']"
    >
      <t-textarea
        v-model="form.blockList[1].desc3"
        placeholder="请输入简介3"
        :max-length="{ length: 50, errorOnly: true }"
        allow-clear
        show-word-limit
      />
    </t-form-item>
  </t-form>
</template>

<script lang="ts" setup>
import { ref, defineProps, inject, onMounted } from 'vue';
import type { Ref } from 'vue';
import { getToken } from '@/utils/auth';
import { Message } from '@tele-design/web-vue';

const formRef = ref();

const templateList: Ref<Record<string, any>[]> = inject(
  'templateList',
  ref([])
);

const props = defineProps({
  currentIndex: {
    type: Number,
    default: -1,
  },
});

const initForm = () => {
  return {
    type: 3,
    moduleName: '',
    picUrl: '',
    blockList: [
      {
        name: '',
        desc: '',
      },
      {
        name: '',
        desc1: '',
        desc2: '',
        desc3: '',
      },
    ],
  };
};

const form = ref(initForm());

const imgValid = (value: string, cb: (params?: any) => void) => {
  if (!form.value.picUrl) {
    return cb('请上传配图');
  }

  return cb();
};

const itemValid = (
  maxLen: number,
  msg: string,
  value: string,
  cb: (params?: any) => void
) => {
  if (!value) {
    return cb(msg);
  }

  if (maxLen > 0 && String(value).length > maxLen) {
    return cb(`最多允许输入${maxLen}个字符`);
  }

  return cb();
};

const onBeforeUpload = (currentFile: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    if (currentFile.size > 10 * 1024 * 1024) {
      formRef.value.setFields({
        picUrl: {
          status: 'error',
          message: '文件大小不能超过 10M',
        },
      });
      reject();
    } else {
      resolve(true);
    }
  });
};

const onUploadSuccess = (fileItem: any) => {
  const { response } = fileItem;

  if (response?.code && response.code !== 200) {
    Message.error(response.message);
  }
};

const onUploadChange = (fileList: any) => {
  form.value.picUrl = '';
  fileList.forEach((item: Record<string, any>) => {
    const { code, data } = item.response || {};
    if (code === 200) {
      form.value.picUrl = data;
      formRef.value.clearValidate('picUrl');
    }
  });
};

onMounted(() => {
  if (props.currentIndex > -1 && Array.isArray(templateList.value)) {
    form.value = JSON.parse(
      JSON.stringify(templateList.value[props.currentIndex])
    );
  }
});

defineExpose({
  form,
  formRef,
});
</script>

<style lang="less" scoped>
.header {
  display: block;
  margin-bottom: 20px;
  color: #1d2129;

  .leftDivider {
    display: inline-block;
    width: 2px;
    height: 10px;
    margin-right: 8px;
    background-color: #1664ff;
  }
}

.uploadTips {
  color: #86909c;
}
</style>
