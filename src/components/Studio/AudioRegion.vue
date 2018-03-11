<template>
    <div ref="region">
        <div class="chord-name" v-if="track_data.type === 'PIANO'">{{ region_data.chord }}</div>
        <div class="time-signature" v-if="track_data.type === 'PIANO'">{{ time_signature }}</div>
    </div>  
</template>

<script>

import { mapGetters } from 'vuex'

export default {
    props: ['track_data', 'region_data'],
    data: () => ({
        container: null
    }),
    mounted(){
        this.container = $(this.$refs.region)
        this.renderRegion()
    },
    methods: {
        renderRegion() {
            this.container.css('width', this.region_data.beat * this.beatWidth)
        }
    },
    computed: {
        time_signature() {
            return `${this.region_data.beat}/${this.details.time_signature}`
        },
        beatWidth() {
            let beats = this.details.bars * this.details.time_signature
            return this.stageWidth / beats
        },
        ...mapGetters({ details: 'getStudioDetails', stageWidth: 'getStageWidth' })
    },
    watch: {
        stageWidth(){
            this.renderRegion()
        }
    }
}
</script>
