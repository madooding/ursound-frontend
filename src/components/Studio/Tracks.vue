<template>
    <div class="tracks" ref="tracks">
        <TrackLane v-for="track in tracks" :key="track.id" v-bind:track_data="track" @click.native="setActive(track.id)"></TrackLane>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TrackLane from './TrackLane'
import { StudioService } from '../../services'
import { Observable } from 'rxjs'
export default {
    components: {
        TrackLane
    },
    data: () => ({
        zoom: 100,
        loading: true
    }),
    mounted() {
        let tracks = $(this.$refs.tracks)
        StudioService.defineInstrument()
            .subscribe(res => {
                this.loading = false
            })
        this.$store.dispatch('SET_STAGE_WIDTH', (29 * (this.details.bars * this.details.time_signature))*(this.zoom/100))
        tracks.on('mousewheel', e => {
            if (e.altKey){
                let beats = (this.details.bars * this.details.time_signature)
                e.preventDefault()
                if(e.originalEvent.wheelDelta /120 > 0) {
                    this.zoom += 5
                    this.zoom = Math.min(this.zoom, 200)
                    this.$store.dispatch('ZOOM', this.zoom)
                    this.$store.dispatch('SET_STAGE_WIDTH', Math.max(tracks.width(), (29 * beats)*(this.zoom/100)))
                }
                else{
                    if(((29 * beats) * ((this.zoom-5)/100)) > tracks.width()){
                        this.zoom -= 5
                        let beats = (this.details.bars * this.details.time_signature)
                        this.zoom = Math.max(5, this.zoom)
                        this.$store.dispatch('ZOOM', this.zoom)
                        this.$store.dispatch('SET_STAGE_WIDTH', Math.max(tracks.width(), (29 * beats)*(this.zoom/100)))
                    } else if(this.stageWidth > tracks.width()){
                        this.zoom -= 5
                        this.$store.dispatch('SET_STAGE_WIDTH', tracks.width())
                    }
                }
            }
        })
        tracks.on('scroll', e => {
            this.$store.dispatch('SCROLL_X_POSITION', tracks.scrollLeft())
        })
        $(window).on('resize', () => {
            this.$store.dispatch('SET_STAGE_WIDTH', Math.max((29 * (this.details.bars * this.details.time_signature)) * (this.zoomLevel/100), $(this.$refs.tracks).width()))
        })
    },
    methods: {
        setActive (id) {
            this.$store.dispatch('SET_STUDIO_ACTIVE_TRACK', id)
        }
    },
    watch: {
        scrollX() {
            $(this.$refs.tracks).scrollLeft(this.scrollX)
        },
        stageWidth() {
            this.$store.dispatch('RESET_STUDIO_TRACKLANE_CANVAS')
        }
    },
    computed: {
        ...mapGetters({'tracks': 'getStudioTracks', 'stageWidth': 'getStageWidth', details: 'getStudioDetails', zoomLevel: 'getZoomLevel', scrollX: 'getStudioCurrentScrollXPosition'})
    }
}
</script>