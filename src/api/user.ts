import $http from '@/utils/http';

// 获取用户信息
export function apiUsersInfo() {
  return $http.get('/server/web/user/info');
}
