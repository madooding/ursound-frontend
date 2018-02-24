<template>
    <div class="studio">
        <div class="top-bar">
            <div class="left-side"></div>
            <beat-ruler></beat-ruler>
        </div>
        <div class="track-section">
            <div class="tracks-panel">
                <TrackControl v-for="track in tracks" :key="track.id" v-bind:track_data="track"></TrackControl>
                <div class="track track--add-new-track">
                    + Add New Track
                </div>
            </div>
            <div class="tracks">
                <TrackLane v-for="track in tracks" :key="track.id" v-bind:track_data="track"></TrackLane>
            </div>
        </div>
        <ChatBox></ChatBox>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TrackControl from '../components/Studio/TrackControl'
import ChatBox from '../components/Studio/ChatBox'
import BeatRuler from '../components/Studio/BeatRuler'
import TrackLane from '../components/Studio/TrackLane'

export default {
    components: {
        TrackControl,
        ChatBox,
        BeatRuler,
        TrackLane
    },
    data: () => ({}),
    computed: {
        ...mapGetters({'tracks': 'getTracks'})
    }
}

</script>

<style scoped>
body {
    overflow-x: hidden;
}
</style>
