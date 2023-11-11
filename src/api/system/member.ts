import $http from '@/utils/http';

// 成员列表
export function memberList(data: Record<string, any>) {
  return $http.post('/server/web/member/list', data);
}

//  查找手机号是否注册
export function memberPhone(params: Record<string, any>) {
  return $http.get('/server/web/member/getPhone', {
    params,
    customFields: {
      // @ts-ignore
      returnRawResponse: true, // 业务方直接处理原始 response
    },
  });
}

// 添加成员 修改
export function menberAdd(data: Record<string, any>) {
  return $http.post('/server/web/member/saveOrUpdate', data);
}
// 离职成员
export function menberResign(data: Record<string, any>) {
  return $http.post(
    `/server/web/member/resign?memberId=${data.memberId}`,
    data
  );
}

// 查找管理员信息
export function menberGetadmin(params: Record<string, any>) {
  return $http.get('/server/web/member/getAdmin', { params });
}
// 变更管理员- 查找企业下普通用户成员
export function menberNormal(params: Record<string, any>) {
  return $http.get('/server/web/member/getNormalMember', { params });
}
// 变更管理员
export function menberChangeAdmin(data: Record<string, any>) {
  return $http.post('/server/web/member/changeAdmin', data);
}
// 获取验证码
export function verificationCode(params: Record<string, any>) {
  return $http.get('/server/web/captcha/sendCaptcha', { params });
}

//  获取企业下某个应用下有权限的成员列表
// export function apiMemListByProduct(params: Record<string, any>) {
//   return $http.get('/server/web/product/selectConfig', { params });
// }

// 给应用授权可查看的成员
// export function apiAuthMember(data: Record<string, any>) {
//   return $http.post('/server/web/product/appConfig', data);
// }

// // 角色启用、停用
// export function apiRoleChangeState(data: any) {
//   return $http.put('/api/v1/role/change-state', {
//     data,
//   });
// }
