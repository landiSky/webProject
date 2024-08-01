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
              v-model="form1.name"
              placeholder="请输入"
              allow-clear
              max-length="5"
              show-word-limit
              style="width: 260px"
            />
            <div
              style="margin: 0 16px"
              class="save-btn"
              @click="publishName(form1)"
              >保存并发布
            </div>
            <div class="cancel-btn" @click="nav1NameEdit = false">取消</div>
          </div>
          <div v-else class="input-box-show">
            <span class="input-value">{{ form1?.name || '-' }}</span>
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
          <div
            v-if="form1?.status === 1"
            class="save-btn"
            style="margin-left: 8px"
          >
            <t-tag bordered style="cursor: pointer" @click="goHome"
              >查看前台页面
            </t-tag>
            <t-tag bordered style="cursor: pointer" @click="goDecoration(form1)"
              >继续装修
            </t-tag>
          </div>
          <div v-else-if="form1?.status === 0" style="margin-left: 8px">
            <t-tag bordered style="cursor: pointer" @click="goPreview(form1)"
              >预览效果
            </t-tag>
            <t-tag bordered style="cursor: pointer" @click="goPreview(form1)"
              >发布
            </t-tag>
          </div>
          <div
            v-else
            class="save-btn"
            style="margin-left: 16px"
            @click="goDecoration(form1)"
          >
            去装修>>
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
              v-model="form2.name"
              placeholder="请输入"
              allow-clear
              max-length="5"
              show-word-limit
              style="width: 260px"
            />
            <div
              style="margin: 0 16px"
              class="save-btn"
              @click="publishName(form2)"
              >保存并发布
            </div>
            <div class="cancel-btn" @click="nav2NameEdit = false">取消</div>
          </div>
          <div v-else class="input-box-show">
            <span class="input-value">{{ form2?.name || '-' }}</span>
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
          <div
            v-if="form2?.status === 1"
            class="save-btn"
            style="margin-left: 8px"
          >
            <t-tag bordered style="cursor: pointer" @click="goPlatProducts"
              >查看前台页面
            </t-tag>
            <t-tag bordered style="cursor: pointer" @click="goDecoration(form2)"
              >继续装修
            </t-tag>
          </div>
          <div v-else-if="form2?.status === 0" style="margin-left: 8px">
            <t-tag bordered style="cursor: pointer" @click="goPreview(form2)"
              >预览效果
            </t-tag>
            <t-tag bordered style="cursor: pointer" @click="goPreview(form2)"
              >发布
            </t-tag>
          </div>
          <div
            v-else
            class="save-btn"
            style="margin-left: 16px"
            @click="goDecoration(form2)"
          >
            去装修>>
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
              v-model="form3.name"
              placeholder="请输入"
              allow-clear
              max-length="5"
              show-word-limit
              style="width: 260px"
            />
            <div
              style="margin: 0 16px"
              class="save-btn"
              @click="publishName(form3)"
              >保存并发布
            </div>
            <div class="cancel-btn" @click="nav3NameEdit = false">取消</div>
          </div>
          <div v-else class="input-box-show">
            <span class="input-value">{{ form3?.name || '-' }}</span>
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
          <div
            v-if="form3?.status === 1"
            class="save-btn"
            style="margin-left: 8px"
          >
            <t-tag bordered style="cursor: pointer" @click="goPlatServices"
              >查看前台页面
            </t-tag>
            <t-tag bordered style="cursor: pointer" @click="goDecoration(form3)"
              >继续装修
            </t-tag>
          </div>
          <div v-else-if="form3?.status === 0" style="margin-left: 8px">
            <t-tag bordered style="cursor: pointer" @click="goPreview(form3)"
              >预览效果
            </t-tag>
            <t-tag bordered style="cursor: pointer" @click="goPreview(form3)"
              >发布
            </t-tag>
          </div>
          <div
            v-else
            class="save-btn"
            style="margin-left: 16px"
            @click="goDecoration(form3)"
          >
            去装修>>
          </div>
        </div>
      </div>
    </t-space>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import {
  apiUpdateNavData,
  apiGetNavData,
} from '@/api/decoration/decoration-tools';
import { isArray } from 'lodash';
import { ChannelType } from '@/enums/decoration';
import eventBus from '@/utils/bus';
import { useDecorationStore } from '@/store/modules/decoration';
import { storeToRefs } from 'pinia';
import { channelName } from './decorationTools/constant';

