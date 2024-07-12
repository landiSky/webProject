<template>
  <t-drawer
    :title="props.title"
    :width="720"
    :visible="props.visible"
    :mask-closable="false"
    :drawer-body-style="{ padding: 0 }"
    @cancel="handleCancel"
  >
    <template #footer>
      <t-button :disabled="licenseLoading" @click="handleCancel">取消</t-button>
      <t-button v-if="current !== 1" :disabled="licenseLoading" @click="onPrev"
        >上一步</t-button
      >
      <t-button
        v-if="current !== 3"
        type="primary"
        :loading="licenseLoading"
        @click="onNext"
      >
        下一步
      </t-button>
      <t-button v-if="current === 3" type="primary" @click="handleConfirm"
        >确定</t-button
      >
    </template>
    <div class="steps-width">
      <t-steps :current="current">
        <t-step>获取设备指纹码</t-step>
        <t-step>选择企业前缀</t-step>
        <t-step>填写申请信息</t-step>
      </t-steps>
    </div>
    <t-form
      ref="formRef"
      :model="form"
      :label-col-props="{ span: 6, offset: 0 }"
      :wrapper-col-props="{ span: 18 }"
      :rules="copyRules"
    >
      <div v-if="current === 1" class="drawer-body">
        <div class="steps-title">第一步：下载指纹获取工具</div>
        <div class="steps-illustrate">
          点击下载按钮将指纹获取工具下载到本地，也可自行在网络上下载其他指纹提取工具。
        </div>
        <div class="steps-button">
          <t-button type="primary" @click="downloadTool">立即下载</t-button>
        </div>
        <div class="steps-title">第二步：指纹码采集</div>
        <div class="steps-illustrate">
          将工具包在装有企业节点的机器上运行，生成设备指纹码。
        </div>
        <div class="steps-title">第三步：输入设备指纹码</div>
        <div class="steps-illustrate">
          将设备指纹码在下方录入，最多可添加10条设备码。
        </div>
        <div>
          <t-table
            class="license-table"
            :columns="columns"
            :pagination="false"
            :data="form.fingerprintsList"
          >
            <template #index="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
            <template #fingerprint="{ rowIndex }">
              <t-form-item
                :field="`fingerprintsList.${rowIndex}`"
                class="item-display-none"
                :rules="[{ required: true, validator: validatorCode }]"
                hide-label
                hide-asterisk
              >
                <t-input
                  v-model="form.fingerprintsList[rowIndex]"
                  placeholder="请输入"
                />
              </t-form-item>
            </template>
            <template #operations="{ rowIndex }">
              <t-link @click="deleteCode(rowIndex)"> 删除 </t-link>
            </template>
          </t-table>
          <t-link
            v-if="form.fingerprintsList.length < 10"
            :hoverable="false"
            class="link-button"
            @click="addCode"
          >
            <img
              class="link-button-left"
              src="@/assets/images/license/icon-plus.png"
              alt=""
            />
            <div class="link-button-right">新增</div>
          </t-link>
        </div>
      </div>
      <div v-if="current === 2" class="drawer-body">
        <div class="title">
          <div class="title-left"></div>
          <div class="title-right">选择企业前缀</div>
        </div>
        <t-form-item field="entPrefix" label="企业前缀" class="item-top20">
          <t-select
            v-model="form.entPrefix"
            :style="{ width: '320px' }"
            :loading="loading"
            placeholder="请输入/选择企业前缀"
            :filter-option="false"
            allow-create
          >
            <t-option
              v-for="(item, index) of options"
              :key="index"
              :value="item"
            >
              {{ item }}
            </t-option>
          </t-select>
        </t-form-item>
      </div>
      <div v-if="current === 3" class="drawer-body">
        <t-form-item field="entPrefix" label="企业前缀" class="item-top20">
          {{ form.entPrefix }}
        </t-form-item>
        <div class="title">
          <div class="title-left"></div>
          <div class="title-right">License申请信息</div>
        </div>
        <t-form-item field="idHubVersion" label="IDHub版本" class="item-top20">
          <t-select
            v-model="form.idHubVersion"
            :style="{ width: '320px' }"
            placeholder="请选择IDHub版本"
          >
            <t-option
              v-for="(item, index) in editionList"
              :key="index"
              :value="item.value"
              >{{ item.label }}</t-option
            >
          </t-select>
        </t-form-item>
        <t-form-item field="effectTime" label="生效日期" class="item-top20">
          <t-date-picker
            v-model="form.effectTime"
            format="YYYY-MM-DD HH:mm:ss"
            :style="{ width: '320px' }"
            placeholder="请选择日期"
            :disabled-date="
              (current) => dayjs(current).isBefore(dayjs().subtract(1, 'day'))
            "
          />
        </t-form-item>
        <t-form-item label="备注" class="item-top20">
          <t-input
            v-model="form.remark"
            :style="{ width: '320px' }"
            placeholder="请输入(请备注说明首次申请，还是到期续约)"
            class="input-demo"
            :max-length="256"
          />
        </t-form-item>
        <div class="title">
          <div class="title-left"></div>
          <div class="title-right">运营规模</div>
        </div>
        <t-form-item
          field="estimateRegisterCount"
          label="预估标识注册量"
          class="item-top20"
        >
          <t-input-number
            v-model="form.estimateRegisterCount"
            :style="{ width: '320px' }"
            placeholder="请输入"
            class="input-demo"
            :min="0"
            :formatter="formatter"
            :parser="parser"
          />
        </t-form-item>
        <t-form-item
          field="estimateParseCount"
          label="预估标识日解析量"
          class="item-top20"
        >
          <t-input-number
            v-model="form.estimateParseCount"
            :style="{ width: '320px' }"
            placeholder="请输入"
            class="input-demo"
            :min="0"
            :formatter="formatter"
            :parser="parser"
          />
        </t-form-item>

        <div class="title">
          <div class="title-left"></div>
          <div class="title-right">企业联系人信息</div>
        </div>

        <t-form-item field="name" label="姓名" class="item-top20">
          <t-input
            v-model="form.name"
            :style="{ width: '320px' }"
            placeholder="请输入"
          />
        </t-form-item>
        <t-form-item field="phone" label="手机号">
          <t-input
            v-model="form.phone"
            :style="{ width: '320px' }"
            placeholder="请输入"
          />
        </t-form-item>
        <t-form-item field="email" label="邮箱">
          <t-input
            v-model="form.email"
            :style="{ width: '320px' }"
            placeholder="请输入"
          />
        </t-form-item>
      </div>
    </t-form>
  </t-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
