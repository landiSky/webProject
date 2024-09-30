<template>
  <div class="add-goods-container">
    <t-modal
      v-model:visible="state.showModal"
      :title="props.title"
      fullscreen
      has-back-btn="false"
      ok-text="完成"
      popup-container=".add-goods-container"
      :on-before-back="handleBack"
      @back="emit('onCancel')"
    >
      <t-alert
        class="top-inform"
        :type="StatusClassEnum[props.tableRecord?.status]"
        :banner="true"
        >应用状态：{{ StatusEnum[props.tableRecord?.status] ?? '-' }}</t-alert
      >
      <template #footer>
        <div class="footer-button">
          <t-button style="margin-right: 8px" @click="handleCancel"
            >取消</t-button
          >
          <span class="right-btn">
            <t-button
              v-if="props.tableRecord?.status === 0"
              class="save-btn"
              :loading="state.delLoading"
              @click="handleDel"
              >删除</t-button
            >
            <t-button
              v-if="props.tableRecord?.status === 2 && showButton"
              :loading="state.launchLoading"
              @click="handleLaunch"
              >上线</t-button
            >
            <t-button
              v-if="props.tableRecord?.status === 0 && !showButton"
              :loading="state.launchLoading"
              @click="handleLaunch"
              >调试应用</t-button
            >
            <t-tooltip
              v-if="props.tableRecord?.status === 1"
              content="该应用已上线，暂时无法编辑"
              position="top"
            >
              <t-button
                :disabled="props.tableRecord?.status"
                @click="handleEdit"
                >编辑</t-button
              >
            </t-tooltip>
            <t-button
              v-if="props.tableRecord?.status !== 1"
              type="primary"
              :disabled="props.tableRecord?.status === 1"
              @click="handleEdit"
              >编辑</t-button
            >
            <t-button
              v-if="props.tableRecord?.status === 1"
              type="primary"
              status="danger"
              @click="handleOffine"
              >下线</t-button
            >
          </span>
        </div>
      </template>
      <t-row class="modal-body" justify="center">
        <t-col class="anchor" flex="224px">
          <t-affix :offset-top="160" class="affix">
            <t-anchor
              :ref="anchorRef"
              :change-hash="false"
              scroll-container="#abutInfo"
              @select="handleAnchorSelect"
            >
              <t-anchor-link href="#proof">应用凭证</t-anchor-link>
              <t-anchor-link href="#appInfo">应用信息</t-anchor-link>
              <t-anchor-link href="#abutInfo">对接信息</t-anchor-link>
              <t-anchor-link v-if="showAuthLimit" href="#authInfo"
                >权限信息</t-anchor-link
              >
              <t-anchor-link
                v-if="!showAuthLimit"
                href="#authorizationInformation"
                >授权信息</t-anchor-link
              >
            </t-anchor>
          </t-affix>
        </t-col>
        <t-col class="anchor-content" :span="14">
          <t-form
            ref="formRef"
            :model="form"
            :label-col-props="{ span: 3, offset: 0 }"
            :wrapper-col-props="{ span: 21 }"
            label-align="left"
          >
            <t-descriptions
              id="proof"
              title="应用凭证"
              :title-style="{
                fontSize: '14px',
                lineHeight: '22px',
                marginBottom: '24px',
              }"
              :title-divider-style="{ height: '12px' }"
              :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
              size="medium"
              :column="1"
            >
              <t-descriptions-item>
                <t-table
                  ref="tableRef"
                  row-key="id"
                  :columns="columns"
                  :data="state.tableData"
                  :pagination="false"
                  style="width: 629px"
                >
                  <template #clientId="{ record }">
                    <t-typography-paragraph
                      copyable
                      :ellipsis="{
                        rows: 1,
                        showTooltip: true,
                      }"
                      class="merchantName"
                      >{{ record.clientId }}</t-typography-paragraph
                    >
                  </template>
                  <template #clientSecret="{ record }">
                    <t-typography-paragraph
                      copyable
                      :ellipsis="{
                        rows: 1,
                        showTooltip: true,
                      }"
                      class="merchantName"
                      >{{ record.clientSecret }}</t-typography-paragraph
                    >
                  </template>
                </t-table>
              </t-descriptions-item>
            </t-descriptions>
            <t-descriptions
              id="appInfo"
              title="应用信息"
              :title-style="{
                fontSize: '14px',
                lineHeight: '22px',
              }"
              :title-divider-style="{ height: '12px' }"
              :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
              size="medium"
              :column="1"
            >
              <t-descriptions-item>
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
                  :hide-asterisk="true"
                >
                  <span>{{ AppTypeEnum[form.appType] ?? '-' }}</span>
                </t-form-item>
                <t-form-item
                  v-if="showAuthLimit"
                  field="dockingMethod"
                  label="对接方式"
                  :rules="[
                    {
                      required: true,
                      message: '对接方式不允许为空',
                    },
                  ]"
                  :hide-asterisk="true"
                >
                  <span>{{ ModeTypeEnum[form.dockingMethod] ?? '-' }}</span>
                </t-form-item>
                <t-form-item
                  field="appName"
                  label="应用名称"
                  :rules="[
                    {
                      required: true,
                      message: '应用名称不允许为空',
                    },
                  ]"
                  :hide-asterisk="true"
                >
                  <span>{{ form.appName ?? '-' }}</span>
                </t-form-item>
                <t-form-item
                  field="introduction"
                  label="应用描述"
                  :rules="[
                    {
                      required: true,
                      message: '应用描述不允许为空',
                    },
                  ]"
                  :hide-asterisk="true"
                >
                  <span>{{ form.introduction ?? '-' }}</span>
                </t-form-item>
                <t-form-item
                  label="应用图标"
                  field="appLogo"
                  class="pic-item"
                  validate-trigger="blur"
                  :rules="[{ required: true, message: '请上传应用图标' }]"
                  :hide-asterisk="true"
                >
                  <div class="file-list">
                    <div v-if="form.appLogo" class="file-container">
                      <div class="file-image">
                        <div class="image-div">
                          <t-image
                            width="100px"
                            height="100px"
                            fit="cover"
                            preview
                            :src="`/server/web/file/download?name=${form.appLogo}`"
                            class="image-cursor"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </t-form-item>
              </t-descriptions-item>
            </t-descriptions>
            <t-descriptions
              id="abutInfo"
              title="对接信息"
              :title-style="{
                fontSize: '14px',
                lineHeight: '22px',
              }"
              :title-divider-style="{ height: '12px' }"
              :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
              size="medium"
              :column="1"
            >
              <t-descriptions-item v-if="showAuthLimitDock">
                <t-form-item
                  field="link"
                  label="应用地址"
                  :rules="[
                    {
                      required: true,
                      message: '应用地址不允许为空',
                    },
                    { maxLength: 500, message: '不允许超过500个字符' },
                  ]"
                  :hide-asterisk="true"
                >
                  <span>{{ form.link ?? '-' }}</span>
                </t-form-item>
              </t-descriptions-item>
              <t-descriptions-item v-if="!showAuthLimit || !showAuthLimitDock">
                <t-form-item
                  class="tip-content"
                  label="应用首页地址"
                  field="homeUri"
                  :rules="[
                    {
                      required: true,
                      message: '应用首页地址不允许为空',
                    },
                    { maxLength: 1000, message: '不允许超过1000个字符' },
                    {
                      match: /^(https?:\/\/).+$/,
                      message: '请输入正确格式',
                    },
                  ]"
                  :hide-asterisk="true"
                >
                  <div>{{ form.homeUri ?? '-' }}</div>
                  <!-- <span class="tip"
                    >请输入以http或https开头的地址，展示在用户端“应用与服务”的地址，可以为域名也可以为“公网IP：端口”</span
                  > -->
                </t-form-item>
                <t-form-item
                  class="tip-content"
                  label="应用回调地址"
                  field="redirectUri"
                  :rules="[
                    {
                      required: true,
                      message: '应用回调地址不允许为空',
                    },
                    { maxLength: 1000, message: '不允许超过1000个字符' },
                    {
                      match: /^(https?:\/\/).+$/,
                      message: '请输入正确格式',
                    },
                  ]"
                  :hide-asterisk="true"
                >
                  <div>{{ form.redirectUri ?? '-' }}</div>
                  <!-- <span class="tip"
                    >请输入以http或https开头的地址，展示在用户端“应用与服务”的地址，可以为域名也可以为“公网IP：端口”</span
                  > -->
                </t-form-item>
              </t-descriptions-item>
            </t-descriptions>
            <t-descriptions
              v-if="showAuthLimit"
              id="authInfo"
              title="权限信息"
              :title-style="{
                fontSize: '14px',
                lineHeight: '22px',
              }"
              :title-divider-style="{ height: '12px' }"
              :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
              size="medium"
              :column="1"
            >
              <t-descriptions-item>
                <t-form-item
                  field="memberType"
                  label="权限设置"
                  :rules="[
                    {
                      required: true,
                      validator: validateRadio,
                    },
                  ]"
                  :hide-asterisk="true"
                >
                  <span>{{ MemberEnum[form.memberType] ?? '-' }}</span>
                </t-form-item>
              </t-descriptions-item>
              <t-descriptions-item v-if="form.memberType === 1">
                <t-form-item
                  field=""
                  class="member-list"
                  label="企业成员"
                  content-class="tag-content"
                  :rules="[
                    {
                      required: true,
                      //   validator: validateMembers,
                    },
                  ]"
                  :hide-asterisk="true"
                >
                  <span
                    v-for="item of form.memberList"
                    :key="item.memberId"
                    class="tagItem"
                    :closable="true"
                    @close="handleTagRemove(item.memberId)"
                  >
                    {{ item.username }}
                  </span>
                </t-form-item>
              </t-descriptions-item>
            </t-descriptions>
            <t-descriptions
              v-if="!showAuthLimit"
              id="authorizationInformation"
              title="授权信息"
              :title-style="{
                fontSize: '14px',
                lineHeight: '22px',
                marginBottom: '16px',
              }"
              :title-divider-style="{ height: '12px' }"
              :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
              size="medium"
              :column="1"
            >
              <t-descriptions-item>
                <t-form-item
                  field="authType"
                  label="授权设置"
                  :hide-asterisk="true"
                >
                  <t-space v-if="form.authType.length">
                    <span v-for="(item, index) in form.authType" :key="index">
                      {{ AuthTypeEnum[Number(item)] }}
                    </span>
                  </t-space>
                  <span v-else>{{ '-' }}</span>
                </t-form-item>
              </t-descriptions-item>
            </t-descriptions>
          </t-form>
        </t-col>
      </t-row>
    </t-modal>
    <AddMembersModal
      v-if="state.showMemberModal"
      :visible="state.showMemberModal"
      :confirm-loading="state.confirmMembersLoading"
      title="添加企业成员"
      :member-list="form.memberList"
      :company-id="state.companyId"
      @on-confirm="handleMembersConfirm"
      @on-cancel="handleMembersCancel"
    >
    </AddMembersModal>
    <AddFormNext
      v-if="state.showAddFormNext"
      :visible="state.showAddFormNext"
      title="编辑应用"
      :edit-id="props.editId"
      @on-cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  computed,
  defineEmits,
  onMounted,
  reactive,
  ref,
  inject,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  fetchApplicationDetail,
  fetchDel,
  fetchOffineStatus,
  fetchOffine,
  fetchLaunch,
} from '@/api/devCenter/manage';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { Message, Modal } from '@tele-design/web-vue';
import AddMembersModal from './addMembersModal.vue';
import AddFormNext from './addFormNext.vue';

