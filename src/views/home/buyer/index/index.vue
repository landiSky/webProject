<template>
  <div class="cverbox">
    <!-- 买家中心概览 头部 -->
    <div class="headers">
      <div style="margin: 0 2% 0 2%">
        <!-- 用户信息 -->
        <div class="tops">
          <div class="imgs">
            <img :src="avatar" alt="" />
          </div>
          <div class="rights">
            <p
              style="float: left; width: 300px; margin-top: 16px"
              class="name"
              >{{ userInfoByCompany?.username || userInfo?.mobile }}</p
            >

            <div class="inofs" style="float: left; margin-top: 25px">
              <div class="inofslist" style="float: left">
                <p>{{ userInfoByCompany.companyName || '暂未认证' }}</p
                ><p>|</p
                ><p>{{
                  userInfoByCompany.companyId
                    ? AccountTypeDesc[userInfoByCompany.primary]
                    : '-'
                }}</p
                ><p>|</p>
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
            </div>
          </div>
        </div>
        <!-- 使用指导 -->
        <div class="direction">
          <div class="dirleft">
            <div class="titleleft">
              <h3 style="margin: 20px 0 24px 0">使用指导 </h3>
              <div class="dirlist">
                <div>
                  <img :src="group1" alt="" />
                  <span style="float: left; margin-top: 3px">完成企业认证</span>
                  <div class="btns">
                    <p style="margin: 10px 0"> 确认企业身份</p>
                    <t-button
                      v-if="
                        !userInfoByCompany.companyId ||
                        userInfoByCompany.certificateStatus ===
                          CompanyAuthStatus.UNAUTH
                      "
                      type="text"
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
                        ><t-button type="text" @click="viewdetails"
                          >查看详情</t-button
                        ></span
                      >
                      <!-- <t-button type="text" @click="authentication"
                        >去认证</t-button
                      > -->
                    </div>
                    <!-- <t-button type="text" @click="authentication"
                      >去认证</t-button
                    > -->
                  </div>
                </div>
                <div>
                  <p class="ition"></p>
                  <img :src="group2" alt="" />
                  <span style="float: left; margin-top: 3px">企业成员管理</span>
                  <div class="btns">
                    <p style="margin: 10px 0"> 管理企业组织架构&成员权限</p>
                    <t-button
                      v-if="userInfoByCompany.primary === AccountType?.MAIN"
                      type="text"
                      @click="distributionrole"
                    >
                      邀请成员/分配权限</t-button
                    >
                    <!-- <p></p> -->
                  </div></div
                >

                <div>
                  <p class="ition"></p>
                  <img :src="group3" alt="" />
                  <span style="float: left; margin-top: 3px">浏览开通应用</span>
                  <div class="btns">
                    <p style="margin: 10px 0"> 搜索购买开通应用</p>
                    <t-button type="text" @click="tomall">去应用商城 </t-button>
                    <!-- <p> 去应用商城</p> -->
                  </div>
                </div>
                <div>
                  <p class="ition"></p>
                  <img :src="group4" alt="" />
                  <span style="float: left">企业成员管理</span>
                  <div class="btns">
                    <p style="margin: 10px 0"> 应用配置，使用应用</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="firmright">
            <div class="firm">
              <div
                style="
                  float: left;
                  margin-right: 6px;
                  color: #4e5969;
                  font-weight: 500;
                  font-size: 20px;
                "
                >企业节点认证</div
              ><span
                style="padding: 4px 8px; line-height: 22px"
                :class="nodeStateClass[userInfoByCompany.nodeStatus]"
                >{{ NodeAuthStatusDESC[userInfoByCompany.nodeStatus] }}</span
              >
            </div>
            <div
              class="fimelist"
              style="float: left; width: 90%; font-size: 12px"
            >
              <p style="margin: 15px 0 5px 0">开通权益:</p>
              <ul style="margin-left: 10px">
                <li style="display: inline-block; width: 100%">
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
                  style="display: block; margin: 15px auto 0; padding: 5px 10px"
                  @click="nodeAuth"
                  >去认证</t-button
                >
                <div v-else class="states">
                  <p
                    style="
                      width: 50px;
                      margin: 10px auto 0;
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
                    style="
                      width: 80px;
                      margin: 0 auto;
                      font-size: 12px;

                      /* padding: 5px; */
                    "
                    ><t-button type="text" @click="viewdetailsredf"
                      >查看详情</t-button
                    ></p
                  >
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
    <div v-if="authDialogVisible.length !== 0" class="purchased">
      <h3>已购应用</h3>
      <div class="Applysd">
        <div
          v-for="(item, index) in authDialogVisible"
          :key="index"
          class="purchasedlist"
        >
          <div style="width: 20%">
            <img
              :src="`/server/web/file/download?name=${item.productLogo}&productId=${item.productId}`"
              alt=""
              style="width: 100%; height: 100%"
            />
          </div>
          <div class="leftcont">
            <div class="tophead" style="margin-bottom: 20px"
              ><span>{{ item.productName }}</span
              ><span
                style="color: #1664ff; cursor: pointer"
                @click="togo(item.id, item.dueDate)"
              >
                前往 》</span
              ></div
            >
            <!-- <div
              style="
                height: 50px;
                margin-bottom: 20px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              "
              title="asdasdasd"
              >{{ item.introduction }}
            </div> -->
            <t-typography-paragraph
              style="float: left"
              :ellipsis="{
                rows: 1,
                showTooltip: true,
              }"
            >
              {{ item.introduction }}
            </t-typography-paragraph>
            <div class="tophead"
              ><span
                v-if="userInfoByCompany.primary === AccountType?.MAIN"
                style="color: #1664ff; cursor: pointer"
                @click="configurationapp(item)"
                >配置应用</span
              ><span
                style="margin-left: auto; color: #86909c; cursor: pointer"
                @click="instructionsuse(item.useExplain, item.productId)"
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
      </div>
    </div>
    <!-- 订单概览 -->
    <div class="views">
      <div class="tooplist">
        <h3>订单概览</h3>
        <p style="color: #1664ff; cursor: pointer" @click="multiples">更多</p>
      </div>
      <div class="overlist">
        <div
          v-for="(item, index) in orderOverall"
          :key="index"
          class="overlistdata"
        >
          <div>
            <span
              style="
                display: block;
                width: 100%;
                margin-bottom: 15px;
                color: #86909c;
                font-size: 14px;
              "
              >{{ item.title }}</span
            >
            <span style="font-size: 30px">{{
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
import { ref, reactive, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { orderOver, authDialogdata, orderGo } from '@/api/buyer/overview';

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
  AccountType,
  AccountTypeDesc,
  CompanyAuthStatus,
  CompanyAuthStatusDESC,
  NodeAuthStatus,
  NodeAuthStatusDESC,
} from '@/enums/common';

import { fileDownload } from '@/api/file';

import AuthModal from '@/components/auth-modal/index.vue';
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
const {
  userInfo,
  selectCompany,
  userInfoByCompany,
}: Record<string, any> = storeToRefs(userStore);
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

const state = reactive({
  editData: {
    id: '1111',
    // 0是提交认证 1是修改认证
    statusled: 0,
  },
});
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
  console.log('index.vue:648===获取订单概览接口', userInfoByCompany.value);
  orderOver({
    userCompanyId: String(userInfoByCompany.value?.companyId),
    flag: '0',
  }).then((res) => {
    console.log(res, '订单概览 接口');
    // @ts-ignore
    orderlist.value = res;
  });
};
// 已购应用
const authDialog = () => {
  console.log(userInfoByCompany.value, '---');

  // userId 用户id,如果登陆人是企业，则不需要传，如果是企业下得成员，则需要传
  authDialogdata({
    companyId: userInfoByCompany.value?.companyId,
    userId: userInfo.value?.userId, // userInfoByCompany.value?.id || '',
  }).then((res) => {
    console.log(res);
    authDialogVisible.value = res || [];
  });
};

// 去认证
const authentication = () => {
  editModalVisible.value = true; //  本平台进行企业认证
};

const nodeAuth = () => {
  authModalVisible.value = true;
};
const onAuthModalConfirm = () => {
  authModalVisible.value = false;
};
// 认证弹窗去认证事件
const onEditModalConfirm = () => {
  // console.log(gotoverifys.value);
  gotoverifys.value = true;
  editModalVisible.value = false;
};
// 查看详情
const hasdflags = () => {
  editModalVisible.value = false;
  detailflag.value = true;
  console.log(detailflag.value);
};
// 查看详情
const viewdetails = () => {
  editModalVisible.value = true;
  // detailflag.value = true;
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
// 查看详情 取消
const detailflagclick = () => {
  detailflag.value = false;
  editModalVisible.value = true;
};

// 企业节点查看详情
const viewdetailsredf = () => [];
// 邀请成员/分配权限
const distributionrole = () => {
  router.push('/system/users');
};
// 去商城
const tomall = () => {
  router.push('/wow/mall');
};
// 前往
const togo = (idd: string, dueDate: string) => {
  console.log('index.vue:685===点击前往', idd, dueDate);
  // if (dueDate) {   // TODO 过期时间判断
  orderGo({ id: idd }).then((res: any) => {
    console.log('获取应用访问地址====', res);
    window.open(res, '_blank');
    // window.location.href=
  });
  // window.open(urldata);
  // }
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
const instructionsuse = (fileurl: string, prodtId: string) => {
  console.log(fileurl, prodtId, 'prodtId');
  const type = fileurl.substr(fileurl.lastIndexOf('.') + 1, fileurl.length);
  console.log(type, 'type----');
  fileDownload({ name: fileurl, roductId: prodtId }).then((res: any) => {
    // console.log(res);
    // console.log(res, '导出数据');

    const link = document.createElement('a');
    //    type就是blob的type,是MIME类型的，可以自己查看MIME类型都有哪些
    const blogw = new Blob([res], {
      // type: 'application/x-abiword;charset=utf-8'
      // type: 'application/msword;charset=utf-8',
      // type: 'application/pdf;charset=utf-8',
      type: filetype(type),
    });
    const objectUrl = window.URL.createObjectURL(blogw); // 创建一个新的url对象
    link.href = objectUrl;
    // let file_name = `${moment().format(
    //   'YYYY-MM-DD HH:mm:ss'
    // )}的${list_name}列表.xlsx`;
    const fileName = '使用说明';
    link.download = fileName; //  下载的时候自定义的文件名
    link.click();
    window.URL.revokeObjectURL(objectUrl); // 为了更好地性能和内存使用状况，应该在适当的时候释放url.
  });

  // const url = `http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf`;
  // window.open(url, '_blank');
  // const input: any = document.getElementById('page');
  // html2canvas(input).then((canvas: any) => {
  //   const imgData = canvas.toDataURL('image/png');
  //   const pdf = new JsPDF('p', 'pt', 'a4');
  //   const width = pdf.internal.pageSize.getWidth();
  //   const height = pdf.internal.pageSize.getHeight();
  //   pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
  //   pdf.save('kexincunzheng.pdf');
  // });
};

// 更多
const multiples = () => {
  router.push('/buyer/order');
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

  .headers {
    margin-bottom: 30px;
    // background-color: pink;
    // height: 300px;
    background-image: url('./image/header.png');

    .tops {
      //   margin: 2%;
      float: left;
      width: 100%;
      height: 80px;
      margin: 30px 0 20px 0;
      background-color: #fff;
      border-radius: 4px;

      .imgs {
        float: left;
        width: 44px;
        height: 44px;
        margin: 18px 0 0 20px;
      }

      .rights {
        float: left;
        width: 300px;
        height: 44px;
        margin: 5px 0 0 10px;

        .name {
          height: 0;
        }

        .inofs {
          .inofslist {
            p {
              float: left;
            }

            p:nth-child(1) {
              margin-right: 9px;
              color: #86909c;
            }

            p:nth-child(2) {
              margin-right: 9px;
              color: #86909c;
              text-align: center;
              // padding: 3px 10px;
            }

            p:nth-child(3) {
              margin-right: 9px;
              color: #86909c;
            }

            p:nth-child(4) {
              margin-right: 9px;
              color: #86909c;
              // color: #86909c;
              text-align: center;
            }
          }

          // p:nth-child(5) {
          //   padding: 5px;
          //   font-size: 12px;
          // }
          // 已认证
          .statuslist {
            float: left;
            width: 52px;
            margin-top: -3px;
            padding: 1px 8px;
            font-weight: 400;
            font-size: 12px;
            line-height: 22px;
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
      height: 220px;

      .dirleft {
        width: 78%;
        height: 100%;
        background-color: #fff;
        border: 1px solid #e5e8ef;
        border-radius: 4px;

        .titleleft {
          padding: 0 0 0 20px;

          .dirlist {
            display: flex;
            justify-content: space-between;
            width: 90%;

            :deep(.tele-btn-size-medium) {
              height: 0;
              padding: 0;
            }

            div:nth-child(1) {
              width: 20%;

              img {
                float: left;
                width: 20px;
                height: 20px;
                margin-right: 7px;
              }

              .btns {
                float: left;
                width: 100%;
                margin-left: 27px;

                p:nth-child(1) {
                  color: #9098a9;
                }

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
              width: 35%;

              img {
                float: left;
                width: 20px;
                height: 20px;
                margin-right: 7px;
              }

              .ition {
                float: left;
                width: 35%;
                height: 1px;
                margin-top: 10px;
                background-color: #4e5969;
              }

              .btns {
                float: left;
                width: 100%;
                margin-left: 45%;

                p:nth-child(1) {
                  color: #9098a9;
                }

                p:nth-child(2) {
                  color: #1664ff;
                }
              }
            }

            div:nth-child(3) {
              width: 35%;

              img {
                float: left;
                width: 20px;
                height: 20px;
                margin-right: 7px;
              }

              .ition {
                float: left;
                width: 35%;
                height: 1px;
                margin-top: 10px;
                background-color: #4e5969;
              }

              .btns {
                float: left;
                width: 100%;
                margin-left: 45%;

                p:nth-child(1) {
                  color: #9098a9;
                }

                p:nth-child(2) {
                  color: #1664ff;
                }
              }
            }

            div:nth-child(4) {
              width: 35%;

              img {
                float: left;
                width: 20px;
                height: 20px;
                margin-right: 7px;
              }

              .ition {
                float: left;
                width: 35%;
                height: 1px;
                margin-top: 10px;
                background-color: #4e5969;
              }

              .btns {
                float: left;
                width: 100%;
                margin-left: 45%;

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
        padding: 15px 0 0 30px;
        background-image: url('./image/backgroup.png');
        // background-color: #fff;
        background-size: cover;
        border-radius: 4px;

        .firm {
          width: 100%;

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
          ul {
            li {
              margin-top: 5px;

              span:nth-child(1) {
                float: left;
                width: 6px;
                height: 6px;
                margin: 5px 8px 0 0;
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
    width: 96%;
    margin: 0 2% 30px 2%;
    padding: 7px 20px 20px 20px;
    border: 1px solid #e5e8ef;
    border-radius: 4px;

    .Applysd {
      //   height: 500px;
      //   background-color: pink;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;

      .purchasedlist {
        display: flex;
        justify-content: space-between;
        width: 47%;
        height: 150px;
        margin-top: 15px;
        padding: 20px;
        // flex-shrink: 0;
        background-color: #fff;
        border: 1px solid #e5e8ef;
        border-radius: 4px;

        .leftcont {
          display: flex;
          flex-direction: column;
          width: 77%;
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

  .views {
    width: 96%;
    margin: 0 2% 30px 2%;
    padding: 7px 20px 20px 20px;
    background-image: url('./image/btn.png');
    border: 1px solid #e5e8ef;
    border-radius: 4px;

    .tooplist {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }

    .overlist {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .overlistdata {
        width: 15%;
        height: 100px;
        padding: 20px;
        background-color: #fff;
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
</style>
