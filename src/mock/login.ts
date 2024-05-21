import { successResponseWrap, failResponseWrap } from './response';

export default [
  {
    url: '/server/web/captcha/sendCaptcha',
    method: 'get',
    response: () => {
      return successResponseWrap({
        code: 200,
      });
    },
  },

  {
    url: '/server/web/config',
    method: 'get',
    response: () => {
      return successResponseWrap({
        redirect_uri: '', // oauth/token 接口参数值
        client_id: '', // oauth/token 接口参数值
        client_secret: '', // oauth/token 接口参数值
        login_url:
          'http://10.14.150.253:8081/sso/server/web/oauth/authorize?response_type=code&client_id=sso_platform&redirect_uri=http://10.14.150.253:8081/sso/server/web/login&scope=all',
        publicKey:
          '047df36f25dab03d12739e57a1c3a86a72019bea590e5ffaefa79145d9129ae5ae9d395de0fba16a9577c7d52b27cda3e2ec63f522d4d69c5a92a0a0b388b1db10',
      });
    },
  },
  {
    url: '/server/web/user/register',
    method: 'post',
    response: () => {
      return successResponseWrap({
        code: '12345',
      });
    },
  },
];
