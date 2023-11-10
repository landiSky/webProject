import $http from '@/utils/http';

// 活跃企业节点数
export function apiActiveNode() {
  return $http.get(
    'http://server-platform-gateway-a.dev.idx.space/server/web/company/getSnmsData'
  );
}

// 企业节点概览
export function apiNodeOverall() {
  return $http.get(
    'http://server-platform-gateway-a.dev.idx.space/server/web/company/getSnmsNodeData'
  );
}
