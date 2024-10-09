<template>
  <div v-if="toolsGroup.length" class="editor-tool-bar">
    <!-- <div class="group-title">{{ item.name }}</div> -->
    <draggable
      v-model="toolsGroup"
      item-key="index"
      ghost-class="ghost"
      drag-class="dragClass"
      class="components-view"
      :sort="false"
      :force-fallback="true"
      :fallback-tolerance="0"
      :touch-start-threshold="0"
      :group="{ name: 'vehicle-station', pull: 'clone', put: false }"
      draggable=".draggable"
      @end="onEnd"
    >
      <template #item="{ element }">
        <transition
          name="el-fade-in-linear"
          :class="{ draggable: !element.noDrag }"
        >
          <div
            v-show="true"
            :class="element.noDrag ? 'group-title' : 'element-wrap'"
          >
            <span v-if="element.type === 'title'">{{ element.title }} </span>
            <div v-else id="toolbar-tooltip-container">
              <t-tooltip
                is-bright
                enter-delay="1000"
                position="rt"
                popup-container="#toolbar-tooltip-container"
              >
                <template #content>
                  <t-image width="350" height="232" :src="singleImgText" />
                </template>
                <div class="element-group">
                  <iconpark-icon
                    :name="ToolData[element.text].icon"
                    size="18px"
                  ></iconpark-icon>
                  <div class="element-wrap-text">{{
                    ToolData[element.text].chineseName
                  }}</div>
                </div>
              </t-tooltip>
            </div>
          </div>
        </transition>
      </template>
      <!-- <template #item="{ element }">
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
        </template> -->
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue';
import draggable from 'vuedraggable';
import {
  tools,
  ToolData,
  toolsGroup,
} from '@/views/decoration/decorationTools/config/tools';
import singleImgText from '@/assets/images/decoration/sigleImgText.png';

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
  padding: 0 8px;
  border: 1px solid #e5e8ef;
  border-bottom: 0;
}

.group-title {
  height: 54px;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 14px;
  line-height: 54px;
  text-align: center;
  box-shadow: 0 1px 0 0 #e5e8ef;
}

.element-wrap {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin-bottom: 10px;
  text-align: center;

  &:nth-child(even) {
    margin-right: 8px;
  }

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

#toolbar-tooltip-container {
  :deep(.tele-tooltip-content) {
    max-width: none;
    max-height: none;
  }
}
</style>
