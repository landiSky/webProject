<template>
  <t-modal
    v-model:visible="visible"
    :width="572"
    :height="272"
    :on-before-ok="onConfirm"
    ok-text="提交审核"
    class=""
    @cancel="emitflag"
  >
    <template #title> 上传支付凭证 </template>
    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item
        field="currentamountlist"
        :hide-label="true"
        style="margin-bottom: 10px"
      >
        <!-- :file-list="fileList ? fileList : []" -->
        <!-- @success="uploadSuccess" -->

        <t-upload
          list-type="picture-card"
          :headers="uploadHeaders"
          action="/server/web/file/orderUpload"
          :limit="5"
          accept=".jpg,.png,.bmp,.gif,.jpeg"
          image-preview
          class="uploadimg"
          @before-upload="beforeUpload"
          @change="changeclick"
        >
          <template #upload-button>
            <div class="tele-upload-picture-card">
              <div class="tele-upload-picture-card-text">
                <IconPlus />
                <div style="margin-top: 10px; font-weight: 600">点击上传</div>
              </div>
            </div>
          </template>
        </t-upload>
      </t-form-item>
      <div style="color: #86909c">
        支持jpg、png、bmp、tif、gif、jpeg文件格式,文件大小限制5M以内,最多可上传5张。
      </div>
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
  },
});
const currentamount = ref<string[]>([]);
const currentamountnum = ref<string[]>([]);

const formRules = {
  currentamountlist: [
    {
      required: true,
      message: '至少上传一张',
      validator: (value: any, cb: any) => {
        console.log('至少上传一张111', currentamount.value);
        if (
          Array.isArray(currentamountnum.value) &&
          currentamountnum.value.length
        ) {
          cb();
        } else {
          console.log('至少上传一张', currentamountnum.value);
          return cb('至少上传一张');
        }
        return cb();
      },
    },
  ],
};

// FileItem
const changeclick = (fileList: any[]) => {
  console.log(fileList, 'fileList');
  const urlList = fileList.map((item: Record<string, any>) => {
    const { uid, name, response, url } = item;
    console.log(response);

    return response?.data;
  });

  currentamountnum.value = urlList;
};
const beforeUpload = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    const type = file?.name.substr(
      file?.name.lastIndexOf('.') + 1,
      file?.name.length
    );
    console.log(type, 'http://10.14.148.103:9191');
    const isLt5M: boolean = file.size / 1024 / 1024 < 4.8;
    console.log('====beforeUpload', isLt5M);
    if (!isLt5M) {
      Message.warning('上传图片大小必须限制在5MB以内');
      // return false;
      reject();
    } else if (type === 'pdf' || type === 'xlsx') {
      Message.warning('请上传正确的文件格式');
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
      console.log(state.formModel, currentamountnum.value);
      submitImg({
        id: state.formModel.id,
        attachmentAddressArr: currentamountnum.value,
      }).then((res) => {
        console.log(res, 'res');
        currentamount.value = [];
        // Message.success('上传支付凭证成功');
        emit('confirm');
      });
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
  console.log(id);

  state.formModel = { id };
  currentamount.value = currentamount;

  // fileList.value = currentamount?.value.map((pathName: string) => {
  //   return { url: `/web/file/orderDownload?name=${pathName}` };
  // });

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
});
</script>

<style scoped lang="less">
.uploadimg {
  :deep(.tele-upload-list) {
    // height: 100px;
    .tele-upload-list-picture {
      width: 100px;
      height: 100px;
      // margin-bottom: 0;
      &:nth-child(5) {
        margin-right: 0;
      }
    }

    .tele-upload-picture-card {
      width: 100px;
      height: 100px;
    }
  }
  // :deep(.tele-upload-list-picture) {
  //   width: 100px;
  //   height: 100px;
  //   margin-bottom: 0;

  //   &:nth-child(5) {
  //     margin-right: 0;
  //   }
  // }

  // :deep(.tele-upload-picture-card) {
  //   width: 100px;
  //   height: 100px;
  // }
}
</style>
