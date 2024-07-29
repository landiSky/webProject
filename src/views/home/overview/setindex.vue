<template>
  <div class="overview">
    <!-- 个人信息展示 -->
    <div class="information">
      <img class="img" :src="avatar" alt="" />
      <div class="text">
        <div class="user">
          <t-typography-paragraph
            :ellipsis="{
              rows: 1,
              showTooltip: true,
            }"
            class="name user"
            >{{ userInfoByCompany?.username || userInfo?.mobile }}
          </t-typography-paragraph>
        </div>
        <div class="list">
          <div class="title">
            <ellipsis
              :copy="false"
              :value="userInfoByCompany.companyName || '暂未认证'"
            >
            </ellipsis>
          </div>
          <div
            v-if="
              userInfoByCompany.nodeStatus === NodeAuthStatus.AUTHED ||
              userInfoByCompany.certificateStatus === CompanyAuthStatus.AUTHED
            "
            class="line"
          >
          </div>
          <div
            v-if="
              userInfoByCompany.nodeStatus === NodeAuthStatus.AUTHED ||
              userInfoByCompany.certificateStatus === CompanyAuthStatus.AUTHED
            "
            class="title"
          >
            {{
              userInfoByCompany.companyId
                ? AccountTypeDesc[userInfoByCompany.primary]
                : '-'
            }}
          </div>
          <div
            v-if="userInfoByCompany.selfPrefixList?.length"
            class="buttom-blue"
            >自建（{{ userInfoByCompany.selfPrefixList?.length }}）</div
          >
          <div v-if="userInfoByCompany.selfPrefixList?.length" class="title">{{
            userInfoByCompany.selfPrefixList.join('、')
          }}</div>
          <div
            v-if="userInfoByCompany.selfPrefixList?.length"
            class="prefix"
            @click="prefixJump(1)"
            >前缀管理>></div
          >
          <div
            v-if="userInfoByCompany.hostingEntPrefixList?.length"
            class="line"
          ></div>
          <div
            v-if="userInfoByCompany.hostingEntPrefixList?.length"
            class="buttom-blue buttom-yellow"
            >托管（{{ userInfoByCompany.hostingEntPrefixList?.length }}）</div
          >
          <div
            v-if="userInfoByCompany.hostingEntPrefixList?.length"
            class="title"
            >{{ userInfoByCompany.hostingEntPrefixList.join('、') }}</div
          >
          <div
            v-if="userInfoByCompany.hostingEntPrefixList?.length"
            class="prefix"
            @click="prefixJump(1)"
            >前缀管理>></div
          >
        </div>
      </div>
    </div>
    <!-- 标识服务开通 -->
    <div class="identifying">
      <div class="service">标识服务开通</div>
      <div class="idhub idhub-bg-01">
        <div class="idhub-title">IDHub自建流程引导</div>
        <div class="synopsis"
          >企业依托自有资源建设企业节点，自建企业节点所涉及带宽、存储以及计算等资源应满足未来一定时期业务发展需求，并支持弹性扩展。</div
        >
        <div class="idhub-steps">
          <div v-for="(item, index) in stepsList" :key="index" class="step">
            <div class="item-left">
              <div
                v-if="index !== 0"
                class="left-line"
                :class="item.classLeft"
              ></div>
              <img class="left-icon" :src="item.img" alt="" />
            </div>
            <div class="item-content">
              <div class="enterprise-prefix">{{ item.name }}</div>
              <div class="item-position">
                <div class="introduce" :class="item.introduce">{{
                  item.text
                }}</div>
                <div v-if="index === 0" class="buttom-body">
                  <t-link
                    v-if="!productData?.entSubmitStatus"
                    :hoverable="false"
                    @click="registerJump"
                  >
                    立即注册
                  </t-link>
                  <t-link
                    v-if="productData?.entSubmitStatus"
                    :hoverable="false"
                    @click="prefixJump(1)"
                  >
                    查看前缀
                  </t-link>
                </div>
                <div v-if="index === 1" class="buttom-body">
                  <t-link
                    v-if="!productData?.idHubBuyStatus"
                    :hoverable="false"
                    @click="buyNow(productData)"
                    >立即购买</t-link
                  >
                  <t-link
                    v-if="productData?.idHubBuyStatus"
                    :hoverable="false"
                    @click="viewOrder"
                  >
                    查看订单
                  </t-link>
                </div>
                <div v-if="index === 2" class="buttom-body">
                  <t-link
                    v-if="!productData?.licenseApplyStatus"
                    :hoverable="false"
                    @click="applyNow"
                    >立即申请</t-link
                  >
                  <t-link
                    v-if="productData?.licenseApplyStatus"
                    :hoverable="false"
                    @click="viewLicense"
                  >
                    查看License
                  </t-link>
                </div>
                <div v-if="index === 3" class="buttom-body"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="idhub idhub-bg-02">
        <div class="idhub-title">IDHub托管流程引导</div>
        <div class="synopsis"
          >企业节点可以将标识解析相关数据和服务托管到二级节点，且受托部署单位会加强企业节点数据管理，保障企业合法权益。不论采用何种模式，企业节点数据原则上均归属于企业。</div
        >
        <div class="idhub-steps">
          <div
            v-for="(item, index) in trusteeshipList"
            :key="index"
            class="step"
          >
            <div class="item-left">
              <div
                v-if="index !== 0"
                class="left-line"
                :class="item.classLeft"
              ></div>
              <img class="left-icon" :src="item.img" alt="" />
            </div>
            <div class="item-content">
              <div class="enterprise-prefix">{{ item.name }}</div>
              <div class="item-position">
                <div class="introduce" :class="item.introduce">{{
                  item.text
                }}</div>
                <div v-if="index === 0" class="buttom-body">
                  <t-link
                    v-if="!productData?.entSubmitStatus"
                    :hoverable="false"
                    @click="registerJump"
                    >立即注册</t-link
                  >
                  <t-link
                    v-if="productData?.entSubmitStatus"
                    :hoverable="false"
                    @click="prefixJump(1)"
                  >
                    查看前缀
                  </t-link>
                </div>
                <div v-if="index === 1" class="buttom-body">
                  <t-link
                    v-if="!productData?.hostingSubmitStatus"
                    :hoverable="false"
                    @click="instantHosting"
                  >
                    立即托管
                  </t-link>
                  <t-link
                    v-if="productData?.hostingSubmitStatus"
                    :hoverable="false"
                    @click="viewDetail"
                  >
                    查看详情
                  </t-link>
                </div>
                <div v-if="index === 2" class="buttom-body">
                  <t-link :hoverable="false"></t-link>
                </div>
                <div v-if="index === 3" class="buttom-body"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 调试工具 -->
    <div class="tool">
      <div class="idhub idhub-width idhub-bg-03">
        <div class="idhub-title">调试工具IDTest</div>
        <div class="synopsis synopsis-width"
          >IDTest为标识应用开发者提供独立测试环境，支持开发者在此环境下进行功能测试、性能测试以及破坏性测试。IDTest具备以下特点及优势：一键申请沙盒企业前缀、多前缀同时服务、多标识用户绑定、服务调用问题快速定位、调用情况统计。</div
        >
        <div class="idhub-steps">
          <div v-for="(item, index) in toolList" :key="index" class="step">
            <div class="item-left">
              <div
                v-if="index !== 0"
                class="left-line"
                :class="item.classLeft"
              ></div>
              <img class="left-icon" :src="item.img" alt="" />
            </div>
            <div class="item-content">
              <div class="enterprise-prefix">{{ item.name }}</div>
              <div class="item-position">
                <div class="introduce introduce-width" :class="item.introduce">
                  {{ item.text }}
                </div>
                <div v-if="index === 0" class="buttom-body">
                  <t-link
                    v-if="!productData?.idTestBuyStatus"
                    :hoverable="false"
                    @click="zeroPurchase"
                  >
                    0元购买
                  </t-link>
                  <t-link
                    v-if="productData?.idTestBuyStatus"
                    :hoverable="false"
                    @click="viewOrder"
                  >
                    查看订单
                  </t-link>
                </div>
                <div v-if="index === 1" class="buttom-body">
                  <t-link :hoverable="false" @click="immediateUse">
                    立即使用
                  </t-link>
                </div>
                <div v-if="index === 2" class="buttom-body">
                  <t-link :hoverable="false"></t-link>
                </div>
                <div v-if="index === 3" class="buttom-body"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="manual">
        <div class="manual-top">
          <div class="title">帮助手册&开发参考</div>
          <t-link :hoverable="false" @click="moreJump('')">更多</t-link>
        </div>
        <div class="manual-ul">
          <ul>
            <li
              v-for="(item, index) in manualList"
              :key="index"
              @click="moreJump(item.url)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <img
          class="manual-img"
          src="@/assets/images/overview/overview-04.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Message, Modal } from '@tele-design/web-vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useOrderStore } from '@/store/modules/order';
