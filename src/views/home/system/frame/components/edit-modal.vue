<template>
  <div class="drawer-container">
    <t-drawer
      v-model:visible="visible"
      :on-before-ok="onConfirm"
      :width="445"
      :mask-closable="false"
      popup-container=".drawer-container"
      ok-text="确定"
      @cancel="onConfirmflag"
    >
      <template #title> {{ props.data.title || '-' }}</template>
      <t-form
        ref="formRef"
        class="form-container"
        :model="state.formModel"
        :rules="formRules"
      >
        <t-form-item field="deptName" label="部门名称" validate-trigger="blur">
          <t-input
            v-model="state.formModel.deptName"
            placeholder="请输入"
            :max-length="{
              length: 30,
              errorOnly: true,
            }"
            show-word-limit
          />
        </t-form-item>
        <t-form-item
          field="deptCharge"
          label="部门主管"
          validate-trigger="blur"
        >
          <t-select
            v-model="state.formModel.deptCharge"
            placeholder="请选择"
            allow-clear
          >
            <t-option
              v-for="item in state.memberList"
              :key="item.memberId"
              :value="item.memberId"
              >{{ item.username }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item
          field="memberSelect"
          label="部门成员"
          validate-trigger="blur"
        >
          <t-select
            v-model="state.formModel.memberSelect"
            :max-tag-count="3"
            placeholder="请选择"
            multiple
          >
            <t-option
              v-for="item in state.memberList"
              :key="item.memberId"
              :value="item.memberId"
              >{{ item.username }}
            </t-option>
          </t-select>
        </t-form-item>

        <t-form-item field="remark" label="备注" class="remark">
          <t-textarea
            v-model="state.formModel.remark"
            placeholder="请输入"
            :max-length="{
              length: 100,
              errorOnly: true,
            }"
            show-word-limit
            :auto-size="{
              minRows: 2,
              maxRows: 5,
            }"
          />
        </t-form-item>
        <div class="member-list-box">
          <div class="add-memeber-title">已添加成员</div>
          <ul class="exist-member-list">
            <li
              v-for="item in handleDynamicList()"
              :key="item.memberId"
              class="member-item"
            >
              <span class="left-side">
                <i class="member-card">
                  {{ item.username.substr(0, 1) }}
                </i>
                <span>{{ item.username }}</span>
              </span>
              <span class="remove" @click="handleRemove(item.memberId)"
                >移除</span
              >
            </li>
          </ul>
        </div>
      </t-form>
    </t-drawer>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  reactive,
  ref,
  onMounted,
  computed,
  watch,
} from 'vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { apiMemberList } from '@/api/common';
import { updateDept } from '@/api/system/dept';
import { Message } from '@tele-design/web-vue';

const userStore = useUserStore();
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  startlist: {
    type: String,
  },
});

const emit = defineEmits(['confirm', 'cancel', 'getValue']);

const formRef = ref();
const visible = ref(true);

const isEdit = computed(() => !!props.data?.id); // 这里的id替换为编辑数据的唯一属性
const state = reactive<{
  formModel: Record<string, any>;
  memberList: Record<string, any>;
}>({
  formModel: {
    parentId: '0', // 父级id 第一层为0
    deptName: '',
    deptCharge: '',
    memberSelect: [], // 成员列表
    remark: '',
    companyId: '',
    id: undefined, // 新增时候不传
    oldMemberIdList: [], // 新增时候传空
  },
  memberList: [],
});

watch(
  () => props.data,
  (val) => {
    if (val.id) {
      state.formModel.parentId = props.data.parentId;
      state.formModel.id = props.data.id || undefined;
      state.formModel.deptName = props.data.deptName;
      state.formModel.deptCharge = props.data.deptCharge;
      state.formModel.remark = props.data.remark;
      state.formModel.memberSelect =
        props.data.memberList.map((item: any) => item.memberId) || []; // 这里传数组 列表没返回
      state.formModel.companyId = props.data.companyId;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const formRules = {
  deptName: [
    {
      required: true,
      message: '请输入部门名称',
      validator: (value: any, cb: any) => {
        // @ts-ignore
        if (!state.formModel.deptName?.split(' ').join('')) {
          return cb('请输入角色名称');
        }
        return cb();
      },
    },
    { maxLength: 50, message: '长度不超过50个字符' },
  ],
  deptCharge: [{ maxLength: 30, message: '长度不超过30个字符' }],
  remark: [{ maxLength: 100, message: '长度不超过100个字符' }],
};

const handleDynamicList = () => {
  const dynamicMemberList = state.memberList.filter(
    (item: Record<string, any>) =>
      state.formModel.memberSelect.includes(item.memberId)
  );
  return dynamicMemberList;
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    const params = JSON.parse(JSON.stringify(state.formModel));
    params.memberList = handleDynamicList();
    params.parentId = props.data.parentId;
    delete params.memberSelect;
    // 新增
    if (!errors) {
      if (!isEdit.value) {
        // 新增
        params.companyId = userInfoByCompany.value?.companyId;
        params.oldMemberIdList = [];
      } else {
        // 编辑
        params.oldMemberIdList = props.data.memberList || [];
      }
      updateDept({
        ...params,
      })
        .then(() => {
          Message.success(!isEdit.value ? '新增成功' : '编辑成功');
          emit('confirm');
          done(true);
        })
        .catch(() => {
          done(false);
        });
    } else {
      done(false);
    }
  });
};
const handleRemove = (memberId: string) => {
  state.formModel.memberSelect = state.formModel.memberSelect.filter(
    (i: string) => i !== memberId
  );
};
const onConfirmflag = () => {
  emit('cancel');
};

onMounted(async () => {
  // 获取部门成员接口
  await apiMemberList({
    companyId: userInfoByCompany.value?.companyId,
  })
    .then((res: any) => {
      state.memberList = res;
    })
    .catch((e) => {});
});
</script>

<style scoped lang="less">
:deep(.tele-col-5) {
  flex: none;
  width: 76px;
}

:deep(.tele-col-19) {
  flex: 1;
}

.drawer-container {
  .form-container {
    .remark {
      :deep(.tele-form-item-label) {
        margin-right: 24px;
      }
    }

    .member-list-box {
      padding-left: 12px;

      .add-memeber-title {
        margin: 16px 0;
        font-weight: 500;
        font-size: 14px;
      }

      .exist-member-list {
        max-height: 320px;
        overflow-y: auto;
      }

      .member-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e5e8ef;

        .left-side {
          display: flex;
          align-items: center;

          .member-card {
            display: block;
            width: 40px;
            height: 40px;
            margin-right: 8px;
            color: #fff;
            font-size: 14px;
            font-style: normal;
            line-height: 40px;
            text-align: center;
            background: #60c2ff;
            border-radius: 2px;
          }
        }

        .remove {
          color: #1664ff;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
