<template>
  <div class="add-goods-container">
    <t-modal
      v-model:visible="showModal"
      :title="props.title"
      fullscreen
      has-back-btn="false"
      ok-text="完成"
      popup-container=".add-goods-container"
      :on-before-back="handleBack"
      @back="emit('onCancel')"
    >
      <template #footer>
        <t-button
          type="primary"
          :loading="state.launchLoading"
          @click="handleLaunchOrSave"
          >保存
        </t-button>
        <t-button @click="handleCancel">取消</t-button>
      </template>

      <div class="channel-box">
        <t-space direction="vertical" size="small" fill>
          <t-form
            ref="formRef"
            :model="form"
            :rules="formRules"
            label-align="right"
            :label-col-props="{
              flex: '100px',
              align: 'right',
            }"
          >
            <!-- 联系我们 -->
            <div class="form-box">
              <t-space class="space-bottom">
                <div class="vertical-line"></div>
                <div class="title-text">联系我们</div>
              </t-space>
              <t-form-item field="technicalSupport" label="技术支持">
                <t-input
                  v-model.trim="form.technicalSupport"
                  placeholder="请输入"
                  :allow-clear="false"
                  :max-length="{
                    length: 50,
                    errorOnly: true,
                  }"
                  show-word-limit
                  style="width: 400px"
                />
              </t-form-item>
              <t-form-item field="businessCooperation" label="商务合作">
                <t-input
                  v-model.trim="form.businessCooperation"
                  placeholder="请输入"
                  :allow-clear="false"
                  :max-length="{
                    length: 50,
                    errorOnly: true,
                  }"
                  show-word-limit
                  style="width: 400px"
                />
              </t-form-item>
              <t-form-item field="businessServicesFile" label="商务服务">
                <div class="columns">
                  <t-upload
                    v-model:file-list="form.businessServicesFile"
                    list-type="picture-card"
                    :headers="uploadHeaders"
                    action="/server/web/file/upload"
                    :limit="1"
                    image-preview
                    style="width: 100px; height: 100px"
                    accept=".jpg,.png"
                    @before-upload="(file: File) => (onBeforeUploadImage(file,{pictureWidth:90,pictureHeight:90}))"
                    @success="uploadSuccess"
                    @error="uploadError"
                  >
                    <template #upload-button>
                      <div
                        style="
                          width: 100px;
                          height: 100px;
                          color: var(--color-text-1);
                          text-align: center;
                          background-color: var(--color-fill-2);
                          border: 1px dashed var(--color-fill-4);
                        "
                      >
                        <div style="margin-top: 30px">
                          <div> <IconPlus :style="{ fontSize: '16px' }" /></div>
                          <div
                            style="
                              margin-top: 10px;
                              color: #4e5969;
                              font-weight: 500;
                              font-size: 12px;
                            "
                            >点击上传</div
                          >
                        </div>
                      </div>
                    </template>
                  </t-upload>
                  <div class="tips">
                    图片要求：90*90px，大小限制100KB以内，支持JPG、PNG文件
                  </div>
                </div>
              </t-form-item>
            </div>
            <!-- 买家信息 -->
            <div class="form-box">
              <t-space class="space-bottom">
                <div class="vertical-line"></div>
                <div class="title-text">买家信息</div>
              </t-space>
              <t-form-item field="buyerManualUrl" label="买家使用手册">
                <t-input
                  v-model.trim="form.buyerManualUrl"
                  placeholder="请输入"
                  :allow-clear="false"
                  :max-length="{
                    length: 500,
                    errorOnly: true,
                  }"
                  show-word-limit
                ></t-input>
              </t-form-item>
            </div>
            <!-- 卖家信息 -->
            <div class="form-box">
              <t-space class="space-bottom">
                <div class="vertical-line"></div>
                <div class="title-text">卖家信息</div>
              </t-space>
              <t-form-item field="sellerManualUrl" label="卖家使用手册">
                <t-input
                  v-model.trim="form.sellerManualUrl"
                  placeholder="请输入"
                  :allow-clear="false"
                  :max-length="{
                    length: 500,
                    errorOnly: true,
                  }"
                  show-word-limit
                ></t-input>
              </t-form-item>
            </div>
            <!-- 移动端信息 -->
            <div class="form-box">
              <t-space class="space-bottom">
                <div class="vertical-line"></div>
                <div class="title-text">移动端信息</div>
              </t-space>
              <t-form-item field="appletCodeFile" label="小程序或公众号二维码">
                <div class="columns">
                  <t-upload
                    v-model:file-list="form.appletCodeFile"
                    list-type="picture-card"
                    :headers="uploadHeaders"
                    action="/server/web/file/upload"
                    :limit="1"
                    image-preview
                    style="width: 100px; height: 100px"
                    accept=".jpg,.png"
                    @before-upload="(file: File) => (onBeforeUploadImage(file,{pictureWidth:120,pictureHeight:120}))"
                    @success="uploadSuccess"
                    @error="uploadError"
                  >
                    <template #upload-button>
                      <div
                        style="
                          width: 100px;
                          height: 100px;
                          color: var(--color-text-1);
                          text-align: center;
                          background-color: var(--color-fill-2);
                          border: 1px dashed var(--color-fill-4);
                        "
                      >
                        <div style="margin-top: 30px">
                          <div> <IconPlus :style="{ fontSize: '16px' }" /></div>
                          <div
                            style="
                              margin-top: 10px;
                              color: #4e5969;
                              font-weight: 500;
                              font-size: 12px;
                            "
                            >点击上传</div
                          >
                        </div>
                      </div>
                    </template>
                  </t-upload>
                  <div class="tips">
                    图片要求：120*120px，大小限制100KB以内，支持JPG、PNG文件
                  </div>
                </div>
              </t-form-item>
            </div>
            <!-- 友情链接 -->
            <div class="form-box">
              <t-space class="space-bottom">
                <div class="vertical-line"></div>
                <div class="title-text">友情链接</div>
              </t-space>
              <t-row
                v-for="(item, index) of form.linkDetail"
                :key="index"
                :gutter="12"
              >
                <t-col flex="320px">
                  <t-form-item
                    label="名称"
                    :field="`linkDetail.${index}.name`"
                    :rules="[
                      { required: true, message: '请输入名称' },
                      {
                        required: true,
                        maxLength: 20,
                        message: '长度不超过20个字符',
                      },
                      {
                        required: true,
                        match: /^[a-zA-Z\u4e00-\u9fa5]+$/,
                        message: '只支持中英文，不支持输入其他特殊字符。',
                      },
                    ]"
                    label-col-flex="80px"
                  >
                    <t-input
                      v-model.trim="item.name"
                      placeholder="请输入"
                      :allow-clear="false"
                      :max-length="{
                        length: 20,
                        errorOnly: true,
                      }"
                      show-word-limit
                    ></t-input>
                  </t-form-item>
                </t-col>
                <t-col flex="373px">
                  <t-form-item
                    label="链接"
                    :field="`linkDetail.${index}.lintUrl`"
                    :rules="[
                      { required: true, message: '请输入链接' },
                      {
                        required: true,
                        maxLength: 500,
                        message: '长度不超过500个字符',
                      },
                      {
                        match: /^(https?:\/\/).+$/,
                        message: '请输入正确格式',
                      },
                    ]"
                    label-col-flex="40px"
                  >
                    <t-input
                      v-model.trim="item.lintUrl"
                      placeholder="请输入"
                      :allow-clear="false"
                      :max-length="{
                        length: 500,
                        errorOnly: true,
                      }"
                      show-word-limit
                    ></t-input>
                  </t-form-item>
                </t-col>
                <t-col
                  v-if="form.linkDetail.length > 1"
                  flex="36px"
                  style="padding-top: 6px"
                >
                  <!-- <t-link :hoverable="false" @click="deleteItem(index)">
                删除
              </t-link> -->
                  <icon-delete
                    style="cursor: pointer"
                    @click="deleteItem(index)"
                  />
                </t-col>
              </t-row>
              <div class="extraOpt">
                <iconpark-icon
                  v-if="form.linkDetail.length < 5"
                  class="plusIcon"
                  name="squarePlus"
                  size="20px"
                  @click="addBlock"
                ></iconpark-icon>
                <!-- <t-tooltip
              v-else
              content="到达友情链接添加上限，删除后可操作"
              position="tl"
            >
              <iconpark-icon
                class="plusIcon"
                style="cursor: not-allowed"
                name="squarePlusGray"
                size="20px"
              ></iconpark-icon>
            </t-tooltip> -->
                <span v-if="form.linkDetail.length < 5">{{
                  `添加友情链接 (最多5个)`
                }}</span>
              </div>
            </div>
            <!-- 备案信息 -->
            <div class="form-box">
              <t-space class="space-bottom">
                <div class="vertical-line"></div>
                <div class="title-text">备案信息</div>
              </t-space>
              <t-form-item field="companyInfomation" label="公司信息">
                <t-input
                  v-model.trim="form.companyInfomation"
                  placeholder="请输入"
                  :allow-clear="false"
                  :max-length="{
                    length: 100,
                    errorOnly: true,
                  }"
                  show-word-limit
                  style="width: 400px"
                />
              </t-form-item>
              <t-form-item field="recordNumber" label="备案号">
                <t-input
                  v-model.trim="form.recordNumber"
                  placeholder="请输入"
                  :allow-clear="false"
                  :max-length="{
                    length: 20,
                    errorOnly: true,
                  }"
                  show-word-limit
                  style="width: 400px"
                />
              </t-form-item>
            </div>
          </t-form>
        </t-space>
      </div>
    </t-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue';
