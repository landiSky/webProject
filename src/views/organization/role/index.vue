<template>
  <t-page-header flex title="角色管理" :show-back="false">
    <template #breadcrumb>
      <t-breadcrumb class="container-breadcrumb">
        <t-breadcrumb-item
          v-for="item in ['组织架构', '角色管理']"
          :key="item"
          size="large"
        >
          {{ item }}
        </t-breadcrumb-item>
      </t-breadcrumb>
    </template>

    <div class="search-row">
      <t-button
        v-has="$authCode.BTN_ROLE_ADD"
        type="primary"
        @click="openCreatRoleDialog"
      >
        新建角色
      </t-button>
      <div class="search-right">
        <t-space :size="12">
          <t-input
            v-model="formModel.roleName"
            placeholder="请输入角色名称"
            style="min-width: 160px"
            allow-clear
          />
          <t-input
            v-model="formModel.username"
            placeholder="请输入用户账号"
            style="min-width: 160px"
            allow-clear
          />
          <t-range-picker
            v-model="rangeTimeList"
            :placeholder="['创建开始时间', '创建结束时间']"
            :disabled-date="(current: any) => dayjs(current).isAfter(dayjs())"
            style="width: 100%"
            format="YYYY-MM-DD"
            @change="onRangeChange"
          />
          <t-button type="primary" @click="clickSearchBtn()"> 查询 </t-button>
          <t-button @click="reset"> 重置 </t-button>
        </t-space>
      </div>
    </div>

    <t-row style="margin-bottom: 16px"> </t-row>
    <t-table
      row-key="id"
      :loading="loading"
      :pagination="false"
      :columns="columns"
      :data="renderData"
      :bordered="true"
    >
      <template #authority="{ record }">
        <span
          v-if="record.authority === AuthStatusEnum.UNAUTH"
          class="circle gray"
        ></span>
        <span v-else class="circle green"></span>
        {{ record.authority === AuthStatusEnum.UNAUTH ? '未授权' : '已授权' }}
      </template>
      <template #enabled="{ record }">
        <span
          v-if="record.enabled === UserStatusEnum.UNUSED"
          class="circle"
        ></span>
        <span v-else class="circle green"></span>
        {{ record.enabled === UserStatusEnum.UNUSED ? '停用' : '正常' }}
      </template>
      <template #operations="{ record }">
        <t-link @click="goMumberManage(record)"> 成员管理 </t-link>
        <t-link @click="openAuthDialog(record)"> 授权管理 </t-link>
        <t-dropdown position="bl">
          <t-link>
            <icon-more />
          </t-link>
          <template #content>
            <t-doption
              v-has="$authCode.BTN_ROLE_ENABLE"
              @click="
                record.enabled === UserStatusEnum.UNUSED
                  ? startRow(record.id)
                  : stopWarning(record.id)
              "
            >
              <template #icon>
                <icon-check v-if="record.enabled === UserStatusEnum.UNUSED" />
                <icon-stop v-else />
              </template>
              {{ record.enabled === UserStatusEnum.UNUSED ? '启用' : '停用' }}
            </t-doption>
            <t-doption
              v-has="$authCode.BTN_ROLE_EDIT"
              @click="openEditRoleDialog(record)"
            >
              <template #icon>
                <icon-edit />
              </template>
              编辑
            </t-doption>
            <t-doption
              v-has="$authCode.BTN_ROLE_DEL"
              @click="deleteWarning(record.id)"
            >
              <template #icon>
                <icon-delete />
              </template>
              删除
            </t-doption>
          </template>
        </t-dropdown>
      </template>
    </t-table>
    <div v-if="!hideOnSinglePage" class="paginationArea">
      <t-pagination
        v-model:current="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        show-total
        show-jumper
        show-page-size
        @change="onPageChange"
        @page-size-change="onPageSizeChange"
      />
    </div>
  </t-page-header>
  <add-role-modal
    v-if="editDialogVisible"
    :is-edit="roleEdit"
    :role-info="roleEditInfo"
    @cancel="editDialogVisible = false"
  >
  </add-role-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Message, Modal } from '@tele-design/web-vue';
import type { TableColumnData } from '@tele-design/web-vue/es/table/interface';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

import { apiRolePage, apiRoleChangeState, apiRoleDelete } from '@/api/role-manage';
import useLoading from '@/hooks/loading';
import { UserStatusEnum, AuthStatusEnum } from './constant';
import AddRoleModal from './addRole.vue';

type Column = TableColumnData & { checked?: true };

const router = useRouter();
const formModel = reactive<{
  roleName: string;
  username: string;
  startTime: string | undefined;
  endTime: string | undefined;
}>({
  roleName: '',
  username: '',
  startTime: '',
  endTime: '',
});

const { loading, setLoading } = useLoading(false);
// const { loading, setLoading } = useLoading(true);
const renderData = ref<any[]>([]);

