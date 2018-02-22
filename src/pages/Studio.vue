<template>
    <div class="studio">
        <div class="top-bar">
            <div class="left-side"></div>
            <div class="beat-ruler"></div>
        </div>
        <div class="track-section">
            <div class="tracks-panel">
                <TrackControl v-for="track in tracks" :key="track.id" v-bind:track_data="track"></TrackControl>
                <div class="track track--add-new-track">
                    + Add New Track
                </div>
            </div>
            <div class="tracks">
            </div>
        </div>
        <ChatBox></ChatBox>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TrackControl from '../components/Studio/TrackControl'
import ChatBox from '../components/Studio/ChatBox'

export default {
    components: {
        TrackControl,
        ChatBox
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
