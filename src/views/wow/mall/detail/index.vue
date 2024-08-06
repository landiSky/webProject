<template>
  <div class="wrap">
    <div
      class="productIntro"
      :class="{ decorationIntroCls: versionType === 1 }"
    >
      <div
        class="baseInfo"
        :class="prodDetail.versionType ? 'new-baseInfo' : ''"
      >
        <template v-if="!prodDetail.versionType">
          <div class="left">
            <div class="bigImg">
              <img
                :src="
                  bigImgPath
                    ? `/server/web/file/download?name=${bigImgPath}&productId=${prodDetail.id}`
                    : defaultImg
                "
              />
            </div>

            <ul class="imgList">
              <li
                v-for="(imgPath, index) in previewImgList"
                :key="index"
                @mouseenter="bigImgPath = imgPath"
              >
                <img
                  :src="`/server/web/file/download?name=${imgPath}&productId=${prodDetail.id}`"
                  alt=""
                  :class="{ active: bigImgPath === imgPath }"
                />
              </li>
            </ul>
          </div>
          <div class="right">
            <div class="header">
              <span class="productName">{{ prodDetail.name }}</span>
              <!-- <span
              v-for="(item, index) in prodDetail?.tagMap"
              :key="index"
              class="tag"
              :class="{ 'tag-left': index === 0 }"
            > -->
              <t-typography-paragraph
                v-for="(item, index) in prodDetail?.tagMap"
                :key="index"
                class="tag"
                :class="{ 'tag-left': index === 0 }"
                :ellipsis="{
                  rows: 1,
                  showTooltip: true,
                }"
              >
                {{ item.tagName }}
              </t-typography-paragraph>
              <!-- </span> -->
            </div>
            <div class="description">
              <t-typography-paragraph
                style="margin-bottom: 0"
                :ellipsis="{
                  rows: 7,
                  showTooltip: {
                    type: 'tooltip',
                    props: {
                      isBright: true,
                    },
                  },
                }"
              >
                {{ prodDetail.introduction }}
              </t-typography-paragraph>
            </div>
            <div class="price">
              <span>产品价格:</span>
              <span v-if="computing">计算中...</span>
              <span v-else-if="prodDetail.saleType === SaleType.CONSULT">
                价格面议
              </span>
              <span v-else-if="prodDetail.saleType === SaleType.FREE">
                免费
              </span>
              <span v-else>¥ {{ price || '-' }}</span>
            </div>

            <div class="custom">
              <span class="label">版本:</span>
              <span>
                <template v-if="deliveryList?.length">
                  <t-radio-group
                    v-model="priceParams.deliveryVersionId"
                    type="button"
                    @change="onVersionChange"
                  >
                    <t-radio
                      v-for="version in deliveryList"
                      :key="version.id"
                      :value="version.id"
                      >{{ version.name }}
                    </t-radio>
                  </t-radio-group>
                </template>
                <span v-else>-</span>
              </span>
            </div>
            <div class="custom">
              <span class="label">交付方式:</span>
              <span>{{ DeliverTypeDesc[prodDetail.deliveryType] ?? '-' }}</span>
            </div>
            <div
              v-if="
                prodDetail.saleType !== SaleType.CONSULT &&
                prodDetail.saleType !== SaleType.FREE
              "
              class="custom"
            >
              <span class="label">账号数:</span>
              <span v-if="prodDetail.saleType === SaleType.PACKAGE">
                <t-radio-group
                  v-model="priceParams.accountId"
                  type="button"
                  @change="onRadioChange"
                >
                  <t-radio
                    v-for="account in selectVersion.accountNumList"
                    :key="account.id"
                    :value="account.id"
                  >
                    {{ account.accountNum }}个账号
                  </t-radio>
                </t-radio-group>
              </span>
              <span v-else>不限</span>
            </div>
            <div
              v-if="
                prodDetail.saleType !== SaleType.CONSULT &&
                prodDetail.saleType !== SaleType.FREE
              "
              class="custom"
            >
              <span class="label">选择时长:</span>
              <span v-if="prodDetail.saleType === SaleType.PACKAGE">
                <t-radio-group
                  v-model="priceParams.durationId"
                  type="button"
                  @change="onRadioChange"
                >
                  <t-radio
                    v-for="durationItem in selectVersion.durationList"
                    :key="durationItem.id"
                    :value="durationItem.id"
                  >
                    <span v-if="durationItem.duration > 0">
                      {{ durationItem.duration }}个月
                    </span>
                    <span v-else>不限</span>
                  </t-radio>
                </t-radio-group>
              </span>
              <span v-else>不限</span>
            </div>
            <t-button
              v-if="Number(selectVersion.isTry) === 1"
              type="outline"
              size="large"
              style="width: 140px; margin-right: 12px"
              @click="clickProbation"
              >0元试用</t-button
            >
            <t-button
              type="primary"
              size="large"
              style="width: 296px"
              :disabled="isPreview"
              @click="clickAddCart"
              >立即购买
            </t-button>
          </div>
        </template>
        <div v-else class="right">
          <div class="header">
            <span class="productName">
              {{ prodDetail.name }}
            </span>
            <t-typography-paragraph
              v-for="(item, index) in prodDetail?.tagMap"
              :key="index"
              class="tag"
              :class="{ 'tag-left': index === 0 }"
              :ellipsis="{
                rows: 1,
                showTooltip: true,
              }"
            >
              {{ item.tagName }}
            </t-typography-paragraph>
          </div>
          <div class="description">
            <t-typography-paragraph
              style="margin-bottom: 0"
              :ellipsis="{
                rows: 3,
                showTooltip: {
                  type: 'tooltip',
                  props: {
                    isBright: true,
                  },
                },
              }"
            >
              {{ prodDetail.introduction }}
            </t-typography-paragraph>
          </div>
          <div class="price custom">
            <span class="label">产品价格</span>
            <span v-if="computing">计算中...</span>
            <span v-else-if="prodDetail.saleType === SaleType.CONSULT">
              价格面议
            </span>
            <span v-else-if="prodDetail.saleType === SaleType.FREE">
              免费
            </span>
            <span v-else>¥ {{ price || '-' }}</span>
          </div>

          <div class="custom">
            <span class="label">版本</span>
            <span>
              <template v-if="deliveryList?.length">
                <t-radio-group
                  v-model="priceParams.deliveryVersionId"
                  class="self-radio-group"
                  @change="onVersionChange"
                >
                  <t-radio
                    v-for="version in deliveryList"
                    :key="version.id"
                    :value="version.id"
                    class="self-radio-item"
                  >
                    <template #radio>
                      <div>
                        {{ version.name }}
                      </div>
                    </template>
                  </t-radio>
                </t-radio-group>
              </template>
              <span v-else>-</span>
            </span>
          </div>
          <div class="custom">
            <span class="label">交付方式</span>
            <span>{{ DeliverTypeDesc[prodDetail.deliveryType] ?? '-' }}</span>
          </div>
          <div
            v-if="
              prodDetail.saleType !== SaleType.CONSULT &&
              prodDetail.saleType !== SaleType.FREE
            "
            class="custom"
          >
            <span class="label">账号数</span>
            <span v-if="prodDetail.saleType === SaleType.PACKAGE">
              <t-radio-group
                v-model="priceParams.accountId"
                class="self-radio-group"
                @change="onRadioChange"
              >
                <t-radio
                  v-for="account in selectVersion.accountNumList"
                  :key="account.id"
                  :value="account.id"
                  class="self-radio-item"
                >
                  <template #radio>
                    <div class="self-radio-checked">
                      {{ account.accountNum }}个账号
                    </div>
                  </template>
                </t-radio>
              </t-radio-group>
            </span>
            <span v-else>-</span>
          </div>
          <div
            v-if="
              prodDetail.saleType !== SaleType.CONSULT &&
              prodDetail.saleType !== SaleType.FREE
            "
            class="custom"
          >
            <span class="label">选择时长</span>
            <span v-if="prodDetail.saleType === SaleType.PACKAGE">
              <t-radio-group
                v-model="priceParams.durationId"
                class="self-radio-group"
                @change="onRadioChange"
              >
                <t-radio
                  v-for="durationItem in selectVersion.durationList"
                  :key="durationItem.id"
                  :value="durationItem.id"
                  class="self-radio-item"
                >
                  <template #radio>
                    <span
                      v-if="durationItem.duration > 0"
                      class="self-radio-checked"
                    >
                      {{ durationItem.duration }}个月
                    </span>
                    <span v-else>不限</span>
                  </template>
                </t-radio>
              </t-radio-group>
            </span>
            <span v-else>不限</span>
          </div>
          <t-button
            v-if="Number(selectVersion.isTry) === 1"
            type="outline"
            size="large"
            style="width: 140px; margin-right: 12px"
            @click="clickProbation"
            >0元试用</t-button
          >
          <t-button
            type="primary"
            size="large"
            style="width: 270px"
            status="danger"
            :disabled="isPreview"
            @click="clickAddCart"
            >立即购买
          </t-button>
        </div>
      </div>
      <div v-if="versionType === 0" class="intro">
        <div ref="introParentRef" class="template">
          <template v-if="templateList.length">
            <div class="nav" :class="{ fixed: fixedTop }">
              <span v-for="(item, index) in templateList" :key="index">
                <span
                  :class="{ active: activeNavIndex === index }"
                  @click="clickNav(index)"
                >
                  {{ item.moduleName }}
                </span>
              </span>
            </div>
            <div
              v-for="(item, index) in templateList"
              :id="`template${index}`"
              :key="index"
              :ref="setNavRef"
            >
              <component
                :is="forCompList[item.type - 1]"
                :template-data="item"
                :bg-index="index"
                :product-id="prodDetail.id"
              ></component>
            </div>
          </template>
          <t-empty v-else description="暂无配置详情信息">
            <template #image>
              <iconpark-icon name="zanwushuju" size="100px"></iconpark-icon>
            </template>
          </t-empty>
        </div>
        <div v-if="!prodDetail.versionType" class="consult">
          <span class="title">服务商资质</span>
          <span class="header">服务商名称：{{ prodDetail?.companyName }}</span>
          <t-button type="primary" size="large" @click="buyConsult"
            >购买咨询</t-button
          >
        </div>
      </div>
      <div v-else class="newIntro">
        <DecorationBox :components-list="templateList"></DecorationBox>
      </div>

      <!-- 产品评价 -->
      <div class="evaluate" :class="{ decorationCls: versionType === 1 }">
        <div class="top">产品评价（{{ evaluateDatail?.total ?? 0 }}）</div>
        <div class="body">
          <div class="score">
            <div class="score-title">综合评分</div>
            <div class="score-num">{{ evaluateDatail?.avgEvaluate }}</div>
            <div class="score-count">
              <t-rate
                v-model="evaluateDatail.avgEvaluate"
                :count="5"
                allow-half
                readonly
              />
            </div>
          </div>
          <div class="evaluate-list">
            <div class="top-list">
              <div
                :class="appraiseIndex === 3 ? 'appraise' : ''"
                @click="appraiseClick(3)"
                >好评 ({{ evaluateDatail?.totalH ?? 0 }})
              </div>
              <div
                :class="appraiseIndex === 2 ? 'appraise' : ''"
                @click="appraiseClick(2)"
                >中评 ({{ evaluateDatail?.totalZ ?? 0 }})</div
              >
              <div
                :class="appraiseIndex === 1 ? 'appraise' : ''"
                @click="appraiseClick(1)"
                >差评 ({{ evaluateDatail?.totalC ?? 0 }})</div
              >
            </div>
            <div class="comment">
              <div
                v-for="(item, index) in evaluateDatail?.records"
                :key="index"
                class="comment-list"
              >
                <t-comment class="author-text" :author="item?.nickname || '-'">
                  <template #avatar>
                    <t-image
                      width="52"
                      style="border-radius: 50%"
                      :src="item?.avatar ?? avatar"
                    />
                  </template>
                  <template #content>
                    <div>
                      <div class="count">
                        <t-rate
                          v-model="item.averageStar"
                          :default-value="5"
                          :count="5"
                          allow-half
                          readonly
                        />
                      </div>
                      <div class="textarea">
                        {{ item?.content ?? '-' }}
                      </div>
                      <div class="time">{{ item?.createTime ?? '-' }}</div>
                    </div>
                  </template>
                </t-comment>
              </div>
              <div v-if="!evaluateDatail?.records" class="nothing-application">
                <div class="nothing-application-img"></div>
                <div>暂无评价</div>
              </div>
            </div>
            <div class="pagination">
              <t-pagination
                :total="pagination.total"
                :page-size="pagination.pageSize"
                :current="pagination.current"
                show-total
                hide-on-single-page
                @change="paginationchange"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="prodDetail.versionType"
        :class="prodDetail.versionType ? 'new-consult' : ''"
      >
        <span class="title">服务商资质</span>
        <span class="header">服务商名称：{{ prodDetail?.companyName }}</span>
        <span class="online-consult" @click="buyConsult">
          <iconpark-icon size="18" name="message" class="icon-message" />
          在线咨询</span
        >
      </div>
    </div>
  </div>
  <AuthMemberModal
    v-if="authModalVisible"
    :product-id="prodDetail.id"
    :delivery-set-id="selectVersion.id"
    @cancel="onAuthCancel"
    @confirm="onAuthConfirm"
  ></AuthMemberModal>
  <WowFooter></WowFooter>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, h, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Message, Modal } from '@tele-design/web-vue';

