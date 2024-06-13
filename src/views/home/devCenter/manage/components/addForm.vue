<template>
  <t-drawer
    :title="props.title"
    ok-text="确认创建"
    :width="720"
    :visible="props.visible"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <template #footer>
      <t-button @click="handleCancel">取消</t-button>
      <t-button type="primary" @click="handleConfirm">确认创建</t-button>
    </template>
    <t-form
      ref="formRef"
      :model="form"
      :label-col-props="{ span: 3, offset: 0 }"
      :wrapper-col-props="{ span: 21 }"
    >
      <t-form-item
        field="appType"
        label="应用类型"
        :rules="[
          {
            required: true,
            validator: validateRadio,
            message: '应用类型不允许为空',
          },
        ]"
      >
        <t-radio-group v-model="form.appType">
          <t-radio :value="0">企业自建应用</t-radio>
          <t-radio :value="1">商城应用</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item
        field="appName"
        label="应用名称"
        :rules="[
          {
            required: true,
            message: '应用名称不允许为空',
          },
          { maxLength: 50, message: '不允许超过50个字符' },
        ]"
      >
        <t-textarea
          v-model="form.appName"
          placeholder="请输入"
          :max-length="50"
          allow-clear
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        field="introduction"
        label="应用描述"
        :rules="[
          {
            required: true,
            message: '应用描述不允许为空',
          },
          { maxLength: 500, message: '不允许超过500个字符' },
        ]"
      >
        <t-textarea
          v-model="form.introduction"
          placeholder="请输入"
          :max-length="500"
          allow-clear
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        label="应用图标"
        field="appLogo"
        class="pic-item"
        validate-trigger="blur"
        :rules="[{ required: true, message: '请上传logo图' }]"
      >
        <div class="file-list">
          <div v-if="form.appLogo" class="file-container">
            <div class="file-image">
              <div class="image-div">
                <t-image
                  width="100px"
                  height="100px"
                  fit="cover"
                  :src="`/server/web/file/download?name=${form.appLogo}`"
                  :preview-visible="logoVisible"
                  :preview-props="{
                    src: `/server/web/file/download?name=${form.appLogo}`,
                  }"
                  @preview-visible-change="() => (logoVisible = false)"
                />
                <div class="image-hover">
                  <div class="hover-bg"> </div>
                  <div class="icon-list">
                    <icon-eye
                      :style="{
                        fontSize: '20px',
                        color: '#fff',
                        cursor: 'pointer',
                      }"
                      @click="() => (logoVisible = true)"
                    />
                    <icon-delete
                      :style="{
                        fontSize: '20px',
                        color: '#fff',
                        cursor: 'pointer',
                      }"
                      @click="() => (form.appLogo = '')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <t-upload
          v-if="form.appLogo == ''"
          :ref="logoRef"
          :file-list="logoList"
          :limit="1"
          :multiple="false"
          :headers="uploadHeaders"
          action="/server/web/file/upload"
          :show-cancel-button="false"
          accept=".png,.jpg,.bmp,.jpeg,.gif"
          :show-file-list="false"
          @before-upload="beforeUpload"
          @success="uploadSuccess"
          @error="uploadError"
          @progress="uploadProgress"
        >
          <template #upload-button>
            <t-spin size="24" :loading="logoUploading">
              <div :class="`tele-upload-list-item`">
                <div class="tele-upload-picture-card">
                  <div class="tele-upload-picture-card-text">
                    <IconPlus size="16" stroke-width="6" />
                    <div
                      style="margin-top: 8px; font-weight: 500; font-size: 12px"
                      >点击上传</div
                    >
                  </div>
                </div>
              </div>
            </t-spin>
          </template>
        </t-upload>
      </t-form-item>
      <t-form-item label="" field="" class="hint-item">
        <div class="hint"
          >建议图片尺寸：200px *
          200px，支持jpg、jpeg、png、bmp、gif文件格式，文件大小限制10M以内。</div
        >
      </t-form-item>
    </t-form>
  </t-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
