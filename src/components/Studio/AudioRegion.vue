<template>
    <div ref="region" @mousedown="setActive()" :class="{ 'active': region_data.active }"> 
        <div class="resize-left"></div>
        <div class="chord-name" v-if="track_data.type === 'PIANO'">{{ currentChord }}</div>
        <div class="time-signature" v-if="track_data.type === 'PIANO'">{{ time_signature }}</div>
        <div class="resize-right"></div>
    </div>  
</template>

<script>

import { mapGetters } from 'vuex'
import { StudioService } from '../../services'

export default {
    props: ['track_data', 'region_data'],
    data: () => ({
        container: null
    }),
    mounted(){
        this.container = $(this.$refs.region)
        this.renderRegion()
        let parentNode = this.$refs.region.parentNode
        $(parentNode).on('click', e => {
            if(e.target === parentNode) this.$store.dispatch('CLEAR_SELECTED_REGION')
        })
    },
    methods: {
        renderRegion() {
            if(this.track_data.type === 'PIANO') {
                this.container.css('width', this.region_data.beat * this.beatWidth)
            } else {
                this.container.css('width',  ((this.region_data.original_length - (this.region_data.trim_left + this.region_data.trim_right))/1000)/this.songDuration*this.stageWidth)
            }
            this.container.css('left', this.beatWidth * (this.region_data.start_beat - 1))
        },
        setActive () {
            if(!this.region_data.active) {
                this.$store.dispatch('CLEAR_SELECTED_REGION')
                this.$store.dispatch('SELECT_REGION', {
                    track_id: this.track_data.id,
                    region_id: this.region_data.id
                })
            } else {
                // this.$store.dispatch('UNSELECT_REGION', {
                //     track_id: this.track_data.id,
                //     region_id: this.region_data.id
                // })
            }
        }
    },
    computed: {
        currentChord () {
            return StudioService.mapChord(this.currentKey, this.region_data.chord)
        },
        time_signature() {
            return `${this.region_data.beat}/${this.details.time_signature}`
        },
        beatWidth() {
            let beats = this.details.bars * this.details.time_signature
            return this.stageWidth / beats
        },
        ...mapGetters({ details: 'getStudioDetails', stageWidth: 'getStageWidth', currentKey: 'getStudioCurrentKey', songDuration: 'getStudioWholeDuration' })
    },
    watch: {
        stageWidth () {
            this.renderRegion()
        },
        time_signature (){
            this.renderRegion()
        },
        'region_data.trim_left': function() { this.renderRegion() },
        'region_data.trim_right': function() { this.renderRegion() },
        'region_data.original_length': function() { this.renderRegion() }
    }
}
</script>
