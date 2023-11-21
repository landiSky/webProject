<template>
  <div class="add-goods-container">
    <t-modal
      v-model:visible="visible"
      fullscreen
      has-back-btn="false"
      ok-text="完成"
      popup-container=".add-goods-container"
      @back="emit('cancel')"
    >
      <template #title>
        <div> {{ props.data?.id ? '编辑' : '新建' }}商品 </div>
      </template>
      <template #footer>
        <div class="footer">
          <t-button
            v-if="step === 2"
            style="margin-right: 8px"
            @click="clickPrevious"
            >上一步：基本信息</t-button
          >
          <t-button style="margin-right: 120px" @click="clickCancel"
            >取消</t-button
          >
          <t-button style="margin-right: 8px" @click="clickSave">保存</t-button>
          <t-button
            style="margin-right: 8px"
            type="outline"
            @click="clickPreview"
            >预览</t-button
          >
          <t-button v-if="step === 1" type="primary" @click="clickNext"
            >下一步：售卖设置与交付版本</t-button
          >
          <t-button v-if="step === 2" type="primary" @click="clickUp"
            >上架</t-button
          >
        </div>
      </template>
      <div v-if="step === 1" class="center-body">
        <t-form ref="formRef" :model="formModel" :rules="formRules">
          <div class="body-title">
            <div class="body-title-left">
              <div class="body-title-icon" />
              <div>基本信息</div>
            </div>
          </div>
          <t-form-item label="商品ID" field="">
            {{ formModel.id }}
          </t-form-item>
          <t-form-item label="商品名称" field="name">
            <t-input
              v-model.trim="formModel.name"
              allow-clear
              show-word-limit
              :max-length="{
                length: 20,
                errorOnly: true,
              }"
            >
            </t-input>
          </t-form-item>
          <t-form-item
            label="商品Logo"
            field="logo"
            class="pic-item"
            validate-trigger="blur"
          >
            <div class="file-list">
              <div v-if="formModel.logo" class="file-container">
                <div class="file-image">
                  <div class="image-div">
                    <t-image
                      width="100px"
                      height="100px"
                      fit="cover"
                      :src="`/server/web/file/download?name=${formModel.logo}`"
                      :preview-visible="logoVisible"
                      :preview-props="{
                        src: `/server/web/file/download?name=${formModel.logo}`,
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
                          @click="() => (formModel.logo = '')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <t-upload
              v-if="formModel.logo == ''"
              :ref="logoRef"
              :file-list="logoList"
              :limit="1"
              :multiple="false"
              :headers="uploadHeaders"
              action="/server/web/file/upload"
              :show-cancel-button="false"
              accept=".png,.jpg,.bmp,.jpeg,.gif,.tif"
              :show-file-list="false"
              @before-upload="beforeUpload"
              @success="uploadSuccess"
              @error="uploadError"
              @progress="uploadProgress"
            >
              <template #upload-button>
                <t-spin size="24" :loading="logoUploading">
                  <div :class="`tele-upload-list-item`">
                    <div class="tele-upload-picture-card">
                      <div class="tele-upload-picture-card-text">
                        <IconPlus size="16" />
                        <div
                          style="
                            margin-top: 8px;
                            font-weight: 500;
                            font-size: 12px;
                          "
                          >点击上传</div
                        >
                      </div>
                    </div>
                  </div>
                </t-spin>
              </template>
            </t-upload>
          </t-form-item>
          <t-form-item label="" field="" class="hint-item">
            <div class="hint"
              >支持jpg、jpeg、png、bmp、tif、gif文件格式，文件大小限制2M以内。</div
            >
          </t-form-item>
          <t-form-item
            label="详情展示图"
            field="detailImg"
            class="pic-item"
            validate-trigger="blur"
          >
            <div v-if="imageList.length > 0" class="file-list">
              <div v-for="url of imageList" :key="url" class="file-container">
                <div class="file-image">
                  <div class="image-div">
                    <t-image
                      width="100px"
                      height="100px"
                      fit="cover"
                      :src="`/server/web/file/download?name=${url}`"
                      :preview-visible="imageVisible[`${url}`]"
                      :preview-props="{
                        src: `/server/web/file/download?name=${url}`,
                      }"
                      @preview-visible-change="
                        () => (imageVisible[`${url}`] = false)
                      "
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
                          @click="() => (imageVisible[`${url}`] = true)"
                        />
                        <icon-delete
                          :style="{
                            fontSize: '20px',
                            color: '#fff',
                            cursor: 'pointer',
                          }"
                          @click="deletedetailImg(url)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <t-upload
              v-if="imageList.length < 5"
              :ref="detailImageRef"
              :file-list="detailList"
              :show-cancel-button="false"
              :show-file-list="false"
              :headers="uploadHeaders"
              action="/server/web/file/upload"
              accept=".png,.jpg,.bmp,.jpeg,.gif,.tif"
              @before-upload="beforeUpload"
              @success="uploadDetailSuccess"
              @progress="uploadDetailProgress"
              @error="uploadDetailError"
            >
              <template #upload-button>
                <t-spin size="24" :loading="detailUploading">
                  <div :class="`tele-upload-list-item`">
                    <div class="tele-upload-picture-card">
                      <div class="tele-upload-picture-card-text">
                        <IconPlus size="16" />
                        <div
                          style="
                            margin-top: 8px;
                            font-weight: 500;
                            font-size: 12px;
                          "
                          >点击上传</div
                        >
                      </div>
                    </div>
                  </div>
                </t-spin>
              </template>
            </t-upload>
          </t-form-item>
          <t-form-item label="" field="" class="hint-item">
            <div class="hint"
              >支持jpg、jpeg、png、bmp、tif、gif文件格式，文件大小限制2M以内。</div
            >
          </t-form-item>
          <t-form-item label="商品分类" field="productTypeId">
            <t-cascader
              v-model="formModel.productTypeId"
              :style="{ width: '100%' }"
              placeholder="请选择"
              :options="classList"
              :field-names="classFiledNames"
            />
          </t-form-item>
          <t-form-item label="应用类型" field="type">
            <t-radio-group v-model="formModel.type" :options="appTypeList" />
          </t-form-item>
          <t-form-item label="商品简介" field="introduction">
            <t-textarea
              v-model="formModel.introduction"
              placeholder="请输入商品简介"
              :max-length="{
                length: 300,
                errorOnly: true,
              }"
              allow-clear
              show-word-limit
              :auto-size="{
                minRows: 2,
                maxRows: 5,
              }"
            />
          </t-form-item>
          <t-form-item
            label="产品使用说明"
            field="useExplain"
            class="pic-item"
            validate-trigger=""
          >
            <t-upload
              :ref="prdRef"
              :limit="1"
              :file-list="expList"
              :multiple="false"
              action="/server/web/file/upload"
              :headers="uploadHeaders"
              :show-cancel-button="false"
              accept=".pdf,.doc,.docx"
              tip-position="bottom"
              @before-upload="beforeUpload"
              @success="uploadExpSuccess"
              @error="uploadExpError"
            ></t-upload>
          </t-form-item>
          <t-form-item label="" field="" class="hint-item">
            <div class="hint">文件大小限制2M以内，支持PDF格式、Word格式。</div>
          </t-form-item>
          <t-form-item label="详情展示信息" field="detail">
            <TemplateDrawer ref="templateRef"></TemplateDrawer>
          </t-form-item>
        </t-form>
      </div>
      <div v-if="step === 2" class="center-body">
        <div class="static-section">
          <div class="body-title">
            <div class="body-title-left">
              <div class="body-title-icon" />
              <div>售卖设置</div>
            </div>
          </div>
          <t-form ref="formRef2" :model="formModel2" :rules="formRules">
            <t-form-item label="服务交付方式" class="sale-item">
              <t-radio-group
                v-model="formModel2.deliveryType"
                :options="deliveryTypeList"
                class="sale-radio"
                type="button"
              >
              </t-radio-group>
              <t-link v-if="formModel2.deliveryType === 0"
                >《SAAS类应用对接指南》</t-link
              >
            </t-form-item>
            <t-form-item label="商品定价方式">
              <t-radio-group v-model="formModel2.saleType">
                <t-radio :value="priceTypeList[0].value">
                  {{ priceTypeList[0].label }}
                  <t-tooltip
                    content="可使用账号数量及使用时间均根据套餐设限，套餐价格=账号单价*套餐账号数*时长"
                  >
                    <icon-question-circle style="color: #86909c" size="12" />
                  </t-tooltip>
                </t-radio>
                <t-radio :value="priceTypeList[1].value">
                  {{ priceTypeList[1].label }}
                  <t-tooltip content="可使用账号数量及可使用时间均不受限">
                    <icon-question-circle style="color: #86909c" size="12" />
                  </t-tooltip>
                </t-radio>
                <t-radio
                  v-if="formModel2.deliveryType == 1"
                  :value="priceTypeList[2].value"
                >
                  {{ priceTypeList[2].label }}
                </t-radio>
              </t-radio-group>
            </t-form-item>
          </t-form>
        </div>
        <t-divider></t-divider>
        <div v-if="formModel2.saleType == priceTypeList[0].value">
          <div v-for="(c, index) of copyModal" :key="index" class="sale-copy">
            <div class="body-title">
              <div class="body-title-left">
                <div class="body-title-icon" />
                <div>交付版本{{ index + 1 }}</div>
              </div>
              <div
                v-if="copyModal.length > 1"
                class="body-title-right"
                style="cursor: pointer"
                @click="deleteSaleCopy(index)"
                >删除</div
              >
            </div>
            <t-form
              :ref="copyFormRef[index]"
              :model="copyModal[index]"
              :rules="copyRules"
            >
              <t-form-item label="交付版本名称" class="sale-item" field="name">
                <t-input
                  v-model.trim="copyModal[index].name"
                  allow-clear
                  show-word-limit
                  :max-length="{
                    length: 10,
                    errorOnly: true,
                  }"
                >
                </t-input>
              </t-form-item>
              <t-form-item
                v-if="formModel2.deliveryType == 0"
                label="应用服务地址"
                field="url"
              >
                <t-input
                  v-model.trim="copyModal[index].url"
                  placeholder="请输入应用服务地址"
                  :max-length="{
                    length: 50,
                    errorOnly: true,
                  }"
                  allow-clear
                  show-word-limit
                  :auto-size="{
                    minRows: 2,
                    maxRows: 5,
                  }"
                />
              </t-form-item>
              <t-form-item
                label="套餐定价设置"
                field="productDeliverySetInfoList"
              >
                <div class="price-list">
                  <div
                    v-for="(p, cIndex) of c.productDeliverySetInfoList"
                    :key="cIndex"
                    class="price-item"
                  >
                    <div class="price-name">套餐{{ cIndex + 1 }}：</div>
                    <div class="price-count"
                      ><t-input
                        v-model.trim="
                          copyModal[index].productDeliverySetInfoList[cIndex]
                            .accountNum
                        "
                        ><template #prefix>账号数：</template
                        ><template #suffix>个</template></t-input
                      ></div
                    >
                    <div class="price-value"
                      ><t-input
                        v-model.trim="
                          copyModal[index].productDeliverySetInfoList[cIndex]
                            .price
                        "
                        ><template #prefix>账号单价：</template
                        ><template #suffix>元</template></t-input
                      ></div
                    >
                    <div
                      v-if="c.productDeliverySetInfoList.length > 1"
                      class="price-icon"
                      @click="deletePrice(copyModal[index], cIndex)"
                      ><icon-delete size="16"></icon-delete
                    ></div>
                  </div>
                  <div
                    v-if="c.productDeliverySetInfoList.length < 4"
                    class="add-price"
                    @click="addPrice(c)"
                    ><icon-plus
                      stroke-width="6"
                      :style="{
                        fontSize: '12px',
                        color: '#1664FF',
                        marginRight: '8px',
                      }"
                    ></icon-plus
                    >新增套餐</div
                  >
                </div>
              </t-form-item>
              <t-form-item label="可选购买时长" field="durationList">
                <t-select
                  v-model="copyModal[index].durationList"
                  :style="{ width: '100%' }"
                  placeholder="请选择购买时长"
                  multiple
                  allow-search
                >
                  <t-option
                    v-for="item in durationOptions"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.label }}</t-option
                  >
                </t-select>
              </t-form-item>
            </t-form>
          </div>
        </div>
        <div v-if="formModel2.saleType == priceTypeList[1].value">
          <div v-for="(c, index) of copyModal2" :key="c" class="sale-copy">
            <div class="body-title">
              <div class="body-title-left">
                <div class="body-title-icon" />
                <div>交付版本{{ index + 1 }}</div>
              </div>
              <div
                v-if="copyModal2.length > 1"
                class="body-title-right"
                @click="deleteSaleCopy(index)"
                >删除</div
              >
            </div>
            <t-form
              :ref="copyFormRef[index]"
              :model="copyModal2[index]"
              :rules="copyRules"
            >
              <t-form-item label="交付版本名称" class="sale-item" field="name">
                <t-input
                  v-model.trim="copyModal2[index].name"
                  allow-clear
                  show-word-limit
                  :max-length="{
                    length: 10,
                    errorOnly: true,
                  }"
                >
                </t-input>
              </t-form-item>
              <t-form-item
                v-if="formModel2.deliveryType == 0"
                label="应用服务地址"
                field="url"
              >
                <t-input
                  v-model.trim="copyModal2[index].url"
                  placeholder="请输入应用服务地址"
                  :max-length="{
                    length: 50,
                    errorOnly: true,
                  }"
                  allow-clear
                  show-word-limit
                  :auto-size="{
                    minRows: 2,
                    maxRows: 5,
                  }"
                />
              </t-form-item>
              <t-form-item label="一口价金额" field="onePiece" required>
                <t-input v-model.trim="copyModal2[index].onePiece" allow-clear
                  ><template #suffix><div class="yuan">元</div></template>
                </t-input>
              </t-form-item>
            </t-form>
          </div>
        </div>
        <div v-if="formModel2.saleType == priceTypeList[2].value">
          <div v-for="(c, index) of copyModal3" :key="c" class="sale-copy">
            <div class="body-title">
              <div class="body-title-left">
                <div class="body-title-icon" />
                <div>交付版本{{ index + 1 }}</div>
              </div>
              <div
                v-if="copyModal3.length > 1"
                class="body-title-right"
                @click="deleteSaleCopy(index)"
                >删除</div
              >
            </div>
            <t-form
              :ref="copyFormRef[index]"
              :model="copyModal3[index]"
              :rules="copyRules"
            >
              <t-form-item label="交付版本名称" class="sale-item" field="name">
                <t-input
                  v-model.trim="copyModal3[index].name"
                  allow-clear
                  show-word-limit
                  :max-length="{
                    length: 10,
                    errorOnly: true,
                  }"
                >
                </t-input>
              </t-form-item>
            </t-form>
          </div>
        </div>
        <t-divider v-if="showAddCopy"></t-divider>
        <div v-if="showAddCopy" class="copy-add" @click="addCopy">
          <iconpark-icon name="squarePlus" size="20"></iconpark-icon>
          <div class="copy-add-title">添加交付版本</div>
        </div>
      </div>
    </t-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  ref,
  onMounted,
  computed,
  nextTick,
} from 'vue';
import { Message, FileItem, Modal } from '@tele-design/web-vue';
import { IconEye } from '@tele-design/web-vue/es/icon';
import {
  genGoodsId,
  fetchClassList,
  updateGoods1,
  saveGoods1,
  saveGoods2,
  saveAndUp,
  goodsDetail,
} from '@/api/goods-manage';
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import TemplateDrawer from './template.vue';