import { sm2 } from '@/utils/encrypt';
import {
  userLicensePreview,
  alreadyBuyClientLogin,
  apiProductDetail,
  apiComputePrice,
} from '@/api/identifying/overview';
import {
  SaleType,
  AccountType,
  AccountTypeDesc,
  CompanyAuthStatus,
  NodeAuthStatus,
} from '@/enums/common';
import { apiDataPoint } from '@/api/data-point';
import { snmsClientLogin } from '@/api/login';
import avatar from '@/assets/images/overview/avatar.png';

import icon1 from '@/assets/images/overview/icon-01.png';
import icon2 from '@/assets/images/overview/icon-02.png';
import icon3 from '@/assets/images/overview/icon-03.png';
import icon4 from '@/assets/images/overview/icon-04.png';

import ellipsis from '@/components/ellipsis/index.vue';

const router = useRouter();

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);
const orderStore = useOrderStore();

// 概览商品数据
const productData = ref<Record<string, any>>({
  licenseApplyStatus: null, // license申请状态 0-未申请 1-已申请
  idTestProductId: null, // 沙盒商品id
  idHubProductId: null, // 节点商品id
  idTestBuyStatus: null, // 沙盒商品购买状态 0-未购买 1-已购买
  idHubBuyStatus: null, // 节点商品购买状态 0-未购买 1-已购买
  entSubmitStatus: null, // 是否提交前缀 0-未提交 1-已提交
  hostingSubmitStatus: null, // 是否提交托管 0-未提交 1-已提交
  idTestProductStatus: null, // 沙盒商品状态:0-待审节点商品状态:0-待审核,1-已上架,2-已驳回,3-未上架核,1-已上架,2-已驳回,3-未上架
  idHubProductStatus: null, // 节点商品状态:0-待审核,1-已上架,2-已驳回,3-未上架
  idTestOrderId: null, // 沙盒订单id
  productDeliverySetId: null, // 沙盒商品交付版本id
});
// ------  0元购买数据
const prodDetail = ref<Record<string, any>>({}); // 商品详情数据
const versionObj: Record<string, any> = {}; // {【versionId】: {}}, 目的是 版本radio变更后，能够获取到当前选择的 version data
const deliveryList = ref<Record<string, any>[]>([]);
const selectVersion = ref<Record<string, any>>({});
const previewImgList = ref<string[]>([]);
const bigImgPath = ref();
const templateList = ref<Record<string, any>[]>([]);
const priceParams = ref<Record<string, any>>({
  deliveryVersionId: null,
  accountId: null,
  durationId: null,
});
const price = ref();
// 是否装修
const versionType = ref(0);
// ------

