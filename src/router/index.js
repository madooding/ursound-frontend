import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/pages/Main'
import LoginSignupPage from '@/pages/LoginSignup'
import ExplorePage from '@/pages/Explore'
import StudioPage from '@/pages/Studio'
import LocalStorage from 'vue-localstorage'

import { AuthService } from '../services'
import store from '../store'

Vue.use(Router)


const router = new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'MainPage',
            component: MainPage,
            meta: { beforeAuth: true }
        },
        {
            path: '/login',
            name: 'LoginPage',
            component: LoginSignupPage,
            meta: { beforeAuth: true }
        },
        {
            path: '/signup',
            name: 'SignupPage',
            component: LoginSignupPage,
            meta: { beforeAuth: true }
        },
        {
            path: '/signup/facebook',
            name: 'SignupFacebookMethod',
            component: LoginSignupPage,
            meta: { needFacebookAuthorized: true, beforeAuth: true }
        },
        {
            path: '/explore',
            name: 'ExplorePage',
            component: ExplorePage,
            meta: { requiredAuth: true }
        },
        {
            path: '/studio',
            name: 'StudioMode',
            component: StudioPage,
            meta: { requiredAuth: true }
        }
    ]
})


const match = async (to, from, next) => {
    console.log('match');
    if (to.matched.some(x => x.meta.beforeAuth)){
        if(store.getters.isLoggedIn){
            next({ path: "/explore" })
        } else next()
    }

    if (to.matched.some((x) => x.meta.requiredAuth)) {
        if(store.getters.isLoggedIn) next()
        else next({ path: "/login" })
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
            else next()
        } catch (err){
            next({ path: '/signup' })
        }
    }
}

router.beforeEach((to, from, next) => {
    const _token = localStorage.getItem('_token')
    if(_token){
        store.dispatch('VALIDATE_TOKEN')
            .then(res => { match(to, from, next) })
            .catch(err => {
                match(to, from, next)
            })
    } else {
        store.dispatch('RESET_AUTHEN_STATUS')
        match(to, from, next)
    }
})

export default router