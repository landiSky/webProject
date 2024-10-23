<!-- 这里是渠道页面 -->
<template>
  <div class="channel-box">
    <t-space direction="vertical" size="small" fill>
      <t-spin :loading="channelLoading" :size="24">
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
                <t-dropdown position="br">
                  <t-link>
                    <icon-more />
                  </t-link>
                  <template #content>
                    <t-doption @click="handleChannelEdit(item)">
                      编辑
                    </t-doption>
                    <t-doption
                      v-if="item.supportDelete"
                      @click="handleDel(item)"
                    >
                      删除
                    </t-doption>
                  </template>
                </t-dropdown>
                <!-- <icon-delete
                  v-if="item.supportDelete"
                  style="margin-right: 12px; cursor: pointer"
                  :size="12"
                  @click="handleDel(item)"
                />
                <icon-edit
                  style="cursor: pointer"
                  :size="12"
                  @click="handleChannelEdit(item)"
                /> -->
              </div>
            </div>
            <div
              v-if="item.supportDelete || String(item.id) === '1'"
              class="row-content"
            >
              <t-form-item
                v-if="String(item.id) !== '1'"
                class="row-cls"
                field="channelType"
                label="导航形式"
              >
                <span>{{
                  item.channelType === 0 ? '链接跳转' : '频道页面'
                }}</span>
              </t-form-item>
              <t-form-item
                v-if="item.channelType === 1"
                class="row-cls"
                field="status"
                label="页面装修"
              >
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
                  <t-tag
                    bordered
                    style="cursor: pointer"
                    @click="goPreview(item)"
                    >预览效果
                  </t-tag>
                  <t-tag
                    bordered
                    style="cursor: pointer"
                    @click="goPreview(item)"
                    >发布
                  </t-tag>
                </div>
                <div v-else class="save-btn" @click="goDecoration(item)">
                  去装修>>
                </div>
              </t-form-item>
              <t-form-item
                v-if="item.channelType === 0"
                class="row-cls"
                field="linkUrl"
                label="跳转链接"
              >
                <span class="link-url" @click="jumpToUrl(item.linkUrl)">{{
                  item.linkUrl || '-'
                }}</span>
              </t-form-item>
            </div>
          </t-form>
        </div>
        <div class="add-channel">
          <iconpark-icon
            :name="addDisable ? 'squarePlusGray' : 'squareBluePlus'"
            :class="addDisable ? 'square-plus-gray' : 'square-blue-plus'"
            size="16px"
            @click="handleChannelAdd"
          />添加频道（最多6个）</div
        >
      </t-spin>
    </t-space>
    <ChannelDrawer
      v-if="showChannelDrawer"
      :show-channel-drawer="showChannelDrawer"
      :title="channelTitle"
      :data="channelData"
      :confirm-loading="confirmLoading"
      @handle-ok="handleOk"
      @handle-cancel="handleCancel"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Message, Modal } from '@tele-design/web-vue';
import {
  apiUpdateNavData,
  apiGetNavData,
  apiChangeSort,
  apiChannelUpdate,
  apiChannelAdd,
  apiChannelDel,
} from '@/api/decoration/decoration-tools';
import { isArray } from 'lodash';
import { ChannelType } from '@/enums/decoration';
import { channelName } from './decorationTools/constant';
import ChannelDrawer from './channelDrawer.vue';

// 创建tabs通信通道
const broadcastChannel = new BroadcastChannel(channelName);

const router = useRouter();

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
  status: [{ required: false, message: '请进行页面装修' }],
};

const nav1DecorationJson = ref('');
const nav2DecorationJson = ref('');
const nav3DecorationJson = ref('');

const showChannelDrawer = ref(false);
const confirmLoading = ref(false);
const channelTitle = ref('');
const channelData = ref({});

type FormItem = {
  name: string;
  id: number;
  logo: string;
  type: number;
  status: number | null;
  detail: string;
  draftDetail: string;
};

const channelRef = ref<any[]>([]);
const addDisable = ref(false);
const channelLoading = ref(false);

// 频道页变成map格式统一动态宣传
const channelFormMap = ref<any[]>([]);

const setChannelRef = (el: any, index: number) => {
  if (el) {
    channelRef.value[index] = el;
  }
};

