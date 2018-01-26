import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/pages/Main'
import LoginSignupPage from '@/pages/LoginSignup'
import ExplorePage from '@/pages/Explore'
import LocalStorage from 'vue-localstorage'

import { AuthService } from '../services'

Vue.use(Router)


const router = new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'MainPage',
            component: MainPage,
            meta: { showDefaultMenu: true }
        },
        {
            path: '/login',
            name: 'LoginPage',
            component: LoginSignupPage,
            meta: { showDefaultMenu: true }
        },
        {
            path: '/signup',
            name: 'SignupPage',
            component: LoginSignupPage,
            meta: { showDefaultMenu: true }
        },
        {
            path: '/signup/facebook',
            name: 'SignupFacebookMethod',
            component: LoginSignupPage,
            meta: { showDefaultMenu: true, needFacebookAuthorized: true }
        },
        {
            path: '/explore',
            name: 'ExplorePage',
            component: ExplorePage,
            meta: { requiredAuth: true }
        }
    ]
})


const match = async (to, from, next) => {
    if (to.matched.some((x) => x.meta.requiredAuth)) {
        try {
            let token_res = await AuthService.validateToken()
        } catch(err) {
            next({path: '/login'})
        }
    }
    if (to.matched.some((x) => x.meta.needFacebookAuthorized)) {
        try {
            const getLoginState = () => new Promise((resolve, reject) => {
                FB.getLoginStatus(function(response) {
                    resolve(response)
                })
            })
            let result = await getLoginState()
            if (result.status !== "connected") next({ path: '/signup' })
        } catch (err){
            next({ path: '/signup' })
        }
    }
    next()
}

router.beforeEach((to, from, next) => {
    match(to, from, next)
})

export default router