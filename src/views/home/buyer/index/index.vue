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
            <p class="name">张伟</p>
            <div class="inofs">
              <p>北京泰尔英福有限公司</p><p>|</p><p>主账号</p><p>|</p
              ><p :class="[stateles === 0 ? 'authenticated' : 'notcertified']"
                >已认证</p
              >
            </div>
          </div>
        </div>
        <!-- 使用指导 -->
        <div class="direction">
          <div class="dirleft">
            <div class="titleleft">
              <h3 style="margin-bottom: 24px">使用指导 </h3>
              <div class="dirlist">
                <div>
                  <img :src="group1" alt="" />
                  <span style="float: left; margin-top: 3px">完成企业认证</span>
                  <div class="btns">
                    <p> 确认企业身份</p>
                    <t-button type="text" @click="authentication"
                      >去认证</t-button
                    >
                    <div class="states">
                      <p
                        style="width: 50px; text-align: center"
                        :class="[
                          stateles === 0 ? 'authenticated' : 'notcertified',
                        ]"
                        >已认证</p
                      >
                      <span style="font-size: 12px"
                        ><t-button type="text" @click="viewdetails"
                          >查看详情</t-button
                        ></span
                      >
                    </div>
                  </div>
                </div>
                <div>
                  <p class="ition"></p>

                  <img :src="group2" alt="" />
                  <span style="float: left; margin-top: 3px">企业成员管理</span>
                  <div class="btns">
                    <p> 管理企业组织架构&成员权限</p>
                    <t-button type="text" @click="distributionrole">
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
                    <p> 搜索购买开通应用</p>
                    <t-button type="text" @click="tomall">去应用商城 </t-button>
                    <!-- <p> 去应用商城</p> -->
                  </div>
                </div>
                <div>
                  <p class="ition"></p>

                  <img :src="group4" alt="" />
                  <span style="float: left; margin-top: 3px">企业成员管理</span>
                  <div class="btns">
                    <p> 应用配置，使用应用</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="firmright">
            <div class="firm">
              <div style="float: left; margin-right: 6px">企业节点认证</div
              ><span
                :class="[stateles === 0 ? 'authenticated' : 'notcertified']"
                >已认证</span
              >
            </div>
            <div style="float: left; width: 80%; font-size: 12px">
              <p>开通权益</p>
              <ul style="line-height: 15px">
                <li> <span></span><span>免费使用热门应用</span> </li>
                <li> <span></span><span>自动完成企业认证</span> </li>
                <li> <span></span><span>使用标识服务</span> </li>
                <li>
                  <span></span
                  ><span>使用标识解析类应用需先完成企业节点认证</span>
                </li>
              </ul>
              <div>
                <t-button
                  type="primary"
                  style="display: block; margin: 0 auto"
                  @click="authentication"
                  >去认证</t-button
                ></div
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 热门应用服务 -->
    <div class="content">
      <h3>热门应用服务</h3>
      <div class="catimg">
        <!-- :indicator-type="indicatorType"
          :indicator-position="indicatorPosition" -->
        <t-carousel
          :style="{
            width: '100%',
            height: '240px',
          }"
        >
          <t-carousel-item v-for="image in images" :key="image">
            <!-- <img
              :src="image"
              :style="{
                width: '100%',
              }"
            /> -->
            <div class="catimglist">
              <div class="catimglistleft">
                <div style="width: 30%">
                  <img :src="frame" alt="" style="width: 100%; height: 100%" />
                </div>
                <div class="leftcont">
                  <div class="tophead"
                    ><p>企业统计台账</p
                    ><p style="color: #1664ff" @click="togo"> 前往 》</p></div
                  >
                  <div style="height: 55%"
                    >支持多底层类型子链接入骨干节点，提供多种接入方式，为用户提供加入子链的通道共建子链。支持多底层类型子链接入骨干节点，提供多种接入方式，为用户提供加入子链的通道共建子链。
                  </div>
                  <div class="tophead"
                    ><p style="color: #1664ff" @click="configurationapp"
                      >配置应用</p
                    ><p style="color: #86909c" @click="instructionsuse">
                      使用说明</p
                    ></div
                  >
                </div>
              </div>
              <div class="catimglistright">
                <div style="width: 30%">
                  <img :src="frame" alt="" style="width: 100%; height: 100%" />
                </div>
                <div class="leftcont">
                  <div class="tophead"
                    ><p>企业统计台账</p
                    ><p style="color: #1664ff" @click="togo"> 前往 》</p></div
                  >
                  <div style="height: 55%"
                    >支持多底层类型子链接入骨干节点，提供多种接入方式，为用户提供加入子链的通道共建子链。支持多底层类型子链接入骨干节点，提供多种接入方式，为用户提供加入子链的通道共建子链。
                  </div>
                  <div class="tophead"
                    ><p style="color: #1664ff" @click="configurationapp"
                      >配置应用</p
                    ><p style="color: #86909c" @click="instructionsuse">
                      使用说明</p
                    ></div
                  >
                </div>
              </div>
            </div>
          </t-carousel-item>
        </t-carousel>
      </div>
    </div>
    <!-- 已购应用 -->
    <div class="purchased">
      <h3>已购应用</h3>
      <div class="Applysd">
        <div
          v-for="(item, index) in authDialogVisible"
          :key="index"
          class="purchasedlist"
        >
          <div style="width: 20%">
            <img :src="frame" alt="" style="width: 100%; height: 100%" />
          </div>
          <div class="leftcont">
            <div class="tophead"
              ><p>{{ item.name }}</p
              ><p style="color: #1664ff" @click="togo"> 前往 》</p></div
            >
            <div style="height: 35%"
              >支持多底层类型子链接入骨干节点，提供多种接入方式，为用户提供加入子链的通道共建子链。支持多底层类型子链接入骨干节点，提供多种接入方式，为用户提供加入子链的通道共建子链。
            </div>
            <div class="tophead"
              ><p style="color: #1664ff" @click="configurationapp">配置应用</p
              ><p style="color: #86909c" @click="instructionsuse">
                使用说明</p
              ></div
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 订单概览 -->
    <div class="views">
      <div class="tooplist">
        <h3>订单概览</h3>
        <p @click="multiples">更多</p>
      </div>
      <div class="overlist">
        <div v-for="(item, index) in 6" :key="index" class="overlistdata">
          <div>
            <span
              style="
                display: block;
                width: 100%;
                margin-bottom: 15px;
                color: #86909c;
                font-size: 14px;
              "
              >全部订单</span
            >
            <span style="font-size: 30px">1000000</span>
          </div>
        </div>
      </div>
    </div>
    <!-- :data="{ starlist }" -->
    <EditModalAlter
      v-if="editModalVisiblealter"
      :data="starlist"
      @confirm="onEditModalConfirmAlter"
      @cancel="editModalVisiblealter = false"
    >
    </EditModalAlter>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
