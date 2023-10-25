<template>
  <div class="add-identify-container">
    <t-modal
      v-model:visible="showModal"
      fullscreen
      ok-text="完成"
      popup-container=".add-identify-container"
      :on-before-ok="onConfirm"
      :on-before-cancel="onCancel"
      :ok-button-props="{
        size: 'large',
      }"
      :cancel-button-props="{
        size: 'large',
      }"
      @back="emit('cancel')"
    >
      <template #title>
        <div> 新建商品 </div>
      </template>
      <div class="center-body">
        <t-form ref="formRef" :model="formModel" :rules="formRules">
          <div class="body-title"
            ><div class="body-title-icon"></div>基本信息</div
          >
          <t-form-item label="商品ID" field=""> 1234567890 </t-form-item>
          <t-form-item label="商品名称" field="">
            <t-input v-model="formModel.handle" allow-clear> </t-input>
          </t-form-item>
          <t-form-item label="商品Logo" field="">
            <t-upload
              :ref="logoRef"
              v-model:file-list="logoFile"
              :limit="1"
              :multiple="false"
              action="/api/v1/file/upload"
              :show-cancel-button="false"
              :accept="'.jpg,.png,.bmp,.tif,.gif'"
              :tip="`支持jpg、png、bmp、tif、gif文件格式，文件大小限制10M以内。`"
              tip-position="bottom"
              @success="uploadSuccess"
              @error="uploadError"
              @change="() => fileUploadChange(`logo`)"
              @exceed-limit="
                () => {
                  setFileOverLimit('logo');
                }
              "
            ></t-upload>
          </t-form-item>
          <t-form-item v-if="props.identifyData?.handleName" label="标识">
            {{ props.identifyData?.handleName }}
          </t-form-item>
          <t-form-item v-else label="标识" :merge-props="false" required
            ><t-row :gutter="8" flex="auto">
              <t-col flex="166px">
                <t-form-item field="prefix" no-style>
                  <t-select
                    v-model="formModel.prefix"
                    placeholder="请选择"
                    allow-clear
                    :trigger-props="{
                      updateAtScroll: true,
                    }"
                  >
                    <t-option v-for="item in state.prefixList" :key="item">{{
                      item
                    }}</t-option>
                  </t-select>
                </t-form-item>
              </t-col>
              <div class="delicator">/</div>
              <t-col flex="auto">
                <t-form-item field="handle" no-style>
                  <t-input v-model="formModel.handle" allow-clear> </t-input>
                </t-form-item>
              </t-col> </t-row
          ></t-form-item>
        </t-form>
        <t-divider style="margin-top: 20px" />
        <div v-if="showManageArea">
          <div class="body-title"><div class="body-title-icon" />权限管理</div>
          <t-form ref="roleFormRef" :model="roleModal" :rules="roleRules">
            <t-form-item
              field=""
              required
              :style="{
                marginBottom: roleModal.authManage.type == 0 ? '4px' : '20px',
              }"
            >
              <template #label>
                数据管理授权
                <t-tooltip
                  mini="true"
                  content="被授权用户具备此条数据的管理权限。具体可管理字段，以该用户在【数据字段权限】功能中的授权为准。"
                >
                  <icon-info-circle
                /></t-tooltip>
              </template>
              <div
                ><t-radio-group
                  v-model="roleModal.authManage.type"
                  :options="authScopeOptions"
                >
                </t-radio-group
              ></div>
            </t-form-item>
            <t-form-item
              v-if="roleModal.authManage.type == 0"
              label=""
              field="manageUserList"
            >
              <t-row
                :gutter="[8, 8]"
                class="tag-area"
                justify="start"
                align="center"
                flex="auto"
              >
                <t-col
                  v-for="user in roleModal.authManage.userList"
                  :key="user.id"
                  flex="70px"
                >
                  <t-tag
                    :key="user.id"
                    closable
                    @close="deleteTag(RoleType.Manage, user)"
                  >
                    {{ user.nickName }}
                  </t-tag>
                </t-col>
                <t-col flex="70px">
                  <t-link @click="clickAdd(RoleType.Manage)"
                    ><icon-plus stroke-width="5" /> 添加</t-link
                  >
                </t-col>
              </t-row>
            </t-form-item>
            <t-form-item
              label=""
              field=""
              :style="{
                marginBottom: roleModal.authQuery.type == 0 ? '4px' : '20px',
              }"
            >
              <template #label>
                数据查看授权
                <t-tooltip
                  content="被授权用户具备此条数据的查看权限。具体可查看字段，以该用户在【数据字段权限】功能中的授权为准；
