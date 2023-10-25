<template>
  <div class="overview">
    <div class="centers">
      <div class="datalist">
        <div class="dataimg">
          <img :src="empty" alt="" />
        </div>
        <div class="datatitle">您还没有完成服务商认证，认证后即可查看详情</div>
        <div class="databutton">
          <t-button type="primary" @click="authentications">立即认证</t-button>
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
      @cancel="gotoverifys = false"
    >
    </EditModalFullscreen>
    <!-- 详情弹窗 -->
    <DetailsModalFullscreen
      v-if="detailflag"
      :data="state.editData"
      @confirm="onEditModalConfirmflag"
      @cancel="detailflag = false"
    >
    </DetailsModalFullscreen>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import empty from '@/assets/images/home/empty.png';
import EditModal from './components/edit-modal.vue';
import EditModalFullscreen from './components/edit-modal-fullscreen.vue';
import DetailsModalFullscreen from './components/details-modal-fullscreen.vue';

const state = reactive({
  editData: {},
});
// 立即认证弹窗
const editModalVisible = ref(false);
// 去认证弹窗
const gotoverifys = ref(false);
// 详情弹窗
const detailflag = ref(false);
// 立即认证
const authentications = () => {
  console.log(editModalVisible.value);
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
  console.log(detailflag.value);
};
// 认证填写完成
const onEditModalConfirmcode = () => {
  gotoverifys.value = false;
};
//  修改认证信息
const onEditModalConfirmflag = () => {
  detailflag.value = false;
  gotoverifys.value = true;
};
</script>

<style scoped lang="less">
.overview {
  width: 100%;
  height: 100%;

  .centers {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .datalist {
      width: 300px;
      height: 300px;
      // background-color: pink;
      .dataimg {
        display: flex;
        justify-content: center;
      }

      .datatitle {
        margin: 32px auto;
        // text-align: center;
      }

      .databutton {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
