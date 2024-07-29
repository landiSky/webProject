<template>
  <t-modal
    v-model:visible="showModal"
    :width="1000"
    :title="props.title"
    :ok-loading="props.confirmLoading"
    ok-text="下一步"
    @ok="onOk"
    @cancel="onCancel"
  >
    <t-spin size="24" :loading="state.loading">
      <t-tabs direction="vertical" class="tabs-container" @change="onTabChange">
        <t-tab-pane
          v-for="item in sidebarTitle"
          :key="item.id"
          :title="item.title"
        >
          <div class="tabpane-header">
            <span>共 {{ state.total }} 张图片</span>
            <t-upload
              v-if="state.type === 2"
              :headers="uploadHeaders"
              action="/server/web/file/upload"
              accept=".jpg,.png,.bmp,.jpeg"
              :data="uploadData"
              @success="uploadSuccess"
              @error="uploadError"
            >
              <template #upload-button>
                <t-space>
                  <t-button>上传素材</t-button>
                </t-space>
              </template>
              <template #upload-item />
            </t-upload>
          </div>
          <div class="list-content">
            <div
              v-for="i in state.imgList"
              :key="JSON.stringify(i.id)"
              class="list-item"
              :class="i.active ? 'active' : ''"
              @click="onListItemClick(i.id)"
            >
              <t-upload
                class="picture-card"
                list-type="picture-card"
                :file-list="[
                  {
                    url: `/server/web/file/download?name=${i.name}`,
                  },
                ]"
                action="/"
                image-preview
                :limit="1"
                :on-before-remove="onBeforeRemove"
              >
              </t-upload>
            </div>
          </div>
          <div class="list-pagination">
            <t-pagination
              v-if="state.total > 12"
              :total="state.total"
              size="mini"
              :current="params.pageNum"
              :page-size="params.pageSize"
              @change="onPageChange"
            />
          </div>
        </t-tab-pane>
      </t-tabs>
    </t-spin>
  </t-modal>
  <UploadCropperModal
    :visible="uploadCropperVisible"
    :file-name="state.fileName"
    :cropper-props="{ stencilSize: { width: cutWidth, height: cutHeight } }"
    @on-close="uploadCropperClose"
    @on-success="uploadCropperSuccess"
  />
</template>

<script lang="ts" setup>
import {
  defineProps,
  computed,
  reactive,
  onMounted,
  ref,
  defineEmits,
} from 'vue';
import { useUserStore } from '@/store/modules/user';
import { getToken } from '@/utils/auth';
import { fetchMaterialList, fetchFileDel } from '@/api/decoration/material';
import { Message, Modal } from '@tele-design/web-vue';
import UploadCropperModal from './upload-cropper-modal.vue';

const store = useUserStore();

const { userInfoByCompany } = store;

const emits = defineEmits(['onConfirm', 'onCancel']);

const props = defineProps({
  visible: Boolean,
  confirmLoading: Boolean,
  title: String,
  cutWidth: Number,
  cutHeight: Number,
});

const sidebarTitle = ref([
  {
    title: '系统素材',
    id: 1,
  },
  {
    title: '我的素材',
    id: 2,
  },
]);

const uploadCropperVisible = ref(false);

const params = reactive<{
  pageSize: number;
  pageNum: number;
  companyId: number | undefined;
}>({
  pageSize: 12,
  pageNum: 1,
  companyId: undefined, // 内置-1 我的-管理员不传/机构companyId
});

const state = reactive<{
  imgList: Record<string, any>[];
  loading: boolean;
  total: number;
  type: number;
  fileName: string;
}>({
  imgList: [],
  loading: false,
  total: 0,
  type: 1, // 1-系统素材，2-我的素材
  fileName: '',
});

const showModal = computed(() => props.visible);

const uploadHeaders = {
  Authorization: `${getToken()}`,
};

const uploadData = () => {
  if (state.type === 2 && userInfoByCompany?.companyId) {
    return {
      companyId: userInfoByCompany?.companyId,
    };
  }
  return {};
};

