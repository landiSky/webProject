<template>
  <t-modal
    v-model:visible="showModal"
    fullscreen
    title-align="start"
    :on-before-ok="onConfirm"
    :closable="false"
    class="fullscreen-modal"
    @back="goback"
  >
    <!-- :on-before-ok="onConfirm"
    @cancel="emit('cancel')" -->
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
        <t-form-item label="企业名称" field="enterprisename">
          <t-input
            v-model="formModel.enterprisename"
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
        <t-form-item label="统一社会信用代码" field="creditcode">
          <t-input
            v-model="formModel.creditcode"
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
        <t-form-item label="法人姓名" field="corporatename">
          <t-input
            v-model="formModel.corporatename"
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
        <!-- @before-upload="beforeUpload"  v-model="formModel.businesslicense" -->
        <t-form-item label="营业执照" field="businesslicense">
          <t-upload
            :file-list="formModel.businesslicense ? [{ url: '' }] : []"
            action="https://arco.design/"
            :limit="1"
            image-preview
            style="width: 150px; height: 100px"
            accept=".jpg,.png,.bmp,.tif,.gif"
            @before-upload="beforeUpload"
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
                  <div style="">点击上传</div>
                </div>
              </div>
            </template>
          </t-upload>
        </t-form-item>
        <p style="margin: -10px 0 20px 20%; color: #86909c">
          支持jpg、png、bmp、tif、gif文件格式,文件大小限制10M以内。
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
        <t-form-item label="联系人姓名" field="contactname">
          <t-input
            v-model="formModel.contactname"
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
        <t-form-item label="联系人身份证号" field="contactidnumber">
          <t-input
            v-model="formModel.contactidnumber"
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
          <t-form-item
            field="contactidcardz"
            :hide-label="true"
            style="width: 200px"
          >
            <!-- @before-upload="beforeUpload"   v-model="formModel.contactidcard.contactidcardz"-->
            <t-upload
              list-type="picture-card"
              :limit="1"
              image-preview
              :file-list="formModel.businesslicense ? [{ url: '' }] : []"
              action="https://arco.design/"
              accept=".jpg,.png,.bmp,.tif,.gif"
              @before-upload="beforeUpload"
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
          <t-form-item label="" :hide-label="true" field="contactidcardf">
            <!-- @before-upload="beforeUpload"   v-model="formModel.contactidcard.contactidcardf" -->
            <t-upload
              list-type="picture-card"
              :limit="1"
              image-preview
              style="margin-top: -20px"
              :file-list="formModel.businesslicense ? [{ url: '' }] : []"
              action="https://arco.design/"
              accept=".jpg,.png,.bmp,.tif,.gif"
              @before-upload="beforeUpload"
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
          支持jpg、png、bmp、tif、gif文件格式,文件大小限制10M以内。
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
// import { usersDetail, usersAdd, usersUpdate } from '@/api/user-depart';
import { Message, Modal } from '@tele-design/web-vue';

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
const detaillist = reactive({
  id: '企业id',
  userId: '用户id',
  companyName: '企业名称',
  creditCode: '统一社会信用代码',
  contactName: '联系人名称',
  contactIdCard: '15282219900812003X',
  idCardf:
    'https://img2.baidu.com/it/u=1628788978,405686623&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
  idCardz:
    'https://img0.baidu.com/it/u=1356935808,1870677175&fm=253&fmt=auto&app=138&f=JPEG?w=704&h=500',
  legalPersonName: '法人姓名',
  type: 1,
  businessLicenseId:
    'https://img0.baidu.com/it/u=1783176477,761999961&fm=253&fmt=auto&app=120&f=JPEG?w=605&h=500',
  certificateStatus: 0,
  remark: '驳理由',
});
const formModel = ref({
  // 企业名称
  enterprisename: detaillist?.companyName ? detaillist.companyName : null,
  // 统一社会信用代码
  creditcode: detaillist?.creditCode ? detaillist.creditCode : null,
  // 法人姓名
  corporatename: detaillist?.legalPersonName
    ? detaillist.legalPersonName
    : null,
  // 营业执照
  businesslicense: detaillist?.businessLicenseId
    ? detaillist.businessLicenseId
    : null,
  // 联系人姓名
  contactname: detaillist?.contactName ? detaillist.contactName : null,
  // 联系人身份证号
  contactidnumber: detaillist?.contactIdCard ? detaillist.contactIdCard : null,
  // 联系人身份证
  contactidcard: {
    contactidcardz: detaillist?.idCardz ? detaillist.idCardz : null,
    contactidcardf: detaillist?.idCardf ? detaillist.idCardf : null,
  },
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
  enterprisename: [
    { required: true, message: '请输入企业名称' },
    { maxLength: 50, message: '长度不超过50个字符' },
  ],
  creditcode: [
    { required: true, message: '请输入社会信用代码' },
    // { maxLength: 20, message: '长度不超过20个字符' },
    {
      match: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
      message: '请输入正确的信用代码',
    },
  ],
  corporatename: [
    { required: true, message: '请输入法人姓名' },
    { maxLength: 10, message: '长度不超过20个字符' },
  ],
  businesslicense: [{ required: true, message: '请上传营业执照' }],
  contactname: [
    { required: true, message: '请输入联系人姓名' },
    { maxLength: 10, message: '长度不超过10个字符' },
  ],
  contactidnumber: [
    { required: true, message: '请输入联系人身份证号' },
    { maxLength: 18, message: '长度不超过18个字符' },
    {
      match:
        /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
      message: '请输入正确的身份证号',
    },
  ],

  // contactidcard: [{ required: true, message: '请上传身份证' }],
  contactidcard: [{ required: true, message: '请上传身份证' }],
};

const goback = () => {
  // showModal.value = false;
  console.log('cancel');
  emit('cancel');
};

const getUserDetail = () => {
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
const beforeUpload = (file: File) => {
  // console.log(file, 'file');
  return new Promise<void>((resolve, reject) => {
    const isLt5M: boolean = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      Message.warning('上传图片大小必须限制在5MB以内');
      // return false;
      reject();
    }
    resolve();
  });
};

onMounted(() => {
  console.log(props.data?.statusled);
  // 0是提交认证 1是修改认证
  if (props.data?.statusled === 1) {
    getUserDetail();
  }
});
// const qqq = () => {
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
// 完成
const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      emit('confirm');
      const a = {
        id: '企业id',
        userId: '用户id',
        companyName: '企业名称',
        creditCode: '统一社会信用代码',
        contactName: '联系人名称',
        contactIdCard: '联系人身份证号',
        idCardf: '身份证反面ID',
        idCardz: '身份证正面ID',
        legalPersonName: '法人姓名',
        type: props.data.statusled, // 0：提交认证 1:重新认证
        businessLicenseId: '营业执照ID',
      };
      // 调后端接口
      // const api = props.data.id ? usersUpdate : usersAdd;
      // api(formModel.value)
      //   .then(() => {
      //     emit('confirm');
      //     Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
      //     done(true);
      //   })
      //   .catch(() => {
      //     done(false);
      //   });

      // mock数据
      // Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
      Message.success('认证已提交');
      done(true);
    } else {
      done(false);
    }
  });
};
// 取消
const canceldes = () => {
  console.log('cancel');

  emit('cancel');
};
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
  ::v-deep .tele-modal-fullscreen .tele-modal-footer {
    text-align: left;
  }
}

::v-deep.tele-modal-body .tele-form-item:last-child {
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

  ::v-deep .tele-upload-list-picture {
    width: 150px;
    height: 100px;
  }
}
</style>
