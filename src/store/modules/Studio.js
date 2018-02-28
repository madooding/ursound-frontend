import _ from 'lodash'

const state = {
    env: {
        zoomLevel: 100,
        stage_width: 0,
        currentScrollXPos: 0,
        currentTimePercent: 15
    },
    details: {
        name: "Untitled-2",
        cover: "",
        genre: "",
        bpm: 80,
        time_signature: 4,
        bars: 32,
        isMetronomeOn: false,
        key: "C",
        description: ""
    },
    tracks: [
        {   
            id: 1,
            name: "Smart Piano",
            type: 'PIANO',
            volume: 60,
            solo: false,
            muted: false
        },
        {
            id: 2,
            name: "Voice",
            type: 'AUDIO',
            volume: 80,
            solo: false,
            muted: true 
        },
        {
            id: 3,
            name: "Voice",
            type: 'AUDIO',
            volume: 80,
            solo: false,
            muted: true 
        },
        {
            id: 4,
            name: "Voice",
            type: 'AUDIO',
            volume: 80,
            solo: false,
            muted: true 
        }
    ],
    chat: {
        show: false
    }
}

const mutations = {
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
    },
    zoom(state, val) {
        state.env.zoomLevel = val
    },
    setStageWidth(state, val) {
        state.env.stage_width = val
    },
    setCurrentScrollXPosition(state, val){
        state.env.currentScrollXPos = val
    },
    setStudioCurrentTimePercent(state, val){
        state.env.currentTimePercent = val
    }
}

const actions = {
    MUTE_TRACK({commit}, val){
        commit('muteTrackById', val)
    },
    SOLO_TRACK({commit}, val){
        commit('soloTrackById', val)
    },
    UPDATE_TRACK_VOLUME({commit}, val){
        commit('updateTrackVolume', val)
    },
    TOGGLE_CHATBOX({commit}) {
        commit('toggleChatbox')
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
        commit('setStudioCurrentTimePercent', val)
    }
}

const getters = {
    getTracks: state => state.tracks,
    isChatboxShow: state => state.chat.show,
    getStudioDetails: state => state.details,
    getStageWidth: state => state.env.stage_width,
    getZoomLevel: state => state.env.zoomLevel,
    getStudioSnapGrid: state => {
        let perBar = state.env.stage_width / state.details.bars
        let perBeat = perBar / state.details.time_signature
        let avoid = Math.round(14/perBeat) * 2
        return perBeat * Math.max(1, avoid)
    },
    getStudioCurrentScrollXPosition: state => state.env.currentScrollXPos,
    getStudioCurrentTimePercent: state => state.env.currentTimePercent,
    getStudioCurrentTimePixel: state => (state.env.currentTimePercent/100) * state.env.stage_width,
    getStudioCurrentTime: state => {
        let beats = state.details.bars * state.details.time_signature
        return ((state.env.currentTimePercent/100) * beats) / state.details.bpm * 60
    }

}

export default {
    state,
    mutations,
    actions,
    getters
}