<template>
  <t-modal
    v-model:visible="showModal"
    fullscreen
    title-align="start"
    class="fullscreen-modal"
    :on-before-ok="onConfirm"
    @cancel="onConfirm"
    @back="goback"
  >
    <template #title>
      <!-- <span class="title-left"> -->
      <!-- <div style="z-index: 10000">
          <icon-left style="margin-left: -11px" />
          <span @click="goback" style="margin-left: 7px">返回</span>
        </div>
      </span> -->
      <span style="margin-left: 42%">
        {{ data.id ? '企业认证' : '企业认证' }}
      </span>
    </template>
    <div class="modal-body">
      <t-form
        ref="formRef"
        :model="formModel"
        :label-col-props="{ span: 5 }"
        :rules="formRules"
      >
        <div style="margin-bottom: 10px"
          ><span
            style="
              float: left;
              width: 4px;
              height: 15px;
              margin-right: 10px;
              background-color: #1664ff;
            "
          ></span
          ><span
            style="
              float: left;
              height: 10px;
              font-weight: 500;
              font-size: 14px;
              line-height: 15px;
            "
            >企业信息</span
          ></div
        >
        <t-form-item label="企业名称" field="companyName">
          <t-input
            v-model="formModel.companyName"
            :max-length="{
              length: 50,
              errorOnly: true,
            }"
            allow-clear
            show-word-limit
            placeholder="请输入"
          >
          </t-input>
        </t-form-item>
        <t-form-item label="统一社会信用代码" field="creditCode">
          <t-input
            v-model="formModel.creditCode"
            :max-length="{
              length: 20,
              errorOnly: true,
            }"
            allow-clear
            show-word-limit
            placeholder="请输入"
          >
          </t-input>
        </t-form-item>
        <t-form-item label="法人姓名" field="legalPersonName">
          <t-input
            v-model="formModel.legalPersonName"
            :max-length="{
              length: 10,
              errorOnly: true,
            }"
            allow-clear
            show-word-limit
            placeholder="请输入"
          >
          </t-input>
        </t-form-item>
        <!-- @before-upload="beforeUpload" -->
        <t-form-item label="营业执照" field="businessLicense">
          <t-upload
            :file-list="
              formModel.businessLicense
                ? [
                    {
                      url: `/server/web/file/download?name=${formModel.businessLicense}`,
                    },
                  ]
                : []
            "
            list-type="picture-card"
            :headers="uploadHeaders"
            action="/server/web/file/upload"
            :limit="1"
            image-preview
            style="width: 150px; height: 100px"
            accept=".jpg,.png,.bmp,.tif,.gif"
            @before-upload="beforeUpload"
            @success="uploadSuccess"
          >
            <!-- @success="
              (fileItem) => uploadSuccess(fileItem, 'businessLicenseId')
            " -->
            <template #upload-button>
              <div
                style="
                  width: 150px;
                  height: 100px;
                  color: var(--color-text-1);
                  text-align: center;
                  background-color: var(--color-fill-2);
                  border: 1px dashed var(--color-fill-4);
                "
              >
                <div style="margin-top: 30px">
                  <div> <IconPlus /></div>
                  <div style="">点击上传</div>
                </div>
              </div>
            </template>
          </t-upload>
        </t-form-item>
        <p style="margin: -10px 0 20px 20%; color: #86909c">
          支持jpg、png文件格式,文件大小限制5M以内。
          <!-- 支持png和jpg,要求5M以内 -->
        </p>

        <div style="width: 100%; height: 1px; background-color: #e5e8ef"></div>
        <div style="margin: 20px 0 10px 0"
          ><span
            style="
              float: left;
              width: 4px;
              height: 15px;
              margin-right: 10px;
              background-color: #1664ff;
            "
          ></span
          ><span
            style="
              float: left;
              height: 10px;
              font-weight: 500;
              font-size: 14px;
              line-height: 15px;
            "
            >企业信息</span
          ></div
        >
        <t-form-item label="联系人姓名" field="contactName">
          <t-input
            v-model="formModel.contactName"
            :max-length="{
              length: 10,
              errorOnly: true,
            }"
            allow-clear
            show-word-limit
            placeholder="请输入"
          >
          </t-input>
        </t-form-item>
        <t-form-item label="联系人身份证号" field="contactIdCard">
          <t-input
            v-model="formModel.contactIdCard"
            :max-length="{
              length: 18,
              errorOnly: true,
            }"
            allow-clear
            show-word-limit
            placeholder="请输入"
          >
          </t-input>
        </t-form-item>
        <!-- <div style="display: flex"> -->
        <t-form-item label="联系人身份证" field="contactidcard">
          <t-form-item field="idCardz" :hide-label="true" style="width: 200px">
            <!-- @before-upload="beforeUpload" -->
            <t-upload
              :file-list="
                formModel.idCardz
                  ? [
                      {
                        url: `/server/web/file/download?name=${formModel.idCardz}`,
                      },
                    ]
                  : []
              "
              list-type="picture-card"
              action="/server/web/file/upload"
              :headers="uploadHeaders"
              :limit="1"
              image-preview
              accept=".jpg,.png,.bmp,.tif,.gif"
              @before-upload="beforeUpload"
              @success="uploadSuccessz"
            >
              <template #upload-button>
                <div
                  style="
                    width: 150px;
                    height: 100px;
                    color: var(--color-text-1);
                    text-align: center;
                    background-color: var(--color-fill-2);
                    border: 1px dashed var(--color-fill-4);
                  "
                >
                  <div style="margin-top: 30px">
                    <div> <IconPlus /></div>
                    <div style="">点击上传「人像面」</div>
                  </div>
                </div>
              </template>
            </t-upload>
          </t-form-item>
          <t-form-item label="" :hide-label="true" field="idCardf">
            <!-- @before-upload="beforeUpload" -->
            <t-upload
              :file-list="
                formModel.idCardf
                  ? [
                      {
                        url: `/server/web/file/download?name=${formModel.idCardf}`,
                      },
                    ]
                  : []
              "
              list-type="picture-card"
              action="/server/web/file/upload"
              :headers="uploadHeaders"
              :limit="1"
              image-preview
              style="margin-top: -20px"
              accept=".jpg,.png,.bmp,.tif,.gif"
              @before-upload="beforeUpload"
              @success="uploadSuccessf"
            >
              <template #upload-button>
                <div
                  style="
                    width: 150px;
                    height: 100px;
                    color: var(--color-text-1);
                    text-align: center;
                    background-color: var(--color-fill-2);
                    border: 1px dashed var(--color-fill-4);
                  "
                >
                  <div style="margin-top: 30px">
                    <div> <IconPlus /></div>
                    <div style="">点击上传「国徽面」</div>
                  </div>
                </div>
              </template>
            </t-upload>
          </t-form-item>
        </t-form-item>
        <!-- </div> -->
        <p style="margin: -30px 0 20px 20%; color: #86909c">
          支持jpg、png文件格式,文件大小限制5M以内。
        </p>
      </t-form>
    </div>
    <template #footer>
      <div style="margin-left: 33%; text-align: left">
        <t-button type="primary" style="margin-right: 20px" @click="onConfirm"
          >完成</t-button
        >
        <t-button @click="canceldes">取消</t-button>
      </div>
    </template>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted, reactive } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { authDetails, authSubmit, authRepeat } from '@/api/authentication';
