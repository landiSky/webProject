<template>
  <div class="image-overlap-text">
    <div class="header">
      {{ data?.chineseName || '' }}
    </div>
    <t-form
      ref="formRef"
      :model="form"
      auto-label-width
      label-align="left"
      :style="{ marginTop: '10px', paddingRight: '24px', paddingLeft: '24px' }"
      :rules="rules"
    >
      <t-form-item
        label="主标题"
        field="mainTitle"
        :label-col-props="{
          flex: '90px',
          align: 'center',
        }"
        :validate-trigger="['blur', 'input']"
      >
        <t-input
          v-model="form.mainTitle"
          placeholder="请输入主标题"
          :max-length="12"
          show-word-limit
          allow-clear
        />
      </t-form-item>
      <template v-for="(item, index) in form.list" :key="index">
        <t-space :size="8" style="margin-bottom: 20px">
          <div class="title-line"></div>
          <div class="title-text">区块{{ numberToChiness(index) }}</div>
        </t-space>

        <t-form-item
          label="标题"
          :field="`list.${index}.title`"
          :label-col-props="{
            flex: '90px',
            align: 'left',
          }"
          :rules="[{ required: true, message: '必填' }]"
        >
          <t-input
            v-model="item.title"
            placeholder="请输入"
            allow-clear
            :max-length="10"
            show-word-limit
          />
        </t-form-item>
        <t-form-item
          label="简介"
          :field="`list.${index}.desc`"
          :rules="[{ required: true, message: '请输入简介' }]"
          :label-col-props="{
            flex: '90px',
            align: 'center',
          }"
        >
          <t-textarea
            v-model="item.desc"
            placeholder="请输入"
            allow-clear
            :max-length="50"
            show-word-limit
          />
        </t-form-item>
        <t-form-item
          label="配图"
          :field="`list.${index}.src`"
          :label-col-props="{
            flex: '90px',
          }"
          :validate-trigger="['change']"
          :rules="[{ required: true, message: '请输入上传图片' }]"
        >
          <t-space direction="vertical">
            <t-upload
              list-type="picture-card"
              :file-list="
                item.src
                  ? [
                      {
                        url: `/server/web/file/download?name=${item.src}`,
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
              ${stencilSize.height}px，支持jpg、png、bmp、tif、gif文件格式，文件大小限制10M以内。`
              }}
            </span>
          </t-space>
        </t-form-item>
        <t-form-item
          label="关联"
          :field="`list.${index}.linkType`"
          :rules="[{ required: true, message: '请选择关联' }]"
          :label-col-props="{
            flex: '90px',
          }"
        >
          <t-radio-group v-model="item.linkType" @change="radioChange(index)">
            <t-radio :value="0">链接</t-radio>
            <t-radio :value="1">商品</t-radio>
            <t-radio :value="2">无</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item
          v-if="item.linkType !== LinkType.BLANK"
          :label="
            item.linkType === LinkType.LINK
              ? '链接'
              : item.linkType === LinkType.PRODUCT
              ? '商品'
              : ''
          "
          :field="`list.${index}.linkUrl`"
          :rules="[
            {
              required: true,
              message:
                item.linkType === LinkType.LINK ? `请输入链接` : `请选择商品`,
            },
          ]"
          :label-col-props="{
            flex: '90px',
          }"
          :validate-trigger="['blur']"
        >
          <t-textarea
            v-if="item.linkType === LinkType.LINK"
            v-model="item.linkUrl"
            max-length="40"
            show-word-limit
            placeholder="请输入链接地址"
          />
          <t-select
            v-if="item.linkType === LinkType.PRODUCT"
            v-model="item.linkUrl"
            placeholder="请选择"
            allow-clear
          >
            <t-option v-for="itemg in goodsList" :key="itemg">{{
              itemg.name
            }}</t-option>
          </t-select>
        </t-form-item>
      </template>
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
import { LinkType } from '../../constant';
import type { IList } from './type';

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

const numberToChiness = (index: number) => {
  if (index === 0) return '一';
  if (index === 1) return '二';
  return '三';
};

const listDefault = [
  {
    title: '',
    src: '',
    desc: '',
    linkType: LinkType.LINK,
    linkUrl: '',
  },
  {
    title: '',
    src: '',
    desc: '',
    linkType: LinkType.LINK,
    linkUrl: '',
  },
  {
    title: '',
    desc: '',
    src: '',
    linkType: LinkType.LINK,
    linkUrl: '',
  },
];

// 截图尺寸
const stencilSize = ref({
  width: 1200,
  height: 520,
});

const form = ref<{
  mainTitle: string;
  list: IList[];
}>({
  mainTitle: '',
  list: [],
});

const rules = {
  mainTitle: [{ required: true, message: '请输入主标题' }],
};

const onBeforeRemove = () => {
  showSource.value = true;
};

const onConfirm = (value: any) => {
  console.log('返回的图片信息', value);
  // form.value.src = value;
  showSource.value = false;
};

const onCancel = () => {
  showSource.value = false;
};

const radioChange = (index: number) => {
  form.value.list[index].linkUrl = '';
};
onMounted(() => {
  form.value.mainTitle = data?.value?.mainTitle || '';
  form.value.list =
    data?.value?.configValue || JSON.parse(JSON.stringify(listDefault));
});

defineExpose({
  form,
  formRef,
});
</script>

<style scoped lang="less">
.image-overlap-text {
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

  .image-overlap-text-desc {
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

.title-line {
  width: 2px;
  height: 10px;
  background: #1664ff;
}

.title-text {
  color: #1d2129;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
}
</style>
