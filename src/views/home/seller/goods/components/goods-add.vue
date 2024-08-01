<template>
  <div class="add-goods-container">
    <t-modal
      v-model:visible="visible"
      fullscreen
      ok-text="完成"
      popup-container=".add-goods-container"
      :on-before-back="onBack"
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
            :style="{
              marginRight: '8px',
              fontSize: '14px',
              width: '160px',
            }"
            @click="clickPrevious"
            >上一步：基本信息</t-button
          >
          <t-button
            :style="{
              marginRight: step == 1 ? '166px' : '152px',
              fontSize: '14px',
              width: '76px',
            }"
            @click="clickCancel"
            >取消</t-button
          >
          <t-button
            :style="{
              marginRight: '8px',
              fontSize: '14px',
              width: '76px',
            }"
            @click="clickSave"
            >保存</t-button
          >
          <t-button
            :style="{
              marginRight: '8px',
              fontSize: '14px',
              width: '76px',
            }"
            type="outline"
            @click="clickPreview"
            >预览</t-button
          >
          <t-button
            v-if="step === 1"
            :style="{
              fontSize: '14px',
              width: '222px',
            }"
            type="primary"
            @click="clickNext"
            >下一步：售卖设置与交付版本</t-button
          >
          <t-button
            v-if="step === 2"
            :style="{
              fontSize: '14px',
              width: '68px',
            }"
            type="primary"
            @click="clickUp"
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
            {{ formModel.id || '-' }}
          </t-form-item>
          <t-form-item label="商品名称" field="name">
            <t-input
              v-model.trim="formModel.name"
              show-word-limit
              :max-length="{
                length: 20,
                errorOnly: true,
              }"
              @input="validate(formRef, 'name')"
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
              <IconMaterial v-else @on-confirm="finishedUploadLogo" />
            </div>

            <!-- <t-upload
              v-if="formModel.logo == ''"
              :ref="logoRef"
              :file-list="logoList"
              :limit="1"
              :multiple="false"
              :headers="uploadHeaders"
              action="/server/web/file/upload"
              :show-cancel-button="false"
              accept=".png,.jpg,.bmp,.jpeg,.gif"
              :show-file-list="false"
              @before-upload="beforeUpload"
              @success="uploadSuccess"
              @error="uploadError"
              @progress="uploadProgress"
            >
              <template #upload-button>
                <t-spin :size="24" :loading="logoUploading">
                  <div :class="`tele-upload-list-item`">
                    <div class="tele-upload-picture-card">
                      <div class="tele-upload-picture-card-text">
                        <IconPlus :size="16" :stroke-width="6" />
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
            </t-upload> -->
          </t-form-item>
          <t-form-item label="" field="" class="hint-item">
            <div class="hint"
              >支持jpg、jpeg、png、bmp、gif文件格式，文件大小限制10M以内。</div
            >
          </t-form-item>
          <!-- <t-form-item
            label="详情展示图"
            field="detailImg"
            class="pic-item"
            validate-trigger="blur"
          >
            <div class="file-list">
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

              <t-upload
                v-if="imageList.length < 5"
                :ref="detailImageRef"
                :file-list="detailList"
                :show-cancel-button="false"
                :show-file-list="false"
                :headers="uploadHeaders"
                action="/server/web/file/upload"
                accept=".png,.jpg,.bmp,.jpeg,.gif"
                @before-upload="beforeUpload"
                @success="uploadDetailSuccess"
                @progress="uploadDetailProgress"
                @error="uploadDetailError"
              >
                <template #upload-button>
                  <t-spin :size="24" :loading="detailUploading">
                    <div :class="`tele-upload-list-item`">
                      <div class="tele-upload-picture-card">
                        <div class="tele-upload-picture-card-text">
                          <IconPlus :size="16" :stroke-width="6" />
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
            </div>
          </t-form-item>
          <t-form-item label="" field="" class="hint-item">
            <div class="hint"
              >支持jpg、jpeg、png、bmp、gif文件格式，文件大小限制10M以内。</div
            >
          </t-form-item> -->
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
              show-word-limit
              :auto-size="{
                minRows: 2,
                maxRows: 5,
              }"
              @input="validate(formRef, 'introduction')"
            />
          </t-form-item>
          <t-form-item
            label="产品使用说明"
            field="useExplain"
            class="pic-item pic-item2"
          >
            <t-upload
              :ref="prdRef"
              :limit="10"
              :file-list="expList"
              :multiple="false"
              action="/server/web/file/upload"
              :headers="uploadHeaders"
              :show-cancel-button="false"
              accept=".pdf,.doc,.docx"
              tip-position="bottom"
              @before-upload="beforeUpload50"
              @before-remove="beforeRemove50"
              @success="uploadExpSuccess"
              @error="uploadExpError"
              @change="uploadExpChange"
            ></t-upload>
          </t-form-item>
          <t-form-item label="" field="" class="hint-item">
            <div class="hint">文件大小限制50M以内，支持PDF格式、Word格式。</div>
          </t-form-item>
          <t-form-item label="详情展示信息" field="detail">
            <!-- <TemplateDrawer
              ref="templateRef"
              :template-data="templateDetail"
              @confirm="templateChanged"
            ></TemplateDrawer> -->
            <div v-if="formModel.detail" class="templateItem">
              <div style="display: flex">
                <div>装修模块：</div>
                <div style="color: #1d2129"
                  >{{
                    `${formModel.draftStatus === 0 ? '草稿状态' : '已配置模块'}`
                  }}
                </div>
              </div>
              <div style="margin-left: 30px">
                <t-button
                  type="text"
                  style="padding: 0"
                  @click="editTemplateDetail"
                  >编辑
                </t-button>
                <t-button
                  type="text"
                  style="margin-left: 16px; padding: 0; color: #4e5969"
                  @click="delTemplateDetail"
                  >删除
                </t-button>
              </div>
            </div>
            <div v-else class="templateAdd" @click="addTemplateDetail">
              <iconpark-icon
                class="plusIcon"
                name="squarePlus"
                size="20px"
              ></iconpark-icon>
              <span>添加详情模块</span>
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
                @change="radiogroupChange"
              >
              </t-radio-group>
            </t-form-item>
            <t-form-item label="商品定价方式">
              <t-radio-group v-model="formModel2.saleType">
                <t-radio
                  v-if="formModel2.deliveryType == 1"
                  :value="priceTypeList[0].value"
                >
                  {{ priceTypeList[0].label }}
                  <t-tooltip
                    content="可使用账号数量及使用时间均根据套餐设限，套餐价格=账号单价*套餐账号数*时长"
                  >
                    <icon-question-circle style="color: #86909c" :size="12" />
                  </t-tooltip>
                </t-radio>
                <t-radio
                  v-if="formModel2.deliveryType == 1"
                  :value="priceTypeList[1].value"
                >
                  {{ priceTypeList[1].label }}
                  <t-tooltip content="可使用账号数量及可使用时间均不受限">
                    <icon-question-circle style="color: #86909c" :size="12" />
                  </t-tooltip>
                </t-radio>
                <t-radio
                  v-if="formModel2.deliveryType == 1"
                  :value="priceTypeList[2].value"
                >
                  {{ priceTypeList[2].label }}
                </t-radio>
                <t-radio
                  v-if="formModel2.deliveryType == 0"
                  :value="priceTypeList[3].value"
                >
                  {{ priceTypeList[3].label }}
                  <t-tooltip
                    content="用户不付款即可安装使用应用。你可以在应用内限制免费版所享有的功能权益"
                  >
                    <icon-question-circle style="color: #86909c" :size="12" />
                  </t-tooltip>
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
                  v-model.trim="copyModal[index].name"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 10,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'name')"
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
                  show-word-limit
                  :auto-size="{
                    minRows: 2,
                    maxRows: 5,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'url')"
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
                        placeholder="请输入"
                        @input="validateAP(index, 'account')"
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
                        placeholder="请输入"
                        @input="validateAP(index, 'price')"
                        ><template #prefix>账号单价：</template
                        ><template #suffix>元</template></t-input
                      ></div
                    >
                    <div
                      v-if="c.productDeliverySetInfoList.length > 1"
                      class="price-icon"
                      @click="deletePrice(copyModal[index], cIndex)"
                      ><icon-delete :size="16"></icon-delete
                    ></div>
                  </div>
                  <div
                    v-if="c.productDeliverySetInfoList.length < 4"
                    class="add-price"
                    @click="addPrice(c)"
                    ><icon-plus
                      :stroke-width="6"
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
              <t-form-item label="是否支持试用" field="isTry">
                <t-radio-group v-model="copyModal[index].isTry">
                  <t-radio
                    v-for="(c, index) of isTryList"
                    :key="index"
                    :value="c.value"
                  >
                    {{ c.label }}
                  </t-radio>
                </t-radio-group>
              </t-form-item>
              <t-form-item
                v-if="copyModal[index].isTry === 1"
                label="试用版本地址"
                class="sale-item"
                field="tryUrl"
              >
                <t-input
                  v-model.trim="copyModal[index].tryUrl"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 500,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'tryUrl')"
                >
                </t-input>
              </t-form-item>
              <t-form-item
                v-if="copyModal[index].isTry === 1"
                label="试用账号"
                class="sale-item"
                field="tryAccount"
              >
                <t-input
                  v-model.trim="copyModal[index].tryAccount"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 50,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'tryAccount')"
                >
                </t-input>
              </t-form-item>
              <t-form-item
                v-if="copyModal[index].isTry === 1"
                label="试用密码"
                class="sale-item"
                field="tryPwd"
              >
                <t-input
                  v-model.trim="copyModal[index].tryPwd"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 100,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'tryPwd')"
                >
                </t-input>
              </t-form-item>
            </t-form>
          </div>
        </div>
        <div v-if="formModel2.saleType == priceTypeList[1].value">
          <div v-for="(c, index) of copyModal2" :key="index" class="sale-copy">
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
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 10,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'name')"
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
                  show-word-limit
                  :auto-size="{
                    minRows: 2,
                    maxRows: 5,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'url')"
                />
              </t-form-item>
              <t-form-item label="一口价金额" field="onePiece" required>
                <t-input
                  v-model.trim="copyModal2[index].onePiece"
                  placeholder="请输入"
                  @input="validateArray(copyFormRef[index].value, 'onePiece')"
                  ><template #suffix><div class="yuan">元</div></template>
                </t-input>
              </t-form-item>
              <t-form-item label="是否支持试用" field="isTry">
                <t-radio-group v-model="copyModal2[index].isTry">
                  <t-radio
                    v-for="(c, index) of isTryList"
                    :key="index"
                    :value="c.value"
                  >
                    {{ c.label }}
                  </t-radio>
                </t-radio-group>
              </t-form-item>
              <t-form-item
                v-if="copyModal2[index].isTry === 1"
                label="试用版本地址"
                class="sale-item"
                field="tryUrl"
              >
                <t-input
                  v-model.trim="copyModal2[index].tryUrl"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 500,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'tryUrl')"
                >
                </t-input>
              </t-form-item>
              <t-form-item
                v-if="copyModal2[index].isTry === 1"
                label="试用账号"
                class="sale-item"
                field="tryAccount"
              >
                <t-input
                  v-model.trim="copyModal2[index].tryAccount"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 50,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'tryAccount')"
                >
                </t-input>
              </t-form-item>
              <t-form-item
                v-if="copyModal2[index].isTry === 1"
                label="试用密码"
                class="sale-item"
                field="tryPwd"
              >
                <t-input
                  v-model.trim="copyModal2[index].tryPwd"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 100,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'tryPwd')"
                >
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
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 10,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'name')"
                >
                </t-input>
              </t-form-item>
              <t-form-item label="是否支持试用" field="isTry">
                <t-radio-group v-model="copyModal3[index].isTry">
                  <t-radio
                    v-for="(c, index) of isTryList"
                    :key="index"
                    :value="c.value"
                  >
                    {{ c.label }}
                  </t-radio>
                </t-radio-group>
              </t-form-item>
              <t-form-item
                v-if="copyModal3[index].isTry === 1"
                label="试用版本地址"
                class="sale-item"
                field="tryUrl"
              >
                <t-input
                  v-model.trim="copyModal3[index].tryUrl"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 500,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'tryUrl')"
                >
                </t-input>
              </t-form-item>
              <t-form-item
                v-if="copyModal3[index].isTry === 1"
                label="试用账号"
                class="sale-item"
                field="tryAccount"
              >
                <t-input
                  v-model.trim="copyModal3[index].tryAccount"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 50,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'tryAccount')"
                >
                </t-input>
              </t-form-item>
              <t-form-item
                v-if="copyModal3[index].isTry === 1"
                label="试用密码"
                class="sale-item"
                field="tryPwd"
              >
                <t-input
                  v-model.trim="copyModal3[index].tryPwd"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 100,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'tryPwd')"
                >
                </t-input>
              </t-form-item>
            </t-form>
          </div>
        </div>
        <div v-if="formModel2.saleType == priceTypeList[3].value">
          <div v-for="(c, index) of copyModal4" :key="index" class="sale-copy">
            <div class="body-title">
              <div class="body-title-left">
                <div class="body-title-icon" />
                <div>交付版本{{ index + 1 }}</div>
              </div>
              <div
                v-if="copyModal4.length > 1"
                class="body-title-right"
                @click="deleteSaleCopy(index)"
                >删除</div
              >
            </div>
            <t-form
              :ref="copyFormRef[index]"
              :model="copyModal4[index]"
              :rules="copyRules"
              :label-col-props="{
                span: 6,
                offset: 0,
              }"
            >
              <t-form-item label="交付版本名称" class="sale-item" field="name">
                <t-input
                  v-model.trim="copyModal4[index].name"
                  placeholder="请输入"
                  show-word-limit
                  :max-length="{
                    length: 10,
                    errorOnly: true,
                  }"
                  @input="validateArray(copyFormRef[index].value, 'name')"
                >
                </t-input>
              </t-form-item>
              <t-form-item label="选择SaaS应用" field="saasAppId">
                <t-select
                  v-model="copyModal4[index].saasAppId"
                  :style="{ width: '100%' }"
                  placeholder="请选择已上线的SaaS应用"
                  :show-extra-options="false"
                >
                  <t-option
                    v-for="item in applicationList"
                    :key="item.value"
                    :value="item.value"
                  >
                    <span v-show="item.status == 1">{{ item.label }}</span>
                  </t-option>
                </t-select>
              </t-form-item>
            </t-form>
          </div>
        </div>
        <t-divider v-if="showAddCopy"></t-divider>
        <div v-if="showAddCopy" class="copy-add" @click="addCopy">
          <iconpark-icon name="squarePlus" :size="20"></iconpark-icon>
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
  onBeforeUnmount,
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
  selectOnlineMallApps,
} from '@/api/goods-manage';
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import router from '@/router';
import { ChannelType } from '@/enums/decoration';
import { channelName } from '@/views/decoration/decorationTools/constant';
// import TemplateDrawer from './template.vue';
import IconMaterial from '@/components/iconMaterial/index.vue';

