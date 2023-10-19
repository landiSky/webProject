<template>
  <t-modal
    v-model:visible="visible"
    :width="742"
    :height="642"
    :on-before-ok="onConfirm"
    body-class="modals"
    :closable="false"
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
                <img :src="Auth" alt="" style="width: 100%; height: 100%"
              /></p>
              <div class="headerstate">
                <p style="color: #000; font-weight: 500">企业认证</p>
                <p :class="[stateles === 0 ? 'authenticated' : 'notcertified']"
                  >已认证</p
                >
              </div>
            </div>
            <div style="float: left; width: 100%; color: #000"
              >完成企业认证后可进行</div
            >
            <div class="a21" style="">
              <span
                style="
                  float: left;
                  width: 100px;
                  height: 100px;

                  /* margin: 0 auto; */
                "
              >
                <img
                  :src="left01"
                  alt=""
                  style="width: 100%; height: 100%; margin: -33px 0 0 -20px"
                />
              </span>
              <div style="float: left; margin: 10px 0 0 -51px; color: #4e5969">
                <p>上架应用/服务，在整个标识领</p>
                <span>域推广应用/服务</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightauth"> 11111</div>
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
import Auth from '@/assets/images/home/auth.png';
import left01 from '@/assets/images/home/left01.png';
import left02 from '@/assets/images/home/left02.png';
// import { roleUpdate, roleAdd } from '@/api/role-manage';
// import { Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);
// 认证状态
const stateles = ref(0);
// 弹窗状态
const visible = ref(true);
const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    roleName: undefined,
    roleDesc: undefined,
    phone: undefined,
  },
});
onMounted(() => {
  if (isEdit.value) {
    // 这里分两种情况
    // 一是编辑信息从列表传入
    const { roleName, roleDesc, phone } = props.data;
    state.formModel = { roleName, roleDesc, phone };

    // 二是从接口获取
    // getDetail();
  }
});
</script>

<style scoped lang="less">
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

          .a21 {
            float: left;
            width: 100%;
            height: 100px;
            margin: 20px auto;
            background-color: #fff;
          }
        }
      }
    }

    .rightauth {
      width: 48%;
      // background-color: red;
      background-image: url('@/assets/images/home/backright.png');
      background-size: cover;
    }
  }
}
</style>