const props = defineProps({
  visible: Boolean,
  editId: String,
  title: String,
  tableRecord: Object,
});

const reload: any = inject('reload');
const router = useRouter();
const route = useRoute();

const anchorRef = ref();
const logoVisible = ref(false);
const formRef = ref();

const userStore = useUserStore();
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);

const StatusEnum: { [name: string]: any } = {
  0: '未上线',
  1: '已上线',
  2: '调试中',
};

const StatusClassEnum: { [name: string]: any } = {
  0: 'warning',
  1: 'success',
  2: 'info',
};

const form = reactive<{
  appType: number; // 0、自建应用 1、商城应用
  appName: string; // 应用名称
  introduction: string; // 应用描述
  appLogo: string; // logo地址
  homeUri: string; // 应用首页地址
  redirectUri: string; // 应用回调地址
  memberList: Record<string, any>[]; //
  memberType: number; // 0、全部 1、仅企业
  companyId: string;
  authType: Record<string, any>[];
  dockingMethod: number; // 0、SAAS 1、链接接入
  link: string;
}>({
  appType: 1,
  appName: '',
  introduction: '',
  appLogo: '',
  homeUri: '',
  redirectUri: '',
  memberList: [],
  memberType: 0,
  companyId: userInfoByCompany.value?.companyId,
  authType: [],
  dockingMethod: 1,
  link: '',
});