const broadcastChannel = new BroadcastChannel(channelName);
const emit = defineEmits(['cancel', 'preview']);

let needSave = false;
const userStore = useUserStore();
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);

const visible: Record<string, any> = ref(true);
// const templateRef: Record<string, any> = ref();
const step = ref(1);

const uploadHeaders = {
  Authorization: `${getToken()}`,
};

const prdRef = ref();

const appTypeList = ref([
  { label: '普通应用', value: 0 },
  { label: '标识应用（用户使用前需开通企业节点）', value: 1 },
]);

// 详情是否配置完成
const detailSetOk = ref(true);

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

const formModel = ref<Record<string, any>>({
  id: '',
  name: '',
  type: 0,
  productTypeId: '',
  logo: '',
  detailImg: '',
  useExplain: [],
  introduction: '',
  detail: '',
  draftStatus: null,
  draftDetail: '',
  versionType: 0,
  companyId: '',
});

// const templateDetail = ref(); // 存放原始的模板详情，为了点击取消时判断是否弹窗

const logoList = ref<any[]>([]);
const detailList = ref<any[]>([]);
const expList = ref<any[]>([]);
// 应用
const applicationList = ref<any[]>([]);

const deliveryTypeList = ref([
  { label: 'SaaS类', value: 0 },
  { label: '独立部署类', value: 1 },
]);
const priceTypeList = ref([
  { label: '套餐定价(账号+时长)', value: 0 },
  { label: '一口价定价', value: 1 },
  { label: '价格面议', value: 2 },
  { label: '免费', value: 3 },
]);

