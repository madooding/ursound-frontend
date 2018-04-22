<template>
    <div class="studio">
        <div class="top-bar">
            <div class="left-side"></div>
            <beat-ruler></beat-ruler>
        </div>
        <div class="track-section">
            <div class="tracks-panel">
                <TrackControl v-for="track in tracks" :key="track.id" v-bind:track_data="track" @click.native="setActive(track.id)" :class="{'active': track.active}"></TrackControl>
                <div class="track track--add-new-track">
                    + Add New Track
                </div>
            </div>
            <tracks-component></tracks-component>
        </div>
        <ChordSuggestions></ChordSuggestions>
        <ChatBox></ChatBox>
        <CountdownModal></CountdownModal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TrackControl from '../components/Studio/TrackControl'
import ChatBox from '../components/Studio/ChatBox'
import BeatRuler from '../components/Studio/BeatRuler'
import TracksComponent from '../components/Studio/Tracks'
import ChordSuggestions from '../components/Studio/ChordSuggestions'
import CountdownModal from '../components/Studio/CountdownModal'

export default {
    components: {
        TrackControl,
        ChatBox,
        BeatRuler,
        TracksComponent,
        ChordSuggestions,
        CountdownModal
    },
    data: () => ({
        zoom: 100,
        scrollX: 0
    }),
    methods: {
        setActive (id) {
            this.$store.dispatch('SET_STUDIO_ACTIVE_TRACK', id)
        }
    },
    computed: {
        ...mapGetters({ 'tracks': 'getStudioTracks', 'studioEnv': 'getStudioEnv' })
    }
}

</script>

<style scoped>
body {
    overflow-x: hidden;
    background-color: #161A27 !important;
}
</style>
