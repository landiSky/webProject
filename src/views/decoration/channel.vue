<!-- 这里是渠道页面 -->
<template>
  <div class="channel-box">
    <t-space direction="vertical" size="large" fill>
      <div class="form-box">
        <t-space>
          <div class="vertical-line"></div>
          <div class="title-text">顶部导航1</div>
        </t-space>
        <div class="row-cls">
          <span class="required-mark">*</span>
          <div class="input-title">名称配置</div>
          <div v-if="nav1NameEdit" class="input-box-edit">
            <t-input
              placeholder="Please enter something"
              allow-clear
              max-length="5"
              show-word-limit
              style="width: 260px"
            />
            <div
              style="margin: 0 16px"
              class="save-btn"
              @click="nav1NameEdit = false"
              >保存并发布</div
            >
            <div class="cancel-btn" @click="nav1NameEdit = false">取消</div>
          </div>
          <div v-else class="input-box-show">
            <span class="input-value">首页</span>
            <icon-edit
              style="color: #1664ff; cursor: pointer"
              :size="16"
              @click="nav1NameEdit = true"
            />
          </div>
        </div>
        <div class="row-cls">
          <span class="required-mark">*</span>
          <div class="input-title">页面装修</div>
          <div v-if="nav1Publish" class="save-btn" @click="goDecoration">
            去装修>>
          </div>
          <div v-else>
            <t-tag bordered style="cursor: pointer" @click="goPreview"
              >预览效果</t-tag
            >
            <t-tag bordered style="cursor: pointer" @click="goPreview"
              >发布</t-tag
            >
          </div>
        </div>
      </div>
      <div class="form-box">
        <t-space>
          <div class="vertical-line"></div>
          <div class="title-text">顶部导航2</div>
        </t-space>
        <div class="row-cls">
          <span class="required-mark">*</span>
          <div class="input-title">名称配置</div>
          <div v-if="nav2NameEdit" class="input-box-edit">
            <t-input
              placeholder="Please enter something"
              allow-clear
              max-length="5"
              show-word-limit
              style="width: 260px"
            />
            <div
              style="margin: 0 16px"
              class="save-btn"
              @click="nav2NameEdit = false"
              >保存并发布</div
            >
            <div class="cancel-btn" @click="nav2NameEdit = false">取消</div>
          </div>
          <div v-else class="input-box-show">
            <span class="input-value">平台服务</span>
            <icon-edit
              style="color: #1664ff; cursor: pointer"
              :size="16"
              @click="nav2NameEdit = true"
            />
          </div>
        </div>
        <div class="row-cls">
          <span class="required-mark">*</span>
          <div class="input-title">页面装修</div>
          <div v-if="nav2Publish" class="save-btn" @click="goDecoration">
            去装修>>
          </div>
          <div v-else>
            <t-tag bordered style="cursor: pointer" @click="goPreview"
              >预览效果</t-tag
            >
            <t-tag bordered style="cursor: pointer" @click="goPreview"
              >发布</t-tag
            >
          </div>
        </div>
      </div>
      <div class="form-box">
        <t-space>
          <div class="vertical-line"></div>
          <div class="title-text">顶部导航3</div>
        </t-space>
        <div class="row-cls">
          <span class="required-mark">*</span>
          <div class="input-title">名称配置</div>
          <div v-if="nav3NameEdit" class="input-box-edit">
            <t-input
              placeholder="Please enter something"
              allow-clear
              max-length="5"
              show-word-limit
              style="width: 260px"
            />
            <div
              style="margin: 0 16px"
              class="save-btn"
              @click="nav3NameEdit = false"
              >保存并发布</div
            >
            <div class="cancel-btn" @click="nav3NameEdit = false">取消</div>
          </div>
          <div v-else class="input-box-show">
            <span class="input-value">平台产品</span>
            <icon-edit
              style="color: #1664ff; cursor: pointer"
              :size="16"
              @click="nav3NameEdit = true"
            />
          </div>
        </div>
        <div class="row-cls">
          <span class="required-mark">*</span>
          <div class="input-title">页面装修</div>
          <div v-if="nav3Publish" class="save-btn" @click="goDecoration">
            去装修>>
          </div>
          <div v-else>
            <t-tag bordered style="cursor: pointer" @click="goPreview"
              >预览效果</t-tag
            >
            <t-tag bordered style="cursor: pointer" @click="goPreview"
              >发布</t-tag
            >
          </div>
        </div>
      </div>
    </t-space>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  xxx: {
    type: Boolean,
    default: false,
  },
  yyy: {
    type: Object,
    default() {
      return {};
    },
  },
});
// 导航1名称编辑状态
const nav1NameEdit = ref(false);
// 导航1装修状态
const nav1Publish = ref(false);

// 导航2名称编辑状态
const nav2NameEdit = ref(false);
// 导航2装修状态
const nav2Publish = ref(false);

// 导航3名称编辑状态
const nav3NameEdit = ref(false);
// 导航3装修状态
const nav3Publish = ref(false);

const goDecoration = () => {
  // router.push({ path: '/decoration/tools' });
  // window.open('/decoration/tools', '_blank');
  const routeUrl = router.resolve({
    name: 'decorationTools',
    query: { model: 0 },
  });
  window.open(routeUrl.href, '_blank');
};
const goPreview = () => {
  const routeUrl = router.resolve({
    name: 'decorationTools',
    query: { model: 1 },
  });
  window.open(routeUrl.href, '_blank');
};
</script>

<style scoped lang="less">
.channel-box {
  width: 100%;
  height: 100%;
  padding: 24px;

  .form-box {
    width: 685px;
    // background-color: red;
    .vertical-line {
      width: 4px;
      height: 14px;
      background: #1664ff;
      border-radius: 1px;
    }

    .title-text {
      font-weight: 500;
      font-size: 16px;
      font-style: normal;
      line-height: 24px;
    }

    .row-cls {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      margin-top: 18px;
      margin-left: 24px;
      font-size: 12px;
      // background-color: red;
      .input-box-edit {
        display: flex;
        align-items: center;
        width: 376px;
        margin-left: 16px;

        .save-btn,
        .cancel-btn {
          color: #1664ff;
          cursor: pointer;
        }
      }

      .input-box-show {
        display: flex;
        align-items: center;
        font-size: 12px;

        .input-value {
          margin: 0 16px;
          color: #1d2129;
        }
      }

      .required-mark {
        color: red;
      }

      .input-title {
        color: #4e5969;
      }

      .tele-tag {
        margin: 0 8px;
      }
    }
  }
}
</style>
