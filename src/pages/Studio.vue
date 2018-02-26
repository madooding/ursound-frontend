<template>
    <div class="studio">
        <div class="top-bar">
            <div class="left-side"></div>
            <beat-ruler v-bind:scrollX="scrollX"></beat-ruler>
        </div>
        <div class="track-section">
            <div class="tracks-panel">
                <TrackControl v-for="track in tracks" :key="track.id" v-bind:track_data="track"></TrackControl>
                <div class="track track--add-new-track">
                    + Add New Track
                </div>
            </div>
            <div class="tracks" ref="tracks">
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
    data: () => ({
        zoom: 100,
        scrollX: 0
    }),
    created() {
    },
    mounted() {
        let tracks = $(this.$refs.tracks)
        this.$store.dispatch('SET_STAGE_WIDTH', tracks.width())
        tracks.on('mousewheel', e => {
            if (e.altKey){
                let beats = (this.details.bars * this.details.time_signature)
                e.preventDefault()
                if(e.originalEvent.wheelDelta /120 > 0) {
                    this.zoom += 5
                    this.zoom = Math.min(this.zoom, 200)
                    this.$store.dispatch('ZOOM', this.zoom)
                    this.$store.dispatch('SET_STAGE_WIDTH', tracks.width()*(this.zoom/100))
                }
                else{
                    if((tracks.width()/beats*(this.zoom/100)) * beats > tracks.width()){
                        this.zoom -= 5
                        let beats = (this.details.bars * this.details.time_signature)
                        this.zoom = Math.max(5, this.zoom)
                        this.$store.dispatch('ZOOM', this.zoom)
                        this.$store.dispatch('SET_STAGE_WIDTH', tracks.width()*(this.zoom/100))
                    }
                }
            }
        })
        tracks.on('scroll', e => {
            this.scrollX = tracks.scrollLeft()
        })
        $(window).on('resize', () => {
            this.$store.dispatch('SET_STAGE_WIDTH', tracks.width() * (this.details.zoomLevel/100))
        })
    },
    computed: {
        ...mapGetters({'tracks': 'getTracks', 'stageWidth': 'getStageWidth', details: 'getStudioDetails'})
    }
}

</script>

<style scoped>
body {
    overflow-x: hidden;
    background-color: #161A27 !important;
}
</style>
