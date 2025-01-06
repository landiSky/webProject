<template>
  <div class="light-flow-todo">
    <div class="title">我的待办</div>
    <div class="desc">及时处理代办，可以有效提升流程效率</div>
    <div class="middle">
      <div
        v-for="(item, index) in todoOverall"
        :key="index"
        class="todo-list todo-list-4"
        @click="goNewApplication(item.state)"
      >
        <div
          class="number"
          :class="{
            'color-red':
              item.title === '已超时' &&
              ((todoList[item.field] || '').toLocaleString() || 0) !== 0,
            'color-yellow':
              item.title === '即将超时' &&
              ((todoList[item.field] || '').toLocaleString() || 0) !== 0,
            'color-purple':
              item.title === '催办' &&
              ((todoList[item.field] || '').toLocaleString() || 0) !== 0,
          }"
        >
          {{ (todoList[item.field] || '').toLocaleString() || 0 }}
        </div>
        <div class="foot">
          <div class="name">{{ item.title }}</div>
          <div class="handle">
            立即处理
            <icon-arrow-right />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, computed } from 'vue';
import { Modal } from '@tele-design/web-vue';
import { dynamicAudits, dynamicAuditsUrl } from '@/api/buyer/overview';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const { userInfo, userInfoByCompany, selectCompany }: Record<string, any> =
  storeToRefs(userStore);

const props = defineProps({
  showService: {
    type: Boolean,
    default() {
      return false;
    },
  },
});

// 服务是否授权
const authorizationChecks = computed(() => {
  return props.showService;
});

// 我的待办概览
const todoList = ref<Record<string, any>>({
  all: 0, // 全部待办
  timeout: 0, // 已超时
  approachingTimeout: 0, // 即将超时
  urging: 0, // 催办
});

// 待办概览
const todoOverall = [
  {
    title: '全部待办',
    field: 'all',
    state: '1',
  },
  {
    title: '已超时',
    field: 'timeout',
    state: '7',
  },
  {
    title: '即将超时',
    field: 'approachingTimeout',
    state: '8',
  },
  {
    title: '催办',
    field: 'urging',
    state: '6',
  },
];

// 跳转轻流平台
const goNewApplication = (status: string) => {
  if (!authorizationChecks.value) {
    Modal.warning({
      title: '使用提醒',
      content: '暂未权限访问，联系企业管理员开通',
      titleAlign: 'start',
      hideCancel: true,
      cancelText: '',
      okText: '好的',
      onOk: () => {},
    });
    return false;
  }
  const params = {
    userId: userInfo.value?.id,
    companyId: selectCompany.value?.companyId,
    status,
  };
  dynamicAuditsUrl(params).then((res: any) => {
    window.open(res);
  });
  return true;
};

// 待办概览 接口
const toDoListData = () => {
  dynamicAudits({
    companyId: userInfoByCompany.value?.companyId,
  }).then((res: any) => {
    const data = {
      ...res,
    };
    todoList.value = data;
  });
};

onMounted(() => {
  toDoListData();
});
</script>

<style scoped lang="less">
.light-flow-todo {
  width: 100%;
  margin: 0 auto;
  padding: 20px 24px 0 20px;
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

    .todo-list:hover {
      .foot {
        .name {
          transform: translateY(-30px); /* 初始状态在上方隐藏 */
          opacity: 0;
          transition: transform 0.5s ease-in-out; /* 控制动画时间 */
        }

        .handle {
          transform: translateY(0); /* 最终状态在可视区域 */
          opacity: 1;
          transition: transform 0.5s ease-in-out; /* 控制动画时间 */
        }
      }
    }

    .todo-list {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      cursor: pointer;

      .foot {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 40px;
        overflow: hidden;

        .name {
          position: absolute;
          color: #9098a9;
          font-weight: 400;
          font-size: 12px;
          font-family: PingFang SC;
          transition: all 0.7s ease;
        }

        .handle {
          color: #9098a9;
          font-weight: 400;
          font-size: 12px;
          font-family: PingFang SC;
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.7s ease;
        }
      }

      .number {
        color: #1d2129;
        font-weight: 700;
        font-size: 32px;
        font-family: DIN Alternate;
        line-height: 32px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        &.color-red {
          color: #ff0004;
        }

        &.color-yellow {
          color: #fb9337;
        }

        &.color-purple {
          color: #d164fb;
        }
      }
    }
  }
}
</style>
