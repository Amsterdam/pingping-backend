import Vue from 'vue';
import App from './App.vue';
import VueApollo from 'vue-apollo';
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { apolloProvider } from './vue-apollo';
import { v4 as uuidv4 } from 'uuid';
import PageDefault from './pages/PageDefault.vue';
import PageUsers from './pages/PageUsers.vue';
import PageUser from './pages/PageUser.vue';
import PageRewards from './pages/PageRewards.vue';
import PageAuditLog from './pages/PageAuditLog.vue';
import PageFeedback from './pages/PageFeedback.vue';
import PageSettings from './pages/PageSettings.vue';
import PageNotifications from './pages/PageNotifications.vue'

import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueApollo);
Vue.use(VueRouter);

Vue.config.productionTip = false;

if (!window.localStorage.getItem('deviceId')) {
  window.localStorage.setItem('deviceId', uuidv4());
}

const routes = [
  { path: '/', component: PageDefault, name: 'default' },
  { path: '/users', component: PageUsers },
  { path: '/users/:id', component: PageUser },
  { path: '/rewards', component: PageRewards },
  { path: '/notifications', component: PageNotifications },
  { path: '/audit-log', component: PageAuditLog },
  { path: '/feedback', component: PageFeedback },
  { path: '/settings', component: PageSettings },
];

const router = new VueRouter({
  routes,
  base: '/admin',
});

new Vue({
  apolloProvider,
  render: (h) => h(App),
  router,
}).$mount('#app');
