import $http from '@/utils/http';

// 获取验证码
export function deptList(params: Record<string, any>) {
  return $http.get('/server/web/dept/tree', { params });
}
