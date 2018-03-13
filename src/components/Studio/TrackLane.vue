<template>
    <div class="track-lane" ref="trackLaneContainer" :track_id="track_data.id">
        <canvas ref="trackLane"></canvas>
        <div class="regions">
            <AudioRegion v-for="region in track_data.sequences" v-bind:key="region.id" :track_id="track_data.id" :region_id="region.id" class="audio-region" :class="{'audio-region--piano': track_data.type === 'PIANO', 'audio-region--audio': track_data.type === 'AUDIO'}" v-bind:track_data="track_data" v-bind:region_data="region"></AudioRegion>
        </div>
        <svg version="1.1" ref="indicator" class="indicator-line" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 3 100" style="enable-background:new 0 0 3 100;" xml:space="preserve">
            <line id="XMLID_1_" class="st0" x1="1.5" y1="0" x2="1.5" y2="100"/>
        </svg>
    </div>
</template>

<script>
import interact from 'interactjs'
import AudioRegion from './AudioRegion'
import { mapGetters } from 'vuex'

export default {
    props: ['track_data'],
    data: () => ({
        container: null,
        tracksContainer: null,
        elemOffsetX: 0,
        elemOffsetY: 0,
        offsetTop: 0
    }),
    components: {
        AudioRegion
    },
    mounted() {
        this.container = $(`.track-lane[track_id="${this.track_data.id}"]`)
        this.tracksContainer = $('.tracks')
        this.onStageWidthChange()
        this.renderIndicator()
        interact('.audio-region')
            .draggable({
                restrict: {
                    restriction: '.tracks'
                },
                onstart: e => {
                    this.elemOffsetX = Math.max(0, Math.min(e.pageX - $(e.target).offset().left, $(e.target).width()))
                    this.elemOffsetY = Math.max(0, Math.min(e.pageY - $(e.target).offset().top, $(e.target).height()))
                    this.offsetTop = $(e.target).offset().top - this.tracksContainer.offset().top
                },
                onmove: e => {
                    this.moveAudioRegion(e)
                    $(e.target).css('z-index', 1)
                },
                onend: e => {
                    let target = $(e.target)
                    target.css('z-index', 0)
                    let perBeat = this.stageWidth / (this.details.time_signature * this.details.bars)
                    let startBeat = Math.round(parseInt(_.replace(target.css('left'), 'px', '')) / perBeat + 1)
                    let trackIndex = Math.max(0, Math.min((this.getTracks.length) * 100, target.offset().top - this.tracksContainer.offset().top)) / 100
                    this.$store.dispatch('MOVE_AUDIO_REGION', {
                        region_id: target.attr('region_id'),
                        track_id: target.attr('track_id'),
                        moveTo: {
                            'startBeat': startBeat,
                            'trackIndex': trackIndex
                        }
                    })
                }
            })
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
        },
        moveAudioRegion(e) {
            let containerOffsetX = Math.max(0, Math.min(this.container.width(), e.pageX - this.container.offset().left))
            let containerOffsetY = Math.max(0, Math.min((this.getTracks.length) * 100, e.pageY - this.tracksContainer.offset().top))
            let offsetX = Math.max(0, Math.min(containerOffsetX - this.elemOffsetX, this.container.width() - $(e.target).width()))
            let offsetY = Math.max(0, Math.min(containerOffsetY - this.elemOffsetY, (this.getTracks.length) * 100 - $(e.target).height()))
            let offsetXtail = offsetX % this.snapGrid
            let offsetYtail = offsetY % 100
            $(e.target).css('left', (offsetX - offsetXtail) + Math.round(offsetXtail/this.snapGrid) * this.snapGrid)
            $(e.target).css('top', ((offsetY - offsetYtail) + Math.round(offsetYtail/100) * 100) - this.offsetTop)
        }
    },
    computed: {
        ...mapGetters({ details: 'getStudioDetails', stageWidth: 'getStageWidth', indicatorPos: 'getStudioCurrentTimePixel', scrollX: 'getStudioCurrentScrollXPosition', snapGrid: 'getStudioSnapGrid', getTracks: 'getStudioTracks'})
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