const isTryList = ref([
  { label: '是', value: 1 },
  { label: '否', value: 0 },
]);

const formModel2 = ref({
  productId: undefined,
  deliveryType: 0,
  saleType: 3,
  productDeliveryList: [] as any,
});
const formRules = {
  name: [
    { required: true, message: '请输入商品名称' },
    { maxLength: 20, message: '最多允许输入20个字符' },
  ],
  logo: [{ required: true, message: '请上传logo图' }],
  detailImg: [{ required: true, message: '请至少上传一张详情图' }],
  productTypeId: [{ required: true, message: '请选择分类' }],
  type: [{ required: true }],
  introduction: [
    { required: true, message: '请输入商品简介' },
    { maxLength: 300, message: '最多允许输入300个字符' },
  ],
  // useExplain: [{ required: true, message: '请上传产品使用说明' }],
  useExplain: [
    {
      required: true,
      validator: (value: string, cb: (params?: any) => void) => {
        console.log(value.length);
        if (value.length === 0) return cb('请上传产品使用说明');
        const aggregate = expList.value.filter((item: any) => {
          return item.status !== 'done';
        });
        console.log(aggregate);
        if (aggregate.length !== 0) {
          return cb('文件正在上传中');
        }
        return cb();
      },
    },
  ],
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
    isTry: 1,
    tryUrl: '',
    tryAccount: '',
    tryPwd: '',
  },
]);
const copyModal2 = ref<any[]>([
  {
    name: '',
    url: '',
    productDeliverySetInfoList: [{ price: null }],
    onePiece: null,
    isTry: 1,
    tryUrl: '',
    tryAccount: '',
    tryPwd: '',
  },
]);
const copyModal3 = ref<any[]>([
  {
    name: '',
    isTry: 1,
    tryUrl: '',
    tryAccount: '',
    tryPwd: '',
  },
]);
const copyModal4 = ref<any[]>([
  {
    name: '',
    saasAppId: '',
  },
]);

