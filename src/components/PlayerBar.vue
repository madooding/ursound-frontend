<template>
    <div class="playerbar">
        <img :src="getPlayerCurrentSongData.cover_url" alt="" class="playerbar__cover-img">
        <div class="playerbar__basic-info">
            <p class="playerbar__basic-info__owner">{{ getPlayerCurrentSongData.owner }}</p>
            <p class="playerbar__basic-info__name">{{ getPlayerCurrentSongData.name }}</p>
        </div>
        <div class="playerbar__control">
            <button class="ion-ios-skipbackward"/>
            <button :class="{'ion-ios-play': !isPlayerPlaying, 'ion-ios-pause': isPlayerPlaying}" @click="playPause()"/>
            <button class="ion-ios-skipforward"/>
        </div>
        <audio ref="audioPlayer" src=""></audio>
        <div class="playerbar__time current">{{ currentTimeFormatted }}</div>
        <div class="playerbar__seekbar">
            <vue-slider ref="slider" @callback="seek()" v-model="currentTime" :tooltip="false" :dot-size="14" width="100%" :max="100" :interval="1" :speed="0" :bgStyle="{'background-color': 'white', 'height': '3px', 'border': '3px', 'cursor': 'pointer'}" :processStyle="{'background-color': '#FC466B'}" :sliderStyle="{'margin-top': '-1.7px'}"></vue-slider>
        </div>
        <div class="playerbar__time">{{ songDuration }}</div>
        <div class="playerbar__volume">
            <button class="ion-android-volume-up"/>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import vueSlider from 'vue-slider-component'
import moment from 'moment'

export default {
    components: {
        vueSlider
    },
    data: () => ({
        currentTime: 0,
        player: null,
        timeUtil: undefined
    }),
    mounted(){
        this.player = this.$refs.audioPlayer
        this.player.src = this.getPlayerCurrentSongData.url
        this.player.addEventListener('timeupdate', this.updateProgressbar, false)
        this.player.addEventListener('ended', () => {
            this.$store.dispatch("UPDATE_CURRENT_TIME", 0)
            this.PAUSE_SONG()
            this.currentTime = 0
        }, false)
    },
    methods: {
        ...mapActions(['RESUME_PLAYING', 'PAUSE_SONG']),
        playPause() {
            if(this.isPlayerPlaying){
                this.PAUSE_SONG()
                this.player.pause()
            } else {
                this.RESUME_PLAYING()
                this.player.play()
            }
        },
        updateProgressbar(){
            if(this.player.src && this.player.pause){
                let percentage = (100/this.player.duration) * this.player.currentTime
                this.currentTime = percentage >= 0 ? percentage: 0
                this.$store.dispatch('UPDATE_CURRENT_TIME', this.player.currentTime)
            }
        },
        seek(){
            this.player.currentTime = (this.currentTime/100) * this.player.duration
            this.$store.dispatch('UPDATE_CURRENT_TIME', this.player.currentTime)
            if(this.isPlayerPlaying) {
                this.PAUSE_SONG()
                this.RESUME_PLAYING()
            }
        },
        counter(){
            this.updateProgressbar()
            this.timeUtil = requestAnimationFrame(this.counter)
        }
    },
    computed: {
        currentTimeFormatted() {
            return moment('2000-01-01 00:00:00').add(moment.duration(this.getPlayerCurrentTime, 'seconds')).format("mm:ss")
        },
        songDuration(){
            if(this.player) return moment('2000-01-01 00:00:00').add(moment.duration(this.getPlayerCurrentSongData.duration, 'seconds')).format("mm:ss")
            else return "00:00" 
        },
        ...mapGetters(["getPlayerCurrentSongData", "isPlayerPlaying", "getPlayerCurrentTime", "getSeekSignal", "getChangeSongWhilePlayingSignal"])
    },
    watch: {
        'getPlayerCurrentSongData.id': function(){
            this.player.src = this.getPlayerCurrentSongData.url
            if(this.isPlayerPlaying){
                this.player.pause()
                this.player.currentTime = this.getPlayerCurrentTime                               
                this.player.play()
            }
        },
        isPlayerPlaying(){
            if(this.player.src){
                if(this.isPlayerPlaying) {
                    this.player.play()
                    this.timeUtil = requestAnimationFrame(this.counter)
                }
                else {
                    this.player.pause()
                    cancelAnimationFrame(this.timeUtil)
                }
            }
        },
        getSeekSignal() {
            if(this.getSeekSignal){
                let percentage = (100/this.player.duration) * this.getSeekSignal
                this.currentTime = percentage >= 0 ? percentage: 0
                this.player.currentTime = this.getSeekSignal
                this.$store.dispatch('SEEK', false)
            }
        },
        getChangeSongWhilePlayingSignal() {
            if(this.getChangeSongWhilePlayingSignal){
                this.$store.dispatch('PLAY_SONG', this.getChangeSongWhilePlayingSignal)
                this.$store.dispatch('CHANGE_SONG_WHILE_PLAYING', false)
            }
        }
    }
}
</script>