const state = reactive<{
  tableData: Record<string, any>[];
  tableLoading: boolean;
  showTip: boolean;
  showMemberModal: boolean;
  confirmMembersLoading: boolean;
  companyId: string;
  saveLoading: boolean;
  launchLoading: boolean;
  showAddFormNext: boolean;
  editId: string;
  showModal: boolean;
  offlineStatus: boolean; // 判断是否可以下线
  offlineLoading: boolean;
  delLoading: boolean;
}>({
  tableData: [],
  tableLoading: false,
  showTip: false,
  showMemberModal: false,
  confirmMembersLoading: false,
  companyId: '',
  saveLoading: false,
  launchLoading: false,
  showAddFormNext: false,
  editId: '',
  showModal: true,
  offlineStatus: false,
  offlineLoading: false,
  delLoading: false,
});

const emit = defineEmits(['onCancel']);

const showAuthLimit = computed(() => {
  if (form.appType === 0) {
    return true;
  }
  return false;
});

const showAuthLimitDock = computed(() => {
  if (form.dockingMethod === 1) {
    return true;
  }
  return false;
});

const showButton = computed(() => {
  if (form.appType === 1 || (form.appType === 0 && form.dockingMethod === 0)) {
    if (form.homeUri && form.redirectUri) {
      return true;
    }
    return false;
  }
  if (form.appType === 0 && form.dockingMethod === 1) {
    if (form.link) {
      return true;
    }
    return false;
  }
  return false;
});

