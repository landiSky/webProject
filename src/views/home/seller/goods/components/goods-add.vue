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
          <t-form-item label="商品ID" field=""> {{ productId }} </t-form-item>
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
              <div
                v-for="file of logoFileList"
                :key="file.uid"
                class="file-container"
              >
                <div class="file-image">
                  <div class="image-div">
                    <t-image
                      width="100px"
                      hidden="100px"
                      fit="cover"
                      :src="`${file.url}`"
                      :preview-visible="logoVisible"
                      :preview-props="{
                        src: `${file.url}`,
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
                          @click="() => (logoFileList = [])"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <t-upload
              v-if="logoFileList.length == 0"
              :ref="logoRef"
              :limit="1"
              :multiple="false"
              action="/api/v1/file/upload"
              :show-cancel-button="false"
              accept=".png,.jpg,.jpeg,.gif,.tif"
              :show-file-list="false"
              @success="uploadSuccess"
              @error="uploadError"
              @change="onChange"
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
            <div class="file-list">
              <div
                v-for="file of imageList"
                :key="file.uid"
                class="file-container"
              >
                <div class="file-image">
                  <div class="image-div">
                    <t-image
                      width="100px"
                      hidden="100px"
                      fit="cover"
                      :src="`${file.url}`"
                      :preview-visible="imageVisible[`${file.url}`]"
                      :preview-props="{
                        src: `${file.url}`,
                      }"
                      @preview-visible-change="
                        () => (imageVisible[`${file.url}`] = false)
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
                          @click="() => (imageVisible[`${file.url}`] = true)"
                        />
                        <icon-delete
                          :style="{
                            fontSize: '20px',
                            color: '#fff',
                            cursor: 'pointer',
                          }"
                          @click="deletedetailImg(file)"
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
              :multiple="true"
              :show-cancel-button="false"
              :show-file-list="false"
              action="/"
              accept=".png,.jpg,.jpeg,.gif,.tif"
              @success="uploadSuccess"
              @error="uploadError"
              @change="fileUploadChange"
              @exceed-limit="setFileOverLimit"
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
              v-model="introduction"
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
          <t-form-item label="产品使用说明" field="useExplain">
            <t-upload
              :ref="prdRef"
              v-model:file-list="useExplainList"
              :limit="1"
              :multiple="false"
              action="/api/v1/file/upload"
              :show-cancel-button="false"
              accept=".pdf,.word"
              tip="文件大小限制10M以内，支持PDF格式、Word格式"
              tip-position="bottom"
              @success="uploadSuccess"
              @error="uploadError"
            ></t-upload>
          </t-form-item>
          <t-form-item label="详细展示信息" field="modal">
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
          <t-form ref="formRef" :model="formModel2" :rules="formRules">
            <t-form-item label="服务交付方式" class="sale-item">
              <t-radio-group
                v-model="formModel2.deliveryType"
                :options="deliveryTypeList"
                class="sale-radio"
                type="button"
              >
              </t-radio-group>
              <t-link>《SAAS类应用对接指南》</t-link>
            </t-form-item>
            <t-form-item label="商品定价方式">
              <t-radio-group v-model="priceType">
                <t-radio :value="priceTypeList[0]">
                  {{ priceTypeList[0] }}
                  <t-tooltip
                    content="可使用账号数量及使用时间均根据套餐设限，套餐价格=账号单价*套餐账号数*时长"
                  >
                    <icon-question-circle style="color: #86909c" size="12" />
                  </t-tooltip>
                </t-radio>
                <t-radio :value="priceTypeList[1]">
                  {{ priceTypeList[1] }}
                  <t-tooltip content="可使用账号数量及可使用时间均不受限">
                    <icon-question-circle style="color: #86909c" size="12" />
                  </t-tooltip>
                </t-radio>
                <t-radio v-if="deliveryType == 1" :value="priceTypeList[2]">
                  {{ priceTypeList[2] }}
                </t-radio>
              </t-radio-group>
            </t-form-item>
          </t-form>
        </div>
        <t-divider></t-divider>
        <div v-if="priceType == priceTypeList[0]">
          <div
            v-for="(c, index) of saleCopyList1"
            :key="index"
            class="sale-copy"
          >
            <div class="body-title">
              <div class="body-title-left">
                <div class="body-title-icon" />
                <div>交付版本{{ index + 1 }}</div>
              </div>
              <div class="body-title-right" @click="deleteSaleCopy(c)"
                >删除</div
              >
            </div>
            <t-form ref="formRef" :model="formModel" :rules="formRules">
              <t-form-item label="交付版本名称" class="sale-item">
                <t-input
                  v-model="formModel.name"
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
              >
                <t-textarea
                  v-model="formModel2.url"
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
              <t-form-item label="套餐定价设置">
                <div class="price-list">
                  <div
                    v-for="(p, index) of c.priceList"
                    :key="index"
                    class="price-item"
                  >
                    <div class="price-name">套餐{{ index + 1 }}：</div>
                    <div class="price-count"
                      ><t-input
                        ><template #prefix>账号数：</template
                        ><template #suffix>个</template></t-input
                      ></div
                    >
                    <div class="price-value"
                      ><t-input
                        ><template #prefix>账号单价：</template
                        ><template #suffix>元</template></t-input
                      ></div
                    >
                    <div class="price-icon"
                      ><icon-delete size="16"></icon-delete
                    ></div>
                  </div>
                  <div class="add-price" @click="addPrice"
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
              <t-form-item label="可选购买时长"
                ><t-select
                  :default-value="[]"
                  :style="{ width: '100%' }"
                  placeholder="请选择"
                  multiple
                >
                  <t-option>1个月</t-option>
                  <t-option>2个月</t-option>
                  <t-option>3个月</t-option>
                  <t-option>6个月</t-option>
                  <t-option>1年</t-option>
                  <t-option>2年</t-option>
                  <t-option>3年</t-option>
                  <t-option>不限</t-option>
                </t-select></t-form-item
              >
            </t-form>
          </div>
        </div>
        <div v-if="priceType == priceTypeList[1]">
          <div v-for="(c, index) of saleCopyList2" :key="c" class="sale-copy">
            <div class="body-title">
              <div class="body-title-left">
                <div class="body-title-icon" />
                <div>交付版本{{ index + 1 }}</div>
              </div>
              <div class="body-title-right" @click="deleteSaleCopy(c)"
                >删除</div
              >
            </div>
            <t-form ref="formRef" :model="formModel" :rules="formRules">
              <t-form-item label="交付版本名称" class="sale-item">
                <t-input
                  v-model="formModel.name"
                  allow-clear
                  show-word-limit
                  :max-length="{
                    length: 10,
                    errorOnly: true,
                  }"
                >
                </t-input>
              </t-form-item>
              <t-form-item label="一口价金额">
                <t-input v-model="formModel.name" allow-clear
                  ><template #suffix><div class="yuan">元</div></template>
                </t-input>
              </t-form-item>
            </t-form>
          </div>
        </div>
        <div v-if="priceType == priceTypeList[2]">
          <div v-for="(c, index) of saleCopyList3" :key="c" class="sale-copy">
            <div class="body-title">
              <div class="body-title-left">
                <div class="body-title-icon" />
                <div>交付版本{{ index + 1 }}</div>
              </div>
              <div class="body-title-right" @click="deleteSaleCopy(c)"
                >删除</div
              >
            </div>
            <t-form ref="formRef" :model="formModel" :rules="formRules">
              <t-form-item label="交付版本名称" class="sale-item">
                <t-input
                  v-model="formModel.name"
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
        <t-divider></t-divider>
        <div class="copy-add" @click="addCopy">
          <iconpark-icon name="squarePlus" size="20"></iconpark-icon>
          <div class="copy-add-title">添加交付版本</div>
        </div>
      </div>
    </t-modal>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { Message, Modal, FileItem } from '@tele-design/web-vue';
