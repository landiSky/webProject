<!-- 基本信息 -->
<template>
  <t-form
    ref="formRef"
    :model="form"
    :rules="formRules"
    :style="{ width: '100%', height: '100%', padding: '50px 40px' }"
    auto-label-width
    @submit="handleSubmit"
  >
    <t-form-item field="name" label="平台名称配置">
      <t-input
        v-model="form.name"
        :style="{ width: '532px' }"
        placeholder="请输入"
      />
    </t-form-item>
    <t-form-item field="logo" label="平台LOGO配置">
      <t-space direction="vertical" :style="{ width: '100%' }">
        <t-upload
          action="/"
          :show-file-list="false"
          accept=".jpg,.png,.bmp,.tif,.gif"
          tip="建议图片尺寸：100px * 100px，支持jpg、png、bmp、tif、gif文件格式，文件大小限制10M以内。"
          :limit="1"
          image-preview
          style="width: 100px; height: 100px"
          @change="onChange"
        >
          <template #upload-button>
            <div
              :class="`tele-upload-list-item${
                file && file.status === 'error'
                  ? ' tele-upload-list-item-error'
                  : ''
              }`"
            >
              <div
                v-if="file && file.url"
                class="tele-upload-list-picture custom-upload-avatar"
              >
                <img :src="file.url" />
                <div class="tele-upload-list-picture-mask">
                  <IconEdit />
                </div>
                <t-progress
                  v-if="file.status === 'uploading' && file.percent < 100"
                  :percent="file.percent"
                  type="circle"
                  size="mini"
                  :style="{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translateX(-50%) translateY(-50%)',
                  }"
                />
              </div>
              <div v-else class="tele-upload-picture-card">
                <div class="tele-upload-picture-card-text">
                  <IconPlus />
                  <div style="margin-top: 10px; font-weight: 600"
                    >点击上传
                  </div>
                </div>
              </div>
            </div>
          </template>
        </t-upload>
      </t-space>
    </t-form-item>
    <div style="width: 100%; height: 100%"> </div>

    <div class="submit-btn">
      <t-space :size="19">
        <t-button type="primary">保存</t-button>
        <t-button>取消</t-button>
      </t-space>
    </div>
  </t-form>
</template>

<script lang="ts" setup>
import {
  defineProps,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  ref,
} from 'vue';
import SourceMaterial from '@/components/sourceMaterial/index.vue';

const props = defineProps({
  xxx: {
    type: Boolean,
    default: false,
  },
  yyy: {
    type: Object,
    default() {
      return {};
    },
  },
});
const file = ref();
const formRef = ref();
const form = reactive({
  name: '',
  logo: '',
});

const formRules = {
  name: [{ required: true, message: '请输入平台名称' }],
  logo: [{ required: true, message: '请输入平台LOGO' }],
};
const onChange = (_: any, currentFile: any) => {
  file.value = {
    ...currentFile,
    // url: URL.createObjectURL(currentFile.file),
  };
};
const handleSubmit = (data: any) => {
  console.log(data);
};
</script>

<style scoped lang="less">
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