// 服务交付方式change事件
const radiogroupChange = (c: any) => {
  if (c === 1) {
    formModel2.value.saleType = 0;
  } else {
    formModel2.value.saleType = 3;
  }
};

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
      isTry: 1,
      tryUrl: '',
      tryAccount: '',
      tryPwd: '',
    });
  } else if (formModel2.value.saleType === 1) {
    copyModal2.value.push({
      name: '',
      url: '',
      onePiece: null,
      productDeliverySetInfoList: [{ price: null }],
      isTry: 1,
      tryUrl: '',
      tryAccount: '',
      tryPwd: '',
    });
  } else if (formModel2.value.saleType === 3) {
    copyModal4.value.push({
      name: '',
      saasAppId: '',
    });
  } else {
    copyModal3.value.push({
      name: '',
      isTry: 1,
      tryUrl: '',
      tryAccount: '',
      tryPwd: '',
    });
  }
};
const deleteSaleCopy = (index: number) => {
  if (formModel2.value.saleType === 0) {
    copyModal.value.splice(index, 1);
  } else if (formModel2.value.saleType === 1) {
    copyModal2.value.splice(index, 1);
  } else if (formModel2.value.saleType === 3) {
    copyModal4.value.splice(index, 1);
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
  saasAppId: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请选择已上线的SaaS应用');
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
  isTry: [{ required: true, message: '请选择是否支持试用' }],
  tryUrl: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if (!value || value.length === 0) return cb('请输入试用版本地址');
        if (!/^(https?:\/\/).+$/.test(value)) return cb('请输入正确格式');
        if (value.length > 500) {
          return cb('最多可输入500个字符');
        }
        return cb();
      },
    },
  ],
  // tryUrl: [
  //   { required: true, message: '请输入试用版本地址' },
  //   { maxLength: 500, message: '最多可输入500个字符' },
  // ],
  tryAccount: [
    { required: true, message: '请输入试用账号' },
    { maxLength: 50, message: '最多可输入50个字符' },
  ],
  tryPwd: [
    { required: true, message: '请输入试用密码' },
    { maxLength: 100, message: '最多可输入100个字符' },
  ],
};

