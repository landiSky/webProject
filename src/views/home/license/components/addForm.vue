<template>
  <t-drawer
    :title="props.title"
    :width="720"
    :visible="props.visible"
    :mask-closable="false"
    :drawer-body-style="{ padding: 0 }"
    @cancel="handleCancel"
  >
    <template #footer>
      <t-button @click="handleCancel">取消</t-button>
      <t-button @click="onPrev">上一步</t-button>
      <t-button type="primary" @click="onNext">下一步</t-button>
      <t-button type="primary" @click="handleConfirm">确认创建</t-button>
    </template>
    <div class="steps-width">
      <t-steps :current="current">
        <t-step>获取设备指纹码</t-step>
        <t-step>选择企业前缀</t-step>
        <t-step>填写申请信息</t-step>
      </t-steps>
    </div>
    <div class="drawer-body">
      <div class="steps-title">第一步：下载指纹获取工具</div>
      <div class="steps-illustrate">
        点击下载按钮将指纹获取工具下载到本地，也可自行在网络上下载其他指纹提取工具。
      </div>
      <div class="steps-button">
        <t-button type="primary">立即下载</t-button>
      </div>
      <div class="steps-title">第二步：指纹码采集</div>
      <div class="steps-illustrate">
        将工具包在装有企业节点的机器上运行，生成设备指纹码。
      </div>
      <div class="steps-title">第三步：输入设备指纹码</div>
      <div class="steps-illustrate">
        将设备指纹码在下方录入，最多可添加10条设备码。
      </div>
      <div>
        <t-table :columns="columns" :pagination="false" :data="data">
          <template #index="{ rowIndex }">
            {{ rowIndex + 1 }}
          </template>
          <template #fingerprint="{ rowIndex }">
            <t-input v-model="data[rowIndex]" placeholder="请输入" />
          </template>
          <template #operations="{ record }">
            <t-link @click="clickEditBtn(record)"> 删除 </t-link>
          </template>
        </t-table>
      </div>
    </div>
    <t-form
      ref="formRef"
      :model="form"
      :label-col-props="{ span: 3, offset: 0 }"
      :wrapper-col-props="{ span: 21 }"
    >
      <t-form-item
        field="appType"
        label="应用类型"
        :rules="[
          {
            required: true,
            validator: validateRadio,
            message: '应用类型不允许为空',
          },
        ]"
      >
        <t-radio-group v-model="form.appType">
          <t-radio :value="0">企业自建应用</t-radio>
          <t-radio :value="1">商城应用</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item
        field="appName"
        label="应用名称"
        :rules="[
          {
            required: true,
            message: '应用名称不允许为空',
          },
          { maxLength: 50, message: '不允许超过50个字符' },
        ]"
      >
        <t-textarea
          v-model="form.appName"
          placeholder="请输入"
          :max-length="50"
          allow-clear
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        field="introduction"
        label="应用描述"
        :rules="[
          {
            required: true,
            message: '应用描述不允许为空',
          },
          { maxLength: 500, message: '不允许超过500个字符' },
        ]"
      >
        <t-textarea
          v-model="form.introduction"
          placeholder="请输入"
          :max-length="500"
          allow-clear
          show-word-limit
        />
      </t-form-item>
    </t-form>
  </t-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { fetchApplicationAdd } from '@/api/devCenter/manage';

const formRef = ref();

const userStore = useUserStore();
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);

const emit = defineEmits(['onConfirm', 'onCancel']);
const current: Record<string, any> = ref(1);
const columns = [
  {
    title: '编号',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '设备指纹码',
    dataIndex: 'fingerprint',
    slotName: 'fingerprint',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  },
];
const data = reactive(['', '', '', '', '', '', '', '', '', '']);
const form = reactive<{
  appName: string;
  appType: number;
  introduction: string;
  appLogo: string;
  companyId: string;
}>({
  appName: '',
  appType: 0, // 1商场
  introduction: '',
  appLogo: '',
  companyId: userInfoByCompany.value?.companyId,
});

const props = defineProps({
  visible: Boolean,
  title: String,
});

const handleCancel = () => {
  emit('onCancel');
};

const validateRadio = (value: number, callback: (error?: string) => void) => {
  if (![0, 1].includes(value)) {
    callback('应用类型不能为空');
  } else {
    callback();
  }
};

const handleConfirm = () => {
  formRef.value.validate((errors: undefined) => {
    if (!errors) {
      fetchApplicationAdd(form).then((res) => {
        emit('onConfirm', res);
      });
    }
  });
};

const onPrev = () => {
  current.value = Math.max(1, current.value - 1);
};

const onNext = () => {
  current.value = Math.min(3, current.value + 1);
};

onMounted(() => {});
</script>

<style lang="less" scoped>
.steps-width {
  gap: 10px;
  height: 68px;
  padding: 20px 81px;
  background: rgba(242, 243, 248, 1);
}
// 步骤条穿透样式
:deep(.tele-steps-item-wait .tele-steps-icon) {
  background-color: #fff;
}

:deep(
    .tele-steps-label-horizontal
      .tele-steps-item:not(:last-child)
      .tele-steps-item-title::after
  ) {
  background-color: rgba(201, 205, 212, 1);
}

:deep(
    .tele-steps-label-horizontal
      .tele-steps-item.tele-steps-item-finish
      .tele-steps-item-title::after
  ) {
  background-color: rgba(22, 100, 255, 1);
}

.drawer-body {
  padding: 24px 84px;
  background: blanchedalmond;

  .steps-title {
    margin-top: 30px;
    color: rgba(29, 33, 41, 1);
    font-weight: 400;
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 22px;
    text-align: left;
  }

  .steps-title:first-child {
    margin-top: 0;
  }

  .steps-illustrate {
    margin-top: 4px;
    color: rgba(134, 144, 156, 1);
    font-weight: 400;
    font-size: 12px;
    font-family: PingFang SC;
    line-height: 20px;
    text-align: left;
  }

  .steps-button {
    margin-top: 10px;
  }
}
</style>
