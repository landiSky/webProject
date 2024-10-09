// import { onMounted, onUnmounted } from 'vue';
console.log(111);
// el为滚动target
export function lazyLoad(el: HTMLElement, callback: any) {
  const handleScroll = () => {
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      callback();
    }
  };

  //   onMounted(() => {
  //     window.addEventListener('scroll', handleScroll);
  //   });

  //   onUnmounted(() => {
  //     window.removeEventListener('scroll', handleScroll);
  //   });
}