import { IconEye } from '@tele-design/web-vue/es/icon';

const step = ref(1);

const saleCopyList1 = ref([
  {
    priceList: [
      { count: 1, price: 200 },
      { count: 2, price: 200 },
      { count: 3, price: 200 },
    ],
  },
  {
    priceList: [
      { count: 1, price: 200 },
      { count: 2, price: 200 },
      { count: 3, price: 200 },
    ],
  },
  {
    priceList: [
      { count: 1, price: 200 },
      { count: 2, price: 200 },
      { count: 3, price: 200 },
    ],
  },
]);
const addPrice = () => {};
const saleCopyList2 = ref([1, 2, 3]);
const saleCopyList3 = ref([1, 2, 3]);
const addCopy = () => {};
const deleteSaleCopy = (copy: any) => {};
const deliveryType = ref('SAAS类');
const deliveryTypeList = ref([
  { label: 'SAAS类', value: 0 },
  { label: '独立部署类', value: 1 },
]);

const priceType = ref('套餐定价(账号+时长)');
const priceTypeList = ref(['套餐定价(账号+时长)', '一口价定价', '价格面议']);

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
const useExplainList = ref();

const appTypeList = ref([
  { label: '普通应用', value: 0 },
  { label: '标识应用（用户使用前需开通企业节点）', value: 1 },
]);
const introduction = ref('');

