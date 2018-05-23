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


/**
 * 
 * 
 * @param {String} username piece of username to search in backend
 * @returns {Promise} returns promise which contains array of user data
 */
const searchUsersByUsername = (username) => {
    let _token = localStorage.getItem('_token')
    if(_token === null) return Promise.reject({ code: 'TOKEN_UNDEFINED', messages: "Token is undefined." })
    return axios.get(`${API_URL}/service/users/search/${username}`, {
        headers: {
            Authorization: `jwt ${_token}`
        }
    })
}
/**
 * 
 * 
 * @param {Number} user_id 
 * @returns {Promise}
 */
const getUserProfileByUserId = (user_id) => {
    let _token = localStorage.getItem('_token')
    if(_token === null) return Promise.reject({ code: 'TOKEN_UNDEFINED', messages: "Token is undefined." })
    return axios.get(`${API_URL}/service/users/id/${user_id}`, {
        headers: {
            Authorization: `jwt ${_token}`
        }
    })
}

/**
 * 
 * 
 * @param {String} user_id 
 * @returns 
 */
const getOwnedProjectDatas = (user_id) => {
    let _token = localStorage.getItem('_token')
    if(_token === null) return Promise.reject({ code: 'TOKEN_UNDEFINED', messages: "Token is undefined." })
    return axios.get(`${API_URL}/service/users/id/${user_id}/owned_projects`, {
        headers: {
            Authorization: `jwt ${_token}`
        }
    })
}

/**
 * 
 * 
 * @param {String} user_id 
 * @returns 
 */
const getCollaboratedProjectDatas = (user_id) => {
    let _token = localStorage.getItem('_token')
    if(_token === null) return Promise.reject({ code: 'TOKEN_UNDEFINED', messages: "Token is undefined." })
    return axios.get(`${API_URL}/service/users/id/${user_id}/collaborated_projects`, {
        headers: {
            Authorization: `jwt ${_token}`
        }
    })
}



export default {
    defaultSignup,
    facebookSignup,
    searchUsersByUsername,
    getUserProfileByUserId,
    getOwnedProjectDatas,
    getCollaboratedProjectDatas
}