<template>
  <div class="box">
    <div class="header">
      {{ data?.chineseName || '' }}
    </div>
    <t-form
      ref="formRef"
      :model="form"
      auto-label-width
      :style="{ width: '90%', marginTop: '30px', paddingRight: '10px' }"
      :rules="rules"
    >
      <t-form-item
        label="标题"
        field="title"
        :label-col-props="{
          flex: '90px',
          align: 'center',
        }"
        :validate-trigger="['blur', 'input']"
      >
        <t-input
          v-model="form.title"
          placeholder="请输入"
          :max-length="12"
          show-word-limit
          allow-clear
        />
      </t-form-item>
      <t-form-item
        label="详情简介"
        field="desc"
        :label-col-props="{
          flex: '90px',
          align: 'center',
        }"
        :validate-trigger="['blur', 'input']"
      >
        <t-textarea
          v-model="form.desc"
          placeholder="请输入"
          allow-clear
          :max-length="50"
          show-word-limit
        />
      </t-form-item>

      <t-form-item
        label="配图"
        field="src"
        :label-col-props="{
          flex: '90px',
        }"
        :validate-trigger="['change']"
      >
        <t-space direction="vertical">
          <t-upload
            list-type="picture-card"
            :file-list="
              form.src
                ? [
                    {
                      url: `/server/web/file/download?name=${form.src}`,
                      // url: `${form.src}`,
                    },
                  ]
                : []
            "
            action="/"
            :limit="1"
            image-preview
            :on-before-remove="onBeforeRemove"
            style="width: 100px; height: 100px"
          >
            <template #remove-icon>
              <iconpark-icon name="replace" size="16px"></iconpark-icon>
            </template>
            <template #preview-icon>
              <icon-eye />
            </template>
          </t-upload>
          <span style="margin-top: -20px; color: #86909c; font-size: 12px">
            {{
              `建议图片尺寸：${stencilSize.width}px *
              ${stencilSize.height}px，支持jpg、jpeg、png、bmp、gif文件格式，文件大小限制10M以内。`
            }}
          </span>
        </t-space>
      </t-form-item>
      <t-form-item
        label="关联"
        field="linkType"
        :label-col-props="{
          flex: '90px',
        }"
      >
        <t-radio-group v-model="form.linkType" @change="radioChange">
          <t-radio :value="0">链接</t-radio>
          <t-radio :value="1">商品</t-radio>
          <t-radio :value="2">无</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item
        v-if="form.linkType !== 2"
        :label="
          form.linkType === 0 ? '链接地址' : form.linkType === 1 ? '商品' : ''
        "
        field="linkUrl"
        :label-col-props="{
          flex: '90px',
        }"
        :validate-trigger="['blur']"
      >
        <t-textarea
          v-if="form.linkType === 0"
          v-model="form.linkUrl"
          :max-length="40"
          show-word-limit
          placeholder="请输入"
        />
        <t-select
          v-if="form.linkType === 1"
          v-model="form.linkUrl"
          placeholder="请选择"
          allow-clear
        >
          <t-option v-for="item in goodsList" :key="item" :value="item.id">{{
            item.name
          }}</t-option>
        </t-select>
      </t-form-item>
    </t-form>
    <Source
      v-if="showSource"
      :visible="showSource"
      :confirm-loading="confirmLoading"
      :cut-width="stencilSize.width"
      :cut-height="stencilSize.height"
      title="素材库"
      @on-confirm="onConfirm"
      @on-cancel="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch, onMounted, PropType } from 'vue';
import Source from '@/components/sourceMaterial/components/source.vue';

type GoodsItem = {
  name: string;
  id: string;
};
const props = defineProps({
  data: Object,
  goodsList: Array as PropType<GoodsItem[]>,
});

const { data, goodsList } = toRefs(props);
const formRef = ref();
const showSource = ref(false);
const confirmLoading = ref(false);

// 截图尺寸
const stencilSize = ref({
  width: 1200,
  height: 520,
});

const form = ref({
  src: '',
  title: '',
  desc: '',
  linkType: 0,
  linkUrl: '',
});

const rules = {
  title: [{ required: true, message: '该信息为必填项，未填写不支持发布' }],
  src: [{ required: true, message: '该信息为必填项，未填写不支持发布' }],
  desc: [{ required: true, message: '该信息为必填项，未填写不支持发布' }],
  linkType: [{ required: true, message: '该信息为必填项，未填写不支持发布' }],
  linkUrl: [{ required: true, message: '该信息为必填项，未填写不支持发布' }],
};

const radioChange = () => {
  form.value.linkUrl = '';
};

const onBeforeRemove = () => {
  showSource.value = true;
};
watch(
  () => data,
  (val: any) => {
    // console.log('form00000:', JSON.stringify(form), val);
    // form.value.src = val?.value.configValue?.src || '';
    // form.value.title = val?.value.configValue.title || '';
    // form.value.linkType = val?.value.configValue.linkType || 0;
    // form.value.linkUrl = val?.value.configValue.linkUrl || '';
    // form.value.desc = val?.value.configValue.desc || '';
    // console.log('form111111:', form);
  },
  {
    immediate: true,
    deep: true,
  }
);
const onConfirm = (value: any) => {
  console.log('返回的图片信息', value);
  form.value.src = value;
  showSource.value = false;
};

const onCancel = () => {
  showSource.value = false;
};

onMounted(() => {
  // console.log('mounted');
  // // form赋值
  form.value.src = data?.value?.configValue.src || '';
  form.value.title = data?.value?.configValue.title || '';
  form.value.linkType = data?.value?.configValue.linkType || 0;
  form.value.linkUrl = data?.value?.configValue.linkUrl || '';
  form.value.desc = data?.value?.configValue.desc || '';
});

defineExpose({
  form,
  formRef,
});
</script>

<style scoped lang="less">
.box {
  display: flex;
  // height: calc(100vh - 50px);
  // min-height: 500px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;

  .header {
    width: 100%;
    height: 54px;
    padding-left: 24px;
    font-weight: 500;
    font-size: 14px;
    line-height: 54px;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }

  .tele-image {
    width: 100%;
    height: 84px;
  }

  .box-desc {
    color: #1d1d1d;
  }
}

::v-deep(.tele-upload-list-picture) {
  width: 100px;
  height: 100px;

  img {
    object-fit: cover;
  }
}

::v-deep(.tele-upload-tip) {
  width: 190px;
}
</style>
