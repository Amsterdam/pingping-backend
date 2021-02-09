import Vuex from 'vuex';
import Vue from 'vue';
import admins from './admins';
import users from './users';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    admins,
    users,
  },
});
