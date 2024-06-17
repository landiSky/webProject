<template>
  <t-page-header
    flex
    :title="breadcrumbLabel"
    :show-back="true"
    :loading="currentData.loading"
    @back="goBack"
  >
    <template #extra>
      <div v-if="isVerify" class="extra-btn">
        <t-button type="primary" @click="clickPass">通过</t-button>
        <t-button type="primary" status="danger" @click="rejectVisible = true"
          >驳回</t-button
        >
      </div>
    </template>
    <template #breadcrumb>
      <t-breadcrumb :routes="breadcrumbList" />
    </template>
    <div
      v-if="isVerify == false"
      class="verify-result"
      :style="{ backgroundColor: verifyPass ? '#E8F4FF' : '#FFECE8' }"
    >
      <iconpark-icon
        v-if="verifyPass"
        name="success"
        size="16px"
      ></iconpark-icon>
      <iconpark-icon
        v-if="verifyPass == false"
        name="error"
        size="16px"
      ></iconpark-icon>
      <div class="verify-result-title">{{
        verifyPass ? '认证已通过' : '认证已驳回'
      }}</div>
      <div v-if="verifyPass == false" class="verify-result-content">
        驳回原因：{{ rejectReason }}</div
      >
    </div>
    <div class="body-content">
      <t-descriptions
        title="企业信息"
        :title-style="{
          fontSize: '14px',
          lineHeight: '22px',
          marginBottom: '16px',
        }"
        :title-divider-style="{ height: '12px' }"
        :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
        size="medium"
        :column="1"
      >
        <t-descriptions-item label="企业名称">
          {{ currentData.itemInfo.companyName ?? '-' }}
        </t-descriptions-item>
        <t-descriptions-item label="统一社会信用代码">
          {{ currentData.itemInfo.creditCode ?? '-' }}
        </t-descriptions-item>
        <!--测试1 企业地址-->
        <t-descriptions-item label="企业地址">
          {{ currentData.itemInfo?.orgAddrProvinceValue }}/{{
            currentData.itemInfo?.orgAddrCityValue
          }}{{ currentData.itemInfo?.orgAddrCountyValue ? '/' : ''
          }}{{ currentData.itemInfo?.orgAddrCountyValue }}
        </t-descriptions-item>
        <t-descriptions-item>
          <t-typography-paragraph style="width: 492px">
            {{ currentData.itemInfo?.orgAddr }}
          </t-typography-paragraph>
        </t-descriptions-item>
        <t-descriptions-item label="法人姓名">
          {{ currentData.itemInfo.legalPersonName ?? '-' }}
        </t-descriptions-item>
        <t-descriptions-item label="营业执照">
          <t-image
            :src="`/server/web/file/download?name=${currentData.itemInfo.businessLicense}`"
            height="100"
            width="158"
            fit="contain"
            style="border-radius: 2px"
          />
        </t-descriptions-item>
      </t-descriptions>
      <t-descriptions
        title="联系人信息"
        :title-style="{
          fontSize: '14px',
          lineHeight: '22px',
          marginBottom: '16px',
        }"
        :title-divider-style="{ height: '12px' }"
        :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
        size="medium"
        :column="1"
      >
        <t-descriptions-item label="姓名">
          {{ currentData.itemInfo.contactName ?? '-' }}
        </t-descriptions-item>
        <t-descriptions-item label="身份证号">
          {{ currentData.itemInfo.contactIdCard ?? '-' }}
        </t-descriptions-item>
        <t-descriptions-item label="联系人身份证">
          <t-image
            class="first-img"
            :src="`/server/web/file/download?name=${currentData.itemInfo.idCardz}`"
            height="100"
            width="158"
            fit="contain"
            style="border-radius: 2px"
          />
          <t-image
            :src="`/server/web/file/download?name=${currentData.itemInfo.idCardf}`"
            height="100"
            width="158"
            fit="contain"
            style="border-radius: 2px"
          />
        </t-descriptions-item>
      </t-descriptions>
    </div>
  </t-page-header>
  <RejectModal
    v-if="rejectVisible"
    :id="(route.query.id as string)"
    @cancel="rejectVisible = false"
    @confirm="clickReject"
  ></RejectModal>
</template>

<script setup lang="ts">
import { Message, Modal } from '@tele-design/web-vue';
import { reactive, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { verifyDetail, verify } from '@/api/operation/user';
import RejectModal from './reject-modal.vue';

const router = useRouter();
const route = useRoute();
const rejectVisible = ref(false);

const breadcrumbLabel = ref('');
const isVerify = ref(false);
const verifyPass = ref(true);
const rejectReason = ref('企业认证详情');

const breadcrumbList = ref([
  {
    path: '/user/verify',
    label: '用户管理',
  },
  {
    path: null,
    label: '认证管理',
  },
  {
    path: null,
    label: breadcrumbLabel,
  },
]);

const currentData = reactive<{
  loading: boolean;
  itemInfo: Record<string, any>;
}>({
  loading: true,
  itemInfo: {},
});

const goBack = () => {
  router.go(-1);
};

const getInfo = async () => {
  const id = route.query.id as string;
  currentData.loading = true;
  verifyDetail(id)
    .then((res: any) => {
      if (res.code === 200) {
        currentData.itemInfo = res.data;
        isVerify.value = res.data.certificateStatus === 0;
        verifyPass.value = res.data.certificateStatus === 1;
        rejectReason.value = res.data.remark;
        breadcrumbLabel.value = isVerify.value
          ? '企业认证审核'
          : '企业认证详情';
      } else {
        Message.error('认证详情信息获取失败');
      }
    })
    .finally(() => {
      currentData.loading = false;
    });
};

const clickReject = () => {
  rejectVisible.value = false;
  getInfo();
};

const doPass = () => {
  verify({ companyId: route.query.id as string, certStatus: 1 }).then((res) => {
    if (res.code === 200) {
      Message.success('申请已通过');
      getInfo();
    }
  });
};
// 通过
const clickPass = () => {
  Modal.warning({
    title: '确定通过该认证申请吗？',
    titleAlign: 'start',
    content: '',
    okText: '通过',
    hideCancel: false,
    onOk: () => {
      doPass();
    },
  });
};

onMounted(async () => {
  getInfo();
});
</script>

<style lang="less" scoped>
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .detail-head {
    padding-left: 8px;
    color: #1d2129;
    font-weight: 500;
    font-size: 16px;
  }

  .back_icon {
    cursor: pointer;

    svg:hover {
      background-color: red;
    }
  }
}

.extra-btn {
  display: flex;
  gap: 0 12px;
}

.verify-result {
  display: flex;
  align-items: center;
  padding: 12px 24px;

  .verify-result-title {
    margin-left: 8px;
    color: var(--t-41-d-2129, #1d2129);
    font-weight: 500;
    font-size: 14px;
    font-style: normal;
    line-height: 22px;
  }

  .verify-result-content {
    flex: 1;
    margin-left: 8px;
    color: var(--t-41-d-2129, #1d2129);
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 20px;
  }
}

.body-content {
  padding: 24px;
}

.first-img {
  margin-right: 12px;
}

:deep(.tele-page-header-content) {
  padding: 0;
}

:deep(.tele-image) {
  height: 100%;
}

:deep(.tele-image-img) {
  display: block;
  height: 100%;
}

:deep(.tele-descriptions-item-label-block) {
  width: 108px;
}

:deep(.tele-image-error-alt) {
  padding: 0;
}
</style>