const emit = defineEmits(['cancel', 'preview']);

let needSave = false;
const userStore = useUserStore();
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);

const visible = ref(true);
const templateRef = ref();
const step = ref(1);

const uploadHeaders = {
  Authorization: `Bearer ${getToken()}`,
};

const prdRef = ref();

const appTypeList = ref([
  { label: '普通应用', value: 0 },
  { label: '标识应用（用户使用前需开通企业节点）', value: 1 },
]);

// 分类
const classList = ref<any[]>([]);
const classFiledNames = { value: 'id', label: 'name' };

// 详情
const detailImageRef = ref();
const imageVisible: Record<string, any> = ref({});
const imageList = ref<string[]>([]);
const deletedetailImg = (file: string) => {
  const index = imageList.value.indexOf(file);
  if (index >= 0) {
    imageList.value.splice(index, 1);
  }
};

// logo
const logoRef = ref();
const logoVisible = ref(false);

interface FormInterface {
  id: string;
  name: string;
  type: number;
  productTypeId: string;
  logo: string;
  detailImg: string;
  useExplain: string;
  introduction: string;
  detail: string;
  companyId: string;
}

const formModel = ref<FormInterface>({
  id: '',
  name: '',
  type: 0,
  productTypeId: '',
  logo: '',
  detailImg: '',
  useExplain: '',
  introduction: '',
  detail: '[]',
  companyId: '',
});

