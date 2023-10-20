<template>
  <t-modal
    v-model:visible="showModal"
    fullscreen
    title-align="start"
    :closable="false"
    class="fullscreen-modal"
  >
    <!-- :on-before-ok="onConfirm"
    @cancel="emit('cancel')" -->
    <template #title>
      <span class="title-left" @click="goback">
        <!-- <icon-left /> -->
        <!-- <span>返回</span> -->
      </span>
      <span style="margin-left: 42%">
        {{ data.id ? '编辑企业认证' : '企业认证' }}
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
            v-model="formModel.nickName"
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
            v-model="formModel.nickName"
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
            v-model="formModel.nickName"
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
        <t-form-item label="营业执照" field="businesslicense">
          <t-upload
            list-type="picture-card"
            action="/"
            :limit="1"
            image-preview
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
          支持jpg、png、bmp、tif、gif文件格式,文件大小限制5M以内。
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
            v-model="formModel.username"
            :max-length="{
              length: 10,
              errorOnly: true,
            }"
            :disabled="props.data?.id"
            allow-clear
            show-word-limit
            placeholder="请输入"
          >
          </t-input>
        </t-form-item>
        <t-form-item label="联系人身份证号" field="contactidnumber">
          <t-input
            v-model="formModel.username"
            :max-length="{
              length: 18,
              errorOnly: true,
            }"
            :disabled="props.data?.id"
            allow-clear
            show-word-limit
            placeholder="请输入"
          >
          </t-input>
        </t-form-item>
        <t-form-item label="联系人身份证" field="contactidcard">
          <t-upload
            list-type="picture-card"
            action="/"
            :limit="1"
            image-preview
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
          <t-upload
            style="margin-left: -180px"
            list-type="picture-card"
            action="/"
            :limit="1"
            image-preview
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
        <p style="margin: -10px 0 20px 20%; color: #86909c">
          支持jpg、png、bmp、tif、gif文件格式,文件大小限制5M以内。
        </p>

        <!-- <t-form-item label="性别" name="sex">
          <t-radio-group v-model="formModel.sex">
            <t-radio :value="1">男</t-radio>
            <t-radio :value="0">女</t-radio>
          </t-radio-group>
        </t-form-item> -->
        <!-- <t-form-item label="手机号" field="phone">
          <t-input
            v-model="formModel.phone"
            allow-clear
            placeholder="请输入11位手机号"
          >
          </t-input>
        </t-form-item> -->
        <!-- <t-form-item label="邮箱" field="email">
          <t-input
            v-model="formModel.email"
            allow-clear
            placeholder="请输入邮箱"
          >
          </t-input>
        </t-form-item> -->

        <!-- <t-form-item label="备注" field="comments">
          <t-textarea
            v-model="formModel.comments"
            placeholder="请输入备注"
            :max-length="{
              length: 200,
              errorOnly: true,
            }"
            show-word-limit
            allow-clear
          />
        </t-form-item> -->
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
import { defineProps, defineEmits, ref, onMounted } from 'vue';
// import { usersDetail, usersAdd, usersUpdate } from '@/api/user-depart';
import { Message } from '@tele-design/web-vue';

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
const formModel = ref({
  enterprisename: null,
  creditcode: undefined,
  corporatename: null,
  businesslicense: null,
  contactname: null,
  contactidnumber: [],
  contactidcard: null,
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

onMounted(() => {
  if (props.data?.id) {
    getUserDetail();
  }
});
// 完成
const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      emit('confirm');
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
      Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
      done(true);
    } else {
      done(false);
    }
  });
};
// 取消
const canceldes = () => {
  // console.log('cancel');

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
}
</style>