const getPageData = (idx?: number) => {
  channelLoading.value = true;
  // 拉取所有导航数据
  apiGetNavData({}).then((res) => {
    channelLoading.value = false;
    if (isArray(res.data)) {
      // 因为type字段换成了id，改的地方比较多，所以在这里统一做同步处理
      res.data = res.data.map((i) => ({
        ...i,
        type: i.id,
      }));
      const tempData = JSON.parse(JSON.stringify(channelFormMap.value));
      channelFormMap.value = [];
      res.data.forEach((item: any) => {
        switch (item.type) {
          // case ChannelType.PLATFORM_HOME:
          //   form1.value = item;
          //   break;
          // case ChannelType.PLATFORM_NAME:
          //   break;
          default:
            channelFormMap.value.push({ ...item });
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
      const dynamicChannel = channelFormMap.value.filter(
        (item) => item.supportDelete
      );
      console.log('dynamicChannel', channelFormMap, dynamicChannel);
      addDisable.value = dynamicChannel.length >= 6;
    }
  });
  // 获取本地缓存的装修数据,注意key值！！！
  nav1DecorationJson.value = localStorage.getItem('componentsList2') || '';
  nav2DecorationJson.value = localStorage.getItem('componentsList3') || '';
  nav3DecorationJson.value = localStorage.getItem('componentsList4') || '';
};

const handleOk = async (params: any) => {
  confirmLoading.value = true;
  // 有id则代表编辑反之代表新增，sort这里新增按照list长度算
  if (!params.id) params.sort = channelFormMap.value.length;
  await (params.id ? apiChannelUpdate(params) : apiChannelAdd(params))
    .then(() => {
      Message.success('修改成功');
      getPageData();
      confirmLoading.value = false;
      showChannelDrawer.value = false;
    })
    .catch((e) => {
      Message.error(e.message);
      confirmLoading.value = false;
    });
};

const handleCancel = () => {
  showChannelDrawer.value = false;
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
  console.log('goPreview', type, id);
  const routeUrl = router.resolve({
    name: 'decorationTools',
    query: { model: 1, type, id },
  });
  window.open(routeUrl.href, '_blank');
};

// 频道页通过一个路由，不同type来区分
const goPlatProducts = (type: number) => {
  // router.push({ path: '/wow/platProducts' });
  console.log('goPlatProductsgoPlatProducts', type);
  if (String(type) === '1') {
    router.push({ path: '/wow/index' });
    return;
  }
  if (String(type) === '5') {
    localStorage.setItem('publicIdhubOpenType', JSON.stringify(type));
    router.push({
      name: 'publicIdhubOpen',
    });
    return;
  }
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

const handleDel = (data: any) => {
  Modal.warning({
    title: '删除后无法进行恢复，请谨慎操作！',
    titleAlign: 'start',
    content: '',
    okText: '删除',
    hideCancel: false,
    okButtonProps: {
      status: 'danger',
    },
    onOk: () => {
      apiChannelDel(data.id)
        .then(() => {
          Message.success('删除成功');
          getPageData();
        })
        .catch((e) => {
          Message.error(e.message);
        });
    },
  });
};

const jumpToUrl = (linkUrl: string) => {
  window.open(linkUrl, '_blank');
};

const handleChannelEdit = (item: object) => {
  showChannelDrawer.value = true;
  channelTitle.value = '编辑频道';
  channelData.value = item;
};

const handleChannelAdd = () => {
  // 将频道页过滤出来
  const dynamicChannel = channelFormMap.value.filter(
    (item) => item.supportDelete
  );
  if (dynamicChannel.length >= 6) return;
  showChannelDrawer.value = true;
  channelTitle.value = '添加频道';
  channelData.value = {};
};

const handleSort = async (type: string, data: any) => {
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
.form-space {
  :deep(.tele-space-item) {
    margin-bottom: 16px;
  }
}

.channel-box {
  width: 600px;
  height: 100%;
  padding: 24px;

  .form-box {
    width: 685px;
    margin-bottom: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e8ef;

    :deep(.tele-form-item) {
      margin-bottom: 0 !important;
    }

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
      // margin-top: 10px;
      font-size: 12px;
      // background-color: red;
      .left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
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

      .link-url {
        color: #1664ff;
        cursor: pointer;
      }
    }

    .row-content {
      margin-top: 8px;
      margin-left: 26px;
    }

    .row-cls-top {
      margin-top: 0;
    }

    ::v-deep(.tele-form-item) {
      margin-bottom: 10px;
    }
  }

  .add-channel {
    margin-bottom: 20px;

    > iconpark-icon {
      margin-right: 8px;
      vertical-align: bottom;
    }

    .square-plus-gray {
      cursor: not-allowed;
    }

    .square-blue-plus {
      cursor: pointer;
    }
  }
}
</style>
