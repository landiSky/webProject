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
    </t-form>

    <t-tabs default-active-key="1">
      <t-tab-pane key="1" title="左区域">
        <t-form
          ref="formRef"
          :model="form.configValue1"
          auto-label-width
          :style="{
            width: '100%',
            marginTop: '30px',
            paddingRight: '10px',
          }"
          label-align="left"
        >
          <t-form-item
            label="次标题"
            field="subTitle"
            :label-col-props="{
              flex: '90px',
              align: 'center',
            }"
            :validate-trigger="['blur', 'input']"
            :rules="[{ required: true, message: '必填' }]"
          >
            <t-input
              v-model="form.configValue1.subTitle"
              placeholder="请输入"
              :max-length="10"
              show-word-limit
              allow-clear
            />
          </t-form-item>
          <div
            v-for="(item, index) in form.configValue1.config"
            :key="index"
            :style="{ width: '100%', marginTop: '0px' }"
          >
            <t-space style="margin-top: 10px; margin-bottom: 20px">
              <div class="vertical-line"></div>
              <div>{{ `区块${UpperNumberList[index]}` }}</div>
            </t-space>
            <span
              v-if="form.configValue1.config.length > 2"
              class="delete-btn"
              @click="form.configValue1.config.splice(index, 1)"
              >删除
            </span>
            <t-form-item
              label="标题"
              :field="`config.${index}.title`"
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
                :max-length="8"
                show-word-limit
                allow-clear
              />
            </t-form-item>
            <t-form-item
              label="详情简介"
              :field="`config.${index}.desc`"
              :label-col-props="{
                flex: '90px',
                align: 'center',
              }"
              validate-trigger="blur"
              :rules="[{ required: true, message: '必填' }]"
            >
              <t-textarea
                v-model="item.desc"
                placeholder="请输入图片简介"
                allow-clear
                :max-length="40"
                show-word-limit
              />
            </t-form-item>

            <t-form-item
              label="关联"
              :field="`config.${index}.linkType`"
              :label-col-props="{
                flex: '90px',
              }"
              validate-trigger="blur"
              :rules="[{ required: true, message: '必填' }]"
            >
              <t-radio-group v-model="item.linkType">
                <t-radio :value="0">链接</t-radio>
                <t-radio :value="1">商品</t-radio>
                <t-radio :value="2">无</t-radio>
              </t-radio-group>
            </t-form-item>
            <t-form-item
              v-if="item.linkType !== 2"
              :label="
                item.linkType === 0
                  ? '链接地址'
                  : item.linkType === 1
                  ? '商品'
                  : ''
              "
              :field="`config.${index}.linkUrl`"
              :label-col-props="{
                flex: '90px',
              }"
              validate-trigger="blur"
              :rules="[{ required: true, message: '必填' }]"
            >
              <t-textarea
                v-if="item.linkType === 0"
                v-model="item.linkUrl"
                max-length="40"
                show-word-limit
                placeholder="请输入链接地址"
              />
              <t-select
                v-if="item.linkType === 1"
                v-model="item.linkUrl"
                placeholder="请选择"
                allow-clear
              >
                <t-option v-for="itemg in goodList" :key="itemg">{{
                  itemg
                }}</t-option>
              </t-select>
            </t-form-item>

            <t-form-item
              label="配图"
              :field="`config.${index}.src`"
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
                <span
                  style="margin-top: -20px; color: #86909c; font-size: 12px"
                >
                  {{
                    `建议图片尺寸：${stencilSize.width}px *
              ${stencilSize.height}px，支持jpg、png、bmp、tif、gif文件格式，文件大小限制10M以内。`
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
        <div class="area-add-box">
          <t-divider margin="0" />
          <div class="area-add-box-content">
            <iconpark-icon
              v-if="form.configValue1.config.length < 4"
              style="cursor: pointer"
              name="squarePlus"
              :size="20"
              @click="addBlock1"
            />
            <iconpark-icon
              v-else
              style="cursor: not-allowed"
              name="squarePlusGray"
              size="20"
            />
            <span>添加区块（最多支持4个区块）</span>
          </div>
        </div>
      </t-tab-pane>
      <t-tab-pane key="2" title="右区域">
        <t-form
          ref="formRef"
          :model="form.configValue2"
          auto-label-width
          :style="{
            width: '100%',
            marginTop: '30px',
            paddingRight: '10px',
          }"
          label-align="left"
        >
          <t-form-item
            label="次标题"
            field="subTitle"
            :label-col-props="{
              flex: '90px',
              align: 'center',
            }"
            :validate-trigger="['blur', 'input']"
            :rules="[{ required: true, message: '必填' }]"
          >
            <t-input
              v-model="form.configValue2.subTitle"
              placeholder="请输入"
              :max-length="10"
              show-word-limit
              allow-clear
            />
          </t-form-item>
          <div
            v-for="(item, index) in form.configValue2.config"
            :key="index"
            :style="{ width: '100%', marginTop: '0px' }"
          >
            <t-space style="margin-top: 10px; margin-bottom: 20px">
              <div class="vertical-line"></div>
              <div>{{ `区块${UpperNumberList[index]}` }}</div>
            </t-space>
            <span
              v-if="form.configValue2.config.length > 2"
              class="delete-btn"
              @click="form.configValue2.config.splice(index, 1)"
              >删除
            </span>
            <t-form-item
              label="标题"
              :field="`config.${index}.title`"
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
                :max-length="8"
                show-word-limit
                allow-clear
              />
            </t-form-item>
            <t-form-item
              label="详情简介"
              :field="`config.${index}.desc`"
              :label-col-props="{
                flex: '90px',
                align: 'center',
              }"
              validate-trigger="blur"
              :rules="[{ required: true, message: '必填' }]"
            >
              <t-textarea
                v-model="item.desc"
                placeholder="请输入图片简介"
                allow-clear
                :max-length="40"
                show-word-limit
              />
            </t-form-item>

            <t-form-item
              label="关联"
              :field="`config.${index}.linkType`"
              :label-col-props="{
                flex: '90px',
              }"
              validate-trigger="blur"
              :rules="[{ required: true, message: '必填' }]"
            >
              <t-radio-group v-model="item.linkType">
                <t-radio :value="0">链接</t-radio>
                <t-radio :value="1">商品</t-radio>
                <t-radio :value="2">无</t-radio>
              </t-radio-group>
            </t-form-item>
            <t-form-item
              v-if="item.linkType !== 2"
              :label="
                item.linkType === 0
                  ? '链接地址'
                  : item.linkType === 1
                  ? '商品'
                  : ''
              "
              :field="`config.${index}.linkUrl`"
              :label-col-props="{
                flex: '90px',
              }"
              validate-trigger="blur"
              :rules="[{ required: true, message: '必填' }]"
            >
              <t-textarea
                v-if="item.linkType === 0"
                v-model="item.linkUrl"
                max-length="40"
                show-word-limit
                placeholder="请输入链接地址"
              />
              <t-select
                v-if="item.linkType === 1"
                v-model="item.linkUrl"
                placeholder="请选择"
                allow-clear
              >
                <t-option v-for="itemg in goodList" :key="itemg">{{
                  itemg
                }}</t-option>
              </t-select>
            </t-form-item>

            <t-form-item
              label="配图"
              :field="`config.${index}.src`"
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
                <span
                  style="margin-top: -20px; color: #86909c; font-size: 12px"
                >
                  {{
                    `建议图片尺寸：${stencilSize.width}px *
              ${stencilSize.height}px，支持jpg、png、bmp、tif、gif文件格式，文件大小限制10M以内。`
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
        <div class="area-add-box">
          <t-divider margin="0" />
          <div class="area-add-box-content">
            <iconpark-icon
              v-if="form.configValue2.config.length < 4"
              style="cursor: pointer"
              name="squarePlus"
              :size="20"
              @click="addBlock2"
            />
            <iconpark-icon
              v-else
              style="cursor: not-allowed"
              name="squarePlusGray"
              size="20"
            />
            <span>添加区块（最多支持4个区块）</span>
          </div>
        </div>
      </t-tab-pane>
    </t-tabs>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch, onMounted, computed } from 'vue';
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

type ConfigForm = {
  subTitle: string;
  config: ConfigItem[];
};
// 全部配置数据
type ConfigData = {
  mainTitle: string;
  configValue1: ConfigForm;
  configValue2: ConfigForm;
};
const props = defineProps({
  data: Object,
});
const confirmLoading = ref(false);

// 截图尺寸
const stencilSize = ref({
  width: 224,
  height: 136,
});
const curIndex = ref(-1);
const showSource = ref(false);
const { data } = toRefs(props);
const formRef = ref();

const form = ref<ConfigData>({
  mainTitle: '',
  configValue1: {
    subTitle: '',
    config: [],
  },
  configValue2: {
    subTitle: '',
    config: [],
  },
});

const onBeforeRemove = (index: number) => {
  curIndex.value = index;
  console.log('第几个图片', curIndex.value);
  showSource.value = true;
};
const goodList = ['123', '456', '789'];

const onConfirm = (value: any) => {
  console.log('返回的图片信息', value, curIndex.value);
  // form.value.list[curIndex.value].src = value;
  showSource.value = false;
};

const onCancel = () => {
  showSource.value = false;
};
const addBlock1 = () => {
  // console.log('添加区块', form.value.list as any);
  if (form.value.configValue1.config.length >= 4) {
    return;
  }
  const { config } = form.value.configValue1;
  config.push({
    title: '',
    desc: '',
    src: 'eb8a97de-c8a0-4d43-89e7-c39643070b3f.jpeg',
    linkType: 0,
    linkUrl: '',
  });
};

const addBlock2 = () => {
  // console.log('添加区块', form.value.list as any);
  if (form.value.configValue2.config.length >= 4) {
    return;
  }
  const { config } = form.value.configValue2;
  config.push({
    title: '',
    desc: '',
    src: 'eb8a97de-c8a0-4d43-89e7-c39643070b3f.jpeg',
    linkType: 0,
    linkUrl: '',
  });
};

onMounted(() => {
  // form赋值
  form.value.mainTitle = data?.value?.mainTitle || '';
  form.value.configValue1 = data?.value?.configValue1 || {};
  form.value.configValue2 = data?.value?.configValue2 || {};
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

  .delete-btn {
    float: right;
    margin-top: 10px;
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

::v-deep(.tele-tabs-content) {
  padding: 0 24px;
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
