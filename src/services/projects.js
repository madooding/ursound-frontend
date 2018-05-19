import axios from 'axios'
import { Howl } from 'howler'
import { Observable } from 'rxjs'
import { studio } from '.';
import _ from 'lodash'

const API_URL = 'http://localhost:9000'

const projectsModel = {
    project_id: Number,
    modified_time: String,
    last_commit_id: String,
    last_commit_user_id: String,
    owner_id: Number,
    downloadable: Boolean,
    details: {
        name: String,
        cover: String,
        bpm: Number,
        time_signature: Number,
        bars: Number,
        key: Number,
        description: String
    },
    members: Array,
    comments: Array,
    chatroom: Array,
    likes: Array,
    tracks: Array
}

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
    if(_token === null) return Promise.reject({ code: "TOKEN_UNDEFINED", messages: "Token is undefined." })
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
    if(_token === null) return Promise.reject({ code: "TOKEN_UNDEFINED", messages: "Token is undefined." })
    return axios.get(`${API_URL}/service/projects/${project_id}`, {
        headers: {
            "Authorization": `jwt ${_token}`
        }
    })
}


/**
 * 
 * 
 * @param {projectsModel} project_data 
 * @returns {Promise} return a promise of axios (It will be a updated project data)
 */
const syncProjectData = (project_data) => {
    let _token = localStorage.getItem('_token')
    if(_token === null) return Promise.reject({ code: 'TOKEN_UNDEFINED', messages: "Token is undefined." })
    return axios.put(`${API_URL}/service/projects/${project_data.project_id}`, project_data, {
        headers: {
            "Authorization": `jwt ${_token}`
        }
    })
}

/**
 * 
 * 
 * @param {Number} project_id project id to be added new contributor
 * @param {Number} user_id user id of user to be added to project
 * @returns {Promise} 
 */
const addNewContributor = (project_id, user_id) => {
    let _token = localStorage.getItem('_token')
    if(_token === null) return Promise.reject({ code: 'TOKEN_UNDEFINED', messages: "Token is undefined." })
    return axios.post(`${API_URL}/service/projects/${project_id}/contributors/${user_id}`, {}, {
        headers: {
            "Authorization": `jwt ${_token}`
        }
    })
}


/**
 * 
 * 
 * @param {Object} studio_data 
 * @returns {projectsModel}
 */
const parseStudioToProjectData = (studio_data) => {
    let projectData = { ...projectsModel }
    let updateTrackVolume = _.map(_.filter(studio_data.logs, log => log.type == 'UPDATE_TRACK_VOLUME'), log => ({ type: log.type, track_id: log.track_id }))
    updateTrackVolume = _.uniqWith(updateTrackVolume, _.isEqual)
    studio_data.logs = _.filter(studio_data.logs, log => log.type !== 'UPDATE_TRACK_VOLUME')
    studio_data.logs.push(...updateTrackVolume)
    projectData.project_id = studio_data.details.project_id
    projectData.modified_time = studio_data.details.modified_time
    projectData.last_commit_id = studio_data.details.last_commit_id
    projectData.last_commit_user_id = studio_data.details.last_commit_user_id
    projectData.owner_id = studio_data.details.owner_id
    projectData.downloadable = studio_data.details.downloadable
    projectData.details.name = studio_data.details.name
    projectData.details.cover = studio_data.details.cover
    projectData.details.bpm = studio_data.details.bpm
    projectData.details.time_signature = studio_data.details.time_signature
    projectData.details.bars = studio_data.details.bars
    projectData.details.key = studio_data.details.key
    projectData.details.description = studio_data.details.description
    projectData.tracks = studio_data.tracks
    projectData.tracks =  _.map(projectData.tracks, track => {
        track.sequences = _.map(track.sequences, seq => {
            if (track.type == 'AUDIO') delete seq.player
            return seq
        })
        return track
    })
    projectData.logs = studio_data.logs
    delete projectData.members
    delete projectData.comments
    delete projectData.chatroom
    delete projectData.likes
    return projectData
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
    details.members = _.map(details.members, member => {
        member.profile_img = member.profile_img ? member.profile_img : '../static/blank_profile.png'
        return member
    })
    let tracks = project.tracks
    let chats = project.chatroom
    return { details, tracks: tracks, chats: chats }
}

export default {
    objectId,
    createNewProject,
    getProjectData,
    syncProjectData,
    addNewContributor,
    parseProjectData,
    parseStudioToProjectData
}