const props = defineProps({
  data: Object,
});
const modalJsonString = ref('');
const formRef = ref();
const formRef2 = ref();
const copyFormRef = [ref(), ref(), ref()];

const logoUploading = ref(false);

const uploadError = (fileItem: FileItem) => {
  logoUploading.value = false;
  formModel.value.logo = '';
  const size = fileItem.file?.size ?? 0;
  if (size > 10 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过10M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
  formRef.value.validateField('logo');
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
  formRef.value.validateField('logo');
};

const detailUploading = ref(false);

const uploadDetailProgress = () => {
  detailUploading.value = true;
};

const uploadDetailError = (fileItem: FileItem) => {
  detailUploading.value = false;
  const size = fileItem.file?.size ?? 0;
  if (size > 10 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过10M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
  formRef.value.validateField('detailImg');
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
  formRef.value.validateField('detailImg');
};

const uploadExpError = (fileItem: FileItem) => {
  // formModel.value.useExplain = '';
  // formRef.value.validateField('useExplain');
  const size = fileItem.file?.size ?? 0;
  if (size > 50 * 1024 * 1024) {
    Message.error(`上传失败，文件大小不要超过50M`);
  } else {
    Message.error(`上传失败，请检查网络`);
  }
};

const uploadExpSuccess = (fileItem: FileItem) => {
  const res = fileItem.response;
  if (res?.code === 200) {
    formModel.value.useExplain = [
      ...formModel.value.useExplain,
      fileItem.response.data,
    ];
    formRef.value.validateField('useExplain');
    Message.success(`上传 ${fileItem.name} 成功`);
  } else {
    Message.error(`上传 ${fileItem.name} 失败: ${res?.message ?? ''}`);
  }
};

const uploadExpChange = (fileList: FileItem[]) => {
  expList.value = fileList;
  // if (fileList.length === 0) {
  //   formModel.value.useExplain = [];
  // }
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
  if (formModel2.value.saleType === 3) {
    return copyModal4.value.length < 3;
  }
  return copyModal3.value.length < 3;
});

const validateAccountPrice = () => {
  let failed = false;
  if (formModel2.value.saleType === 0) {
    for (let index = 0; index < copyModal.value.length; index += 1) {
      const m = copyModal.value[index];
      for (const p of m.productDeliverySetInfoList) {
        if (!p.price || !p.accountNum) {
          failed = true;
          copyFormRef[index].value[0].setFields({
            productDeliverySetInfoList: {
              status: 'error',
              message: `请完善定价设置`,
            },
          });
          break;
        }
        if (!/^[1-9]\d*$/.test(p.price) || p.price.length > 10) {
          failed = true;
          copyFormRef[index].value[0].setFields({
            productDeliverySetInfoList: {
              status: 'error',
              message: `价格请填写10位以内整数`,
            },
          });
          break;
        }
        if (!/^[1-9]\d*$/.test(p.accountNum) || p.accountNum.length > 10) {
          failed = true;
          copyFormRef[index].value[0].setFields({
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
  return failed;
};

const buildForm2 = () => {
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
  } else if (formModel2.value.saleType === 3) {
    modalList = copyModal4.value;
  } else {
    modalList = copyModal3.value;
  }
  formModel2.value.productDeliveryList = modalList;
};

const validForm2 = async () => {
  buildForm2();
  let pass = true;
  const result = await formRef2.value.validate();
  if (result) {
    pass = false;
  }
  let length = 0;
  if (formModel2.value.saleType === 0) {
    length = copyModal.value.length;
  } else if (formModel2.value.saleType === 1) {
    length = copyModal2.value.length;
  } else if (formModel2.value.saleType === 3) {
    length = copyModal4.value.length;
  } else {
    length = copyModal3.value.length;
  }
  if (length > 0) {
    const result2 = await copyFormRef[0].value[0].validate();
    if (result2) {
      pass = false;
    }
  }
  if (length > 1) {
    const result2 = await copyFormRef[1].value[0].validate();
    if (result2) {
      pass = false;
    }
  }
  if (length > 2) {
    const result2 = await copyFormRef[2].value[0].validate();
    if (result2) {
      pass = false;
    }
  }

  if (validateAccountPrice()) {
    pass = false;
  }

  return pass;
};

const getModalJson = () => {
  return (
    JSON.stringify(formModel.value) +
    JSON.stringify(formModel2.value) +
    JSON.stringify(copyModal.value) +
    JSON.stringify(copyModal2.value) +
    JSON.stringify(copyModal3.value) +
    JSON.stringify(copyModal4.value)
  );
};

const getDetail = (id: any) => {
  goodsDetail(id).then((res) => {
    const useExplainList =
      res?.useExplainMap.map((item: any) => {
        return item.useExplain;
      }) || [];
    formModel.value.name = res.name;
    formModel.value.id = res.id;
    formModel.value.logo = res.logo;
    formModel.value.detailImg = res.detailImg;
    formModel.value.detail = res.detail;
    formModel.value.draftStatus = res.draftStatus;
    formModel.value.draftDetail = res.draftDetail;
    formModel.value.versionType = res.versionType;
    formModel.value.useExplain = useExplainList;
    formModel.value.type = res.type;
    formModel.value.productTypeId = res.productTypeId;
    formModel.value.introduction = res.introduction;
    formModel2.value.productId = res.id;
    formModel2.value.deliveryType = res.deliveryType ?? 0;
    formModel2.value.saleType = res.saleType ?? 3;
    // templateDetail.value = JSON.parse(res.detail);
    // templateRef.value.templateData = JSON.parse(res.detail);
    imageList.value = res.detailImg ? res.detailImg.split(',') : [];
    if (res.useExplain) {
      const useExplainMap = res.useExplainMap.map((item: any) => {
        const params = item;
        params.uid = params.useExplain;
        params.name = params.useExplainOriginal;
        params.status = 'done';
        return params;
      });
      expList.value = useExplainMap;
      // expList.value = [{ uid: res.useExplain, name: res.useExplainOriginal }];
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
              list1.push({
                accountNum: two.accountNum,
                price: parseInt(two.price, 10),
              });
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
            isTry: one.isTry,
            tryUrl: one.tryUrl,
            tryAccount: one.tryAccount,
            tryPwd: one.tryPwd,
          });
        }
      } else {
        copyModal.value.push({
          name: '',
          url: '',
          productDeliverySetInfoList: [{ accountNum: '', price: '' }],
          durationList: [],
          isTry: 1,
          tryUrl: '',
          tryAccount: '',
          tryPwd: '',
        });
      }
    } else if (formModel2.value.saleType === 1) {
      copyModal2.value = [];
      const list = res.productDeliverySetList;

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
            isTry: one.isTry,
            tryUrl: one.tryUrl,
            tryAccount: one.tryAccount,
            tryPwd: one.tryPwd,
          });
        }
      } else {
        copyModal2.value.push({
          name: '',
          url: '',
          productDeliverySetInfoList: [{ price: '' }],
          isTry: 1,
          tryUrl: '',
          tryAccount: '',
          tryPwd: '',
        });
      }
    } else if (formModel2.value.saleType === 3) {
      copyModal4.value = [];
      const list = res.productDeliverySetList;
      if (list && list.length > 0) {
        for (const one of list) {
          copyModal4.value.push({
            name: one.name,
            saasAppId: one.saasAppId,
          });
        }
      } else {
        copyModal4.value.push({
          name: '',
          saasAppId: '',
        });
      }
    } else {
      copyModal3.value = [];
      const list = res.productDeliverySetList;
      if (list && list.length > 0) {
        for (const one of list) {
          copyModal3.value.push({
            name: one.name,
            isTry: one.isTry,
            tryUrl: one.tryUrl,
            tryAccount: one.tryAccount,
            tryPwd: one.tryPwd,
          });
        }
      } else {
        copyModal3.value.push({
          name: '',
          isTry: 1,
          tryUrl: '',
          tryAccount: '',
          tryPwd: '',
        });
      }
    }

    modalJsonString.value = getModalJson();
  });
};

