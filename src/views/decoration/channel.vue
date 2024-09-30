<!-- 这里是渠道页面 -->
<template>
  <div class="channel-box">
    <t-space direction="vertical" size="small" fill>
      <div v-for="(item, idx) in channelFormMap" :key="idx" class="form-box">
        <t-form
          :ref="(el: any) => setChannelRef(el, idx)"
          :model="item"
          :rules="formRules"
          auto-label-width
        >
          <div class="row-cls">
            <div class="left">
              <div class="vertical-line"></div>
              <div>{{ item.name || '-' }}</div>
            </div>
            <div class="right">
              <icon-to-top
                style="margin-right: 12px; cursor: pointer"
                :size="12"
                @click="handleSort('up', item)"
              />
              <icon-to-bottom
                style="margin-right: 12px; cursor: pointer"
                :size="12"
                @click="handleSort('down', item)"
              />
              <icon-edit
                style="cursor: pointer"
                :size="12"
                @click="item.navNameEdit = true"
              />
            </div>
            <!-- <t-form-item field="name" label="名称配置">
              <div v-if="item.navNameEdit" class="input-box-edit">
                <t-input
                  v-model="item.name"
                  placeholder="请输入"
                  allow-clear
                  style="width: 260px"
                />
                <div
                  style="margin: 0 16px"
                  class="save-btn"
                  @click="nameEdit(item, '2', channelRef[idx])"
                  >保存并发布
                </div>
                <div
                  class="cancel-btn"
                  @click="
                    () => {
                      channelRef[idx].clearValidate();
                      // item.navNameEdit = false;
                      getPageData(idx);
                    }
                  "
                  >取消</div
                >
              </div>
              <div v-else class="input-box-show">
                <span class="input-value">{{ item?.name || '-' }}</span>
                <icon-edit
                  style="color: #1664ff; cursor: pointer"
                  :size="16"
                  @click="item.navNameEdit = true"
                />
              </div>
            </t-form-item> -->
          </div>
          <div class="row-cls row-cls-top">
            <t-form-item field="status" label="页面装修">
              <div v-if="item?.status === 1" class="save-btn">
                <span style="color: #1d2129">已发布</span>
                <span
                  class="save-btn"
                  style="margin-left: 16px"
                  @click="goPlatProducts(item?.type)"
                >
                  查看前台页面>>
                </span>
                <span
                  class="save-btn"
                  style="margin-left: 16px"
                  @click="goDecoration(item)"
                >
                  继续装修>>
                </span>
              </div>
              <div v-else-if="item?.status === 0">
                <t-tag bordered style="cursor: pointer" @click="goPreview(item)"
                  >预览效果
                </t-tag>
                <t-tag bordered style="cursor: pointer" @click="goPreview(item)"
                  >发布
                </t-tag>
              </div>
              <div
                v-else
                class="save-btn"
                style="margin-left: 16px"
                @click="goDecoration(item)"
              >
                去装修>>
              </div>
            </t-form-item>
          </div>
        </t-form>
      </div>
    </t-space>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@tele-design/web-vue';
import {
  apiUpdateNavData,
  apiGetNavData,
  apiChangeSort,
} from '@/api/decoration/decoration-tools';
import { isArray } from 'lodash';
import { ChannelType } from '@/enums/decoration';
// import eventBus from '@/utils/bus';
// import { useDecorationStore } from '@/store/modules/decoration';
// import { storeToRefs } from 'pinia';
import { channelName } from './decorationTools/constant';

console.log('Message', Message);

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

const formRules = {
  name: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入名称');
        const iszhCn = /[^\u4e00-\u9fa5]/;
        const isEn = /[^a-zA-Z]/;
        if (!iszhCn.test(value) || !isEn.test(value)) {
          if (!iszhCn.test(value)) {
            if (value.length > 5) return cb('中文长度不超过5个字符');
          }
          if (!isEn.test(value)) {
            if (value.length > 10) return cb('英文长度不超过10个字符');
          }
        }
        if (iszhCn.test(value) && isEn.test(value)) {
          return cb('只支持中文或者英文');
        }
        return cb();
      },
    },
  ],
  status: [{ required: true, message: '请进行页面装修' }],
};

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

const formRef1 = ref();
const formRef2 = ref();
const formRef3 = ref();
const formRef4 = ref();
const channelRef = ref<any[]>([]);

// 频道页变成map格式统一动态宣传
const channelFormMap = ref<any[]>([]);

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

const setChannelRef = (el: any, index: number) => {
  if (el) {
    channelRef.value[index] = el;
  }
};

