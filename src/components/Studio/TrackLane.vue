<template>
    <div class="track-lane" ref="trackLaneContainer">
        <canvas ref="trackLane"></canvas>
        <div class="regions"></div>
        <svg version="1.1" ref="indicator" class="indicator-line" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 3 100" style="enable-background:new 0 0 3 100;" xml:space="preserve">
            <line id="XMLID_1_" class="st0" x1="1.5" y1="0" x2="1.5" y2="100"/>
        </svg>
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
        this.onStageWidthChange()
        this.renderIndicator()
    },
    methods: {
        renderRuler() {
            const canvas = this.$refs.trackLane
            // Should be width of audio stage
            let width = this.container.width()
            let height = this.container.height()
            let perBar = width / this.details.bars
            let perBeat = perBar / this.details.time_signature
            let avoid = Math.round(14/perBeat) * 2
            if (canvas.getContext) {
                let ctx = canvas.getContext('2d')
                ctx.scale(2, 2)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                for(let beat = 1; beat <= this.details.bars * this.details.time_signature; beat++){
                    if (avoid === 0 || (beat % avoid === 1 && avoid > 0)) {
                        ctx.beginPath();
                        ctx.moveTo((beat - 1) * perBeat, 0);
                        ctx.lineTo((beat - 1) * perBeat, height);
                        ctx.strokeStyle = '#292B3B';
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        },
        onStageWidthChange() {
            let canvas = $(this.$refs.trackLane)
            this.container.css('width', this.stageWidth)
            this.container.css('max-width', this.stageWidth)
            // Should be width of audio stage
            canvas.attr('width', (this.container.width()) * 2)
            canvas.attr('height', this.container.height() * 2)
            // Should be width of audio stage
            canvas.css('width', this.container.width())
            canvas.css('height', this.container.height())
            this.renderRuler()
        },
        renderIndicator() {
            let indicator = $(this.$refs.indicator)
            indicator.css('left', `${this.indicatorPos}px`)
        }
    },
    computed: {
        ...mapGetters({details: 'getStudioDetails', stageWidth: 'getStageWidth', indicatorPos: 'getStudioCurrentTimePixel'})
    },
    watch: {
        stageWidth() {
            this.onStageWidthChange()
        },
        indicatorPos() {
            this.renderIndicator()
        }
    }
}
</script>