const stepsList = ref([
  {
    img: icon1,
    name: '注册企业前缀',
    text: '建设模式选择自建类型',
    type: '',
    state: '',
    classLeft: '',
    introduce: 'introduce-01',
  },
  {
    img: icon2,
    name: '开通企业节点服务',
    text: '购买标识解析企业节点应用',
    type: '',
    state: '',
    classLeft: 'left-line-01',
    introduce: 'introduce-02',
  },
  {
    img: icon3,
    name: '申请License',
    text: '自建企业前缀可申请License 用于企业节点的部署配置',
    type: '',
    state: '',
    classLeft: 'left-line-02',
    introduce: 'introduce-03',
  },
  {
    img: icon4,
    name: '部署应用',
    text: '获取IDHub安装包，根据流程引导完成部署',
    type: '',
    state: '',
    classLeft: 'left-line-03',
    introduce: 'introduce-04',
  },
]);

const trusteeshipList = ref([
  {
    img: icon1,
    name: '注册企业前缀',
    text: '建设模式选择自建类型',
    type: '',
    state: '',
    classLeft: '',
    introduce: 'introduce-01',
  },
  {
    img: icon2,
    name: '申请托管',
    text: '将企业前缀进行托管申请',
    type: '',
    state: '',
    classLeft: 'left-line-01',
    introduce: 'introduce-02',
  },
]);

