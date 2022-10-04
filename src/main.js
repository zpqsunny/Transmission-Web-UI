/* eslint-disable*/

import Vue from 'vue'
import i18n from './language'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from './plugins/axios'
import './main.css'
import './filter'

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
