import axios, {
  Axios,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { Message } from '@tele-design/web-vue';
import { getToken, clearToken } from '@/utils/auth';

import { useRouter } from 'vue-router';

const router = useRouter();

const $http: AxiosInstance = axios.create({
  timeout: 60 * 1000,
});

// 请求拦截
$http.interceptors.request.use(
  (config: AxiosRequestConfig<any>) => {
    const { customFields } = config;
    const token = getToken();

    // 接口携带 token
    if (token && !customFields?.withoutToken) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `bearer ${token}`;
    }

    return config;
  },
  (error) => {
    Message.error(`request 请求拦截设置异常: ${error.message}`);
  }
);

/*
{
    data: {}, // `data` 由服务器提供的响应
    status: 200, // `status` 来自服务器响应的 HTTP 状态码
    statusText: 'OK', // `statusText` 来自服务器响应的 HTTP 状态信息
    headers: {},    // `headers` 是服务器响应头, 所有的 header 名称都是小写，而且可以使用方括号语法访问`response.headers['content-type']`,
    config: {}, // `config` 是 `axios` 请求的配置信息
    request: {} // `request` 是生成此响应的请求, 在浏览器中则是 XMLHttpRequest 实例
  }
*/
const orgRequest = Axios.prototype.request;
Axios.prototype.request = function (reqConfig: AxiosRequestConfig) {
  return new Promise((resolve, reject) => {
    orgRequest
      .call(this, reqConfig)
      .then((response: any) => {
        //  status = 2xx 范围内的状态码都会触发该函数。

        // ==============预处理start response========
        // data:存储的是后端实际返回的 json 数据
        const { data } = response;
        const { url, customFields } = reqConfig;

        // console.log('===http', url, customFields, customFields?.returnRawResponse)
        // s0: 调用方需要自行处理原始response
        if (customFields?.returnRawResponse) {
          // console.log('====http2', url)
          return resolve(response);
        }

        // s1: 调用方需要自行处理原始data
        if (customFields?.returnRawData) {
          return resolve(data);
        }

        // s2: 不是对象结构的也直接返回，调用方自行处理
        if (data.constructor !== Object) {
          return resolve(data);
        }

        // s3: 是对象结构，统一处理异常码

        //  TODO1: 这里解构后端返回的数据格式 {code, message, data},根据项目调整
        const { code, message } = data;

        //  TODO2: 这里逻辑可以根据项目进行修改code: 10000表示成功, 根据项目调整
        if (code === 200) {
          if (
            url?.startsWith('/operation/web/') ||
            url?.startsWith('/inventory/web/')
          ) {
            return resolve(data);
          }
          return resolve(data.data);
        }

        if (code === 101004) {
          Message.error(message);
          window.location.reload();
          // console.log('http.ts:89===code==101004 跳转到前台首页');
          // clearToken();
          // router.push('/wow/index');
          return reject(data);
        }
        console.log('http.ts:91');
        const errorMsg =
          message || `接口异常：没有异常 message 提示,code: ${code}`;

        Message.error(errorMsg);

        return reject(data);

        // ==============预处理start response========
      })
      .catch((e: any) => {
        console.log('http.ts:101', Object.keys(e));
        const { status } = e.response || {};

        if (status === 500) {
          Message.error('服务端不可用');
        }
        reject(e);
      });
  });
};

export default $http;
