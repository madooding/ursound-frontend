<template>
    <div class="beat-ruler" ref="beatRulerContainer">
        <canvas id="beat-ruler" ref="beatRuler"></canvas>
        <svg class='indicator' ref="indicator" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 27.1 32.8" style="enable-background:new 0 0 27.1 32.8;" xml:space="preserve">
            <path id="XMLID_4_" class="st0" d="M17.1,29.7c-1.9,2-5.1,2-7,0L4.4,24c-1.6-1.6-2.8-4.6-2.8-6.9V5.6c0-2.2,1.8-4,4-4h15.8
                c2.2,0,4,1.8,4,4v11.6c0,2.2-1.3,5.3-2.8,6.9L17.1,29.7z"/>
            <path id="XMLID_2_" class="st1" d="M17.1,29.7c-1.9,2-5.1,2-7,0L4.4,24c-1.6-1.6-2.8-4.6-2.8-6.9V5.6c0-2.2,1.8-4,4-4h15.8
                c2.2,0,4,1.8,4,4v11.6c0,2.2-1.3,5.3-2.8,6.9L17.1,29.7z"/>
        </svg>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import interact from 'interactjs'


export default {
    data: () => ({
        container: null,
        isMousedown: false
    }),
    mounted() {
        this.container = $(this.$refs.beatRulerContainer)
        this.onStageWidthChange()
        this.renderIndicator()
        interact('.indicator')
            .draggable({
                restrict: {
                    restriction: '.beat-ruler',
                    elementRect: { top: 0, left: 1, bottom: 0, right: 0}
                },
                onmove: e => {
                    this.moveIndicator(e)
                }
            })
        this.container.mousedown(e => {
            this.isMousedown = true
            this.moveIndicator(e)
        })
        $(document).mousemove(e => {
            if(this.isMousedown){
                this.moveIndicator(e)
            }
        }).mouseup(() => {
            this.isMousedown = false
        })
                            
    },
    beforeDestroy () {
        interact('.indicator').unset()
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
            let avoid = Math.round(14/perBeat) * 2
            if (canvas.getContext) {
                let ctx = canvas.getContext('2d')
                ctx.scale(2, 2);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for(let beat = 1; beat <= this.details.bars * this.details.time_signature; beat++){
                    if(avoid === 0 || (beat % avoid === 1 && avoid > 0)){
                        if(beat > 1){
                            ctx.beginPath();
                            if(beat % this.details.time_signature == 1){
                                ctx.moveTo((beat-1) * perBeat, 8);
                            } else {
                                ctx.moveTo((beat-1) * perBeat, 21);
                            }
                            ctx.lineTo((beat-1) * perBeat, rulerHeight);
                            ctx.strokeStyle = '#979797';
                            ctx.stroke();
                            ctx.closePath();    
                        }
                        if(beat % this.details.time_signature == 1) {
                            ctx.font = "9pt Helvetica";
                            ctx.fillStyle = '#979797';
                            ctx.fillText(Math.ceil(beat/this.details.time_signature), (beat-1) * perBeat + 4, 17);
                        }
                    }
                }
            }
        },
        onStageWidthChange() {
            // Should be width of audio stage
            $(this.$refs.beatRuler).attr('width', (this.stageWidth * 2))
            $(this.$refs.beatRuler).attr('height', this.container.height() * 2)
            // Should be width of audio stage
            $(this.$refs.beatRuler).css('width', this.stageWidth)
            $(this.$refs.beatRuler).css('height', this.container.height())
            this.renderRuler()
        },
        renderIndicator(){
            let indicator = $(this.$refs.indicator)
            indicator.css('left', `${this.indicatorPos}px`)
        },
        moveIndicator(e){
            this.$store.dispatch('SET_SEEK_SIGNAL')
            let containerOffset = Math.max(0, Math.min(this.container.width(), e.pageX - $(this.$refs.beatRulerContainer).offset().left))
            let offsetX = Math.min(this.stageWidth, Math.max(0, e.pageX - $(this.$refs.beatRulerContainer).offset().left) + this.scrollX)
            let offsetXtail = offsetX % this.snapGrid
            this.$store.dispatch('SET_STUDIO_CURRENT_TIME', (offsetX - offsetXtail + (Math.round(offsetXtail / this.snapGrid) * this.snapGrid))/this.stageWidth * 100)
            if(containerOffset <= 29) this.$store.dispatch('SCROLL_X_POSITION', this.scrollX - (29))
            else if(containerOffset >= this.container.width() - 29) this.$store.dispatch('SCROLL_X_POSITION', Math.min(this.stageWidth - this.container.width(), (this.scrollX + (29))))
        }
    },
    computed: {
        ...mapGetters({ studioEnv: 'getStudioEnv', details: 'getStudioDetails', stageWidth: 'getStageWidth', scrollX: 'getStudioCurrentScrollXPosition', indicatorPos: 'getStudioCurrentTimePixel', currentTimePercent: 'getStudioCurrentTimePercent', snapGrid: 'getStudioSnapGrid'})
    },
    watch: {
        stageWidth() {
            this.onStageWidthChange()
        },
        'details.time_signature': function () {
            this.onStageWidthChange()
        },
        scrollX() {
            this.container.animate({'scrollLeft': this.scrollX}, 0)
        },
        indicatorPos(){
            this.renderIndicator()
        }
    }
}

</script>
