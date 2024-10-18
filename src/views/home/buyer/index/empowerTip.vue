<template>
  <t-modal
    v-model:visible="showModal"
    :width="800"
    :height="611"
    modal-class="modal-container"
    :modal-style="{
      background: 'linear-gradient(180deg, #e5efff 0%, #ffffff 100%)',
    }"
    :ok-loading="props.confirmLoading"
    :simple="true"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>
      <div class="title" style="margin: 0">{{ props.title }}</div>
    </template>
    <template #footer>
      <t-button @click="handleCancel">取消</t-button>
      <t-button type="primary" @click="handleOk">确认授权</t-button>
    </template>
    <div v-if="!showText" class="modal-body">
      <div class="picture"></div>
      <div class="title">智数通平台将获得以下权限</div>
      <div class="explain">
        <div class="explain-icon"></div>
        <div>读取你的登录状态信息</div>
      </div>
      <div class="explain">
        <div class="explain-icon"></div>
        <div>获取你的公开信息（登录名、昵称、头像等）</div>
      </div>
      <div class="explain">
        <div class="explain-icon"></div>
        <div
          >使用身份认证信息（姓名/企业名称、手机号、证件号码等）办理业务（如完成服务开通认证等）</div
        >
      </div>
      <div class="details">
        <t-link :hoverable="false" @click="clickSwitch">查看详情</t-link>
        <icon-down />
        <!-- <icon-up /> -->
      </div>
    </div>
    <div v-else class="text-field">
      <p style="margin-left: 0; text-align: justify"
        ><span
          style="
            color: black;
            font-size: 12pt;
            font-family: 宋体, 宋体, 宋体, 宋体;
            background-color: initial;
          "
          >《用户授权协议》（以下简称“本协议”）是北京泰尔英福科技有限公司（以下简称“智数通”）与用户（以下简称“您”）所订立的有效合约。</span
        ></p
      >
      <p style="margin-left: 0; text-align: justify"
        ><span
          style="
            color: black;
            font-size: 12pt;
            font-family: 宋体, 宋体, 宋体, 宋体;
            background-color: initial;
          "
          ><strong
            >【审慎阅读】<u
              >您即将通过本页面使用智数通平台账户授权登录第三方站点/软件或进行一定数据共享。确认授权前请您仔细阅读本协议的全部内容（特别是以粗体下划线标注的内容）。如您不同意本协议内容，或无法准确理解本协议任何条款的含义，请不要进行授权及后续操作。</u
            ></strong
          ></span
        ></p
      >
      <p style="margin-left: 0; text-align: justify"
        ><span
          style="
            color: black;
            font-size: 12pt;
            font-family: 宋体, 宋体, 宋体, 宋体;
            background-color: initial;
          "
          ><strong
            >【签约动作】<u
              >您通过网络页面确认同意接受本协议，视为您同意接受本协议的全部约定内容。</u
            ></strong
          ></span
        ></p
      >
      <p style="margin-left: 0"
        ><span
          style="
            color: black;
            font-size: 12pt;
            font-family: 宋体, 宋体, 宋体, 宋体;
            background-color: initial;
          "
          ><strong
            >【共享信息】<u
              >您授权智数通将您智数通平台账户的相关信息和数据传递给第三方包含但不限于（读取你的登录状态信息</u
            ></strong
          ></span
        >、<span
          style="
            color: black;
            font-size: 12pt;
            font-family: 宋体, 宋体, 宋体, 宋体;
            background-color: initial;
          "
          ><strong
            ><u
              >获取你的公开信息（登录名、昵称、头像等）使用身份认证信息（姓名/企业名称、手机号、证件号码等）使用企业认证信息（企业名称、统一社会信用代码、企业地址、法人姓名、营业执照、企业联系人姓名、联系人身份证号、联系人身份证）办理业务（如完成服务开通认证等）），用于第三方为您提供服务。页面提示上会展示具体授权对象、授权字段及内容等。</u
            ></strong
          >智数通会要求该第三方依法使用您的上述信息。<strong
            ><u>如您不希望向第三方提供上述信息，请勿点击确认授权。</u></strong
          ></span
        ></p
      >
      <p style="margin-left: 0"
        ><span
          style="
            color: black;
            font-size: 12pt;
            font-family: 宋体, 宋体, 宋体, 宋体;
            background-color: initial;
          "
          ><strong
            >【责任承担】<u
              >您理解，第三方服务由相应第三方提供并就以上服务及数据安全独立承担责任。因该第三方服务或其使用您的信息产生的纠纷，或第三方服务违反相关法律法规，或您在使用第三方服务过程中遭受的损失，请您与第三方协商解决。</u
            ></strong
          ></span
        ></p
      >
      <p style="margin-left: 0"
        ><span
          style="
            color: black;
            font-size: 12pt;
            font-family: 宋体, 宋体, 宋体, 宋体;
            background-color: initial;
          "
          ><strong
            >【安全提示】<u
              >网络欺诈往往会模仿、仿冒本登录页面的样式制作视觉感相似的页面引诱用户输入账号和密码等信息，智数通在此提醒您防范网络风险，不要向非智数通的站点或任何人士透露您的智数通平台账户的名称、密码等相关信息。</u
            ></strong
          ></span
        ></p
      >
      <p style="margin-left: 0"
        ><span
          style="
            color: black;
            font-size: 12pt;
            font-family: 宋体, 宋体, 宋体, 宋体;
            background-color: initial;
          "
          ><strong
            >【协议变更】<u
              >您同意，智数通可不时修订本协议，并将协议变更情况在智数通平台的网站/客户端上进行公示，该等变更自公告载明的生效时间开始生效，并成为本协议的一部分。</u
            ></strong
          ></span
        ></p
      >
      <p style="margin-left: 0"
        ><span
          style="
            color: black;
            font-size: 12pt;
            font-family: 宋体, 宋体, 宋体, 宋体;
            background-color: initial;
          "
          ><strong
            >【争议解决】<u
              >凡因本协议引起的任何与之有关的争议，首先应由该等争议的相关当事方通过友好协商解决，如果无法友好协商解决的，任何一方均可向被告所在地有管辖权的人民法院提起诉讼。</u
            ></strong
          ></span
        ></p
      >
      <p style="margin-left: 0"
        ><span
          style="
            color: black;
            font-size: 12pt;
            font-family: 宋体, 宋体, 宋体, 宋体;
            background-color: initial;
          "
          >【其他】本协议未尽事宜，参照《用户服务协议》与本协议有冲突的，以本协议为准。</span
        ></p
      >
    </div>
  </t-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, ref } from 'vue';

