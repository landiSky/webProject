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
                          @click="onUploadDelete"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <IconMaterial v-else @on-confirm="finishedUploadLogo" />
            </div>
          </t-form-item>
          <t-form-item label="" field="" class="hint-item">
            <div class="hint"
              >支持jpg、jpeg、png、bmp、gif文件格式，文件大小限制10M以内。</div
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
              show-word-limit
              :auto-size="{
                minRows: 9,
                maxRows: 9,
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
            <!-- 用draftStauts来判断是否装修过 -->
            <div
              v-if="
                formModel.draftStatus !== null &&
                (formModel.detail || formModel.draftDetail)
              "
              class="templateItem"
            >
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
                  v-if="formModel2.deliveryType == deliveryTypeMap.Deploy"
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
                  v-if="formModel2.deliveryType == deliveryTypeMap.Deploy"
                  :value="priceTypeList[1].value"
                >
                  {{ priceTypeList[1].label }}
                  <t-tooltip content="可使用账号数量及可使用时间均不受限">
                    <icon-question-circle style="color: #86909c" :size="12" />
                  </t-tooltip>
                </t-radio>
                <t-radio
                  v-if="formModel2.deliveryType == deliveryTypeMap.Deploy"
                  :value="priceTypeList[2].value"
                >
                  {{ priceTypeList[2].label }}
                </t-radio>
                <t-radio
                  v-if="
                    formModel2.deliveryType == deliveryTypeMap.SaaS ||
                    formModel2.deliveryType == deliveryTypeMap.LightApp ||
                    formModel2.deliveryType == deliveryTypeMap.PluginClass
                  "
                  :value="priceTypeList[3].value"
                >
                  {{ priceTypeList[3].label }}
                  <t-tooltip
                    content="用户不付款即可安装使用应用。你可以在应用内限制免费版所享有的功能权益"
                  >
                    <icon-question-circle style="color: #86909c" :size="12" />
                  </t-tooltip>
                </t-radio>
                <t-radio
                  v-if="
                    formModel2.deliveryType !== deliveryTypeMap.SaaS &&
                    formModel2.deliveryType !== deliveryTypeMap.Deploy
                  "
                  :value="priceTypeList[4].value"
                >
                  {{ priceTypeList[4].label }}
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
              label-align="left"
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
                v-if="formModel2.deliveryType == deliveryTypeMap.SaaS"
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
        <div
          v-if="
            formModel2.deliveryType == deliveryTypeMap.Deploy &&
            formModel2.saleType == priceTypeList[1].value
          "
        >
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
              label-align="left"
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
                v-if="formModel2.deliveryType == deliveryTypeMap.SaaS"
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
              label-align="left"
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
        <div v-if="formModel2.deliveryType == deliveryTypeMap.SaaS">
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
              label-align="left"
              auto-label-width
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
        <div
          v-if="
            formModel2.deliveryType == deliveryTypeMap.LightApp ||
            formModel2.deliveryType == deliveryTypeMap.PluginClass
          "
        >
          <div
            v-for="(c, index) of changeModel(formModel2.saleType)"
            :key="index"
            class="sale-copy"
          >
            <div class="body-title">
              <div class="body-title-left">
                <div class="body-title-icon" />
                <div>交付版本{{ index + 1 }}</div>
              </div>
              <div
                v-if="changeModel(formModel2.saleType).length > 1"
                class="body-title-right"
                @click="deleteSaleCopy(index)"
                >删除</div
              >
            </div>
            <t-form
              :ref="copyFormRef[index]"
              :model="changeModel(formModel2.saleType)[index]"
              :rules="copyRules"
              label-align="left"
              auto-label-width
            >
              <t-form-item label="交付版本名称" class="sale-item" field="name">
                <t-input
                  v-model.trim="changeModel(formModel2.saleType)[index].name"
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
                v-if="formModel2.deliveryType == deliveryTypeMap.LightApp"
                label="请选择应用包ID"
                field="appPackageId"
              >
                <t-select
                  v-model="changeModel(formModel2.saleType)[index].appPackageId"
                  :style="{ width: '100%' }"
                  placeholder="请选择"
                  :show-extra-options="false"
                >
                  <t-option
                    v-for="item in productAppList"
                    :key="item.tagId"
                    :value="item.tagId"
                  >
                    {{ item.tagName }}
                  </t-option>
                </t-select>
              </t-form-item>
              <t-form-item
                v-if="
                  formModel2.deliveryType == deliveryTypeMap.PluginClass &&
                  formModel2.saleType == priceTypeList[1].value
                "
                label="上传插件jar包"
                field="pluginPackage"
              >
                <JarUpload
                  v-model:pluginPackage="
                    changeModel(formModel2.saleType)[index].pluginPackage
                  "
                  :plugin-package-list="
                    changeModel(formModel2.saleType)[index].pluginPackageList
                  "
                />
              </t-form-item>
              <t-form-item
                v-if="
                  formModel2.deliveryType == deliveryTypeMap.PluginClass &&
                  formModel2.saleType == priceTypeList[3].value
                "
                label="上传插件jar包"
                field="pluginPackage"
              >
                <JarUpload
                  v-model:pluginPackage="
                    changeModel(formModel2.saleType)[index].pluginPackage
                  "
                  :plugin-package-list="
                    changeModel(formModel2.saleType)[index].pluginPackageList
                  "
                />
              </t-form-item>
              <t-form-item
                v-if="formModel2.saleType == priceTypeList[4].value"
                label="模版售价"
                field="onePiece"
                :rules="[{ required: true, validator: validatorOnePiece }]"
              >
                <t-input
                  v-model.trim="
                    changeModel(formModel2.saleType)[index].onePiece
                  "
                  placeholder="请输入"
                  style="width: 200px"
                  @input="validateArray(copyFormRef[index].value, 'onePiece')"
                  ><template #suffix><div class="yuan">元</div></template>
                </t-input>
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
  getProductAppList,
} from '@/api/goods-manage';
import { getServicePackage, userAuthStatus } from '@/api/buyer/overview';
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import router from '@/router';
import { ChannelType } from '@/enums/decoration';
import { channelName } from '@/views/decoration/decorationTools/constant';
// import TemplateDrawer from './template.vue';
import IconMaterial from '@/components/iconMaterial/index.vue';
import JarUpload from './jar-upload/index.vue';

