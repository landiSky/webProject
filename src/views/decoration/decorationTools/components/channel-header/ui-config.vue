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
        field="mainTitle"
        :label-col-props="{
          flex: '90px',
          align: 'center',
        }"
        :validate-trigger="['blur', 'input']"
        :rules="[
          { required: true, message: '该信息为必填项，未填写不支持发布' },
          { required: true, maxLength: 20, message: '长度不超过20个字符' },
        ]"
      >
        <t-input
          v-model="form.mainTitle"
          :max-length="{
            length: 20,
            errorOnly: true,
          }"
          show-word-limit
          placeholder="请输入"
          :allow-clear="false"
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
        :rules="[
          { required: true, message: '该信息为必填项，未填写不支持发布' },
          { required: true, maxLength: 500, message: '长度不超过500个字符' },
        ]"
      >
        <t-textarea
          v-model="form.desc"
          :max-length="{
            length: 500,
            errorOnly: true,
          }"
          show-word-limit
          placeholder="请输入"
          :allow-clear="false"
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
  isPro: Boolean,
  goodsList: Array as PropType<GoodsItem[]>,
});

const { data, goodsList } = toRefs(props);
const formRef = ref();
const showSource = ref(false);
const confirmLoading = ref(false);

// 截图尺寸
const stencilSize = ref({
  width: 1440,
  height: 560,
});

const form = ref({
  mainTitle: '',
  src: '',
  desc: '',
  // linkType: 0,
  // linkUrl: '',
});

const rules = {
  mainTitle: [{ required: true, message: '该信息为必填项，未填写不支持发布' }],
  src: [{ required: true, message: '该信息为必填项，未填写不支持发布' }],
  desc: [{ required: true, message: '该信息为必填项，未填写不支持发布' }],
  // linkType: [{ required: true, message: '该信息为必填项，未填写不支持发布' }],
  // linkUrl: [{ required: true, message: '该信息为必填项，未填写不支持发布' }],
};

const onBeforeRemove = () => {
  showSource.value = true;
};
const onConfirm = (value: any) => {
  console.log('返回的图片信息', value);
  form.value.src = value;
  showSource.value = false;
};

const onCancel = () => {
  showSource.value = false;
};

onMounted(() => {
  // // form赋值
  form.value.src = data?.value?.configValue.src || '';
  form.value.mainTitle = data?.value?.mainTitle || '';
  // form.value.linkType = data?.value?.configValue.linkType || 0;
  // form.value.linkUrl = data?.value?.configValue.linkUrl || '';
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
