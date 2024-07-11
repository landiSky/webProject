<template>
  <div class="single-image">
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
          placeholder="请输入主标题"
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
          placeholder="请输入图片简介"
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
        <!-- <t-input v-model="form.src" placeholder="请输入图片地址"> </t-input> -->
        <t-space direction="vertical" :style="{ width: '100%' }">
          <t-upload
            action="/"
            :show-file-list="false"
            accept=".jpg,.png,.bmp,.tif,.gif"
            tip="建议图片尺寸：1200px * 520px，支持jpg、png、bmp、tif、gif文件格式，文件大小限制10M以内。"
            :limit="1"
            image-preview
            style="width: 100px; height: 100px"
            @change="onChange"
          >
            <template #upload-button>
              <div
                :class="`tele-upload-list-item${
                  file && file.status === 'error'
                    ? ' tele-upload-list-item-error'
                    : ''
                }`"
              >
                <div
                  v-if="file && file.url"
                  class="tele-upload-list-picture custom-upload-avatar"
                >
                  <img :src="file.url" />
                  <div class="tele-upload-list-picture-mask">
                    <IconEdit />
                  </div>
                  <t-progress
                    v-if="file.status === 'uploading' && file.percent < 100"
                    :percent="file.percent"
                    type="circle"
                    size="mini"
                    :style="{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translateX(-50%) translateY(-50%)',
                    }"
                  />
                </div>
                <div v-else class="tele-upload-picture-card">
                  <div class="tele-upload-picture-card-text">
                    <IconPlus />
                    <div style="margin-top: 10px; font-weight: 600"
                      >点击上传
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </t-upload>
        </t-space>
      </t-form-item>
      <t-form-item
        label="关联"
        field="linkType"
        :label-col-props="{
          flex: '90px',
        }"
      >
        <t-radio-group v-model="form.linkType">
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
          max-length="40"
          show-word-limit
          placeholder="请输入链接地址"
        />
        <t-select
          v-if="form.linkType === 1"
          v-model="form.linkUrl"
          placeholder="请选择"
          allow-clear
        >
          <t-option v-for="item in goodList" :key="item">{{ item }}</t-option>
        </t-select>
      </t-form-item>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch, onMounted } from 'vue';

const props = defineProps({
  data: Object,
});

const { data } = toRefs(props);
const file = ref();
const formRef = ref();

const form = ref({
  src: '',
  title: '',
  desc: '',
  linkType: 0,
  linkUrl: '',
});

const rules = {
  title: [{ required: true, message: '必填' }],
  src: [{ required: false, message: '必填' }],
  desc: [{ required: true, message: '必填' }],
  linkType: [{ required: true, message: '必填' }],
  linkUrl: [{ required: true, message: '必填' }],
};

const onChange = (_: any, currentFile: any) => {
  file.value = {
    ...currentFile,
    // url: URL.createObjectURL(currentFile.file),
  };
};
const goodList = ['123', '456', '789'];

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
.single-image {
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

  .single-image-desc {
    color: #1d1d1d;
  }
}

::v-deep(.tele-upload-tip) {
  width: 190px;
}
</style>
