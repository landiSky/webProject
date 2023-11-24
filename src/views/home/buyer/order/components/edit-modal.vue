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
    <t-form
      ref="formRef"
      class="form-list"
      :model="state.formModel"
      :rules="formRules"
    >
      <t-form-item
        field="currentamountlist"
        :hide-label="true"
        style="margin-bottom: 10px"
      >
        <t-upload
          list-type="picture-card"
          :headers="uploadHeaders"
          action="/server/web/file/orderUpload"
          :limit="5"
          accept=".jpg,.png,.bmp,.gif,.jpeg"
          image-preview
          class="uploadimg"
          multiple
          @before-upload="beforeUpload"
          @change="changeclick"
        >
          <template #upload-button>
            <div class="tele-upload-picture-card">
              <div class="tele-upload-picture-card-text">
                <IconPlus size="16" stroke-width="6" />
                <div style="margin-top: 10px; font-weight: 600">点击上传</div>
              </div>
            </div>
          </template>
        </t-upload>
      </t-form-item>
      <div class="img-title">
        支持jpg、png、bmp、gif、jpeg文件格式,文件大小限制5M以内,最多可上传5张。
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
        if (
          Array.isArray(currentamountnum.value) &&
          currentamountnum.value.length
        ) {
          cb();
        } else {
          return cb('至少上传一张');
        }
        return cb();
      },
    },
  ],
};

// FileItem
const changeclick = (fileList: any[]) => {
  const urlList = fileList.map((item: Record<string, any>) => {
    const { uid, name, response, url } = item;

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
    const isLt5M: boolean = file.size / 1024 / 1024 < 4.8;
    if (!isLt5M) {
      Message.warning('上传图片大小必须限制在5MB以内');
      // return false;
      reject();
      // jpg、png、bmp、gif、jpeg
    } else if (
      type !== 'jpg' &&
      type !== 'png' &&
      type !== 'bmp' &&
      type !== 'gif' &&
      type !== 'jpeg'
    ) {
      console.log(type, 'type');
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
      submitImg({
        id: state.formModel.id,
        attachmentAddressArr: currentamountnum.value,
      }).then((res) => {
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

  state.formModel = { id };
  currentamount.value = currentamount;
});
</script>

<style scoped lang="less">
.uploadimg {
  // :deep(.tele-upload-list)
  :deep(.tele-upload-list) {
    // height: 100px;
    transition: none;

    .tele-upload-list-picture {
      width: 100px;
      height: 100px;

      img {
        object-fit: cover;
        border: 1px solid #e5e8ef;
      }
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
}

.form-list {
  position: relative;

  .img-title {
    position: absolute;
    top: 110px;
    left: 0;
    color: #86909c;
  }
}
</style>
