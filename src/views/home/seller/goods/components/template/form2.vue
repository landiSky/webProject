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
        show-word-limit
      />
    </t-form-item>
    <template v-for="(item, index) in form.blockList" :key="index">
      <t-divider />
      <span class="header">
        <span>
          <span class="leftDivider"></span>
          区块{{ transSeq[index] }}
        </span>
        <t-tooltip
          v-if="form.blockList.length === 1"
          content="至少保留一个区块"
        >
          <t-link disabled @click="delBlock(index)"> 删除 </t-link>
        </t-tooltip>
        <t-link v-else @click="delBlock(index)"> 删除 </t-link>
      </span>

      <t-form-item
        :field="`blockList.${index}.name`"
        label="区块标题"
        :rules="[
          {
            required: true, 
            validator: (value: string, cb: any) =>
              itemValid(15, '请输入区块标题', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-input
          v-model="item.name"
          placeholder="请输入区块标题"
          :max-length="{ length: 15, errorOnly: true }"
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        :field="`blockList.${index}.desc`"
        label="区块简介"
        :rules="[
          {
            required: true,
            validator: (value: string, cb: any) =>
              itemValid(150, '请输入区块简介', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-textarea
          v-model="item.desc"
          placeholder="请输入区块简介"
          :max-length="{ length: 150, errorOnly: true }"
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        :field="`blockList.${index}.picUrl`"
        label="配图"
        :rules="[
          {
            required: true, 
            validator: (value: any, cb: any) => imgValid(index, value, cb),
          },
        ]"
        validate-trigger="[]"
      >
        <div>
          <t-upload
            list-type="picture-card"
            :file-list="
              item.picUrl
                ? [{ url: `/server/web/file/download?name=${item.picUrl}` }]
                : []
            "
            :headers="{
              Authorization: `${getToken()}`,
            }"
            action="/server/web/file/upload"
            accept=".png,.jpg,.bmp,.jpeg,.gif"
            :limit="1"
            tip="点击上传"
            image-preview
            @before-upload="(file: Record<string, any>) => onBeforeUpload(file, index)"
            @change="(fileList: any) => onUploadChange(fileList, index)"
            @success="onUploadSuccess"
          >
          </t-upload>
          <span class="uploadTips">
            建议图片尺寸：200px *
            200px，支持jpg、png、bmp、gif、jpeg文件格式，文件大小限制10M以内。
          </span>
        </div>
      </t-form-item>
    </template>
  </t-form>
  <t-divider />
  <div v-show="form.blockList.length < 6" class="extraOpt">
    <iconpark-icon
      class="plusIcon"
      name="squarePlus"
      size="20px"
      @click="addBlock"
    ></iconpark-icon>
    <span>添加区块</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, inject, onMounted } from 'vue';
import type { Ref } from 'vue';
import { getToken } from '@/utils/auth';
import { Message } from '@tele-design/web-vue';
import { ImgTypeEnum } from '../../constant';

const formRef = ref();
const transSeq = ['一', '二', '三', '四', '五', '六'];

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
    type: 2,
    moduleName: '',
    blockList: [
      {
        name: '',
        desc: '',
        picUrl: '',
      },
    ],
  };
};

const form = ref(initForm());

const imgValid = (index: number, value: string, cb: (params?: any) => void) => {
  const urlPath = form.value.blockList[index].picUrl;
  if (!urlPath) {
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

const addBlock = () => {
  form.value.blockList.push({
    name: '',
    desc: '',
    picUrl: '',
  });
};

const delBlock = (index: number) => {
  form.value.blockList.splice(index, 1);
};

const onBeforeUpload = (currentFile: Record<string, any>, index: number) => {
  return new Promise((resolve, reject) => {
    if (!ImgTypeEnum.includes(currentFile.type)) {
      Message.warning('请上传正确的文件格式');
      reject();
      return;
    }
    if (currentFile.size > 10 * 1024 * 1024) {
      formRef.value.setFields({
        [`blockList.${index}.picUrl`]: {
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

const onUploadChange = (fileList: any, index: number) => {
  form.value.blockList[index].picUrl = '';
  fileList.forEach((item: Record<string, any>) => {
    const { code, data } = item.response || {};
    if (code === 200) {
      form.value.blockList[index].picUrl = data;
      formRef.value.clearValidate(`blockList.${index}.picUrl`);
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
  initForm,
});
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
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
  display: inline-block;
  margin-top: 8px;
  color: #86909c;
}

.extraOpt {
  display: flex;
  align-items: center;

  .plusIcon {
    cursor: pointer;
  }

  span {
    margin-left: 8px;
    color: #1d2129;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px; /* 166.667% */
  }
}
</style>
