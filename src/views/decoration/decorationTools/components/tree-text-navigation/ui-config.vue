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
          { required: true, maxLength: 20, message: '长度不超过20个字符' },
          {
            required: true,
            match: /^[a-zA-Z\u4e00-\u9fa5]+$/,
            message: '输入内容只支持中英文，不支持输入其他特殊字符。',
          },
        ]"
      >
        <t-input
          v-model="form.mainTitle"
          placeholder="请输入"
          :max-length="{
            length: 20,
            errorOnly: true,
          }"
          style="width: 262px"
          show-word-limit
          :allow-clear="false"
        />
      </t-form-item>
      <t-collapse
        v-for="(item, index) in form.list"
        :key="index"
        destroy-on-hide
        :bordered="false"
        :default-active-key="numberList(form.list)"
      >
        <t-collapse-item :key="index" :header="`区块${UpperNumberList[index]}`">
          <template #extra>
            <div
              v-if="form.list.length > 2"
              class="delete"
              @click="deleteSpace(index)"
              >删除</div
            >
          </template>
          <t-form-item
            label="子标题"
            :field="`list.${index}.navTitle`"
            :label-col-props="{
              flex: '90px',
              align: 'left',
            }"
            :validate-status="`${item.navTitle ? '' : 'error'}`"
            :help="`${item.navTitle ? '' : '该信息为必填项，未填写不支持发布'}`"
            :validate-trigger="['blur']"
            :rules="[
              { required: true, message: '该信息为必填项，未填写不支持发布' },
              { required: true, maxLength: 6, message: '长度不超过6个字符' },
              {
                required: true,
                match: /^[a-zA-Z\u4e00-\u9fa5]+$/,
                message: '输入内容只支持中英文，不支持输入其他特殊字符。',
              },
            ]"
          >
            <t-input
              v-model="item.navTitle"
              placeholder="请输入"
              :max-length="{
                length: 6,
                errorOnly: true,
              }"
              show-word-limit
              :allow-clear="false"
              style="width: 85%"
            />
          </t-form-item>
          <t-collapse
            v-for="(contentItem, contentIndex) in item.contentList"
            :key="contentIndex"
            destroy-on-hide
            class="son-collapse"
          >
            <t-collapse-item
              :key="`${index}.${contentIndex}`"
              :header="`内容${UpperNumberList[contentIndex]}`"
            >
              <template #extra>
                <div
                  v-if="item.contentList.length > 1"
                  class="delete"
                  @click="deleteSpaceContent(index, contentIndex)"
                  >删除</div
                >
              </template>
              <t-form-item
                label="时间"
                :field="`list.${index}.contentList.${contentIndex}.time`"
                :label-col-props="{
                  flex: '90px',
                  align: 'center',
                }"
                :validate-status="`${contentItem.time ? '' : 'error'}`"
                :help="`${
                  contentItem.time ? '' : '该信息为必填项，未填写不支持发布'
                }`"
                validate-trigger="blur"
                :rules="[
                  {
                    required: true,
                    message: '该信息为必填项，未填写不支持发布',
                  },
                ]"
              >
                <t-date-picker
                  v-model="contentItem.time"
                  placeholder="请选择日期"
                  :allow-clear="false"
                  style="width: 90%"
                />
              </t-form-item>
              <t-form-item
                label="名称"
                :field="`list.${index}.contentList.${contentIndex}.name`"
                :label-col-props="{
                  flex: '90px',
                  align: 'center',
                }"
                :validate-status="`${contentItem.name ? '' : 'error'}`"
                :help="`${
                  contentItem.name ? '' : '该信息为必填项，未填写不支持发布'
                }`"
                validate-trigger="blur"
                :rules="[
                  {
                    required: true,
                    message: '该信息为必填项，未填写不支持发布',
                  },
                  {
                    required: true,
                    maxLength: 40,
                    message: '长度不超过40个字符',
                  },
                ]"
              >
                <t-input
                  v-model="contentItem.name"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 40,
                    errorOnly: true,
                  }"
                  :allow-clear="false"
                  style="width: 90%"
                />
              </t-form-item>
              <t-form-item
                label="简介"
                :field="`list.${index}.contentList.${contentIndex}.desc`"
                :label-col-props="{
                  flex: '90px',
                  align: 'center',
                }"
                :validate-status="`${contentItem.desc ? '' : 'error'}`"
                :help="`${
                  contentItem.desc ? '' : '该信息为必填项，未填写不支持发布'
                }`"
                validate-trigger="blur"
                :rules="[
                  {
                    required: true,
                    message: '该信息为必填项，未填写不支持发布',
                  },
                  {
                    required: true,
                    maxLength: 200,
                    message: '长度不超过200个字符',
                  },
                ]"
              >
                <t-textarea
                  v-model="contentItem.desc"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 200,
                    errorOnly: true,
                  }"
                  :allow-clear="false"
                />
              </t-form-item>
              <t-form-item
                label="关联"
                :field="`list.${index}.contentList.${contentIndex}.linkType`"
                :label-col-props="{
                  flex: '90px',
                }"
                validate-trigger="blur"
                :rules="[
                  {
                    required: true,
                    message: '该信息为必填项，未填写不支持发布',
                  },
                ]"
              >
                <t-radio-group
                  v-model="contentItem.linkType"
                  @change="changeRadio(index)"
                >
                  <t-radio :value="0">链接</t-radio>
                  <t-radio :value="1" :disabled="isPro">商品</t-radio>
                  <t-radio :value="2">无</t-radio>
                </t-radio-group>
              </t-form-item>
              <t-form-item
                v-if="contentItem.linkType !== 2"
                :label="
                  contentItem.linkType === 0
                    ? '详情链接'
                    : contentItem.linkType === 1
                    ? '商品'
                    : ''
                "
                :field="`list.${index}.contentList.${contentIndex}.linkUrl`"
                :label-col-props="{
                  flex: '90px',
                }"
                :validate-status="`${contentItem.linkUrl ? '' : 'error'}`"
                :help="`${
                  contentItem.linkUrl ? '' : '该信息为必填项，未填写不支持发布'
                }`"
                validate-trigger="blur"
                :rules="[
                  {
                    required: true,
                    message: '该信息为必填项，未填写不支持发布',
                  },
                  {
                    required: true,
                    maxLength: 500,
                    message: '长度不超过500个字符',
                  },
                ]"
              >
                <t-textarea
                  v-if="contentItem.linkType === 0"
                  v-model="contentItem.linkUrl"
                  :max-length="{
                    length: 500,
                    errorOnly: true,
                  }"
                  show-word-limit
                  placeholder="请输入"
                  :allow-clear="false"
                />
                <t-select
                  v-if="contentItem.linkType === 1"
                  v-model="contentItem.linkUrl"
                  placeholder="请选择"
                  allow-clear
                  :allow-search="true"
                >
                  <t-option
                    v-for="itemg in goodsList"
                    :key="itemg"
                    :value="itemg.id"
                    >{{ itemg.name }}</t-option
                  >
                </t-select>
              </t-form-item>
            </t-collapse-item>
          </t-collapse>
          <div class="extra-opt-content">
            <iconpark-icon
              v-if="item.contentList.length < data?.maxContentNum"
              class="plusIcon"
              name="plus"
              size="12px"
              @click="addContent(index)"
            ></iconpark-icon>
            <t-tooltip
              v-else
              content="到达内容添加上限，删除后可操作"
              position="tl"
            >
              <!-- <iconpark-icon
                class="plusIcon"
                style="cursor: not-allowed"
                name="plus"
                size="12px"
              ></iconpark-icon> -->
              <icon-plus
                class="plusIcon"
                style="cursor: not-allowed"
                size="12px"
              />
            </t-tooltip>
            <span>{{ `添加内容 (最多支持${data?.maxContentNum}条)` }}</span>
          </div>
        </t-collapse-item>
        <t-divider />
      </t-collapse>
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
          v-if="form.list.length < data?.maxNum"
          class="plusIcon"
          name="squarePlus"
          size="20px"
          @click="addBlock"
        ></iconpark-icon>
        <t-tooltip
          v-else
          content="到达区块添加上限，删除后可操作"
          position="tl"
        >
          <iconpark-icon
            class="plusIcon"
            style="cursor: not-allowed"
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
import { ToolData } from '../../config/tools';

type GoodsItem = {
  name: string;
  id: string;
};
const props = defineProps({
  data: Object,
  isPro: Boolean,
  goodsList: Array as PropType<GoodsItem[]>,
});
const confirmLoading = ref(false);

// 截图尺寸
const stencilSize = ref({
  width: 1200,
  height: 520,
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
    ...ToolData?.TreeTextNavigation?.configValue[0],
  });
};
const addContent = (index: number) => {
  form.value.list[index].contentList.push({
    ...ToolData?.TreeTextNavigation?.configValue[0]?.contentList[0],
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

const deleteSpaceContent = (index: number, contentIndex: number) => {
  form.value.list[index].contentList.splice(contentIndex, 1);
};

const numberList = (list: any) => {
  const indexList = list.map((item: any, index: any) => {
    return index;
  });
  return indexList;
};

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

.extra-opt-content {
  display: flex;
  align-items: center;
  margin-top: 20px;

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

::v-deep(.tele-collapse-item) {
  border-bottom: 0;
}

::v-deep(.tele-collapse-item-header-left) {
  padding-left: 20px;
}

::v-deep(.tele-collapse-item .tele-collapse-item-icon-hover) {
  left: 4px;
}

::v-deep(.tele-collapse-item-active > .tele-collapse-item-header) {
  border-color: #fff;
}

::v-deep(.tele-collapse-item-content-box) {
  padding: 16px 0 12px 0;
}

::v-deep(.tele-collapse-item-content) {
  padding-right: 0;
  padding-left: 12px;
  background: none;
}

.son-collapse {
  margin-top: 20px;

  ::v-deep(.tele-collapse-item) {
    padding: 0 12px;
  }

  border-bottom ::v-deep(.tele-collapse-item-content) {
    padding: 0;
  }

  ::v-deep(.tele-collapse-item-active > .tele-collapse-item-header) {
    border-color: rgb(var(--gray-3)) !important;
  }
}
</style>
