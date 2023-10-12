import $http from '@/utils/http';

export function apiPublicConfig() {
  return $http.get('/api/v1/public/config');
}