import { Message, FileItem } from '@tele-design/web-vue';
import { getToken } from '@/utils/auth';
import { fetchApplicationAdd } from '@/api/devCenter/manage';

const logoRef = ref();
const logoVisible = ref(false);
const logoUploading = ref(false);
const formRef = ref();

const logoList = ref<any[]>([]);
const online = ref(true);

const emit = defineEmits(['onConfirm', 'onCancel']);

const form = reactive<{
  appName: string;
  appType: number;
  introduction: string;
  appLogo: string;
}>({
  appName: '',
  appType: 0, // 1商场
  introduction: '',
  appLogo: '',
});

const props = defineProps({
  visible: Boolean,
  title: String,
});

const uploadHeaders = {
  Authorization: `${getToken()}`,
};

const beforeUpload = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    const type = file.type as string;
    if (
      !(
        type.endsWith('/jpg') ||
        type.endsWith('/png') ||
        type.endsWith('/bmp') ||
        type.endsWith('/jpeg') ||
        type.endsWith('/gif')
      )
    ) {
      Message.warning(`上传失败，请检查文件类型`);
      reject();
    }
    const over2 = file.size > 1024 * 1024 * 10;
    if (over2) {
      Message.warning(`上传失败，文件大小不要超过10M`);
      reject();
    }
    if (!online.value) {
      Message.warning('网络异常，暂时无法上传，请检查网络');
      reject();
    }
    // @ts-ignore
    resolve(true);
  });
};

const uploadSuccess = (fileItem: FileItem) => {
  logoUploading.value = false;
  const res = fileItem.response;
  if (res?.code === 200) {
    form.appLogo = fileItem.response.data;
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
  formRef.value.validateField('appLogo');
};

const uploadError = (fileItem: FileItem) => {
  logoUploading.value = false;
  form.appLogo = '';
  const size = fileItem.file?.size ?? 0;
  if (size > 10 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过10M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
  formRef.value.validateField('appLogo');
};

const uploadProgress = () => {
  logoUploading.value = true;
};

const handleCancel = () => {
  emit('onCancel');
};

const validateRadio = (value: number, callback: (error?: string) => void) => {
  if (![0, 1].includes(value)) {
    callback('应用类型不能为空');
  } else {
    callback();
  }
};

function cancelUploadingFiles() {
  for (const file of logoList.value) {
    if (file.response === undefined || file.response === null) {
      logoRef.value.abort(file);
    }
  }
}

const handleConfirm = () => {
  formRef.value.validate((errors: undefined) => {
    if (!errors) {
      fetchApplicationAdd(form).then((res) => {
        emit('onConfirm', res);
      });
    }
  });
};

onMounted(() => {
  window.addEventListener('online', () => {
    online.value = true;
  });
  window.addEventListener('offline', () => {
    cancelUploadingFiles();
    online.value = false;
  });
});
</script>

<style lang="less" scoped>
.tele-drawer-body {
  padding: 32px 20px;
}

.file-container {
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 100px;
  margin-right: 8px;

  &:last-child {
    margin-right: 0;
  }

  .file-image {
    position: relative;
    width: 100px;
    height: 100px;
    background: #f6f7fb;
    border-radius: 2px;

    .image-div {
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      overflow: hidden;
      border: 1px solid #e5e8ef;
      border-radius: 2px;

      .image-hover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        padding: 40px 20px;
        border-radius: 2px;
        opacity: 0;

        .hover-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 40px 20px;
          background: #1d2129;
          border-radius: 2px;
          opacity: 0.5;
        }

        .icon-list {
          position: relative;
          z-index: 999;
          display: flex;
          justify-content: space-between;
          height: 20px;
        }
      }

      .image-hover:hover {
        opacity: 1;
      }
    }
  }
}

.pic-item {
  margin-bottom: 0 !important;
}

.hint {
  color: #86909c;
  font-size: 12px;
  line-height: 20px;
}

.hint-item {
  margin-top: 2px !important;
  margin-bottom: 14px !important;
}

.uploadTips {
  display: inline-block;
  margin-top: 8px;
  color: #86909c;
  font-size: 12px;
}
</style>