const finishedUploadLogo = (logo: string) => {
  formModel.value.logo = logo;
};

// 增加详情内容，跳转装修工具
const addTemplateDetail = () => {
  const routeUrl = router.resolve({
    name: 'decorationTools',
    query: {
      model: 0,
      type: ChannelType.PLATFORM_PRODUCT_DETAIL,
      pro_id: formModel.value.id,
    },
  });
  window.open(routeUrl.href, '_blank');
};
// 编辑详情内容，跳转装修工具
const editTemplateDetail = () => {
  const routeUrl = router.resolve({
    name: 'decorationTools',
    query: {
      model: 0,
      type: ChannelType.PLATFORM_PRODUCT_DETAIL,
      proId: formModel.value.id,
    },
  });
  window.open(routeUrl.href, '_blank');
  // 方案一 使用tab通信发送detail数据
  // setTimeout(() => {
  //   broadcastChannel.postMessage(
  //     JSON.stringify({
  //       name: 'product_detail',
  //       data: formModel.value.detail,
  //     })
  //   );
  // }, 100);
  // 方案二 路由传递商品id，去装修页通过接口重新拉取商品信息，包含detail数据
  // 方案三 路由传递商品id并存本地，去装修页面获取本地存储，包含detai数据
  // const json = localStorage.getItem(`pro_${formModel.value.id}`);
  if (formModel.value.versionType === 1) {
    // 新版的装修信息才会存storage，传给装修工具
    // localStorage.setItem(
    //   `pro_${formModel.value.id}`,
    //   JSON.stringify({ setOk: true, data: formModel.value.detail })
    // );
  }
};