import { getToken } from '@/utils/auth';
import { storeToRefs } from 'pinia';
import {
  Message,
  // Modal
} from '@tele-design/web-vue';

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
});

const emit = defineEmits(['confirm', 'cancel']);
const showModal = ref(true);
const formRef = ref();

const uploadHeaders = {
  Authorization: `Bearer ${getToken()}`,
};

// const detaillist = ref({
//   id: '',
//   userId: '',
//   companyName: '',
//   creditCode: '',
//   contactName: '',
//   contactIdCard: '',
//   idCardf: '',
//   idCardz: '',
//   legalPersonName: '',
//   businessLicenseId: '',
//   certificateStatus: 0, // 认证状态 0:待审核 1:已认证 2:已驳回 3:未认证
//   remark: '',
// });
const formModel = ref({
  id: 1392100221902848,
  userId: 5,
  // 企业名称
  companyName: '',
  // 统一社会信用代码
  creditCode: '',
  // 法人姓名
  legalPersonName: '',
  // 营业执照
  businessLicense: '',
  // 联系人姓名
  contactName: '',
  // 联系人身份证号
  contactIdCard: '',
  // 联系人身份证
  idCardz: '',
  idCardf: '',
  // 新增 0 重新添加 1
  type: 0,
});
// const fileList = [
//   {
//     uid: '-2',
//     name: '20200717-103937.png',
//     url: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
//   },
//   {
//     uid: '-1',
//     name: 'hahhahahahaha.png',
//     url: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
//   },
// ];
const formRules: any = {
  companyName: [
    { required: true, message: '请输入企业名称' },
    { maxLength: 50, message: '长度不超过50个字符' },
  ],
  creditCode: [
    { required: true, message: '请输入社会信用代码' },
    {
      match: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
      message: '请输入正确的信用代码',
    },
  ],
  legalPersonName: [
    { required: true, message: '请输入法人姓名' },
    { maxLength: 10, message: '长度不超过20个字符' },
  ],
  businessLicense: [
    {
      required: true,
      message: '请上传营业执照',
      validator: (value: any, cb: any) => {
        if (!formModel.value.businessLicense) {
          return cb('请上传营业执照');
        }

        return cb();
      },
    },
  ],
  contactName: [
    { required: true, message: '请输入联系人姓名' },
    { maxLength: 10, message: '长度不超过10个字符' },
  ],
  contactIdCard: [
    { required: true, message: '请输入联系人身份证号' },
    { maxLength: 18, message: '长度不超过18个字符' },
    {
      match:
        /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/,
      message: '请输入正确的身份证号',
    },
  ],

  contactidcard: [
    {
      required: true,
      message: '请上传身份证',
      validator: (value: any, cb: any) => {
        if (!formModel.value.idCardz) {
          return cb('请上传身份证正面');
        }
        if (!formModel.value.idCardf) {
          return cb('请上传身份证反面');
        }
        return cb();
      },
    },
  ],
  // contactidcard: [{ required: true, message: '请上传身份证' }],
};