查看权限影响范围包括：标识解析、系统中查看此数据的显示页面等"
                  mini="true"
                >
                  <icon-info-circle
                /></t-tooltip>
              </template>
              <div
                ><t-radio-group
                  v-model="roleModal.authQuery.type"
                  :options="authScopeOptions"
                >
                </t-radio-group
              ></div>
            </t-form-item>
            <t-form-item v-if="roleModal.authQuery.type == 0" label="" field="">
              <t-row
                :gutter="[8, 8]"
                class="tag-area"
                justify="start"
                align="center"
                flex="auto"
              >
                <t-col
                  v-for="user in roleModal.authQuery.userList"
                  :key="user.id"
                  flex="70px"
                >
                  <t-tag
                    :key="user.id"
                    closable
                    @close="deleteTag(RoleType.Query, user)"
                  >
                    {{ user.nickName }}
                  </t-tag>
                </t-col>
                <t-col flex="70px">
                  <t-link @click="clickAdd(RoleType.Query)"
                    ><icon-plus stroke-width="5" /> 添加</t-link
                  >
                </t-col>
              </t-row>
            </t-form-item>
            <t-form-item
              field=""
              required
              :style="{
                marginBottom: roleModal.authGrant.type == 0 ? '4px' : '20px',
              }"
            >
              <template #label>
                权限管理授权
                <t-tooltip
                  content="被授权用户具备此条数据的三项权限设置功能。"
                  mini="true"
                >
                  <icon-info-circle
                /></t-tooltip>
              </template>
              <div
                ><t-radio-group
                  v-model="roleModal.authGrant.type"
                  :options="authScopeOptions"
                >
                </t-radio-group
              ></div>
            </t-form-item>
            <t-form-item
              v-if="roleModal.authGrant.type == 0"
              label=""
              field="grantUserList"
            >
              <t-row
                :gutter="[8, 8]"
                class="tag-area"
                justify="start"
                align="center"
                flex="auto"
              >
                <t-col
                  v-for="user in roleModal.authGrant.userList"
                  :key="user.id"
                  flex="70px"
                >
                  <t-tag
                    :key="user.id"
                    closable
                    @close="deleteTag(RoleType.Grant, user)"
                  >
                    {{ user.nickName }}
                  </t-tag>
                </t-col>
                <t-col flex="70px">
                  <t-link @click="clickAdd(RoleType.Grant)"
                    ><icon-plus stroke-width="5" /> 添加</t-link
                  >
                </t-col>
              </t-row>
            </t-form-item>
          </t-form>
          <t-divider style="margin-top: 20px" />
        </div>

        <div class="body-title"
          ><div class="body-title-icon" />标识数据主体</div
        >
        <t-form ref="valueFormRef" :model="valueModel" :rules="valueModelRules">
          <div
            v-for="item in props.metaData?.itemVOS ?? []"
            :key="item.englishName"
            class="entity-item-div"
          >
          </div>
        </t-form>
      </div>
    </t-modal>
  </div>
  <GrantAddUser
    v-if="dialogVisible"
    :auth-type="currentAuthType"
    :origin-user-list="originUserList"
    :did-selected-user-list="didSelectedUserList"
    @done="addDone"
    @cancel="dialogVisible = false"
  ></GrantAddUser>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  ref,
  onMounted,
  reactive,
  ComponentPublicInstance,
} from 'vue';
import { cloneDeep } from 'lodash';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { Message, Modal, FileItem } from '@tele-design/web-vue';
// import {
//   identifyAdd,
//   getAssociateMeta,
//   identifyDetail,
//   identifyUpdate,
// } from '@/api/meta-identify-manage';
// import { DATA_TYPE } from '@/enums/metaItem';
// import GrantAddUser from './grant-add-user.vue';
//

