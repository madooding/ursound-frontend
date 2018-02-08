import { AuthService } from '../../services'

const state = {
    isLoggedIn: false,
    authorizing: true,
    userProfile: {
        "user_id": null,
        "username": "",
        "email": "",
        "first_name": "",
        "fb_id": "",
        "profile_img": "",
        "profile_settings": null,
        "followers_count": 0,
        "following_count": 0
    }
}

const mutations = {
    setLoginState(state, val) {
        state.isLoggedIn = val
    },
    setAuthorizingState(state, val) {
        state.authorizing = val
    },
    setUserProfileData(state, val) {
        state.userProfile = val
    }
}

const actions = {
    VALIDATE_TOKEN({commit, dispatch}, token){
        return AuthService.validateToken()
            .then(res => {
                commit("setLoginState", true)
                commit('setAuthorizingState', false)
                commit('setUserProfileData', {
                    ...res.data.userProfile
                })
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
    isLoggedIn: (state) => state.isLoggedIn,
    getUserProfileData: state => state.userProfile
}

export default {
    state,
    mutations,
    actions,
    getters
}