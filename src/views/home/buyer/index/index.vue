<template>
  <div class="cverbox">
    <!-- 买家中心概览 头部 -->
    <div class="headers">
      <div style="width: 1200px; margin: 0 auto">
        <!-- 用户信息 -->
        <div class="tops">
          <div class="imgs">
            <img :src="avatar" alt="" />
          </div>
          <div class="rights">
            <!-- style="float: left; width: 300px; margin-top: 16px" -->
            <!-- <p class="name">{{
              userInfoByCompany?.username || userInfo?.mobile
            }}</p> -->
            <t-typography-paragraph
              :ellipsis="{
                rows: 1,
                showTooltip: true,
              }"
              class="name"
              >{{ userInfoByCompany?.username || userInfo?.mobile }}
            </t-typography-paragraph>
            <div class="inofs">
              <!-- <div class="inofs" style="float: left; margin-top: 25px"> -->
              <div
                v-if="
                  userInfoByCompany.nodeStatus === NodeAuthStatus.AUTHED ||
                  userInfoByCompany.certificateStatus ===
                    CompanyAuthStatus.AUTHED
                "
                class="inofslist"
              >
                <div style="max-width: 750px">
                  <ellipsis
                    class="companyname"
                    :copy="false"
                    :value="userInfoByCompany.companyName || '暂未认证'"
                  >
                  </ellipsis>
                </div>

                <p>|</p
                ><p>{{
                  userInfoByCompany.companyId
                    ? AccountTypeDesc[userInfoByCompany.primary]
                    : '-'
                }}</p
                ><p>|</p>
                <div
                  v-if="userInfoByCompany?.entPrefixList?.length"
                  class="extPrefix"
                >
                  <span
                    v-for="(
                      item, index
                    ) in userInfoByCompany?.entPrefixList?.slice(0, 2)"
                    :key="index"
                  >
                    {{ item }}
                    <span
                      v-if="
                        userInfoByCompany?.entPrefixList?.length > 1 &&
                        index === 0
                      "
                      >、</span
                    >
                  </span>
                  <!-- <t-tooltip
                    v-if="entPrefixListSuffix?.length"
                    :content="entPrefixListSuffix.join(',')"
                  >
                    <t-link
                      >更多前缀 ({{ entPrefixListSuffix?.length }})</t-link
                    >
                  </t-tooltip> -->

                  <t-popover
                    position="bottom"
                    :title="`全部前缀（${entPrefixListSuffix?.length}）`"
                  >
                    <t-link
                      >更多前缀 ({{ entPrefixListSuffix?.length }})</t-link
                    >
                    <template #content>
                      <div class="popover-bottom">
                        <div
                          v-for="(item, index) in entPrefixListSuffix"
                          :key="index"
                          >{{ item }}</div
                        >
                      </div>
                    </template>
                  </t-popover>
                  <span class="divider">|</span>
                </div>
              </div>

              <p
                class="statuslist"
                :class="[
                  userInfoByCompany.certificateStatus ===
                    CompanyAuthStatus.AUTHED ||
                  userInfoByCompany.nodeStatus === NodeAuthStatus.AUTHED
                    ? 'authenticated'
                    : 'notcertified',
                ]"
                >{{
                  userInfoByCompany.certificateStatus ===
                    CompanyAuthStatus.AUTHED ||
                  userInfoByCompany.nodeStatus === NodeAuthStatus.AUTHED
                    ? '已认证'
                    : '未认证'
                }}</p
              >
              <!-- <div
                v-if="userInfoByCompany.nodeStatus === NodeAuthStatus.AUTHED"
                class="suffix"
              >
                <p>|</p> <p>11111</p>
              </div> -->
            </div>
          </div>
        </div>
        <!-- 使用指导 v-if="userInfoByCompany.nodeStatus !== 1" -->
        <div
          v-if="userInfoByCompany.nodeStatus !== NodeAuthStatus.AUTHED"
          class="direction"
        >
          <div class="dirleft">
            <div class="titleleft">
              <h3 style="margin-bottom: 24px">使用引导 </h3>
              <div class="dirlist">
                <div>
                  <img :src="group1" alt="" />
                  <span class="dirlist-step">完成企业认证</span>
                  <div class="btns">
                    <p style="margin: 10px 0 12px"> 确定企业身份</p>
                    <t-button
                      v-if="
                        !userInfoByCompany.companyId ||
                        userInfoByCompany.certificateStatus ===
                          CompanyAuthStatus.UNAUTH
                      "
                      type="text"
                      class="dirlist-btn"
                      @click="authentication"
                      >去认证</t-button
                    >

                    <div v-else class="states">
                      <p
                        style="
                          width: 50px;
                          padding: 3px;
                          font-size: 12px;
                          text-align: center;
                        "
                        :class="stateClass[userInfoByCompany.certificateStatus]"
                        >{{
                          CompanyAuthStatusDESC[
                            userInfoByCompany.certificateStatus
                          ]
                        }}</p
                      >

                      <span
                        v-if="
                          [
                            CompanyAuthStatus.TO_CHECK,
                            CompanyAuthStatus.REJECT,
                          ].includes(userInfoByCompany.certificateStatus)
                        "
                        style="font-size: 12px"
                        ><t-button
                          type="text"
                          class="dirlist-btn"
                          @click="viewdetails"
                          >查看详情</t-button
                        ></span
                      >
                    </div>
                  </div>
                </div>
                <div>
                  <p class="ition"></p>
                  <img :src="group2" alt="" />
                  <span class="dirlist-step">企业成员管理</span>
                  <div class="btns">
                    <p style="margin: 10px 0 12px">
                      管理企业组织架构&成员权限</p
                    >
                    <t-button
                      type="text"
                      class="dirlist-btn"
                      @click="distributionrole()"
                    >
                      邀请成员/分配权限</t-button
                    >
                  </div></div
                >

                <div>
                  <p class="ition"></p>
                  <img :src="group3" alt="" />
                  <span class="dirlist-step">浏览开通应用</span>
                  <div class="btns">
                    <p style="margin: 10px 0 12px"> 搜索购买开通应用</p>
                    <t-button type="text" class="dirlist-btn" @click="tomall"
                      >去应用商城
                    </t-button>
                  </div>
                </div>
                <div>
                  <p class="ition"></p>
                  <img :src="group4" alt="" />
                  <span class="dirlist-step">企业中心使用应用</span>
                  <div class="btns">
                    <p style="margin: 10px 0"> 应用配置，使用应用</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 企业节点认证 -->
          <!-- <div class="firmright">
            <div class="firm">
              <div class="firm-title">企业节点认证</div
              ><span
                style="padding: 1px 8px; line-height: 22px"
                :class="nodeStateClass[userInfoByCompany.nodeStatus]"
                >{{ NodeAuthStatusDESC[userInfoByCompany.nodeStatus] }}</span
              >
            </div>
            <div
              class="fimelist"
              style="float: left; width: 90%; font-size: 12px"
            >
              <p style="margin: 12px 0 0 0">开通权益:</p>
              <ul style="margin-left: 10px">
                <li style="width: 100%">
                  <span></span><span style="float: left">免费使用热门应用</span>
                </li>
                <li style="width: 100%">
                  <span></span><span>自动完成企业认证</span>
                </li>
                <li> <span></span><span>使用标识服务</span> </li>
                <li> <span></span><span>使用标识解析类应用需先完成</span> </li>
                <li>
                  <span style="opacity: 0"></span><span>企业节点认证</span>
                </li>
              </ul>
              <div class="fimelistdata">
                <t-button
                  v-if="userInfoByCompany.nodeStatus === NodeAuthStatus.UNAUTH"
                  type="primary"
                  style="display: block; margin: 4px auto 0; padding: 5px 10px"
                  @click="nodeAuth"
                  >去认证</t-button
                >

                <div v-else class="states">
                  <p
                    style="
                      width: 50px;
                      margin: 4px auto 0;
                      padding: 5px;
                      text-align: center;
                    "
                    :class="nodeStateClass[userInfoByCompany.nodeStatus]"
                    >{{ NodeAuthStatusDESC[userInfoByCompany.nodeStatus] }}</p
                  >

                  <p
                    v-if="
                      [NodeAuthStatus.TO_CHECK, NodeAuthStatus.REJECT].includes(
                        userInfoByCompany.nodeStatus
                      )
                    "
                    style="width: 80px; margin: 0 auto; font-size: 12px"
                  >
                    <t-button type="text" @click="viewdetailsredf"
                      >查看详情</t-button
                    >
                  </p>
                </div>
              </div>
            </div>
          </div> -->
          <!-- 企业认证 -->
          <div class="firmright">
            <div class="firm">
              <div class="firm-title">企业认证</div
              ><span
                style="padding: 1px 8px; line-height: 22px"
                :class="stateClass[userInfoByCompany.certificateStatus]"
                >{{
                  CompanyAuthStatusDESC[userInfoByCompany.certificateStatus]
                }}</span
              >
            </div>
            <div
              class="fimelist"
              style="float: left; width: 90%; font-size: 12px"
            >
              <p style="margin: 12px 0 0 0">开通权益:</p>
              <ul style="margin-left: 10px">
                <li style="width: 100%">
                  <span></span><span style="float: left">使用限免应用</span>
                </li>
                <li style="width: 100%">
                  <span></span><span>免费上架应用，跨平台推广</span>
                </li>
                <li> <span></span><span>免费使用开发者能力</span> </li>
              </ul>
              <div class="fimelistdata">
                <t-button
                  v-if="
                    !userInfoByCompany.companyId ||
                    userInfoByCompany.certificateStatus ===
                      CompanyAuthStatus.UNAUTH
                  "
                  type="primary"
                  class="dirlist-btn"
                  style="display: block; margin: 4px auto 0; padding: 5px 10px"
                  @click="authentication"
                  >去认证</t-button
                >

                <div v-else class="states">
                  <p
                    style="
                      width: 50px;
                      margin: 4px auto 0;
                      padding: 5px;
                      text-align: center;
                    "
                    :class="stateClass[userInfoByCompany.certificateStatus]"
                  >
                    {{
                      CompanyAuthStatusDESC[userInfoByCompany.certificateStatus]
                    }}</p
                  >

                  <p
                    v-if="
                      [
                        CompanyAuthStatus.TO_CHECK,
                        CompanyAuthStatus.REJECT,
                      ].includes(userInfoByCompany.certificateStatus)
                    "
                    style="width: 80px; margin: 0 auto; font-size: 12px"
                  >
                    <t-button type="text" @click="viewdetails"
                      >查看详情</t-button
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 热门应用服务 -->
    <!-- <div class="content">
      <h3 style="margin: 20px 0">热门应用服务</h3>
      <div class="catimg">
        <t-carousel
          :style="{
            width: '100%',
            height: '240px',
          }"
        >
          <t-carousel-item v-for="(item, index) in images" :key="index">
            <div class="catimglist">
              <div
                v-for="(it, index) in item"
                :key="index"
                class="catimglistleft"
              >
                <div style="width: 30%">
                  <img :src="it" alt="" style="width: 100%; height: 100%" />
                </div>
                <div class="leftcont">
                  <div class="tophead"
                    ><p>企业统计台账</p
                    ><p style="color: #1664ff" @click="togo"> 前往 》</p></div
                  >
                  <div style="float: left; height: 70%; margin-top: 20px"
                    ><p
                      >支持多底层类型子链接入骨干节点，提供多种接入方式，为用户提供加入子链的通道共建子链。支持多底层类型子链接入骨干节点，提供多种接入方式，为用户提供加入子链的通道共建子链。</p
                    >
                  </div>
                  <div class="tophead"
                    ><p style="color: #1664ff" @click="configurationapp"
                      >配置应用</p
                    ><p style="color: #86909c" @click="instructionsuse">
                      使用说明下载</p
                    ></div
                  >
                </div>
              </div>
            </div>
          </t-carousel-item>
        </t-carousel>
      </div>
    </div> -->
    <!-- 已购应用 -->
    <div class="purchased">
      <t-tabs :active-key="tabsApplication" @tab-click="TabClickApplication">
        <t-tab-pane key="1">
          <template #title>
            <img
              class="application-img"
              :class="tabsApplication == 1 ? 'application-blue-img' : ''"
              src="./image/application_01.png"
              alt=""
            />
            已购应用
          </template>
        </t-tab-pane>
        <t-tab-pane key="2">
          <template #title>
            <img
              class="application-img"
              :class="tabsApplication == 2 ? 'application-blue-img' : ''"
              src="./image/application_02.png"
              alt=""
            />
            企业自建应用
          </template>
        </t-tab-pane>
      </t-tabs>
      <!-- <h3>已购应用</h3> -->
      <div class="Applysd">
        <div
          v-for="(item, index) in authDialogVisible"
          :key="index"
          class="purchasedlist"
        >
          <div style="width: 102px">
            <img
              :src="`/server/web/file/orderDownloadBySource?name=${item.productLogo}&source=${item.orderSource}&serverId=${item.productServerId}`"
              alt=""
              style="width: 102px; height: 102px"
            />
          </div>
          <div class="leftcont">
            <div class="tophead-to"
              ><span>{{ item.productName }}</span
              ><span
                style="color: #1664ff; cursor: pointer"
                class="to-container"
                @click="togo(item)"
              >
                前往 <span class="to-img"></span></span
            ></div>
            <div class="tophead-intro">
              <t-typography-paragraph
                style="width: 100%"
                :ellipsis="{
                  rows: 1,
                  showTooltip: true,
                }"
              >
                {{ item.introduction }}
              </t-typography-paragraph>
            </div>
            <div class="tophead"
              ><span
                v-if="userInfoByCompany.primary === AccountType?.MAIN"
                style="color: #1664ff; cursor: pointer"
                @click="configurationapp(item)"
                >配置应用</span
              ><span
                v-if="tabsApplication == 1"
                style="margin-left: auto; color: #86909c; cursor: pointer"
                @click="
                  instructionsuse(
                    item.useExplain,
                    item.orderSource,
                    item.productServerId
                  )
                "
              >
                使用说明</span
              ></div
            >
          </div>
          <!-- <div id="page" class="zhengshu-container-box">
            <div> 1111 </div> -->
          <!-- <div class="zhengshu-container-box-title"> 电子数据存证证书 </div>
            <div class="zhengshu-container-box-bid">
              存证BID：{detail?.bid || '--'}
            </div>
            <div class="zhengshu-container-box-center">
              <div>
                <span>存证所有人</span>
                <span>{detail?.belonger || '--'}</span>
              </div>
              <div>
                <span>存证创建者</span>
                <span>{detail?.creator || '--'}</span>
              </div>
              <div>
                <span>存证类型</span>
                <span
                  >{detail?.templateType === 1 ? '文件存证' : '数据存证'}</span
                >
              </div>
              <div>
                <span>存证时间</span>
                <span>{detail?.ctime || '--'}</span>
              </div>
              <div>
                <span>存证平台</span>
                <span>可信存证服务平台</span>
              </div>
              <div>
                <span>所属链 </span>
                <span>
                  {detail?.chainInfo?.chainTypeId === 0 ? '自建链' : ''}
                </span>
              </div>
              <div>
                <span>交易hash</span>
                <span>{detail?.chainInfo?.blockHash || '--'}</span>
              </div>
              <div>
                <span>上链时间</span>
                <span>{timestampToTime(detail?.chainInfo?.timestamp)}</span>
              </div>
            </div>
            <div class="zhengshu-container-box-shuoming">
              <div class="zhengshu-container-box-shuoming-box">
                <div class="zhengshu-container-box-shuoming-box-title">
                  证书说明
                </div>
                <div class="zhengshu-container-box-shuoming-box-center">
                  1、本证书数据保全时间采用中国国家科学院授时中心标准时间。
                </div>
                <div class="zhengshu-container-box-shuoming-box-center">
                  2、本证书可作为电子数据备案凭证。
                </div>
                <div class="zhengshu-container-box-shuoming-box-center">
                  3、如需验证电子数据的一致性和保全时间，可在
                  <a href="http://www.cunzheng.com">http://www.cunzheng.com</a>
                  查询。
                </div>
              </div>
            </div> -->
          <!-- </div> -->
        </div>
        <div v-if="authDialogVisible.length === 0" class="nothing-application">
          <div class="nothing-application-img"></div>
          <div>{{
            tabsApplication == 1 ? '暂无已购应用' : '暂无企业自建应用'
          }}</div>
          <t-button
            class="nothing-application-button"
            type="primary"
            @click="goapply"
            >{{ tabsApplication == 1 ? '查看应用商城' : '创建应用' }}</t-button
          >
        </div>
      </div>
    </div>
    <!-- 订单概览 -->
    <div class="views">
      <div class="tooplist">
        <h3>订单概览</h3>
        <p style="color: #3975fb; cursor: pointer" @click="multiples">更多</p>
      </div>
      <div class="overlist">
        <div
          v-for="(item, index) in orderOverall"
          :key="index"
          class="overlistdata"
        >
          <div>
            <span style="display: block" class="overlist-title">{{
              item.title
            }}</span>
            <span class="overlist-num" style="font-size: 30px">{{
              (orderlist[item.field] || '').toLocaleString() || 0
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 配置应用 -->
    <AuthMemberModal
      v-if="editModalVisiblealter"
      :product-id="selectProduct.productId"
      :delivery-set-id="selectProduct.deliveryId"
      :account-count="selectProduct.accountCount"
      @confirm="onEditModalConfirmAlter"
      @cancel="editModalVisiblealter = false"
    >
    </AuthMemberModal>
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
    <!-- \v-show="false" -->

    <AuthModal
      v-if="authModalVisible"
      @confirm="onAuthModalConfirm"
      @cancel="authModalVisible = false"
    ></AuthModal>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { Modal, Message } from '@tele-design/web-vue';

import {
  orderOver,
  authDialogdata,
  orderGo,
  selectSelfApps,
} from '@/api/buyer/overview';

// 头像
import AuthMemberModal from '@/components/auth-member/index.vue';

import EditModal from '@/components/dataoverview/components/edit-modal.vue';

import EditModalFullscreen from '@/components/dataoverview/components/edit-modal-fullscreen.vue';

import DetailsModalFullscreen from '@/components/dataoverview/components/details-modal-fullscreen.vue';

import { useRouter, useRoute } from 'vue-router';
// import EditModalAlter from '@/components/home/edit-modal-alter.vue';
// import EditModalAlter from '@/components/home/edit-modal-alter.vue';
import { useUserStore } from '@/store/modules/user';
import {
  AppType,
  AccountType,
  AccountTypeDesc,
  CompanyAuthStatus,
  CompanyAuthStatusDESC,
  NodeAuthStatus,
  NodeAuthStatusDESC,
} from '@/enums/common';

// import { fileDownloadto2 } from '@/api/file';

import AuthModal from '@/components/auth-modal/index.vue';
import ellipsis from '@/components/ellipsis/index.vue';
import avatar from './image/avatar.png';
import group1 from './image/group1.png';
import group2 from './image/group2.png';
import group3 from './image/group3.png';
import group4 from './image/group4.png';

// import frame from './image/frame.png';

// import EditModal from './components/edit-modal.vue';
// import EditModalFullscreen from './components/edit-modal-fullscreen.vue';
// import DetailsModalFullscreen from './components/details-modal-fullscreen.vue';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);
// console.log(userInfoByCompany);

const selectProduct = ref<Record<string, any>>({});
const authModalVisible = ref(false);

const stateClass = {
  [CompanyAuthStatus.TO_CHECK]: 'tobereviewed',
  [CompanyAuthStatus.AUTHED]: 'authenticated',
  [CompanyAuthStatus.REJECT]: 'override',
  [CompanyAuthStatus.UNAUTH]: 'notcertified',
};
const nodeStateClass = {
  [NodeAuthStatus.TO_CHECK]: 'tobereviewed',
  [NodeAuthStatus.AUTHED]: 'authenticated',
  [NodeAuthStatus.REJECT]: 'override',
  [NodeAuthStatus.UNAUTH]: 'notcertified',
};
// const nodeStateText = {
//   [TextStatus.TO_CHECK]: 'tobereviewed',
//   [TextStatus.AUTHED]: 'authenticated',
//   [TextStatus.REJECT]: 'override',
//   [TextStatus.UNAUTH]: 'notcertified',
// };

// 认证状态
// const stateles = ref({
//   companyStatus: 3, // 认证状态 0:待审核 1:已认证 2:已驳回 3:未认证
//   nodeStatus: 0, // 节点认证状态 0:待审核 1:已认证 2:已驳回 3:未认证
// });

// 前缀后几个 tooltip 显示
const entPrefixListSuffix = computed(() => {
  const arr = userInfoByCompany.value?.entPrefixList;
  // arr =
  if (Array.isArray(arr) && arr.length > 2) {
    return arr.slice(2);
  }
  return [];
});
const state = reactive({
  editData: {
    id: '1111',
    // 0是提交认证 1是修改认证
    statusled: 0,
  },
});
// tabs来回切换值
const tabsApplication = ref(1);
// 立即认证弹窗
const editModalVisible = ref(false);
// 去认证弹窗
const gotoverifys = ref(false);
// 详情弹窗
const detailflag = ref(false);
// 配置应用 弹窗
const editModalVisiblealter = ref(false);

// //已购应用
const authDialogVisible: Record<string, any> = ref([]);
// 订单概览
const orderlist = ref<Record<string, any>>({
  count: 0, // 全部订单数量
  payCount: 0, // 待支付页数量
  auditCount: 0, // 待审核页数量
  deliverCount: 0, // 待交付数量
  rejectCount: 0, // 已驳回数量
  servicesDeliverCount: 0, // 服务商交付数量
  completeCount: 0, // 已完成数量
});
// 概览状态
const orderOverall = [
  {
    title: '全部订单',
    field: 'count',
  },
  {
    title: '待支付',
    field: 'payCount',
  },
  {
    title: '待审核',
    field: 'auditCount',
  },
  {
    title: '待交付',
    field: 'deliverCount',
  },
  {
    title: '已完成',
    field: 'completeCount',
  },
];

// 订单概览 接口
const orderlistdata = () => {
  orderOver({
    userCompanyId: String(userInfoByCompany.value?.companyId),
    flag: '0',
  }).then((res) => {
    // @ts-ignore
    const data = {
      ...res,
      payCount: res.payCount + res.rejectCount,
      deliverCount: res.deliverCount + res.servicesDeliverCount,
    };
    orderlist.value = data;
  });
};
// 已购应用
const authDialog = () => {
  if (Number(tabsApplication.value) === 1) {
    // userId 用户id,如果登陆人是企业，则不需要传，如果是企业下得成员，则需要传
    authDialogdata({
      companyId: userInfoByCompany.value?.companyId,
      userId: userInfoByCompany.value.primary === 1 ? '' : userInfo.value?.id, // userInfoByCompany.value?.id || '',
    }).then((res) => {
      authDialogVisible.value = res || [];
    });
  } else if (Number(tabsApplication.value) === 2) {
    selectSelfApps({
      companyId: userInfoByCompany.value?.companyId,
      userId: userInfoByCompany.value.primary === 1 ? '' : userInfo.value?.id, // userInfoByCompany.value?.id || '',
    }).then((res) => {
      authDialogVisible.value = res || [];
    });
  }
};

// 去认证
const authentication = () => {
  // editModalVisible.value = true; //  本平台进行企业认证
  gotoverifys.value = true;
};

const nodeAuth = () => {
  authModalVisible.value = true;
};
const onAuthModalConfirm = () => {
  authModalVisible.value = false;
};
// 认证弹窗去认证事件
const onEditModalConfirm = () => {
  gotoverifys.value = true;
  // editModalVisible.value = false;
};
// 查看详情
const hasdflags = () => {
  // editModalVisible.value = false;
  detailflag.value = true;
};
// 查看详情
const viewdetails = () => {
  // editModalVisible.value = true;
  detailflag.value = true;
};
// 认证填写完成
const onEditModalConfirmcode = () => {
  state.editData.statusled = 0;
  gotoverifys.value = false;
};
// 认证填写 取消
const cancelgotoverifys = (status: number) => {
  if (status === 1) {
    detailflag.value = true;
    gotoverifys.value = false;
  } else {
    // editModalVisible.value = true;
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
// 查看详情 取消
const detailflagclick = () => {
  detailflag.value = false;
  // editModalVisible.value = true;
};

// 企业节点查看详情
const viewdetailsredf = () => {
  const { snmsUrls } = userInfo.value || {};

  window.open(snmsUrls.addNode, '_blank'); // 跳转到二级企业节点认证页面
};
// 邀请成员/分配权限
const distributionrole = () => {
  if (
    userInfoByCompany.value?.certificateStatus === CompanyAuthStatus?.AUTHED ||
    userInfoByCompany.value?.nodeStatus === NodeAuthStatus?.AUTHED
  ) {
    const start = userInfoByCompany.value?.menuCodes.findIndex(
      (item: string, index: number) => {
        return item === 'ROUTE_SYSTEM_USERS';
      }
    );
    if (start !== -1) {
      router.push('/system/users');
    } else {
      Message.error('未分配企业管理权限，请联系企业管理员');
    }
  } else {
    Message.error('请先完成企业认证');
  }
};
// 去商城
const tomall = () => {
  router.push('/wow/mall');
};
const compareDate = (dateTime1: string, dateTime2: string) => {
  const formatDate1 = new Date(dateTime1);
  const formatDate2 = new Date(dateTime2);
  if (formatDate1 > formatDate2) {
    return true;
  }
  return false;
};
// 前往
const togo = (detailData: Record<string, any>) => {
  const { id, dueDate, type } = detailData;

  // 标识类应用需要申请开通企业节点
  if (
    AppType.IDAPP === type &&
    userInfoByCompany.value?.nodeStatus !== NodeAuthStatus.AUTHED
  ) {
    Modal.info({
      title: '使用提醒',
      content: '本应用需申请企业节点后使用，请先开通或绑定企业节点。',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '暂不开通',
      okText: '去开通',
      onOk: () => {
        authModalVisible.value = true;
      },
    });
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = `0${now.getMonth() + 1}`.slice(-2);
  const day = `0${now.getDate()}`.slice(-2);
  const hours = `0${now.getHours()}`.slice(-2);
  const minutes = `0${now.getMinutes()}`.slice(-2);
  const seconds = `0${now.getSeconds()}`.slice(-2);
  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  if (!dueDate || compareDate(dueDate, formattedTime)) {
    // TODO 过期时间判断
    orderGo({ id }).then((res: any) => {
      window.open(res, '_blank');
    });
  }
};

// 配置应用
const configurationapp = (item: Record<string, any>) => {
  selectProduct.value = item; // 配置的应用 id
  editModalVisiblealter.value = true;
};
// 配置应用 确定
const onEditModalConfirmAlter = () => {
  editModalVisiblealter.value = false;
};
const filetype = (val: any) => {
  if (val === 'doc') {
    return 'application/msword;charset=utf-8';
  }
  if (val === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8';
  }
  return 'application/pdf;charset=utf-8';
};
// 使用说明
const instructionsuse = (
  fileurl: string,
  orderSource: string,
  productServerId: string
) => {
  // const type = fileurl.substr(fileurl.lastIndexOf('.') + 1, fileurl.length);
  // fileDownloadto2({
  //   name: fileurl,
  //   source,
  //   serverId: productServerId,
  // }).then((res: any) => {
  const link = document.createElement('a');
  //   //    type就是blob的type,是MIME类型的，可以自己查看MIME类型都有哪些
  //   const blogw = new Blob([res], {
  //     // type: 'application/x-abiword;charset=utf-8'
  //     // type: 'application/msword;charset=utf-8',
  //     // type: 'application/pdf;charset=utf-8',
  //     type: filetype(type),
  //   });
  const objectUrl = `/server/web/file/orderDownloadBySource?name=${fileurl}&source=${orderSource}&serverId=${productServerId}`; // 创建一个新的url对象
  link.href = objectUrl;
  const fileName = '使用说明';
  link.download = fileName; //  下载的时候自定义的文件名
  link.click();
  window.URL.revokeObjectURL(objectUrl); // 为了更好地性能和内存使用状况，应该在适当的时候释放url.
  // });
};

// 更多
const multiples = () => {
  const start = userInfoByCompany.value?.menuCodes.findIndex(
    (item: string, index: number) => {
      return item === 'ROUTE_BUYER_ORDER';
    }
  );
  if (start !== -1) {
    router.push('/buyer/order');
  } else {
    Message.error('未分配订单管理权限,请联系企业管理员查看订单');
  }
};
// 应用切换
const TabClickApplication = (key: any) => {
  tabsApplication.value = key;
  if (
    key === '1' &&
    (userInfoByCompany.value.certificateStatus === 1 ||
      userInfoByCompany.value.nodeStatus === 1)
  ) {
    authDialog();
  } else if (
    key === '2' &&
    (userInfoByCompany.value.certificateStatus === 1 ||
      userInfoByCompany.value.nodeStatus === 1)
  ) {
    authDialog();
  }
};

const goapply = () => {
  if (Number(tabsApplication.value) === 1) {
    // 跳转应用商城
    router.push('/wow/mall');
  } else {
    // 跳转应用模块
  }
};

const initOpt = () => {
  if (
    userInfoByCompany.value.certificateStatus === 1 ||
    userInfoByCompany.value.nodeStatus === 1
  ) {
    // 已购应用
    authDialog();
  }

  // 订单概览
  orderlistdata();
};

watch(
  () => userInfoByCompany.value,
  (newV) => {
    if (newV?.companyId) {
      initOpt();
    }
  }
);

// 在当前路由下点击 标识服务，去开通，弹窗三要素弹窗
watch(
  () => route.query?.openAuthModal,
  (newV) => {
    if (newV) {
      authModalVisible.value = true;
    }
  }
);
onMounted(() => {
  initOpt();

  if (route.query?.openAuthModal) {
    authModalVisible.value = true;
  }
});
</script>

<style scoped lang="less">
// * {
//   padding: 0;
//   margin: 0;
//   list-style: none;
// }
.cverbox {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f2f3f8;
  background-image: url('./image/header.png');
  background-repeat: no-repeat;
  background-size: 100% auto;

  .headers {
    margin-bottom: 24px;

    .tops {
      display: flex;
      height: 80px;
      margin: 24px 0;
      padding: 0 24px;
      background-color: #fff;
      border-radius: 4px;

      .imgs {
        float: left;
        width: 44px;
        height: 44px;
        margin-top: 14px;
      }

      .rights {
        flex: 1;
        height: 44px;
        margin: 10px 0 0 12px;

        .name {
          margin-bottom: 0;
          // height: 0;
          color: #223354;
          font-weight: 600;
          font-size: 15px;
          font-style: normal;
          line-height: 34px;
        }

        .inofs {
          display: flex;

          .inofslist {
            display: flex;
            // flex: 1;
            margin-top: 2px;
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;

            :deep(.tele-space-item) {
              margin-right: 12px !important;
            }

            p {
              float: left;
            }

            .companyname {
              // flex: 1;
              margin-right: 12px;
              margin-bottom: 0;
              color: #86909c;
            }

            .extPrefix {
              color: #86909c;

              .divider {
                display: inline-block;
                margin-right: 12px;
                margin-left: 8px;
                color: #8c95a7;
              }
            }

            // p:nth-child(1) {
            //   margin-right: 12px;
            //   color: #86909c;
            // }
            p:nth-child(2) {
              margin-right: 12px;
              color: #86909c;
              text-align: center;
              // padding: 3px 10px;
            }

            p:nth-child(3) {
              margin-right: 12px;
              color: #86909c;
            }

            p:nth-child(4) {
              margin-right: 12px;
              color: #86909c;
              // color: #86909c;
              text-align: center;
            }

            .popover-bottom {
              display: flex;
              flex-direction: columns;

              &div {
                margin-top: 16px;
                color: rgba(78, 89, 105, 1);
                font-weight: 400;
                font-size: 12px;
                font-family: PingFang SC;
                line-height: 20px;
                text-align: left;
              }
            }
          }

          // 已认证
          .statuslist {
            width: 52px;
            padding: 1px 8px;
            font-weight: 400;
            font-size: 12px;
            line-height: 22px;
          }

          .suffix {
            float: left;
            margin-top: 2px;

            p {
              float: left;
              margin-right: 9px;
              color: #86909c;
            }
          }

          .authenticated {
            color: #009a29;
            background-color: #e8ffea;
          }
          // 未认证
          .notcertified {
            color: #fa9600;
            background-color: #fffae8;
          }
          // 待审核
          .tobereviewed {
            color: #1664ff;
            background-color: #e8f4ff;
          }
          //以驳回
          .override {
            color: #e63f3f;
            background-color: #ffece8;
          }
        }
      }
    }

    .direction {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 240px;

      .dirleft {
        width: 78%;
        height: 100%;
        padding: 16px 24px;
        background-color: #fff;
        border: 1px solid #e5e8ef;
        border-radius: 4px;

        h3 {
          color: #223354;
          font-weight: 500;
          font-size: 20px;
          line-height: 34px;
        }

        .titleleft {
          .dirlist {
            display: flex;
            justify-content: space-between;
            // width: 90%;
            > div {
              width: 25%;
            }

            :deep(.tele-btn-size-medium) {
              height: 0;
              padding: 0;
            }

            .dirlist-step {
              display: inline-block;
              margin-top: 2px;
              color: #1d2129;
              font-weight: 500;
              font-size: 16px;
              line-height: 24px;
            }

            img {
              float: left;
              width: 28px;
              height: 28px;
              margin-right: 8px;
            }

            .ition {
              width: 80px;
              height: 1px;
              margin-top: 13px;
              margin-left: -80px;
              background-color: #4e5969;
            }

            .btns {
              margin-left: 36px;

              p {
                color: #9098a9;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
              }

              .dirlist-btn {
                height: 20px;
                color: var(--b-161664-ff, #1664ff);
                font-weight: 400;
                font-size: 14px;
                font-family: PingFang SC;
                font-style: normal;
                line-height: normal;
              }
            }

            div:nth-child(1) {
              // width: 20%;

              // img {
              //   float: left;
              //   width: 20px;
              //   height: 20px;
              //   margin-right: 7px;
              // }
              .btns {
                float: left;
                width: 100%;
                // margin-left: 27px;

                // p:nth-child(1) {
                //   color: #9098a9;
                //   font-size: 14px;
                //   font-weight: 400;
                //   line-height: 20px;
                // }

                // p:nth-child(2) {
                //   color: #1664ff;
                // }
                .states {
                  // 已认证
                  .authenticated {
                    color: #009a29;
                    background-color: #e8ffea;
                  }
                  // 未认证
                  .notcertified {
                    color: #fa9600;
                    background-color: #fffae8;
                  }
                  // 待审核
                  .tobereviewed {
                    color: #1664ff;
                    background-color: #e8f4ff;
                  }
                  //以驳回
                  .override {
                    color: #e63f3f;
                    background-color: #ffece8;
                  }
                }
              }
            }

            div:nth-child(2) {
              // width: 35%;
              img {
                float: left;
                // width: 20px;
                // height: 20px;
                // margin-right: 7px;
              }

              .ition {
                float: left;
                // width: 35%;
                // height: 1px;
                // margin-top: 13px;
                // background-color: #4e5969;
              }

              .btns {
                float: left;
                width: 100%;
                // margin-left: 116px;
                p:nth-child(1) {
                  color: #9098a9;
                }

                p:nth-child(2) {
                  color: #1664ff;
                }
              }
            }

            div:nth-child(3) {
              // width: 35%;
              img {
                float: left;
                // width: 20px;
                // height: 20px;
                // margin-right: 7px;
              }

              .ition {
                float: left;
                // width: 35%;
                // height: 1px;
                // margin-top: 10px;
                // background-color: #4e5969;
              }

              .btns {
                float: left;
                width: 100%;
                // margin-left: 116px;
                p:nth-child(1) {
                  color: #9098a9;
                }

                p:nth-child(2) {
                  color: #1664ff;
                }
              }
            }

            div:nth-child(4) {
              // width: 35%;
              img {
                float: left;
                // width: 20px;
                // height: 20px;
                // margin-right: 7px;
              }

              .ition {
                float: left;
                // width: 35%;
                // height: 1px;
                // margin-top: 10px;
                // background-color: #4e5969;
              }

              .btns {
                float: left;
                width: 100%;
                // margin-left: 116px;
                p:nth-child(1) {
                  color: #9098a9;
                }
                // p:nth-child(2) {
                //   color: #1664ff;
                // }
              }
            }
          }
        }
      }

      .firmright {
        width: 20%;
        height: 100%;
        padding: 16px 0 0 24px;
        background-image: url('./image/backgroup.png');
        // background-color: #fff;
        background-size: cover;
        border-radius: 4px;

        .firm {
          display: flex;
          align-items: center;
          width: 100%;

          .firm-title {
            display: inline-block;
            margin-right: 8px;
            color: #223354;
            font-weight: 500;
            font-size: 20px;
            line-height: 34px;
          }

          span {
            font-size: 12px;
          }
          // 已认证
          .authenticated {
            color: #009a29;
            background-color: #e8ffea;
          }
          // 未认证
          .notcertified {
            color: #fa9600;
            background-color: #fffae8;
          }
          // 待审核
          .tobereviewed {
            color: #1664ff;
            background-color: #e8f4ff;
          }
          //以驳回
          .override {
            color: #e63f3f;
            background-color: #ffece8;
          }
        }

        .fimelist {
          font-weight: 400;
          font-size: 12px;
          line-height: 20px;

          ul {
            li {
              // margin-top: 5px;
              display: flex;
              align-items: center;
              color: #4e5969;

              span:nth-child(1) {
                float: left;
                width: 6px;
                height: 6px;
                margin-right: 8px;
                background-color: #4e5969;
                border-radius: 6px;
              }
            }
          }

          .fimelistdata {
            .states {
              margin: 0 auto;
              // 已认证
              .authenticated {
                color: #009a29;
                background-color: #e8ffea;
              }
              // 未认证
              .notcertified {
                color: #fa9600;
                background-color: #fffae8;
              }
              // 待审核
              .tobereviewed {
                color: #1664ff;
                background-color: #e8f4ff;
              }
              //以驳回
              .override {
                color: #e63f3f;
                background-color: #ffece8;
              }
            }
          }
        }
      }
    }
  }

  .content {
    height: 340px;
    margin: 0 2% 30px 2%;
    padding: 7px 0 0 20px;
    background-image: url('./image/contimg.png');
    border: 1px solid #e5e8ef;

    .catimg {
      width: 99%;
      height: 100%;

      :deep(.tele-carousel-arrow-left) {
        top: 106%;
        left: 44%;
        background: transparent;
      }

      :deep(.tele-carousel-arrow-right) {
        top: 106%;
        right: 45%;
        background: transparent;
      }

      :deep(.tele-carousel-arrow-left > svg) {
        color: #56555f;
        font-weight: 600;
        font-size: 20px;
      }

      :deep(.tele-carousel-arrow-right > svg) {
        color: #56555f;
        font-weight: 600;
        font-size: 20px;
      }

      :deep(.tele-carousel-indicator-wrapper-bottom) {
        bottom: -35px;
        background: transparent;
      }

      :deep(.tele-carousel-indicator) {
        display: flex;
        align-items: center;
      }

      :deep(.tele-carousel-indicator-item) {
        width: 8px;
        height: 8px;
        margin-right: 16px;
        background-color: #84adff;
        border-radius: 0;
        transform: rotate(45deg);
        transform-origin: center center;
      }

      :deep(.tele-carousel-indicator-item-active) {
        width: 16px;
        height: 16px;
        background-color: #1664ff;
        border-radius: 0;
        transform: rotate(45deg);
        transform-origin: center center;
      }

      .catimglist {
        display: flex;
        justify-content: space-between;
        height: 100%;

        .catimglistleft {
          display: flex;
          justify-content: space-between;
          width: 48%;
          height: 90%;
          padding: 20px;
          background-color: #fff;

          .leftcont {
            // display: flex;
            // flex-direction: column;
            width: 67%;
            height: 100%;
            // justify-content: space-between;
            // align-items: flex-end;
            // align-content: space-between;
            .tophead {
              display: flex;
              justify-content: space-between;
              width: 100%;
            }
          }
        }

        .catimglistright {
          display: flex;
          justify-content: space-between;
          width: 48%;
          height: 90%;
          padding: 20px;
          background-color: #fff;

          .leftcont {
            display: flex;
            flex-direction: column;
            width: 67%;
            // align-items: flex-end;
            .tophead {
              display: flex;
              justify-content: space-between;
              width: 100%;
            }
          }
        }
      }
    }
  }

  .purchased {
    // width: 96%;
    width: 1200px;
    margin: 0 auto 24px;
    padding: 16px 24px 27px;
    background-color: #fff;
    border: 1px solid #e5e8ef;
    border-radius: 4px;

    h3 {
      color: #223354;
      font-weight: 500;
      font-size: 20px;
      line-height: 34px;
    }

    :deep(.tele-tabs-tab) {
      margin: 0 16px 0 0;
    }

    :deep(.tele-tabs-tab-active) {
      color: rgba(34, 51, 84, 1);
    }

    :deep(.tele-tabs-tab-title) {
      display: flex;
      align-items: center;
    }

    .application-img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }

    .application-blue-img {
      transform: translateY(-60px);
      // 颜色、x轴偏移量、y轴偏移量,这里的颜色就是你要指定的颜色，不管原来的图片是什么颜色，都会变成这个颜色
      filter: drop-shadow(rgba(22, 100, 255, 1) 0 60px);
    }

    .Applysd {
      //   height: 500px;
      //   background-color: pink;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      height: 100%;

      .purchasedlist {
        display: flex;
        justify-content: space-between;
        width: 47%;
        height: 138px;
        margin-top: 24px;
        padding: 16px;
        // flex-shrink: 0;
        background-color: #fff;
        border: 1px solid #e5e8ef;
        border-radius: 4px;

        .leftcont {
          display: flex;
          flex-direction: column;
          width: 77%;
          // align-items: flex-end;
          .tophead-intro {
            word-break: break-all;
          }

          .tophead-to {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 12px;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;

            .to-container {
              display: flex;
              align-items: center;
            }

            .to-img {
              display: inline-block;
              width: 16px;
              height: 16px;
              margin-left: 4px;
              background: url('./image/togo.svg');
            }
          }

          .tophead {
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
          }

          .purchased-content {
            color: #4e5969;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
          }
        }
      }

      .purchasedlist:nth-child(-n + 2) {
        margin-top: 20px;
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

      .nothing-application-button {
        margin-top: 12px;
      }
    }
  }

  .views {
    // width: 96%;
    width: 1200px;
    margin: 0 auto 24px;
    padding: 16px 24px;
    background-image: url('./image/btn.png');
    background-size: cover;
    border: 1px solid #e5e8ef;
    border-radius: 4px;

    .tooplist {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 24px;

      h3 {
        color: #223354;
        font-weight: 500;
        font-size: 20px;
        line-height: 34px;
      }

      p {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
      }
    }

    .overlist {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .overlistdata {
        width: 20%;
        height: 100px;
        margin-right: 16px;
        padding: 16px 16px 22px;
        background: rgba(255, 255, 255, 0.4);

        &:last-of-type {
          margin-right: 0;
        }

        &:hover {
          background-image: url('./image/overdata-bg.jpg');
          background-size: auto 100%;
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
        }

        .overlist-title {
          color: #86909c;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
        }

        .overlist-num {
          color: #1d2129;
          font-weight: 700;
          font-size: 30px;
          line-height: 38px;
        }
      }
    }
  }
  // pdf导出
  .zhengshu-container-box {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: -9999;
    box-sizing: border-box;
    // position: fixed;
    // // top: 100000px;
    width: 664px;
    height: 856px;
    margin: 10px auto 0;
    padding: 24px;
    background-color: #fff;
    box-shadow: 0 0 10px 0 #ccc;

    .zhengshu-container-box-title {
      margin-top: 24px;
      color: #1d2129;
      font-weight: 400;
      font-size: 32px;
      font-family: 'PingFang SC';
      font-style: normal;
      text-align: center;
    }

    .zhengshu-container-box-bid {
      color: #1d2129;
      font-weight: 400;
      font-size: 14px;
      font-family: 'PingFang SC';
      font-style: normal;
      text-align: center;
    }

    .zhengshu-container-box-center {
      width: 100%;
      margin-top: 58px;
      padding-left: 17px;

      div {
        display: flex;
        align-items: center;
        margin-top: 18px;

        span:nth-child(1) {
          min-width: 85px;
          color: #86909c;
          font-weight: 400;
          font-size: 13px;
          font-family: 'PingFang SC';
          font-style: normal;
        }

        span:nth-child(2) {
          color: #1d2129;
          font-weight: 400;
          font-size: 14px;
          font-family: 'PingFang SC';
          font-style: normal;
        }
      }
    }

    .zhengshu-container-box-shuoming {
      box-sizing: border-box;
      width: 100%;
      // position: absolute;
      // bottom: 24px;
      // left: 0;
      min-height: 145px;
      padding: 0 24px;

      .zhengshu-container-box-shuoming-box {
        box-sizing: border-box;
        // border-top: 1px solid #e8e9ea;
        width: 100%;
        height: 100%;
        padding-top: 20px;

        .zhengshu-container-box-shuoming-box-title {
          color: #1d2129;
          font-weight: 400;
          font-size: 14px;
          font-family: 'PingFang SC';
          font-style: normal;
        }

        .zhengshu-container-box-shuoming-box-center {
          margin-top: 10px;
          color: #86909c;
          font-weight: 400;
          font-size: 12px;
          font-family: 'PingFang SC';
          font-style: normal;
        }
      }
    }
  }
}

:deep(.tele-typography-operation-copy) {
  pointer-events: none;
}
</style>