const broadcastChannel = new BroadcastChannel(channelName);
const emit = defineEmits(['cancel', 'preview']);

let needSave = false;
const userStore = useUserStore();
const { userInfoByCompany, configInfo, selectCompany }: Record<string, any> =
  storeToRefs(userStore);

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
// 套餐包集合 用来判断是否服务到期 0 是没到期，3是到期
const packageTimeLimit = ref(1);
// 判断这个用户是否授权
const showService: Record<string, any> = ref(false);

// 轻应用
const productAppList = ref<any[]>([]);

// 详情
const detailImageRef = ref();
const imageList = ref<string[]>([]);

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

const deliveryTypeMap = {
  SaaS: 0, // SaaS类
  Deploy: 1, // 独立部署类
  LightApp: 2, // 标识轻应用
  PluginClass: 3, // 插件
};
const deliveryTypeList = computed(() => {
  const data = [
    { label: 'SaaS类', value: deliveryTypeMap.SaaS },
    { label: '独立部署类', value: deliveryTypeMap.Deploy },
    { label: '插件', value: deliveryTypeMap.PluginClass },
  ];
  if (
    configInfo.value?.qingFlowSwitch &&
    !packageTimeLimit.value &&
    showService.value
  ) {
    const app = { label: '标识轻应用', value: deliveryTypeMap.LightApp };
    data.splice(2, 0, app);
  }
  return data;
});
const priceTypeList = ref([
  { label: '套餐定价(账号+时长)', value: 0 },
  { label: '一口价定价', value: 1 },
  { label: '价格面议', value: 2 },
  { label: '免费', value: 3 },
  { label: '一口价定价', value: 1 },
]);

const isTryList = ref([
  { label: '是', value: 1 },
  { label: '否', value: 0 },
]);

