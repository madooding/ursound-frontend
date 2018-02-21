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
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TrackControl from '../components/Studio/TrackControl'

export default {
    components: {
        TrackControl
    },
    data: () => ({}),
    computed: {
        ...mapGetters({'tracks': 'getTracks'})
    }
}

</script>