// 删除详情内容
const delTemplateDetail = () => {
  formModel.value.detail = '';
  localStorage.removeItem(`pro_${formModel.value.id}`);
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
  return new Promise<void>((resolve, reject) => {
    const type = file.type as string;
    if (
      !(
        type.endsWith('/jpeg') ||
        type.endsWith('/jpg') ||
        type.endsWith('/png') ||
        type.endsWith('/bmp') ||
        type.endsWith('/gif')
      )
    ) {
      Message.warning(`上传失败，请检查文件类型`);
      reject();
    }
    const over2 = file.size > 1024 * 1024 * 10;
    if (over2) {
      Message.warning(`上传失败，文件大小不要超过10M`);
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

const beforeUpload50 = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    const type = file.type as string;
    if (
      !(
        type.endsWith('/msword') ||
        type.endsWith('.document') ||
        type.endsWith('/pdf')
      )
    ) {
      Message.warning(`上传失败，请检查文件类型`);
      reject();
    }
    const over2 = file.size > 1024 * 1024 * 50;
    if (over2) {
      Message.warning(`上传失败，文件大小不要超过50M`);
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

const beforeRemove50 = (file: any) => {
  return new Promise<void>((resolve, reject) => {
    const flied = file.uid ?? file?.response?.data;
    const aggregate = expList.value.filter((item) => {
      return item.uid !== flied;
    });
    expList.value = aggregate;
    if (file.status === 'done') {
      const index = formModel.value.useExplain.indexOf(flied);
      formModel.value.useExplain.splice(index, 1);
    }
    formRef.value.validateField('useExplain');
    resolve();
  });
};

const getSelectApplication = () => {
  const params = {
    companyId: userInfoByCompany.value?.companyId,
  };
  selectOnlineMallApps(params).then((data: any) => {
    applicationList.value = data.map((item: any) => {
      const params = item;
      params.value = item.id;
      params.label = item.appName;
      return params;
    });
  });
};

const getLocalDetail = () => {
  const json = localStorage.getItem(`pro_${formModel.value.id}`);
  if (json) {
    const { setOk, data } = JSON.parse(json);
    // true:已经配置好了;false:只是草稿
    detailSetOk.value = setOk;
    formModel.value.detail = data ?? '';
    formRef.value.validateField('detail');
  }
};

// const templateChanged = () => {
//   // formModel.value.detail = JSON.stringify(templateRef.value.templateData);
//   // formRef.value.validateField('detail');
// };

const doSave = async () => {
  let res;
  if (step.value === 1) {
    // formModel.value.detail = JSON.stringify(templateRef.value.templateData);
    formModel.value.detailImg = imageList.value.join(',');
    const result = await formRef.value.validate();
    if (result) {
      return false;
    }
    if (props.data?.id) {
      res = await updateGoods1({
        ...formModel.value,
        useExplain: formModel.value.useExplain.join(','),
      });
    } else {
      res = await saveGoods1({
        ...formModel.value,
        useExplain: formModel.value.useExplain.join(','),
      });
    }
  } else {
    const r = await validForm2();
    if (!r) {
      return false;
    }
    res = await saveGoods2(formModel2.value);
  }
  return res;
};

// 取消
const clickCancel = (done: (closed: boolean) => void) => {
  if (step.value === 1) {
    // formModel.value.detail = JSON.stringify(templateRef.value.templateData);
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
    done(false);
  } else {
    visible.value = false;
    emit('cancel');
    done(true);
  }
};

const onBack = (done: (closed: boolean) => void) => {
  // TODO:报错？？？
  clickCancel(done);
};

// 保存
const clickSave = async () => {
  // 此时的保存需要判断详情字段是否配置完成，如果是草稿就不让保存后端，并提示
  // if (!detailSetOk.value && step.value === 1) {
  //   Message.warning('详情未配置发布，配置发布完成可进行商品发布');
  //   return;
  // }
  const res = await doSave();
  if (res) {
    modalJsonString.value = getModalJson();
    Message.success('保存成功');
    needSave = false;
  }
};

// 下一步
const clickNext = async () => {
  // TODO 需要拦截做商品详情的发布后再进行下一步
  if (formModel.value.draftStatus === 0) {
    Message.warning('详情未配置发布，配置发布完成可进行商品发布');
    return;
  }
  formModel.value.detailImg = imageList.value.join(',');
  const result = await formRef.value.validate();
  if (result) {
    return;
  }
  const api = props.data?.id ? updateGoods1 : saveGoods1;
  api({
    ...formModel.value,
    useExplain: formModel.value.useExplain.join(','),
  }).then((res) => {
    if (res) {
      modalJsonString.value = getModalJson();
      step.value = 2;
    }
  });
};

// 上一步
const clickPrevious = () => {
  step.value = 1;
  // nextTick(() => {
  //   templateRef.value.templateData = formModel.value.detail
  //     ? JSON.parse(formModel.value.detail)
  //     : '[]';
  // });
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
  const r = await validForm2();
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

const validate = (ref: any, key: string) => {
  nextTick(() => {
    ref.validateField(key);
  });
};
const validateArray = (ref: any, key: string) => {
  nextTick(() => {
    ref[0].validateField(key);
  });
};

const validateAPT = (isAccount: boolean, index: number) => {
  const m = copyModal.value[index];
  let pass = true;
  for (const p of m.productDeliverySetInfoList) {
    if ((!/^[1-9]\d*$/.test(p.price) || p.price.length > 10) && !isAccount) {
      copyFormRef[index].value[0].setFields({
        productDeliverySetInfoList: {
          status: 'error',
          message: `价格请填写10位以内整数`,
        },
      });
      pass = false;
      break;
    }
    if (
      (!/^[1-9]\d*$/.test(p.accountNum) || p.accountNum.length > 10) &&
      isAccount
    ) {
      copyFormRef[index].value[0].setFields({
        productDeliverySetInfoList: {
          status: 'error',
          message: `账号数量请填写10位以内整数`,
        },
      });
      pass = false;
      break;
    }
  }
  if (pass) {
    copyFormRef[index].value[0].clearValidate();
  }
};

const validateAP = (index: number, key: string) => {
  nextTick(() => {
    validateAPT(key === 'account', index);
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
  broadcastChannel.addEventListener('message', (event) => {
    console.log('返回商品装修信息detail', event.data);
    const { name, status, data } = JSON.parse(event.data);
    if (name === 'product_detail') {
      // getLocalDetail();
      // 新逻辑：保存商品详情，0-装修模块草稿状态保存，1-装修模块正式状态保存
      formModel.value.draftStatus = status;
      formModel.value.draftDetail = data;
      clickSave();
    }
  });

  formModel.value.companyId = String(userInfoByCompany.value?.companyId);
  getClassList();
  getSelectApplication();
  if (props.data?.id) {
    formModel.value.id = props.data?.id;
    formModel2.value.productId = props.data?.id;
    getDetail(props.data?.id);
  } else {
    getGoodsId();
  }
});

onBeforeUnmount(() => {
  broadcastChannel.close();
  localStorage.removeItem(`pro_${formModel.value.id}`);
});
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
    width: 632px;
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
      cursor: pointer;
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
  max-width: 100%;
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

.hint {
  color: #86909c;
  font-size: 12px;
  line-height: 20px;
}

.hint-item {
  margin-top: 2px !important;
  margin-bottom: 14px !important;
}

.templateItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  margin-bottom: 4px;
  padding: 12px 16px;
  color: #4e5969;
  font-size: 12px;
  border: 1px solid #e5e8ef;
  border-radius: 2px;
}

.templateAdd {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: #f6f7fb;
  border: 1px solid #e5e8ef;
  border-radius: 2px;
  cursor: pointer;

  .plusIcon {
    margin-right: 8px;
  }
}

.pic-item {
  margin-bottom: 0 !important;
}

.pic-item2 {
  :deep(.tele-upload-list-item) {
    margin-top: 12px;
  }
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

:deep(.tele-col-5) {
  flex: none;
  width: 100px;
}

:deep(.tele-col-19) {
  flex: 1;
}
</style>