const logoList = ref<any[]>([]);
const detailList = ref<any[]>([]);
const expList = ref<any[]>([]);

const deliveryTypeList = ref([
  { label: 'SAAS类', value: 0 },
  { label: '独立部署类', value: 1 },
]);
const priceTypeList = ref([
  { label: '套餐定价(账号+时长)', value: 0 },
  { label: '一口价定价', value: 1 },
  { label: '价格面议', value: 2 },
]);

const formModel2 = ref({
  productId: undefined,
  deliveryType: 0,
  saleType: 0,
  productDeliveryList: [] as any,
});
const formRules = {
  name: [{ required: true, message: '请输入商品名称' }],
  logo: [{ required: true, message: '请上传logo图' }],
  detailImg: [{ required: true, message: '请至少上传一张详情图' }],
  productTypeId: [{ required: true, message: '请选择分类' }],
  type: [{ required: true }],
  introduction: [{ required: true, message: '请输入商品简介' }],
  useExplain: [{ required: true, message: '请上传产品使用说明' }],
  detail: [
    {
      required: true,
      message: '请添加详情模块',
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value || value === '[]') return cb('请添加详情模块');
        return cb();
      },
    },
  ],
  deliveryType: [{ required: true }],
  saleType: [{ required: true }],
};

const copyModal = ref<any[]>([
  {
    name: '',
    url: '',
    productDeliverySetInfoList: [
      {
        accountNum: null,
        price: null,
      },
    ],
    durationList: [],
  },
]);
const copyModal2 = ref<any[]>([
  {
    name: '',
    url: '',
    productDeliverySetInfoList: [{ price: null }],
    onePiece: null,
  },
]);
const copyModal3 = ref<any[]>([
  {
    name: '',
  },
]);