const toolList = ref([
  {
    img: icon1,
    name: '开通沙盒服务',
    text: '0元购买标识解析沙盒应用',
    type: '',
    state: '',
    classLeft: '',
    introduce: 'introduce-01',
  },
  {
    img: icon2,
    name: '开发调试',
    text: '开发者可在此环境下进行功能测试、性能测试以及破坏性测试',
    type: '',
    state: '',
    classLeft: 'left-line-01',
    introduce: 'introduce-02',
  },
]);

const manualList = ref([
  {
    name: 'IDHub标准版API',
    url: 'https://snms.teleinfo.cn/docs/idhub/standard/introduce',
  },
  {
    name: '工业互联网标识解析SDK',
    url: 'https://snms.teleinfo.cn/docs/sdk/v1/introduction',
  },
  {
    name: '标识应用开发指南',
    url: 'https://snms.teleinfo.cn/docs/handle-app-sop/1-introduce/purpose',
  },
]);

// 跳转二级公共方法
const clickIdService = (pageUrl: any) => {
  const { primary, companyId } = userInfoByCompany.value || {};
  if (Number(primary) !== 2 || userInfo.value?.isAdmin) {
    const { snmsUrls } = userInfo.value || {};
    const params = {
      companyId: userInfo.value?.isAdmin
        ? userInfo.value?.companyId
        : companyId,
      snmsLoginId: snmsUrls?.snmsLoginId,
    };
    snmsClientLogin(params).then((res: any) => {
      if (res?.data?.code === 102006) {
        Message.error(res?.data?.message);
      }
      if (!res?.data?.data) {
        return;
      }
      const data = {
        type: 'snms',
        companyId: userInfo.value?.isAdmin
          ? userInfo.value?.companyId
          : companyId,
        pageUrl,
      };
      const sm2data = sm2(
        JSON.stringify(data),
        userStore.configInfo?.publicKey
      );
      window.open(`${res?.data?.data}&data=${sm2data}`);
    });
  } else {
    Modal.warning({
      title: '仅企业管理员可操作',
      content: '',
      titleAlign: 'start',
      okText: '好的',
    });
  }
};

// 立即注册
const registerJump = () => {
  if (userInfoByCompany?.value?.primary === 3) {
    Message.error('请先完成企业认证');
    return;
  }
  clickIdService('/ent/apply');
};

// 立即购买
const buyNow = (obj: any) => {
  if (userInfoByCompany?.value?.primary === 3) {
    Message.error('请先完成企业认证');
    return;
  }
  if (obj?.idHubProductStatus === 1) {
    router.push({
      name: 'wowMallDetail',
      params: { id: obj?.idHubProductId },
    });
    return;
  }
  Message.warning('商品已下架，无法继续购买');
};

// 立即申请
const applyNow = () => {
  if (userInfoByCompany?.value?.primary === 3) {
    Message.error('请先完成企业认证');
    return;
  }
  router.push({
    path: '/license/index',
    query: {
      type: '1',
    },
  });
};

// 立即托管
const instantHosting = () => {
  if (userInfoByCompany?.value?.primary === 3) {
    Message.error('请先完成企业认证');
    return;
  }
  clickIdService('/entPrefix/proxy');
};