const goback = () => {
  // showModal.value = false;
  console.log('cancel');
  emit('cancel', formModel.value.type);
};
const getUserDetail = () => {
  // userInfo.value?.companyId
  authDetails({ companyId: String(userInfoByCompany.companyId) })
    .then((res) => {
      console.log(res);
      //  @ts-ignore
      formModel.value = res;
      formModel.value.type = 1;
      console.log(formModel.value);
    })
    .catch((error) => {});
  // 调后端接口
  // loading.value = true;
  // usersDetail({ id: props.data?.id })
  //   .then((res) => {
  //     formModel.value = res || {};
  //     formModel.value.roleIds = res?.roles.map(
  //       (item: { [name: string]: any }) => item.id
  //     );
  //   })
  //   .catch(() => {})
  //   .finally(() => {
  //     loading.value = false;
  //   });
};
// @ts-ignore
const uploadSuccess = (fileItem: FileItem) => {
  console.log(fileItem);
  const res = fileItem.response;
  if (res?.code === 200) {
    console.log(fileItem.response.data);
    formModel.value.businessLicense = fileItem.response.data;
    console.log(formModel.value.businessLicense);
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};
// @ts-ignore
const uploadSuccessz = (fileItem: FileItem) => {
  console.log(fileItem);
  const res = fileItem.response;
  if (res?.code === 200) {
    formModel.value.idCardz = fileItem.response.data;

    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};
// @ts-ignore
const uploadSuccessf = (fileItem: FileItem) => {
  const res = fileItem.response;
  if (res?.code === 200) {
    formModel.value.idCardf = fileItem.response.data;

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
// 完成
const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      // setFields;
      console.log(formModel.value, 'closed');
      authRepeat({ creditCode: formModel.value.creditCode })
        .then((res) => {
          if (res.data.code === 200) {
            authSubmit(formModel.value)
              .then((res) => {
                console.log(res);
                emit('confirm');
                done(true);
                Message.success('认证已提交');
              })
              .catch((err) => {
                done(false);
              });
          } else {
            Message.error('信用代码已存在');
          }
        })
        .catch(() => {});

      // mock数据
      // Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
      // Message.success('认证已提交');
      // done(true);
    } else {
      done(false);
    }
  });
};
// 取消
const canceldes = () => {
  console.log('cancel');

  emit('cancel', formModel.value.type);
};

onMounted(() => {
  // 0是提交认证 1是修改认证
  if (props.data?.statusled === 1) {
    console.log(props.data?.statusled);

    getUserDetail();
  }
});
// const qqq = () =>
//   Modal.warning({
//     title: '企业认证重复',
//     content:
//       '该企业已完成「企业认证」，如需申请加入企业，请咨询企业联系人，联系方式：13233332222。',
//     titleAlign: 'start',
//     okText: '好的',
//     hideCancel: true,
//   });
//   Modal.warning({
//     title: '企业节点认证重复',
//     content:
//       '该企业已完成「企业节点认证」，如需申请加入企业，请咨询企业联系人，联系方式：13233332222。',
//     titleAlign: 'start',
//     okText: '好的',
//     hideCancel: true,
//   });
// };
</script>

<style lang="less" scoped>
.title-left {
  margin-left: 10px;
  cursor: pointer;

  span {
    margin-left: 15px;
  }
}

.fullscreen-modal {
  :deep(.tele-modal-fullscreen .tele-modal-footer) {
    text-align: left;
  }
}

:deep(.tele-modal-body .tele-form-item:last-child) {
  margin-bottom: 10px;
}

.modal-body {
  display: flex;
  justify-content: center;
  height: 100%;
  // padding-top: 32px;
  overflow: auto;
  background-color: #fff;

  .tele-form {
    max-width: 652px;
  }

  :deep(.tele-upload-list-picture) {
    width: 150px;
    height: 100px;
  }
}
</style>
