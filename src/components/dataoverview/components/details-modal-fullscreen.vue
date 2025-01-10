<template>
  <div id="modalDetails" class="modalDetailsde">
    <t-modal
      v-model:visible="showModal"
      fullscreen
      title-align="start"
      :closable="false"
      popup-container="#modalDetails"
      :footer="null"
      @back="goback"
    >
      <!-- :on-before-ok="onConfirm"
    @cancel="emit('cancel')" -->
      <template #title>
        <!-- <span class="title-left" @click="goback">
        <icon-left />
        <span>返回</span>
      </span> -->
        <span style="margin-left: 46%">
          {{ data.id ? '企业认证' : '企业认证' }}
        </span>
      </template>

      <div class="modal-body">
        <div
          v-if="detaillist.certificateStatus === 2"
          class="toperror"
          style=""
        >
          <div style="width: 40%" class="topcenters">
            <div class="topleft"
              ><p style="width: 100%"
                ><img
                  :src="Error"
                  alt=""
                  style="float: left; margin: 1px 5px 0 0"
                /><span style="float: left; font-size: 14px"
                  >认证已驳回，请修改后重新提交认证。</span
                ></p
              >
              <p style="float: left; margin-top: 5px"
                >驳回原因：{{ detaillist.remark }}</p
              >
              <!-- <p style="float: left; margin-top: 5px">
                <t-typography-paragraph
                  style="float: left"
                  :ellipsis="{
                    rows: 2,
                    showTooltip: true,
                  }"
                >
                  驳回原因:
                  {{ detaillist.remark }}
                </t-typography-paragraph>
              </p> -->
            </div>
            <div class="topright" style="display: flex; align-items: center">
              <t-button type="primary" @click="editmessage"
                >修改认证信息</t-button
              >
            </div>
          </div>
        </div>

        <div v-if="detaillist.certificateStatus === 0" class="topwarn">
          <div style="width: 40%" class="topcenterswarn">
            <div class="topleft"
              ><p style="width: 100%"
                ><img
                  :src="Warn"
                  alt=""
                  style="float: left; margin: 1px 5px 0 0"
                /><span style="float: left; font-size: 14px"
                  >企业认证正在审核中，请耐心等待。</span
                ></p
              >
            </div>
          </div>
        </div>

        <div class="centers">
          <div class="asjhdg" style="margin-top: 15px">
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
            <div class="information">
              <div class="informationlist">
                <p style="float: left; width: 108px">企业名称</p>
                <p style="float: left">{{ detaillist.companyName }}</p>
              </div>
              <div class="informationlist">
                <p style="float: left; width: 108px">统一社会信用代码</p>
                <p style="float: left">{{ detaillist.creditCode }}</p>
              </div>
              <!--测试1 企业地址-->
              <div class="informationlist">
                <p style="float: left; width: 108px">企业地址</p>
                <p style="float: left"
                  >{{ detaillist?.orgAddrProvinceValue }}/{{
                    detaillist?.orgAddrCityValue
                  }}{{ detaillist?.orgAddrCountyValue ? '/' : ''
                  }}{{ detaillist?.orgAddrCountyValue }}</p
                >
              </div>
              <div class="informationlist">
                <p style="float: left; width: 108px">&nbsp;</p>
                <p style="float: left; width: 60%; word-break: normal">
                  {{ detaillist?.orgAddr }}
                </p>
              </div>
              <div class="informationlist">
                <p style="float: left; width: 108px">法人姓名</p>
                <p style="float: left">{{ detaillist.legalPersonName }}</p>
              </div>
              <div class="informationlist">
                <p style="float: left; width: 108px">营业执照</p>
                <div style="display: flex; width: 170px; height: 100px">
                  <img
                    style="width: 100%; height: 100%"
                    :src="`/server/web/file/download?name=${detaillist.businessLicense}`"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <div style="float: left; margin: 20px 0 10px 0"
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
                >联系人信息</span
              ></div
            >
            <div class="information">
              <div class="informationlist">
                <p style="float: left; width: 108px">联系人姓名</p>
                <p style="float: left">{{ detaillist.contactName }}</p>
              </div>
              <div class="informationlist">
                <p style="float: left; width: 108px">联系人身份证号</p>
                <p style="float: left">{{ detaillist.contactIdCard }}</p>
              </div>
              <div class="informationlist">
                <p style="float: left; width: 108px">联系人身份证</p>
                <div style="display: flex">
                  <div
                    style="
                      display: flex;
                      width: 170px;
                      height: 100px;
                      margin-right: 10px;
                    "
                  >
                    <img
                      style="width: 100%; height: 100%"
                      :src="`/server/web/file/download?name=${detaillist.idCardz}`"
                      alt=""
                    />
                  </div>
                  <div style="display: flex; width: 170px; height: 100px">
                    <img
                      style="width: 100%; height: 100%"
                      :src="`/server/web/file/download?name=${detaillist.idCardf}`"
                      alt=""
                    />
                  </div>
                </div>
                <!-- <img
                  style="width: 170px; height: 100px; margin-right: 10px"
                  :src="`/server/web/file/download?name=${detaillist.idCardz}`"
                  alt=""
                />
                <img
                  style="width: 170px; height: 100px"
                  :src="`/server/web/file/download?name=${detaillist.idCardf}`"
                  alt=""
                /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <template #footer>
      <div style="margin-left: 33%; text-align: left">
        <t-button type="primary" style="margin-right: 20px" @click="onConfirm"
          >完成</t-button
        >
        <t-button @click="canceldes">取消</t-button>
      </div>
    </template> -->
    </t-modal>
  </div>