import { FileItem, Message } from '@tele-design/web-vue';
import { useRouter } from 'vue-router';
import {
  apiFooterInfo,
  apiFooterUpdate,
} from '@/api/decoration/decoration-tools';
import { useUserStore } from '@/store/modules/user';
import { getToken } from '@/utils/auth';

const props = defineProps({
  visible: Boolean,
  editId: String,
  title: String,
});

const router = useRouter();
const userStore = useUserStore();
const uploadHeaders = {
  Authorization: `${getToken()}`,
};

const formRules = {
  technicalSupport: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入技术支持');
        if (value.length > 50) return cb('长度不超过50个字符');
        return cb();
      },
    },
  ],
  businessCooperation: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入商务合作');
        if (value.length > 50) return cb('长度不超过50个字符');
        return cb();
      },
    },
  ],
  buyerManualUrl: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入买家使用手册');
        if (value.length > 500) return cb('长度不超过500个字符');
        if (!/^(https?:\/\/).+$/.test(value)) return cb('请输入正确格式');
        return cb();
      },
    },
  ],
  businessServicesFile: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (value.length === 0) return cb('请上传商务服务');
        const aggregate = value.filter((item: any) => {
          return item.status !== 'done';
        });
        if (aggregate.length !== 0) {
          return cb('文件正在上传中');
        }
        return cb();
      },
    },
  ],
  sellerManualUrl: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入卖家使用手册');
        if (value.length > 500) return cb('长度不超过500个字符');
        if (!/^(https?:\/\/).+$/.test(value)) return cb('请输入正确格式');
        return cb();
      },
    },
  ],
  appletCodeFile: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (value.length === 0) return cb('请上传小程序或公众号二维码');
        const aggregate = value.filter((item: any) => {
          return item.status !== 'done';
        });
        if (aggregate.length !== 0) {
          return cb('文件正在上传中');
        }
        return cb();
      },
    },
  ],
  companyInfomation: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入公司信息');
        if (value.length > 100) return cb('长度不超过100个字符');
        return cb();
      },
    },
  ],
  recordNumber: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入备案号');
        if (value.length > 20) return cb('长度不超过20个字符');
        return cb();
      },
    },
  ],
};

