import $http from '@/utils/http';

// 文件上传
export function fileUpload(data: Record<string, any>) {
  return $http.post('/server/web/file/upload', data);
}

//  文件下载
export function fileDownload(params: Record<string, any>) {
  return $http.get('/server/web/file/download', {
    params,
    // customFields: {
    //     // @ts-ignore
    //     returnRawResponse: true // 业务方直接处理原始 response
    // }
  });
}
