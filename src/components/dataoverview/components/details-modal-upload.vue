<template>
  <t-modal
    v-model:visible="showModal"
    :width="857"
    title="使用说明"
    title-align="center"
    :closable="true"
    :mask-closable="false"
    :footer="null"
    body-style="background:rgba(248, 248, 248, 1);"
    @cancel="emit('cancel')"
    @close="emit('cancel')"
  >
    <div class="modal-body">
      <div v-for="(item, index) in data" :key="index" class="module">
        <div class="img"
          ><img :src="imgType(item?.useExplainOriginal)" alt=""
        /></div>
        <div class="title">
          <t-typography-paragraph
            :ellipsis="{
              rows: 1,
              // showTooltip: true,
              showTooltip: {
                type: 'popover',
              },
            }"
            style="margin-bottom: 0; word-break: break-all"
          >
            {{ item?.useExplainOriginal }}
          </t-typography-paragraph>
        </div>
        <div class="module-button">
          <t-link
            :hoverable="false"
            @click="
              instructionsuse(
                item?.useExplain,
                item?.orderSource,
                item?.productServerId,
                item?.useExplainOriginal
              )
            "
            >下载</t-link
          >
          <t-divider direction="vertical" />
          <t-link
            :hoverable="false"
            @click="
              preview(
                item?.useExplain,
                item?.orderSource,
                item?.productServerId
              )
            "
            >预览</t-link
          >
        </div>
      </div>
    </div>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, PropType, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { orderDownloadBySource } from '@/api/common';
import { Message } from '@tele-design/web-vue';
import Warn from '@/assets/images/home/warn.png';
import docxicon from '@/assets/images/idinside/docx-icon.png';
import pdficon from '@/assets/images/idinside/pdf-icon.png';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);
interface dataList {
  useExplain: string;
  orderSource: number;
  productServerId: string;
  useExplainOriginal: string;
}
const props = defineProps({
  data: {
    type: Array as PropType<dataList[]>,
    default() {
      return [];
    },
  },
});

const emit = defineEmits(['confirm', 'cancel']);
const showModal = ref(true);

const imgType = (value: string) => {
  const str = value.toString();
  const strIndex = str.lastIndexOf('.');
  const name = str.slice(strIndex, str.length);
  if (name === '.docx' || name === '.doc') {
    return docxicon;
  }
  return pdficon;
};
// 使用说明
const instructionsuse = (
  fileurl: string,
  orderSource: number,
  productServerId: string,
  useExplainOriginal: string
) => {
  const params = {
    name: fileurl,
    source: orderSource,
    serverId: productServerId,
  };
  orderDownloadBySource(params).then((response: any) => {
    const contentDisposition = response.headers['content-disposition'];
    const matches =
      contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);
    const fileName =
      contentDisposition && matches && matches.length > 1 ? matches[1] : ''; // 如果没获取到文件名，设置默认文件名
    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = decodeURIComponent(fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href); // 为了更好地性能和内存使用状况，应该在适当的时候释放url
  });
};

const preview = (
  fileurl: string,
  orderSource: number,
  productServerId: string
) => {
  // 多个参数时文件名一定要放到最后
  const routeData = router.resolve({
    name: 'wowFileFreview',
    query: {
      fileurl: `/server/web/file/orderDownloadBySource?source=${orderSource}&serverId=${productServerId}&name=${fileurl}`,
    },
  });
  window.open(routeData?.href, '_blank');
};
</script>

<style lang="less" scoped>
.modal-body {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 24px;
}

.module {
  width: 140px;
  height: 176px;
  padding: 10px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;

  .img {
    gap: 0;
    width: 120px;
    height: 92px;
    border-radius: 2px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    width: 120px;
    height: 22px;
    margin-top: 10px;
    padding: 0 10px;
    color: rgba(29, 33, 41, 1);
    font-weight: 500;
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 22px;
    text-align: center;
  }

  .module-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 120px;
    height: 22px;
    margin-top: 10px;
    padding: 0 10px;
  }
}
</style>
