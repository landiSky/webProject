<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :on-before-ok="onConfirm"
    ok-text="提交审核"
    @cancel="emit('cancel')"
  >
    <template #title> 上传支付凭证 </template>
    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item field="currentamount" :hide-label="true">
        <t-upload
          :default-file-list="[
            {
              url:
                'https://img2.baidu.com/it/u=913976134,4048569300&fm=253&fmt=auto&app=138&f=JPEG?w=745&h=500',
            },
          ]"
          list-type="picture-card"
          action="/"
          :limit="5"
          image-preview
        />
      </t-form-item>
    </t-form>
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
});
const emit = defineEmits(['confirm', 'cancel']);

const formRef = ref();
const updataimg = ref([
  {
    uid: '-2',
    name: '20200717-103937.png',
    url:
      'https://img2.baidu.com/it/u=913976134,4048569300&fm=253&fmt=auto&app=138&f=JPEG?w=745&h=500',
  },
  {
    uid: '-1',
    name: 'hahhahahahaha.png',
    url:
      'https://img2.baidu.com/it/u=913976134,4048569300&fm=253&fmt=auto&app=138&f=JPEG?w=745&h=500',
  },
]);
const visible = ref(true);
const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    id: '',
    currentamount: [],
  },
});

const formRules = {
  amount: [{ required: true, message: '请输入' }],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      console.log(state.formModel);

      //   const api = isEdit.value ? roleUpdata : roleAdd; // 这里是新增、编辑不是一个接口
      //   api(state.formModel)
      //     .then(() => {
      //       emit('confirm');
      //       Message.success(`${isEdit.value ? '编辑' : '新增'}用户成功`);
      //       done(true);
      //     })
      //     .catch(() => {
      //       done(false);
      //     });
      emit('confirm');
    } else {
      done(false);
    }
  });
};

onMounted(() => {
  // if (isEdit.value) {
  // 这里分两种情况
  // 一是编辑信息从列表传入

  // console.log(props.data, 'props.data');
  const { id, currentamount } = props.data;
  // console.log(currentamount, id);

  state.formModel = { id, currentamount };

  // 二是从接口获取
  // getDetail();
  // }
});
</script>

<style scoped lang="less"></style>
