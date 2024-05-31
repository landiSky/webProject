<template>
  <div class="add-goods-container">
    <t-modal
      v-model:visible="state.showModal"
      fullscreen
      has-back-btn="false"
      ok-text="完成"
      popup-container=".add-goods-container"
      :on-before-back="handleBack"
      @back="emit('onCancel')"
    >
      <template #footer>
        <div class="footer">
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
            <t-button :loading="state.launchLoading" @click="handleLaunch"
              >上线</t-button
            >
            <t-button type="primary" @click="handleEdit">编辑</t-button>
          </span>
        </div>
      </template>
      <t-row class="modal-body" justify="center">
        <t-col class="anchor" flex="224px">
          <t-affix :offset-top="80" class="affix">
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
                marginBottom: '16px',
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
                >
                  <template #clientId="{ record }">
                    <t-tooltip v-if="state.showTip" :content="record.clientId">
                      <span class="tablecell-item">{{
                        computeLength(record.clientId)
                      }}</span>
                    </t-tooltip>
                    <span v-else class="tablecell-item">{{
                      computeLength(record.clientId)
                    }}</span>

                    <icon-copy
                      class="copy"
                      size="14"
                      @click="handleCopy(record.clientId)"
                    />
                  </template>
                  <template #clientSecret="{ record }">
                    <t-tooltip
                      v-if="state.showTip"
                      :content="record.clientSecret"
                    >
                      <span class="tablecell-item">{{
                        computeLength(record.clientSecret)
                      }}</span>
                    </t-tooltip>
                    <span v-else class="tablecell-item">{{
                      computeLength(record.clientSecret)
                    }}</span>

                    <icon-copy
                      class="copy"
                      size="14"
                      @click="handleCopy(record.clientSecret)"
                    />
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
                marginBottom: '16px',
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
                >
                  <span>{{ AppTypeEnum[form.appType] ?? '-' }}</span>
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
                >
                  <span>{{ form.introduction }}</span>
                </t-form-item>
                <t-form-item
                  label="应用图标"
                  field="appLogo"
                  class="pic-item"
                  validate-trigger="blur"
                  :rules="[{ required: true, message: '请上传应用图标' }]"
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
                            @preview-visible-change="
                              () => (logoVisible = false)
                            "
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
                marginBottom: '16px',
              }"
              :title-divider-style="{ height: '12px' }"
              :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
              size="medium"
              :column="1"
            >
              <t-descriptions-item>
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
                >
                  <div>{{ form.homeUri }}</div>
                  <span class="tip"
                    >请输入以http或https开头的地址，展示在用户端“应用与服务”的地址，可以为域名也可以为“公网IP：端口”</span
                  >
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
                >
                  <div>{{ form.redirectUri }}</div>
                  <span class="tip"
                    >请输入以http或https开头的地址，展示在用户端“应用与服务”的地址，可以为域名也可以为“公网IP：端口”</span
                  >
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
                marginBottom: '16px',
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
  watch,
} from 'vue';
import { fetchApplicationDetail, fetchLaunch } from '@/api/devCenter/manage';
import { Message } from '@tele-design/web-vue';
import AddMembersModal from './addMembersModal.vue';
import AddFormNext from './addFormNext.vue';

const props = defineProps({
  visible: Boolean,
  editId: String,
  tableRecord: Object,
});

const reload: any = inject('reload');

const anchorRef = ref();
const logoVisible = ref(false);
const formRef = ref();

const form = reactive<{
  appType: number; // 0、自建应用 1、商城应用
  appName: string; // 应用名称
  introduction: string; // 应用描述
  appLogo: string; // logo地址
  homeUri: string; // 应用首页地址
  redirectUri: string; // 应用回调地址
  memberList: Record<string, any>[]; //
  memberType: number; // 0、全部 1、仅企业
}>({
  appType: 1,
  appName: '',
  introduction: '',
  appLogo: '',
  homeUri: '',
  redirectUri: '',
  memberList: [],
  memberType: 0,
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
});

const emit = defineEmits(['onCancel']);

// watch(
//   () => props.visible,
//   (val: boolean) => {
//     state.showModal = val;
//   }
// );

const showAuthLimit = computed(() => {
  if (form.appType === 0) {
    return true;
  }
  return false;
});

const toAnchor = (link: string) => {
  // 防止hash跳转 点击需要加prevent
  const ele = document.getElementById(link);
  ele && ele.scrollIntoView({ block: 'start', behavior: 'smooth' });
};

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
    width: 418,
  },
];

const validateRadio = (value: number, callback: (error?: string) => void) => {
  if (![0, 1].includes(value)) {
    callback('权限类型不能为空');
  } else {
    callback();
  }
};

const computeLength = (data: string) => {
  if (data.length > 20) {
    state.showTip = true;
    return `${data.slice(0, 20)}...`;
  }
  state.showTip = false;
  return data;
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

// 上线和保存   还差重新请求table数据和loading两个button区分
const handleLaunchOrSave = (status: number) => {
  // status保存为0， 上线为1
  formRef.value.validate((errors: undefined) => {
    if (!errors) {
      let params: Record<string, any> = {};
      if (form.appType === 1) {
        params = {
          ...form,
          memberList: undefined,
          id: props.editId,
          memberType: undefined,
        };
      } else {
        const memberIdList = form.memberList.map((i) => i.memberId);
        params = {
          ...form,
          memberList: undefined,
          id: props.editId,
        };
        if (form.memberType === 1) {
          params.memberIdList = memberIdList;
        }
      }
      params.status = status;
      state[status ? 'launchLoading' : 'saveLoading'] = true;
      fetchLaunch(params).then((res) => {
        if (res.code === 200) {
          Message.success({
            content: status === 0 ? '保存成功' : '上线成功',
            duration: 2000,
            onClose: () => {
              state[status ? 'launchLoading' : 'saveLoading'] = false;
              emit('onCancel');
              reload();
            },
          });
        } else {
          state[status ? 'launchLoading' : 'saveLoading'] = false;
          Message.error(res.message);
        }
      });
    }
  });
};

const handleBack = () => {
  emit('onCancel');
};

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    Message.success('复制成功');
  } catch (err) {
    Message.error('复制失败');
  }
};

const handleMembersConfirm = (data: []) => {
  state.showMemberModal = false;
  form.memberList = data;
};

const handleMembersCancel = () => {
  state.showMemberModal = false;
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

const MemberEnum: { [name: string]: any } = {
  1: '仅添加企业成员可用',
  0: '全部企业成员可用',
};

onMounted(() => {
  // 获取编辑详情信息
  state.tableLoading = true;
  fetchApplicationDetail(props.editId || '').then((res) => {
    if (res.code === 200) {
      state.tableLoading = false;
      state.tableData = [
        {
          clientId: res.data?.clientId,
          clientSecret: res.data?.clientSecret,
          id: res.data?.id,
        },
      ];
      form.appType = res.data?.appType;
      form.appName = res.data?.appName;
      form.introduction = res.data?.introduction;
      form.appLogo = res.data?.appLogo;
      form.memberList = res.data?.memberList;
      form.memberType = res.data?.memberType;
      form.homeUri = res.data?.homeUri;
      form.redirectUri = res.data?.redirectUri;
      state.companyId = res.data?.companyId;
    } else {
      state.tableLoading = false;
      state.tableData = [];
    }
  });
});
</script>

<style lang="less" scope>
.tele-modal-fullscreen .tele-modal-body {
  margin: 0;
}

.modal-body {
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
      top: 100px;
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

.footer {
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
