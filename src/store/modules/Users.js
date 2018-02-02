import { AuthService } from '../../services'

const state = {
    isLoggedIn: false,
    authorizing: true
}

const mutations = {
    setLoginState(state, val) {
        state.isLoggedIn = val
    },
    setAuthorizingState(state, val) {
        state.authorizing = val
    }
}

const actions = {
    VALIDATE_TOKEN({commit, dispatch}, token){
        return AuthService.validateToken()
            .then(res => {
                commit("setLoginState", true)
                commit('setAuthorizingState', false)
                return Promise.resolve(res)
            })
            .catch(err => {
                localStorage.removeItem("_token")
                dispatch("RESET_AUTHEN_STATUS")
                return Promise.reject(err)
            })
    },
    RESET_AUTHEN_STATUS({commit}){
        commit("setLoginState", false)
        commit("setAuthorizingState", false)
    }
}

const getters = {
    isLoggedIn: (state) => state.isLoggedIn
}

export default {
    state,
    mutations,
    actions,
    getters
}