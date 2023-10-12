export interface LoginByUsernameParams {
  username: string;
  password: string;
}

export interface LoginByUsernameResult {
  // data: { token: any };
  token: string;
}

export interface LogoutResult {
  data: object;
}

export interface LoginBySmsParams {
  phone: string;
  captcha: string;
}

export interface LoginBySmsResult {
  verifyToken: string;
}

export interface LoginBySmsRequestParams {
  verifyToken: string;
  vcode: string;
}

export interface LoginVerifyResult {
  captchaVerification: string;
}
