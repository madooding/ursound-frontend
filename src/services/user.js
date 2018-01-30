import axios from 'axios'

const API_URL = 'http://localhost:9000'

const defaultSignup = (email, username, password) => {
    return axios.post(`${API_URL}/service/signup`, {
        'email': email,
        'username': username,
        'password': password,
    })
}

const facebookSignup = (username, password, _fbToken) => {
    return axios.post(`${API_URL}/service/signup/facebook`, {
        'username': username,
        'password': password
    }, {
        headers: {
            '_fbToken': _fbToken
        }
    })
}

export default {
    defaultSignup,
    facebookSignup
}