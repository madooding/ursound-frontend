import axios from 'axios'
import { Howl } from 'howler'
import { Observable } from 'rxjs'

const API_URL = 'http://localhost:9000'

/**
 * 
 * 
 * @returns {string} return an objectID
 */
const objectId = () => {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
}


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
    objectId,
    createNewProject,
    getProjectData,
    parseProjectData
}