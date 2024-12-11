<template>
  <div class="drawer-container">
    <t-drawer
      v-model:visible="showDrawer"
      :width="445"
      :mask-closable="false"
      :hide-cancel="true"
      popup-container=".drawer-container"
      ok-text="确定"
      :on-before-ok="onConfirm"
      @cancel="emit('cancel')"
    >
      <template #title> {{ state.deptNodeNameList.join(' > ') }}</template>
      <ul>
        <li
          v-for="item in state.memberList"
          :key="item.memberId"
          class="list-item"
        >
          <span class="first-name-card">{{ item.username.substr(0, 1) }}</span>
          <span class="user-name">{{ item.username }}</span>
          <span v-if="item.isDeptCharge" class="dept-charge">
            <t-tag color="gold"> 部门主管 </t-tag>
          </span>
        </li>
      </ul>
    </t-drawer>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed, ref, watch, reactive } from 'vue';

const state = reactive<{
  deptNodeNameList: Record<string, any>[];
  memberList: Record<string, any>[];
}>({
  deptNodeNameList: [],
  memberList: [],
});

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const showDrawer = ref(true);

watch(
  () => props.data,
  (val) => {
    state.deptNodeNameList = val.allParentNameList;
    state.memberList = val.memberList;
  },
  {
    deep: true,
    immediate: true,
  }
);

const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = () => {
  // 这里和onOk有什么区别？？
  emit('confirm');
};
</script>

<style scoped lang="less">
.drawer-container {
  .list-item {
    position: relative;
    display: flex;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 12px;

    &::after {
      position: absolute;
      top: 56px;
      left: 52px;
      display: block;
      width: 85%;
      border: 1px solid transparent;
      box-shadow: 0 -1px 0 0 #e5e8ef;
      content: '';
    }

    .first-name-card {
      width: 40px;
      height: 40px;
      margin-right: 8px;
      color: #fff;
      line-height: 40px;
      text-align: center;
      background: #4086ff;
      border-radius: 2px;
    }

    .user-name {
      margin-right: 12px;
      color: #1d2129;
    }
  }
}
</style>
