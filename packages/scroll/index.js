// 引入组件
import Scroll from './src/Scroll.vue';

Scroll.install = Vue => Vue.component(Scroll.name, Scroll.default);

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Scroll);
}

export default Scroll;