import dayjs from 'dayjs';
import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import {
  userCreateLicense,
  userLicenseDetail,
  userResolvePrefix,
  userDownloadTool,
  userGetAllPrefix,
} from '@/api/identifying/license';

const formRef = ref();

const userStore = useUserStore();
const { userInfo, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);

const emit = defineEmits(['onConfirm', 'onCancel']);
const current: Record<string, any> = ref(1);
const licenseLoading: Record<string, any> = ref(false);

const columns = [
  {
    title: '编号',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '设备指纹码',
    dataIndex: 'fingerprint',
    slotName: 'fingerprint',
    headerCellClass: 'required-code',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  },
];

const form = reactive<{
  userId: string;
  companyId: string;
  companyName: string;
  entPrefix: string;
  idHubVersion: string | null;
  effectTime: string;
  remark: string;
  estimateRegisterCount: number | null;
  estimateParseCount: number | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  fingerprintsList: Array<any>;
}>({
  userId: userInfo.value?.id,
  companyId: userInfoByCompany.value?.companyId,
  companyName: userInfoByCompany.value?.companyName,
  entPrefix: '',
  idHubVersion: null,
  effectTime: '',
  remark: '',
  estimateRegisterCount: null,
  estimateParseCount: null,
  name: userInfoByCompany.value.username,
  phone: userInfo.value.mobile,
  email: userInfo.value.email,
  fingerprintsList: [''],
});

