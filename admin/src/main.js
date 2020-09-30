import Vue from 'vue';
import App from './App.vue';
import VueApollo from 'vue-apollo';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { createProvider } from './vue-apollo';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-json-pretty/lib/styles.css';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueApollo);

Vue.config.productionTip = false;

new Vue({
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount('#app');