</template>

<script lang="ts" setup>
import Error from '@/assets/images/home/Error.png';
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { authDetails } from '@/api/authentication';
import { Message } from '@tele-design/web-vue';
import Warn from '@/assets/images/home/warn.png';

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);

// import { PropertyDescriptorParsingType } from 'html2canvas/dist/types/css/IPropertyDescriptor';

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
});
const detaillist = ref({
  id: '',
  userId: '',
  companyName: '',
  creditCode: '',
  contactName: '',
  contactIdCard: '',
  idCardf: '',
  idCardz: '',
  legalPersonName: '',
  type: 1,
  businessLicense: '',
  certificateStatus: null,
  remark: '驳理由',
  orgAddr: '',
  orgAddrCity: '',
  orgAddrCounty: '',
  orgAddrProvince: '',
  orgAddrCityValue: '',
  orgAddrCountyValue: '',
  orgAddrProvinceValue: '',
});

const emit = defineEmits(['confirm', 'cancel']);
const showModal = ref(true);
const formRef = ref();

const goback = () => {
  // showModal.value = false;
  emit('cancel');
};

const getUserDetail = () => {
  // 调后端接口
  authDetails({ companyId: String(userInfoByCompany.value?.companyId) }).then(
    (res) => {
      // @ts-ignore
      detaillist.value = res;
    }
  );
};
// 修改认证信息
const editmessage = () => {
  emit('confirm');
};

onMounted(() => {
  // if (props.data?.id) {
  getUserDetail();
  // }
});
</script>

<style lang="less" scoped>
.title-left {
  margin-left: 10px;
  cursor: pointer;

  span {
    margin-left: 15px;
  }
}

.modalDetailsde {
  :deep(.tele-modal-body) {
    padding: 0;
  }
}

.modal-body {
  // display: flex;
  // justify-content: center;
  height: 100%;
  padding-top: 0;
  overflow: auto;
  background-color: #fff;

  .tele-form {
    max-width: 652px;
  }

  .centers {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;

    .asjhdg {
      width: 40%;
      height: 100%;
      // background-color: red;
      .information {
        float: left;
        width: 100%;
        margin-top: 15px;

        .informationlist {
          float: left;
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
  }

  .toperror {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 90px;
    background-color: #ffece8;

    .topcenters {
      display: flex;
      justify-content: space-between;
    }
  }

  .topwarn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 62px;
    background-color: #fffae8;

    .topcenterswarn {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