const copyRules = reactive({
  // 企业前缀
  entPrefix: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入/选择企业前缀');
        if (value.length > 128) return cb('长度不超过128个字符');
        return cb();
      },
    },
  ],
  // IDHub版本 1.0.0-标准版、2.0.0-社区版、3.0.0-中间件版
  idHubVersion: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请选择IDHub版本');
        return cb();
      },
    },
  ],
  // 生效日期
  effectTime: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请选择生效日期');
        return cb();
      },
    },
  ],
  // 预估标识注册量
  estimateRegisterCount: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入预估标识注册量');
        if (!/^[0-9]*$/.test(value)) return cb('只能输入数字');
        if (value.length > 20) return cb('长度不超过20个字符');
        return cb();
      },
    },
  ],
  // 预估标识日解析量
  estimateParseCount: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入预估标识日解析量');
        if (!/^[0-9]*$/.test(value)) return cb('只能输入数字');
        if (value.length > 20) return cb('长度不超过20个字符');
        return cb();
      },
    },
  ],
  // 联系人名称
  name: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入姓名');
        if (value.length > 128) {
          return cb('不允许超过128个字符');
        }
        return cb();
      },
    },
  ],
  // 手机号
  phone: [
    {
      required: true,
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入手机号');
        const phoneTs = /^1[2|3|4|5|6|7|8|9][0-9]{9}$/; //  手机号正则
        if (!phoneTs.test(value)) {
          return cb('手机号格式错误');
        }
        return cb();
      },
    },
  ],
  // 邮箱
  email: [
    {
      required: true,
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入邮箱');
        if (value.length > 128) return cb('长度不超过128个字符');
        const reata = new RegExp(
          '^$|^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$'
        );
        if (reata.test(value)) {
          return cb();
        }
        return cb('邮箱格式错误');
      },
    },
  ],
});

// 下载指纹获取工具
const downloadTool = () => {
  userDownloadTool().then((res: any) => {
    const link = document.createElement('a');
    const objectUrl = `/server/web/file/download?name=${res}`; // 创建一个新的url对象
    link.href = objectUrl;
    link.click();
    window.URL.revokeObjectURL(objectUrl); // 为了更好地性能和内存使用状况，应该在适当的时候释放url
  });
};
// 设备指纹码单独校验
const validatorCode = (value: any, cb: (params?: any) => void) => {
  if (!value || value.length === 0) return cb('请输入设备指纹码');
  const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
  if (reg.test(value)) {
    return cb('设备指纹码不能输入汉字!');
  }
  if (value.length > 128) return cb('长度不超过128个字符');
  return cb();
};
// 定义子组件参数
const props = defineProps({
  visible: Boolean,
  title: String,
  editId: String,
});
// IDHub版本
const editionList = ref([
  {
    label: '标准版',
    value: '1',
  },
  {
    label: '社区版',
    value: '2',
  },
  {
    label: '中间件版',
    value: '3',
  },
]);
// 取消
const handleCancel = () => {
  emit('onCancel');
};
// 确定
const handleConfirm = () => {
  const params = {
    ...form,
    estimateParseCount: String(form.estimateParseCount),
    estimateRegisterCount: String(form.estimateRegisterCount),
  };
  licenseLoading.value = true;
  formRef.value.validate((errors: undefined) => {
    if (!errors) {
      userCreateLicense(params)
        .then((res) => {
          licenseLoading.value = false;
          Message.success('申请提交成功');
          emit('onConfirm', res);
        })
        .catch(() => {
          licenseLoading.value = false;
          Message.success('申请提交失败');
        });
    }
  });
};
// 指纹码新增
const addCode = () => {
  if (form.fingerprintsList.length >= 10) {
    return;
  }
  form.fingerprintsList.push('');
};
// 指纹码删除
const deleteCode = (index: any) => {
  if (form.fingerprintsList.length === 1) {
    return;
  }
  form.fingerprintsList.splice(index, 1);
};
// 企业前缀集合
const options: Record<string, any> = ref([]);

