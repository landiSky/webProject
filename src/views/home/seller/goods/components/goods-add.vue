<template>
  <div class="add-goods-container">
    <t-modal
      :visible="true"
      fullscreen
      ok-text="完成"
      popup-container=".add-goods-container"
      :on-before-ok="onConfirm"
      :on-before-cancel="onCancel"
      :ok-button-props="{
        size: 'large',
      }"
      :cancel-button-props="{
        size: 'large',
      }"
      @back="emit('cancel')"
    >
      <template #title>
        <div> 新建商品 </div>
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
            {{ displayId }}
          </t-form-item>
          <t-form-item label="商品名称" field="name">
            <t-input
              v-model="formModel.name"
              allow-clear
              show-word-limit
              :max-length="{
                length: 20,
                errorOnly: true,
              }"
            >
            </t-input>
          </t-form-item>
          <t-form-item label="商品Logo" field="logo" class="pic-item">
            <div class="file-list">
              <div v-if="formModel.logo" class="file-container">
                <div class="file-image">
                  <div class="image-div">
                    <t-image
                      width="100px"
                      height="100px"
                      fit="cover"
                      :src="`/web/file/download?name=9966c98f-ddef-40df-976e-8b7d86da4d25.jpg`"
                      :preview-visible="logoVisible"
                      :preview-props="{
                        src: `/web/file/download?name=${formModel.logo}`,
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
              :multiple="false"
              :headers="uploadHeaders"
              action="/web/file/upload"
              :show-cancel-button="false"
              accept=".png,.jpg,.jpeg,.gif,.tif"
              :show-file-list="false"
              @success="uploadSuccess"
              @error="uploadError"
              @exceed-limit="
                () => {
                  setFileOverLimit('logo');
                }
              "
            >
              <template #upload-button>
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
              </template>
            </t-upload>
          </t-form-item>
          <t-form-item label="" field="" class="hint-item">
            <div class="hint"
              >支持jpg、png、bmp、tif、gif文件格式，文件大小限制2M以内。</div
            >
          </t-form-item>
          <t-form-item label="详情展示图" field="detailImg" class="pic-item">
            <div v-if="imageList.length > 0" class="file-list">
              <div v-for="url of imageList" :key="url" class="file-container">
                <div class="file-image">
                  <div class="image-div">
                    <t-image
                      width="100px"
                      height="100px"
                      fit="cover"
                      :src="`/web/file/download?name=${url}`"
                      :preview-visible="imageVisible[`${url}`]"
                      :preview-props="{
                        src: `/web/file/download?name=${url}`,
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
              :show-cancel-button="false"
              :show-file-list="false"
              :headers="uploadHeaders"
              action="/web/file/upload"
              accept=".png,.jpg,.jpeg,.gif,.tif"
              @success="uploadDetailSuccess"
              @error="uploadDetailError"
              @exceed-limit="
                () => {
                  setFileOverLimit('detail');
                }
              "
            >
              <template #upload-button>
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
              </template>
            </t-upload>
          </t-form-item>
          <t-form-item label="" field="" class="hint-item">
            <div class="hint"
              >支持jpg、png、bmp、tif、gif文件格式，文件大小限制2M以内。</div
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
          <t-form-item label="产品简介" field="introduction">
            <t-textarea
              v-model="formModel.introduction"
              placeholder="请输入产品简介"
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
              :multiple="false"
              action="/web/file/upload"
              :headers="uploadHeaders"
              :show-cancel-button="false"
              accept=".pdf,.word"
              tip-position="bottom"
              @success="uploadExpSuccess"
              @error="uploadExpError"
            ></t-upload>
          </t-form-item>
          <t-form-item label="" field="" class="hint-item">
            <div class="hint">文件大小限制10M以内，支持PDF格式、Word格式。</div>
          </t-form-item>
          <t-form-item label="详细展示信息" field="detail">
            <div class="modal-list">
              <div
                v-for="(modal, index) of modalList"
                :key="index"
                class="modal"
              >
                <div class="modal-name"> {{ modal }} </div>
                <div class="modal-action">
                  <t-button type="text" size="small" @click="editModal(modal)"
                    >编辑</t-button
                  >
                  <t-button
                    type="text"
                    size="small"
                    style="color: #4e5969"
                    @click="deleteModal(modal)"
                    >删除</t-button
                  >
                </div>
              </div>
              <div class="modal-add" @click="addModal">
                <iconpark-icon name="squarePlus" size="20"></iconpark-icon>
                <div class="modal-add-title">添加详情模块</div>
              </div>
            </div>
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
                  v-model="copyModal[index].name"
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
                  v-model="copyModal[index].url"
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
                        v-model="
                          copyModal[index].productDeliverySetInfoList[cIndex]
                            .accountNum
                        "
                        ><template #prefix>账号数：</template
                        ><template #suffix>个</template></t-input
                      ></div
                    >
                    <div class="price-value"
                      ><t-input
                        v-model="
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
                  v-model="copyModal2[index].name"
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
                  v-model="copyModal2[index].url"
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
                label="一口价金额"
                field="productDeliverySetInfoList"
              >
                <t-input
                  v-model="
                    copyModal2[index].productDeliverySetInfoList[0].price
                  "
                  allow-clear
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
                  v-model="copyModal3[index].name"
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
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
import { Message, Modal, FileItem } from '@tele-design/web-vue';
import { IconEye } from '@tele-design/web-vue/es/icon';
import {
  genGoodsId,
  fetchClassList,
  saveGoods1,
  saveGoods2,
  saveAndUp,
} from '@/api/goods-manage';
import { getToken } from '@/utils/auth';

