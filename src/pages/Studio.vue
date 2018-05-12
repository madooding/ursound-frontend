<template>
    <div class="studio">
        <div class="top-bar">
            <div class="left-side"></div>
            <beat-ruler></beat-ruler>
        </div>
        <div class="track-section">
            <div class="tracks-panel">
                <TrackControl v-for="track in tracks" :key="track.id" v-bind:track_data="track" @click.native="setActive(track.id)" :class="{'active': track.active}"></TrackControl>
                <div class="track track--add-new-track" @click="addNewTrack()">
                    + Add New Track
                </div>
            </div>
            <tracks-component></tracks-component>
        </div>
        <ChordSuggestions></ChordSuggestions>
        <ChatBox :project_id="project_id"></ChatBox>
        <CountdownModal></CountdownModal>
        <NewTrackModal></NewTrackModal>
        <add-contributor-modal></add-contributor-modal>
        <no-permission-modal></no-permission-modal>
        <ModeModal></ModeModal>
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
import NewTrackModal from '../components/Studio/NewTrackModal'
import NoPermissionModal from '../components/Studio/NoPermissionModal'
import AddContributorModal from '../components/Studio/AddContributorModal'
import ModeModal from '../components/Studio/ModeModal'


import { ProjectsService } from '../services'



export default {
    props: ['project_id'],
    components: {
        TrackControl,
        ChatBox,
        BeatRuler,
        TracksComponent,
        ChordSuggestions,
        CountdownModal,
        NewTrackModal,
        NoPermissionModal,
        AddContributorModal,
        ModeModal
    },
    created () {
        this.$store.dispatch('STUDIO_LOAD_PROJECT_DATA', { project_id: this.project_id })
    },
    data: () => ({
        zoom: 100,
        scrollX: 0,
        loading: false
    }),
    methods: {
        setActive (id) {
            this.$store.dispatch('SET_STUDIO_ACTIVE_TRACK', id)
        },
        addNewTrack () {
            this.$store.dispatch('STUDIO_SET_MODE', 'ADD_NEW_TRACK')
        }
    },
    computed: {
        ...mapGetters({ 'tracks': 'getStudioTracks', 'studioEnv': 'getStudioEnv' })
    },
    beforeDestroy () {
        this.$store.dispatch('RESET_STUDIO_ENV')
    }
}

</script>

<style scoped>
body {
    overflow-x: hidden;
    background-color: #161A27 !important;
}
</style>
