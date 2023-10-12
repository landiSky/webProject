export const successResponseWrap = (data: unknown) => {
  return {
    data,
    code: 10000,
    message: '成功',
  };
};

export const failResponseWrap = (data: unknown, code = 50000, msg: string) => {
  return {
    data,
    message: msg || '请求失败',
    code,
  };
};
