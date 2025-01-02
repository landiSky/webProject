<template>
  <div class="light-flow-todo">
    <div class="title">我的待办</div>
    <div class="desc">及时处理代办，可以有效提升流程效率</div>
    <div class="middle">
      <div
        v-for="(item, index) in todoOverall"
        :key="index"
        class="todo-list todo-list-4"
      >
        <div
          class="number"
          :class="{
            'color-red': item.title === '已超时',
          }"
          @click="goNewApplication"
        >
          {{ (todoList[item.field] || '').toLocaleString() || 0 }}
        </div>
        <div class="name">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref } from 'vue';
import { appCreateRedirect } from '@/api/buyer/overview';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const { userInfo, userInfoByCompany, selectCompany }: Record<string, any> =
  storeToRefs(userStore);

const emits = defineEmits(['confirm', 'cancel']);

const props = defineProps({
  visible: Boolean,
  confirmLoading: Boolean,
  title: String,
  empowerTipData: Object,
  companyId: String,
});

// 我的待办概览
const todoList = ref<Record<string, any>>({
  count: 0, // 全部订单数量
  payCount: 0, // 待支付页数量
  auditCount: 0, // 待审核页数量
  deliverCount: 0, // 待交付数量
  rejectCount: 0, // 已驳回数量
  servicesDeliverCount: 0, // 服务商交付数量
  completeCount: 0, // 已完成数量
});

// 发布商品概览
const todoOverall = [
  {
    title: '全部代办',
    field: 'count',
  },
  {
    title: '已超时',
    field: 'deliverCount',
  },
  {
    title: '即将超时',
    field: 'auditCount',
  },
  {
    title: '催办',
    field: 'completeCount',
  },
];

// 跳转轻流平台
const goNewApplication = () => {
  const params = {
    userId: userInfo.value?.id,
    companyId: selectCompany.value?.companyId,
  };
  appCreateRedirect(params).then((res: any) => {
    window.open(res);
  });
};

onMounted(async () => {});
</script>

<style scoped lang="less">
.light-flow-todo {
  width: 100%;
  margin: 0 auto;
  padding: 20px 24px;
  background-color: #fff;
  border-radius: 4px;

  .title {
    color: #223354;
    font-weight: 500;
    font-size: 20px;
    font-family: PingFang SC;
    line-height: 28px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }

  .desc {
    margin-top: 8px;
    color: #9098a9;
    font-weight: 400;
    font-size: 12px;
    font-family: PingFang SC;
    line-height: 20px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }

  .middle {
    display: flex;
    gap: 12px;
    margin-top: 20px;

    .todo-list-4 {
      flex: 0 4 calc(25% - 6px);
    }

    .todo-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;

      .name {
        color: #9098a9;
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 20px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
      }

      .number {
        color: #1d2129;
        font-weight: 700;
        font-size: 32px;
        font-family: DIN Alternate;
        line-height: 32px;
        cursor: pointer;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        &.color-red {
          color: #ff0004;
        }
      }
    }
  }
}
</style>