// 创建tabs通信通道
const broadcastChannel = new BroadcastChannel(channelName);

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
// const nav1Publish = ref(false);

// 导航2名称编辑状态
const nav2NameEdit = ref(false);
// 导航2装修状态
// const nav2Publish = ref(false);

// 导航3名称编辑状态
const nav3NameEdit = ref(false);
// 导航3装修状态
// const nav3Publish = ref(false);

const nav1DecorationJson = ref('');
const nav2DecorationJson = ref('');
const nav3DecorationJson = ref('');

type FormItem = {
  name: string;
  id: number;
  logo: string;
  type: number;
  status: number | null;
  detail: string;
  draftDetail: string;
};

const form1 = ref<FormItem>({
  name: '',
  id: 0,
  logo: '',
  type: ChannelType.PLATFORM_HOME,
  status: null,
  detail: '',
  draftDetail: '',
});
const form2 = ref<FormItem>({
  name: '',
  id: 0,
  logo: '',
  type: ChannelType.PLATFORM_PRODUCT,
  status: null,
  detail: '',
  draftDetail: '',
});
const form3 = ref<FormItem>({
  name: '',
  id: 0,
  logo: '',
  type: ChannelType.PLATFORM_SERVE,
  status: null,
  detail: '',
  draftDetail: '',
});

const publishName = (form: FormItem | null | undefined) => {
  console.log('publishName');
  if (!form) return;
  const { id, name } = form;
  apiUpdateNavData({ id, name }).then((res: any) => {
    console.log('publishName success', res);
    if (form.type === ChannelType.PLATFORM_HOME) {
      nav1NameEdit.value = false;
    } else if (form.type === ChannelType.PLATFORM_PRODUCT) {
      nav2NameEdit.value = false;
    } else if (form.type === ChannelType.PLATFORM_SERVE) {
      nav3NameEdit.value = false;
    }
  });
};

const goDecoration = (form: FormItem | null | undefined) => {
  if (!form) return;
  const { id, type } = form;
  const routeUrl = router.resolve({
    name: 'decorationTools',
    query: { model: 0, type, id },
  });
  window.open(routeUrl.href, '_blank');
};
const goPreview = (form: FormItem | null | undefined) => {
  if (!form) return;
  const { type, id } = form;
  const routeUrl = router.resolve({
    name: 'decorationTools',
    query: { model: 1, type, id },
  });
  window.open(routeUrl.href, '_blank');
};

const getPageData = () => {
  // 拉取所有导航数据
  apiGetNavData({}).then((res) => {
    if (isArray(res.data)) {
      res.data.forEach((item) => {
        switch (item.type) {
          case ChannelType.PLATFORM_HOME:
            form1.value = item;
            break;
          case ChannelType.PLATFORM_PRODUCT:
            form2.value = item;
            break;
          case ChannelType.PLATFORM_SERVE:
            form3.value = item;
            break;
          default:
            break;
        }
      });
    }
  });
  // 获取本地缓存的装修数据,注意key值！！！
  nav1DecorationJson.value = localStorage.getItem('componentsList2') || '';
  nav2DecorationJson.value = localStorage.getItem('componentsList3') || '';
  nav3DecorationJson.value = localStorage.getItem('componentsList4') || '';
};

const goHome = () => {
  router.push({ path: '/wow/index' });
};
const goPlatProducts = () => {
  router.push({ path: '/wow/platProducts' });
};
const goPlatServices = () => {
  router.push({ path: '/wow/platServices' });
};

onMounted(() => {
  broadcastChannel.addEventListener('message', (event) => {
    console.log('Received message:', event.data);
    const { name, data } = JSON.parse(event.data);
    // 其他tab发送的消息
    if (name === 'chnnelPageRefresh') {
      getPageData();
    }
  });
  getPageData();
});

onBeforeUnmount(() => {
  broadcastChannel.close();
});
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
      }

      .save-btn,
      .cancel-btn {
        color: #1664ff;
        cursor: pointer;
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
