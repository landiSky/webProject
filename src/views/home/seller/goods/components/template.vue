<template>
  <div style="width: 100%">
    <div
      v-for="(item, index) in templateList"
      :key="index"
      class="templateItem"
    >
      <div style="display: flex">
        <div>模块{{ number2local[index] }}: </div
        ><div style="color: #1d2129">{{ item.moduleName }} </div>
      </div>
      <div>
        <t-button type="text" style="padding: 0" @click="editTemplate(index)"
          >编辑</t-button
        >
        <t-button
          type="text"
          style="margin-left: 16px; padding: 0; color: #4e5969"
          @click="delTemplate(index)"
          >删除</t-button
        >
      </div>
    </div>
    <div v-if="templateList?.length < 6" class="templateAdd">
      <iconpark-icon
        class="plusIcon"
        name="squarePlus"
        size="20px"
        @click="addTemplate"
      ></iconpark-icon>
      <span>添加详情模块</span>
    </div>
  </div>
  <t-drawer
    :title="`${currentIndex === -1 ? '添加' : '编辑'}详情模块`"
    ok-text="下一步"
    :width="720"
    :visible="drawerVisible"
    unmount-on-close
    :mask-closable="false"
    :drawer-body-style="{ padding: 0 }"
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
    <div v-show="currentStep === 1" class="template">
      <div class="btnList">
        <t-button
          v-for="(item, index) in ['一', '二', '三', '四', '五', '六']"
          :key="index"
          :class="{ active: selectTempIndex === index }"
          :disabled="currentIndex !== -1"
          @click="selectTempIndex = index"
          >模板{{ item }}</t-button
        >
      </div>
      <div class="preview">
        <span>{{ TemplateEnum?.[selectTempIndex].desc }}</span>
        <span>{{ TemplateEnum?.[selectTempIndex].tips }}</span>
        <img :src="tempateImgList[selectTempIndex]" alt="模板" />
      </div>
    </div>
    <div v-show="currentStep !== 1" class="formWrapper">
      <component
        :is="dynaticComponent"
        ref="formWrapRef"
        :current-index="currentIndex"
      ></component>
    </div>
  </t-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, provide, defineEmits } from 'vue';
import { Modal } from '@tele-design/web-vue';
import template1 from '@/assets/images/home/goods/template1.png';
import template2 from '@/assets/images/home/goods/template2.png';
import template3 from '@/assets/images/home/goods/template3.png';
import template4 from '@/assets/images/home/goods/template4.png';
import template5 from '@/assets/images/home/goods/template5.png';
import template6 from '@/assets/images/home/goods/template6.png';
import Form1 from './template/form1.vue';
import Form2 from './template/form2.vue';
import Form3 from './template/form3.vue';
import Form4 from './template/form4.vue';
import Form5 from './template/form5.vue';
import Form6 from './template/form6.vue';

import { TemplateEnum } from '../constant';

const currentIndex = ref<number>(-1); // 如果为-1代表新增，如果>=0 代表编辑
const drawerVisible = ref(false);
const emit = defineEmits(['confirm']);

const number2local: string[] = ['一', '二', '三', '四', '五', '六', '七'];
const tempateImgList = [
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
];

const props = defineProps({
  templateData: {
    type: Array,
    default: () => [],
  },
});

// 编辑还是新增
const templateList = ref<Record<string, any>[]>(
  props.templateData ? (props.templateData as any[]) : []
);

provide('templateList', templateList);

const currentStep = ref(1);
const selectTempIndex = ref(0);
const formWrapRef = ref();

const forCompList = [Form1, Form2, Form3, Form4, Form5, Form6];
const dynaticComponent = computed(() => {
  return forCompList[selectTempIndex.value];
});

const clickStep = (step: number) => {
  currentStep.value = step || 1;
};

const initDrawer = () => {
  currentStep.value = 1;
  selectTempIndex.value = 0;
};

const handleCancel = () => {
  if (props.templateData?.length) {
    Modal.warning({
      title: '已编辑信息尚未保存，取消后将清空',
      titleAlign: 'start',
      content: '',
      okText: '确定',
      hideCancel: false,
      onOk: () => {
        drawerVisible.value = false;
        initDrawer();
      },
      onCancel: () => {
        return false;
      },
    });
  } else {
    drawerVisible.value = false;
    initDrawer();
  }
};

const saveTemplate = () => {
  const { formRef, form } = formWrapRef.value;

  formRef.validate((errors: any) => {
    if (!errors) {
      if (currentIndex.value > -1) {
        templateList.value[currentIndex.value] = form;
      } else {
        templateList.value.push(form);
      }
      drawerVisible.value = false;
      initDrawer();
      emit('confirm');
    }
  });
};

const addTemplate = () => {
  drawerVisible.value = true;
  currentIndex.value = -1;
};

const editTemplate = (index: number) => {
  drawerVisible.value = true;
  currentIndex.value = Number(index);
  selectTempIndex.value = templateList.value[index].type - 1;
};
const delTemplate = (index: number) => {
  templateList.value.splice(index, 1);
};

defineExpose({
  templateData: templateList,
});
</script>

<style lang="less" scoped>
.templateItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  margin-bottom: 4px;
  padding: 12px 16px;
  color: #4e5969;
  font-size: 12px;
  font-family: PingFang SC;
  border: 1px solid #e5e8ef;
  border-radius: 2px;
}

.templateAdd {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f6f7fb;
  border: 1px solid #e5e8ef;
  border-radius: 2px;

  .plusIcon {
    margin-right: 8px;
  }
}

.step {
  padding: 20px 50px;
  background-color: #f2f3f8;

  :deep(.tele-steps) {
    width: 332px;
    margin: 0 auto;

    .tele-steps-icon {
      padding-top: 1px;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
    }

    .tele-steps-item-wait {
      .tele-steps-icon {
        color: #4e5969;
        background-color: #fff;
      }
    }

    .tele-steps-item-finish {
      .tele-steps-icon {
        color: #1664ff;
        background-color: #fff;

        svg {
          stroke-width: 8px;
        }
      }
    }
  }
}

.template {
  padding: 20px;

  .btnList {
    display: flex;
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
  padding-top: 24px;
  padding-right: 20px;
  padding-left: 20px;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px; /* 166.667% */

  :deep(.tele-upload-list) {
    .tele-upload-picture-card,
    .tele-upload-list-picture {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
