<template>
  <t-upload
    :limit="1"
    :file-list="dataFileList"
    :multiple="false"
    action="/server/web/file/upload"
    :headers="uploadHeaders"
    :show-cancel-button="false"
    accept=".pdf,.doc,.docx"
    :tip="dataFileList.length ? '' : '支持jar文件格式，文件大小限制100M以内。'"
    tip-position="bottom"
    @before-upload="beforeUpload100"
    @before-remove="beforeRemove100"
    @success="uploadJarSuccess"
    @error="uploadJarError"
    @change="uploadJarChange"
  ></t-upload>
</template>

<script setup lang="ts">
import { onMounted, ref, defineModel } from 'vue';
import { FileItem, Message } from '@tele-design/web-vue';
import { getToken } from '@/utils/auth';

const pluginPackage = defineModel('pluginPackage');
console.log(pluginPackage);
const dataFileList = ref<any[]>([]);
const uploadHeaders = {
  Authorization: `${getToken()}`,
};

const beforeUpload100 = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    const type = file.type as string;
    console.log(type);
    if (
      !type.endsWith(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    ) {
      Message.warning(`上传失败，请检查文件类型`);
      reject();
    }
    const over2 = file.size > 1024 * 1024 * 100;
    if (over2) {
      Message.warning(`上传失败，文件大小不要超过100M`);
      reject();
    }
    // @ts-ignore
    resolve(true);
  });
};

const beforeRemove100 = (file: any) => {
  return new Promise<void>((resolve, reject) => {
    const flied = file.uid ?? file?.response?.data;
    const aggregate = dataFileList.value.filter((item: any) => {
      return item.uid !== flied;
    });
    dataFileList.value = aggregate;
    if (file.status === 'done') {
      pluginPackage.value = '';
    }
    resolve();
  });
};

const uploadJarSuccess = (fileItem: FileItem) => {
  const res = fileItem.response;
  if (res?.code === 200) {
    pluginPackage.value = fileItem.response.data;
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};

const uploadJarError = (fileItem: FileItem) => {
  const size = fileItem.file?.size ?? 0;
  if (size > 50 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过50M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
};

const uploadJarChange = (fileList: FileItem[]) => {
  console.log(fileList);
  dataFileList.value = fileList;
};

onMounted(() => {});
</script>

<style lang="less" scoped>
.file-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.columns {
  display: flex;
  flex-direction: column;

  .tips {
    margin-top: 8px;
    color: #86909c;
    font-weight: 400;
    font-size: 12px;
    font-family: PingFang SC;
    line-height: 20px;
  }
}
</style>