const formModel2 = ref({
  productId: undefined,
  deliveryType: deliveryTypeMap.SaaS,
  saleType: 3,
  productDeliveryList: [] as any,
});

const validatorOnePiece = (value: any, cb: (params?: any) => void) => {
  if ((!value && value !== 0) || value.length === 0)
    return cb('请输入模版售价');
  if (value > 100000000) {
    return cb('最大可输入100000000元');
  }
  if (!/^[1-9]\d*$/.test(value) || value.length > 9)
    return cb('模版售价请填写9位以内整数');
  return cb();
};
const formRules = {
  name: [
    { required: true, message: '请输入商品名称' },
    { maxLength: 20, message: '最多允许输入20个字符' },
  ],
  logo: [
    {
      required: true,
      // message: '请上传logo图',
      validator: (value: string, callback: (error?: string) => void) => {
        if (!value) {
          callback('请上传logo图');
        } else {
          callback('');
        }
      },
    },
  ],
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
      required: false,
      validator: (value: string, cb: (params?: any) => void) => {
        console.log(value.length);
        // if (value.length === 0) return cb('请上传产品使用说明');
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
        if (
          (!value || value === '[]') &&
          (!formModel.value.draftDetail || formModel.value.draftDetail === '[]')
        ) {
          return cb('请添加详情模块');
        }
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
const copyModal5 = ref<any[]>([
  {
    name: '',
    productDeliverySetInfoList: [{ price: null }],
    appPackageId: '',
    pluginPackage: '',
    pluginPackageList: [],
    onePiece: null,
    isTry: 0,
  },
]);

const copyModal6 = ref<any[]>([
  {
    name: '',
    productDeliverySetInfoList: [{ price: null }],
    appPackageId: '',
    pluginPackage: '',
    pluginPackageList: [],
    onePiece: null,
    isTry: 0,
  },
]);

const copyModal7 = ref<any[]>([
  {
    name: '',
    productDeliverySetInfoList: [{ price: null }],
    appPackageId: '',
    pluginPackage: '',
    pluginPackageList: [],
    onePiece: null,
    isTry: 0,
  },
]);

const copyModal8 = ref<any[]>([
  {
    name: '',
    productDeliverySetInfoList: [{ price: null }],
    appPackageId: '',
    pluginPackage: '',
    pluginPackageList: [],
    onePiece: null,
    isTry: 0,
  },
]);

// 服务交付方式change事件
const radiogroupChange = (c: any) => {
  if (c === 0) {
    formModel2.value.saleType = 3;
  } else if (c === 1) {
    formModel2.value.saleType = 0;
  } else if (c === 2) {
    formModel2.value.saleType = 3;
  } else if (c === 3) {
    formModel2.value.saleType = 3;
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
    if (formModel2.value.deliveryType === deliveryTypeMap.Deploy) {
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
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
      copyModal6.value.push({
        name: '',
        productDeliverySetInfoList: [{ price: null }],
        appPackageId: '',
        pluginPackage: '',
        pluginPackageList: [],
        onePiece: null,
        isTry: 0,
      });
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
      copyModal8.value.push({
        name: '',
        productDeliverySetInfoList: [{ price: null }],
        appPackageId: '',
        pluginPackage: '',
        pluginPackageList: [],
        onePiece: null,
        isTry: 0,
      });
    }
  } else if (formModel2.value.saleType === 3) {
    if (formModel2.value.deliveryType === deliveryTypeMap.SaaS) {
      copyModal4.value.push({
        name: '',
        saasAppId: '',
      });
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
      copyModal5.value.push({
        name: '',
        productDeliverySetInfoList: [{ price: null }],
        appPackageId: '',
        pluginPackage: '',
        pluginPackageList: [],
        onePiece: null,
        isTry: 0,
      });
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
      copyModal7.value.push({
        name: '',
        productDeliverySetInfoList: [{ price: null }],
        appPackageId: '',
        pluginPackage: '',
        pluginPackageList: [],
        onePiece: null,
        isTry: 0,
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
};
const deleteSaleCopy = (index: number) => {
  if (formModel2.value.saleType === 0) {
    copyModal.value.splice(index, 1);
  } else if (formModel2.value.saleType === 1) {
    if (formModel2.value.deliveryType === deliveryTypeMap.Deploy) {
      copyModal2.value.splice(index, 1);
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
      copyModal6.value.splice(index, 1);
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
      copyModal8.value.splice(index, 1);
    }
  } else if (formModel2.value.saleType === 3) {
    if (formModel2.value.deliveryType === deliveryTypeMap.SaaS) {
      copyModal4.value.splice(index, 1);
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
      copyModal5.value.splice(index, 1);
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
      copyModal7.value.splice(index, 1);
    }
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
  appPackageId: [{ required: true, message: '请选择应用包ID' }],
  pluginPackage: [{ required: true, message: '请上传插件jar包' }],
  onePiece: [
    {
      required: true,
      validator: (value: any, cb: (params?: any) => void) => {
        if ((!value && value !== 0) || value.length === 0)
          return cb('请输入一口价金额');
        if (!/^[0-9]\d*$/.test(value) || value.length > 10)
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

const onUploadDelete = () => {
  formModel.value.logo = '';
  formRef.value.validateField('logo');
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

const getProductApplicationList = async () => {
  const params = {
    companyId: userInfoByCompany.value?.companyId,
  };
  const dataList = await getServicePackage(params);
  packageTimeLimit.value = dataList.length;
  const userData = {
    companyId: selectCompany.value?.companyId,
    memberId: selectCompany.value?.memberId,
  };
  const data = await userAuthStatus(userData);
  showService.value = data;
  if (!configInfo.value?.qingFlowSwitch || dataList.length) {
    return;
  }
  const ProductAppData = {
    companyId: userInfoByCompany.value?.companyId,
    type: 1, // 0 是全部 其他值是返回不是空的应用宝
  };
  const AppList = await getProductAppList(ProductAppData);
  const list = AppList.map((item: any) => {
    const params = {
      ...item,
      tagId: String(item.tagId),
    };
    return params;
  });
  productAppList.value = list;
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
    if (formModel2.value.deliveryType === deliveryTypeMap.Deploy) {
      return copyModal2.value.length < 3;
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
      return copyModal6.value.length < 3;
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
      return copyModal8.value.length < 1;
    }
  }
  if (formModel2.value.saleType === 3) {
    if (formModel2.value.deliveryType === deliveryTypeMap.SaaS) {
      return copyModal4.value.length < 3;
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
      return copyModal5.value.length < 3;
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
      return copyModal7.value.length < 1;
    }
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
  let tempList;
  if (formModel2.value.saleType === 0) {
    modalList = copyModal.value;
  } else if (formModel2.value.saleType === 1) {
    if (formModel2.value.deliveryType === deliveryTypeMap.Deploy) {
      tempList = deepClone(copyModal2.value);
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
      tempList = deepClone(copyModal6.value);
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
      tempList = deepClone(copyModal8.value);
    }
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
    if (formModel2.value.deliveryType === deliveryTypeMap.SaaS) {
      modalList = copyModal4.value;
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
      modalList = copyModal5.value;
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
      modalList = copyModal7.value;
    }
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
    if (formModel2.value.deliveryType === deliveryTypeMap.Deploy) {
      length = copyModal2.value.length;
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
      length = copyModal6.value.length;
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
      length = copyModal8.value.length;
    }
  } else if (formModel2.value.saleType === 3) {
    if (formModel2.value.deliveryType === deliveryTypeMap.SaaS) {
      length = copyModal4.value.length;
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
      length = copyModal5.value.length;
    }
    if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
      length = copyModal7.value.length;
    }
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
    JSON.stringify(copyModal4.value) +
    JSON.stringify(copyModal5.value) +
    JSON.stringify(copyModal6.value) +
    JSON.stringify(copyModal7.value) +
    JSON.stringify(copyModal8.value)
  );
};

const getDetail = (id: any) => {
  goodsDetail(id).then((res) => {
    const useExplainList =
      res?.useExplainMap.map((item: any) => {
        return item.useExplain;
      }) || [];
    localStorage.setItem('goodsDetail', JSON.stringify(res));
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
    formModel2.value.deliveryType = res.deliveryType ?? deliveryTypeMap.SaaS;
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
      if (formModel2.value.deliveryType === deliveryTypeMap.Deploy) {
        copyModal2.value = [];
      }
      if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
        copyModal6.value = [];
      }
      if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
        copyModal8.value = [];
      }
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
          if (formModel2.value.deliveryType === deliveryTypeMap.Deploy) {
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
          if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
            const appPackageIdCheck = productAppList.value.some(
              (itemT: any) => {
                return itemT.tagId === one.appPackageId;
              }
            );
            copyModal6.value.push({
              name: one.name,
              productDeliverySetInfoList: list1,
              appPackageId: appPackageIdCheck ? one.appPackageId : '',
              onePiece,
              isTry: 0,
            });
          }
          if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
            copyModal8.value.push({
              name: one.name,
              productDeliverySetInfoList: list1,
              pluginPackage: one.pluginPackage,
              pluginPackageList: [
                {
                  uid: one.pluginPackage,
                  name: one.pluginPackageSource,
                  status: 'done',
                },
              ],
              onePiece,
              isTry: 0,
            });
          }
        }
      } else {
        if (formModel2.value.deliveryType === deliveryTypeMap.Deploy) {
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
        if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
          copyModal6.value.push({
            name: '',
            productDeliverySetInfoList: [{ price: '' }],
            appPackageId: '',
            onePiece: null,
            isTry: 0,
          });
        }
        if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
          copyModal8.value.push({
            name: '',
            productDeliverySetInfoList: [{ price: '' }],
            pluginPackage: '',
            pluginPackageList: [],
            onePiece: null,
            isTry: 0,
          });
        }
      }
    } else if (formModel2.value.saleType === 3) {
      if (formModel2.value.deliveryType === deliveryTypeMap.SaaS) {
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
      }
      if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
        copyModal5.value = [];
        const list = res.productDeliverySetList;
        if (list && list.length > 0) {
          for (const one of list) {
            const appPackageIdCheck = productAppList.value.some(
              (itemT: any) => {
                return itemT.tagId === one.appPackageId;
              }
            );
            copyModal5.value.push({
              name: one.name,
              appPackageId: appPackageIdCheck ? one.appPackageId : '',
              productDeliverySetInfoList: [{ price: '' }],
              onePiece: one.onePiece,
              isTry: 0,
            });
          }
        } else {
          copyModal5.value.push({
            name: '',
            appPackageId: '',
            productDeliverySetInfoList: [{ price: '' }],
            onePiece: null,
            isTry: 0,
          });
        }
      }
      if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
        copyModal7.value = [];
        const list = res.productDeliverySetList;
        if (list && list.length > 0) {
          for (const one of list) {
            copyModal7.value.push({
              name: one.name,
              pluginPackage: one.pluginPackage,
              pluginPackageList: [
                {
                  uid: one.pluginPackage,
                  name: one.pluginPackageSource,
                  status: 'done',
                },
              ],
              productDeliverySetInfoList: [{ price: '' }],
              onePiece: one.onePiece,
              isTry: 0,
            });
          }
        } else {
          copyModal7.value.push({
            name: '',
            pluginPackage: '',
            pluginPackageList: [],
            productDeliverySetInfoList: [{ price: '' }],
            onePiece: null,
            isTry: 0,
          });
        }
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
  formRef.value.validateField('logo');
};

// 增加详情内容，跳转装修工具
const addTemplateDetail = () => {
  const routeUrl = router.resolve({
    name: 'decorationTools',
    query: {
      model: 0,
      type: ChannelType.PLATFORM_PRODUCT_DETAIL,
      // proId: formModel.value.id,
    },
  });
  window.open(routeUrl.href, '_blank');
};
// 编辑详情内容，跳转装修工具
const editTemplateDetail = () => {
  // 再次编辑
  const goodsDetail = {
    ...JSON.parse(localStorage.getItem('goodsDetail') || '{}'),
    detail: formModel.value.detail,
    draftDetail: formModel.value.draftDetail,
    draftStatus: formModel.value.draftStatus,
    // versionType: 1  // 第一次装修还没有保存versiontype是0怎么搞？？？再次编辑都是强制走装修， 老版本装修和新版本装修有什么区别？
  };
  localStorage.setItem('goodsDetail', JSON.stringify(goodsDetail));
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
  formModel.value.draftDetail = '';
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

// const templateChanged = () => {
//   // formModel.value.detail = JSON.stringify(templateRef.value.templateData);
//   // formRef.value.validateField('detail');
// };

const doSave = async () => {
  let res;
  let err;
  if (step.value === 1) {
    formModel.value.detailImg = imageList.value.join(',');
    // 老版本保存校验做兼容
    if (formModel.value.draftStatus === null) {
      formModel.value.detail = '';
      formModel.value.draftDetail = '';
    }
    const result = await formRef.value.validate();
    // 保存操作

    if (result) {
      // 发消息给装修index页面，通知其保存商品详情失败
      // formModel.value.detail = '';
      // broadcastChannel.postMessage(
      //   JSON.stringify({
      //     name: 'product_detail_save',
      //     status: false,
      //     msg: '商品基础信息填写不完整，请检查',
      //   })
      // );
      return false;
    }
    if (props.data?.id) {
      res = await updateGoods1({
        ...formModel.value,
        useExplain: formModel.value.useExplain.join(','),
      }).catch((e) => {
        err = e.message;
      });
    } else {
      res = await saveGoods1({
        ...formModel.value,
        useExplain: formModel.value.useExplain.join(','),
      }).catch((e) => {
        err = e.message;
      });
    }
    // const msg = formModel.value.draftStatus ? '发布成功' : '保存成功';
    // broadcastChannel.postMessage(
    //   JSON.stringify({
    //     name: 'product_detail_save',
    //     status: !!res,
    //     msg: res ? msg : err ?? '保存失败',
    //   })
    // );
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
    Message.warning('详情未配置发布，配置发布完成可进行下一步');
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
            emit('preview', {
              id: formModel.value.id,
              deliveryType: formModel2.value.deliveryType,
            });
          }
        } else {
          Message.error('信息暂时无法保存');
        }
      },
    });
    return;
  }
  if (formModel.value.id) {
    emit('preview', {
      id: formModel.value.id,
      deliveryType: formModel2.value.deliveryType,
    });
  }
};

// 上架
const clickUp = async () => {
  console.log(formModel2.value, 'formModel2.value');
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

const changeModel = (type: any) => {
  if (formModel2.value.deliveryType === deliveryTypeMap.LightApp) {
    if (type === 3) {
      return copyModal5.value;
    }
    if (type === 1) {
      return copyModal6.value;
    }
  }
  if (formModel2.value.deliveryType === deliveryTypeMap.PluginClass) {
    if (type === 3) {
      return copyModal7.value;
    }
    if (type === 1) {
      return copyModal8.value;
    }
  }
  return copyModal5.value;
};

onMounted(async () => {
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
      // 新逻辑：保存商品详情，0-装修模块草稿状态保存，1-装修模块正式状态保存
      formModel.value.draftStatus = status;

      if (status) {
        formModel.value.detail = data;
      } else {
        formModel.value.draftDetail = data;
        // if (!formModel.value.detail) {
        //   broadcastChannel.postMessage(
        //     JSON.stringify({
        //       name: 'product_detail_save',
        //       status: false,
        //       msg: '创建商品时需要先发布详情模块',
        //     })
        //   );
        //   return;
        // }
      }
      console.log('formModal value', formModel.value);
      // 单纯走装修保存发布不需要校验，不需要走后端接口, 只更改装修状态
      formRef.value.clearValidate('detail');
      broadcastChannel.postMessage(
        JSON.stringify({
          name: 'product_detail_save',
          status: true,
          msg: status ? '发布成功' : '保存成功',
        })
      );

      // clickSave();
    }
  });

  formModel.value.companyId = String(userInfoByCompany.value?.companyId);
  await Promise.all([
    getClassList(),
    getProductApplicationList(),
    getSelectApplication(),
  ]);
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