const onAuthConfirm = (memberIdList: string[]): any => {
  const {
    companyId,
    id,
    companyName,
    name,
    deliveryType,
    saleType,
    logo,
    source,
  } = prodDetail.value;
  const { accountNumList, durationList } = selectVersion.value;
  const { accountId, durationId } = priceParams.value;

  let accountDesc = '不限';
  let durationDesc = '不限';

  let accountItem = null;
  if (saleType === SaleType.PACKAGE) {
    accountItem = accountNumList.find(
      (item: Record<string, any>) => item.id === accountId
    );
    const durationItem = durationList.find(
      (item: Record<string, any>) => item.id === durationId
    );
    accountDesc = `${accountItem.accountNum}个`;
    durationDesc =
      durationItem.duration > 0 ? `${durationItem.duration}个月` : '不限'; // 套餐里时长有不限
  }

  if (
    (accountItem?.accountNum || 0) > 0 &&
    memberIdList?.length > accountItem?.accountNum
  ) {
    Message.warning('已超出购买账号数');
    return;
  }

  // authModalVisible.value = false;

  // TODO 封装确认订单需要的字段
  orderStore.createOrderInfo = {
    companyId,
    productId: id,
    deliveryVersionId: selectVersion.value.id,
    saasAppId: selectVersion.value.saasAppId,
    price: price.value,
    accountDesc,
    durationDesc,
    accountId,
    durationId,
    companyName,
    name,
    deliveryType,
    logo,
    orderSource: source,
    saleType,
    memberIdList,
  };

  router.push({
    path: '/order/confirm',
  });
};

// 0元购买
const zeroPurchase = (obj: any) => {
  if (userInfoByCompany?.value?.primary === 3) {
    Message.error('请先完成企业认证');
    return;
  }
  const { idTestProductStatus, idTestProductId } = obj;
  if (idTestProductStatus === 1) {
    apiDataPoint(
      idTestProductId as string,
      null,
      userInfo.value?.id,
      4,
      4
    ).then(() => {
      console.log('立即购买打点', idTestProductId);
    });
    if (userInfoByCompany.value?.companyId === prodDetail.value.companyId) {
      Message.warning('无法购买本企业商品!');
      return;
    }
    if (userInfoByCompany.value?.primary === AccountType.MAIN) {
      onAuthConfirm([]);
      return;
    }
  }
  Message.warning('商品已下架，无法继续购买');
};

// 立即使用
const immediateUse = (obj: any) => {
  if (userInfoByCompany?.value?.primary === 3) {
    Message.error('请先完成企业认证');
    return;
  }
  const {
    idTestProductStatus,
    idTestProductId,
    idTestOrderId,
    productDeliverySetId,
  } = obj;
  if (idTestProductStatus === 1) {
    const params = {
      productId: idTestProductId,
      productDeliverySetId,
      memberId: selectCompany.value?.memberId,
      orderId: idTestOrderId,
    };

    alreadyBuyClientLogin(params).then((res: any) => {
      const data = {
        type: 'productApp',
        productId: idTestProductId,
        productDeliverySetId,
        memberId: selectCompany.value?.memberId,
      };
      const sm2data = sm2(
        JSON.stringify(data),
        userStore.configInfo?.publicKey
      );
      if (res.code === 102008) {
        return Message.warning(res?.message);
      }
      if (res.code !== 200) {
        return Message.error(res?.message);
      }
      return window.open(`${res.data}&data=${sm2data}`);
    });
  }
  Message.warning('请先开通沙盒服务');
};

// 帮助手册/开发参考  更多 文档对应地址
const moreJump = (url: string) => {
  if (!url) {
    const routeData = router.resolve({
      name: 'wowDoc',
      query: {},
    });
    window.open(routeData?.href, '_blank');
    return;
  }
  window.open(url);
};

// 前缀（前缀申请页面/托管申请页面）
const prefixJump = (num: number) => {
  if (num === 1) {
    clickIdService('/ent/apply');
    return;
  }
  clickIdService('/entPrefix/proxy');
};

// 查看订单
const viewOrder = () => {
  router.push({
    path: '/buyer/order',
    query: {},
  });
};

// 查看License
const viewLicense = () => {
  router.push({
    path: '/license/index',
    query: {},
  });
};

// 查看详情
const viewDetail = () => {
  clickIdService('/entPrefix/proxy');
};

const getPrice = () => {
  if (
    prodDetail.value.saleType === SaleType.CONSULT ||
    prodDetail.value.saleType === SaleType.FREE
  ) {
    return;
  }
  apiComputePrice({
    productId: prodDetail.value.id,
    ...priceParams.value,
  })
    .then((data: any) => {
      price.value = data;
    })
    .catch(() => {})
    .finally(() => {});
};

