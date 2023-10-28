<template>
  <div>商品管理</div>
  <div v-for="(item, index) in templateList" :key="index" class="templateItem">
    <span> 模块{{ index }}: {{ item.moduleName }} </span>
    <span>
      <t-button type="text" @click="editTemplate(index)">编辑</t-button>
      <t-button type="text" @click="delTemplate(index)">删除</t-button>
    </span>
  </div>
  <div class="templateAdd">
    <iconpark-icon
      class="plusIcon"
      name="squarePlus"
      size="20px"
      @click="addTemplate"
    ></iconpark-icon>
    <span>添加详情模块</span>
  </div>

  <TemplateDrawer
    v-if="drawerVisible"
    :current-index="currentIndex"
    @save="addOrEditTemplate"
    @close="closeDrawer"
  ></TemplateDrawer>
</template>

<script lang="ts" setup>
import { ref, provide } from 'vue';
import TemplateDrawer from './template.vue';

const currentIndex = ref<number>(-1); // 如果为-1代表新增，如果>=0 代表编辑
const drawerVisible = ref(false);
const templateList = ref<Record<string, any>>([]);
provide('templateList', templateList);

const addTemplate = () => {
  drawerVisible.value = true;
  currentIndex.value = -1;
};

const addOrEditTemplate = (data: any) => {
  console.log('index.vue:44', currentIndex.value, data);
  if (currentIndex.value > -1) {
    templateList.value[currentIndex.value] = data;
  } else {
    templateList.value.push(data);
  }
  drawerVisible.value = false;
};

const editTemplate = (index: string) => {
  drawerVisible.value = true;
  currentIndex.value = Number(index);
};
const delTemplate = (index: string) => {
  templateList.value.splice(index, 1);
};

const closeDrawer = () => {
  drawerVisible.value = false;
};
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
  padding: 12px 16px;
  background: #f6f7fb;
  border: 1px solid #e5e8ef;
  border-radius: 2px;

  .plusIcon {
    margin-right: 8px;
  }
}
</style>
