import $http from '@/utils/http';

// 活跃企业节点数
export function apiActiveNode() {
  return $http.get('/web/company/getSnmsData');
}

// 企业节点概览
export function apiNodeOverall() {
  return $http.get('/web/company/getSnmsNodeData');
}