// 分类
const classId = ref();
const classList = ref<any[]>([
  { name: '1', id: 1, children: [{ name: '2', id: 2 }] },
]);
const classFiledNames = { value: 'id', label: 'name' };

// 详情
const detailImageRef = ref();
const imageVisible: Record<string, any> = ref({});
const imageList = ref<FileItem[]>([]);
const deletedetailImg = (file: FileItem) => {
  const index = imageList.value.indexOf(file);
  if (index >= 0) {
    imageList.value.splice(index, 1);
  }
};
function fileUploadChange(fileList: FileItem[], file: FileItem) {
  console.log('list: ', fileList);
  console.log('file: ', file);
  imageList.value = fileList;
  // imageList.value.push({
  //   filePath: currentFile.url,
  //   base64Content: '',
  // });
}

// logo
const logoRef = ref();
const logoVisible = ref(false);
const logoFileList = ref<FileItem[]>([]);
const onChange = (_: FileItem[], file: FileItem) => {
  logoFileList.value = [file];
};

const formModel = ref({
  name: '',
  type: 0,
  productTypeId: null,
  logo: '',
  detailImg: '',
});
const formModel2 = ref({
  deliveryType: 0,
  url: 0,
  productTypeId: null,
  logo: '',
  detailImg: '',
});
const formRules = {
  name: [{ required: true, message: '请输入商品名称' }],
  logo: [{ required: true, message: '请上传logo图' }],
  detailImg: [{ required: true, message: '请至少上传一张详情图' }],
  productTypeId: [{ required: true, message: '请选择分类' }],
  type: [{ required: true }],
  introduction: [{ required: true, message: '请输入产品简介' }],
  useExplain: [{ required: true, message: '请上传产品使用说明' }],
  modal: [{ required: true, message: '请添加详情模块' }],
  deliveryType: [{ required: true }],
};

const emit = defineEmits(['confirm', 'cancel']);

