import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/pages/Main'
import LoginSignupPage from '@/pages/LoginSignup'
Vue.use(Router)

export default new Router({
    mode: "history",
    routes: [{
        path: '/',
        name: 'MainPage',
        component: MainPage },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginSignupPage
    },{
        path: '/signup',
        name: 'SignupPage',
        component: LoginSignupPage
    }
    ]
})
