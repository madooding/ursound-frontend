

const state = {
    song_data: {
        id: 3,
        name: "Untitled-3",
        owner: "madooding",
        url: "https://wavesurfer-js.org/example/media/small-demo.wav",
        cover_url: "https://marketplace.canva.com/MACF-O76mPY/1/0/thumbnail_large/canva--sunset-indie-album-cover-MACF-O76mPY.jpg",
        duration: 21.77387755102041,
        actions: {
            comments: 2,
            likes: 43
        },
        currentTime: 0
    },
    currentTime: 0,
    isPlaying: false,
    seekSignal: false,
    changeSongWhilePlaying: false
}

const mutations = {
    setCurrentSongData(state, val) {
        state.song_data = val
    },
    setPlayingState(state, val) {
        state.isPlaying = val
    },
    setPlayerCurrentTime(state, val) {
        state.song_data.currentTime = val
    },
    setSeekSignal(state, val) {
        state.seekSignal = val
    },
    setChangeSongWhilePlayingSignal(state, val){
        state.changeSongWhilePlaying = val
    }
}

const actions = {
    PLAY_SONG({commit}, val) {
        commit('setCurrentSongData', val.song_data)
        commit('setPlayingState', true)
    },
    PAUSE_SONG({commit}) {
        commit('setPlayingState', false)
    },
    RESUME_PLAYING({commit}) {
        commit('setPlayingState', true)
    },
    UPDATE_CURRENT_TIME({commit}, currentTime) {
        commit('setPlayerCurrentTime', currentTime)
    },
    SEEK({commit}, time) {
        commit('setSeekSignal', time)
    },
    CHANGE_SONG_WHILE_PLAYING({commit}, val){
        commit('setChangeSongWhilePlayingSignal', val)
    }
}

const getters = {
    isPlayerPlaying: (state) => state.isPlaying,
    getPlayerCurrentSongData: (state) => state.song_data,
    getPlayerCurrentTime: (state) => state.song_data.currentTime,
    getSeekSignal: state => state.seekSignal,
    getChangeSongWhilePlayingSignal: state => state.changeSongWhilePlaying
}

export default {
    state,
    mutations,
    actions,
    getters
}