// 获取概览相关数据
const initData = () => {
  userLicensePreview({}).then((res) => {
    productData.value = res;
    if (res.idTestProductId) {
      // TODO w: 商品详情打点
      apiDataPoint(
        res.idTestProductId as string,
        null,
        userInfo.value?.id,
        4,
        3
      ).then(() => {
        console.log('商品详情打点', res.idTestProductId);
      });

      apiProductDetail({ id: res.idTestProductId })
        .then((data: Record<string, any>) => {
          const tagMap = data.tagMap.filter(
            // (tag: any) => String(tag.id) !== '2'
            (tag: any) => String(tag.tagName) !== '公共服务'
          );
          prodDetail.value = { ...data, tagMap };
          deliveryList.value = data.productDeliverySetList || [];
          previewImgList.value = data.detailImg.split(',');
          bigImgPath.value = previewImgList.value?.[0];

          templateList.value = JSON.parse(data.detail);
          versionType.value = data.versionType;

          const { saleType } = data;

          if (Array.isArray(deliveryList.value) && deliveryList.value.length) {
            if (
              [SaleType.ONEOFF, SaleType.PACKAGE, SaleType.FREE].includes(
                saleType
              )
            ) {
              // 一口价
              //   priceParams.value.deliveryVersionId = deliveryList.value[0].id;
              //   getPrice();
              // } else if (saleType === SaleType.PACKAGE) {
              deliveryList.value.forEach((item: Record<string, any>) => {
                versionObj[item.id] = item;
              });

              //  套餐，初始化去计算
              selectVersion.value = deliveryList.value?.[0];
              const { id, accountNumList, durationList } = selectVersion.value;

              priceParams.value.deliveryVersionId = id;
              priceParams.value.accountId = accountNumList?.[0].id;
              priceParams.value.durationId = durationList?.[0].id;
              getPrice();
            } else if (saleType === SaleType.CONSULT) {
              deliveryList.value.forEach((item: Record<string, any>) => {
                versionObj[item.id] = item;
              });

              selectVersion.value = deliveryList.value?.[0];
              const { id } = selectVersion.value;

              priceParams.value.deliveryVersionId = id;
            }
          }
        })
        .catch(() => {});
    }
  });
};
onMounted(() => {
  // 获取概览相关数据
  initData();
});
</script>

<style lang="less" scoped>
.overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  overflow-y: auto;
  background: url(@/assets/images/overview/overview-bg.png) no-repeat scroll top
    center #f2f3f8;
  background-size: 100% auto;
}

.information {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 1200px;
  min-height: 79px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(232, 233, 234, 1);

  .img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }

  .text {
    .user {
      color: rgba(34, 51, 84, 1);
      font-weight: 600;
      font-size: 15px;
      font-family: PingFang SC;
      line-height: 34px;
      text-align: left;

      .name {
        margin-bottom: 0;
      }
    }

    .list {
      display: flex;
      gap: 12px;
      align-items: center;

      .title {
        max-width: 170px;
        color: rgba(134, 144, 156, 1);
        font-weight: 400;
        font-size: 12px;
        //styleName: CN/正文/12-Regular-小;
        font-family: PingFang SC;
        line-height: 20px;
        // overflow: hidden;
        white-space: nowrap;
        text-align: left;
        -0-text-overflow: ellipsis;
        text-overflow: ellipsis;
      }

      .line {
        width: 1px;
        height: 12px;
        border: 1px solid rgba(140, 149, 167, 1);
      }

      .buttom-blue {
        display: flex;
        gap: 4px;
        align-items: center;
        height: 22px;
        padding: 3px 8px;
        color: rgba(22, 100, 255, 1);
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        background: rgba(232, 244, 255, 1);
        border-radius: 2px;
      }

      .buttom-yellow {
        color: rgba(207, 117, 0, 1);
        background: rgba(255, 250, 232, 1);
      }

      .prefix {
        color: rgba(22, 100, 255, 1);
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 20px;
        text-align: left;
        cursor: pointer;
      }
    }
  }
}

.identifying {
  gap: 24px;
  width: 1200px;
  height: 752px;
  margin-top: 10px;
  padding: 0 0 30px 0;
  background: rgba(255, 255, 255, 0.8);
}

