<template>
    <div class="track-lane" ref="trackLaneContainer">
        <canvas ref="trackLane"></canvas>
        <div class="regions"></div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
    props: ['track'],
    data: () => ({
        container: null
    }),
    mounted() {
        this.container = $(this.$refs.trackLaneContainer)
        let canvas = $(this.$refs.trackLane)
        this.container.css('width', this.stageWidth)
        // Should be width of audio stage
        canvas.attr('width', (this.container.width()) * 2)
        canvas.attr('height', this.container.height() * 2)
        // Should be width of audio stage
        canvas.css('width', this.container.width())
        canvas.css('height', this.container.height())
        this.renderRuler()
    },
    methods: {
        renderRuler() {
            const canvas = this.$refs.trackLane
            // Should be width of audio stage
            let width = this.container.width()
            let height = this.container.height()
            let perBar = width / this.details.bars
            let perBeat = perBar / this.details.time_signature
            if (canvas.getContext) {
                let ctx = canvas.getContext('2d')
                ctx.scale(2, 2)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                for(let beat = 1; beat <= this.details.bars * this.details.time_signature; beat++){
                    if(beat == 1) continue
                    ctx.beginPath();
                    ctx.moveTo((beat - 1) * perBeat, 0);
                    ctx.lineTo((beat - 1) * perBeat, height);
                    ctx.strokeStyle = '#292B3B';
                    ctx.stroke();
                }
            }
        }
    },
    computed: {
        ...mapGetters({details: 'getStudioDetails', stageWidth: 'getStageWidth'})
    },
    watch: {
        stageWidth() {
            let canvas = $(this.$refs.trackLane)
            this.container.css('width', this.stageWidth)
            // Should be width of audio stage
            canvas.attr('width', (this.container.width()) * 2)
            canvas.attr('height', this.container.height() * 2)
            // Should be width of audio stage
            canvas.css('width', this.container.width())
            canvas.css('height', this.container.height())
            this.renderRuler()
        }
    }
}
</script>