// 头像
import avatar from './image/avatar.png';
import group1 from './image/group1.png';
import group2 from './image/group2.png';
import group3 from './image/group3.png';
import group4 from './image/group4.png';
import frame from './image/frame.png';
import EditModalAlter from './components/edit-modal-alter.vue';

const starlist = reactive(['张三', '李四']);
// 认证状态
const stateles = ref(0);
// 配置应用 弹窗
const editModalVisiblealter = ref(false);
// 轮播图数据
const images = reactive([
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
]);

// //已购应用
const authDialogVisible = reactive([
  {
    name: '章三1',
  },
  {
    name: '章三2',
  },
  {
    name: '章三3',
  },
  {
    name: '章三4',
  },
  {
    name: '章三5',
  },
  {
    name: '章三6',
  },
  {
    name: '章三7',
  },
]);
// 去认证
const authentication = () => {};
// 查看详情
const viewdetails = () => {};
// 邀请成员/分配权限
const distributionrole = () => {};
// 去商城
const tomall = () => {};
// 前往
const togo = () => {};
// 配置应用
const configurationapp = () => {
  editModalVisiblealter.value = true;
};
// 配置应用 确定
const onEditModalConfirmAlter = () => {
  editModalVisiblealter.value = false;
};
// 使用说明
const instructionsuse = () => {
  // const url = `http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf`;
  // window.open(url, '_blank');
};
// 更多
const multiples = () => {};
</script>

<style scoped lang="less">
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

      .imgs {
        float: left;
        width: 44px;
        height: 44px;
        margin: 18px 0 0 20px;
      }

      .rights {
        float: left;
        height: 44px;
        margin: 5px 0 0 10px;

        .name {
          height: 0;
        }

        .inofs {
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
          }

          p:nth-child(3) {
            margin-right: 9px;
            color: #86909c;
          }

          p:nth-child(4) {
            margin-right: 9px;
            color: #86909c;
          }

          p:nth-child(5) {
            padding: 3px;
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
      }
    }

    .direction {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 220px;

      .dirleft {
        width: 80%;
        height: 100%;
        background-color: #fff;
        border: 1px solid #e5e8ef;

        .titleleft {
          padding: 0 0 0 20px;

          .dirlist {
            display: flex;
            justify-content: space-between;
            width: 90%;

            ::v-deep .tele-btn-size-medium {
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
        width: 17%;
        height: 100%;
        padding: 15px 0 0 30px;
        background-color: #fff;

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

      ::v-deep .tele-carousel-arrow-left {
        top: 106%;
        left: 44%;
        background: transparent;
      }

      ::v-deep .tele-carousel-arrow-right {
        top: 106%;
        right: 45%;
        background: transparent;
      }

      ::v-deep .tele-carousel-arrow-left > svg {
        color: #56555f;
        font-weight: 600;
        font-size: 20px;
      }

      ::v-deep .tele-carousel-arrow-right > svg {
        color: #56555f;
        font-weight: 600;
        font-size: 20px;
      }

      ::v-deep .tele-carousel-indicator-wrapper-bottom {
        bottom: -35px;
        background: transparent;
      }

      ::v-deep .tele-carousel-indicator {
        display: flex;
        align-items: center;
      }

      ::v-deep .tele-carousel-indicator-item {
        width: 8px;
        height: 8px;
        margin-right: 16px;
        background-color: #84adff;
        border-radius: 0;
        transform: rotate(45deg);
        transform-origin: center center;
      }

      ::v-deep .tele-carousel-indicator-item-active {
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

    .tooplist {
      display: flex;
      justify-content: space-between;
    }

    .overlist {
      display: flex;
      justify-content: space-around;
      width: 100%;

      .overlistdata {
        width: 15%;
        height: 100px;
        padding: 20px;
        background-color: #fff;
      }
    }
  }
}
</style>
