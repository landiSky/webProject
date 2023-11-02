declare module 'vue' {
  interface ComponentCustomProperties {
    $authCode: { [name: string]: string };
  }
}

declare module 'axios' {
  interface AxiosRequestConfig {
    customFields?: {
      withoutToken?: boolean; // header 是否携带 token，默认 false，携带 token
      returnRawResponse?: boolean; // 业务方直接处理原始 response
      returnRawData?: boolean; // 是否直接返回后端返回的原始数据，自定义报错格式时，可传 true
    };
  }

  interface AxiosResponse {
    [key: string]: any;
  }
}

declare module 'sm-crypto';

export {};
