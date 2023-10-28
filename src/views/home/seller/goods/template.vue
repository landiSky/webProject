<template>
  <div id="templateContainer"></div>
  <t-drawer
    title="添加详情模块"
    ok-text="下一步"
    :width="720"
    :visible="visible"
    unmount-on-close
    :mask-closable="false"
    popup-container="#templateContainer"
    @cancel="handleCancel"
  >
    <template #footer>
      <t-button @click="handleCancel">取消</t-button>
      <template v-if="currentStep === 1">
        <t-button type="primary" @click="clickStep(2)">下一步 </t-button>
      </template>
      <template v-else>
        <t-button @click="clickStep(1)">上一步</t-button>
        <t-button type="primary" @click="saveTemplate">保存</t-button>
      </template>
    </template>

    <div class="step">
      <t-steps :current="currentStep">
        <t-step>选择展示模板</t-step>
        <t-step>编辑模板内容</t-step>
      </t-steps>
    </div>
    <div v-if="currentStep === 1" class="template">
      <div class="btnList">
        <t-button
          v-for="(item, index) in ['一', '二', '三', '四', '五', '六']"
          :key="index"
          :class="{ active: selectIndex === index }"
          @click="selectIndex = index"
          >模板{{ item }}</t-button
        >
      </div>
      <div class="preview">
        <span>{{ TemplateEnum?.[selectIndex].desc }}</span>
        <span>{{ TemplateEnum?.[selectIndex].tips }}</span>
        <img
          :src="`src/assets/images/home/goods/template${selectIndex + 1}.png`"
          alt="模板"
        />
      </div>
    </div>
    <div v-else class="formWrapper">
      <component
        :is="dynaticComponent"
        ref="formWrapRef"
        :current-index="props.currentIndex"
      ></component>
    </div>
  </t-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits, inject } from 'vue';
import type { Ref } from 'vue';
import Form1 from './template/form1.vue';
import Form2 from './template/form2.vue';
import Form3 from './template/form3.vue';
import Form4 from './template/form4.vue';
import Form5 from './template/form5.vue';
import Form6 from './template/form6.vue';

import { TemplateEnum } from './constant';

const emit = defineEmits(['save', 'close']);
const props = defineProps({
  currentIndex: {
    type: Number,
    default: -1,
  },
});

const templateList: Ref<Record<string, any>[]> = inject(
  'templateList',
  ref([])
);

const visible = ref(true);
const currentStep = ref(1);
const selectIndex = ref(
  props.currentIndex > -1 &&
    Array.isArray(templateList.value) &&
    templateList.value.length
    ? templateList.value[props.currentIndex].type - 1
    : 0
);
const formWrapRef = ref();

const dynaticComponent = computed(() => {
  console.log('template.vue:75', selectIndex.value);
  const forCompList = [Form1, Form2, Form3, Form4, Form5, Form6];
  return forCompList[selectIndex.value];
});

const handleCancel = () => {
  emit('close');
};

const clickStep = (step: number) => {
  console.log('template.vue:92', selectIndex.value);
  currentStep.value = step || 1;
};

const saveTemplate = () => {
  const { formRef, form } = formWrapRef.value;
  console.log('======表单数据:', form);

  formRef.validate((errors: any) => {
    if (!errors) {
      emit('save', form);
    } else {
      console.log('======表单校验未通过:', errors);
    }
  });
};
</script>

<style lang="less" scoped>
#templateContainer {
  :deep(.tele-drawer-body) {
    padding: 0;
  }
}

.step {
  padding: 20px 50px;
  background-color: #f2f3f8;
}

.template {
  padding: 20px;

  .btnList {
    margin-bottom: 16px;
    color: #4e5969;
    font-weight: 400;
    font-size: 12px;

    button {
      width: 100px;
      margin-right: 16px;
      line-height: 20px; /* 166.667% */
      border-radius: 2px;

      &:last-child {
        margin-right: 0;
      }

      &.active {
        color: #1664ff;
        background-color: #e8f4ff;
      }
    }
  }

  .preview {
    padding: 20px;
    background: rgba(29, 33, 41, 0.6);
    border-radius: 2px;

    span {
      display: block;
      margin-bottom: 4px;
      color: #fff;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px; /* 166.667% */
    }

    img {
      width: 640px;
      margin-top: 12px;
    }
  }
}

.formWrapper {
  padding: 24px 20px;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px; /* 166.667% */
}
</style>