import {
  apiProductDetail,
  apiComputePrice,
  apiBypageList,
} from '@/api/wow/mall';
import { SaleType, AccountType, DeliverTypeDesc } from '@/enums/common';
import { useUserStore } from '@/store/modules/user';

import { useOrderStore } from '@/store/modules/order';
import WowFooter from '@/views/wow/components/wowFooter/index.vue';
import defaultImg from '@/assets/images/wow/mall/default_product_logo.png';
import { apiDataPoint } from '@/api/data-point';
import { copyToClipboard } from '@/utils/index';
import copy from '@/assets/images/copy.png';
import avatar from '@/assets/images/avatar.png';
import DecorationBox from '@/views/decoration/decorationTools/pageContainer.vue';
import Template1 from './layout/template1.vue';
import Template2 from './layout/template2.vue';
import Template3 from './layout/template3.vue';
import Template4 from './layout/template4.vue';
import Template5 from './layout/template5.vue';
import Template6 from './layout/template6.vue';

import AuthMemberModal from './authMember.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const orderStore = useOrderStore();
const { userInfo } = userStore;
const authModalVisible = ref(false);
// 是否装修
const versionType = ref(0);
const priceParams = ref<Record<string, any>>({
  deliveryVersionId: null,
  accountId: null,
  durationId: null,
});
const previewImgList = ref<string[]>([]);
const bigImgPath = ref();
const versionObj: Record<string, any> = {}; // {【versionId】: {}}, 目的是 版本radio变更后，能够获取到当前选择的 version data
const computing = ref(false);
const price = ref();
const templateList = ref<Record<string, any>[]>([]);
const navRef = ref<any[]>([]); // ref<any[]>([]);
const forCompList = [
  Template1,
  Template2,
  Template3,
  Template4,
  Template5,
  Template6,
];

