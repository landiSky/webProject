<template>
  <div class="single-image">
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
            :max-length="100"
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
          <t-radio-group v-model="item.linkType" @change="changeRadio(index)">
            <t-radio :value="0">链接</t-radio>
            <t-radio :value="1">商品</t-radio>
            <t-radio :value="2">无</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item
          v-if="item.linkType !== 2"
          :label="
            item.linkType === 0 ? '详情链接' : item.linkType === 1 ? '商品' : ''
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
            <t-option v-for="itemg in goodsList" :key="itemg">{{
              itemg.name
            }}</t-option>
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
                        // url: `${form.src}`,
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
      <div class="extraOpt">
        <iconpark-icon
          v-if="form.list.length < 5"
          class="plusIcon"
          name="squarePlus"
          size="20px"
          @click="addBlock"
        ></iconpark-icon>
        <t-tooltip v-else content="到达区块添加上限，删除后可操作" is-bright>
          <iconpark-icon
            class="plusIcon"
            name="squarePlusGray"
            size="20px"
          ></iconpark-icon>
        </t-tooltip>
        <span>{{ `添加区块 (最多支持${data?.maxNum}个区块)` }}</span>
      </div>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, onMounted, PropType } from 'vue';
import Source from '@/components/sourceMaterial/components/source.vue';
import { UpperNumberList } from '@/enums/decoration';

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
  width: 598,
  height: 609,
});
const curIndex = ref(0);
const showSource = ref(false);
const { data, goodsList } = toRefs(props);
const formRef = ref();

interface Form {
  mainTitle: string;
  list: any[];
}

const form = ref<Form>({
  mainTitle: '',
  list: [],
});

const changeRadio = (value: number) => {
  form.value.list[value].linkUrl = '';
};
const addBlock = () => {
  form.value.list.push({
    title: '',
    desc: '',
    src: 'eb8a97de-c8a0-4d43-89e7-c39643070b3f.jpeg',
    linkType: 0,
    linkUrl: '',
  });
};
const onBeforeRemove = (index: number) => {
  curIndex.value = index;
  showSource.value = true;
};

const onConfirm = (value: any) => {
  form.value.list[curIndex.value].src = value;
  // console.log('form:', form.value.list);
  showSource.value = false;
};

const onCancel = () => {
  showSource.value = false;
};

const deleteSpace = (index: number) => {
  form.value.list.splice(index, 1);
};
// watch(
//   () => data?.value,
//   (val) => {
//     console.log('右侧内容form:', JSON.stringify(form), val);
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
onMounted(() => {
  // form赋值
  form.value.mainTitle = data?.value?.mainTitle || '';
  form.value.list = Array.isArray(data?.value?.configValue)
    ? data?.value?.configValue || []
    : Object.values(data?.value?.configValue);
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

  .vertical-line {
    width: 2px;
    height: 10px;
    background: #1664ff;
    border-radius: 1px;
  }

  .space-between {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .tele-image {
    width: 100%;
    height: 84px;
  }

  .delete {
    position: absolute;
    right: 0;
    color: #1664ff;
    font-size: 14px;
    cursor: pointer;
  }

  .single-image-desc {
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

.extraOpt {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .plusIcon {
    cursor: pointer;
  }

  span {
    margin-left: 8px;
    color: #1d2129;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px; /* 166.667% */
  }
}

::v-deep(.tele-upload-tip) {
  width: 190px;
}
</style>
