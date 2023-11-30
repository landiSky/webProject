import { Message } from '@tele-design/web-vue';

interface ElType extends HTMLElement {
  copyData: string | number;
  handleClick: any;
}

function handleClick(this: any) {
  const input = document.createElement('input');
  input.value = this.copyData.toLocaleString();
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input);
  Message.success('复制成功');
}
export const copy: any = {
  mounted(el: ElType, binding: any) {
    el.copyData = binding.value;
    el.addEventListener('click', handleClick);
  },
  updated(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value;
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.handleClick);
  },
};
