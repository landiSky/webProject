import $http from '@/utils/http';

// 获取素材库文件列表
export function fetchMaterialList(data: Record<string, any>) {
  return $http.post('/server/web/file/selectPageList', data);
}

// 文件下载
export function fetchDownload(name: string, productId: string) {
  return $http.get(
    `/server/web/file/download?name=${name}&productId=${productId}`
  );
}

// 文件删除
export function fetchFileDel(data: Record<string, any>) {
  return $http.post('/server/web/file/deleteByName', data);
}
