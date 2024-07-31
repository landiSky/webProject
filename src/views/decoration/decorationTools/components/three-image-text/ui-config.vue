<template>
  <div class="box">
    <div class="header">
      {{ data?.chineseName || '' }}
    </div>
    <t-form
      ref="formRef"
      :model="form"
      auto-label-width
      :style="{
        width: '90%',
        marginTop: '30px',
        paddingRight: '10px',
      }"
      label-align="left"
    >
      <t-form-item
        label="主标题"
        field="mainTitle"
        :label-col-props="{
          flex: '90px',
          align: 'center',
        }"
        :validate-trigger="['blur', 'input']"
        :rules="[{ required: true, message: '必填' }]"
      >
        <t-input
          v-model="form.mainTitle"
          placeholder="请输入"
          :max-length="10"
          show-word-limit
          allow-clear
        />
      </t-form-item>

      <div
        v-for="(item, index) in form.list"
        :key="index"
        :style="{ width: '100%', marginTop: '0px' }"
      >
        <t-space style="margin-top: 10px; margin-bottom: 20px">
          <div class="vertical-line"></div>
          <div>{{ `区块${UpperNumberList[index]}` }}</div>
        </t-space>
        <t-form-item
          label="标题"
          :field="`list.${index}.title`"
          :label-col-props="{
            flex: '90px',
            align: 'left',
          }"
          :validate-trigger="['blur']"
          :rules="[{ required: true, message: '必填' }]"
        >
          <t-input
            v-model="item.title"
            placeholder="请输入"
            :max-length="10"
            show-word-limit
            allow-clear
          />
        </t-form-item>
        <t-form-item
          label="详情简介"
          :field="`list.${index}.desc`"
          :label-col-props="{
            flex: '90px',
            align: 'center',
          }"
          validate-trigger="blur"
          :rules="[{ required: true, message: '必填' }]"
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
          label="关联"
          :field="`list.${index}.linkType`"
          :label-col-props="{
            flex: '90px',
          }"
          validate-trigger="blur"
          :rules="[{ required: true, message: '必填' }]"
        >
          <t-radio-group v-model="item.linkType" @change="radioChange(index)">
            <t-radio :value="0">链接</t-radio>
            <t-radio :value="1">商品</t-radio>
            <t-radio :value="2">无</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item
          v-if="item.linkType !== 2"
          :label="
            item.linkType === 0 ? '链接地址' : item.linkType === 1 ? '商品' : ''
          "
          :field="`list.${index}.linkUrl`"
          :label-col-props="{
            flex: '90px',
          }"
          validate-trigger="blur"
          :rules="[{ required: true, message: '必填' }]"
        >
          <t-textarea
            v-if="item.linkType === 0"
            v-model="item.linkUrl"
            :max-length="40"
            show-word-limit
            placeholder="请输入"
          />
          <t-select
            v-if="item.linkType === 1"
            v-model="item.linkUrl"
            placeholder="请选择"
            allow-clear
          >
            <t-option
              v-for="itemg in goodsList"
              :key="itemg"
              :value="itemg.id"
              >{{ itemg?.name }}</t-option
            >
          </t-select>
        </t-form-item>

        <t-form-item
          label="配图"
          :field="`list.${index}.src`"
          :label-col-props="{
            flex: '90px',
          }"
          validate-trigger="blur"
          :rules="[{ required: true, message: '必填' }]"
        >
          <t-space direction="vertical">
            <t-upload
              list-type="picture-card"
              :file-list="
                item.src
                  ? [
                      {
                        url: `/server/web/file/download?name=${item.src}`,
                      },
                    ]
                  : []
              "
              action="/"
              :limit="1"
              image-preview
              :on-before-remove="
                () => {
                  return onBeforeRemove(index);
                }
              "
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
      </div>
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
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch, reactive, onMounted, PropType } from 'vue';
import Source from '@/components/sourceMaterial/components/source.vue';
import { UpperNumberList } from '@/enums/decoration';
// 每个子表单的配置项
type ConfigItem = {
  title: string;
  desc: string;
  src: string;
  linkType: number;
  linkUrl: string;
};
// 全部配置数据
type ConfigData = {
  mainTitle: string;
  list: ConfigItem[];
};

interface GoodsItem {
  name: string;
  id: string;
}

const props = defineProps({
  data: Object,
  goodsList: Array as PropType<GoodsItem[]>,
});
const confirmLoading = ref(false);
const { data, goodsList } = toRefs(props);
const formRef = ref();
// 截图尺寸
const stencilSize = ref({
  width: 456,
  height: 264,
});
const curIndex = ref(-1);
const showSource = ref(false);

const form = ref<ConfigData>({
  mainTitle: '',
  list: [],
});

const onBeforeRemove = (index: number) => {
  curIndex.value = index;
  showSource.value = true;
};

// watch(
//   () => data?.value,
//   (val) => {
//     // console.log('form:', JSON.stringify(form), val);
//     // form.value.title = val?.value.title || '';
//     // form.value.linkType = val?.value.linkType || 0;
//     // form.value.linkUrl = val?.value.linkUrl || '';
//     // form.value.desc = val?.value.desc || '';
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );
const onConfirm = (value: any) => {
  console.log('返回的图片信息', value);
  form.value.list[curIndex.value].src = value;
  showSource.value = false;
};

const onCancel = () => {
  showSource.value = false;
};
const radioChange = (index: number) => {
  form.value.list[index].linkUrl = '';
};

onMounted(() => {
  // form赋值
  form.value.mainTitle = data?.value?.mainTitle || '';
  form.value.list = data?.value?.configValue || [];
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

  .vertical-line {
    width: 2px;
    height: 10px;
    background: #1664ff;
    border-radius: 1px;
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
