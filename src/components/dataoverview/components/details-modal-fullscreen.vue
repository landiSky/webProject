<template>
  <t-modal
    v-model:visible="showModal"
    fullscreen
    title-align="start"
    :closable="false"
    class="fullscreen-modal"
    :footer="null"
    @back="goback"
  >
    <!-- :on-before-ok="onConfirm"
    @cancel="emit('cancel')" -->
    <template #title>
      <!-- <span class="title-left" @click="goback">
        <icon-left />
        <span>返回</span>
      </span> -->
      <span style="margin-left: 42%">
        {{ data.id ? '企业认证' : '企业认证' }}
      </span>
    </template>

    <div class="modal-body">
      <div v-if="detaillist.certificateStatus === 2" class="toperror" style="">
        <div style="width: 40%" class="topcenters">
          <div class="topleft"
            ><p style="width: 100%"
              ><img
                :src="Error"
                alt=""
                style="float: left; margin: 1px 5px 0 0"
              /><span style="float: left; font-size: 14px"
                >认证已驳回，请修改后重新提交认证。</span
              ></p
            >
            <p style="float: left; margin-top: 5px"
              >驳回原因：{{ detaillist.remark }}</p
            >
          </div>
          <div class="topright" style="display: flex; align-items: center">
            <t-button type="primary" @click="editmessage"
              >修改认证信息</t-button
            >
          </div>
        </div>
      </div>
      <div v-if="detaillist.certificateStatus === 2" class="topwarn">
        <div style="width: 40%" class="topcenterswarn">
          <div class="topleft"
            ><p style="width: 100%"
              ><img
                :src="Warn"
                alt=""
                style="float: left; margin: 1px 5px 0 0"
              /><span style="float: left; font-size: 14px"
                >企业认证正在审核中，请耐心等待。</span
              ></p
            >
          </div>
        </div>
      </div>

      <div class="centers">
        <div class="asjhdg" style="margin-top: 15px">
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
          <div class="information">
            <div class="informationlist">
              <p style="float: left; width: 20%">企业名称</p>
              <p style="float: left">{{ detaillist.companyName }}</p>
            </div>
            <div class="informationlist">
              <p style="float: left; width: 20%">统一社会信用代码</p>
              <p style="float: left">{{ detaillist.creditCode }}</p>
            </div>
            <div class="informationlist">
              <p style="float: left; width: 20%">法人姓名</p>
              <p style="float: left">{{ detaillist.legalPersonName }}</p>
            </div>
            <div class="informationlist">
              <p style="float: left; width: 20%">营业执照</p>
              <img
                style="width: 170px; height: 100px"
                src="https://img2.baidu.com/it/u=131926818,980064900&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"
                alt=""
              />
            </div>
          </div>

          <div style="float: left; margin: 20px 0 10px 0"
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
              >联系人信息</span
            ></div
          >
          <div class="information">
            <div class="informationlist">
              <p style="float: left; width: 20%">联系人姓名</p>
              <p style="float: left">{{ detaillist.contactName }}</p>
            </div>
            <div class="informationlist">
              <p style="float: left; width: 20%">联系人身份证号</p>
              <p style="float: left">{{ detaillist.contactIdCard }}</p>
            </div>
            <div class="informationlist">
              <p style="float: left; width: 20%">联系人身份证</p>
              <img
                style="width: 170px; height: 100px; margin-right: 10px"
                src="https://img0.baidu.com/it/u=356669940,3715317246&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333"
                alt=""
              />
              <img
                style="width: 170px; height: 100px"
                src="https://img1.baidu.com/it/u=118352358,542469960&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <template #footer>
      <div style="margin-left: 33%; text-align: left">
        <t-button type="primary" style="margin-right: 20px" @click="onConfirm"
          >完成</t-button
        >
        <t-button @click="canceldes">取消</t-button>
      </div>
    </template> -->
  </t-modal>
</template>

<script lang="ts" setup>
import Error from '@/assets/images/home/Error.png';
import { defineProps, defineEmits, ref, onMounted } from 'vue';

import { authDetails } from '@/api/authentication';

import { Message } from '@tele-design/web-vue';
import Warn from '@/assets/images/home/warn.png';

// import { PropertyDescriptorParsingType } from 'html2canvas/dist/types/css/IPropertyDescriptor';

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
});
const detaillist = ref({
  id: '企业id',
  userId: '用户id',
  companyName: '企业名称',
  creditCode: '统一社会信用代码',
  contactName: '联系人名称',
  contactIdCard: '联系人身份证号',
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
const emit = defineEmits(['confirm', 'cancel']);
const showModal = ref(true);
const formRef = ref();
// const formModel = ref({
//   enterprisename: null,
//   creditcode: undefined,
//   corporatename: null,
//   businesslicense: null,
//   contactname: null,
//   contactidnumber: [],
//   contactidcard: null,
// });
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
const formRules = {
  enterprisename: [
    { required: true, message: '请输入企业名称' },
    { maxLength: 50, message: '长度不超过50个字符' },
  ],
  creditcode: [
    { required: true, message: '请输入社会信用代码' },
    { maxLength: 20, message: '长度不超过20个字符' },
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

  contactidcard: [{ required: true, message: '请上传身份证' }],
};

const goback = () => {
  // showModal.value = false;
  emit('cancel');
};

const getUserDetail = () => {
  // 调后端接口
  authDetails({ companyId: 2 }).then((res) => {
    console.log(res);
    // @ts-ignore
    detaillist.value = res;
  });
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
// 修改认证信息
const editmessage = () => {
  emit('confirm');
};

onMounted(() => {
  // if (props.data?.id) {
  getUserDetail();
  // }
});
// 完成
// const onConfirm = (done: (closed: boolean) => void) => {
//   formRef.value.validate((errors: any) => {
//     if (!errors) {
//       emit('confirm');
//       // 调后端接口
//       // const api = props.data.id ? usersUpdate : usersAdd;
//       // api(formModel.value)
//       //   .then(() => {
//       //     emit('confirm');
//       //     Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
//       //     done(true);
//       //   })
//       //   .catch(() => {
//       //     done(false);
//       //   });

//       // mock数据
//       Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
//       done(true);
//     } else {
//       done(false);
//     }
//   });
// };
// 取消
// const canceldes = () => {
//   // console.log('cancel');

//   emit('cancel');
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
}

.modal-body {
  // display: flex;
  // justify-content: center;
  height: 100%;
  padding-top: 0;
  overflow: auto;
  background-color: #fff;

  .tele-form {
    max-width: 652px;
  }

  .centers {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;

    .asjhdg {
      width: 40%;
      height: 100%;
      // background-color: red;
      .information {
        float: left;
        width: 100%;
        margin-top: 15px;

        .informationlist {
          float: left;
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
  }

  .toperror {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 90px;
    background-color: #ffece8;

    .topcenters {
      display: flex;
      justify-content: space-between;
    }
  }

  .topwarn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 62px;
    background-color: #fffae8;

    .topcenterswarn {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