const step = ref(1);

const uploadHeaders = {
  Authorization: `Bearer ${getToken()}`,
};
const modalList = ref(['模块一：产品简介', '模块二：产品特色']);

const addModal = () => {
  // TODO 添加详情模块
  console.log('添加详情模块');
};
const editModal = (modal: any) => {
  // TODO 编辑详情模块
  console.log('编辑详情模块：', modal);
};
const deleteModal = (modal: any) => {
  const index = modalList.value.indexOf(modal);
  if (index >= 0) {
    modalList.value.splice(index, 1);
  }
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

const id = ref();
const displayId = ref();
const formModel = ref({
  productId: undefined,
  name: '',
  type: 0,
  productTypeId: null,
  logo: '',
  detailImg: '',
  useExplain: '',
  introduction: '',
  detail: {
    aa: 'bb',
  },
});

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
  introduction: [{ required: true, message: '请输入产品简介' }],
  useExplain: [{ required: true, message: '请上传产品使用说明' }],
  detail: [{ required: true, message: '请添加详情模块' }],
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
      productDeliverySetInfoList: [],
      durationList: [],
    });
  } else if (formModel2.value.saleType === 1) {
    copyModal2.value.push({
      name: '',
      url: '',
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
  name: [{ required: true, message: '请输入交付版本名称' }],
  url: [{ required: true, message: '请输入应用服务地址' }],
  productDeliverySetInfoList: [
    {
      required: true,
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

const emit = defineEmits(['confirm', 'cancel']);

const props = defineProps({
  metaData: Object,
  goodsData: Object,
  valueModelRules: Object,
});
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

const uploadError = (fileItem: FileItem) => {
  const size = fileItem.file?.size ?? 0;
  if (size > 2 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过2M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
};

const uploadSuccess = (fileItem: FileItem) => {
  const res = fileItem.response;
  if (res?.code === 200) {
    formModel.value.logo = fileItem.response.data;
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};

const uploadDetailError = (fileItem: FileItem) => {
  formModel.value.logo = '';
  const size = fileItem.file?.size ?? 0;
  if (size > 2 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过2M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
};

const uploadDetailSuccess = (fileItem: FileItem) => {
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
    formRef.value.validateField('useExplain');
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};

const onCancel = () => {
  // const newFormStr =
  //   JSON.stringify(formModel.value) +
  //   JSON.stringify(roleModal.value) +
  //   JSON.stringify(valueModel.value);
  // if (!props.goodsData?.handleName && state.serializeForm !== newFormStr) {
  //   Modal.warning({
  //     title: '内容尚未保存，确定取消新建么？',
  //     titleAlign: 'start',
  //     content: '',
  //     okText: '确定',
  //     hideCancel: false,
  //     onOk: () => {
  //       emit('cancel');
  //     },
  //     onCancel: () => {
  //       return false;
  //     },
  //   });
  // } else {
  //   emit('cancel');
  // }
};

const onConfirm = async (done: (closed: boolean) => void) => {
  // const [errors1, errors3] = await Promise.all([
  //   formRef.value.validate(),
  //   valueFormRef.value.validate(),
  // ]);
  // if (errors1 || errors3) {
  //   done(false);
  //   return;
  // }
  // if (showManageArea.value) {
  //   const errors2 = await roleFormRef.value.validate();
  //   if (errors2) {
  //     done(false);
  //     return;
  //   }
  // }
  // const { prefix, handle } = formModel.value;
  // const metaHandle = props.metaData?.metaHandle ?? '';
  // const handleName = props.goodsData?.handleName ?? `${prefix}/${handle}`;
  // const roleData = roleModal.value;
  // if (
  //   roleData.authGrant.type === RoleArea.All &&
  //   roleData.authManage.type === RoleArea.Limit
  // ) {
  //   Message.error('权限管理授权用户必须同时拥有数据管理授权！');
  done(false);
  //   return;
};

const getGoodsId = () => {
  genGoodsId().then((data: any) => {
    displayId.value = data;
  });
};

const getClassList = () => {
  fetchClassList().then((data: any) => {
    classList.value = data;
  });
};

const showAddCopy = computed(() => {
  if (formModel2.value.saleType === 0) {
    return copyModal.value.length < 3;
  }
  if (formModel2.value.saleType === 1) {
    return copyModal2.value.length < 3;
  }
  return copyModal3.value.length < 3;
});

onMounted(async () => {
  await getGoodsId();
  getClassList();
});

// 取消
const clickCancel = () => {
  console.log(formModel.value.type);
};

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
        if (!/^[1-9]\d*$/.test(p.accountNum)) {
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
    console.log('定价校验失败');
    return false;
  }
  let modalList;
  if (formModel2.value.saleType === 0) {
    modalList = copyModal.value;
  } else if (formModel2.value.saleType === 1) {
    modalList = copyModal2.value;
  } else {
    modalList = copyModal3.value;
  }
  formModel2.value.productDeliveryList = modalList;
  formModel2.value.productId = id.value;
  return true;
};

// 保存
const clickSave = async () => {
  if (step.value === 1) {
    const result = await formRef.value.validate();
    if (result) {
      return;
    }
    formModel.value.productId = displayId.value;
    saveGoods1(formModel.value).then((res) => {
      if (res) {
        id.value = res;
        Message.success('保存成功');
      }
    });
  } else {
    const r = await buildForm2();
    if (r) {
      saveGoods2(formModel2.value).then((res) => {
        console.log(res);
        if (res) {
          Message.success('保存成功');
        }
      });
    }
  }
};

// 下一步
const clickNext = async () => {
  const result = await formRef.value.validate();
  if (result) {
    return;
  }
  formModel.value.productId = displayId.value;
  saveGoods1(formModel.value).then((res) => {
    if (res) {
      id.value = res;
      step.value = 2;
    }
  });
};

// 上一步
const clickPrevious = () => {
  step.value = 1;
};

// 预览
const clickPreview = () => {};

// 上架
const clickUp = async () => {
  const r = await buildForm2();
  if (r) {
    saveAndUp(formModel2.value).then((res) => {
      console.log(res);
      if (res) {
        Message.success('保存成功');
      }
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
