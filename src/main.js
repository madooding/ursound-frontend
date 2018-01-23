import Vue from 'vue'
import App from './App'
import router from './router'
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false


import '!script-loader!jquery/dist/jquery.min.js'
import '!script-loader!popper.js/dist/popper.min.js'
import '!script-loader!bootstrap/dist/js/bootstrap.min.js'
import '!script-loader!slick-carousel/slick/slick.min.js'
import '!style-loader!css-loader!sass-loader!bootstrap/scss/bootstrap.scss'
import '!style-loader!css-loader!slick-carousel/slick/slick.css'
import '!style-loader!css-loader!slick-carousel/slick/slick-theme.css'
import '!style-loader!css-loader!sass-loader!./assets/scss/default.scss'

Vue.use(VeeValidate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
