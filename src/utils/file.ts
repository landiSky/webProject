import $http from '@/utils/http';
import { Message } from '@tele-design/web-vue';
import { isObject } from '@/utils/is';

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
