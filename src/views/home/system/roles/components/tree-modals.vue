<template>
  <!-- :height="678" -->
  <t-modal
    v-model:visible="visible"
    :width="642"
    :height="500"
    :on-before-ok="onConfirm"
    ok-text="完成"
    @cancel="emit('cancel')"
  >
    <template #title> 权限管理 </template>
    <h2>请选择授权范围</h2>
    <t-tree
      :default-expanded-keys="[1, 2, 3]"
      :default-checked-keys="[1, 2, 3]"
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
    <!-- <t-tree-select
      v-model="selected"
      :allow-search="true"
      :allow-clear="true"
      :tree-checkable="true"
      :tree-check-strictly="true"
      :data="treeData"
      placeholder="Please select ..."
      style="width: 300px"
    ></t-tree-select> -->
    <!-- <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item field="roleName" label="角色名称">
        <t-input
          v-model="state.formModel.roleName"
          placeholder="请输入"
          :max-length="{
            length: 50,
            errorOnly: true,
          }"
          allow-clear
          show-word-limit
        />
      </t-form-item>

      <t-form-item field="roleDesc" label="角色描述">
        <t-textarea
          v-model="state.formModel.roleDesc"
          placeholder="请输入"
          :max-length="{
            length: 100,
            errorOnly: true,
          }"
          allow-clear
          show-word-limit
          :auto-size="{
            minRows: 2,
            maxRows: 5,
          }"
        />
      </t-form-item>
    </t-form> -->
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
const formRef = ref();
const treeData = ref();
const visible = ref(true);
const selected = ref();
const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    id: undefined,
    menuList: [],
  },
});
const roleid = ref([1, 2, 3]);
console.log(roleid);

const init = () => {
  apiMemberlist({}).then((res: any) => {
    console.log(res, 'res');
    treeData.value = res;
    console.log(treeData.value, 'treeData.value ');
  });
};
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

const onConfirm = (done: (closed: boolean) => void) => {
  console.log(state.formModel, roleid.value, '完成');
  if (roleid.value.length === 0) {
    Message.error('至少选一项');
  } else {
    apiRoleUpdate({
      id: state.formModel.id,
      menuList: roleid.value,
    })
      .then((res) => {
        // emit('confirm');
        done(true);
        console.log(res, 'res');
      })
      .catch((err) => {
        done(false);
      });
  }
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
// const treeData = [
//   {
//     id: 1,
//     parentId: 0,
//     sort: 0,
//     childNodes: [
//       {
//         id: 2, // 菜单id
//         parentId: 1, // 父级id
//         sort: 0, // 排序
//         childNodes: [], // 子级节点列表
//         menuName: '概览', // 菜单名称
//         type: 1, // 1-菜单
//         createTime: '2023-10-30 10:34:10',
//         updateTime: '2023-10-30 10:34:10',
//         createUser: null,
//         updateUser: null,
//         isDeleted: 0,
//         hasChildren: 0, // 是否有子级
//         authCode: 'ROUTE_BUYER_INDEX',
//       },
//       {
//         id: 3, // 菜单id
//         parentId: 1, // 父级id
//         sort: 1, // 排序
//         childNodes: [], // 子级节点列表
//         menuName: '订单管理', // 菜单名称
//         type: 1, // 1-菜单
//         createTime: '2023-10-30 10:34:41',
//         updateTime: '2023-10-30 10:34:41',
//         createUser: null,
//         updateUser: null,
//         isDeleted: 0,
//         hasChildren: 0, // 是否有子级
//         authCode: 'ROUTE_BUYER_ORDER',
//       },
//     ],
//     menuName: '买家中心',
//     type: 1,
//     createTime: '2023-10-30 10:33:22',
//     updateTime: '2023-10-30 10:33:22',
//     createUser: null,
//     updateUser: null,
//     isDeleted: 0,
//     hasChildren: 1,
//     authCode: 'ROUTE_BUYER',
//   },
//   {
//     id: 4,
//     parentId: 0,
//     sort: 0,
//     childNodes: [
//       {
//         id: 5, // 菜单id
//         parentId: 4, // 父级id
//         sort: 0, // 排序
//         childNodes: [], // 子级节点列表
//         menuName: '商品管理', // 菜单名称
//         type: 1, // 1-菜单
//         createTime: '2023-10-30 10:35:16',
//         updateTime: '2023-10-30 10:35:16',
//         createUser: null,
//         updateUser: null,
//         isDeleted: 0,
//         hasChildren: 0, // 是否有子级
//         authCode: 'ROUTE_SELLER_GOODS',
//       },
//       {
//         id: 6, // 菜单id
//         parentId: 4, // 父级id
//         sort: 1, // 排序
//         childNodes: [], // 子级节点列表
//         menuName: '订单管理', // 菜单名称
//         type: 1, // 1-菜单
//         createTime: '2023-10-30 10:35:31',
//         updateTime: '2023-10-30 10:35:31',
//         createUser: null,
//         updateUser: null,
//         isDeleted: 0,
//         hasChildren: 0, // 是否有子级
//         authCode: 'ROUTE_SELLER_ORDER',
//       },
//     ],
//     menuName: '服务商中心',
//     type: 1,
//     createTime: '2023-10-30 10:34:59',
//     updateTime: '2023-10-30 10:34:59',
//     createUser: null,
//     updateUser: null,
//     isDeleted: 0,
//     hasChildren: 1,
//     authCode: 'ROUTE_SELLER',
//   },
//   {
//     id: 7,
//     parentId: 0,
//     sort: 0,
//     childNodes: [
//       {
//         id: 8, // 菜单id
//         parentId: 7, // 父级id
//         sort: 0, // 排序
//         childNodes: [], // 子级节点列表
//         menuName: '企业成员管理', // 菜单名称
//         type: 1, // 1-菜单
//         createTime: '2023-10-30 10:38:00',
//         updateTime: '2023-10-30 10:38:00',
//         createUser: null,
//         updateUser: null,
//         isDeleted: 0,
//         hasChildren: 0, // 是否有子级
//         authCode: 'ROUTE_SYSTEM_USERS',
//       },
//       {
//         id: 9, // 菜单id
//         parentId: 7, // 父级id
//         sort: 1, // 排序
//         childNodes: [], // 子级节点列表
//         menuName: '企业角色管理', // 菜单名称
//         type: 1, // 1-菜单
//         createTime: '2023-10-30 10:38:16',
//         updateTime: '2023-10-30 10:38:16',
//         createUser: null,
//         updateUser: null,
//         isDeleted: 0,
//         hasChildren: 0, // 是否有子级
//         authCode: 'ROUTE_SYSTEM_ROLES',
//       },
//     ],
//     menuName: '企业管理',
//     type: 1,
//     createTime: '2023-10-30 10:37:37',
//     updateTime: '2023-10-30 10:37:37',
//     createUser: null,
//     updateUser: null,
//     isDeleted: 0,
//     hasChildren: 1,
//     authCode: 'ROUTE_SYSTEM',
//   },
// ];
onMounted(() => {
  if (isEdit.value) {
    // 这里分两种情况
    // 一是编辑信息从列表传入
    const { id, menuList } = props.data;
    console.log(id);

    state.formModel = { id, menuList };

    // 二是从接口获取
    // getDetail();
  }
  init();
});
</script>

<style scoped lang="less"></style>
