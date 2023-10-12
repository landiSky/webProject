import $http from '@/utils/http';

// 用户详情
export function apiAccountDetail() {
  return $http.get('/api/v1/account/detail');
}

// 编辑用户信息
export function apiAccountUpdate(data: Record<string, any>) {
  return $http.post('/api/v1/account/update', data);
}

// 修改密码
export function apiChangePwd(data: Record<string, any>) {
  return $http.post('/api/v1/account/changePwd', data);
}

// 获取用户信息
export function apiUsersInfo() {
  return $http.get('/api/v1/users/info');
}
