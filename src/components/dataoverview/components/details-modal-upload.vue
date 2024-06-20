<template>
  <t-modal
    v-model:visible="showModal"
    :width="516"
    title-align="start"
    :closable="false"
    :mask-closable="true"
    :footer="null"
    @cancel="emit('cancel')"
    @close="emit('cancel')"
  >
    <div class="modal-body">
      <div v-for="(item, index) in data" :key="index" class="module">
        <div class="img">图片</div>
        <div class="title">{{ item.useExplainOriginal }}</div>
        <div class="module-button">
          <t-link href="link" :hoverable="false">预览</t-link>
          <t-link
            href="link"
            :hoverable="false"
            @click="
              instructionsuse(
                item.useExplain,
                item.orderSource,
                item.productServerId
              )
            "
            >下载</t-link
          >
        </div>
      </div>
    </div>
  </t-modal>
</template>

<script lang="ts" setup>
import Error from '@/assets/images/home/Error.png';
import { defineProps, defineEmits, ref } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { authDetails } from '@/api/authentication';
import { Message } from '@tele-design/web-vue';
import Warn from '@/assets/images/home/warn.png';

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);

const props = defineProps({
  data: {
    type: Array,
    default() {
      return [];
    },
  },
});

const emit = defineEmits(['confirm', 'cancel']);
const showModal = ref(true);

// 使用说明
const instructionsuse = (
  item: any
  // fileurl: string,
  // orderSource: string,
  // productServerId: string
) => {
  const link = document.createElement('a');
  const objectUrl = `/server/web/file/orderDownloadBySource?name=${item?.fileurl}&source=${item?.orderSource}&serverId=${item?.productServerId}`; // 创建一个新的url对象
  link.href = objectUrl;
  const fileName = '使用说明';
  link.download = fileName; //  下载的时候自定义的文件名
  link.click();
  window.URL.revokeObjectURL(objectUrl); // 为了更好地性能和内存使用状况，应该在适当的时候释放url
};
</script>

<style lang="less" scoped>
.modal-body {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.module {
  .img {
    width: 100px;
    height: 100px;
    background: red;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    width: 100px;
    margin: 4px 0;
    color: rgba(29, 33, 41, 1);
    font-weight: 500;
    font-size: 12px;
    font-family: PingFang SC;
  }

  .module-button {
    display: flex;
    justify-content: space-between;
    width: 100px;
  }
}
</style>
