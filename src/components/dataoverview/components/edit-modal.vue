<template>
  <t-modal
    v-model:visible="visible"
    :width="742"
    :height="520"
    body-class="modals"
    :closable="true"
    :footer="false"
    @cancel="emit('cancel')"
  >
    <template #title> 服务商认证指南 </template>
    <div class="centfe">
      <div class="leftauth">
        <div class="leftimg">
          <div class="autocenter">
            <div class="header">
              <p
                style="
                  float: left;
                  width: 72px;
                  height: 72px;
                  margin-right: 10px;
                "
              >
                <img :src="auth" alt="" style="width: 100%; height: 100%"
              /></p>
              <div class="headerstate">
                <p>企业认证</p>
                <p
                  style="width: 50px; margin-top: 10px"
                  :class="
                    companyState2class[userInfoByCompany.certificateStatus]
                  "
                  >{{
                    CompanyAuthStatusDESC[userInfoByCompany.certificateStatus]
                  }}</p
                >
              </div>
            </div>
            <div
              style="
                float: left;
                width: 100%;
                margin-top: 10px;
                color: #000;
                font-size: 14px;
              "
              >完成企业认证后可进行</div
            >
            <div class="deslist">
              <span style="float: left; width: 100px; height: 100px">
                <img
                  :src="left01"
                  alt=""
                  style="width: 100%; height: 100%; margin: -33px 0 0 -20px"
                />
              </span>
              <div
                style="
                  float: left;
                  margin: 20px 0 0 -31px;
                  color: #4e5969;
                  font-size: 14px;
                "
              >
                <p>上架应用/服务，在整个标识领</p>
                <span>域推广应用/服务</span>
              </div>
            </div>
            <div class="deslist">
              <span style="float: left; width: 100px; height: 100px">
                <img
                  :src="left02"
                  alt=""
                  style="width: 100%; height: 100%; margin: -33px 0 0 -20px"
                />
              </span>
              <div
                style="
                  float: left;
                  margin: 20px 0 0 -31px;
                  color: #4e5969;
                  font-size: 14px;
                "
              >
                <p>上架应用/服务，在整个标识领</p>
                <span>域推广应用/服务</span>
              </div>
            </div>
            <div class="desdetails">
              <p style="color: #86909c; font-size: 14px; line-height: 32px">{{
                longCompanyDesc[userInfoByCompany.certificateStatus]
              }}</p>
              <p
                v-if="
                  [
                    CompanyAuthStatus.TO_CHECK,
                    CompanyAuthStatus.REJECT,
                  ].includes(userInfoByCompany.certificateStatus)
                "
              >
                <t-button
                  type="primary"
                  style="margin-left: 20px; padding: 7px 15px"
                  @click="firmgotoverify"
                  >查看详情</t-button
                ></p
              >
              <p
                v-if="
                  userInfoByCompany.certificateStatus ===
                  CompanyAuthStatus.UNAUTH
                "
              >
                <t-button
                  type="primary"
                  style="margin-left: 20px; padding: 7px 15px"
                  @click="viewdetails"
                  >去认证</t-button
                ></p
              >
            </div>
          </div>
        </div>
      </div>
      <div class="rightauth">
        <div class="leftimg">
          <div class="autocenter">
            <div class="header">
              <p
                style="
                  float: left;
                  width: 72px;
                  height: 72px;
                  margin-right: 10px;
                "
              >
                <img :src="rightlog" alt="" style="width: 100%; height: 100%"
              /></p>
              <div class="headerstate">
                <p>企业节点认证</p>
                <p
                  style="width: 50px; margin-top: 10px"
                  :class="nodeState2class[userInfoByCompany.nodeStatus]"
                  >{{ NodeAuthStatusDESC[userInfoByCompany.nodeStatus] }}</p
                >
              </div>
            </div>
            <div
              style="
                float: left;
                width: 100%;
                margin-top: 10px;
                color: #000;
                font-size: 14px;
              "
              >完成企业认证后可进行</div
            >
            <div class="deslist">
              <span style="float: left; width: 40px; height: 40px">
                <img :src="right01" alt="" style="width: 100%; height: 100%" />
              </span>
              <div
                style="
                  float: left;
                  margin: 18px 0 0 24px;
                  color: #4e5969;
                  font-size: 14px;
                "
              >
                <p>免费使用热门应用</p>
                <!-- <span>域推广应用/服务</span> -->
              </div>
            </div>
            <div class="deslist">
              <span style="float: left; width: 100px; height: 100px">
                <img
                  :src="right02"
                  alt=""
                  style="width: 100%; height: 100%; margin: -33px 0 0 -20px"
                />
              </span>
              <div
                style="
                  float: left;
                  margin: 20px 0 0 -31px;
                  color: #4e5969;
                  font-size: 14px;
                "
              >
                <p style="color: #0ac8d2">自动完成企业认证</p>
                <!-- <span>域推广应用/服务</span> -->
              </div>
            </div>
            <div class="deslist">
              <span style="float: left; width: 40px; height: 40px">
                <img :src="right03" alt="" style="width: 100%; height: 100%" />
              </span>
              <div
                style="
                  float: left;
                  margin: 18px 0 0 24px;
                  color: #4e5969;
                  font-size: 14px;
                "
              >
                <p>使用标识服务</p>
                <!-- <span>域推广应用/服务</span> -->
              </div>
            </div>

            <div class="desdetails">
              <p style="color: #86909c; font-size: 14px; line-height: 32px">{{
                longNodeDesc[userInfoByCompany.nodeStatus]
              }}</p>
              <p
                v-if="
                  [NodeAuthStatus.TO_CHECK, NodeAuthStatus.REJECT].includes(
                    userInfoByCompany.nodeStatus
                  )
                "
              >
                <t-button
                  type="primary"
                  style="margin-left: 20px; padding: 7px 15px"
                  @click="viewdetailsnode"
                  >查看详情</t-button
                ></p
              >
              <p v-if="NodeAuthStatus.UNAUTH === userInfoByCompany.nodeStatus">
                <t-button
                  type="primary"
                  style="padding: 7px 15px"
                  @click="nodegotoverify"
                  >去认证</t-button
                ></p
              >
            </div>
          </div>
        </div></div
      >
    </div>
  </t-modal>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  reactive,
  ref,
  onMounted,
  computed,
} from 'vue';

