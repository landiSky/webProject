<template>
  <div class="overview">
    <div class="title">
      <p class="titletop">
        {{ props.title }}
      </p>
    </div>
    <div class="centers">
      <div class="datalist">
        <div
          v-if="
            userInfoByCompany.certificateStatus === CompanyAuthStatus.UNAUTH
          "
          class="dataimg"
        >
          <img :src="empty" alt="" />
        </div>
        <div
          v-if="
            [CompanyAuthStatus.TO_CHECK, CompanyAuthStatus.REJECT].includes(
              userInfoByCompany.certificateStatus
            )
          "
          class="img_auth"
        >
          <img :src="auth" alt="" />
        </div>
        <!-- 未认证 -->
        <div
          v-if="
            userInfoByCompany.certificateStatus === CompanyAuthStatus.UNAUTH
          "
          class="datatitle"
          >您还没有完成服务商认证，完成认证后可开通以下服务</div
        >
        <!-- 审核中 -->
        <div
          v-if="
            userInfoByCompany.certificateStatus === CompanyAuthStatus.TO_CHECK
          "
          class="datatitle"
          >企业认证审核中，完成认证后可开通以下服务</div
        >
        <!-- 驳回 -->
        <div
          v-if="
            userInfoByCompany.certificateStatus === CompanyAuthStatus.REJECT
          "
        >
          <div class="datatitle">企业认证申请已被驳回，请重新认证</div>
          <div class="datatitle_02">完成认证后可开通以下服务</div>
        </div>
        <div class="certification certification_01"
          >上架应用/服务，在整个标识领域推广应用/服务</div
        >
        <div class="certification certification_02"
          >管理组织架构，以企业购买应用,企业内多账号共同使用应用</div
        >
        <div class="databutton">
          <t-button
            v-if="
              userInfoByCompany.certificateStatus === CompanyAuthStatus.UNAUTH
            "
            type="primary"
            @click="onEditModalConfirm"
            >立即认证</t-button
          >
          <t-button
            v-if="
              [CompanyAuthStatus.TO_CHECK, CompanyAuthStatus.REJECT].includes(
                userInfoByCompany.certificateStatus
              )
            "
            type="primary"
            @click="hasdflags"
            >查看详情</t-button
          >
        </div>
      </div>
    </div>
    <!-- @confirm="onEditModalConfirm"
      @cancel="editModalVisible = false" -->
    <!-- 认证指南 -->
    <EditModal
      v-if="editModalVisible"
      :data="state.editData"
      @confirm="onEditModalConfirm"
      @cancel="editModalVisible = false"
      @hasdflag="hasdflags"
    ></EditModal>
    <!-- 企业认证 填写信息弹窗 -->
    <EditModalFullscreen
      v-if="gotoverifys"
      :data="state.editData"
      @confirm="onEditModalConfirmcode"
      @cancel="cancelgotoverifys"
    >
    </EditModalFullscreen>
    <!-- 详情弹窗 -->
    <DetailsModalFullscreen
      v-if="detailflag"
      :data="state.editData"
      @confirm="onEditModalConfirmflag"
      @cancel="detailflagclick"
    >
    </DetailsModalFullscreen>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps } from 'vue';
import empty from '@/assets/images/home/empty.png';
import auth from '@/assets/images/home/auth.png';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { CompanyAuthStatus } from '@/enums/common';

import EditModal from './components/edit-modal.vue';
import EditModalFullscreen from './components/edit-modal-fullscreen.vue';
import DetailsModalFullscreen from './components/details-modal-fullscreen.vue';

const props = defineProps({
  title: String,
});
const state = reactive({
  editData: {
    id: '1111',
    // 0是提交认证 1是修改认证
    statusled: 0,
  },
});

const userStore = useUserStore();
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);

// 立即认证弹窗
const editModalVisible = ref(false);
// 去认证弹窗
const gotoverifys = ref(false);
// 详情弹窗
const detailflag = ref(false);
// 立即认证
const authentications = () => {
  editModalVisible.value = true;
};
// 认证弹窗去认证事件
const onEditModalConfirm = () => {
  // console.log(gotoverifys.value);
  gotoverifys.value = true;
  editModalVisible.value = false;
};
const hasdflags = () => {
  editModalVisible.value = false;
  detailflag.value = true;
};
// 认证填写完成
const onEditModalConfirmcode = () => {
  state.editData.statusled = 0;
  gotoverifys.value = false;
};
const cancelgotoverifys = (status: number) => {
  if (status === 1) {
    detailflag.value = true;
    gotoverifys.value = false;
  } else {
    editModalVisible.value = true;
    gotoverifys.value = false;
  }
  state.editData.statusled = 0;
};

//  修改认证信息
const onEditModalConfirmflag = () => {
  detailflag.value = false;
  state.editData.statusled = 1;
  gotoverifys.value = true;
};
// 详情 取消
const detailflagclick = () => {
  detailflag.value = false;
  // editModalVisible.value = true;
};
</script>

<style scoped lang="less">
.overview {
  width: 100%;
  height: 100%;

  .title {
    width: 100%;
    height: 72px;
    border-bottom: 1px solid #f6f7fb;

    .titletop {
      padding-left: 30px;
      font-weight: 500;
      font-size: 16px;
      line-height: 72px;
    }
  }

  .centers {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .datalist {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .dataimg {
        width: 120px;
        height: 120px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .img_auth {
        width: 72px;
        height: 72px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .datatitle {
        margin-top: 16px;
        color: rgba(0, 0, 0, 1);
        font-weight: 500;
        font-size: 16px;
        // text-align: center;
        font-family: PingFang SC;
        line-height: 24px;
      }

      .datatitle_02 {
        margin-top: 16px;
        color: rgba(0, 0, 0, 1);
        font-weight: 400;
        font-size: 14px;
        font-family: PingFang SC;
        line-height: 22px;
      }

      .databutton {
        display: flex;
        justify-content: center;
        margin-top: 30px;
      }

      .certification {
        display: flex;
        width: 434px;
        height: 46px;
        margin-top: 16px;
        padding: 12px 12px 12px 54px;
        color: rgba(78, 89, 105, 1);
        font-weight: 400;
        font-size: 14px;
        font-family: PingFang SC;
        line-height: 22px;
      }

      .certification_01 {
        background: url(@/assets/images/home/certification_01.png) no-repeat;
        background-size: 100% 100%;
      }

      .certification_02 {
        background: url(@/assets/images/home/certification_02.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