const addPrice = (c: any) => {
  c.productDeliverySetInfoList.push({
    accountNum: null,
    price: null,
  });
};
const deletePrice = (c: any, cIndex: number) => {
  c.productDeliverySetInfoList.splice(cIndex, 1);
};
const addCopy = () => {
  if (formModel2.value.saleType === 0) {
    copyModal.value.push({
      name: '',
      url: '',
      productDeliverySetInfoList: [
        {
          accountNum: null,
          price: null,
        },
      ],
      durationList: [],
    });
  } else if (formModel2.value.saleType === 1) {
    copyModal2.value.push({
      name: '',
      url: '',
      onePiece: null,
      productDeliverySetInfoList: [{ price: null }],
    });
  } else {
    copyModal3.value.push({
      name: '',
    });
  }
};
const deleteSaleCopy = (index: number) => {
  if (formModel2.value.saleType === 0) {
    copyModal.value.splice(index, 1);
  } else if (formModel2.value.saleType === 1) {
    copyModal2.value.splice(index, 1);
  } else {
    copyModal3.value.splice(index, 1);
  }
};

const durationOptions = [
  { label: '1个月', value: 1 },
  { label: '2个月', value: 2 },
  { label: '3个月', value: 3 },
  { label: '6个月', value: 6 },
  { label: '1年', value: 12 },
  { label: '2年', value: 24 },
  { label: '3年', value: 36 },
  { label: '不限', value: 0 },
];