import { storeToRefs } from 'pinia';

import {
  CompanyAuthStatus,
  NodeAuthStatus,
  CompanyAuthStatusDESC,
  NodeAuthStatusDESC,
} from '@/enums/common';
// import {
//   CompanyAuthStatus,
//   NodeAuthStatus,
//   CompanyAuthStatusDESC,
//   NodeAuthStatusDESC,
// } from '@/enums/common';

import { authentication } from '@/api/authentication';

import { useUserStore } from '@/store/modules/user';

import auth from '@/assets/images/home/auth.png';
import left01 from '@/assets/images/home/left01.png';
import left02 from '@/assets/images/home/left02.png';
import right01 from '@/assets/images/home/right01.png';
import right02 from '@/assets/images/home/right02.png';
import right03 from '@/assets/images/home/right03.png';
import rightlog from '@/assets/images/home/rightlog.png';

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);
// userInfo.value?.companyId

const nodeState2class = {
  [NodeAuthStatus.TO_CHECK]: 'tobereviewed',
  [NodeAuthStatus.AUTHED]: 'authenticated',
  [NodeAuthStatus.REJECT]: 'override',
  [NodeAuthStatus.UNAUTH]: 'notcertified',
};

const longNodeDesc = {
  [NodeAuthStatus.TO_CHECK]: '您的认证申请正在审核中',
  [NodeAuthStatus.AUTHED]: '恭喜您已通过企业认证',
  [NodeAuthStatus.REJECT]: '您的认证申请被驳回',
  [NodeAuthStatus.UNAUTH]: '',
};

const longCompanyDesc = {
  [CompanyAuthStatus.TO_CHECK]: '您的认证申请正在审核中',
  [CompanyAuthStatus.AUTHED]: '恭喜您已通过企业认证',
  [CompanyAuthStatus.REJECT]: '您的认证申请被驳回',
  [CompanyAuthStatus.UNAUTH]: '',
};
const companyState2class = {
  [CompanyAuthStatus.TO_CHECK]: 'tobereviewed',
  [CompanyAuthStatus.AUTHED]: 'authenticated',
  [CompanyAuthStatus.REJECT]: 'override',
  [CompanyAuthStatus.UNAUTH]: 'notcertified',
};

