import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import '!script-loader!jquery/dist/jquery.min.js'
import '!script-loader!slick-carousel/slick/slick.min.js'
import '!style-loader!css-loader!slick-carousel/slick/slick.css'
import '!style-loader!css-loader!slick-carousel/slick/slick-theme.css'
import '!style-loader!css-loader!sass-loader!./assets/scss/default.scss'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
