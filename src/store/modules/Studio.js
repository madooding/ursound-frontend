import studio, { StudioService, ProjectsService } from '../../services'
import store from '../../store'
import _ from 'lodash'
import { Observable, Subject } from 'rxjs'
import io from 'socket.io-client'
import router from '../../router'
import { last } from 'rxjs/operators';

/**
 * 
 * 
 * @param {string} id objectID of track
 * @returns {integer} index number of track
 */
const findTrackIndex = (id) => {
   return _.findIndex(state.tracks, each => each.id === id)
}


/**
 * 
 * 
 * @param {integer} trackIndex track index
 * @param {string} regionId objectID of region in sequences
 * @returns {integer} index number of region
 */
const findRegionIndex = (trackIndex, regionId) => {
    return _.findIndex(state.tracks[trackIndex].sequences, each => each.id === regionId)
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

const studioEnvStruct = {
    studioSocket: io.Socket,
    env: {
        zoomLevel: 100,
        stage_width: 0,
        currentScrollXPos: 0,
        currentTimePercent: 0,
        mode: 'EDIT', // EDIT, PLAYBACK, COUNTDOWN, RECORDING, ADD_NEW_TRACK, LOAD_PROJECT, NO_PERMISSION, UPLOADING_AUDIO, ADD_NEW_CONTRIBUTOR
        piano: null,
        isMetronomeOn: false,
        studioEvent: io.prototype,
        metronome: {
            up: new Howl({
                src: ['../static/audio/metronomeup.wav']
            }),
            down: new Howl({
                src: ['../static/audio/metronomedown.wav']
            })
        },
        seek_signal: false,
        changed: false,
        master_volume: 80
    },
    details: {
        project_id: null,
        modified_time: null,
        last_commit_id: null,
        last_commit_user_id: null,
        owner_id: null,
        downloadable: false,
        name: null,
        cover: "",
        bpm: 80,
        time_signature: 4,
        bars: 16,
        key: 1,
        description: "",
        members: []
    },
    tracks: [

    ],
    chat: {
        chat_messages: [],
        show: false,
        unseen: 0
    }
}

const state = {
    ...studioEnvStruct
}

const mutations = {
    setPianoInstrument (state, val) {
        state.env.piano = val
    },
    muteTrackById(state, val){
        let index = _.findIndex(state.tracks, o => o.id == val)
        state.tracks[index].muted = !state.tracks[index].muted
        if(state.tracks[index].muted == true) state.tracks[index].solo = false
    },
    soloTrackById(state, val){
        let index = _.findIndex(state.tracks, o => o.id == val)
        state.tracks[index].solo = !state.tracks[index].solo
        if(state.tracks[index].solo == true) state.tracks[index].muted = false
    },
    updateTrackVolume(state, val){
        let index = _.findIndex(state.tracks, o => o.id == val.id)
        state.tracks[index].volume = val.volume
    },
    toggleChatbox(state){
        state.chat.show = !state.chat.show
        state.chat.unseen = 0
    },
    toggleMetronome(state){
        state.env.isMetronomeOn = !state.env.isMetronomeOn
    },
    zoom(state, val) {
        state.env.zoomLevel = val
    },
    setStageWidth(state, val) {
        state.env.stage_width = val
    },
    setCurrentScrollXPosition(state, val){
        state.env.currentScrollXPos = Math.min(state.env.stage_width, Math.max(0, val))
    },
    setStudioCurrentTimePercent(state, val){
        state.env.currentTimePercent = val
    },
    setSeekSignal(state, val) {
        state.env.seek_signal = val
    },
    setStudioActiveTrack(state, val) {
        state.tracks = _.map(state.tracks, each => {
            if (each.id == val) each.active = true
            else each.active = false
            return each
        })
    },
    moveChordRegion(state, val){
        let regionData = state.tracks[val.currentIndex.trackIndex].sequences[val.currentIndex.regionIndex]
        let modified_time = Date.now()
        regionData.start_beat = val.moveTo.startBeat
        regionData.modified_time = modified_time
        state.tracks[val.moveTo.trackIndex].sequences.push(regionData)
        state.tracks[val.moveTo.trackIndex].modified_time = modified_time
        state.tracks[val.currentIndex.trackIndex].sequences.splice(val.currentIndex.regionIndex, 1)
    },
    moveAudioRegion(state, val) {
        let regionData = state.tracks[val.currentIndex.trackIndex].sequences[val.currentIndex.regionIndex]
        let modified_time = Date.now()
        regionData.start_beat = val.moveTo.startBeat
        regionData.modified_time = modified_time
        state.tracks[val.moveTo.trackIndex].sequences.push(regionData)
        state.tracks[val.moveTo.trackIndex].modified_time = modified_time
        state.tracks[val.currentIndex.trackIndex].sequences.splice(val.currentIndex.regionIndex, 1)
    },
    resizeChordRegion (state, val) {
        let regionData = state.tracks[val.currentIndex.trackIndex].sequences[val.currentIndex.regionIndex]
        let modified_time = Date.now()
        regionData.start_beat = val.payload.startBeat
        regionData.beat = val.payload.duration
        regionData.modified_time = modified_time
        state.tracks[val.currentIndex.trackIndex].sequences[val.currentIndex.regionIndex] = regionData
        state.tracks[val.currentIndex.trackIndex].modified_time = modified_time
    },
    resizeAudioRegion (state, val) {
        let bpm = state.details.bpm
        let regionData = state.tracks[val.currentIndex.trackIndex].sequences[val.currentIndex.regionIndex]
        let modified_time = Date.now()
        let diff =  (regionData.original_length - (regionData.trim_left + regionData.trim_right)) - StudioService.beats2milliseconds(bpm, val.payload.duration)
        // console.log(diff);
        if (val.payload.trim_direction === 'left') {
            regionData.start_beat += StudioService.milliseconds2beats(bpm, diff)
            regionData.trim_left += diff
        } else {
            regionData.trim_right += diff
        }
        state.tracks[val.currentIndex.trackIndex].sequences[val.currentIndex.regionIndex] = regionData
        state.tracks[val.currentIndex.trackIndex].modified_time = modified_time
    },
    updateTrackSequences (state, val) {
        state.tracks[val.trackIndex].sequences = val.payload
    },
    setActiveRegion (state, val) {
        state.tracks[val.trackIndex].sequences[val.regionIndex].active = val.payload
    },
    deleteRegion (state, val) {
        state.tracks[val.trackIndex].sequences.splice(val.regionIndex, 1)
    },
    addChordRegion (state, val) {
        let activeTrack = getters.getStudioActiveTrack(state)
        activeTrack.sequences.push(val)
        activeTrack.modified_time = Date.now()
    },
    addAudioRegion (state, val) {
        let activeTrack = getters.getStudioActiveTrack(state)
        activeTrack.sequences.push(val)
    },
    updateRecordingRegion (state, val) {
        let activeTrack = getters.getStudioActiveTrack(state)
        let recordingIndex = _.findIndex(activeTrack.sequences, seq => seq.recording)
        let recordingRegion = activeTrack.sequences[recordingIndex]
        activeTrack.sequences[recordingIndex].original_length = getters.getStudioCurrentTime(state) * 1000 - StudioService.beats2milliseconds(state.details.bpm, recordingRegion.start_beat - 1)
    },
    finishRecordingRegion (state, val) {
        let activeTrack = getters.getStudioActiveTrack(state)
        if(val) val.recording = false //activeTrack.sequences[recordingIndex].recording = false
        activeTrack.modified_time = Date.now()
    },
    setStudioPlayingState (state, val) {
        state.env.mode = val ? 'PLAYBACK' : 'EDIT'
    },
    setStudioMode (state, val) {
        state.env.mode = val
    },
    studioAddNewTrack (state, val) {
        let newTrack = {
            id: objectId(),
            modified_time: Date.now(),
            name: val.type === 'PIANO' ? 'Piano' : 'Audio',
            type: val.type,
            volume: 80,
            solo: false,
            muted: false,
            active: false,
            sequences: [] 
        }
        state.tracks.push(newTrack)
    },
    resetStudioEnv (state) {
        state.env = studioEnvStruct.env
        state.details = studioEnvStruct.details
        state.tracks = studioEnvStruct.tracks
        state.chat = studioEnvStruct.chat
    },
    setProjectData (state, val) {
        state.details = val.details
        state.tracks = val.tracks
        state.chat.chat_messages = val.chats
    },
    addMessageEvent (state, val) {
        if(!state.chat.show) state.chat.unseen++
        let last_message = state.chat.chat_messages.pop()
        if(last_message && last_message.sender_id == val.sender_id && last_message.type == 'MESSAGES' ) {
            last_message.messages.push(val.messages[0])
            last_message.last_update = val.last_update
            state.chat.chat_messages.push(last_message)
        } else {
            if(last_message) state.chat.chat_messages.push(last_message)
            state.chat.chat_messages.push(val)
        }
    },
    setStudioSocket (state, val) {
        state.studioSocket = val.socket
        state.env.studioEvent = val.subject
    },
    setStudioChangeSignal (state, val) {
        state.env.changed = val
    }
}

const actions = {
    SET_PIANO_INSTRUMENT ({commit}, val) {
        commit('setPianoInstrument', val)
    },
    STUDIO_LOAD_PROJECT_DATA ({ commit, dispatch }, val) {
        dispatch('STUDIO_SET_MODE', 'LOAD_PROJECT')
        Observable.fromPromise(ProjectsService.getProjectData(val.project_id))
            .pluck('data')
            .flatMap(data => {
                return Promise.resolve(ProjectsService.parseProjectData(data))
            }, (data, project) => ({ ...project }))
            .flatMap(project => {
                return Observable.from(project.tracks)
                        .flatMap(track => {
                            return StudioService.setTrackPlayer(track)
                        }, (track, sequences) => {
                            track.sequences = sequences
                            return track
                        })
                        .toArray()
            }, (project, tracks) => {
                project.tracks = tracks
                return project
            })
            .do(result => {
                //Set studio socket
                let connection = StudioService.defineSocketConnection(result.details.project_id, store.getters.getUserProfileData.user_id)
                commit('setStudioSocket', connection)
            })
            .do((result) => { 
                //Set studio mode
                if(result.tracks.length < 1) dispatch('STUDIO_SET_MODE', 'ADD_NEW_TRACK')
                else dispatch('STUDIO_SET_MODE', 'EDIT')
            })
            .subscribe(result => {
                commit('setProjectData', result)
            }, err => {
                switch(err.response.status){
                    case 404: router.push({ path: '/explore' })
                            break
                    case 401: dispatch('STUDIO_SET_MODE', 'NO_PERMISSION')
                            break
                }
            })

    },
    STUDIO_SYNC_PROJECT_DATA ({ commit, dispatch }, val) {
        dispatch('STUDIO_SET_MODE', 'SYNC_PROJECT')
        let projectData = ProjectsService.parseStudioToProjectData({ details: state.details, tracks: state.tracks })
        Observable.fromPromise(ProjectsService.syncProjectData(projectData))
            .pluck('data')
            .flatMap(data => {
                return Promise.resolve(ProjectsService.parseProjectData(data))
            }, (data, project) => ({ ...project }))
            .flatMap(project => {
                return Observable.from(project.tracks)
                        .flatMap(track => {
                            return StudioService.setTrackPlayer(track)
                        }, (track, sequences) => {
                            track.sequences = sequences
                            return track
                        })
                        .toArray()
            }, (project, tracks) => {
                project.tracks = tracks
                return project
            })
            .do((result) => { 
                //Set studio mode
                if(result.tracks.length < 1) dispatch('STUDIO_SET_MODE', 'ADD_NEW_TRACK')
                else dispatch('STUDIO_SET_MODE', 'EDIT')
            })
            .subscribe(result => {
                commit('setProjectData', result)
                dispatch('SET_STUDIO_CHANGE_SIGNAL', false)
            }, err => {
                switch(err.response.status){
                    case 404: router.push({ path: '/explore' })
                            break
                    case 401: dispatch('STUDIO_SET_MODE', 'NO_PERMISSION')
                            break
                }
            })
    },
    STUDIO_PLAY({commit}){
        commit('setStudioPlayingState', true)
    },
    STUDIO_PAUSE({ commit }){
        commit('setStudioPlayingState', false)
    },
    STUDIO_COUNTDOWN({ commit }){
        commit('setStudioMode', 'COUNTDOWN')
    },
    STUDIO_RECORD ({ commit }) {
        commit('setStudioMode', 'RECORD')
    },
    STUDIO_SET_MODE ({ commit }, val) {
        commit('setStudioMode', val)
    },
    MUTE_TRACK({ commit, dispatch }, val){
        commit('muteTrackById', val)
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    SOLO_TRACK({ commit, dispatch }, val){
        commit('soloTrackById', val)
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    UPDATE_TRACK_VOLUME({ commit, dispatch }, val){
        commit('updateTrackVolume', val)
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    TOGGLE_CHATBOX({commit}) {
        commit('toggleChatbox')
    },
    TOGGLE_METRONOME ({commit}) {
        commit('toggleMetronome')
    },
    ZOOM({commit}, val){
        commit('zoom', val)
    },
    SET_STAGE_WIDTH({commit}, val){
        commit('setStageWidth', val)
    },
    SCROLL_X_POSITION({commit}, val){
        commit('setCurrentScrollXPosition', val)
    },
    SET_STUDIO_CURRENT_TIME({commit}, val){
        commit('setStudioCurrentTimePercent', Math.max(0, Math.min(100, val)))
    },
    SET_SEEK_SIGNAL({ commit }) {
        commit('setSeekSignal', !state.env.seek_signal)
    },
    STUDIO_BEAT_FORWARD ({ dispatch }, val) {
        let beats = state.details.bars * state.details.time_signature
        let forwardPercent = val/beats
        dispatch('SET_STUDIO_CURRENT_TIME', state.env.currentTimePercent + forwardPercent * 100)
    },
    STUDIO_BEAT_BACKWARD ({ dispatch }, val) {
        let beats = state.details.bars * state.details.time_signature
        let backwardPercent = val/beats
        dispatch('SET_STUDIO_CURRENT_TIME', state.env.currentTimePercent - backwardPercent * 100)
    },
    SET_STUDIO_ACTIVE_TRACK ({ commit }, val) {
        commit('setStudioActiveTrack', val)
    },
    MOVE_CHORD_REGION({ dispatch, commit }, val) {
        let trackIndex = findTrackIndex(val.track_id)
        let regionIndex = findRegionIndex(trackIndex, val.region_id)
        commit('moveChordRegion', {
            currentIndex: {
                'trackIndex': trackIndex,
                'regionIndex': regionIndex
            },
            moveTo: val.moveTo
        })
        dispatch('CHECK_REGION_OVERLAPPING', { track_id: val.moveTo.trackIndex, region_id: val.region_id })
        dispatch('SET_STUDIO_ACTIVE_TRACK', state.tracks[val.moveTo.trackIndex].id)
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    MOVE_AUDIO_REGION ({ dispatch, commit }, val) {
        let trackIndex = findTrackIndex(val.track_id)
        let regionIndex = findRegionIndex(trackIndex, val.region_id)
        commit('moveAudioRegion', {
            currentIndex: {
                'trackIndex': trackIndex,
                'regionIndex': regionIndex
            },
            moveTo: val.moveTo
        })
        dispatch('CHECK_REGION_OVERLAPPING', { track_id: val.moveTo.trackIndex, region_id: val.region_id })
        dispatch('SET_STUDIO_ACTIVE_TRACK', state.tracks[val.moveTo.trackIndex].id)
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    RESIZE_CHORD_REGION ({ dispatch, commit }, val) {
        let trackIndex = findTrackIndex(val.track_id)
        let regionIndex = findRegionIndex(trackIndex, val.region_id)
        commit('resizeChordRegion', {
            currentIndex: {
                'trackIndex': trackIndex,
                'regionIndex': regionIndex
            },
            payload: val.payload
        })
        dispatch('CHECK_REGION_OVERLAPPING', { track_id: trackIndex, region_id: val.region_id })
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    RESIZE_AUDIO_REGION ({ dispatch, commit }, val) {
        let trackIndex = findTrackIndex(val.track_id)
        let regionIndex = findRegionIndex(trackIndex, val.region_id)
        commit('resizeAudioRegion', {
            currentIndex: {
                'trackIndex': trackIndex,
                'regionIndex': regionIndex
            },
            payload: val.payload
        })
        dispatch('CHECK_REGION_OVERLAPPING', { track_id: trackIndex, region_id: val.region_id })
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    CHECK_REGION_OVERLAPPING ({ dispatch }, val) {
        let trackIndex = val.track_id
        let regionIndex = findRegionIndex(trackIndex, val.region_id)
        let lastedRegion = state.tracks[trackIndex].sequences[regionIndex]
        Observable.of(state.tracks[trackIndex].sequences)
            .map(seq => {
                if(state.tracks[trackIndex].type === 'PIANO'){
                    return _.map(seq, (each, i) => {
                        if(i === regionIndex) return each
                        let a = lastedRegion.start_beat, b = lastedRegion.start_beat+lastedRegion.beat - 1
                        let x = each.start_beat, y = each.start_beat+each.beat - 1
                        if (a <= x && b >= y){
                            each.modified_time = Date.now()
                            each.beat = 0
                        } else if(a > x && b < y){
                            each.modified_time = Date.now()
                            each.beat = a - x
                            let newRegion = {
                                id: objectId(),
                                chord: each.chord,
                                modified_time: Date.now(),
                                start_beat: b + 1,
                                beat: y - b,
                                active: false
                            }
                            return [each, newRegion]
                        } else if(a <= y && a > x) {
                            each.modified_time = Date.now()
                            each.beat = a - x
                        } else if(b >= x && b < y) {
                            each.modified_time = Date.now()
                            each.start_beat = b + 1
                            each.beat = y - b
                        }
                        return each
                    })
                } else {
                    return _.map(seq, (each, i) => {
                        if(i === regionIndex) return each
                        let bpm = state.details.bpm
                        let a = lastedRegion.start_beat, b = lastedRegion.start_beat+StudioService.milliseconds2beats(bpm, lastedRegion.original_length - lastedRegion.trim_left - lastedRegion.trim_right) - 1
                        let x = each.start_beat, y = each.start_beat+StudioService.milliseconds2beats(bpm, each.original_length - each.trim_left - each.trim_right) - 1
                        if (a <= x && b >= y){
                            each.modified_time = Date.now()
                            each.original_length = 0
                        } else if(a > x && b < y){
                            let newRegion = {
                                id: objectId(),
                                url: each.url,
                                modified_time: Date.now(),
                                original_length: each.original_length,
                                start_beat: b + 1,
                                trim_left: each.original_length - StudioService.beats2milliseconds(bpm, y - b),
                                trim_right: each.trim_right,
                                active: false
                            }
                            each.modified_time = Date.now()
                            each.trim_right = each.original_length - StudioService.beats2milliseconds(bpm, a - x)
                            return [each, newRegion]
                        } else if(a <= y && a > x) {
                            each.modified_time = Date.now()
                            each.trim_right = (each.original_length - each.trim_left) - StudioService.beats2milliseconds(bpm, a - x)
                        } else if(b >= x && b < y) {
                            each.modified_time = Date.now()
                            each.start_beat = b + 1
                            each.trim_left = (each.original_length - each.trim_right) - StudioService.beats2milliseconds(bpm, y - b)
                        }
                        return each
                    })
                }
            })
            .map(seq => _.flattenDeep(seq))
            .map(seq => _.filter(seq, each => each.beat > 0 || each.original_length > 0))
            .subscribe(seq => {
                dispatch('UPDATE_TRACK_SEQUENCES', {
                    track_id: val.track_id,
                    payload: seq
                })
            })
    },
    UPDATE_TRACK_SEQUENCES ({ commit }, val) {
        let trackIndex = val.track_id
        commit('updateTrackSequences', {
            trackIndex,
            payload: val.payload
        })   
    },
    SELECT_REGION ({ commit }, val) {
        let trackIndex = findTrackIndex(val.track_id)
        let regionIndex = findRegionIndex(trackIndex, val.region_id)
        commit('setActiveRegion', {
            trackIndex,
            regionIndex,
            payload: true
        })
    },
    UNSELECT_REGION ({ commit }, val) {
        let trackIndex = findTrackIndex(val.track_id)
        let regionIndex = findRegionIndex(trackIndex, val.region_id)
        commit('setActiveRegion', {
            trackIndex,
            regionIndex,
            payload: false
        })
    },
    CLEAR_SELECTED_REGION ({ commit }) {
        state.tracks.forEach((track, trackIndex) => {
            track.sequences.forEach((region, regionIndex) => {
                if(region.active === true) commit('setActiveRegion', {
                    trackIndex,
                    regionIndex,
                    payload: false
                })
            })
        })
    },
    CLEAR_SELECTED_TRACK_REGION ({ commit }, val) {
        let trackIndex = findTrackIndex(val.track_id)
        state.tracks[trackIndex].sequences.forEach((region, regionIndex) => {
            if(region.active === true) commit('setActiveRegion', {
                trackIndex,
                regionIndex,
                payload: false
            })
        })
    },
    DELETED_REGION ({ commit, dispatch }, val) {
        let trackIndex = findTrackIndex(val.track_id)
        let regionIndex = findRegionIndex(trackIndex, val.region_id)
        commit('deleteRegion', {
            trackIndex,
            regionIndex
        })
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    DELETE_SELECTED_REGION ({ commit, dispatch }) {
        state.tracks.forEach((track, trackIndex) => {
            track.sequences.forEach((region, regionIndex) => {
                if(region.active === true) commit('deleteRegion', {
                    trackIndex,
                    regionIndex,
                })
            })
        })
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    ADD_CHORD_REGION ({ commit, dispatch }, val) {
        let currentTimeBeats = getters.getStudioCurrentTimeBeats(state)
        let currentTimeBeatsFloor = Math.floor(currentTimeBeats)
        let currentTimeBeatsSimplify = currentTimeBeatsFloor + Math.round(currentTimeBeats - currentTimeBeatsFloor) - 1
        let beats = state.details.bars * state.details.time_signature
        dispatch('SET_STUDIO_CURRENT_TIME', (currentTimeBeatsSimplify/beats) * 100)
        let newChord = {
            id: objectId(),
            modified_time: Date.now(),
            chord: val.chord_id,
            beat: val.chord_duration,
            start_beat: getters.getStudioCurrentTimeBeats(state),
            active: false
        }
        commit('addChordRegion', newChord)
        dispatch('STUDIO_BEAT_FORWARD', val.chord_duration)
        dispatch('CHECK_REGION_OVERLAPPING', {
            track_id: _.findIndex(state.tracks, (track) => track.active),
            region_id: newChord.id
        })
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    ADD_AUDIO_REGION ({ commit, dispatch }, val) {
        let newAudioRegion = {
            id: objectId(),
            modified_time: Date.now(),
            url: null,
            player: null,
            start_beat: getters.getStudioCurrentTimeBeats(state),
            active: false,
            recording: val.recording ? val.recording : true,
            original_length: 0,
            trim_left: 0,
            trim_right: 0
        }
        commit('addAudioRegion', newAudioRegion)
    },
    UPDATE_RECORDING_REGION ({ commit, dispatch }) {
        commit('updateRecordingRegion')
    },
    FINISH_RECORDING_REGION ({ commit, dispatch }, val) {
        let activeTrack = getters.getStudioActiveTrack(state)
        let recordingIndex = _.findIndex(activeTrack.sequences, seq => seq.recording)
        let recordingRegion = activeTrack.sequences[recordingIndex]
        recordingRegion.url = val.url
        recordingRegion.player = val.player
        recordingRegion.original_length = val.player.duration() * 1000
        commit('finishRecordingRegion', recordingRegion)
        dispatch('CHECK_REGION_OVERLAPPING', {
            track_id: _.findIndex(state.tracks, track => track.id === activeTrack.id),
            region_id: recordingRegion.id
        })
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    STUDIO_ADD_NEW_TRACK ({ commit, dispatch }, val) {
        commit('studioAddNewTrack', val)
        dispatch('SET_STUDIO_CHANGE_SIGNAL', true)
    },
    RESET_STUDIO_ENV ({ commit }) {
        commit('resetStudioEnv')
    },
    STUDIO_ADD_MESSAGE_EVENT ({ commit }, val) {
        commit('addMessageEvent', val)
    },
    SET_STUDIO_SOCKET ({ commit }, val) {
        let connection = StudioService.defineSocketConnection(result.details.project_id, store.getters.getUserProfileData.user_id)
        commit('setStudioSocket', connection)
    },
    STUDIO_SEND_MESSAGE ({ commit, dispatch }, val) {
        let last_update = Date.now().toString()
        dispatch('STUDIO_ADD_MESSAGE_EVENT', {
            msg_id: objectId(),
            sender_id: val.user_id,
            type: 'MESSAGES',
            last_update: last_update,
            messages: [
                {
                    datetime: last_update,
                    message: val.message
                }
            ]
        })
        state.studioSocket.emit('send_message', {
            project_id: state.details.project_id,
            user_id: val.user_id,
            message: val.message
        })
    },
    SET_STUDIO_CHANGE_SIGNAL ({ commit }, val) {
        commit('setStudioChangeSignal', val)
    }
}

const getters = {
    getStudioTracks: state => state.tracks,
    isChatboxShow: state => state.chat.show,
    getStudioDetails: state => state.details,
    getStudioEnv: state => state.env,
    getStudioCurrentKey: state => StudioService.keyMap[state.details.key - 1],
    getStageWidth: state => state.env.stage_width,
    getZoomLevel: state => state.env.zoomLevel,
    getStudioSnapGrid: state => {
        let perBar = state.env.stage_width / state.details.bars
        let perBeat = perBar / state.details.time_signature
        let avoid = Math.round(14/perBeat) * 2
        return perBeat * Math.max(1, avoid)
    },
    getStudioCurrentScrollXPosition: state => state.env.currentScrollXPos,
    getStudioWholeDuration: state => {
        let beats = state.details.bars * state.details.time_signature
        return (beats/state.details.bpm*60)
    },
    getStudioCurrentTimePercent: state => state.env.currentTimePercent,
    getStudioCurrentTimePixel: state => (state.env.currentTimePercent/100) * state.env.stage_width,
    getStudioCurrentTimeBeats: state => (state.env.currentTimePercent/100) * (state.details.bars * state.details.time_signature) + 1,
    getStudioCurrentTime: state => {
        let beats = state.details.bars * state.details.time_signature
        return ((state.env.currentTimePercent/100) * beats) / state.details.bpm * 60
    },
    getStudioActiveTrack: state => {
        return _.find(state.tracks, (track) => track.active)
    },
    getStudioChat: state => state.chat
}

export default {
    state,
    mutations,
    actions,
    getters
}