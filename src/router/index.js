import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/pages/Main'
Vue.use(Router)

export default new Router({
    mode: "history",
    routes: [{
        path: '/',
        name: 'MainPage',
        component: MainPage
  }]
})
