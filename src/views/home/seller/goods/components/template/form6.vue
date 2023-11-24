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
        :field="`blockList.${index}`"
        label="配图"
        :rules="[
          {
            required: true,
            validator: (value: string, cb: any) => itemValid(index, '请上传配图', value, cb),
          },
        ]"
        validate-trigger="[]"
      >
        <div>
          <t-upload
            :file-list="item ? item : []"
            list-type="picture-card"
            :headers="{
              Authorization: `Bearer ${getToken()}`,
            }"
            action="/server/web/file/upload"
            accept=".png,.jpg,.bmp,.jpeg,.gif"
            :limit="5"
            tip="点击上传"
            image-preview
            @before-upload="(file: Record<string, any>) => onBeforeUpload(file, index)"
            @change="(fileList: any, fileItem: any) => onUploadChange(fileList, fileItem, index)"
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
  <div v-show="form.blockList.length < 3" class="extraOpt">
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
import { ref, inject, onMounted } from 'vue';
import type { Ref } from 'vue';
import { getToken } from '@/utils/auth';
import { Message } from '@tele-design/web-vue';

const formRef = ref();
const transSeq = ['一', '二', '三'];

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
    type: 6,
    moduleName: '',
    blockList: [[]],
  };
};

const form = ref(initForm());

const itemValid = (
  index: number,
  msg: string,
  value: string,
  cb: (params?: any) => void
) => {
  const item: { url: string }[] = form.value.blockList[index];

  if (!item) {
    return cb(msg);
  }

  if (Array.isArray(item) && item.length < 5) {
    return cb('请上传 5 张配图');
  }

  return cb();
};

const addBlock = () => {
  form.value.blockList.push([]);
};

const delBlock = (index: number) => {
  form.value.blockList.splice(index, 1);
};

const onBeforeUpload = (currentFile: Record<string, any>, index: number) => {
  return new Promise((resolve, reject) => {
    if (currentFile.size > 10 * 1024 * 1024) {
      formRef.value.setFields({
        [`blockList.${index}`]: {
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

const onUploadChange = (fileList: any, fileItem: any, index: number) => {
  // const { code } = fileItem.response || {};
  const { response, status } = fileItem;

  if (response?.code === 200 || (!response && status === 'done')) {
    // 200 是上传成功，后面是删除时用的
    const temp = fileList.map((item: Record<string, any>) => {
      const { uid, name, response, url } = item;
      if (response) {
        if (response.code === 200) {
          return {
            uid,
            name,
            url: `/server/web/file/download?name=${response.data}`,
          };
        }
      } else {
        return { uid, name, url };
      }

      return {};
    });

    form.value.blockList[index] = temp;
    if (temp.length === 5) {
      formRef.value.clearValidate(`blockList.${index}`);
    }
  } else if (response?.code === 101004) {
    Message.error('登录已过期，请重新登录');
  }
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
