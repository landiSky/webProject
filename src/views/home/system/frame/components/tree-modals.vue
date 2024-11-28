<template>
  <!-- :height="678" -->
  <t-modal
    v-model:visible="visible"
    :width="642"
    :height="500"
    :on-before-ok="onConfirm"
    :esc-to-close="false"
    ok-text="完成"
    @cancel="emit('cancel')"
  >
    <template #title> 授权管理 </template>
    <h2>请选择授权范围</h2>
    <!-- state.formModel.menuList     :default-checked-keys="state.formModel.menuList"-->
    <t-tree
      :default-expanded-keys="state.formModel.menuList"
      :checked-keys="state.formModel.menuList"
      :field-names="{
        key: 'id',
        title: 'menuName',
        children: 'childNodes',
      }"
      :checkable="true"
      :check-strictly="false"
      :default-expand-all="false"
      :data="treeData"
      @check="checkds"
      @expand="expands"
    />
  </t-modal>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  reactive,
  ref,
  onMounted,
  computed,
} from 'vue';
import { apiMemberlist, apiRoleUpdate } from '@/api/system/role';

import { Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['confirm', 'cancel']);
// const formRef = ref();
const treeData = ref([
  {
    id: '1',
    parentId: 0,
    sort: 0,
    childNodes: [
      {
        id: 2,
        parentId: 1,
        sort: 0,
        childNodes: [],
        menuName: '概览',
        type: 1,
        createTime: '2023-10-30 10:34:10',
        updateTime: '2023-10-30 10:34:10',
        createUser: null,
        updateUser: null,
        isDeleted: 0,
        hasChildren: 0,
        authCode: 'ROUTE_BUYER_INDEX',
      },
      {
        id: 3,
        parentId: 1,
        sort: 1,
        childNodes: [],
        menuName: '订单管理',
        type: 1,
        createTime: '2023-10-30 10:34:41',
        updateTime: '2023-10-30 10:34:41',
        createUser: null,
        updateUser: null,
        isDeleted: 0,
        hasChildren: 0,
        authCode: 'ROUTE_BUYER_ORDER',
      },
    ],
    menuName: '买家中心',
    type: 1,
    createTime: '2023-10-30 10:33:22',
    updateTime: '2023-10-30 10:33:22',
    createUser: null,
    updateUser: null,
    isDeleted: 0,
    hasChildren: 1,
    authCode: 'ROUTE_BUYER',
  },
  {
    id: '4',
    parentId: '0',
    sort: 0,
    childNodes: [
      {
        id: 5,
        parentId: 4,
        sort: 0,
        childNodes: [],
        menuName: '商品管理',
        type: 1,
        createTime: '2023-10-30 10:35:16',
        updateTime: '2023-10-30 10:35:16',
        createUser: null,
        updateUser: null,
        isDeleted: 0,
        hasChildren: 0,
        authCode: 'ROUTE_SELLER_GOODS',
      },
      {
        id: 6,
        parentId: 4,
        sort: 1,
        childNodes: [],
        menuName: '订单管理',
        type: 1,
        createTime: '2023-10-30 10:35:31',
        updateTime: '2023-10-30 10:35:31',
        createUser: null,
        updateUser: null,
        isDeleted: 0,
        hasChildren: 0,
        authCode: 'ROUTE_SELLER_ORDER',
      },
    ],
    menuName: '服务商中心',
    type: 1,
    createTime: '2023-10-30 10:34:59',
    updateTime: '2023-10-30 10:34:59',
    createUser: null,
    updateUser: null,
    isDeleted: 0,
    hasChildren: 1,
    authCode: 'ROUTE_SELLER',
  },
]);
const visible = ref(true);
// const selected = ref();
const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive<{ formModel: Record<string, any> }>({
  formModel: {
    id: undefined,
    menuList: [],
  },
});
const roleid = ref([1, 2, 3]);

const treeState: Record<string, any> = {
  // 存储tree里
  check: [],
  halfCheck: [],
};
const init = () => {
  apiMemberlist({}).then((res: any) => {
    treeData.value = res;
  });
};

// 点击树节点复选框时触发
const checkds = (checkList: number[], obj: Record<string, any>) => {
  treeState.check = checkList;
  treeState.halfCheck = obj.halfCheckedKeys;
  // roleid.value = agfs;
  // state.formModel.menuList = agfs;
  state.formModel.menuList = checkList;
};

// 展开/关闭
const expands = (agfs: any, jashd: any) => {};

const onConfirm = (done: (closed: boolean) => void) => {
  if (state.formModel.menuList.length === 0) {
    Message.error('角色最少配置一个权限点');
    done(false);
  } else {
    const tempMenuList = [...treeState.check, ...treeState.halfCheck];
    apiRoleUpdate({
      id: state.formModel.id,
      menuList: tempMenuList,
    })
      .then((res) => {
        emit('confirm');
        done(true);
        Message.success('授权成功');
      })
      .catch((err) => {
        done(false);
      });
  }
};

onMounted(() => {
  if (isEdit.value) {
    // 这里分两种情况
    // 一是编辑信息从列表传入
    // menuList
    const { id, menuList } = props.data;

    const firstMenuList = treeData.value.map((item) => {
      return item.id;
    });
    const tempMenuList = menuList.filter((id: string) => {
      return !firstMenuList.includes(id);
    });
    state.formModel = { id, menuList: tempMenuList };

    // 二是从接口获取
    // getDetail();
  }
  init();
});
</script>

<style scoped lang="less"></style>