const emit = defineEmits(['confirm', 'cancel', 'hasdflag']);

// 弹窗状态
const visible = ref(true);
// const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
// const state = reactive({
//   formModel: {
//     roleName: undefined,
//     roleDesc: undefined,
//     phone: undefined,
//   },
// });
const init = () => {
  authentication({ companyId: String(userInfoByCompany.value?.companyId) })
    .then((res) => {
      console.log(res, 'res');
      // stateles.value = res.data === undefined ? {} : res.data;
      // @ts-ignore
      stateles.value = res;
    })
    .catch((err) => {});
};
// 企业认证   去认证
const viewdetails = () => {
  emit('confirm');
};
// 企业认证 查看详情
const firmgotoverify = () => {
  emit('hasdflag');
};
// 企业节点认证 查看详情
const viewdetailsnode = () => {
  // console.log('aaa');
};
// 企业节点认证  去认证
const nodegotoverify = () => {};
onMounted(() => {
  // if (isEdit.value) {
  //   // 这里分两种情况
  //   // 一是编辑信息从列表传入
  //   const { roleName, roleDesc, phone } = props.data;
  //   state.formModel = { roleName, roleDesc, phone };
  //   // 二是从接口获取
  //   // getDetail();
  // }
  // init();
});
</script>

<style scoped lang="less">
// * {
//   margin: 0;
//   padding: 0;
//   list-style: none;
// }
.modals {
  width: 100%;
  // height: 100px;
  // background: red;
  .centfe {
    // height: 100px;
    display: flex;
    justify-content: space-between;
    width: 100%;

    .leftauth {
      width: 48%;
      background-image: url('@/assets/images/home/backleft.png');
      background-size: cover;

      .leftimg {
        width: 100%;
        height: 100%;

        .autocenter {
          width: 94%;
          margin: 0 auto;

          .header {
            width: 100%;

            .headerstate {
              float: left;
              margin-top: 8px;

              p:nth-child(1) {
                color: #000;
                font-weight: 500;
                font-size: 20px;
              }
              // 已认证
              .authenticated {
                color: #009a29;
                text-align: center;
                background-color: #e8ffea;
              }
              // 未认证
              .notcertified {
                color: #fa9600;
                text-align: center;
                background-color: #fffae8;
              }
              // 待审核
              .tobereviewed {
                color: #1664ff;
                text-align: center;
                background-color: #e8f4ff;
              }
              //以驳回
              .override {
                color: #e63f3f;
                text-align: center;
                background-color: #ffece8;
              }
            }
          }

          .deslist {
            float: left;
            width: 100%;
            height: 100px;
            margin: 20px auto 0;
            background-color: #fff;
          }

          .desdetails {
            display: flex;
            justify-content: flex-end;
            float: left;
            width: 100%;
            margin: 30px 0 20px 0;
          }
        }
      }
    }

    .rightauth {
      width: 48%;
      // background-color: red;
      background-image: url('@/assets/images/home/backright.png');
      background-size: cover;

      .leftimg {
        width: 100%;
        height: 100%;

        .autocenter {
          width: 94%;
          margin: 0 auto;

          .header {
            width: 100%;

            .headerstate {
              float: left;
              margin-top: 8px;

              p:nth-child(1) {
                color: #000;
                font-weight: 500;
                font-size: 20px;
              }
              // 已认证
              .authenticated {
                color: #009a29;
                text-align: center;
                background-color: #e8ffea;
              }
              // 未认证
              .notcertified {
                color: #fa9600;
                text-align: center;
                background-color: #fffae8;
              }
              // 待审核
              .tobereviewed {
                color: #1664ff;
                text-align: center;
                background-color: #e8f4ff;
              }
              //以驳回
              .override {
                color: #e63f3f;
                text-align: center;
                background-color: #ffece8;
              }
            }
          }

          .deslist {
            float: left;
            width: 100%;
            height: 60px;
            margin: 20px auto 0;
            background-color: #fff;
          }

          .desdetails {
            display: flex;
            justify-content: flex-end;
            float: left;
            width: 100%;
            margin: 30px 0 20px 0;
          }
        }
      }
    }
  }
}
</style>
