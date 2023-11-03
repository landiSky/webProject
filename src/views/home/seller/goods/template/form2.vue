<template>
  <t-form
    ref="formRef"
    :model="form"
    :style="{ width: '680px' }"
    :label-col="{ span: 4 }"
    label-align="left"
    auto-label-width
  >
    <t-form-item
      field="moduleName"
      label="模块标题"
      :rules="[
        { required: true, message: '请输入模块标题' },
        { maxLength: 10, message: '最多允许输入10个字符' },
      ]"
      :validate-trigger="['change', 'input']"
    >
      <t-input
        v-model="form.moduleName"
        placeholder="请输入模块标题"
        :max-length="{ length: 10, errorOnly: true }"
        allow-clear
        show-word-limit
      />
    </t-form-item>
    <template v-for="(item, index) in form.blockList" :key="index">
      <t-divider />
      <span class="header">
        <span>
          <span class="leftDivider"></span>
          区块{{ transSeq[index] }}
        </span>
        <t-tooltip
          v-if="form.blockList.length === 1"
          content="至少保留一个区块"
        >
          <t-link disabled @click="delBlock(index)"> 删除 </t-link>
        </t-tooltip>
        <t-link v-else @click="delBlock(index)"> 删除 </t-link>
      </span>

      <t-form-item
        :field="`blockList.${index}.name`"
        label="区块标题"
        :rules="[
          {
            required: true, 
            validator: (value: string, cb: any) =>
              itemValid(15, '请输入区块标题', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-input
          v-model="item.name"
          placeholder="请输入区块标题"
          :max-length="{ length: 15, errorOnly: true }"
          allow-clear
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        :field="`blockList.${index}.desc`"
        label="区块简介"
        :rules="[
          {
            required: true,
            validator: (value: string, cb: any) =>
              itemValid(150, '请输入区块简介', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-textarea
          v-model="item.desc"
          placeholder="请输入区块简介"
          :max-length="{ length: 150, errorOnly: true }"
          allow-clear
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        :field="`blockList.${index}.picUrl`"
        label="配图"
        :rules="[
          {
            required: true, 
            validator: (value: string, cb: any) => itemValid(0, '请上传配图', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <div>
          <t-upload
            list-type="picture-card"
            :file-list="item.picUrl ? [{ url: item.picUrl }] : []"
            action="/api/v1/handle/bind-handle"
            accept=".jpg,.png,.bmp,.tif,.gif"
            :limit="1"
            :auto-upload="false"
            tip="点击上传"
            @change="(_: any, currentFile: any) => onUploadChange(_, currentFile, index)"
          >
          </t-upload>
          <span class="uploadTips">
            建议图片尺寸：200px *
            200px，支持jpg、png、bmp、tif、gif文件格式，文件大小限制10M以内。
          </span>
        </div>
      </t-form-item>
    </template>
  </t-form>
  <t-divider />
  <div v-show="form.blockList.length < 6" class="extraOpt">
    <iconpark-icon
      class="plusIcon"
      name="squarePlus"
      size="20px"
      @click="addBlock"
    ></iconpark-icon>
    <span>添加区块</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, inject } from 'vue';
import type { Ref } from 'vue';

const formRef = ref();
const transSeq = ['一', '二', '三', '四', '五', '六'];

const templateList: Ref<Record<string, any>[]> = inject(
  'templateList',
  ref([])
);
const props = defineProps({
  currentIndex: {
    type: Number,
    default: -1,
  },
});

const initForm = {
  type: 2,
  moduleName: '',
  blockList: [
    {
      name: '',
      desc: '',
      picUrl: '',
    },
  ],
};

const form = ref(
  props.currentIndex > -1 && Array.isArray(templateList.value)
    ? { ...templateList.value[props.currentIndex] }
    : { ...initForm }
);

const itemValid = (
  maxLen: number,
  msg: string,
  value: string,
  cb: (params?: any) => void
) => {
  if (!value) {
    return cb(msg);
  }

  if (maxLen > 0 && String(value).length > maxLen) {
    return cb(`最多允许输入${maxLen}个字符`);
  }

  return cb();
};

const addBlock = () => {
  form.value.blockList.push({
    name: '',
    desc: '',
    picUrl: '',
  });
};

const delBlock = (index: number) => {
  form.value.blockList.splice(index, 1);
};

const onUploadChange = (
  _: any,
  currentFile: Record<string, any>,
  index: number
) => {
  form.value.blockList[index].picUrl = currentFile.url;
};

defineExpose({
  form,
  formRef,
});
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #1d2129;

  .leftDivider {
    display: inline-block;
    width: 2px;
    height: 10px;
    margin-right: 8px;
    background-color: #1664ff;
  }
}

.uploadTips {
  color: #86909c;
}

.extraOpt {
  display: flex;
  align-items: center;

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
</style>