const prodDetail = ref<Record<string, any>>({}); // 商品详情数据
const evaluateDatail = ref<Record<string, any>>({});
const deliveryList = ref<Record<string, any>[]>([]);
const selectVersion = ref<Record<string, any>>({});
const isPreview = ref(false);
const introParentRef = ref();
const fixedTop = ref(false);
const activeNavIndex = ref(0);
const appraiseIndex = ref(3);
const pagination = reactive<{
  current: number; // 当前页码
  pageSize: number;
  total: number;
}>({
  current: 1,
  pageSize: 10,
  total: 0,
});

const setNavRef = (el: any) => {
  if (el) {
    navRef.value.push(el);
  }
};
const onAuthCancel = () => {
  authModalVisible.value = false;
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

  authModalVisible.value = false;

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

// 0元试用
const clickProbation = () => {
  Modal.info({
    title: '试用说明',
    content: () => {
      const onClick = () => {
        const text = `试用账号： ${selectVersion.value.tryAccount}  试用密码： ${selectVersion.value.tryPwd}`;
        // navigator.clipboard.writeText(text).then(() => {
        //   Message.success('复制成功');
        // });
        copyToClipboard(text);
        Message.success('复制成功');
      };
      return h('div', { class: 'info-modal-content' }, [
        h(
          'div',
          { style: 'margin-left: 12px;' },
          '试用版本数据随时可能会被清除，请不要作为生产使用'
        ),
        h('div', { style: 'display: flex;margin-top: 24px;' }, [
          h('div', { style: 'display: flex;margin-left: 12px;' }, [
            h('div', '试用账号:'),
            h(
              'div',
              { style: 'margin-left: 12px;' },
              selectVersion.value.tryAccount
            ),
          ]),
          h(
            'div',
            { style: 'display: flex;margin-left: 12px;align-items: center;' },
            [
              h('div', '试用密码:'),
              h(
                'div',
                { style: 'margin-left: 12px;' },
                selectVersion.value.tryPwd
              ),
              h('div', {
                style: `margin-left: 12px;width: 12px;height: 12px;background: url(${copy});background-size: 100% 100%;cursor: pointer;`,
                onClick,
              }),
            ]
          ),
        ]),
      ]);
    },
    titleAlign: 'start',
    hideCancel: false,
    cancelText: '取消',
    okText: '进入试用',
    onOk: () => {
      window.open(selectVersion.value.tryUrl);
      // userStore.jumpToLogin();
    },
  });
};

const clickAddCart = (): void => {
  const { userInfo, userInfoByCompany } = userStore;
  // TODO w: 立即购买打点
  apiDataPoint(route.params.id as string, null, userInfo?.id, 4, 4).then(() => {
    console.log('立即购买打点', route.params.id);
  });

  if (!userInfo?.id) {
    console.log(route.fullPath, 'route.fullPath');
    sessionStorage.setItem('mallDetailPath', route.fullPath);
    userStore.jumpToLogin('wowMallDetail'); // 目的是从这里跳到登录页的，登录后再回来
    // router.push({
    //   path: '/login',
    //   query: { id, title: appName },
    // });
    return;
  }

  if (userInfoByCompany?.companyId === prodDetail.value.companyId) {
    Message.warning('无法购买本企业商品!');
    return;
  }

  if (userInfoByCompany?.primary === AccountType.MAIN) {
    // 标识应用需要判断是否做过企业节点认证
    authModalVisible.value = true;

    return;
  }

  if (userInfoByCompany?.primary === AccountType.MEMBER) {
    Modal.warning({
      title: '请联系企业管理员购买开通服务',
      titleAlign: 'start',
      okText: '好的',
      hideCancel: true,
      content: '',
    });

    return;
  }

  if (userInfoByCompany?.primary === AccountType.UNAUTH) {
    Modal.info({
      title: '使用提醒',
      content: '需申请企业认证后使用，请先进行企业认证。',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '暂不认证',
      okText: '去认证',
      onOk: () => {
        router.push({
          path: '/buyer/index',
        });
      },
    });
  }
};

const getPrice = () => {
  if (
    prodDetail.value.saleType === SaleType.CONSULT ||
    prodDetail.value.saleType === SaleType.FREE
  ) {
    return;
  }
  computing.value = true;
  apiComputePrice({
    productId: prodDetail.value.id,
    ...priceParams.value,
  })
    .then((data) => {
      price.value = data;
    })
    .catch(() => {})
    .finally(() => {
      computing.value = false;
    });
};

const onVersionChange = (versionId: string) => {
  selectVersion.value = versionObj[versionId];
  const { id, accountNumList, durationList } = selectVersion.value;

  priceParams.value.deliveryVersionId = id;
  priceParams.value.accountId = accountNumList?.[0].id;
  priceParams.value.durationId = durationList?.[0].id;
  getPrice();
};
const onRadioChange = () => {
  getPrice();
};

const clickNav = (index: number) => {
  activeNavIndex.value = index;
  navRef.value[index].scrollIntoView(true);

  // nav 吸顶后会占用 46 的高度，如果不加，会覆盖一部分 title
  const topNum = document.querySelector('#scrollMain')?.scrollTop || 0;
  document.querySelector('#scrollMain')?.scrollTo({
    top: topNum - 92,
  });
};

const buyConsult = () => {
  // TODO w: 购买咨询打点
  apiDataPoint(route.params.id as string, null, userInfo?.id, 4, 5).then(() => {
    console.log('购买咨询打点', route.params.id);
  });
  window.open('https://www.wjx.top/vm/rZCiupC.aspx#', '_blank');
};

const onIntroScroll = () => {
  const { top } = introParentRef.value?.getBoundingClientRect() || {};

  fixedTop.value = Boolean(top < 70);
};

const evaluateTotal = (value: any, data: any) => {
  if (value === 1) {
    return data?.totalC;
  }
  if (value === 2) {
    return data?.totalZ;
  }
  if (value === 3) {
    return data?.totalH;
  }
  return data?.totalH;
};
const BypageList = () => {
  const params = {
    productId: route.params.id, // 商品ID
    starType: appraiseIndex.value, // 类型 1差评 2 中评 3 好评
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
  };
  apiBypageList(params)
    .then((data) => {
      evaluateDatail.value = {
        ...data,
        avgEvaluate: data.avgEvaluate ?? 5,
      };
      pagination.total = evaluateTotal(appraiseIndex.value, data);
    })
    .catch(() => {});
};

const appraiseClick = (value: number) => {
  appraiseIndex.value = value;
  pagination.current = 1;
  BypageList();
};

const paginationchange = (current: number) => {
  pagination.current = current;
  BypageList();
};

// watch(
//   () => versionType.value,
//   () => {}
// );
// const factor = computed(() => {
//   return versionType.value === 0?
// });

onMounted(() => {
  // TODO w: 商品详情打点
  apiDataPoint(route.params.id as string, null, userInfo?.id, 4, 3).then(() => {
    console.log('商品详情打点', route.params.id);
  });
  isPreview.value = route.name === 'wowMallPreview'; // 预览模式不允许点击【立即购买】
  apiProductDetail({ id: route.params.id })
    .then((data) => {
      const tagMap = data.tagMap.filter(
        // (tag: any) => String(tag.id) !== '2'
        (tag: any) => String(tag.tagName) !== '公共服务'
      );
      prodDetail.value = { ...data, tagMap };
      deliveryList.value = data.productDeliverySetList || [];
      previewImgList.value = data.detailImg.split(',');
      bigImgPath.value = previewImgList.value?.[0];
      versionType.value = data.versionType;
      if (data.draftStatus === 0) {
        // 装修组件的草稿状态
        if (!data.draftDetail) return;
        templateList.value = JSON.parse(data.draftDetail);
      } else if (data.draftStatus === 1) {
        // 装修组件的发布状态
        if (!data.detail) return;
        templateList.value = JSON.parse(data.detail);
      } else if (data.draftStatus === null) {
        // 老版本展示信息
        if (!data.detail) return;
        templateList.value = JSON.parse(data.detail);
      }

      // prodDetail.value.versionType = 1; // 模拟？？？

      const { saleType } = data;

      if (Array.isArray(deliveryList.value) && deliveryList.value.length) {
        if (
          [SaleType.ONEOFF, SaleType.PACKAGE, SaleType.FREE].includes(saleType)
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

  window.addEventListener('scroll', onIntroScroll, true);

  // 商品评价
  BypageList();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onIntroScroll);
});
</script>

<style lang="less" scoped>
.wrap {
  display: flex;
  justify-content: center;
  font-weight: 400;
  font-size: 14px;

  .productIntro {
    width: 1176px;
    margin: 32px 0 132px 0;

    .baseInfo {
      display: flex;
      align-items: start;
      width: 100%;
      margin-bottom: 16px;
      padding: 24px;
      background-color: #fff;
      border-radius: 4px;

      .left {
        margin-right: 32px;

        .bigImg {
          img {
            width: 450px;
            height: 450px;
          }
        }

        .imgList {
          display: flex;
          margin-top: 14px;

          img {
            width: 68px;
            height: 68px;
            margin-right: 8px;
            border-radius: 4px;

            &:hover,
            &.active {
              box-shadow: 0 0 0 2px #1664ff;
            }
          }
        }
      }

      .right {
        flex: 1;

        .header {
          display: flex;
          align-items: center;
          // margin-top: 56px;
          // margin-bottom: 16px;
          color: #1d2129;
          font-weight: 500;
          font-size: 24px;
          line-height: 32px;

          .tag {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 72px;
            height: 24px;
            margin-left: 8px;
            padding: 1px 8px;
            color: rgba(22, 100, 255, 1);
            font-weight: 400;
            font-size: 12px;
            font-family: PingFang SC;
            background: rgba(232, 244, 255, 1);
            border-radius: 2px;
          }

          .tag-left {
            margin-left: 16px;
          }
        }

        .description {
          // width: 465px;
          // margin-bottom: 36px;
          margin-bottom: 42px;
          color: #1d2129;
          line-height: 22px; /* 157.143% */
          word-break: break-all;
        }
        // 之前的样式不要改
        .price {
          margin-bottom: 20px;
          padding: 12px;
          line-height: 22px;
          background: #ffece8;
          border-radius: 4px;

          span:first-child {
            margin-right: 24px;
            color: #4e5969;
          }

          span:last-child {
            color: #e63f3f;
            font-weight: 700;
            font-size: 20px;
          }
        }

        .custom {
          margin-bottom: 12px;
          padding: 4px 12px;

          &:last-of-type {
            margin-bottom: 42px;
          }

          .label {
            // font-size: 14px;
            // font-weight: 400;
            display: inline-block;
            width: 60px;
            margin-right: 16px;
          }

          .self-radio-group {
            background: none;

            .self-radio-item {
              min-width: 60px;
              margin-right: 30px;
              padding: 10px;
              font-weight: 500;
              font-size: 16px;
              text-align: center;
              background: #fff;
              border-radius: 4px;

              > div {
                margin: 0 auto;
              }

              &.tele-radio-checked {
                color: #1d2129;
                border: 1px solid #1664ff;

                &::after {
                  position: absolute;
                  right: -1px;
                  bottom: 0;
                  display: inline-block;
                  width: 13px;
                  height: 13px;
                  background: url('../../../../assets/images/decoration/radio-checked.jpg')
                    no-repeat;
                  background-size: cover;
                  border-bottom-right-radius: 4px;
                  content: '';
                }
              }
            }
          }

          :deep(.tele-radio-button-content) {
            // padding: 15px 35px;
            // font-size: 18px;
            color: #1664ff;
            font-weight: 500;
            font-size: 12px;
            line-height: 20px; /* 166.667% */
          }
        }
      }

      &.new-baseInfo {
        height: 600px;
        background: url('../../../../assets/images/wow/mall/mall1-bg.jpg')
          no-repeat;
        background-size: 100%;

        .right {
          flex: none;
          margin-left: 126px;

          .header {
            margin-top: 56px;
            margin-bottom: 16px;
          }

          .description {
            width: 465px;
            margin-bottom: 36px;
          }

          .price {
            background: transparent;
          }

          .custom {
            font-weight: 500;
            font-size: 16px;

            &.price {
              margin-bottom: 20px;
              line-height: 20px;
              border-radius: 4px;

              span:first-child {
                margin-right: 24px;
                color: #4e5969;
              }

              span:last-child {
                color: #e63f3f;
                font-weight: 700;
                font-size: 20px;
              }
            }

            .label {
              width: 124px;
              font-weight: 400;
              font-size: 14px;
            }
          }
        }
      }
    }

    .intro {
      display: flex;
      justify-content: start;
      // margin-bottom: 132px;
      .template {
        flex: 1;
        width: 900px;
        margin-right: 16px;

        .nav {
          display: flex;
          align-content: center;
          padding: 0 24px;
          background-color: #fff;
          box-shadow: 0 -1px 0 0 #e5e8ef inset;
          // border-bottom: 1px solid #efefef;
          &.fixed {
            position: fixed;
            top: 64px;
            z-index: 99;
            width: 900px;
          }

          // :deep(.tele-link)
          > span {
            display: inline-block;
            flex: 1;
            margin: 12px auto;
            color: #4e5969;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px; /* 157.143% */
            text-align: center;
            cursor: pointer;

            .active {
              position: relative;
              color: #1664ff;
              font-weight: 500;

              &::after {
                position: absolute;
                top: 31px;
                left: 0;
                width: 100%;
                border: 1px solid #1664ff;
                content: '';
              }
            }
          }
        }
      }

      .consult {
        display: flex;
        flex-direction: column;
        width: 260px;
        height: 178px;
        padding: 24px;
        color: #000;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px; /* 157.143% */
        background-color: #fff;
        border-radius: 4px;

        .title {
          margin-bottom: 12px;
          font-weight: 500;
        }

        .header {
          margin-bottom: 12px;
        }

        button {
          width: 208px;
        }
      }
    }

    .newIntro {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 1440px;
    }

    .evaluate {
      width: 900px;
      padding: 20px 24px;
      background: rgba(255, 255, 255, 1);
      border-top: solid rgba(229, 232, 239, 1) 1px;
      border-radius: 4px 0 0 0;

      .top {
        display: flex;
        align-content: center;
        justify-content: center;
        color: rgba(29, 33, 41, 1);
        font-weight: 500;
        font-size: 20px;
        font-family: PingFang SC;
        line-height: 28px;
        text-align: center;
      }

      .body {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;

        .score {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 168px;
          padding: 40px 32px;
          font-weight: 500;
          font-family: PingFang SC;
          line-height: 22px;
          border: 1px solid rgba(229, 232, 239, 1);

          .score-title {
            color: rgba(29, 33, 41, 1);
            font-size: 14px;
          }

          .score-num {
            margin: 12px 0;
            color: rgba(255, 20, 20, 1);
            font-size: 30px;
          }
        }

        .evaluate-list {
          margin-left: 12px;

          .top-list {
            display: flex;
            gap: 40px;
            align-items: center;
            width: 627px;
            height: 44px;
            padding: 0 24px 0 24px;
            background: rgba(242, 243, 248, 1);
            box-shadow: 0 -1px 0 0 rgba(229, 232, 239, 1) inset;

            div {
              display: flex;
              align-items: center;
              height: 100%;
              color: rgba(78, 89, 105, 1);
              font-weight: 400;
              font-size: 14px;
              font-family: PingFang SC;
              cursor: pointer;

              &:hover {
                color: rgba(22, 100, 255, 1);
                border-bottom: solid rgba(22, 100, 255, 1) 1px;
              }
            }

            .appraise {
              color: rgba(22, 100, 255, 1);
              border-bottom: solid rgba(22, 100, 255, 1) 1px;
            }
          }

          .comment {
            .comment-list {
              margin-top: 16px;
              padding-bottom: 16px;
              font-size: 14px;
              font-family: PingFang SC;
              line-height: 22px;
              border-bottom: 1px solid rgba(229, 232, 239, 1);

              .author-text {
                word-break: break-all;
              }

              .count {
                margin-top: 4px;
              }

              .textarea {
                margin-top: 12px;
                color: rgba(78, 89, 105, 1);
                font-weight: 400;
                word-break: break-all;
              }

              .time {
                margin-top: 12px;
                color: rgba(134, 144, 156, 1);
                font-weight: 500;
              }
            }

            .nothing-application {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 425px;
            }

            .nothing-application-img {
              width: 120px;
              height: 120px;
              background: url(@/assets/images/home/empty.png) no-repeat;
              background-size: 100% 100%;
            }
          }

          .pagination {
            display: flex;
            justify-content: center;
            margin-top: 16px;
          }
        }
      }
    }

    .decorationCls {
      width: 1440px;

      .body {
        justify-content: center;

        .evaluate-list {
          .top-list {
            width: 1000px;
          }
        }
      }
    }

    .new-consult {
      position: fixed;
      top: 229px;
      right: 15px;
      z-index: 2;
      display: flex;
      flex-direction: column;
      width: 140px;
      // height: 196px;
      padding: 20px 18px;
      font-size: 12px;
      line-height: 20px;
      background: #fff;
      border-radius: 4px;

      > span {
        margin-bottom: 20px;
      }

      .title {
        color: #86909c;
      }

      .online-consult {
        display: flex;
        align-items: center;
        margin-bottom: 0;
        color: #86909c;
        cursor: pointer;

        .icon-message {
          margin-right: 4px;
        }
      }
    }
  }

  .decorationIntroCls {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
}

:deep(.tele-typography) {
  margin-bottom: 0;
}
</style>