const logoRef = ref();
const logoFile = ref();

const RoleArea = {
  All: 1,
  Limit: 0,
};

type refItem = Element | ComponentPublicInstance | null;
const emit = defineEmits(['confirm', 'cancel']);

const editData = ref();
const props = defineProps({
  metaData: Object,
  identifyData: Object,
  valueModelRules: Object,
});
const formRef = ref();
const valueFormRef = ref();
const roleFormRef = ref();
const valueModel = ref<Record<string, any>>({});
const optionList = ref<Record<string, any>>({});
const { userInfo } = storeToRefs(useUserStore());
const showManageArea = ref(false);
const dialogVisible = ref(false);
const originUserList = ref<Array<any>>([]);
const didSelectedUserList = ref<Array<any>>([]);
// let instanceId = '';

const uploadRefs = ref<Record<string, any>>({});
function uploadRef(el: refItem, fieldName: string) {
  uploadRefs.value[fieldName] = el;
}
// 引用类型
const searchKey = ref();
const onSelectSearch = (key: string) => {
  searchKey.value = key;
};
const getMatchIndex = (metaName: string) => {
  if (!searchKey.value) return -1;
  return metaName?.toLowerCase().indexOf(searchKey.value.toLowerCase());
};

// 文件类型
const acceptFiles = (item: any) => {
  if (item.usedItemSchemaVO.fileFormat) {
    const str = item.usedItemSchemaVO.fileFormat.replaceAll(';', ',.');
    return `.${str}`;
  }
  return '';
};
const uploadData = (item: any) => {
  return {
    metaHandle: props.metaData?.metaHandle,
    fileField: item.englishName,
  };
};

