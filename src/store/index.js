import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: JSON.parse(window.sessionStorage.getItem("user")),
    menus: [],
    sessions: {},
  },
  getters: {
  },
  mutations: {
    INIT_CURRENTUSER(state,user) {
      state.currentUser = user;
    },
    initMenus(state,data) {
      state.menus = data
    },
  },
  actions: {
  },
  modules: {
  },
})

store.watch(function (state) {
  return state.sessions
}, function (val) {
  localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
  deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store;