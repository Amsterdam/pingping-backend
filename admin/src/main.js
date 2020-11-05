import Vue from 'vue';
import App from './App.vue';
import VueApollo from 'vue-apollo';
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { createProvider } from './vue-apollo';
import { v4 as uuidv4 } from 'uuid';
import PageDefault from './pages/PageDefault';
import PageUsers from './pages/PageUsers';
import PageUser from './pages/PageUser';
import PageRewards from './pages/PageRewards';
import PageAuditLog from './pages/PageAuditLog';
import PageSettings from './pages/PageSettings';
import store from './store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-json-pretty/lib/styles.css';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueApollo);
Vue.use(VueRouter);

Vue.config.productionTip = false;

if (!window.localStorage.getItem('deviceId')) {
  window.localStorage.setItem('deviceId', uuidv4());
}

const routes = [
  { path: '/', component: PageDefault },
  { path: '/users', component: PageUsers },
  { path: '/users/:id', component: PageUser },
  { path: '/rewards', component: PageRewards },
  { path: '/audit-log', component: PageAuditLog },
  { path: '/settings', component: PageSettings },
];

const router = new VueRouter({
  routes,
  base: '/admin',
});

new Vue({
  apolloProvider: createProvider(),
  render: (h) => h(App),
  router,
  store,
}).$mount('#app');
