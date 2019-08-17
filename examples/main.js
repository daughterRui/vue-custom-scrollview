import Vue from 'vue';
import Scroll from 'vue-custom-scrollview';
import App from './App.vue';

Vue.use(Scroll);
Vue.config.productionTip = false;


new Vue({
  render: h => h(App),
}).$mount('#app');
