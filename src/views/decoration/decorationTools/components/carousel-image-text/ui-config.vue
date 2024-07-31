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
        :rules="[
          { required: true, message: '该信息为必填项，未填写不支持发布' },
        ]"
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
        <t-space
          style="
            position: relative;
            width: 100%;
            margin-top: 10px;
            margin-bottom: 20px;
          "
        >
          <div class="vertical-line"></div>
          <div>{{ `区块${UpperNumberList[index]}` }}</div>
          <div
            v-if="form.list.length > 3"
            class="delete"
            @click="deleteSpace(index)"
            >删除</div
          >
        </t-space>
        <t-form-item
          label="标题"
          :field="`list.${index}.title`"
          :label-col-props="{
            flex: '90px',
            align: 'left',
          }"
          :validate-trigger="['blur']"
          :rules="[
            { required: true, message: '该信息为必填项，未填写不支持发布' },
          ]"
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
          label="简介"
          :field="`list.${index}.desc`"
          :label-col-props="{
            flex: '90px',
            align: 'center',
          }"
          validate-trigger="blur"
          :rules="[
            { required: true, message: '该信息为必填项，未填写不支持发布' },
          ]"
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
          :rules="[
            { required: true, message: '该信息为必填项，未填写不支持发布' },
          ]"
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
          :rules="[
            { required: true, message: '该信息为必填项，未填写不支持发布' },
          ]"
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
              >{{ itemg.name }}</t-option
            >
          </t-select>
        </t-form-item>

        <t-form-item
          label="图片"
          :field="`list.${index}.src`"
          :label-col-props="{
            flex: '90px',
          }"
          validate-trigger="blur"
          :rules="[
            { required: true, message: '该信息为必填项，未填写不支持发布' },
          ]"
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
              建议图片尺寸：190px *
              190px，支持jpg、jpeg、png、bmp、gif文件格式，文件大小限制10M以内。
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

    <div class="area-add-box">
      <t-divider margin="0" />
      <div class="area-add-box-content">
        <iconpark-icon
          v-if="form.list.length < 5"
          style="cursor: pointer"
          name="squarePlus"
          :size="20"
          @click="addBlock"
        />
        <iconpark-icon
          v-else
          style="cursor: not-allowed"
          name="squarePlusGray"
          size="20"
        />
        <span>添加区块（最多支持5个区块）</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, onMounted, PropType } from 'vue';
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
type GoodsItem = {
  name: string;
  id: string;
};
const props = defineProps({
  data: Object,
  goodsList: Array as PropType<GoodsItem[]>,
});
const confirmLoading = ref(false);

// 截图尺寸
const stencilSize = ref({
  width: 190,
  height: 190,
});
const curIndex = ref(-1);
const showSource = ref(false);
const { data } = toRefs(props);
const formRef = ref();

const form = ref<ConfigData>({
  mainTitle: '',
  list: [],
});

const onBeforeRemove = (index: number) => {
  curIndex.value = index;
  console.log('第几个图片', curIndex.value);
  showSource.value = true;
};

const onConfirm = (value: any) => {
  console.log('返回的图片信息', value, curIndex.value);
  form.value.list[curIndex.value].src = value;
  showSource.value = false;
};

const radioChange = (index: number) => {
  form.value.list[index].linkUrl = '';
};

const onCancel = () => {
  showSource.value = false;
};
const addBlock = () => {
  console.log('添加区块', form.value.list as any);
  if (form.value.list.length >= 5) {
    return;
  }
  const { list } = form.value;
  list.push({
    title: '',
    desc: '',
    src: '909d785b-d3fa-4812-b117-557dfe8270e1.jpeg',
    linkType: 0,
    linkUrl: '',
  });
};

const deleteSpace = (index: number) => {
  form.value.list.splice(index, 1);
};
onMounted(() => {
  // form赋值
  form.value.mainTitle = data?.value?.mainTitle || '';
  form.value.list = Object.values(data?.value?.configValue) || [];
});

defineExpose({
  form,
  formRef,
});
</script>

<style scoped lang="less">
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  // height: 100%;
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

  .delete {
    position: absolute;
    right: 0;
    color: #1664ff;
    font-size: 12px;
    cursor: pointer;
  }

  .tele-image {
    width: 100%;
    height: 84px;
  }

  .box-desc {
    color: #1d1d1d;
  }

  .divider-cls {
    width: calc(100% - 40px);
  }

  .area-add-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    margin-bottom: 200px;
    padding: 0 24px;

    .area-add-box-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      margin-top: 20px;

      span {
        margin-left: 8px;
        color: #1d2129;
        font-size: 12px;
      }
    }
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