const formRef = ref();

const form: Record<string, any> = ref({
  id: '', // id
  technicalSupport: '', // 技术支持
  businessCooperation: '', // 商务合作
  businessServicesFile: [], // 商务服务文件id
  buyerManualUrl: '', // 买家使用手册文件id
  sellerManualUrl: '', // 卖家使用手册文件id
  appletCodeFile: [], // 小程序码文件id
  linkDetail: [
    {
      name: '',
      lintUrl: '',
    },
  ], // 友情链接
  companyInfomation: '', // 公司信息
  recordNumber: '', // 备案号
});

const state = reactive<{
  launchLoading: boolean;
}>({
  launchLoading: false,
});

const emit = defineEmits(['onCancel']);

const showModal = computed(() => props.visible);

const validateImageSize = (file: any, sizeData?: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.onload = function () {
        const { width, height } = this as any;
        if (
          width === sizeData?.pictureWidth &&
          height === sizeData?.pictureHeight
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      image.onerror = reject;
      image.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const onBeforeUploadImage = async (
  fileItem: {
    size: number;
    name: string;
  },
  sizeData: any
) => {
  const limitSize = await validateImageSize(fileItem, sizeData);
  const name = fileItem?.name ?? '';
  if (
    !name.toLowerCase().endsWith('.jpg') &&
    !name.toLowerCase().endsWith('.png')
  ) {
    Message.error(`上传格式错误，请修改后重试`);
    return false;
  }
  const size = fileItem?.size ?? 0;
  if (size > 100 * 1024) {
    Message.error(`图片超出100kb，请重新上传`);
    return false;
  }
  if (!limitSize) {
    Message.error(
      `上传尺寸要求${sizeData?.pictureWidth}X${sizeData?.pictureHeight}，否则影响展示效果`
    );
    return false;
  }
  return true;
};

const onBeforeUpload = (fileItem: { size: number; name: string }) => {
  const name = fileItem?.name ?? '';
  if (
    !name.toLowerCase().endsWith('.docx') &&
    !name.toLowerCase().endsWith('.pdf')
  ) {
    Message.error(`上传格式错误，请修改后重试`);
    return false;
  }
  const size = fileItem?.size ?? 0;
  if (size > 15 * 1024 * 1024) {
    Message.error(`文件超出15M，请重新上传`);
    return false;
  }
  return true;
};

const uploadError = () => {
  Message.error(`上传失败`);
};

const handleLogout = async () => {
  await userStore.logout();
  const params: { path: string; query?: { type: number } } = {
    path: '/login',
  };
  router.push(params);
};

const uploadSuccess = async (fileItem: FileItem) => {
  const res = fileItem.response;
  if (res && res.code === 200 && res.data) {
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    if (res && res.code === 101004) {
      handleLogout();
      Message.error(`${res?.message ?? ''}`);
      return;
    }
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};

const addBlock = () => {
  form.value.linkDetail.push({
    name: '',
    lintUrl: '',
  });
};

const deleteItem = (index: number) => {
  form.value.linkDetail.splice(index, 1);
};

const FooterInfoDetails = async () => {
  await apiFooterInfo()
    .then((res: any) => {
      if (res.code !== 200) {
        return;
      }
      const appletCodeFile =
        (res.data.appletCodeFile &&
          res.data.appletCodeFile.split(',').map((item: any) => {
            return {
              name: item,
              url: `/server/web/file/download?name=${item}`,
              status: 'done',
              response: {
                data: item,
              },
            };
          })) ||
        [];
      const businessServicesFile =
        (res.data.businessServicesFile &&
          res.data.businessServicesFile.split(',').map((item: any) => {
            return {
              name: item,
              url: `/server/web/file/download?name=${item}`,
              status: 'done',
              response: {
                data: item,
              },
            };
          })) ||
        [];

      const linkDetail =
        (res.data.linkDetail && JSON.parse(res.data.linkDetail)) || [];

      form.value = {
        ...res.data,
        appletCodeFile,
        businessServicesFile,
        linkDetail,
      };
    })
    .catch(() => {});
};
// 取消
const handleCancel = () => {
  emit('onCancel');
};

const handleBack = () => {
  emit('onCancel');
};
// 保存
const handleLaunchOrSave = () => {
  formRef.value.validate((valid: any) => {
    if (!valid) {
      const businessServicesFile = form.value.businessServicesFile
        .map((item: any) => {
          return item.response.data;
        })
        .join(',');
      const appletCodeFile = form.value.appletCodeFile
        .map((item: any) => {
          return item.response.data;
        })
        .join(',');
      const linkDetail = JSON.stringify(form.value.linkDetail);
      const params = {
        ...form.value,
        businessServicesFile,
        appletCodeFile,
        linkDetail,
      };
      apiFooterUpdate(params).then((res) => {
        if (res.code !== 200) return;
        Message.success('保存成功');
        handleCancel();
      });
    }
  });
};

onMounted(() => {
  FooterInfoDetails();
});
</script>

<style lang="less" scoped>
:deep(.tele-modal-fullscreen .tele-modal-body) {
  margin: 0;
}

:deep(.tele-modal-body .tele-form-item:last-child) {
  margin-bottom: 20px;
}

:deep(
    .tele-modal-fullscreen
      .tele-modal-body
      .modal-body-content-align-left
      .tele-form-item-wrapper-col
  ) {
  width: 0;
}

.channel-box {
  width: 774px;
  height: 100%;
  margin: 0 auto;

  .form-box {
    // width: 685px;
    .space-bottom {
      margin-bottom: 12px;
    }

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

    .columns {
      display: flex;
      flex-direction: column;

      .tips {
        margin-top: 8px;
        color: #86909c;
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 20px;
      }
    }

    :deep(.tele-upload-list-item-content) {
      width: 25%;
    }

    :deep(.tele-upload-list-picture) {
      width: 100px;
      height: 100px;
    }
  }

  .extraOpt {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 50px;

    .plusIcon {
      cursor: pointer;
    }

    span {
      margin-left: 8px;
      color: #1d2129;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px; /* 166.667% */
    }
  }
}
</style>
