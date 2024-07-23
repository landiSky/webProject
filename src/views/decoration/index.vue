<!-- 基本信息 -->
<template>
  <t-form
    ref="formRef"
    :model="form"
    :rules="formRules"
    :style="{ width: '100%', height: '100%', padding: '50px 40px' }"
    auto-label-width
  >
    <t-form-item field="name" label="平台名称配置">
      <t-input
        v-model="form.name"
        :style="{ width: '532px' }"
        :max-length="10"
        show-word-limit
        allow-clear
        placeholder="请输入"
      />
    </t-form-item>
    <t-form-item field="logo" label="平台LOGO配置">
      <t-space direction="vertical" :style="{ width: '100%' }">
        <t-upload
          :file-list="
            form.logo
              ? [
                  {
                    url: `/server/web/file/download?name=${form.logo}`,
                  },
                ]
              : []
          "
          list-type="picture-card"
          :headers="uploadHeaders"
          action="/server/web/file/upload"
          :limit="1"
          image-preview
          style="width: 100px; height: 100px"
          accept=".jpg,.png,.bmp,.tif,.gif"
          tip="支持jpg、png、bmp、tif、gif文件格式，文件大小限制10M以内。"
          @before-upload="beforeUpload"
          @change="(fileList: any) => onUploadChange(fileList)"
        >
          <template #upload-button>
            <div
              style="
                width: 100px;
                height: 100px;
                color: var(--color-text-1);
                text-align: center;
                background-color: var(--color-fill-2);
                border: 1px dashed var(--color-fill-4);
              "
            >
              <div style="margin-top: 30px">
                <div> <IconPlus :style="{ fontSize: '16px' }" /></div>
                <div
                  style="
                    margin-top: 10px;
                    color: #4e5969;
                    font-weight: 500;
                    font-size: 12px;
                  "
                  >点击上传</div
                >
              </div>
            </div>
          </template>
        </t-upload>
      </t-space>
    </t-form-item>
    <div style="width: 100%; height: 100%"> </div>

    <div class="submit-btn">
      <t-space :size="19">
        <t-button type="primary" @click="handleSubmit(form)">保存</t-button>
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
import {
  apiUpdateNavData,
  apiGetNavData,
} from '@/api/decoration/decoration-tools';
import { useDecorationStore } from '@/store/modules/decoration';
import { ChannelType } from '@/enums/decoration';
import { Message } from '@tele-design/web-vue';
import { getToken } from '@/utils/auth';

const decoration = useDecorationStore();

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
const handleSubmit = (data: any) => {
  console.log(data);
  formRef.value.validate((valid: any) => {
    console.log('form 验证', valid, form);
    if (!valid) {
      apiUpdateNavData({
        id: ChannelType.PLATFORM_NAME,
        name: data.name,
        logo: data.logo,
      }).then((res) => {
        console.log(res);
        // 暂时不用
        // decoration.setPlatFormLogo(data.logo);
        // decoration.setPlatFormName(data.name);
        Message.success('保存成功');
      });
    }
  });
};

const uploadHeaders = {
  Authorization: `${getToken()}`,
};
const beforeUpload = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    const type = file?.name.substr(
      file?.name.lastIndexOf('.') + 1,
      file?.name.length
    );
    const isLt5M: boolean = file.size / 1024 / 1024 < 10;
    if (!isLt5M) {
      Message.warning('上传图片大小必须限制在10MB以内');
      reject();
    } else if (
      type !== 'jpg' &&
      type !== 'png' &&
      type !== 'bmp' &&
      type !== 'tif' &&
      type !== 'gif'
    ) {
      Message.warning('请上传正确的文件格式');
      reject();
    }
    // @ts-ignore
    resolve(true);
  });
};
const onUploadChange = (fileList: any) => {
  form.logo = '';
  fileList.forEach((item: Record<string, any>) => {
    const { code, data } = item.response || {};
    console.log('上传00', data);
    if (code === 200) {
      console.log('上传成功00', data);
      form.logo = data;
      formRef.value.clearValidate(`logo`);
    }
  });
};
onMounted(() => {
  apiGetNavData({ type: ChannelType.PLATFORM_NAME }).then((res: any) => {
    console.log('platform 名称', res);
    const { name, logo } = res.data[0];
    form.name = name;
    form.logo = logo;
  });
});
</script>

<style scoped lang="less">
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

::v-deep(.tele-upload-list-picture) {
  width: 100px;
  height: 100px;

  img {
    // object-fit: cover;
  }
}
</style>
