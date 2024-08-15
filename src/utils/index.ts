export function copyToClipboard(text: string) {
  /*
  浏览器禁用了非安全域的 navigator.clipboard 对象，
  安全域包括本地访问与开启TLS安全认证的地址，如 https 协议的地址、127.0.0.1 或 localhost
   */
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('无法使用剪贴板：', err);
    }
    document.body.removeChild(textArea);
  }
}

export function addId(data: Record<string, any>) {
  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      ...item,
      uid: `${Math.random().toString(36).substring(2, 15)}_${index}`,
    }));
  }
  if (Object.prototype.toString.call(data) === '[object Object]') {
    return { ...data, uid: `${Math.random().toString(36).substring(2, 15)}_0` };
  }
  return data;
}
