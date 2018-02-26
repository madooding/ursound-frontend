<template>
    <div class="beat-ruler" ref="beatRulerContainer">
        <canvas id="beat-ruler" ref="beatRuler"></canvas>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
    props: ['scrollX'],
    data: () => ({
        stagePosition: 0,
        container: null
    }),
    mounted() {
        this.container = $(this.$refs.beatRulerContainer)
        // Should be width of audio stage
        $(this.$refs.beatRuler).attr('width', (this.stageWidth) * 2)
        $(this.$refs.beatRuler).attr('height', this.container.height() * 2)
        // Should be width of audio stage
        $(this.$refs.beatRuler).css('width', this.stageWidth)
        $(this.$refs.beatRuler).css('height', this.container.height())
        this.renderRuler()
    },
    methods: {
        renderRuler() {
            const canvas = this.$refs.beatRuler
            const beatRuler = $(this.$refs.beatRuler)
            // Should be width of audio stage
            let rulerWidth = beatRuler.width()
            let rulerHeight = beatRuler.height()
            let perBar = rulerWidth / this.details.bars
            let perBeat = perBar / this.details.time_signature
            if (canvas.getContext) {
                let ctx = canvas.getContext('2d')
                ctx.scale(2, 2);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for(let beat = 1; beat <= this.details.bars * this.details.time_signature; beat++){
                    if(beat % this.details.time_signature == 1){
                        ctx.font = "9pt Helvetica";
                        ctx.fillStyle = '#979797';
                        ctx.fillText(Math.ceil(beat/this.details.time_signature), (beat-1) * perBeat + 4, 17);
                    }
                    ctx.fillText
                    if(beat == 1) continue
                    ctx.beginPath();
                    if(beat % this.details.time_signature == 1)
                        ctx.moveTo((beat-1) * perBeat, 8);
                    else ctx.moveTo((beat-1) * perBeat, 21);
                    ctx.lineTo((beat-1) * perBeat, rulerHeight);
                    ctx.strokeStyle = '#979797';
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
            this.container.css('width', this.stageWidth)
            // Should be width of audio stage
            $(this.$refs.beatRuler).attr('width', (this.stageWidth * 2))
            $(this.$refs.beatRuler).attr('height', this.container.height() * 2)
            // Should be width of audio stage
            $(this.$refs.beatRuler).css('width', this.stageWidth)
            $(this.$refs.beatRuler).css('height', this.container.height())
            this.renderRuler()
        },
        scrollX() {
            this.container.animate({'scrollLeft': this.scrollX}, 0)
        }
    }
}

</script>
