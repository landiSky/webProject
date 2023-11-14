<template>
  <div>
    <div
      v-for="(item, index) in templateList"
      :key="index"
      class="templateItem"
    >
      <span> 模块{{ number2local[index] }}: {{ item.moduleName }} </span>
      <span>
        <t-button type="text" @click="editTemplate(index)">编辑</t-button>
        <t-button type="text" @click="delTemplate(index)">删除</t-button>
      </span>
    </div>
    <div v-if="templateList?.length < 7" class="templateAdd">
      <iconpark-icon
        class="plusIcon"
        name="squarePlus"
        size="20px"
        @click="addTemplate"
      ></iconpark-icon>
      <span>添加详情模块</span>
    </div>
  </div>
  <!-- <div id="templateContainer"> popup-container="#templateContainer" -->
  <t-drawer
    title="添加详情模块"
    ok-text="下一步"
    :width="720"
    :visible="drawerVisible"
    unmount-on-close
    :mask-closable="false"
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
          :class="{ active: selectTempIndex === index }"
          @click="selectTempIndex = index"
          >模板{{ item }}</t-button
        >
      </div>
      <div class="preview">
        <span>{{ TemplateEnum?.[selectTempIndex].desc }}</span>
        <span>{{ TemplateEnum?.[selectTempIndex].tips }}</span>
        <img
          :src="`src/assets/images/home/goods/template${
            selectTempIndex + 1
          }.png`"
          alt="模板"
        />
      </div>
    </div>
    <div v-else class="formWrapper">
      <component
        :is="dynaticComponent"
        ref="formWrapRef"
        :current-index="currentIndex"
      ></component>
    </div>
  </t-drawer>
  <!-- </div> -->
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits, provide } from 'vue';
import type { Ref } from 'vue';
import Form1 from './template/form1.vue';
import Form2 from './template/form2.vue';
import Form3 from './template/form3.vue';
import Form4 from './template/form4.vue';
import Form5 from './template/form5.vue';
import Form6 from './template/form6.vue';

import { TemplateEnum } from '../constant';

const currentIndex = ref<number>(-1); // 如果为-1代表新增，如果>=0 代表编辑
const drawerVisible = ref(false);

const number2local: string[] = ['一', '二', '三', '四', '五', '六', '七'];

// const emit = defineEmits(['save', 'close']);
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
  console.log('template.vue:75', selectTempIndex.value);

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
  drawerVisible.value = false;
  initDrawer();
};

const saveTemplate = () => {
  const { formRef, form } = formWrapRef.value;
  console.log('======表单数据:', form);

  formRef.validate((errors: any) => {
    if (!errors) {
      if (currentIndex.value > -1) {
        templateList.value[currentIndex.value] = form;
      } else {
        templateList.value.push(form);
      }
      drawerVisible.value = false;
      initDrawer();
    } else {
      console.log('======表单校验未通过:', errors);
    }
  });
};

const addTemplate = () => {
  console.log('template.vue:158==addTemplate');
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
  width: 502px;
  height: 44px;
  margin-bottom: 4px;
  padding: 12px 16px;
  font-size: 12px;
  font-family: PingFang SC;
  border: 1px solid #e5e8ef;
  border-radius: 2px;

  span {
    color: #1d2129;
  }
}

.templateAdd {
  display: flex;
  align-items: center;
  width: 502px;
  padding: 12px 16px;
  background: #f6f7fb;
  border: 1px solid #e5e8ef;
  border-radius: 2px;

  .plusIcon {
    margin-right: 8px;
  }
}

#templateContainer {
  z-index: 1;

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
  padding: 24px 20px;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px; /* 166.667% */
}
</style>