const getMaterialList = () => {
  state.loading = true;
  fetchMaterialList({
    ...params,
    companyId: state.type === 1 ? -1 : userInfoByCompany?.companyId,
  })
    .then((res) => {
      state.loading = false;
      state.total = res.total;
      const recordData = res.records.map((name: string, idx: number) => ({
        id: idx,
        name,
        active: false,
      }));
      state.imgList = recordData || [];
    })
    .catch(() => {
      state.loading = false;
      state.imgList = [];
    });
};

const onBeforeRemove = (fileItem: any) => {
  const { url = '' } = fileItem;
  const urlString = url.split('?')[1] || '';
  const saveName = urlString.split('=')[1];
  Modal.warning({
    title: '确认删除该素材',
    okText: '删除',
    titleAlign: 'start',
    hideCancel: false,
    content: '',
    onOk: () => {
      fetchFileDel(saveName)
        .then(() => {
          Message.success('删除成功');
          getMaterialList();
        })
        .catch((e) => {
          Message.warning(e.error);
        });
    },
  });
};

const uploadSuccess = () => {
  getMaterialList();
};

const uploadError = () => {
  Message.error('上传失败');
};

const onTabChange = (key: number) => {
  params.pageNum = 1;
  state.type = key;
  getMaterialList();
};

const onListItemClick = (index: number) => {
  state.imgList[index].active = true;
  state.imgList.forEach((item, idx) => {
    if (idx === index) {
      item.active = true;
    } else {
      item.active = false;
    }
  });
};

const onPageChange = (current: number) => {
  params.pageNum = current;
  getMaterialList();
};

const onOk = () => {
  // 用数据去循环，这样保证状态都是重新渲染的
  state.fileName = '';
  state.imgList.forEach((item) => {
    if (item.active) {
      state.fileName = item.name;
    }
  });
  if (state.fileName) {
    uploadCropperVisible.value = true;
  } else {
    Message.error('请选择图片');
  }

  console.log('onOk', uploadCropperVisible.value);
};

const onCancel = () => {
  emits('onCancel');
};

const uploadCropperSuccess = (value: any) => {
  uploadCropperVisible.value = false;
  emits('onConfirm', value);
};

const uploadCropperClose = () => {
  uploadCropperVisible.value = false;
  // emits('onCancel');
};

onMounted(async () => {
  await getMaterialList();
});
</script>

<style scoped lang="less">
.tabs-container {
  :deep(.tele-tabs-nav-vertical .tele-tabs-nav-ink) {
    left: 0;
    width: 4px;
    height: 18px;
    background: #1664ff;
  }

  :deep(.tele-tabs-nav) {
    width: 108px;
    // margin-right: 16px;
  }

  :deep(.tele-tabs-nav-type-line) {
    &::before {
      display: none;
    }
  }

  .list-content {
    width: 836px;
    height: 432px;
    margin-bottom: 12px;
    padding: 16px 24px;
    overflow: auto;
    background: #f8f8f8;
  }

  :deep(.tele-tabs-pane) {
    .list-item {
      display: inline-block;
      margin-right: 16px;
      margin-bottom: 16px;
      vertical-align: top;
      background: #d9d9d9;
      border-radius: 2px;

      &:nth-child(4n) {
        margin-right: 0;
      }

      &:nth-last-child(-n + 4) {
        margin-bottom: 0;
      }
    }

    .tabpane-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 42px;
      padding: 10px 24px 0;
      background: #f8f8f8;

      .tele-upload-wrapper {
        width: 88px;
      }
    }
  }

  :deep(.tele-upload-list-picture) {
    width: 185px;
    height: 140px;
    margin-right: 0;
    margin-bottom: 0;
    line-height: 140px;
    border: 2px solid #f7f7f7;
    border-radius: 2px;
  }

  .list-item.active {
    :deep(.tele-upload-list-picture) {
      border: 2px solid #1664ff;
    }
  }

  :deep(.tele-upload-list-picture-mask .tele-upload-list-picture-operation) {
    width: 100px;
    margin: auto;
    line-height: 140px;
  }

  .list-pagination {
    .tele-pagination {
      justify-content: flex-end;
    }
  }
}
</style>
