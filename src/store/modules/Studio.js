import studio, { StudioService } from '../../services'
import _ from 'lodash'
import { Observable } from 'rxjs'

const findTrackIndex = (id) => {
   return _.findIndex(state.tracks, each => each.id === id)
}
const findRegionIndex = (trackIndex, regionId) => {
    return _.findIndex(state.tracks[trackIndex].sequences, each => each.id === regionId)
}

const objectId = () => {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
}

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
        key: 1,
        description: ""
    },
    tracks: [
        {   
            id: '5aa18167142a86f9a1bed5c6',
            modified_time: '1520534666935',
            name: "Smart Piano",
            type: 'PIANO',
            volume: 60,
            solo: false,
            muted: false,
            active: false,
            sequences: [
                {
                    id: '5aa18432096b49808d94365b',
                    modified_time: '1520534640605',
                    chord: '1',
                    beat: 4,
                    start_beat: 1,
                    active: false
                },
                {
                    id: '5aa58510ffd1c66bd284692c',
                    modified_time: '1520796970421',
                    chord: '6',
                    beat: 4,
                    start_beat: 5,
                    active: false
                },
                {
                    id: '5aa5879529e4861250e3b7ad',
                    modified_time: '1520797602077',
                    chord: '4',
                    beat: 4,
                    start_beat: 9,
                    active: false
                },
                {
                    id: '5aa587cdfd959911fc2e570c',
                    modified_time: '1520797657368',
                    chord: '5',
                    beat: 4,
                    start_beat: 13,
                    active: false
                },
            ]
        },
        {
            id: '5aa1818f0fd5c9c6999c3e91',
            modified_time: '1520534696744',
            name: "Voice",
            type: 'AUDIO',
            volume: 80,
            solo: false,
            muted: true,
            active: false,
            sequences: []
        },
        {
            id: '5aa1819c4b1d20827767759a',
            modified_time: '1520534710381',
            name: "Voice",
            type: 'PIANO',
            volume: 80,
            solo: false,
            muted: true,
            active: false,
            sequences: [] 
        },
        {
            id: '5aa18257e1d9d93db99ba4ba',
            modified_time: '1520534736609',
            name: "Voice",
            type: 'AUDIO',
            volume: 80,
            solo: false,
            muted: true,
            active: false,
            sequences: [] 
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
        state.env.currentScrollXPos = Math.min(state.env.stage_width, Math.max(0, val))
    },
    setStudioCurrentTimePercent(state, val){
        state.env.currentTimePercent = val
    },
    setStudioActiveTrack(state, val) {
        state.tracks = _.map(state.tracks, each => {
            if (each.id == val) each.active = true
            else each.active = false
            return each
        })
    },
    moveAudioRegion(state, val){
        let regionData = state.tracks[val.currentIndex.trackIndex].sequences[val.currentIndex.regionIndex]
        let modified_time = Date.now()
        regionData.start_beat = val.moveTo.startBeat
        regionData.modified_time = modified_time
        state.tracks[val.moveTo.trackIndex].sequences.push(regionData)
        state.tracks[val.moveTo.trackIndex].modified_time = modified_time
        state.tracks[val.currentIndex.trackIndex].sequences.splice(val.currentIndex.regionIndex, 1)
    },
    resizeAudioRegion (state, val) {
        let regionData = state.tracks[val.currentIndex.trackIndex].sequences[val.currentIndex.regionIndex]
        let modified_time = Date.now()
        regionData.start_beat = val.payload.startBeat
        regionData.beat = val.payload.duration
        regionData.modified_time = modified_time
        state.tracks[val.currentIndex.trackIndex].sequences[val.currentIndex.regionIndex] = regionData
    },
    updateTrackSequences (state, val) {
        state.tracks[val.trackIndex].sequences = val.payload
    },
    setActiveRegion (state, val) {
        state.tracks[val.trackIndex].sequences[val.regionIndex].active = val.payload
    },
    deleteRegion (state, val) {
        state.tracks[val.trackIndex].sequences.splice(val.regionIndex, 1)
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
    },
    SET_STUDIO_ACTIVE_TRACK ({ commit }, val) {
        commit('setStudioActiveTrack', val)
    },
    MOVE_AUDIO_REGION({ dispatch, commit }, val) {
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
        dispatch('CHECK_REGION_OVERLAPPING', { track_id: trackIndex, region_id: val.region_id})
    },
    CHECK_REGION_OVERLAPPING ({ dispatch, commit }, val) {
        let trackIndex = val.track_id
        let regionIndex = findRegionIndex(trackIndex, val.region_id)
        let lastedRegion = state.tracks[trackIndex].sequences[regionIndex]
        Observable.of(state.tracks[trackIndex].sequences)
            .map(seq => {
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
            })
            .map(seq => _.flattenDeep(seq))
            .map(seq => _.filter(seq, each => each.beat > 0))
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
    DELETE_SELECTED_REGION ({ commit }) {
        state.tracks.forEach((track, trackIndex) => {
            track.sequences.forEach((region, regionIndex) => {
                if(region.active === true) commit('deleteRegion', {
                    trackIndex,
                    regionIndex,
                })
            })
        })
    }
}

const getters = {
    getStudioTracks: state => state.tracks,
    isChatboxShow: state => state.chat.show,
    getStudioDetails: state => state.details,
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
    getStudioCurrentTimePercent: state => state.env.currentTimePercent,
    getStudioCurrentTimePixel: state => (state.env.currentTimePercent/100) * state.env.stage_width,
    getStudioCurrentTime: state => {
        let beats = state.details.bars * state.details.time_signature
        return ((state.env.currentTimePercent/100) * beats) / state.details.bpm * 60
    },
    getStudioActiveTrack: state => {
        return _.find(state.tracks, (track) => track.active)
    }

}

export default {
    state,
    mutations,
    actions,
    getters
}