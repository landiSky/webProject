<template>
  <div class="wrap">
    <t-spin v-if="state.loading" class="van-loading" dot />
    <vue-office-docx
      v-if="state.fileType === 'docx' || state.fileType === 'doc'"
      :src="state.filePath"
      style="height: 100vh"
      @rendered="rendered"
      @error="HandlError"
    ></vue-office-docx>
    <vue-office-pdf
      v-if="state.fileType === 'pdf'"
      :src="state.filePath"
      style="height: 100vh"
      @rendered="rendered"
      @error="HandlError"
    ></vue-office-pdf>
    <vue-office-excel
      v-if="state.fileType === 'xlsx' || state.fileType === 'xls'"
      :src="state.filePath"
      style="height: 100vh"
      @rendered="rendered"
      @error="HandlError"
    ></vue-office-excel>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Message } from '@tele-design/web-vue';

import VueOfficeDocx from '@vue-office/docx';
import VueOfficeExcel from '@vue-office/excel';
import VueOfficePdf from '@vue-office/pdf';
// 引入相关样式
import '@vue-office/docx/lib/index.css';

const router = useRouter();
const route = useRoute();
interface data {
  loading: boolean;
  info: any;
  filePath: string;
  fileType: string;
  baseUrl: string;
}
const state: data = reactive({
  loading: true,
  info: {
    fileurl: '',
    orderSource: 0,
    productServerId: '',
  },
  filePath: '', // 预览地址
  fileType: '', // 文件类型
  baseUrl: `${window.location.origin}`,
});

/* pdf,word组件渲染完毕 */
const rendered = () => {
  state.loading = false;
};
/* pdf,word组件渲染出错 */
const HandlError = (errorInfo: any) => {
  Message.error('该文件暂不支持在线预览');
  state.loading = false;
};

onMounted(() => {
  //   state.info = JSON.parse(decodeURIComponent(route?.query?.info));
  state.info = route?.query || {};
  console.log(state.info);
  state.filePath = state.info.fileurl;
  const str = state.info.fileurl.toString();
  const strIndex = str.lastIndexOf('.');
  const fileType = str.slice(strIndex + 1, str.length);
  state.fileType = fileType;
  console.log(state);
});
</script>

<style lang="less" scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  //   padding: 40px 0 0 0;
  .content {
    width: 100%;
    height: 100%;
    padding: 20px 10px;
    overflow-x: auto;
    white-space: pre;
    background: #fff;
  }

  .van-loading {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
  }
}
</style>
