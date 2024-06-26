<template>
  <div id="box" class="box1">
    <div class="certificate-01">
      <img
        class="teleinfo-icon"
        src="@/assets/images/idinside/certificate/teleinfo-icon.png"
        alt=""
      />
      <img
        class="idinside-icon"
        src="@/assets/images/idinside/certificate/idinside-icon.png"
        alt=""
      />
      <!-- <div class="teleinfo-icon"></div>
      <div class="idinside-icon"></div> -->
    </div>
    <div class="certificate-02">
      <div class="title-01">IDInside产品认证证书</div>
      <div class="title-02">证书编号：{{ data?.certificateNum }}</div>
      <img
        class="title-line"
        src="@/assets/images/idinside/certificate/line-icon.png"
        alt=""
      />
    </div>
    <div class="certificate-03">
      <div class="title-03">兹证明：</div>
      <div class="body-title">
        <div class="title-04">{{ data?.companyName }}</div>
        <div class="title-05">
          <div class="title-05-01">{{ data?.name }}</div>
        </div>
      </div>
    </div>
    <div class="certificate-04">
      <div class="explain">
        已完成与工业互联网标识解析体系的集成并通过测试认证，符合IDInside产品认证要求，特发此证。
      </div>
      <div class="certificatetime"> 证书有效期：{{ data?.certValidity }} </div>
      <div class="synopsis">
        本证书不能转让或者授权第三方使用。
        证书有效期内，本证书的有效性依据发证机构的定期监督获得保持。
      </div>
    </div>
    <div class="certificate-05">
      <div class="chairman">董事长：XX</div>
      <div class="seal-bg">
        <img
          class="seal-bg1"
          src="@/assets/images/idinside/certificate/seal-icon.png"
          alt=""
        />
        <div class="mechanism">发证机构：北京泰尔英福科技有限公司</div>
        <div class="grantdate">授予日期：{{ data?.certAuthDate }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, onMounted } from 'vue';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

const emit = defineEmits(['cancel']);

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
});

// 查看证书
const Enable = () => {
  const params = {
    useCORS: true,
    dpi: 500,
    scale: 2, // 放大
  };
  html2canvas(document.getElementById('box') as HTMLElement, params).then(
    (canvas) => {
      // 设置内容的宽高
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      // 设置生成图片的宽高
      const imgCanvasWidth = 592.28;
      const imgCanvasHeight = (592.28 / contentWidth) * contentHeight;
      // console.log(canvas.toDataURL('image/png'));
      const canvasT = canvas.toDataURL('image/png', 1.0);
      const pdf = new JsPDF('p', 'pt', 'a4');
      pdf.addImage(
        canvasT,
        'PNG',
        0,
        0,
        imgCanvasWidth + 2,
        imgCanvasHeight - 276
      );
      const output = pdf.output('bloburl');
      window.open(output);
      emit('cancel');
    }
  );
};
// 下载证书
const download = () => {
  const params = {
    useCORS: true,
    dpi: 500,
    scale: 2, // 放大
  };
  html2canvas(document.getElementById('box') as HTMLElement, params).then(
    (canvas) => {
      // 设置内容的宽高
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      // 设置生成图片的宽高
      const imgCanvasWidth = 592.28;
      const imgCanvasHeight = (592.28 / contentWidth) * contentHeight;
      // console.log(canvas.toDataURL('image/png'));
      const canvasT = canvas.toDataURL('image/png', 1.0);
      const pdf = new JsPDF('p', 'pt', 'a4');
      pdf.addImage(
        canvasT,
        'PNG',
        0,
        0,
        imgCanvasWidth + 2,
        imgCanvasHeight + 17
      );
      pdf.save('IDInside产品认证证书');
      emit('cancel');
    }
  );
};

onMounted(() => {
  download();
  console.log(props.data, '--------');
});
</script>

<style scoped lang="less" scope>
.box1 {
  width: 509px;
  // height: 100%;
  height: 707px;
  margin: 0 auto;
  padding: 57px 74px 0;
  background-image: url(@/assets/images/idinside/certificate/certificate-bg.png);
  background-size: 100% 100%;

  .certificate-01 {
    display: flex;
    gap: 14px;
    align-items: center;

    .teleinfo-icon {
      width: 84px;
      height: 28px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .idinside-icon {
      width: 41px;
      height: 41px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .certificate-02 {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    width: 100%;
    margin-top: 22px;

    .title-01 {
      color: rgba(32, 83, 140, 1);
      font-weight: 500;
      font-size: 30px;
      font-family: PingFang SC;
      line-height: 38px;
      text-align: left;
    }

    .title-02 {
      color: rgba(32, 83, 140, 1);
      font-weight: 400;
      font-size: 13px;
      font-family: PingFang SC;
      line-height: 22px;
      text-align: left;
    }

    .title-line {
      width: 345px;
      height: 33px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .certificate-03 {
    display: flex;
    flex-direction: column;
    margin-top: 20px;

    .title-03 {
      color: rgba(29, 33, 41, 1);
      font-weight: 500;
      font-size: 16px;
      font-family: PingFang SC;
      line-height: 24px;
      text-align: left;
    }

    .body-title {
      .title-04 {
        margin-top: 20px;
        color: rgba(29, 33, 41, 1);
        font-weight: 500;
        font-size: 20px;
        font-family: PingFang SC;
        line-height: 28px;
        text-align: center;
      }

      .title-05 {
        display: flex;
        justify-content: center;

        .title-05-01 {
          display: inline;
          margin-top: 10px;
          color: rgba(29, 33, 41, 1);
          font-weight: 400;
          font-size: 16px;
          font-family: PingFang SC;
          line-height: 24px;
          text-align: center;
          border-bottom: 1px solid rgba(134, 144, 156, 1);
        }
      }
    }
  }

  .certificate-04 {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 30px;

    .explain {
      color: rgba(29, 33, 41, 1);
      font-weight: 400;
      font-size: 12px;
      font-family: PingFang SC;
      line-height: 20px;
      text-align: left;
    }

    .certificatetime {
      color: rgba(29, 33, 41, 1);
      font-weight: 500;
      font-size: 14px;
      font-family: PingFang SC;
      line-height: 22px;
      text-align: left;
    }

    .synopsis {
      color: rgba(29, 33, 41, 1);
      font-weight: 400;
      font-size: 12px;
      font-family: PingFang SC;
      line-height: 20px;
      text-align: left;
    }
  }

  .certificate-05 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 21px;

    .chairman {
      color: rgba(29, 33, 41, 1);
      font-weight: 400;
      font-size: 12px;
      font-family: PingFang SC;
      line-height: 20px;
      text-align: left;
    }

    .seal-bg {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      justify-content: center;
      width: 204px;
      height: 117px;

      .seal-bg1 {
        position: absolute;
        top: 5px;
        width: 117px;
        height: 117px;
        opacity: 0.8;
      }

      .mechanism {
        color: rgba(29, 33, 41, 1);
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 18px;
        text-align: left;
      }

      .grantdate {
        color: rgba(29, 33, 41, 1);
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 18px;
        text-align: left;
      }
    }
  }
}
</style>
