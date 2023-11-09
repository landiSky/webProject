<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :on-before-ok="onConfirm"
    ok-text="提交审核"
    @cancel="emitflag"
  >
    <template #title> 上传支付凭证 </template>
    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item field="currentamountlist" :hide-label="true">
        <t-upload
          :file-list="fileList ? fileList : []"
          list-type="picture-card"
          :headers="uploadHeaders"
          action="/web/file/orderUpload"
          :limit="5"
          image-preview
          @before-upload="beforeUpload"
          @success="uploadSuccess"
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
import { submitImg } from '@/api/buyer/order';
import { Message } from '@tele-design/web-vue';
import { getToken } from '@/utils/auth';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);
const uploadHeaders = {
  Authorization: `Bearer ${getToken()}`,
};
const formRef = ref();
const updataimg = ref([
  {
    uid: '-2',
    name: '20200717-103937.png',
    url: 'https://img2.baidu.com/it/u=913976134,4048569300&fm=253&fmt=auto&app=138&f=JPEG?w=745&h=500',
  },
  {
    uid: '-1',
    name: 'hahhahahahaha.png',
    url: 'https://img2.baidu.com/it/u=913976134,4048569300&fm=253&fmt=auto&app=138&f=JPEG?w=745&h=500',
  },
]);
const visible = ref(true);
const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    id: '',
    // currentamount: [],
  },
});
const currentamount = ref<string[]>([]);

const fileList = ref([]);

const formRules = {
  currentamountlist: [
    {
      required: true,
      message: '至少上传一张',
      validator: (value: any, cb: any) => {
        console.log('至少上传一张111', currentamount.value);
        if (Array.isArray(currentamount.value) && currentamount.value.length) {
          cb();
        } else {
          console.log('至少上传一张', currentamount.value);
          return cb('至少上传一张');
        }
        return cb();
      },
    },
  ],
};
// @ts-ignore
const uploadSuccess = (fileItem: FileItem) => {
  const res = fileItem.response;
  if (res?.code === 200) {
    // state.formModel.currentamount.push(fileItem.response.data);
    currentamount.value.push(fileItem.response.data);
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};
const beforeUpload = (file: File) => {
  // console.log(file, 'file');
  return new Promise<void>((resolve, reject) => {
    const isLt5M: boolean = file.size / 1024 / 1024 < 5;
    console.log('====beforeUpload', isLt5M);
    if (!isLt5M) {
      Message.warning('上传图片大小必须限制在5MB以内');
      // return false;
      reject();
    }
    // @ts-ignore
    resolve(true);
  });
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      console.log(state.formModel, currentamount.value);
      submitImg({
        id: state.formModel.id,
        attachmentAddressArr: currentamount.value,
      }).then((res) => {
        console.log(res, 'res');
        currentamount.value = [];
        emit('confirm');
      });
      // console.log(formRef.value.setFields);
      //  Message.success('上传支付凭证成功');
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
    } else {
      done(false);
    }
  });
};
const emitflag = () => {
  currentamount.value = [];
  emit('cancel');
};

onMounted(() => {
  // if (isEdit.value) {
  // 这里分两种情况
  // 一是编辑信息从列表传入

  const { id, currentamount } = props.data;
  console.log(id, currentamount, 'currentamount');
  state.formModel = { id };
  currentamount.value = currentamount;
  console.log(currentamount.value);

  fileList.value = currentamount?.value.map((pathName: string) => {
    console.log('===', pathName);

    return { url: `/web/file/orderDownload?name=${pathName}` };
  });

  console.log('=====onmm', fileList.value);

  // state.formModel.currentamount = currentamount.map((item: string) => {
  //   return state.formModel.currentamount.push({ url: item });
  // });
  // console.log(state.formModel.currentamount);

  // setTimeout(() => {
  //   console.log(formRef, 'formRef');
  //   formRef.value.setFields({
  //     currentamount: {
  //       value: currentamount,
  //     },
  //   });
  // }, 3000);

  // 二是从接口获取
  // getDetail();
  // }
});
</script>

<style scoped lang="less"></style>
