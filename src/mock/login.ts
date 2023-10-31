import { successResponseWrap, failResponseWrap } from './response';

export default [
  {
    url: '/web/captcha/sendCaptcha',
    method: 'get',
    response: () => {
      return successResponseWrap({
        code: 200,
      });
    },
  },
  {
    url: '/web/user/register',
    method: 'post',
    response: () => {
      return successResponseWrap({
        code: '12345',
      });
    },
  },
];
