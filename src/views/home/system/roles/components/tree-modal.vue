<template>
  <!-- :height="678" -->
  <t-modal
    v-model:visible="visible"
    :width="642"
    :on-before-ok="onConfirm"
    ok-text="完成"
    cancel-text="上一步:基本信息"
    @cancel="emit('cancel')"
  >
    <template #title> 新建角色:角色授权 </template>
    <h2>请选择授权范围</h2>
    <t-tree
      :default-expanded-keys="roleid"
      :default-checked-keys="roleid"
      :field-names="{
        key: 'id',
        title: 'menuName',
        children: 'childNodes',
      }"
      :checkable="true"
      :check-strictly="false"
      :data="treeData"
      @select="setSelecteds"
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
// import { roleUpdate, roleAdd } from '@/api/role-manage';
import { Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  aaa: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['confirm', 'cancel']);

// const formRef = ref();
const visible = ref(true);
const selected = ref([]);
// const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    roleName: undefined,
    roleDesc: undefined,
  },
});
const roleid = ref([]);
// 点击树节点时触发
const setSelecteds = (agfs: any, jashd: any) => {
  console.log(agfs, jashd, '点击树节点时触发');
};
// 点击树节点复选框时触发
const checkds = (agfs: any, jashd: any) => {
  roleid.value = agfs;
  console.log(agfs, jashd, '点击树节点复选框时触发');
};
// 展开/关闭
const expands = (agfs: any, jashd: any) => {
  console.log(agfs, jashd, '展开/关闭');
};

// const formRules = {
//   roleName: [
//     { required: true, message: '请输入姓名' },
//     { maxLength: 20, message: '长度不超过20个字符' },
//   ],
// };

const onConfirm = (done: (closed: boolean) => void) => {
  console.log(state.formModel, roleid.value, '完成');

  // emit('onEditModalConfirm');
  //   formRef.value.validate((errors: any) => {
  //     if (!errors) {
  //       //   const api = isEdit.value ? roleUpdata : roleAdd; // 这里是新增、编辑不是一个接口
  //       //   api(state.formModel)
  //       //     .then(() => {
  //       //       emit('confirm');
  //       //       Message.success(`${isEdit.value ? '编辑' : '新增'}用户成功`);
  //       //       done(true);
  //       //     })
  //       //     .catch(() => {
  //       //       done(false);
  //       //     });
  //     } else {
  //       done(false);
  //     }
  //   });
  emit('confirm');
};

// const getDetail = () => {
//   usersDetail({ id: props.data?.id })
//     .then((res: Record<string, any>) => {
//       const { roleName, roleDesc } = res || {};
//       state.formModel = { roleName, roleDesc };
//     })
//     .catch(() => {});
// };
const treeData = [
  {
    id: 1,
    parentId: 0,
    sort: 0,
    childNodes: [
      {
        id: 2, // 菜单id
        parentId: 1, // 父级id
        sort: 0, // 排序
        childNodes: [], // 子级节点列表
        menuName: '概览', // 菜单名称
        type: 1, // 1-菜单
        createTime: '2023-10-30 10:34:10',
        updateTime: '2023-10-30 10:34:10',
        createUser: null,
        updateUser: null,
        isDeleted: 0,
        hasChildren: 0, // 是否有子级
        authCode: 'ROUTE_BUYER_INDEX',
      },
      {
        id: 3, // 菜单id
        parentId: 1, // 父级id
        sort: 1, // 排序
        childNodes: [], // 子级节点列表
        menuName: '订单管理', // 菜单名称
        type: 1, // 1-菜单
        createTime: '2023-10-30 10:34:41',
        updateTime: '2023-10-30 10:34:41',
        createUser: null,
        updateUser: null,
        isDeleted: 0,
        hasChildren: 0, // 是否有子级
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
    id: 4,
    parentId: 0,
    sort: 0,
    childNodes: [
      {
        id: 5, // 菜单id
        parentId: 4, // 父级id
        sort: 0, // 排序
        childNodes: [], // 子级节点列表
        menuName: '商品管理', // 菜单名称
        type: 1, // 1-菜单
        createTime: '2023-10-30 10:35:16',
        updateTime: '2023-10-30 10:35:16',
        createUser: null,
        updateUser: null,
        isDeleted: 0,
        hasChildren: 0, // 是否有子级
        authCode: 'ROUTE_SELLER_GOODS',
      },
      {
        id: 6, // 菜单id
        parentId: 4, // 父级id
        sort: 1, // 排序
        childNodes: [], // 子级节点列表
        menuName: '订单管理', // 菜单名称
        type: 1, // 1-菜单
        createTime: '2023-10-30 10:35:31',
        updateTime: '2023-10-30 10:35:31',
        createUser: null,
        updateUser: null,
        isDeleted: 0,
        hasChildren: 0, // 是否有子级
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
  {
    id: 7,
    parentId: 0,
    sort: 0,
    childNodes: [
      {
        id: 8, // 菜单id
        parentId: 7, // 父级id
        sort: 0, // 排序
        childNodes: [], // 子级节点列表
        menuName: '企业成员管理', // 菜单名称
        type: 1, // 1-菜单
        createTime: '2023-10-30 10:38:00',
        updateTime: '2023-10-30 10:38:00',
        createUser: null,
        updateUser: null,
        isDeleted: 0,
        hasChildren: 0, // 是否有子级
        authCode: 'ROUTE_SYSTEM_USERS',
      },
      {
        id: 9, // 菜单id
        parentId: 7, // 父级id
        sort: 1, // 排序
        childNodes: [], // 子级节点列表
        menuName: '企业角色管理', // 菜单名称
        type: 1, // 1-菜单
        createTime: '2023-10-30 10:38:16',
        updateTime: '2023-10-30 10:38:16',
        createUser: null,
        updateUser: null,
        isDeleted: 0,
        hasChildren: 0, // 是否有子级
        authCode: 'ROUTE_SYSTEM_ROLES',
      },
    ],
    menuName: '企业管理',
    type: 1,
    createTime: '2023-10-30 10:37:37',
    updateTime: '2023-10-30 10:37:37',
    createUser: null,
    updateUser: null,
    isDeleted: 0,
    hasChildren: 1,
    authCode: 'ROUTE_SYSTEM',
  },
];

onMounted(() => {
  const { roleName, roleDesc } = props.data;
  console.log(props.data);
  state.formModel = { roleName, roleDesc };
});
</script>

<style scoped lang="less"></style>