.service {
  gap: 10px;
  width: 1200px;
  height: 74px;
  padding: 20px 10px 20px 24px;
  color: rgba(29, 33, 41, 1);
  font-weight: 500;
  font-size: 24px;
  font-family: PingFang SC;
  line-height: 32px;
  text-align: left;
  background: linear-gradient(
    255.14deg,
    rgba(217, 223, 238, 0.48) 6.99%,
    #fff 57.76%
  );
  border: 1px 0 0 0;
  border: 1px solid rgba(232, 233, 234, 1);
}

.idhub {
  width: 1152px;
  height: 300px;
  margin: 24px auto 0;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(229, 232, 239, 1);
  border-radius: 4px;

  .idhub-title {
    color: rgba(29, 33, 41, 1);
    font-weight: 500;
    font-size: 24px;
    font-family: PingFang SC;
    line-height: 32px;
    text-align: left;
  }

  .synopsis {
    width: 904px;
    margin: 24px 0;
    color: rgba(78, 89, 105, 1);
    font-weight: 400;
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 22px;
    text-align: left;
  }

  .idhub-steps {
    display: flex;

    .step {
      display: flex;
      gap: 8px;

      .item-left {
        display: flex;
        align-items: center;
        height: 24px;

        .left-line {
          gap: 0;
          width: 80px;
          height: 1px;
          margin-left: 16px;
          background: rgba(78, 89, 105, 1);
        }

        .left-line-01 {
          margin-left: 16px;
        }

        .left-line-02 {
          margin-left: 7px;
        }

        .left-line-03 {
          margin-left: 21px;
        }

        .left-icon {
          gap: 0;
          width: 28px;
          height: 28px;
        }
      }

      .item-content {
        position: relative;
        width: 100%;

        .item-position {
          position: absolute;
          top: 30px;
        }

        .enterprise-prefix {
          color: rgba(29, 33, 41, 1);
          font-weight: 500;
          font-size: 16px;
          //styleName: CN/标题/16-Medium-小;
          font-family: PingFang SC;
          line-height: 24px;
          text-align: left;
        }

        .introduce {
          width: 188px;
          margin-top: 10px;
          color: rgba(134, 144, 156, 1);
          font-weight: 400;
          font-size: 14px;
          font-family: PingFang SC;
          line-height: 20px;
          text-align: left;
        }

        .introduce-01 {
          width: 140px;
        }

        .introduce-02 {
          width: 168px;
        }

        .introduce-03 {
          width: 126px;
        }

        .introduce-04 {
          width: 152px;
        }

        .buttom-body {
          margin-top: 10px;
        }
      }
    }
  }
}

.idhub-bg-01 {
  background-image: url(@/assets/images/overview/overview-01.png);
  background-size: 100% 100%;
}

.idhub-bg-02 {
  background-image: url(@/assets/images/overview/overview-02.png);
  background-size: 100% 100%;
}

.idhub-bg-03 {
  background-image: url(@/assets/images/overview/overview-03.png);
  background-size: 100% 100%;
}

.idhub-width {
  width: 850px;
  margin: 0;

  .synopsis-width {
    width: 806px;
  }
}

.introduce-width {
  width: 224px !important;
}

.tool {
  display: flex;
  justify-content: space-between;
  width: 1200px;
  margin-top: 26px;
}

.manual {
  position: relative;
  gap: 10px;
  width: 320px;
  height: 300px;
  padding: 16px 24px;
  background: linear-gradient(127.99deg, #fff 34.51%, #e2eeff 100%);
  border: 1px solid rgba(229, 232, 239, 1);
  border-radius: 4px;

  .manual-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      color: rgba(78, 89, 105, 1);
      font-weight: 600;
      font-size: 20px;
      font-family: PingFang SC;
      line-height: 28px;
      text-align: left;
    }
  }

  .manual-ul {
    > ul > li {
      margin-top: 16px;
      margin-left: 20px;
      color: rgba(34, 51, 84, 1);
      font-weight: 400;
      font-size: 14px;
      font-family: PingFang SC;
      line-height: 20px;
      text-align: left;
      list-style-type: disc;
      cursor: pointer;
    }

    > ul > li::marker {
      color: rgba(217, 217, 217, 1);
    }
  }

  .manual-img {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 166px;
    height: 235px;
  }
}
</style>
