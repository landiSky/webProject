<template>
  <t-modal
    v-model:visible="showModal"
    :width="820"
    :height="642"
    :title="props.title"
    :ok-loading="props.confirmLoading"
    ok-text="创建"
    @ok="onOk"
    @cancel="onCancel"
  >
    <div class="icon-group-content">
      <div class="left-section">
        <div ref="previweRef" class="preview-box">
          <img
            :src="state.isShowUpload ? state.imgUrl : state.bgPath"
            class="icon-park-bg"
          />
          <iconpark-icon
            v-if="!state.isShowUpload"
            :name="state.iconPath"
            :size="72"
            class="icon-park-img"
          />
        </div>

        <t-upload
          ref="uploadRef"
          class="upload-operation"
          action="/"
          accept=".jpg,.png,.bmp,.jpeg,.gif"
          :auto-upload="false"
          :show-file-list="false"
          :image-preview="false"
          :file-list="state.fileList"
          @change="onUploadChange"
          @before-upload="onBeforeUpload"
        >
          <template #upload-button>
            <t-space>
              <t-button>上传图标</t-button>
            </t-space>
          </template>
        </t-upload>
      </div>

      <div class="right-section">
        <div
          v-for="item in iconGroupList"
          :key="item.type"
          class="right-content"
        >
          <span class="sub-title">{{ item.subtitle }}</span>
          <div class="icon-group">
            <div
              v-for="(path, idx) in item.pathList"
              :key="path"
              class="list-item"
              :class="`${item.className} ${
                item.active[idx] ? 'is-active' : ''
              }`"
              @click="onIconClick(item, path, idx)"
            >
              <img v-if="item.type === 'bg'" :src="path" alt="" />
              <iconpark-icon
                v-else
                :name="path"
                :size="item.size"
                class="icon-park"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineProps, computed, reactive, ref, defineEmits } from 'vue';
import { FileItem, Message } from '@tele-design/web-vue';
import $http from '@/utils/http';
import html2canvas from 'html2canvas';
import bg1 from '../../../assets/images/icongroup/bg1.png';
import bg2 from '../../../assets/images/icongroup/bg2.png';
import bg3 from '../../../assets/images/icongroup/bg3.png';
import bg4 from '../../../assets/images/icongroup/bg4.png';
import bg5 from '../../../assets/images/icongroup/bg5.png';
import bg6 from '../../../assets/images/icongroup/bg6.png';
import bg7 from '../../../assets/images/icongroup/bg7.png';
import bg8 from '../../../assets/images/icongroup/bg8.png';
import bg9 from '../../../assets/images/icongroup/bg9.png';
import bg10 from '../../../assets/images/icongroup/bg10.png';
import bg11 from '../../../assets/images/icongroup/bg11.png';
import bg12 from '../../../assets/images/icongroup/bg12.png';
import bg13 from '../../../assets/images/icongroup/bg13.png';
import bg14 from '../../../assets/images/icongroup/bg14.png';
import bg15 from '../../../assets/images/icongroup/bg15.png';
import bg16 from '../../../assets/images/icongroup/bg16.png';

// const isActive = ref(false);

const previweRef = ref();

const iconGroupList = ref([
  {
    type: 'bg',
    subtitle: '选择背景色',
    size: 48,
    className: 'bg-item',
    active: [true],
    pathList: [
      bg1,
      bg2,
      bg3,
      bg4,
      bg5,
      bg6,
      bg7,
      bg8,
      bg9,
      bg10,
      bg11,
      bg12,
      bg13,
      bg14,
      bg15,
      bg16,
    ],
  },
  {
    type: 'icon',
    subtitle: '选择图标',
    size: 24,
    className: 'icon-item',
    active: [true],
    pathList: [
      'i1',
      'i2',
      'i3',
      'i4',
      'i5',
      'i6',
      'i7',
      'i8',
      'i9',
      'i10',
      'i11',
      'i12',
      'i13',
      'i14',
    ],
  },
]);

const emits = defineEmits(['onConfirm', 'onCancel']);

const props = defineProps({
  visible: Boolean,
  confirmLoading: Boolean,
  title: String,
  pictureWidth: Number,
  pictureHeight: Number,
});

const state = reactive<{
  bgPath: string;
  iconPath: string;
  fileList: Record<string, any>;
  isShowUpload: boolean;
  imgUrl: string | undefined;
  fileData: FileItem | any;
}>({
  bgPath: bg1,
  iconPath: 'i1',
  fileList: [],
  isShowUpload: false,
  imgUrl: '',
  fileData: {},
});

const showModal = computed(() => props.visible);

const onIconClick = (item: any, name: string, idx: number) => {
  item.active = Array.from({ length: item.pathList.length }, () => false);
  item.active[idx] = true;
  state[item.type === 'bg' ? 'bgPath' : 'iconPath'] = name;
  state.isShowUpload = false;
};

const validateImageSize = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      // eslint-disable-next-line func-names
      image.onload = function () {
        const { width, height } = this as any;
        if (width === props?.pictureWidth && height === props?.pictureHeight) {
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

const onBeforeUpload = async (currentFile: Record<string, any>) => {
  const limitSize = await validateImageSize(currentFile);
  return new Promise((resolve, reject) => {
    if (currentFile.size > 10 * 1024 * 1024) {
      Message.error(`上传失败，文件大小不要超过10M`);
      reject();
    } else if (!limitSize) {
      Message.error(
        `上传尺寸要求${props?.pictureWidth}X${props?.pictureHeight}，否则影响展示效果`
      );
      reject();
    } else {
      resolve(true);
    }
  });
};

const onUploadChange = (fileList: FileList, fileItem: FileItem) => {
  console.log('onUploadChange', fileList, fileItem);
  // 这里需要判断是成功状态
  state.imgUrl = fileItem.url;
  state.fileData = fileItem;
  state.isShowUpload = true;
  // 重置
  // iconGroupList.value.forEach((item) => {
  //   item.active = [true];
  // });
  // state.bgPath = bg1;
  // state.iconPath = 'i1';
};
const uploadRequest = (formData: any) => {
  return new Promise((resolve, reject) => {
    $http
      .post('/server/web/file/upload', formData, {})
      .then((res) => {
        // 在这里将最终值传递
        emits('onConfirm', res);
        Message.success('上传成功');
        resolve(true);
      })
      .catch((e) => {
        Message.error(e.message);
        reject();
      });
  });
};

// 将svg和img合成一张图片
const mergeImages = async () => {
  html2canvas(previweRef.value).then((canvas) => {
    // 将 canvas 转换为图片
    canvas.toBlob((blob) => {
      // 创建 File 对象
      if (blob !== null) {
        const file = new File([blob], 'merImage.png', { type: 'image/png' });
        // 可以在这里使用 file 对象，例如上传
        const formData = new FormData();
        formData.append('file', file);
        uploadRequest(formData);
      } else {
        Message.error('格式错误');
      }
    });
  });
};

const onOk = async () => {
  console.log('onOk');
  const res = '';
  // 点击创建之后将svg和img合成为一张图片并且上传到服务器，前提需要判断是正常上传还是拼接上传
  if (state.isShowUpload) {
    const formData = new FormData();
    const files = state.fileData;
    console.log('file', files, files.file);
    formData.append('file', files.file || {});
    uploadRequest(formData);
  } else {
    mergeImages();
  }
  // 创建之后将res传到前台
  console.log('onok', res);
  return res;
};

const onCancel = () => {
  emits('onCancel');
};
</script>

<style scoped lang="less">
.icon-group-content {
  display: flex;

  .left-section {
    flex: 1;
    margin-right: 16px;
    text-align: center;

    .tele-upload-wrapper {
      text-align: center;

      .tele-btn {
        border-radius: 2px;
      }
    }

    .preview-box {
      position: relative;
      width: 144px;
      height: 144px;
      margin-bottom: 16px;
      overflow: hidden;

      .icon-park-bg {
        width: 144px;
        height: 144px;
      }

      .icon-park-img {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 99;
        transform: translate(-50%, -50%);
      }
    }
  }

  .right-section {
    width: 620px;
    padding-bottom: 32px;
    background: #f8f8f8;

    .right-content {
      padding-top: 24px;
    }

    .icon-group {
      padding: 0 34px;
    }

    .sub-title {
      display: inline-block;
      margin-bottom: 20px;
      margin-left: 24px;
      color: #1d2129;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
    }

    .list-item {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 48px;
      margin-right: 24px;
      margin-bottom: 20px;
      vertical-align: top;
      // overflow: hidden;
      .icon-park {
        vertical-align: bottom;
      }

      img {
        width: 48px;
        height: 48px;
        border: 2px solid transparent;
      }

      &:nth-child(8n) {
        margin-right: 0;
      }

      &:nth-child(-n + 8) {
        margin-bottom: 30px;
      }

      &.is-active {
        img {
          display: block;
          border: 2px solid #1664ff;
          border-radius: 8px;
        }
      }
    }

    .icon-item {
      position: relative;
      background: #bbbfc5;
      border-radius: 10px;

      .icon-park {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &.is-active {
        border: 2px solid #1664ff;
        border-radius: 8px;
      }
    }
  }
}
</style>
