<template>
  <div class="boxModal">
    <t-modal
      v-model:visible="visible"
      :width="642"
      :height="400"
      :on-before-ok="onConfirm"
      @cancel="emit('cancel')"
    >
      <template #title> 应用授权 </template>
      <p style="margin-bottom: 20px">邀请企业成员使用</p>
      <t-form ref="formRef" :model="state.formModel" :rules="formRules">
        <t-form-item field="roleDesc" :hide-label="true">
          <t-select
            v-model="state.formModel.roleDesc"
            placeholder="请输入新管理员账号"
            allow-search
            max-tag-count="0"
            multiple="true"
            style="width: 400px"
          >
            <template #empty>
              <span style="display: block; padding: 10px 20px"
                >暂未找到该成员</span
              >
            </template>
            <t-option v-for="(item, index) in inputSelect" :key="index">{{
              item
            }}</t-option>
          </t-select>
        </t-form-item>
      </t-form>
    </t-modal>
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
} from 'vue';
// import { roleUpdate, roleAdd } from '@/api/role-manage';
// import { Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);
const formRef = ref();
const visible = ref(true);
// const flagNum = ref(false);
const flagText = ref(true);
const counts = ref(60);
const times = ref();

// const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    roleDesc: [],
  },
});
const inputSelect = reactive([
  '张三',
  '李四',
  '小明',
  '小红',
  '小张',
  '小李',
  '小蓝',
]);

const formRules = {
  roleDesc: [{ required: true, message: '请输入企业成员' }],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      console.log(state.formModel);
      emit('confirm');
    } else {
      done(false);
    }
  });
};
onMounted(() => {
  // if (isEdit.value) {
  //   // 这里分两种情况
  //   // 一是编辑信息从列表传入
  console.log(props.data);
  const { starlist } = props.data;
  state.formModel.roleDesc = starlist;
  //   // 二是从接口获取
  //   // getDetail();ww
  // }
});
</script>

<style scoped lang="less"></style>
