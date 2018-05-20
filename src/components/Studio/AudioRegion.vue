<template>
    <div ref="region" @mousedown="setActive()" :class="{ 'active': region_data.active, 'muted': track_data.muted || (isSoloMode && !track_data.solo) }"> 
        <div class="resize-left"></div>
        <div class="chord-name" v-if="track_data.type === 'PIANO'">{{ currentChord }}</div>
        <div class="time-signature" v-if="track_data.type === 'PIANO'">{{ time_signature }}</div>
        <div class="resize-right"></div>
        <div class="audio-waveform" ref="waveform" v-if="track_data.type === 'AUDIO'"></div>
    </div>  
</template>

<script>

import { mapGetters } from 'vuex'
import { StudioService } from '../../services'

export default {
    props: ['track_data', 'region_data'],
    data: () => ({
        container: null,
        wavesurfer: null,
        waveform: null
    }),
    mounted(){
        this.container = $(this.$refs.region)
        this.waveform = $(this.$refs.waveform)
        this.renderRegion()
        let parentNode = this.$refs.region.parentNode
        $(parentNode).on('click', e => {
            if(e.target === parentNode) this.$store.dispatch('CLEAR_SELECTED_REGION')
        })
    },
    updated () {
        
    },
    methods: {
        renderRegion() {
            if(this.track_data.type === 'PIANO') {
                this.container.css('width', this.region_data.beat * this.beatWidth)
            } else {
                this.container.css('width',  ((this.region_data.original_length - (this.region_data.trim_left + this.region_data.trim_right))/1000)/this.songDuration*this.stageWidth)
                this.waveform.css('min-width', (this.region_data.original_length/1000)/this.songDuration*this.stageWidth)
                if(this.region_data.url){
                    this.wavesurfer = WaveSurfer.create({
                        container: this.$refs.waveform,
                        barHeight: 1,
                        height: this.container.height(),
                        responsive: true,
                        interact: false,
                        hideScrollbar: true,
                        waveColor: this.waveColor,
                        cursorWidth: 0
                    })
                    this.wavesurfer.load(this.region_data.url)
                    this.waveform.css('left', -(this.beatWidth * StudioService.milliseconds2beats(this.details.bpm, this.region_data.trim_left)))

                }
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
            return StudioService.mapChord(this.details.key-1, this.region_data.chord)
        },
        time_signature() {
            return `${this.region_data.beat}/${this.details.time_signature}`
        },
        beatWidth() {
            let beats = this.details.bars * this.details.time_signature
            return this.stageWidth / beats
        },
        waveColor () {
            if(this.track_data.muted || (this.isSoloMode && !this.track_data.solo)) {
                if (this.region_data.active) return '#D0D1D3'
                return '#73757D'
            } return '#996AA2'
        },
        ...mapGetters({ details: 'getStudioDetails', stageWidth: 'getStageWidth', currentKey: 'getStudioCurrentKey', songDuration: 'getStudioWholeDuration', isSoloMode: 'getStudioSoloMode' })
    },
    watch: {
        stageWidth () {
            if(this.track_data.type === 'AUDIO') $(this.$refs.waveform).empty();
            this.renderRegion()
        },
        time_signature (){
            this.renderRegion()
        },
        waveColor () {
            if(this.track_data.type === 'AUDIO') $(this.$refs.waveform).empty();
            this.renderRegion()
        },
        'region_data.trim_left': function() { this.renderRegion() },
        'region_data.trim_right': function() { this.renderRegion() },
        'region_data.original_length': function() { this.renderRegion() }
    }
}
</script>
