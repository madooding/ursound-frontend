<template>
    <div class="track-lane" ref="trackLaneContainer" :track_id="track_data.id">
        <canvas ref="trackLane"></canvas>
        <div class="regions">
            <AudioRegion v-for="region in track_data.sequences" v-bind:key="region.id" :region_type="track_data.type" :track_id="track_data.id" :region_id="region.id" class="audio-region" :class="{'audio-region--piano': track_data.type === 'PIANO', 'audio-region--audio': track_data.type === 'AUDIO'}" v-bind:track_data="track_data" v-bind:region_data="region" v-if="!region.deleted"></AudioRegion>
        </div>
        <svg version="1.1" ref="indicator" class="indicator-line" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 3 100" style="enable-background:new 0 0 3 100;" xml:space="preserve">
            <line id="XMLID_1_" class="st0" x1="1.5" y1="0" x2="1.5" y2="100"/>
        </svg>
    </div>
</template>

<script>
import _ from 'lodash'
import interact from 'interactjs'
import AudioRegion from './AudioRegion'
import { Observable } from 'rxjs'
import { mapGetters } from 'vuex'
import { StudioService, ProjectsService } from '../../services'
import { Howl } from 'howler'


let chunks = [];

export default {
    props: ['track_data'],
    data: () => ({
        container: null,
        tracksContainer: null,
        elemOffsetX: 0,
        elemOffsetY: 0,
        offsetTop: 0,
        mediaRecorder: null,
        currentRegion: null,
        recentStudioMode: 'EDIT'
    }),
    components: {
        AudioRegion
    },
    mounted() {
        this.container = $(`.track-lane[track_id="${this.track_data.id}"]`)
        this.tracksContainer = $('.tracks')
        this.onStageWidthChange()
        this.renderIndicator()
        this.$nextTick(() => {
            this.addInteractionListener()
            if(this.track_data.type === 'AUDIO' && navigator.mediaDevices) {
                Observable.fromPromise(navigator.mediaDevices.getUserMedia({ audio: true }))
                    .subscribe(stream => {
                        this.mediaRecorder = new MediaRecorder(stream)
                        this.mediaRecorder.ondataavailable = (e) => {
                            chunks.push(e.data);
                        }
                        this.mediaRecorder.onstop = (e) => {
                            let blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                            let recordingRegion = _.find(this.track_data.sequences, region => region.recording)
                            this.uploadAudio(recordingRegion.id, blob)
                                .do(() => {
                                    this.$store.dispatch('STUDIO_SET_MODE', 'UPLOADING_AUDIO')
                                })
                                .subscribe((res) => {
                                    let player = new Howl({
                                        src: [res.data.url],
                                        onload: () => {
                                            this.$store.dispatch('FINISH_RECORDING_REGION', {
                                                url: res.data.url,
                                                player: player
                                            })
                                        }
                                    })
                                }, err => {
                                    this.$store.dispatch('DELETED_REGION', {
                                        track_id: this.track_data.id,
                                        region_id: recordingRegion.id
                                    })
                                })
                            chunks = [];
                        }
                    })
            }
        })
        $('body').keydown(e => {
            if(e.which == 8) this.$store.dispatch('DELETE_SELECTED_REGION')
        })
    },
    beforeDestroy () {
        interact('.audio-region').unset()
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
                if(!this.studioEnv.trackLaneCanvas){
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
                    this.$store.dispatch('SET_STUDIO_TRACKLANE_CANVAS', canvas)
                } else {
                    ctx.drawImage(this.studioEnv.trackLaneCanvas, 0, 0)
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
            interact('.audio-region').unset()
            this.addInteractionListener()
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
        },
        addInteractionListener () {
            let interactedRegion
            let waveFormPos
            let originalWidth
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
                        let region_type = $(target).attr('region_type')
                        if(region_type === 'PIANO'){
                            this.$store.dispatch('MOVE_CHORD_REGION', {
                                region_id: target.attr('region_id'),
                                track_id: target.attr('track_id'),
                                moveTo: {
                                    'startBeat': startBeat,
                                    'trackIndex': trackIndex
                                }
                            })
                        } else {
                                this.$store.dispatch('MOVE_AUDIO_REGION', {
                                region_id: target.attr('region_id'),
                                track_id: target.attr('track_id'),
                                moveTo: {
                                    'startBeat': startBeat,
                                    'trackIndex': trackIndex
                                }
                            })
                        }
                    }
                })
                .resizable({
                    edges: { left: '.resize-left', right: '.resize-right', bottom: false, top: false },
                    restrictSize: {
                        min: { width: this.beatWidth, height: 100 },
                        max: { width: this.stageWidth, height: 100 }
                    },
                    onstart: (e) => {
                        this.elemOffsetX = parseFloat(_.replace($(e.target).css('left'), 'px', ''))
                        waveFormPos = this.removePx($(e.target).children('.audio-waveform').css('left'))
                        originalWidth = e.rect.width
                        let region_id = $(e.target).attr('region_id')
                        let track_id = $(e.target).attr('track_id')
                        interactedRegion = this.findRegion(track_id, region_id)
                    },
                    onmove: (e) => {
                        let target = e.target;
                        $(target).css('z-index', 1)
                        target.style.width  = e.rect.width + 'px';
                        this.elemOffsetX += e.deltaRect.left;
                        let elemOffsetZtail = this.elemOffsetX % this.snapGrid
                        let width = e.rect.width
                        let widthTail = width % this.snapGrid
                        // Shift left when resizing and shrink region size
                        
                        let region_type = $(target).attr('region_type')
                        let trim_direction = e.interaction.downEvent.path[0].className === 'resize-left' ? 'left' : 'right'
                        let max_size
                        if(region_type === 'PIANO') max_size = Math.min(this.beatWidth * 4 - 2, ((width - widthTail) + Math.round(widthTail / this.snapGrid) * this.snapGrid) - 2)
                        else {
                            if(trim_direction === 'left') {
                                let minSize = StudioService.milliseconds2beats(this.details.bpm, interactedRegion.original_length - interactedRegion.trim_right) % this.details.time_signature
                                let minActualSize = (minSize - Math.floor(minSize)) * this.beatWidth
                                width = width - minActualSize
                                widthTail = width % this.snapGrid
                                max_size = Math.max(minActualSize, Math.min(-2 + this.beatWidth * StudioService.milliseconds2beats(this.details.bpm, interactedRegion.trim_left + (interactedRegion.original_length - interactedRegion.trim_right - interactedRegion.trim_left)), ((width - widthTail) + Math.round(widthTail / this.snapGrid) * this.snapGrid) - 2 + minActualSize))
                                $(target).children('.audio-waveform').css('left', waveFormPos - (originalWidth - max_size) + 2)
                            } else max_size = Math.min(-2 + this.beatWidth * StudioService.milliseconds2beats(this.details.bpm, interactedRegion.trim_right + (interactedRegion.original_length - interactedRegion.trim_right - interactedRegion.trim_left)), ((width - widthTail) + Math.round(widthTail / this.snapGrid) * this.snapGrid) - 2)
                        }
                        let minLeft = region_type === 'AUDIO' ? this.beatWidth * (interactedRegion.start_beat - StudioService.milliseconds2beats(this.details.bpm, interactedRegion.trim_left) - 1) : (interactedRegion.start_beat - 1 - (this.details.time_signature - interactedRegion.beat)) * this.beatWidth;
                        $(target).css('left', Math.max((this.elemOffsetX - elemOffsetZtail) + Math.round(elemOffsetZtail / this.snapGrid) * this.snapGrid, minLeft))
                        $(target).width(max_size)
                    },
                    onend: e => {
                        let target = e.target
                        $(target).css('z-index', 0)
                        // Update region data in store
                        let perBeat = this.stageWidth / (this.details.time_signature * this.details.bars)
                        let startBeat = Math.round(parseInt(_.replace($(target).css('left'), 'px', '')) / perBeat + 1)
                        let duration = Math.floor(this.removePx($(target).width()) / this.beatWidth + 1)
                        let trim_direction = e.interaction.downEvent.path[0].className === 'resize-left' ? 'left' : 'right'
                        let region_type = $(target).attr('region_type')
                        if(region_type === 'PIANO'){
                            this.$store.dispatch('RESIZE_CHORD_REGION', {
                                region_id: $(target).attr('region_id'),
                                track_id: $(target).attr('track_id'),
                                payload: {
                                    startBeat,
                                    duration
                                }
                            })
                        } else {
                            this.$store.dispatch('RESIZE_AUDIO_REGION', {
                                region_id: $(target).attr('region_id'),
                                track_id: $(target).attr('track_id'),
                                payload: {
                                    startBeat,
                                    duration,
                                    'trim_direction': trim_direction
                                }
                            })
                        }
                    },
                    restrictEdges: {
                        outer: '.tracks',
                        endOnly: true
                    },
                    inertia: false
                })
        },
        removePx(text) {
            return parseFloat(_.replace(text, 'px', ''))
        },
        objectId () {
            var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
            return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
                return (Math.random() * 16 | 0).toString(16);
            }).toLowerCase();
        },
        playChordOnBeat (beat) {
            if (this.currentTimeBeats - beat > .1) return
            let region = _.find(this.track_data.sequences, each => beat >= each.start_beat && beat < each.start_beat+each.beat && !each.deleted)
            if(region){
                let chord = StudioService.mapChord(this.details.key - 1, region.chord)
                StudioService.playChord(chord, this.beatDuration, this.gain)
            }
        },
        playAudioOnBeat (beat) {
            // Find region that beat current on
            let bpm = this.details.bpm
            let region = _.find(this.track_data.sequences, each => beat >= each.start_beat && beat <= each.start_beat + StudioService.milliseconds2beats(this.details.bpm, each.original_length - each.trim_right - each.trim_left) && !each.recording && !each.deleted)
            if((this.currentRegion == null && region) || (region && region.id != this.currentRegion.id)){
                if(this.currentRegion) this.currentRegion.player.stop()
                this.currentRegion = region
                this.currentRegion.player.play()
                this.currentRegion.player.seek((StudioService.beats2milliseconds(this.details.bpm, this.currentTimeBeatsFloor - region.start_beat) + region.trim_left)/1000)
                this.currentRegion.player.volume(this.gain)
            } else if (this.currentRegion && region == null) {
                this.currentRegion.player.stop()
            }
        },
        findRegion (track_id, region_id) {
            let trackIndex = _.findIndex(this.getTracks, each => each.id === track_id)
            let regionIndex = _.findIndex(this.getTracks[trackIndex].sequences, each => each.id === region_id)
            return this.getTracks[trackIndex].sequences[regionIndex]
        },
        uploadAudio (region_id, blob) {
            return Observable.fromPromise(StudioService.uploadBlobAudio(this.details.project_id, region_id, blob))
        },
        updatePlayerVolume () {
            if(this.track_data.type === 'AUDIO' && this.currentRegion) this.currentRegion.player.volume(this.gain)
        }
    },
    computed: {
        ...mapGetters({ details: 'getStudioDetails', stageWidth: 'getStageWidth', indicatorPos: 'getStudioCurrentTimePixel', scrollX: 'getStudioCurrentScrollXPosition', snapGrid: 'getStudioSnapGrid', getTracks: 'getStudioTracks', currentTimeBeats: 'getStudioCurrentTimeBeats', studioEnv: 'getStudioEnv', wholeDuration: 'getStudioWholeDuration', activeTrack: 'getStudioActiveTrack', isSoloMode: 'getStudioSoloMode' }),
        beatWidth() {
            let beats = this.details.bars * this.details.time_signature
            return this.stageWidth / beats
        },
        currentTimeBeatsFloor () {
            return Math.floor(this.currentTimeBeats)
        },
        beatDuration () {
            let beats = this.details.bars * this.details.time_signature
            return this.wholeDuration / beats
        },
        gain () {
            return this.track_data.volume * this.studioEnv.master_volume / 10000 * (this.track_data.muted || (this.isSoloMode && !this.track_data.solo) ? 0 : 1)
        }
    },
    watch: {
        stageWidth() {
            this.onStageWidthChange()
        },
        'details.time_signature': function () {
            this.onStageWidthChange()
        },
        indicatorPos() {
            this.renderIndicator()
            if (this.studioEnv.mode === 'RECORD' && this.track_data.type === 'AUDIO' && this.track_data.id === this.activeTrack.id) {
                this.$store.dispatch('UPDATE_RECORDING_REGION')
            }

        },
        currentTimeBeats () {
            if((this.studioEnv.mode === 'PLAYBACK' || this.studioEnv.mode === 'RECORD') && this.track_data.type === 'AUDIO') this.playAudioOnBeat(this.currentTimeBeats)
        },
        currentTimeBeatsFloor () {
            if(this.studioEnv.mode === 'PLAYBACK'){
                if(this.track_data.type === 'PIANO') this.playChordOnBeat(this.currentTimeBeatsFloor)
            } else if (this.studioEnv.mode === 'RECORD'){
                if(this.track_data.type === 'PIANO') this.playChordOnBeat(this.currentTimeBeatsFloor)
            }
        },
        'studioEnv.mode' () {
            try {
                if (this.studioEnv.mode === 'PLAYBACK') {
                    if(this.track_data.type === 'PIANO') this.playChordOnBeat(this.currentTimeBeatsFloor)
                    else if(this.track_data.type === 'AUDIO') this.playAudioOnBeat(this.currentTimeBeats)
                } else if (this.studioEnv.mode === 'RECORD') {
                    if(this.track_data.type === 'PIANO') this.playChordOnBeat(this.currentTimeBeatsFloor)
                    else if(this.track_data.type === 'AUDIO') {
                        this.playAudioOnBeat(this.currentTimeBeats)
                        if(this.track_data.id === this.activeTrack.id){
                            this.$store.dispatch('ADD_AUDIO_REGION', { recording: true })
                            this.mediaRecorder.start()
                        }
                    }
                } else if (this.studioEnv.mode === 'EDIT') {
                    if(this.currentRegion) this.currentRegion.player.stop()
                    this.currentRegion = null
                    if( this.recentStudioMode == 'RECORD' && this.track_data.type === 'AUDIO' && this.track_data.id === this.activeTrack.id) {
                        this.mediaRecorder.stop()
                    }
                }
            } catch (err) {}
            finally {
                this.recentStudioMode = this.studioEnv.mode
            }
        },
        'studioEnv.seek_signal' () {
            if(this.studioEnv.mode === 'PLAYBACK'){
                this.studioEnv.piano.stop()
                if(this.currentRegion) this.currentRegion.player.stop()
                this.currentRegion = null
            }
        },
        'track_data.active' () {
            if(this.track_data.active == false) {
                this.$store.dispatch('CLEAR_SELECTED_TRACK_REGION', { track_id: this.track_data.id })
            }
        },
        'studioEnv.master_volume' () {
            this.updatePlayerVolume()
        },
        gain () {
            this.updatePlayerVolume()
        }
    }
}
</script>