const editDialogVisible = ref(false);
const authDialogVisible = ref(false);
const authRoleId = ref(0);
const roleEdit = ref(false);

const roleEditInfo = reactive({
  id: null,
  roleName: '',
  roleDesc: '',
});

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
});

const rangeTimeList = ref([]);

const hideOnSinglePage = computed(() => pagination.total <= 10);

const onRangeChange = (
  value: (Date | string | number | undefined)[] | undefined
) => {
  if (value) {
    const [startDate, endDate] = value || [];
    [formModel.startTime, formModel.endTime] = [
      `${startDate} 00:00:00`,
      `${endDate} 23:59:59`,
    ];
  } else {
    formModel.startTime = undefined;
    formModel.endTime = undefined;
  }
};

const columns = ref<Column[]>([
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '角色编码',
    dataIndex: 'roleCode',
    slotName: 'roleCode',
  },
  {
    title: '成员数量',
    dataIndex: 'userCount',
  },

  {
    title: '功能授权情况',
    dataIndex: 'authority',
    slotName: 'authority',
    filterable: {
      filters: [
        {
          text: '未授权',
          value: '0',
        },
        {
          text: '已授权',
          value: '1',
        },
      ],
      filter: (value, row) => row.authority.toString().includes(value),
    },
  },
  {
    title: '角色状态',
    dataIndex: 'enabled',
    slotName: 'enabled',
    filterable: {
      filters: [
        {
          text: '正常',
          value: '0',
        },
        {
          text: '停用',
          value: '1',
        },
      ],
      filter: (value, row) => row.enabled.toString().includes(value),
    },
  },
  {
    title: '创建人',
    dataIndex: 'createdBy',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: 170,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    width: 200,
  },
]);

const fetchData = async () => {
  const { page, size } = pagination;
  try {
    setLoading(true);
    const data: Record<string, any> = await apiRolePage({
      page: page - 1,
      size,
      ...formModel,
    });
    renderData.value = data.content;
    pagination.page = data.pageNumber;
    pagination.total = data.totalCount;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const onPageChange = (current: number) => {
  pagination.page = current;
  fetchData();
};
const onPageSizeChange = (size: number) => {
  pagination.size = size;
  pagination.page = 1;
  fetchData();
};

const clickSearchBtn = () => {
  pagination.page = 1;
  fetchData();
};

const reset = () => {
  formModel.roleName = '';
  formModel.username = '';
  formModel.startTime = '';
  formModel.endTime = '';
  rangeTimeList.value = [];
  onPageChange(1);
};

const goMumberManage = ({ id }: any) => {
  Message.success('点击了成员管理');
};

const openAuthDialog = (record: any) => {
  Message.success('点击了授权管理');
};

const openCreatRoleDialog = () => {
  roleEdit.value = false;
  editDialogVisible.value = true;
};
const startRow = (id: number) => {
  apiRoleChangeState({ id, enabled: UserStatusEnum.USED }).then((res) => {
    Message.success('启用成功');
    fetchData();
  });
};
const stopRow = (id: number) => {
  apiRoleChangeState({ id, enabled: UserStatusEnum.UNUSED }).then((res) => {
    Message.success('停用成功');
    fetchData();
  });
};
const openEditRoleDialog = (v: any) => {
  const { id, roleName, roleDesc } = v;
  roleEditInfo.id = id;
  roleEditInfo.roleName = roleName;
  roleEditInfo.roleDesc = roleDesc;

  console.log('index.vue:353', v);
  roleEdit.value = true;
  editDialogVisible.value = true;
};

const deleteRow = (id: number) => {
  apiRoleDelete(id).then((res) => {
    Message.success('删除成功');
    fetchData();
  });
};

const deleteWarning = (id: number) => {
  Modal.warning({
    title: '确定删除该角色吗？',
    content:
      '删除后，已添加至此角色的成员将取消与该角色的关联，无法使用相关功能权限。',
    titleAlign: 'start',
    okText: '删除',
    hideCancel: false,
    onOk: () => {
      deleteRow(id);
    },
    okButtonProps: {
      status: 'danger',
    },
  });
};

const stopWarning = (id: number) => {
  Modal.warning({
    title: '确定停用该角色吗？',
    content: '停用后，已添加至此角色的成员将无法使用相关功能权限。',
    titleAlign: 'start',
    okText: '停用',
    hideCancel: false,
    onOk: () => {
      stopRow(id);
    },
    okButtonProps: {
      status: 'danger',
    },
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="less">
.search-row {
  display: flex;
  // flex: 1;
  justify-content: space-between;

  .search-right {
    display: flex;
    justify-content: flex-end;
    width: 60%;
  }
}

.paginationArea {
  display: flex;
  justify-content: right;
  margin-top: var(--space-16);
  margin-bottom: var(--space-16);

  :deep(.arco-pagination-total) {
    margin-right: 12px;
    font-size: 12px;
  }

  :deep(.arco-pagination-item) {
    font-size: 12px;
  }
}
</style>
