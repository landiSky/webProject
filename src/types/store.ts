/**
 * 获取用户信息api返回的数据类型
 */
export interface UserInfo {
  id?: number;
  username?: string;
  nickName?: string;
  deptName?: string;
  authorities?: Array<string>;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  enabled?: boolean;
  tenantId?: number;
  roles?: Array<{
    id: number;
    enabled: number;
    roleCode: string;
    roleName: string;
  }>;
  auths?: Array<string>;
  binded?: 0 | 1;
  handleInfo?: { handleAdmin: string };
}
