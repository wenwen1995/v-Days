import Vue from 'vue'
import Vuex from 'vuex'

import skin from './modules/skin'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    skin,
  },
})

export default store