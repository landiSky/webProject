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
            :max-length="8"
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
            :max-length="40"
            show-word-limit
          />
        </t-form-item>

        <t-form-item
          label="详情链接"
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
            max-length="40"
            show-word-limit
            placeholder="请输入"
          />
        </t-form-item>
      </div>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch, onMounted, PropType } from 'vue';
import { UpperNumberList } from '@/enums/decoration';

type GoodsItem = {
  name: string;
  id: string;
};
const props = defineProps({
  data: Object,
  goodsList: Array as PropType<GoodsItem[]>,
});

const { data } = toRefs(props);
const formRef = ref();

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

const form = ref<ConfigData>({
  mainTitle: '',
  list: [],
});

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
