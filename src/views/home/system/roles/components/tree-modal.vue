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
    <template #title> {{ isEdit ? '新建' : '新建' }}角色:角色授权 </template>
    <h2>请选择授权范围</h2>
    <t-tree
      v-model="selected"
      :checkable="true"
      :check-strictly="false"
      :data="treeData"
      @select="setSelecteds"
      @check="checkds"
      @expand="expands"
    />
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
  <div> </div>
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

const formRef = ref();
const visible = ref(true);
const selected = ref([]);
const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    roleName: undefined,
    roleDesc: undefined,
  },
});
// 点击树节点时触发
const setSelecteds = (agfs: any, jashd: any) => {
  console.log(agfs, jashd, '点击树节点时触发');
};
// 点击树节点复选框时触发
const checkds = (agfs: any, jashd: any) => {
  console.log(agfs, jashd, '点击树节点复选框时触发');
};
// 展开/关闭
const expands = (agfs: any, jashd: any) => {
  console.log(agfs, jashd, '展开/关闭');
};

const formRules = {
  roleName: [
    { required: true, message: '请输入姓名' },
    { maxLength: 20, message: '长度不超过20个字符' },
  ],
};

const onConfirm = (done: (closed: boolean) => void) => {
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
    title: 'Trunk 0-0',
    value: 'Trunk 0-0',
    key: '0-0',
    children: [
      {
        title: 'Leaf 0-0-1',
        value: 'Leaf 0-0-1',
        key: '0-0-1',
      },
      {
        title: 'Branch 0-0-2',
        value: 'Branch 0-0-2',
        key: '0-0-2',
        children: [
          {
            title: 'Leaf 0-0-2-1',
            value: 'Leaf 0-0-2-1',
            key: '0-0-2-1',
          },
        ],
      },
    ],
  },
  {
    title: 'Trunk 0-1',
    value: 'Trunk 0-1',
    key: '0-1',
    children: [
      {
        title: 'Branch 0-1-1',
        value: 'Branch 0-1-1',
        key: '0-1-1',
        // checkable: false,
        children: [
          {
            title: 'Leaf 0-1-1-1',
            value: 'Leaf 0-1-1-1',
            key: '0-1-1-1',
          },
          {
            title: 'Leaf 0-1-1-2',
            value: 'Leaf 0-1-1-2',
            key: '0-1-1-2',
            // disabled: true,
          },
        ],
      },
      {
        title: 'Leaf 0-1-2',
        value: 'Leaf 0-1-2',
        key: '0-1-2',
      },
    ],
  },
];

onMounted(() => {
  if (isEdit.value) {
    // 这里分两种情况
    // 一是编辑信息从列表传入
    const { roleName, roleDesc } = props.data;
    state.formModel = { roleName, roleDesc };

    // 二是从接口获取
    // getDetail();
  }
});
</script>

<style scoped lang="less"></style>