// 企业前缀输入校验
const selectValueChange = (inputValue: any) => {
  const reg = /^\d(.\d)*$/;
  if (reg.test(inputValue)) {
    Message.error('此企业前缀格式不合规，请重新输入');
    return false;
  }
  const data = {
    prefix: inputValue,
  };
  return userResolvePrefix(data)
    .then((res: any) => {
      return true;
    })
    .catch((error: any) => {
      return false;
    });
};
// 数字框千位符展示
const formatter = (value: any) => {
  const values = value.split('.');
  values[0] = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return values.join('.');
};
const parser = (value: any) => {
  return value.replace(/,/g, '');
};
// 确定loading
const loading = ref(false);
// 上一步操作
const onPrev = () => {
  current.value = Math.max(1, current.value - 1);
};
// 下一步操作
const onNext = async () => {
  if (current.value === 1) {
    const typeIndex = form.fingerprintsList.findIndex((v) => {
      return v === '' || v === null || v === undefined;
    });
    formRef.value.validateField(`fingerprintsList.${typeIndex}`);
    if (typeIndex >= 0) return false;
  }
  if (current.value === 2) {
    formRef.value.validateField(`entPrefix`);
    if (form.entPrefix.length === 0) return false;
    const state = await selectValueChange(form.entPrefix);
    if (!state) return false;
  }
  current.value = Math.min(3, current.value + 1);
  return true;
};
// 编辑回显
const getInfo = async () => {
  const params = {
    licenseId: props?.editId,
  };
  userLicenseDetail(params).then((res: any) => {
    form.entPrefix = res.entPrefix;
    form.idHubVersion = String(res.idHubVersion);
    form.effectTime = res.effectTime;
    form.remark = res.remark;
    form.estimateRegisterCount = Number(res.estimateRegisterCount);
    form.estimateParseCount = Number(res.estimateParseCount);
    form.name = res.name;
    form.phone = res.phone;
    form.email = res.email;
    form.fingerprintsList = res.fingerPrintList;
  });
};
// 企业前缀列表
const getPrefixList = async () => {
  userGetAllPrefix().then((res: any) => {
    options.value = res;
  });
};

onMounted(() => {
  if (props?.editId) {
    getInfo();
  }
  getPrefixList();
});
</script>

<style lang="less" scoped>
.steps-width {
  gap: 10px;
  height: 68px;
  padding: 20px 81px;
  background: rgba(242, 243, 248, 1);
}
// 步骤条穿透样式
:deep(.tele-steps-item-wait .tele-steps-icon) {
  background-color: #fff;
}

:deep(
    .tele-steps-label-horizontal
      .tele-steps-item:not(:last-child)
      .tele-steps-item-title::after
  ) {
  background-color: rgba(201, 205, 212, 1);
}

:deep(
    .tele-steps-label-horizontal
      .tele-steps-item.tele-steps-item-finish
      .tele-steps-item-title::after
  ) {
  background-color: rgba(22, 100, 255, 1);
}

.drawer-body {
  padding: 24px 84px;

  .steps-title {
    margin-top: 30px;
    color: rgba(29, 33, 41, 1);
    font-weight: 400;
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 22px;
    text-align: left;
  }

  .steps-title:first-child {
    margin-top: 0;
  }

  .steps-illustrate {
    margin-top: 4px;
    color: rgba(134, 144, 156, 1);
    font-weight: 400;
    font-size: 12px;
    font-family: PingFang SC;
    line-height: 20px;
    text-align: left;
  }

  .steps-button {
    margin-top: 10px;
  }

  .license-table {
    margin: 10px 0;
  }

  :deep(.required-code .tele-table-th-title::before) {
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 4px;
    margin-bottom: 1px;
    color: rgba(230, 63, 63, 1);
    background: url(@/assets/images/license/icon-xing.png) no-repeat;
    background-size: 100% 100%;
    content: '';
  }

  .item-display-none {
    margin-bottom: 0;
  }

  .link-button {
    margin: 0 3px;

    .link-button-left {
      display: inline-block;
      width: 10px;
      height: 10px;
    }

    .link-button-right {
      display: inline-block;
      margin-left: 6px;
    }
  }

  .title {
    display: flex;
    align-items: center;

    .title-left {
      width: 4px;
      height: 14px;
      background: rgba(22, 100, 255, 1);
    }

    .title-right {
      margin-left: 8px;
      color: rgba(29, 33, 41, 1);
      font-weight: 500;
      font-size: 16px;
      font-family: PingFang SC;
      line-height: 24px;
      text-align: left;
    }
  }

  .item-top20 {
    margin-top: 20px;
  }
}
</style>
