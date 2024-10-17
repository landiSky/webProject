<template>
  <t-drawer
    :width="420"
    :visible="props.showChannelDrawer"
    :ok-loading="props.confirmLoading"
    unmount-on-close
    @ok="handleOk"
    @cancel="emits('handleCancel')"
  >
    <template #title>
      {{ props.title }}
    </template>
    <div class="drawer-content">
      <t-form
        ref="formRef"
        :model="formModal"
        :rules="drawerFormRules"
        auto-label-width
      >
        <t-form-item field="name" label="频道名称">
          <t-input
            v-model="formModal.name"
            placeholder="请输入"
            allow-clear
            style="width: 260px"
          />
        </t-form-item>
        <div
          v-if="props.data?.supportDelete || !props.data?.id"
          class="channel-content"
        >
          <t-form-item field="channelType" label="导航形式">
            <t-radio-group v-model="formModal.channelType">
              <t-radio :value="0">链接跳转</t-radio>
              <t-radio :value="1">频道页面</t-radio>
            </t-radio-group>
          </t-form-item>
          <t-form-item
            v-if="formModal.channelType === 0"
            field="linkUrl"
            label="跳转链接"
          >
            <t-input
              v-model="formModal.linkUrl"
              placeholder="请输入"
              :allow-clear="false"
              style="width: 260px"
              :max-length="{
                length: 500,
                errorOnly: true,
              }"
              show-word-limit
            />
          </t-form-item>
        </div>
      </t-form>
    </div>
  </t-drawer>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, watch, defineEmits, reactive } from 'vue';

const formRef = ref();

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  // 通过传递的data是否有id来判断是新增还是编辑
  data: {
    type: Object,
    default() {
      return {};
    },
  },
  showChannelDrawer: {
    type: Boolean,
    default: false,
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
});

const formModal = reactive<Record<string, any>>({
  name: '',
  channelType: 0,
  linkUrl: '',
});

const drawerFormRules = {
  name: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入名称');
        const iszhCn = /[^\u4e00-\u9fa5]/;
        const isEn = /[^a-zA-Z]/;
        if (!iszhCn.test(value) || !isEn.test(value)) {
          if (!iszhCn.test(value)) {
            if (value.length > 5) return cb('中文长度不超过5个字符');
          }
          if (!isEn.test(value)) {
            if (value.length > 10) return cb('英文长度不超过10个字符');
          }
        }
        if (iszhCn.test(value) && isEn.test(value)) {
          return cb('只支持中文或者英文');
        }
        return cb();
      },
    },
  ],
  channelType: [{ required: true, message: '请选择导航形式' }],
  linkUrl: [
    { required: true, message: '请输入跳转链接' },
    { maxLength: 500, message: '长度不超过500个字符' },
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!/^(https?:\/\/).+$/.test(value))
          return cb('请输入以http://或https://开头的格式');
        return cb();
      },
    },
  ],
};

watch(
  props.data,
  (newVal) => {
    formModal.name = newVal.name || '';
    formModal.channelType = newVal.channelType || 0;
    formModal.linkUrl = newVal.linkUrl || '';
  },
  {
    deep: true,
    immediate: true,
  }
);

const emits = defineEmits(['handleOk', 'handleCancel']);

const handleOk = () => {
  formRef.value.validate((errors: any) => {
    console.log('errors', errors);
    if (!errors) {
      // 区分编辑
      const params = {
        ...formModal,
        id: props.data?.id,
        sort: props.data?.sort,
        status: props.data.status || '',
      };
      emits('handleOk', params);
    }
  });
};
</script>