const columns = [
  {
    title: 'APP ID',
    dataIndex: 'clientId',
    slotName: 'clientId',
    width: 212,
  },
  {
    title: 'APP Secret',
    dataIndex: 'clientSecret',
    slotName: 'clientSecret',
    width: 400,
  },
];

const validateRadio = (value: number, callback: (error?: string) => void) => {
  if (![0, 1].includes(value)) {
    callback('权限类型不能为空');
  } else {
    callback();
  }
};

const handleTagRemove = (key: string) => {
  form.memberList = form.memberList.filter((item) => item.memberId !== key);
};

// 取消
const handleCancel = () => {
  emit('onCancel');
  state.showAddFormNext = false;
};

const handleEdit = () => {
  state.showModal = false;
  state.showAddFormNext = true;
};

// 上线
const handleLaunch = () => {
  // formRef.value.validate((errors: undefined) => {
  //   if (!errors) {
  state.launchLoading = true;
  // 0 未上线 1 上线
  fetchLaunch({ ...form, id: props.editId, status: 1 }).then((res) => {
    const { data } = res;
    if (data?.code === 200) {
      Message.success({
        content: '上线成功',
        duration: 1000,
        onClose: () => {
          state.launchLoading = false;
          if (route.query?.selectById) {
            router.push({ name: 'devManage' });
          }
          reload();
        },
      });
    } else {
      state.launchLoading = false;
      Message.error(data.message);
    }
  });
  //   }
  // });
};

// 删除
const handleDel = () => {
  Modal.warning({
    title: '确定删除该应用吗？',
    content: '',
    titleAlign: 'start',
    okText: '删除',
    hideCancel: false,
    okButtonProps: {
      status: 'danger',
    },
    onBeforeOk(done) {
      state.delLoading = true;
      fetchDel(props.editId || '')
        .then(() => {
          done(true);
          Message.success({
            content: '删除成功',
            duration: 1000,
            onClose: () => {
              state.delLoading = false;
              if (route.query?.selectById) {
                router.push({ name: 'devManage' });
              }
              reload();
            },
          });
        })
        .catch(() => {
          done(false);
          state.delLoading = false;
        });
    },
  });
};

const handleBack = () => {
  emit('onCancel');
};

const handleMembersConfirm = (data: []) => {
  state.showMemberModal = false;
  form.memberList = data;
};

const handleMembersCancel = () => {
  state.showMemberModal = false;
};

