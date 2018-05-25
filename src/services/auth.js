import axios from 'axios'

const API_URL = ''

const defaultLogin = (username, password) => {
    return axios.post(`${API_URL}/service/auth`, {
        username: username,
        password: password
    })
}

const validateToken = () => {
    let _token = localStorage.getItem("_token")
    if(_token === null) return Promise.reject({ code: "TOKEN_UNDEFINED", messages: "Token is not undefined."})
    return axios.post(`${API_URL}/service/auth/token`, {}, {
        headers: {
            "Authorization": `jwt ${_token}`
        }
    })
}

const facebookLogin = (_fbToken) => {
    return axios.post(`${API_URL}/service/auth/facebook`, {}, {
        headers: {
            "_fbToken": _fbToken
        }
    })
}

export default {
    defaultLogin,
    validateToken,
    facebookLogin
}