const emits = defineEmits(['confirm', 'cancel']);

const props = defineProps({
  visible: Boolean,
  confirmLoading: Boolean,
  title: String,
  empowerTipData: Object,
  companyId: String,
});

const showModal = computed(() => props.visible);

const showText = ref(false);
const clickSwitch = () => {
  showText.value = true;
};
const handleOk = () => {
  emits('confirm');
};

const handleCancel = () => {
  emits('cancel');
};

onMounted(async () => {});
</script>

<style scoped lang="less">
.modal-container {
  .modal-body {
    margin: 0 28px;
  }

  .picture {
    width: 281px;
    height: 201px;
    margin: auto;
    background: url('./image/security_01.png') no-repeat;
    background-size: 100%;
  }

  .title {
    width: 100%;
    height: 28px;
    margin: 20px 0;
    color: rgba(29, 33, 41, 1);
    font-weight: 400;
    font-size: 20px;
    font-family: PingFang SC;
    line-height: 28px;
    text-align: center;
  }

  .explain {
    display: flex;
    gap: 10px;
    align-items: center;
    height: 39px;
    color: rgba(78, 89, 105, 1);
    font-weight: 400;
    font-size: 14px;
    font-family: PingFang SC;
  }

  .explain-icon {
    width: 13px;
    height: 10px;
    background: url('./image/security_02.png') no-repeat;
    background-size: 100%;
  }

  .details {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    height: 51px;
    border-top: 1px dashed #bedcff;
  }

  .text-field {
    padding: 16px 0 16px 16px;
    background: rgba(255, 255, 255, 1);
  }
}
</style>
