<template>
  <t-drawer
    :title="props.title"
    :width="720"
    :drawer-body-style="{ padding: '24px 20px' }"
    :visible="props.visible"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <template #footer>
      <t-button @click="handleCancel">取消</t-button>
      <t-button type="primary" @click="handleConfirm">确认</t-button>
    </template>
    <t-form
      ref="formRef"
      :model="form"
      :label-col-props="{ span: 3, offset: 0 }"
      :wrapper-col-props="{ span: 21 }"
    >
      <t-form-item
        field="name"
        label="应用名称"
        :rules="[
          {
            required: true,
            message: '应用名称不允许为空',
          },
          { maxLength: 50, message: '不允许超过50个字符' },
        ]"
      >
        <t-textarea
          v-model="form.name"
          placeholder="请输入"
          :max-length="{
            length: 50,
            errorOnly: true,
          }"
          show-word-limit
          :allow-clear="false"
        />
      </t-form-item>
      <t-form-item
        label="应用图标"
        field="logo"
        class="pic-item"
        validate-trigger="blur"
        :rules="[{ required: true, message: '请上传logo图' }]"
      >
        <div class="file-list">
          <div v-if="form.logo" class="file-container">
            <div class="file-image">
              <div class="image-div">
                <t-image
                  width="100px"
                  height="100px"
                  fit="cover"
                  :src="`/server/web/file/download?name=${form.logo}`"
                  :preview-visible="logoVisible"
                  :preview-props="{
                    src: `/server/web/file/download?name=${form.logo}`,
                  }"
                  @preview-visible-change="() => (logoVisible = false)"
                />
                <div class="image-hover">
                  <div class="hover-bg"> </div>
                  <div class="icon-list">
                    <icon-eye
                      :style="{
                        fontSize: '20px',
                        color: '#fff',
                        cursor: 'pointer',
                      }"
                      @click="() => (logoVisible = true)"
                    />
                    <icon-delete
                      :style="{
                        fontSize: '20px',
                        color: '#fff',
                        cursor: 'pointer',
                      }"
                      @click="() => (form.logo = '')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <IconMaterial
          v-if="!form.logo"
          :picture-width="200"
          :picture-height="200"
          @on-confirm="finishedUploadLogo"
        />
      </t-form-item>
      <t-form-item label="" field="" class="hint-item">
        <div class="hint"
          >建议图片尺寸：200px *
          200px，支持jpg、jpeg、png、bmp、gif文件格式，文件大小限制10M以内。</div
        >
      </t-form-item>
      <t-form-item
        field="dashKey"
        label="选择应用"
        :rules="[
          {
            required: true,
            message: '请选择应用',
          },
        ]"
      >
        <t-select
          v-model="form.dashKey"
          :style="{ width: '190px' }"
          placeholder="请选择"
          :trigger-props="{ autoFitPopupMinWidth: true }"
          @change="changeSelectDashName"
        >
          <t-option
            v-for="item in portalAppList"
            :key="item.dashKey"
            :value="item.dashKey"
            >{{ item.dashName }}
          </t-option>
        </t-select>
      </t-form-item>
    </t-form>
  </t-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import {
  saveCompanyNumberIntelligence,
  getDashBoardList,
} from '@/api/buyer/overview';
import IconMaterial from '@/components/iconMaterial/index.vue';

const logoVisible = ref(false);
const formRef = ref();

const portalAppList = ref<any[]>([]);

const userStore = useUserStore();
const { userInfoByCompany, selectCompany }: Record<string, any> =
  storeToRefs(userStore);

const emit = defineEmits(['onConfirm', 'onCancel']);

const form = reactive<{
  dashKey: string;
  dashName: string;
  name: string;
  logo: string;
  companyId: string;
}>({
  dashKey: '', // 轻流门户key
  dashName: '', // 轻流门户名称
  name: '', // 名称
  logo: '', // 图标
  companyId: selectCompany.value?.companyId, // 企业id
});

const props = defineProps({
  visible: Boolean,
  title: String,
});

const finishedUploadLogo = (logo: string) => {
  form.logo = logo;
  formRef.value.validateField('logo');
};

const handleCancel = () => {
  emit('onCancel');
};

const handleConfirm = () => {
  formRef.value.validate((errors: undefined) => {
    if (!errors) {
      saveCompanyNumberIntelligence(form).then(() => {
        emit('onConfirm');
      });
    }
  });
};

const changeSelectDashName = (value: any) => {
  const data = portalAppList.value.find((item: any) => {
    return item.dashKey === value;
  });
  form.dashName = data.dashName ?? '';
};
const getPortalApplicationList = () => {
  const params = {
    companyId: selectCompany.value?.companyId, // 企业id
  };
  getDashBoardList(params).then((res: any) => {
    portalAppList.value = res;
  });
};

onMounted(() => {
  getPortalApplicationList();
});
</script>

<style lang="less" scoped>
.file-container {
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 100px;
  margin-right: 8px;

  &:last-child {
    margin-right: 0;
  }

  .file-image {
    position: relative;
    width: 100px;
    height: 100px;
    background: #f6f7fb;
    border-radius: 16px;

    .image-div {
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      overflow: hidden;
      border: 1px solid #e5e8ef;
      border-radius: 16px;

      .image-hover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        padding: 40px 20px;
        border-radius: 2px;
        opacity: 0;

        .hover-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 40px 20px;
          background: #1d2129;
          border-radius: 2px;
          opacity: 0.5;
        }

        .icon-list {
          position: relative;
          z-index: 999;
          display: flex;
          justify-content: space-between;
          height: 20px;
        }
      }

      .image-hover:hover {
        opacity: 1;
      }
    }
  }
}

.pic-item {
  margin-bottom: 0 !important;
}

.hint {
  color: #86909c;
  font-size: 12px;
  line-height: 20px;
}

.hint-item {
  margin-top: 2px !important;
  margin-bottom: 14px !important;
}
</style>
