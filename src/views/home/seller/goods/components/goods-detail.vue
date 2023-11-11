<template>
  <t-modal
    v-model:visible="showModal"
    fullscreen
    title-align="start"
    :closable="false"
    :on-before-ok="onConfirm"
    :body-style="{ padding: 0 }"
    class="fullscreen-modal"
    :footer="props.data.status != StatusEnum.DSH"
    @cancel="emit('cancel')"
    @close="emit('cancel')"
  >
    <template #title>
      <div style="width: 100%; text-align: center"> 商品详情 </div>
    </template>
    <template #footer>
      <div class="footer">
        <t-button v-if="props.data.status === StatusEnum.YBH" type="primary"
          >编辑</t-button
        >
        <t-button v-if="props.data.status === StatusEnum.YBH">删除</t-button>
        <t-button v-if="props.data.status === StatusEnum.WSJ" type="primary"
          >上架</t-button
        >
        <t-button
          v-if="props.data.status === StatusEnum.WSJ"
          type="outline"
          @click="clickPreview"
          >预览</t-button
        >
        <t-button v-if="props.data.status === StatusEnum.WSJ">编辑</t-button>
        <t-button v-if="props.data.status === StatusEnum.WSJ">删除</t-button>

        <t-button v-if="props.data.status === StatusEnum.YSJ" type="primary"
          >查看</t-button
        >
        <t-button
          v-if="props.data.status === StatusEnum.YSJ"
          type="primary"
          status="danger"
          >下架</t-button
        >
      </div>
    </template>
    <div>
      <div class="status-div" :style="{ backgroundColor: statusColor }">
        <iconpark-icon
          v-if="props.data.status === StatusEnum.YSJ"
          name="success"
        ></iconpark-icon>
        <iconpark-icon
          v-if="props.data.status === StatusEnum.YBH"
          name="error"
        ></iconpark-icon>
        <iconpark-icon
          v-if="props.data.status === StatusEnum.WSJ"
          name="alert"
        ></iconpark-icon>
        <iconpark-icon
          v-if="props.data.status === StatusEnum.DSH"
          name="wait"
        ></iconpark-icon>
        <div style="margin-left: 8px">
          商品状态：{{ StatusEnum[props.data.status] }}。
        </div>
        <div v-if="props.data.status === StatusEnum.DSH">
          通过审核后，将同时在本平台和标识网络其他平台同步上架。</div
        >
        <div v-if="props.data.status === StatusEnum.YBH">
          驳回原因：{{ props.data.rejectReason }}</div
        >
      </div>

      <div class="modal-body">
        <div class="archor"
          ><t-affix :offset-top="180">
            <t-anchor>
              <t-anchor-link href="#base">基本信息</t-anchor-link>
              <t-anchor-link href="#sale">售卖设置</t-anchor-link>
              <t-anchor-link
                v-for="(_, index) of saleTypeList"
                :key="index"
                :href="'#st' + index"
              >
                交付版本{{ index + 1 }}
              </t-anchor-link>
            </t-anchor>
          </t-affix></div
        >
        <div class="content">
          <div class="center">
            <t-descriptions
              id="base"
              title="基本信息"
              :title-style="{
                fontSize: '14px',
                lineHeight: '22px',
                marginBottom: '16px',
              }"
              :title-divider-style="{ height: '12px' }"
              :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
              size="medium"
              :column="1"
            >
              <t-descriptions-item label="商品名称">
                {{ '我是商品名称' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品ID">
                {{ '202210191918239103' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品Logo">
                <img
                  class="first-img"
                  src=""
                  style="width: 158px; height: 100px; background-color: #999"
                />
              </t-descriptions-item>
              <t-descriptions-item label="详情展示图">
                <img
                  class="first-img"
                  src=""
                  style="width: 158px; height: 100px; background-color: #999"
                />
                <img
                  src=""
                  style="width: 158px; height: 100px; background-color: #999"
                />
              </t-descriptions-item>
              <t-descriptions-item label="商品分类">
                {{ '硬件/智能硬件' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品标签">
                {{ '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="应用类型">
                {{ '标识应用（用户使用前需开通企业节点）' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品简介">
                {{
                  '这个商品是一个智能硬件，它的特点是XXXXX，这个商品是一个智能硬件，它的特点是XXXXX这个商品是一个智能硬件，它的特点是XXXXX这个商品是一个智能硬件，它的特点是XXXXX这个商品是一个智能硬件，它的特点是XXXXX。'
                }}
              </t-descriptions-item>
              <t-descriptions-item label="产品使用说明">
                {{ '《我是产品使用说明》' }}
              </t-descriptions-item>
              <t-descriptions-item label="详情展示信息">
                {{ '商品优势、产品架构、产品功能、应用场景' }}
              </t-descriptions-item>
            </t-descriptions>
            <t-descriptions
              id="sale"
              title="售卖设置"
              :title-style="{
                fontSize: '14px',
                lineHeight: '22px',
                marginBottom: '16px',
              }"
              :title-divider-style="{ height: '12px' }"
              :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
              size="medium"
              :column="1"
            >
              <t-descriptions-item label="服务交付类型">
                {{ 'SAAS类 《SAAS类应用对接指南》' }}
              </t-descriptions-item>
              <t-descriptions-item label="应用服务地址">
                {{ '136.125.23.21' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品定价方式">
                {{ '套餐定价(账号+时长)' }}
              </t-descriptions-item>
            </t-descriptions>
            <t-descriptions
              v-for="(st, index) of saleTypeList"
              :id="'st' + index"
              :key="index"
              :title="'交付版本' + (index + 1)"
              :title-style="{
                fontSize: '14px',
                lineHeight: '22px',
                marginBottom: '16px',
              }"
              :title-divider-style="{ height: '12px' }"
              :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
              size="medium"
              :column="1"
            >
              <t-descriptions-item label="交付版本名称">
                {{ '标准版' }}
              </t-descriptions-item>
              <t-descriptions-item v-if="index === 0" label="套餐定价设置">
                <div v-for="p of priceList" :key="p">
                  套餐{{ p }}：账号数 5 个，账号单价 999 元</div
                >
              </t-descriptions-item>
              <t-descriptions-item v-if="index === 0" label="可选购买时长">
                {{ '1个月 6个月' }}
              </t-descriptions-item>
              <t-descriptions-item v-if="index === 1" label="一口价金额">
                {{ '999元' }}
              </t-descriptions-item>
              <t-descriptions-item label="应用秘钥">
                <t-link>下载密钥文件</t-link>
              </t-descriptions-item>
            </t-descriptions>
          </div>
        </div>
      </div>
    </div>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
// import { usersDetail, usersAdd, usersUpdate } from '@/api/user-depart';
import { Message } from '@tele-design/web-vue';

// 状态
const StatusEnum: { [name: string]: any } = {
  WSJ: 0,
  DSH: 1,
  YBH: 2,
  YSJ: 3,
  0: '未上架',
  1: '待审核',
  2: '已驳回',
  3: '已上架',
};

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['confirm', 'cancel', 'preview']);
const showModal = ref(true);
const formRef = ref();

const saleTypeList = ref([1, 2, 3]);
const priceList = ref([1, 2, 3]);

const formModel = ref({
  username: null,
  deptId: undefined,
  password: null,
  nickName: null,
  sex: null,
  roleIds: [],
  email: null,
  phone: null,
  comments: null,
});

const formRules = {
  nickName: [
    { required: true, message: '请输入姓名' },
    { maxLength: 20, message: '长度不超过20个字符' },
  ],
  comments: [{ maxLength: 200, message: '长度不超过200个字符' }],
};

const goback = () => {
  emit('cancel');
};

const getDetail = () => {
  // 调后端接口
  // loading.value = true;
  // usersDetail({ id: props.data?.id })
  //   .then((res) => {
  //     formModel.value = res || {};
  //     formModel.value.roleIds = res?.roles.map(
  //       (item: { [name: string]: any }) => item.id
  //     );
  //   })
  //   .catch(() => {})
  //   .finally(() => {
  //     loading.value = false;
  //   });
};

const statusColor = computed(() => {
  if (props.data.status === StatusEnum.YSJ) {
    return '#E8F4FF';
  }
  if (props.data.status === StatusEnum.YSJ) {
    return '#FFECE8';
  }
  return '#FFFAE8';
});

onMounted(() => {
  console.log(props.data);
  if (props.data?.id) {
    getDetail();
  }
});

// 预览
const clickPreview = () => {
  if (props.data?.id) {
    emit('preview', props.data?.id);
  }
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      // 调后端接口
      // const api = props.data.id ? usersUpdate : usersAdd;
      // api(formModel.value)
      //   .then(() => {
      //     emit('confirm');
      //     Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
      //     done(true);
      //   })
      //   .catch(() => {
      //     done(false);
      //   });

      // mock数据
      Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
      done(true);
    } else {
      done(false);
    }
  });
};

// 下架操作
const onBeforeOkDown = (done: any) => {
  // TODO 调后端接口
  // deleteIdentify(deleteId.value)
  //   .then(() => {
  //     done(true);
  //     Message.success('删除成功!');
  //     refresh();
  //   })
  //   .catch(() => {
  //     done(false);
  //   });
  // mock数据
  done(true);
  Message.success('商品已下架');
  emit('confirm');
};
</script>

<style lang="less" scoped>
.status-div {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 62px;
}

.modal-body {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  padding: 24px 20px;
  overflow: auto;
  background-color: #fff;

  .archor {
    z-index: 999;
    width: 70px;
    margin-left: 80px;
  }

  .content {
    display: flex;
    flex: 1;
    justify-content: center;
    margin-right: 150px;

    .center {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: start;
      width: 632px;
    }
  }
}

.footer {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