const uploadError = (fileItem: FileItem) => {
  const size = fileItem.file?.size ?? 0;
  if (size > 50 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过50M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
};

const uploadSuccess = (fileItem: FileItem) => {
  const res = fileItem.response;
  if (res?.code === 10000) {
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};

const rangeLeft = (rangeString: string) => {
  if (rangeString) {
    return (
      rangeString.substring(1, rangeString.length - 1)?.split(',')[0] ?? '0'
    );
  }
  return '0';
};
const rangeRight = (rangeString: string) => {
  if (rangeString) {
    return (
      rangeString.substring(1, rangeString.length - 1)?.split(',')[1] ?? '0'
    );
  }
  return '0';
};

// 权限管理

const RoleType = {
  Query: 'authQuery',
  Manage: 'authManage',
  Grant: 'authGrant',
};
const currentAuthType = ref(1);
const currentAuthTypeString = ref('');
const authType: Record<string, number> = {
  authQuery: 1,
  authManage: 2,
  authGrant: 3,
};
const roleModal: Record<string, any> = ref<{
  authManage: {
    type: number;
    userList: Array<any>;
  };
  authQuery: {
    type: number;
    userList: Array<any>;
  };
  authGrant: {
    type: number;
    userList: Array<any>;
  };
}>({
  authManage: {
    type: 0,
    userList: [
      {
        id: userInfo.value?.userId,
        nickName: userInfo.value?.nickName,
        username: userInfo.value?.username,
        enabled: userInfo.value?.enabled,
        handleAdmin: userInfo.value?.handleInfo?.handleAdmin,
        deptName: userInfo.value?.deptName,
      },
    ],
  },
  authQuery: {
    type: 1,
    userList: [],
  },
  authGrant: {
    type: 0,
    userList: [
      {
        id: userInfo.value?.userId,
        nickName: userInfo.value?.nickName,
        username: userInfo.value?.username,
        enabled: userInfo.value?.enabled,
        handleAdmin: userInfo.value?.handleInfo?.handleAdmin,
        deptName: '',
      },
    ],
  },
});

const authScopeOptions = [
  { label: '公开', value: 1 },
  { label: '指定范围', value: 0 },
];

const NormalBoolean = {
  True: 1,
  False: 0,
};

const ReferenceType = {
  Single: 1,
  Multi: 2,
};

const clickAdd = (type: string) => {
  currentAuthTypeString.value = type;
  currentAuthType.value = authType[`${type}`];
  originUserList.value =
    type === RoleType.Grant ? roleModal.value.authManage.userList : [];
  didSelectedUserList.value = roleModal.value[type].userList;
  dialogVisible.value = true;
};
const addDone = (memberList: Array<any>) => {
  roleModal.value[currentAuthTypeString.value].userList = roleModal.value[
    currentAuthTypeString.value
  ].userList.concat(memberList);
  dialogVisible.value = false;
  roleFormRef.value.validate();
  Message.success('添加成功');
};

// 数据管理
const deleteTag = (type: string, user: any) => {
  const index = roleModal.value[type].userList.indexOf(user);
  if (index >= 0) {
    roleModal.value[type].userList.splice(index, 1);
  }
  if (type === RoleType.Manage) {
    for (
      let index = 0;
      index < roleModal.value.authGrant.userList.length;
      index += 1
    ) {
      const element = roleModal.value.authGrant.userList[index];
      if (element.id === user.id) {
        roleModal.value.authGrant.userList.splice(index, 1);
      }
    }
  }
  roleFormRef.value.validate();
};

const state = reactive<{
  prefixList: string[];
  serializeForm: string;
}>({
  prefixList: [],
  serializeForm: '', // 序列表表单，以判断是否修改过 ^-^
});

const formModel = ref({
  prefix: '',
  handle: '',
});

const showModal = ref(true);
const roleRules = {
  manageUserList: [
    {
      validator: (value: any, cb: (params?: any) => void) => {
        if (
          roleModal.value.authManage.type === RoleArea.Limit &&
          roleModal.value.authManage.userList.length === 0
        ) {
          return cb('请选择至少一个用户');
        }
        return cb();
      },
    },
  ],
  grantUserList: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (
          roleModal.value.authGrant.type === RoleArea.Limit &&
          roleModal.value.authGrant.userList.length === 0
        ) {
          return cb('请选择至少一个用户');
        }
        return cb();
      },
    },
  ],
};
const formRules = {
  prefix: [{ required: true, message: '请选择元数据标识' }],
  handle: [{ required: true, message: '请输入元数据标识' }],
};

const fetchPrefixList = async () => {
  formModel.value.prefix =
    state.prefixList?.length > 0 ? state.prefixList[0] : '';
};

const onCancel = () => {
  const newFormStr =
    JSON.stringify(formModel.value) +
    JSON.stringify(roleModal.value) +
    JSON.stringify(valueModel.value);
  if (!props.identifyData?.handleName && state.serializeForm !== newFormStr) {
    Modal.warning({
      title: '内容尚未保存，确定取消新建么？',
      titleAlign: 'start',
      content: '',
      okText: '确定',
      hideCancel: false,
      onOk: () => {
        emit('cancel');
      },
      onCancel: () => {
        return false;
      },
    });
  } else {
    emit('cancel');
  }
};

