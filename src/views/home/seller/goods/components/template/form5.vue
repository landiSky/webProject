<template>
  <t-form
    ref="formRef"
    :model="form"
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
        :field="`blockList.${index}.name1`"
        label="标题一"
        :rules="[
          {
            required: true,
            validator: (value: string, cb: any) => itemValid(15, '请输入标题一', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-input
          v-model="item.name1"
          placeholder="请输入标题一"
          :max-length="{ length: 15, errorOnly: true }"
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        :field="`blockList.${index}.desc1`"
        label="简介一"
        :rules="[
          {
            required: true,
            validator: (value: string, cb: any) => itemValid(40, '请输入简介一', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-textarea
          v-model="item.desc1"
          placeholder="请输入简介一"
          :max-length="{ length: 40, errorOnly: true }"
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        :field="`blockList.${index}.name2`"
        label="标题二"
        :rules="[
          {
            required: true,
            validator: (value: string, cb: any) => itemValid(15, '请输入标题二', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-input
          v-model="item.name2"
          placeholder="请输入标题二"
          :max-length="{ length: 15, errorOnly: true }"
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        :field="`blockList.${index}.desc2`"
        label="简介二"
        :rules="[
          {
            required: true,
            validator: (value: string, cb: any) => itemValid(40, '请输入简介二', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-textarea
          v-model="item.desc2"
          placeholder="请输入简介二"
          :max-length="{ length: 40, errorOnly: true }"
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        :field="`blockList.${index}.name3`"
        label="标题三"
        :rules="[
          {
            required: true,
            validator: (value: string, cb: any) => itemValid(15, '请输入标题三', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-input
          v-model="item.name3"
          placeholder="请输入标题三"
          :max-length="{ length: 15, errorOnly: true }"
          show-word-limit
        />
      </t-form-item>
      <t-form-item
        :field="`blockList.${index}.desc3`"
        label="简介三"
        :rules="[
          {
            required: true,
            validator: (value: string, cb: any) => itemValid(40, '请输入简介三', value, cb),
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <t-textarea
          v-model="item.desc3"
          placeholder="请输入简介三"
          :max-length="{ length: 40, errorOnly: true }"
          show-word-limit
        />
      </t-form-item>
    </template>
  </t-form>
  <t-divider />
  <div v-show="form.blockList.length < 3" class="extraOpt">
    <iconpark-icon
      class="plusIcon"
      name="squarePlus"
      size="20px"
      @click="addBlock"
    ></iconpark-icon>
    <span>添加一组区块（含3组信息）</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, defineProps } from 'vue';
import type { Ref } from 'vue';

const formRef = ref();
const transSeq = ['一', '二', '三'];

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
  type: 5,
  moduleName: '',
  blockList: [
    {
      name1: '',
      desc1: '',
      name2: '',
      desc2: '',
      name3: '',
      desc3: '',
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
  display: inline-block;
  margin-top: 8px;
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
