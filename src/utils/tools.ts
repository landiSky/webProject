export function utilsCopy(data: string) {
  const elInput = document.createElement('input');
  elInput.value = data;
  document.body.appendChild(elInput);
  // 选择对象
  elInput.select();
  document.execCommand('Copy');
  elInput.remove();
}