const onConfirm = async (done: (closed: boolean) => void) => {
  const [errors1, errors3] = await Promise.all([
    formRef.value.validate(),
    valueFormRef.value.validate(),
  ]);
  if (errors1 || errors3) {
    done(false);
    return;
  }
  if (showManageArea.value) {
    const errors2 = await roleFormRef.value.validate();
    if (errors2) {
      done(false);
      return;
    }
  }
  const { prefix, handle } = formModel.value;
  const metaHandle = props.metaData?.metaHandle ?? '';
  const handleName = props.identifyData?.handleName ?? `${prefix}/${handle}`;
  const roleData = roleModal.value;
  if (
    roleData.authGrant.type === RoleArea.All &&
    roleData.authManage.type === RoleArea.Limit
  ) {
    Message.error('权限管理授权用户必须同时拥有数据管理授权！');
    done(false);
    return;
  }

  const authority = {
    authGrant: {
      open: roleData.authGrant.type === RoleArea.All,
      assign: roleData.authGrant.type === RoleArea.Limit,
      user:
        roleData.authGrant.type === RoleArea.Limit
          ? roleData.authGrant.userList.map((e: any) => e.id)
          : [],
    },
    authManage: {
      open: roleData.authManage.type === RoleArea.All,
      assign: roleData.authManage.type === RoleArea.Limit,
      user:
        roleData.authManage.type === RoleArea.Limit
          ? roleData.authManage.userList.map((e: any) => e.id)
          : [],
    },
    authQuery: {
      open: roleData.authQuery.type === RoleArea.All,
      assign: roleData.authQuery.type === RoleArea.Limit,
      user:
        roleData.authQuery.type === RoleArea.Limit
          ? roleData.authQuery.userList.map((e: any) => e.id)
          : [],
    },
  };
  const array = (props.metaData?.itemVOS ?? []).filter(
    (item: any) => item.inputNecessary === NormalBoolean.True
  );
  const values = cloneDeep(valueModel.value);
  for (const element of array) {
    if (element.required === NormalBoolean.False) {
      if (
        values[`${element.englishName}`] === undefined ||
        values[`${element.englishName}`] === null ||
        values[`${element.englishName}`] === ''
      ) {
        delete values[`${element.englishName}`];
      }
    }
  }
  const params = {
    metaHandle,
    handleName,
    authority,
    value: values,
    // id: props.identifyData?.handleName ? instanceId : '',
  };
  // const api = props.identifyData?.handleName ? identifyUpdate : identifyAdd;

  // api(params)
  //   .then(() => {
  //     emit('confirm');
  //     done(true);
  //     Message.success(
  //       `${props.identifyData?.handleName ? '编辑' : '新建'}成功`
  //     );
  //   })
  //   .catch(() => {
  //     done(false);
  //   });
};

const fetchAssociateMeta = (metaHandle: string, key: string) => {
  // getAssociateMeta(metaHandle).then((res) => {
  //   optionList.value[key] = res;
  // });
};

function cancelUploadingFiles() {
  // for (const item of props.metaData?.itemVOS ?? []) {
  //   if (
  //     item.usedItemSchemaVO?.dataType === DATA_TYPE.FILE &&
  //     item.inputNecessary === NormalBoolean.True
  //   ) {
  //     const files = valueModel.value[`${item.englishName}`] ?? [];
  //     for (const file of files) {
  //       if (file.response === undefined || file.response === null) {
  //         (uploadRefs.value[item.englishName] as any).abort(file);
  //       }
  //     }
  //   }
  // }
}