// 下线
const handleOffine = async () => {
  await fetchOffineStatus(props.editId || '').then((res: any) => {
    state.offlineStatus = res;
    if (res) {
      Modal.warning({
        title: '确定下线该应用吗？',
        content: '为避免影响用户使用，请编辑修改后立即重新上线',
        titleAlign: 'start',
        okText: '下线应用',
        hideCancel: false,
        okLoading: state.offlineLoading,
        okButtonProps: {
          status: 'danger',
        },
        onBeforeOk(done) {
          state.offlineLoading = true;
          fetchOffine({ id: props.editId, status: 0 })
            .then(() => {
              done(true);
              Message.success({
                content: '下线成功',
                duration: 1000,
                onClose: () => {
                  state.offlineLoading = false;
                  if (route.query?.selectById) {
                    router.push({ name: 'devManage' });
                  }
                  reload();
                },
              });
            })
            .catch(() => {
              Message.error(res.message);
              state.offlineLoading = false;
              done(false);
            });
        },
      });
    } else {
      Modal.warning({
        title: '该应用因在商城上架，无法下线',
        content:
          '当前对接应用已在商城上架，请先下架再下线，若已有售卖订单，为避免影响用户使用，请编辑修改后立即重新上线。',
        titleAlign: 'start',
        okText: '知道了',
        hideCancel: true,
        okButtonProps: {
          type: 'primary',
        },
      });
    }
  });
};

const handleAnchorSelect = (hash: string) => {
  const anchorItems = document.getElementsByClassName('tele-anchor-link-item');
  if (hash !== '#abutInfo') {
    anchorItems[2].classList.remove('tele-anchor-link-active');
  }
};

const AppTypeEnum: { [name: string]: any } = {
  0: '企业自建应用',
  1: '商城应用',
};

const ModeTypeEnum: { [name: string]: any } = {
  0: 'SAAS',
  1: '链接接入',
};

const AuthTypeEnum: { [name: string]: any } = {
  0: '用户手机号',
  1: '企业认证信息',
};

const MemberEnum: { [name: string]: any } = {
  1: '仅添加企业成员可用',
  0: '全部企业成员可用',
};

onMounted(() => {
  // 获取编辑详情信息
  state.tableLoading = true;
  fetchApplicationDetail(props.editId || '')
    .then((res) => {
      state.tableLoading = false;
      state.tableData = [
        {
          clientId: res?.clientId,
          clientSecret: res?.clientSecret,
          id: res?.id,
        },
      ];
      form.appType = res?.appType;
      form.appName = res?.appName;
      form.introduction = res?.introduction;
      form.appLogo = res?.appLogo;
      form.memberList = res?.memberList;
      form.memberType = res?.memberType;
      form.homeUri = res?.homeUri;
      form.redirectUri = res?.redirectUri;
      state.companyId = res?.companyId;
      form.dockingMethod = res?.dockingMethod;
      form.link = res?.link;
      form.authType = res?.authType ? res?.authType.split(',') : [];
    })
    .catch(() => {
      state.tableLoading = false;
      state.tableData = [];
    });
});
</script>

<style lang="less" scope>
.tele-modal-fullscreen .tele-modal-body {
  margin: 0;
  padding: 0 0 24px 0;
}

:deep(.tele-typography) {
  margin-bottom: 0;
}

.tele-alert-success {
  background-color: rgba(232, 244, 255, 1);
}

.top-inform {
  display: flex;
  justify-content: center;
  height: 62px;
  margin-bottom: 25px;
  padding: 20px 324px 20px 324px;

  .tele-alert-body {
    display: contents;
  }
  // position: relative;
  // margin-top: -24px;
  // line-height: 30px;
  // text-align: center;

  // .tele-alert-icon {
  //   position: absolute;
  //   left: 45%;
  // }
}

.content-body {
  display: flex;
  height: 100%;
  padding: 24px 20px;
  overflow: auto;
  background-color: #fff;

  .anchor {
    z-index: 999;
    margin-left: 80px;

    .affix {
      position: fixed;
      top: 160px;
      z-index: 999;
    }
  }

  .copy {
    margin-left: 10px;
    cursor: pointer;
  }

  .tagItem {
    margin-right: 4px;
  }

  .member-list {
    margin-bottom: 2px;
  }

  .add-section {
    display: flex;
    align-items: center;
    color: #86909c;

    .plus-img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      cursor: pointer;
    }
  }
}

.tip-content {
  .tele-form-item-content {
    display: block;
    margin-top: 5px;
  }

  .tip {
    color: #86909c;
  }
}

.footer-button {
  display: flex;
  justify-content: space-around;
  padding: 0 100px 0 300px;

  button {
    margin-right: 8px;
  }
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

      .image-cursor {
        cursor: pointer;
      }

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
