import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import '!style-loader!css-loader!sass-loader!./assets/scss/default.scss'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
