import _ from 'lodash'

const state = {
    details: {
        name: "Untitled-2",
        cover: "",
        genre: "",
        bpm: 70,
        time_signature: "",
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
    }
}

const getters = {
    getTracks: state => state.tracks,
    isChatboxShow: state => state.chat.show
}

export default {
    state,
    mutations,
    actions,
    getters
}