const publishName = (form: FormItem | null | undefined | any) => {
  if (!form) return;
  const { id, name } = form;
  console.log('publishName', form);
  apiUpdateNavData({ id, name }).then((res: any) => {
    if (form.type === ChannelType.PLATFORM_HOME) {
      nav1NameEdit.value = false;
    } else {
      form.navNameEdit = false;
    }
    // else if (form.type === ChannelType.PLATFORM_PRODUCT) {
    //   nav2NameEdit.value = false;
    // } else if (form.type === ChannelType.PLATFORM_SERVE) {
    //   nav3NameEdit.value = false;
    // }
  });
};

const nameEdit = (
  form: FormItem | null | undefined,
  index: string,
  formRef: any
) => {
  if (index === '1') {
    formRef1.value.validateField('name', (valid: any) => {
      if (!valid) {
        publishName(form);
      }
    });
  }
  if (index === '2') {
    formRef.validateField('name', (valid: any) => {
      if (!valid) {
        publishName(form);
      }
    });
  }
  // if (index === '3') {
  //   formRef3.value.validateField('name', (valid: any) => {
  //     if (!valid) {
  //       publishName(form);
  //     }
  //   });

  // 如果是只校验名称的话这个就不用放开，如何还校验装修的话就需要用下边的 字段还需对齐
  // formRef3.value.validate((valid: any) => {
  //   if (!valid) {
  //     publishName(form);
  //   }
  // });
  // }
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

const getPageData = (idx?: number) => {
  // 拉取所有导航数据
  apiGetNavData({}).then((res) => {
    if (isArray(res.data)) {
      const tempData = JSON.parse(JSON.stringify(channelFormMap.value));
      channelFormMap.value = [];
      res.data.forEach((item) => {
        switch (item.type) {
          case ChannelType.PLATFORM_HOME:
            form1.value = item;
            break;
          // case ChannelType.PLATFORM_PRODUCT:
          //   form2.value = item;
          //   break;
          case ChannelType.PLATFORM_NAME:
            break;
          // case ChannelType.PLATFORM_SERVE:
          //   form3.value = item;
          //   break;
          default:
            channelFormMap.value.push({ ...item });
            // 保存做单独状态处理
            // if(idx) channelFormMap.value[idx].navNameEdit = !channelFormMap.value[idx].navNameEdit
            break;
        }
      });
      // 保存做单独状态处理
      channelFormMap.value.forEach((item, index) => {
        item.navNameEdit = tempData[index]?.navNameEdit;
      });
      if (typeof idx === 'number' && channelFormMap.value[idx]) {
        channelFormMap.value[idx].navNameEdit =
          !channelFormMap.value[idx].navNameEdit;
      }
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
// 频道页通过一个路由，不同type来区分
const goPlatProducts = (type: number) => {
  // router.push({ path: '/wow/platProducts' });
  router.push({
    name: 'wowPlatProducts',
    params: { type },
  });
};

const handleExchangeArray = (
  arr: Record<string, any>,
  indexA: number,
  indexB: number
) => {
  const temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
  return arr;
};

const handleSort = async (type: string, data: any) => {
  console.log('sort111', channelFormMap.value, type, data);
  if (type === 'up' && data.sort === 0) {
    Message.warning('已经到顶了');
    return;
  }
  if (type === 'down' && data.sort === channelFormMap.value.length - 1) {
    Message.warning('已经到底了');
    return;
  }
  // 置换操作
  const newArrData = JSON.parse(JSON.stringify(channelFormMap.value));
  const newSortData = handleExchangeArray(
    newArrData,
    data.sort,
    type === 'up' ? data.sort - 1 : data.sort + 1
  );
  // 重排操作
  const updateParams: any[] = [];
  newSortData.forEach((item: any, idx: number) => {
    updateParams.push({ id: item.id, sort: idx });
  });
  await apiChangeSort(updateParams);
  getPageData();
  console.log('newSortData', newSortData);
};

onMounted(() => {
  broadcastChannel.addEventListener('message', (event) => {
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
  width: 600px;
  height: 100%;
  padding: 24px;

  .form-box {
    width: 685px;
    // background-color: red;
    .vertical-line {
      width: 4px;
      height: 14px;
      margin-right: 8px;
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
      justify-content: space-between;
      width: 100%;
      margin-top: 18px;
      margin-left: 24px;
      font-size: 12px;
      // background-color: red;
      .left {
        display: flex;
        justify-content: flex-start;
      }

      .input-box-edit {
        display: flex;
        align-items: center;
        // width: 376px;
        // margin-left: 16px;
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
          margin-right: 16px;
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
        margin-right: 8px;
      }
    }

    .row-cls-top {
      margin-top: 0;
    }

    ::v-deep(.tele-form-item) {
      margin-bottom: 10px;
    }
  }
}
</style>
