<template>
  <div style="overflow-y: auto">
    <t-page-header flex title="用户协议配置" :show-back="false">
      <t-spin :loading="loading" :size="24" tip="正在加载中，请稍后...">
        <div class="tinymce-box">
          <TEditor ref="childeRef"></TEditor>
          <t-space class="anniu">
            <t-button type="primary" @click="save">保存</t-button>
            <t-button @click="cancellation">取消</t-button>
          </t-space>
        </div>
      </t-spin>
    </t-page-header>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, h } from 'vue';
import { Modal } from '@tele-design/web-vue';
import { agreementDetail, agreementuUpdate } from '@/api/operation/agreement';

import TEditor from '@/components/teditor/index.vue';
// 本地调试的话 需要去组件里更改 prefix 字段 去看就明白了
const childeRef = ref();

const textData: Record<string, any> = ref('');

const loading = ref(false);

const getDetail = () => {
  loading.value = true;
  agreementDetail().then((res: any) => {
    loading.value = false;
    if (res.code !== 200) {
      return;
    }
    textData.value = res.data.protocol;
    childeRef.value.handleSetContent(textData.value);
  });
};

const save = () => {
  if (
    !textData.value ||
    !childeRef.value ||
    childeRef.value.handleGetContent().length === 0
  ) {
    return;
  }
  if (textData.value.length === childeRef.value.handleGetContent().length) {
    return;
  }
  const data = {
    content: childeRef.value.handleGetContent(),
  };
  Modal.info({
    title: '确认后，用户将按照该协议操作平台，请确认。',
    width: 450,
    content: () => {
      return h('div', { class: 'info-modal-content' }, [
        h('div', { style: 'margin-left: 12px;' }, ''),
      ]);
    },
    titleAlign: 'start',
    hideCancel: false,
    cancelText: '取消',
    okText: '确定',
    onOk: () => {
      agreementuUpdate(data).then((res: any) => {
        if (res.code !== 200) {
          return;
        }
        getDetail();
      });
    },
  });
};

const cancellation = () => {
  if (
    !textData.value ||
    !childeRef.value ||
    childeRef.value.handleGetContent().length === 0
  ) {
    return;
  }
  if (textData.value.length === childeRef.value.handleGetContent().length) {
    return;
  }
  Modal.info({
    title: '修改内容不进行保存处理，取消内容无法恢复，请谨慎操作',
    width: 450,
    content: () => {
      return h('div', { class: 'info-modal-content' }, [
        h('div', { style: 'margin-left: 12px;' }, ''),
      ]);
    },
    titleAlign: 'start',
    hideCancel: false,
    cancelText: '取消',
    okText: '确定',
    onOk: () => {},
  });
  // childeRef.value.handleSetContent('');
};

onMounted(() => {
  getDetail();
});
</script>

<style scoped>
.tinymce-box {
  width: 100%;
}

.anniu {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
