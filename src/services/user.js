import axios from 'axios'

const API_URL = 'http://localhost:9000'
/**
 * 
 * 
 * @param {string} email 
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise} return axios promise
 */
const defaultSignup = (email, username, password) => {
    return axios.post(`${API_URL}/service/signup`, {
        'email': email,
        'username': username,
        'password': password,
    })
}

/**
 * 
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {string} _fbToken 
 * @returns {Promise} return axios promise
 */
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