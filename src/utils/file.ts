import $http from '@/utils/http';
import { Message } from '@tele-design/web-vue';
import { isObject } from '@/utils/is';
import { h } from 'vue';
import IconUpload from '@tele-design/web-vue/es/icon/icon-upload';
import IconFileAudio from '@tele-design/web-vue/es/icon/icon-file-audio';
import IconClose from '@tele-design/web-vue/es/icon/icon-close';
import IconFaceFrownFill from '@tele-design/web-vue/es/icon/icon-face-frown-fill';
import iconPdf from '@/assets/images/upload-icon/icon-pdf.png';
import iconWord from '@/assets/images/upload-icon/icon-word.png';
import iconZip from '@/assets/images/upload-icon/icon-zip.png';
import iconJar from '@/assets/images/upload-icon/icon-jar.png';
import iconDelete from '@/assets/images/upload-icon/icon-delete.png';

export function downloadFile(url: string, data: any) {
  return new Promise((resolve, reject) => {
    $http
      .post(url, data, {
        customFields: {
          returnRawResponse: true,
        },
        headers: {
          responseType: 'blob', // 必需
        },
      })
      .then((res) => {
        if (isObject(res.data)) {
          const { code, message } = res.data;
          if (code !== 10000) {
            Message.error(`下载异常: ${message}。`);
            reject(message);
            return;
          }
        }

        // 对后端返回的文件流处理，res.data即后端返回的文件流如上图
        const blob = new Blob([res.data]);
        let filename = data.filename || `${new Date().toLocaleDateString()}`;
        try {
          filename = decodeURI(
            res.headers['content-disposition']
              .split(';')[1]
              .split('filename=')[1]
          );
        } catch (e) {
          console.log('downloadFile:', e);
        }

        const url: any = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url.href);
        document.body.removeChild(link);
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const getCustomIcon = () => {
  return {
    retryIcon: () => h(IconUpload),
    cancelIcon: () => h(IconClose),
    fileIcon: (file: any) => {
      const name = file?.name.toLowerCase() as any;
      if (name.endsWith('.pdf')) {
        return h('div', {
          style: `width: 16px;height: 16px;background: url(${iconPdf});background-size: 100% 100%;cursor: pointer;`,
        });
      }
      if (name.endsWith('.doc') || name.endsWith('.docx')) {
        return h('div', {
          style: `width: 16px;height: 16px;background: url(${iconWord});background-size: 100% 100%;cursor: pointer;`,
        });
      }
      if (name.endsWith('.jar')) {
        return h('div', {
          style: `width: 16px;height: 16px;background: url(${iconJar});background-size: 100% 100%;cursor: pointer;`,
        });
      }
      if (
        name.endsWith('.zip') ||
        name.endsWith('.rar') ||
        name.endsWith('.7z')
      ) {
        return h('div', {
          style: `width: 16px;height: 16px;background: url(${iconZip});background-size: 100% 100%;cursor: pointer;`,
        });
      }
      return h(IconFileAudio);
    },
    // removeIcon: () => h(IconClose),
    removeIcon: () =>
      h('div', {
        style: `width: 12px;height: 12px;background: url(${iconDelete});background-size: 100% 100%;cursor: pointer;`,
      }),
    errorIcon: () => h(IconFaceFrownFill),
    fileName: (file: any) => {
      return `${file.name}`;
    },
  };
};
