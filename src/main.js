/* eslint-disable*/

import Vue from 'vue'
// import VueI18n from 'vue-i18n'
// import language from './language'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from './plugins/axios'
import './main.css'
import './filter'

// Vue.use(VueI18n)

// const i18n = new VueI18n({
//   locale: 'cn',
//   messages: language
// })

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  // i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
