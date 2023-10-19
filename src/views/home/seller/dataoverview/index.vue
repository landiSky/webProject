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
    <EditModal
      v-if="editModalVisible"
      :data="state.editData"
      @confirm="onEditModalConfirm"
      @cancel="editModalVisible = false"
    ></EditModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import empty from '@/assets/images/home/empty.png';
import EditModal from './components/edit-modal.vue';

const state = reactive({
  editData: {},
});

const editModalVisible = ref(true);
// 立即认证
const authentications = () => {
  editModalVisible.value = true;
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
