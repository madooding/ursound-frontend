import axios from 'axios'

const API_URL = 'http://localhost:9000'

const defaultSignup = (email, username, password) =>{
    return axios.post(`${API_URL}/service/signup`, {
        'email': email,
        'username': username,
        'password': password,
    })
}

export default {
    defaultSignup
}