const copyRules = {
  name: [
    { required: true, message: '请输入交付版本名称' },
    { maxLength: 10, message: '最多可输入10个字符' },
  ],
  url: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入应用服务地址');
        if (
          !/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/.test(
            value
          )
        )
          return cb('请检查应用服务地址');
        return cb();
      },
    },
    { maxLength: 50, message: '最多可输入50个字符' },
  ],
  productDeliverySetInfoList: [
    {
      required: true,
    },
  ],
  onePiece: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入一口价金额');
        if (!/^[1-9]\d*$/.test(value) || value.length > 10)
          return cb('一口价请填写10位以内整数');
        return cb();
      },
    },
  ],
  durationList: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请选择购买时长');
        return cb();
      },
    },
  ],
};

const props = defineProps({
  data: Object,
});
const modalJsonString = ref('');
const formRef = ref();
const formRef2 = ref();
const copyFormRef = [ref(), ref(), ref()];

const setFileOverLimit = (filed: string) => {
  formRef.value.setFields({
    [filed]: {
      status: 'error',
      message: `允许上传的文件最大数量不超过${filed === 'logo' ? 1 : 5}个`,
    },
  });
};

const logoUploading = ref(false);

const uploadError = (fileItem: FileItem) => {
  logoUploading.value = false;
  formModel.value.logo = '';
  const size = fileItem.file?.size ?? 0;
  if (size > 2 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过2M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
};

const uploadProgress = () => {
  logoUploading.value = true;
};

const uploadSuccess = (fileItem: FileItem) => {
  logoUploading.value = false;
  const res = fileItem.response;
  if (res?.code === 200) {
    formModel.value.logo = fileItem.response.data;
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};

const detailUploading = ref(false);

const uploadDetailProgress = () => {
  detailUploading.value = true;
};

const uploadDetailError = (fileItem: FileItem) => {
  detailUploading.value = false;
  const size = fileItem.file?.size ?? 0;
  if (size > 2 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过2M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
};

const uploadDetailSuccess = (fileItem: FileItem) => {
  detailUploading.value = false;
  const res = fileItem.response;
  if (res?.code === 200) {
    imageList.value.push(fileItem.response.data);
    formModel.value.detailImg = imageList.value.join(',');
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};

const uploadExpError = (fileItem: FileItem) => {
  formModel.value.useExplain = '';
  formRef.value.validateField('useExplain');
  const size = fileItem.file?.size ?? 0;
  if (size > 2 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过2M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
};

const uploadExpSuccess = (fileItem: FileItem) => {
  const res = fileItem.response;
  if (res?.code === 200) {
    formModel.value.useExplain = fileItem.response.data;
    expList.value = [fileItem];
    formRef.value.validateField('useExplain');
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};

const getClassList = () => {
  fetchClassList().then((data: any) => {
    classList.value = data;
  });
};

function deepClone(source: any) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments');
  }
  const targetObj: any = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

const showAddCopy = computed(() => {
  if (formModel2.value.saleType === 0) {
    return copyModal.value.length < 3;
  }
  if (formModel2.value.saleType === 1) {
    return copyModal2.value.length < 3;
  }
  return copyModal3.value.length < 3;
});

const buildForm2 = async () => {
  const result = await formRef2.value.validate();
  if (result) {
    return false;
  }
  let length = 0;
  if (formModel2.value.saleType === 0) {
    length = copyModal.value.length;
  } else if (formModel2.value.saleType === 1) {
    length = copyModal2.value.length;
  } else {
    length = copyModal3.value.length;
  }
  if (length > 0) {
    const result2 = await copyFormRef[0].value.validate();
    if (result2) {
      return false;
    }
  }
  if (length > 1) {
    const result2 = await copyFormRef[1].value.validate();
    if (result2) {
      return false;
    }
  }
  if (length > 2) {
    const result2 = await copyFormRef[2].value.validate();
    if (result2) {
      return false;
    }
  }
  let failed = false;
  if (formModel2.value.saleType === 0) {
    for (let index = 0; index < copyModal.value.length; index += 1) {
      const m = copyModal.value[index];
      for (const p of m.productDeliverySetInfoList) {
        if (!p.price || !p.accountNum) {
          failed = true;
          copyFormRef[index].value.setFields({
            productDeliverySetInfoList: {
              status: 'error',
              message: `请完善定价设置`,
            },
          });
          break;
        }
        if (!/^[1-9]\d*$/.test(p.price) || p.price.length > 10) {
          failed = true;
          copyFormRef[index].value.setFields({
            productDeliverySetInfoList: {
              status: 'error',
              message: `价格请填写10位以内整数`,
            },
          });
          break;
        }
        if (!/^[1-9]\d*$/.test(p.accountNum) || p.accountNum.length > 10) {
          failed = true;
          copyFormRef[index].value.setFields({
            productDeliverySetInfoList: {
              status: 'error',
              message: `账号数量请填写10位以内整数`,
            },
          });
          break;
        }
      }
    }
  }
  if (failed) {
    return false;
  }
  let modalList;
  if (formModel2.value.saleType === 0) {
    modalList = copyModal.value;
  } else if (formModel2.value.saleType === 1) {
    let tempList = deepClone(copyModal2.value);
    for (let index = 0; index < tempList.length; index += 1) {
      tempList[index].productDeliverySetInfoList[0].price = parseInt(
        tempList[index].onePiece,
        10
      );
      tempList[index].onePiece = null;
      tempList = JSON.parse(JSON.stringify(tempList));
    }
    modalList = tempList;
  } else {
    modalList = copyModal3.value;
  }
  formModel2.value.productDeliveryList = modalList;
  return true;
};

const getModalJson = () => {
  return (
    JSON.stringify(formModel.value) +
    JSON.stringify(formModel2.value) +
    JSON.stringify(copyModal.value) +
    JSON.stringify(copyModal2.value) +
    JSON.stringify(copyModal3.value)
  );
};

const getDetail = (id: any) => {
  goodsDetail(id).then((res) => {
    formModel.value.name = res.name;
    formModel.value.id = res.id;
    formModel.value.logo = res.logo;
    formModel.value.detailImg = res.detailImg;
    formModel.value.detail = res.detail;
    formModel.value.useExplain = res.useExplain;
    formModel.value.type = res.type;
    formModel.value.productTypeId = res.productTypeId;
    formModel.value.introduction = res.introduction;
    formModel2.value.productId = res.id;
    formModel2.value.deliveryType = res.deliveryType || 0;
    formModel2.value.saleType = res.saleType || 0;
    templateRef.value.templateData = JSON.parse(res.detail);

    imageList.value = res.detailImg ? res.detailImg.split(',') : [];
    if (res.useExplain) {
      expList.value = [{ uid: res.useExplain, name: res.useExplainOriginal }];
    }

    if (formModel2.value.saleType === 0) {
      copyModal.value = [];
      const list = res.productDeliverySetList;
      if (list && list.length > 0) {
        for (const one of list) {
          const list1: any[] = [];
          const pList = one.accountNumList;
          if (pList && pList.length > 0) {
            for (const two of pList) {
              list1.push({ accountNum: two.accountNum, price: two.price });
            }
          } else {
            list1.push({ accountNum: '', price: '' });
          }
          const list2: any[] = [];
          for (const three of one.durationList) {
            list2.push(three.duration);
          }
          copyModal.value.push({
            name: one.name,
            url: one.url,
            productDeliverySetInfoList: list1,
            durationList: list2,
          });
        }
      } else {
        copyModal.value.push({
          name: '',
          url: '',
          productDeliverySetInfoList: [{ accountNum: '', price: '' }],
          durationList: [],
        });
      }
    } else if (formModel2.value.saleType === 1) {
      copyModal2.value = [];
      const list = res.productDeliverySetList;
      console.log(list);

      if (list && list.length > 0) {
        for (const one of list) {
          const list1: any[] = [];
          const pList = one.accountNumList;
          let onePiece;
          if (pList && pList.length > 0) {
            for (const two of pList) {
              onePiece = parseInt(two.price, 10);
              list1.push({ price: onePiece });
              break;
            }
          } else {
            list1.push({ price: '' });
          }
          copyModal2.value.push({
            name: one.name,
            url: one.url,
            productDeliverySetInfoList: list1,
            onePiece,
          });
        }
      } else {
        copyModal2.value.push({
          name: '',
          url: '',
          productDeliverySetInfoList: [{ price: '' }],
        });
      }
    } else {
      copyModal3.value = [];
      const list = res.productDeliverySetList;
      if (list && list.length > 0) {
        for (const one of list) {
          copyModal3.value.push({
            name: one.name,
          });
        }
      } else {
        copyModal3.value.push({
          name: '',
        });
      }
    }

    modalJsonString.value = getModalJson();
  });
};

const getGoodsId = () => {
  genGoodsId().then((data: any) => {
    needSave = true;
    formModel.value.id = data;
    formModel2.value.productId = data;
    modalJsonString.value = getModalJson();
  });
};

function cancelUploadingFiles() {
  for (const file of logoList.value) {
    if (file.response === undefined || file.response === null) {
      logoRef.value.abort(file);
    }
  }
  for (const file of detailList.value) {
    if (file.response === undefined || file.response === null) {
      detailImageRef.value.abort(file);
    }
  }
  for (const file of expList.value) {
    if (file.response === undefined || file.response === null) {
      prdRef.value.abort(file);
    }
  }
}

const online = ref(true);

const beforeUpload = (file: File) => {
  // console.log(file, 'file');
  return new Promise<void>((resolve, reject) => {
    const over2 = file.size > 1024 * 1024 * 2;
    if (over2) {
      Message.warning(`上传失败，文件大小不要超过2M`);
      reject();
    }
    if (!online.value) {
      Message.warning('网络异常，暂时无法上传，请检查网络');
      reject();
    }
    // @ts-ignore
    resolve(true);
  });
};

onMounted(() => {
  window.addEventListener('online', () => {
    online.value = true;
  });
  window.addEventListener('offline', () => {
    cancelUploadingFiles();
    online.value = false;
  });
  formModel.value.companyId = String(userInfoByCompany.value?.companyId);
  getClassList();
  if (props.data?.id) {
    formModel.value.id = props.data?.id;
    formModel2.value.productId = props.data?.id;
    getDetail(props.data?.id);
  } else {
    getGoodsId();
  }
});

const doSave = async () => {
  let res;
  if (step.value === 1) {
    formModel.value.detail = JSON.stringify(templateRef.value.templateData);
    formModel.value.detailImg = imageList.value.join(',');
    const result = await formRef.value.validate();
    if (result) {
      return false;
    }
    if (props.data?.id) {
      res = await updateGoods1(formModel.value);
    } else {
      res = await saveGoods1(formModel.value);
    }
  } else {
    const r = await buildForm2();
    if (r === false) {
      return false;
    }
    res = await saveGoods2(formModel2.value);
  }
  return res;
};

// 取消
const clickCancel = () => {
  if (step.value === 1) {
    formModel.value.detail = JSON.stringify(templateRef.value.templateData);
  }
  const nowString = getModalJson();
  if (nowString !== modalJsonString.value) {
    Modal.warning({
      title: '是否保存已编辑的内容？',
      titleAlign: 'start',
      content: '',
      okText: '保存并退出',
      cancelText: '不保存',
      hideCancel: false,
      onOk: async () => {
        const res = await doSave();
        if (res) {
          visible.value = false;
          emit('cancel');
        } else {
          Message.error('信息暂时无法保存');
        }
      },
      onCancel: () => {
        visible.value = false;
        emit('cancel');
      },
    });
  } else {
    visible.value = false;
    emit('cancel');
  }
};

// 保存
const clickSave = async () => {
  const res = await doSave();
  if (res) {
    modalJsonString.value = getModalJson();
    Message.success('保存成功');
    needSave = false;
  }
};

// 下一步
const clickNext = async () => {
  formModel.value.detail = JSON.stringify(templateRef.value.templateData);
  formModel.value.detailImg = imageList.value.join(',');
  const result = await formRef.value.validate();
  if (result) {
    return;
  }
  const api = props.data?.id ? updateGoods1 : saveGoods1;
  api(formModel.value).then((res) => {
    if (res) {
      modalJsonString.value = getModalJson();
      step.value = 2;
    }
  });
};

// 上一步
const clickPrevious = () => {
  step.value = 1;
  nextTick(() => {
    templateRef.value.templateData = formModel.value.detail
      ? JSON.parse(formModel.value.detail)
      : '[]';
  });
};

// 预览
const clickPreview = () => {
  if (needSave) {
    Modal.warning({
      title: '暂时无法预览',
      titleAlign: 'start',
      content: '请先保存信息后再进行效果预览，保存后信息仍可以修改。',
      okText: '保存并预览',
      cancelText: '取消',
      hideCancel: false,
      onOk: async () => {
        const res = await doSave();
        if (res) {
          if (formModel.value.id) {
            emit('preview', formModel.value.id);
          }
        } else {
          Message.error('信息暂时无法保存');
        }
      },
    });
    return;
  }
  if (formModel.value.id) {
    emit('preview', formModel.value.id);
  }
};

// 上架
const clickUp = async () => {
  const r = await buildForm2();
  if (r) {
    Modal.warning({
      title: '确定上架该商品吗？',
      titleAlign: 'start',
      content: '商品通过上架审核后，将同时在本平台和标识网络其他平台同步上架。',
      okText: '上架商品',
      hideCancel: false,
      onOk: () => {
        saveAndUp(formModel2.value).then((res) => {
          if (res) {
            Message.success('上架申请成功');
            emit('cancel');
          }
        });
      },
    });
  }
};
</script>

<style lang="less" scoped>
.about-meta {
  text-align: right;
}

.about-meta-des {
  text-align: left;
}

.add-goods-container {
  .center-body {
    width: 718px;
    margin: 0 auto;
  }

  .body-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 24px;
    margin-bottom: 20px;

    .body-title-left {
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      color: #1d2129;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;

      .body-title-icon {
        width: 4px;
        height: 14px;
        margin-right: 8px;
        background-color: #1664ff;
      }
    }

    .body-title-right {
      color: #4e5969;
      font-size: 12px;
      line-height: 20px;
    }
  }

  .sale-copy {
    margin-bottom: 24px;

    .price-list {
      display: flex;
      flex-direction: column;
      width: 100%;

      .add-price {
        color: #1664ff;
        font-weight: 400;
        font-size: 12px;
        font-style: normal;
        line-height: 20px;
        cursor: pointer;
      }

      .price-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 32px;
        margin-bottom: 16px;

        .price-name {
          width: 56px;
          color: #4e5969;
          font-size: 12px;
        }

        .price-count {
          flex: 1;
          margin-right: 8px;
        }

        .price-value {
          flex: 1;
        }

        .price-icon {
          width: 40px;
          padding: 0 12px;
          cursor: pointer;
        }
      }
    }
  }
}

:deep(.tele-form-item-wrapper-col) {
  max-width: 600px;
}

:deep(.tele-tag-checked) {
  background: #fff;
}

:deep(.tele-input-outer) {
  width: 182px;
}

:deep(.tele-upload-tip) {
  white-space: normal;
}

:deep(.tele-upload-list-item-name-link) {
  color: var(--color-text-1);
}

:deep(.tele-upload-list-item) {
  margin-top: 0;

  .tele-upload-picture-card {
    min-width: 100px;
    min-height: 100px;
  }

  .tele-upload-list-picture {
    width: 100px;
    height: 100px;
    margin: 0;

    .tele-upload-list-picture-mask {
      font-size: 20px;
      line-height: 100px;
    }
  }
}

:deep(.tele-upload-list-picture) {
  width: 100px;
  height: 100px;
  margin-right: 8px;

  .tele-upload-list-picture-mask {
    font-size: 20px;
    line-height: 100px;
  }
}

.file-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.file-container {
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 100px;
  margin-right: 8px;

  .file-image {
    position: relative;
    width: 100px;
    height: 100px;
    background: #f6f7fb;
    border-radius: 2px;

    .image-div {
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      overflow: hidden;
      border: 1px solid #e5e8ef;
      border-radius: 2px;

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

.hint {
  color: #86909c;
  font-size: 12px;
  line-height: 20px;
}

.hint-item {
  margin-top: 2px !important;
  margin-bottom: 14px !important;
}

.pic-item {
  margin-bottom: 0 !important;
}

.modal-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  .modal {
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: stretch;
    justify-content: space-between;
    padding: 12px 0 12px 16px;
    background: #fff;
    border: 1px solid #e5e8ef;
    border-radius: 2px;

    .modal-name {
      color: #4e5969;
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 20px;
    }

    .modal-action {
      font-weight: 400;
      font-size: 12px;

      :deep(.tele-btn-size-small) {
        height: 20px;
      }
    }
  }
}

.modal-add {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: start;
  padding: 12px 0 12px 16px;
  background: #f6f7fb;
  border: 1px solid #e5e8ef;
  border-radius: 2px;

  .modal-add-title {
    margin-left: 8px;
    color: #1d2129;
    font-size: 12px;
  }
}

.sale-item {
  .sale-radio {
    background-color: #fff;

    :deep(.tele-radio-button) {
      margin: 0 16px 0 0;
      line-height: 32px;
      background-color: #f2f3f8;

      .tele-radio-button-content {
        padding: 0 24px;
      }
    }

    :deep(.tele-radio-checked) {
      background-color: #e8f4ff;
    }
  }

  :deep(.tele-link) {
    padding: 0;
  }
}

.copy-add {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: start;

  .copy-add-title {
    margin-left: 8px;
    color: #1d2129;
    font-size: 12px;
  }
}

.yuan {
  color: #86909c;
  font-size: 12px;
}
</style>
