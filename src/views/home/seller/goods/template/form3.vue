<template>
  <t-form
    ref="formRef"
    :model="form"
    :style="{ width: '680px' }"
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
        { required: true, message: '请上传配图' },
        {
          validator: (value, cb) => itemValid(0, '请上传配图', value, cb),
        },
      ]"
      :validate-trigger="['change', 'input']"
    >
      <div>
        <t-upload
          list-type="picture-card"
          :file-list="form.picUrl ? [{ url: form.picUrl }] : []"
          action="/api/v1/handle/bind-handle"
          accept=".jpg,.png,.bmp,.tif,.gif"
          :limit="1"
          :auto-upload="false"
          tip="点击上传"
          @change="(_, currentFile) => onUploadChange(_, currentFile)"
        >
        </t-upload>
        <span class="uploadTips">
          建议图片尺寸：200px *
          200px，支持jpg、png、bmp、tif、gif文件格式，文件大小限制10M以内。
        </span>
      </div>
    </t-form-item>
    <t-divider />
    <span class="header"> <span class="leftDivider"></span>区块一</span>
    <t-form-item
      field="blockList.0.name"
      label="区块标题"
      :rules="[
        { required: true, message: '请输入区块标题' },
        {
          validator: (value, cb) => itemValid(20, '请输入区块标题', value, cb),
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
        { required: true, message: '请输入区块简介' },
        {
          validator: (value, cb) => itemValid(64, '请输入区块简介', value, cb),
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
        { required: true, message: '请输入区块标题' },
        {
          validator: (value, cb) => itemValid(20, '请输入区块标题', value, cb),
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
        { required: true, message: '请输入简介1' },
        {
          validator: (value, cb) => itemValid(50, '请输入简介1', value, cb),
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
        { required: true, message: '请输入简介2' },
        {
          validator: (value, cb) => itemValid(50, '请输入简介2', value, cb),
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
        { required: true, message: '请输入简介3' },
        {
          validator: (value, cb) => itemValid(50, '请输入简介3', value, cb),
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
import { ref, reactive, defineProps, inject } from 'vue';
import type { Ref } from 'vue';

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

const initForm = {
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

const form = ref(
  props.currentIndex > -1 && Array.isArray(templateList.value)
    ? { ...templateList.value[props.currentIndex] }
    : { ...initForm }
);

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

const onUploadChange = (_: any, currentFile: Record<string, any>) => {
  form.value.picUrl = currentFile.url;
};

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
