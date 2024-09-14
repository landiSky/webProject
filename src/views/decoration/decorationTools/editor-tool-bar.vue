<template>
  <div v-if="tools.length" class="editor-tool-bar">
    <draggable
      item-key="index"
      ghost-class="ghost"
      drag-class="dragClass"
      class="components-view"
      :sort="false"
      :force-fallback="true"
      :fallback-tolerance="0"
      :touch-start-threshold="0"
      :group="{ name: 'vehicle-station', pull: 'clone', put: false }"
      :list="tools"
      @end="onEnd"
    >
      <template #item="{ element }">
        <transition name="el-fade-in-linear">
          <div v-show="true" class="element-wrap">
            <iconpark-icon
              :name="ToolData[element].icon"
              size="18px"
            ></iconpark-icon>
            <div class="element-wrap-text">{{
              ToolData[element].chineseName
            }}</div>
          </div>
        </transition>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue';
import draggable from 'vuedraggable';
import {
  tools,
  ToolData,
} from '@/views/decoration/decorationTools/config/tools';

console.log('ToolData', ToolData, tools);

const emit = defineEmits(['onEnd']);

const sectionIndex = ref<number>(0);

const onEnd = (evt: any) => {
  if (
    evt.target.className === 'components-view'
    // &&
    // evt.to.className === 'components-wrap'
  ) {
    // 内部拖拽
    // 左侧组件列表的下标
    sectionIndex.value = evt.oldIndex;
  }
  // console.log(
  //   'evt:',
  //   evt,
  //   ',newIndex:',
  //   evt.newIndex,
  //   ',oldIndex:',
  //   evt.oldIndex
  // );
  console.log('拖拽结束，广播时间onEnd:', evt.newIndex);

  emit('onEnd', evt.newIndex);
};

onMounted(() => {});
</script>

<style scoped lang="less">
.editor-tool-bar {
  height: 100%;
  padding-top: 20px;
  border: 1px solid #e5e8ef;
}

.element-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin: 5px auto;
  // background-color: red;
  &:hover {
    background-color: #f2f3f8;
    border-radius: 2px;
    cursor: pointer;
  }

  .element-wrap-icon {
    font-size: 16px;
  }

  .element-wrap-text {
    margin-top: 8px;
    color: #1d2129;
    font-size: 12px;
  }
}

// .components-view,
// .components-wrap {
//   height: 100%;
// }
.dragClass {
  border: 1px solid #1664ff;
  border-radius: 8px;
}

.ghost {
  background-color: #e8f4ff !important;
}

// .operate-container,
// .section-container,
// .components-container {
//   float: left;
//   width: 300px;
//   height: 800px;
//   padding-top: 30px;
//   text-align: center;
// }

// .section-container {
//   background-color: blanchedalmond;
// }

// .components-container {
//   margin-left: 30px;
//   background-color: rgb(184, 205, 178);
// }

// .operate-container {
//   margin-left: 30px;
//   background-color: rgb(125, 176, 228);
// }

// .section {
//   width: 150px;
//   height: 80px;
//   margin-bottom: 30px;
//   line-height: 80px;
//   text-align: center;
//   background-color: cadetblue;
//   cursor: pointer;
// }
</style>