// 初始化
onMounted(async () => {
  // 统一添加网络异常提示
  window.addEventListener('offline', () => {
    cancelUploadingFiles();
  });
  await fetchPrefixList();
  // valueModelRules.value = props.valueModelRules ?? {};
  // if (props.identifyData?.handleName) {
  //   // 编辑：初始化前两个表单数据
  //   editData.value = await identifyDetail({
  //     handleName: props.identifyData.handleName,
  //     updateFlag: 1,
  //   });
  //   instanceId = editData.value?.handleMainInfoVO?.id ?? '';
  //   const handleName = editData.value?.handleMainInfoVO?.handleName;
  //   if (handleName) {
  //     const index = handleName.indexOf('/');
  //     if (index > 0) {
  //       formModel.value.prefix = handleName.slice(0, index);
  //       formModel.value.handle = handleName.slice(index);
  //     }
  //   }
  //   const roleVO = editData.value.handleAuthorityVO;
  //   if (roleVO) {
  //     roleModal.value.authGrant.type = roleVO.authGrantVO.open
  //       ? RoleArea.All
  //       : RoleArea.Limit;
  //     const userList = roleVO.authGrantVO.user;
  //     roleModal.value.authGrant.userList = userList;
  //     showManageArea.value =
  //       userList.filter((u: any) => u.id === (userInfo.value?.userId ?? 0))
  //         .length > 0 ||
  //       (
  //         userInfo.value?.roles?.filter((e) => e.roleCode === 'ROLE_SUPER') ??
  //         []
  //       ).length > 0;
  //     roleModal.value.authQuery.type = roleVO.authQueryVO.open
  //       ? RoleArea.All
  //       : RoleArea.Limit;
  //     roleModal.value.authQuery.userList = roleVO.authQueryVO.user;
  //     roleModal.value.authManage.type = roleVO.authManageVO.open
  //       ? RoleArea.All
  //       : RoleArea.Limit;
  //     roleModal.value.authManage.userList = roleVO.authManageVO.user;
  //   }
  // } else {
  //   showManageArea.value = true;
  // }

  // // 初始化校验规则和value表单数据
  // for (const vo of props.metaData?.itemVOS) {
  //   if (vo.usedItemSchemaVO.dataType === DATA_TYPE.FILE) {
  //     const fileNames =
  //       editData.value?.handleMainInfoVO?.value[`${vo.englishName}`] ?? [];
  //     valueModel.value[`${vo.englishName}`] = fileNames.map((fileName: any) => {
  //       return {
  //         name: fileName.oldName,
  //         status: 'done',
  //         response: {
  //           code: 10000,
  //           data: {
  //             filePath: fileName.filePath,
  //           },
  //         },
  //       };
  //     });
  //   } else if (vo.usedItemSchemaVO.dataType === DATA_TYPE.DATE) {
  //     let value =
  //       editData.value?.handleMainInfoVO?.value[`${vo.englishName}`] ?? '';
  //     if (
  //       value &&
  //       vo.usedItemSchemaVO.dateFormat === 'YYYY-MM-DD HH:mm:ss' &&
  //       !value.includes(':')
  //     ) {
  //       value = `${value} 00:00:00`;
  //     }
  //     valueModel.value[`${vo.englishName}`] = value;
  //   } else {
  //     valueModel.value[`${vo.englishName}`] =
  //       editData.value?.handleMainInfoVO?.value[`${vo.englishName}`] ?? '';
  //   }
  //   if (vo.usedItemSchemaVO.dataType === DATA_TYPE.REFERENCE) {
  //     const metaHandle = vo.usedItemReferenceVO.referenceMetaHandle;
  //     fetchAssociateMeta(metaHandle, vo.englishName);
  //   }
  // }
  state.serializeForm =
    JSON.stringify(formModel.value) +
    JSON.stringify(roleModal.value) +
    JSON.stringify(valueModel.value);
});

const setFileOverLimit = (item: any) => {
  valueFormRef.value.setFields({
    [`${item.englishName}`]: {
      status: 'error',
      message: `允许上传的文件最大数量不超过${item.usedItemSchemaVO.maxFileCount}个`,
    },
  });
};

function fileUploadChange(fieldName: string) {
  valueFormRef.value.validateField(fieldName);
}
</script>

<style lang="less" scoped>
.about-meta {
  text-align: right;
}

.about-meta-des {
  text-align: left;
}

.add-identify-container {
  .center-body {
    width: 718px;
    margin: 0 auto;
  }

  .body-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 24px;
    margin-bottom: 20px;
    color: #1d2129;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    .body-title-icon {
      width: 4px;
      height: 14px;
      margin-right: 8px;
      background-color: #1664ff;
    }
  }

  .entity-item-div {
    margin-bottom: 20px;
  }
}

.delicator {
  margin-top: 6px;
  color: #86909c;
  font-size: 12px;
  line-height: 20px;
}

:deep(.tele-form-item-wrapper-col) {
  max-width: 600px;
}

:deep(.tele-tag-checked) {
  background: #fff;
}

:deep(.tele-input-outer) {
  width: 182px;
}

.tag-area {
  margin: 0 !important;
  background: #f6f7fb;
}

.pop-class {
  color: #fff;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  background: #1d2129;
}

:deep(.tele-upload-tip) {
  white-space: normal;
}

:deep(.tele-upload-list-item-name-link) {
  color: var(--color-text-1);
}

.role-item {
  margin-bottom: 4px;
}
</style>
