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
    url: '/server/web/config/info',
    method: 'get',
    response: () => {
      return successResponseWrap({
        redirect_uri: '', // oauth/token 接口参数值
        client_id: '', // oauth/token 接口参数值
        client_secret: '', // oauth/token 接口参数值
        login_url:
          'http://10.14.150.253:8081/sso/server/web/oauth/authorize?response_type=code&client_id=sso_platform&redirect_uri=http://10.14.150.253:8081/sso/server/web/login&scope=all',
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
