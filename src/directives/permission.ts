/**
 * 按钮权限指令
 */
import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store/modules/user';

const has = {
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    const userStore = useUserStore();
    const { auths = [] } = userStore.userInfo || {};
    const hasBtn = auths.includes(binding.value);
    if (!hasBtn) {
      el.parentNode?.removeChild(el);
    }
  },
};

export { has };