const props = defineProps({
  metaData: Object,
  goodsData: Object,
  valueModelRules: Object,
});
const formRef = ref();
// const uploadData = (item: any) => {
//   return {
//     metaHandle: props.metaData?.metaHandle,
//     fileField: item.englishName,
//   };
// };

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
  if (res?.code === 10000) {
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

function cancelUploadingFiles() {
  // for (const item of props.metaData?.itemVOS ?? []) {
  //   if (
  //     item.usedItemSchemaVO?.dataType === DATA_TYPE.FILE &&
  //     item.inputNecessary === NormalBoolean.True
  //   ) {
  //     const files = valueModel.value[`${item.englishName}`] ?? [];
  //     for (const file of files) {
  //       if (file.response === undefined || file.response === null) {
  //         (uploadRefs.value[item.englishName] as any).abort(file);
  //       }
  //     }
  //   }
  // }
}

const productId = ref('');

const genProductId = () => {
  const date = new Date().toLocaleDateString('en-CA').replaceAll('-', '');
  const random = Math.random().toString().slice(-6);
  productId.value = date + random;
};

// 初始化
onMounted(async () => {
  genProductId();
  // 统一添加网络异常提示
  window.addEventListener('offline', () => {
    cancelUploadingFiles();
  });
  // valueModelRules.value = props.valueModelRules ?? {};
  // if (props.goodsData?.handleName) {
  //   // 编辑：初始化前两个表单数据
  //   editData.value = await goodsDetail({
  //     handleName: props.goodsData.handleName,
  //     updateFlag: 1,
  //   });
  //   instanceId = editData.value?.handleMainInfoVO?.id ?? '';
  //   const handleName = editData.value?.handleMainInfoVO?.handleName;
  //   if (handleName) {
  //     const index = handleName.indexOf('/');
  //     if (index > 0) {
  //       formModel.value.prefix = handleName.slice(0, index);
  //       formModel.value.handle = handleName.slice(index);
  //     }
  //   }
  //   const roleVO = editData.value.handleAuthorityVO;
  //   if (roleVO) {
  //     roleModal.value.authGrant.type = roleVO.authGrantVO.open
  //       ? RoleArea.All
  //       : RoleArea.Limit;
  //     const userList = roleVO.authGrantVO.user;
  //     roleModal.value.authGrant.userList = userList;
  //     showManageArea.value =
  //       userList.filter((u: any) => u.id === (userInfo.value?.userId ?? 0))
  //         .length > 0 ||
  //       (
  //         userInfo.value?.roles?.filter((e) => e.roleCode === 'ROLE_SUPER') ??
  //         []
  //       ).length > 0;
  //     roleModal.value.authQuery.type = roleVO.authQueryVO.open
  //       ? RoleArea.All
  //       : RoleArea.Limit;
  //     roleModal.value.authQuery.userList = roleVO.authQueryVO.user;
  //     roleModal.value.authManage.type = roleVO.authManageVO.open
  //       ? RoleArea.All
  //       : RoleArea.Limit;
  //     roleModal.value.authManage.userList = roleVO.authManageVO.user;
  //   }
  // } else {
  //   showManageArea.value = true;
  // }

  // // 初始化校验规则和value表单数据
  // for (const vo of props.metaData?.itemVOS) {
  //   if (vo.usedItemSchemaVO.dataType === DATA_TYPE.FILE) {
  //     const fileNames =
  //       editData.value?.handleMainInfoVO?.value[`${vo.englishName}`] ?? [];
  //     valueModel.value[`${vo.englishName}`] = fileNames.map((fileName: any) => {
  //       return {
  //         name: fileName.oldName,
  //         status: 'done',
  //         response: {
  //           code: 10000,
  //           data: {
  //             filePath: fileName.filePath,
  //           },
  //         },
  //       };
  //     });
  //   } else if (vo.usedItemSchemaVO.dataType === DATA_TYPE.DATE) {
  //     let value =
  //       editData.value?.handleMainInfoVO?.value[`${vo.englishName}`] ?? '';
  //     if (
  //       value &&
  //       vo.usedItemSchemaVO.dateFormat === 'YYYY-MM-DD HH:mm:ss' &&
  //       !value.includes(':')
  //     ) {
  //       value = `${value} 00:00:00`;
  //     }
  //     valueModel.value[`${vo.englishName}`] = value;
  //   } else {
  //     valueModel.value[`${vo.englishName}`] =
  //       editData.value?.handleMainInfoVO?.value[`${vo.englishName}`] ?? '';
  //   }
  //   if (vo.usedItemSchemaVO.dataType === DATA_TYPE.REFERENCE) {
  //     const metaHandle = vo.usedItemReferenceVO.referenceMetaHandle;
  //     fetchAssociateMeta(metaHandle, vo.englishName);
  //   }
  // }
  // state.serializeForm =
  //   JSON.stringify(formModel.value) +
  //   JSON.stringify(roleModal.value) +
  //   JSON.stringify(valueModel.value);
});

const getTile = (fileName: string) => {
  const index = fileName.lastIndexOf('.');
  if (index > 0) {
    const tile = fileName.substring(index + 1);
    return tile;
  }
  return '';
};

const setFileOverLimit = () => {
  // formRef.value.setFields({
  //   [`${item.englishName}`]: {
  //     status: 'error',
  //     message: `允许上传的文件最大数量不超过${item.usedItemSchemaVO.maxFileCount}个`,
  //   },
  // });
};

const clickCancel = () => {
  console.log(formModel.value.type);
};

const clickSave = () => {
  formRef.value.validate((result: any) => {
    console.log(result);
  });
};

const clickNext = () => {
  step.value = 2;
};

const clickPrevious = () => {
  step.value = 1;
};

const clickPreview = () => {};

const clickUp = () => {};
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
