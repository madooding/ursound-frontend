import Vue from 'vue'
import VueRx from 'vue-rx'
import Rx from 'rxjs'
import App from './App'
import VeeValidate from 'vee-validate'
import VueLocalStorage from 'vue-localstorage'
import router from './router'
import store from './store'

Vue.config.productionTip = false


import '!script-loader!jquery/dist/jquery.min.js'
import '!script-loader!popper.js/dist/umd/popper.js'
import '!script-loader!bootstrap/dist/js/bootstrap.min.js'
import '!script-loader!slick-carousel/slick/slick.min.js'
import '!script-loader!wavesurfer.js/dist/wavesurfer.js'
import '!script-loader!jquery-knob/dist/jquery.knob.min'
import '!style-loader!css-loader!sass-loader!bootstrap/scss/bootstrap.scss'
import '!style-loader!css-loader!slick-carousel/slick/slick.css'
import '!style-loader!css-loader!slick-carousel/slick/slick-theme.css'
import '!style-loader!css-loader!./assets/css/ionicons.min.css'
import '!style-loader!css-loader!./assets/css/styles.css'
import '!style-loader!css-loader!sass-loader!./assets/scss/default.scss'

process.env.API_SERVER = "http://localhost:9000"

Vue.use(VueRx, Rx)
Vue.use(VeeValidate)
Vue.use(VueLocalStorage, {
    name: 'ls',
    bind: true
})




Vue.mixin({
    methods: {
        $checkFacebookLoginState: function(){
            return new Promise((resolve, reject) => {
                FB.getLoginStatus(function(response) {
                    resolve(response)
                });
            })
        },
        $facebookLogin: function(){
            return new Promise((resolve, reject) => {
                FB.login(function(response) {
                    resolve(response)
                }, {scope: 'public_profile,email'});
            })
        }
    }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    
  }
})
