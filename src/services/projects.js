import axios from 'axios'

const API_URL = 'http://localhost:9000'
/**
 * 
 * 
 * @returns {Promise} return a promise of axios (It will be a project data if creation is succeed)
 */
const createNewProject = () => {
    let _token = localStorage.getItem("_token")
    if(_token === null) return Promise.reject({ code: "TOKEN_UNDEFINED", messages: "Token is not undefined."})
    return axios.post(`${API_URL}/service/projects`, {}, {
        headers: {
            "Authorization": `jwt ${_token}`
        }
    })
}
/**
 * 
 * 
 * @param {Number} project_id project id 
 * @returns {Promise} return a promise of axios (It will be a project data)
 */
const getProjectData = (project_id) => {
    let _token = localStorage.getItem("_token")
    if(_token === null) return Promise.reject({ code: "TOKEN_UNDEFINED", messages: "Token is not undefined."})
    return axios.get(`${API_URL}/service/projects/${project_id}`, {
        headers: {
            "Authorization": `jwt ${_token}`
        }
    })
}

/**
 * 
 * 
 * @param {Number} project_id 
 * @param {Blob} blob 
 * @returns {Promise}
 */
const uploadBlobAudio = (project_id, region_id, blob) => {
    let _token = localStorage.getItem("_token")
    let data = new FormData()
    data.append('file', blob, `${region_id}.ogg`)
    if(_token === null) return Promise.reject({ code: "TOKEN_UNDEFINED", messages: "Token is not undefined."})
    return axios.post(`${API_URL}/service/projects/${project_id}/upload`, data, {
        headers: {
            "Authorization": `jwt ${_token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}


/**
 * 
 * 
 * @param {Object} data project data that requested from API Service
 * @returns {Object} formatted project data
 */
const parseProjectData = (data) => {
    let project = data.project
    let details = {
        project_id: project.project_id,
        modified_time: project.modified_time,
        last_commit_id: project.last_commit_id,
        last_commit_user_id: project.last_commit_user_id,
        owner_id: project.owner_id,
        downloadable: project.downloadable,
        name: project.details.name,
        cover: project.details.cover,
        bpm: project.details.bpm,
        time_signature: project.details.time_signature,
        bars: project.details.bars,
        key: project.details.key,
        description: project.details.description,
        members: project.members
    }
    let tracks = project.tracks
    let chats = project.chatroom
    return { details, tracks: tracks, chats: chats }
}

export default {
    createNewProject,
    getProjectData,
    parseProjectData,
    uploadBlobAudio
}