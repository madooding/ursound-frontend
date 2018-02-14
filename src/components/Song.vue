<template>
    <div class="song">
        <img :src="song_data.cover_url" alt="" class="song__cover">
        <div class="song__contents">
            <h3 class="song__contents__name">
                {{ song_data.name }} <small>{{ song_data.owner }}</small>
            </h3>
            <div class="song__contents__playback">
                <button class="play--btn" @click="play()">
                    <svg v-if="!isPlaying" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                    <g id="XMLID_3_">
                        <polygon id="Fill-2" points="35.5,24.7 35.5,75.5 75.3,50 	"/>
                        <g id="Oval-3">
                            <path id="XMLID_4_" d="M50,100C22.5,100,0,77.5,0,50C0,22.5,22.3,0,50,0s50,22.5,50,50C100,77.7,77.5,100,50,100z M50,2
                                C23.5,2,2,23.5,2,50s21.5,48,48,48s48-21.5,48-48S76.5,2,50,2z"/>
                        </g>
                    </g>
                    </svg>
                    <svg v-else version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                        <title>play btn</title>
                        <desc>Created with Sketch.</desc>
                        <g id="Oval-3">
                            <path id="XMLID_4_" d="M50,100C22.5,100,0,77.5,0,50S22.3,0,50,0s50,22.5,50,50C100,77.7,77.5,100,50,100z M50,2
                                C23.5,2,2,23.5,2,50s21.5,48,48,48s48-21.5,48-48S76.5,2,50,2z"/>
                        </g>
                        <g>
                            <rect x="30.3" y="27" width="13.1" height="45.9"/>
                            <rect x="56.6" y="27" width="13.1" height="45.9"/>
                        </g>
                    </svg>
                </button>
                <div class="song__contents__playback__spectrum" ref="spectrum" id="song"></div>
                <div class="song__contents__playback__length">{{ songDuration }}</div>
            </div>
            <div class="song__contents__actions">
                <button class="ion-chatbox">{{ song_data.actions.comments }}</button>
                <button class="ion-heart" :class="{'is--liked': isLiked}" @click="like()">{{ song_data.actions.likes }}</button>
                <button class="ion-share">share</button>
                <button class="ion-android-download">download</button>
            </div>
            <button class="song__more-btn ion-more">
            </button>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex';

export default {
    props: ["song_data"],
    data: () => ({
        isLiked: false,
        currentTime: 0,
        isPlaying: false,
        wavesurfer: null
    }),
    created() {
        // this.song_data = this.$props.song_data
    },
    mounted() {
        this.wavesurfer = WaveSurfer.create({
            container: this.$refs.spectrum,
            waveColor: '#959494',
            progressColor: '#F9496D',
            barWidth: 2,
            barHeight: 30,
            cursorColor: "#565656",
            height: 67,
            responsive: true,
            interact: true,
        })
        this.wavesurfer.load(this.song_data.url)
        this.wavesurfer.on('ready', () => {
            this.song_data.duration = this.wavesurfer.getDuration()
        })
        $(this.$refs.spectrum).click(e => {
            let posX = $(this.$refs.spectrum).offset().left
            let calCurrentTime = ((e.pageX - posX)/$(this.$refs.spectrum).width()) * this.song_data.duration
            this.currentTime = calCurrentTime
            if(this.song_data.id === this.getPlayerCurrentSongData.id){
                this.$store.dispatch('SEEK', calCurrentTime)
            }
        })
    },
    computed: {
        songDuration(){
            return moment('2000-01-01 00:00:00').add(moment.duration(this.song_data.duration, 'seconds')).format("mm:ss")
        },
        ...mapGetters(["isPlayerPlaying", "getPlayerCurrentSongData", "getPlayerCurrentTime"])
    },
    methods: {
        play(){
            if(!this.isPlaying){
                if(this.isPlayerPlaying){
                    this.$store.dispatch('PAUSE_SONG')
                    this.$store.dispatch('CHANGE_SONG_WHILE_PLAYING', {
                        song_data:{
                            ...this.song_data,
                            currentTime: this.currentTime    
                        },
                        currentTime: this.currentTime
                    })
                    this.isPlaying = true
                } else {
                    this.isPlaying = true
                    this.$store.dispatch('PLAY_SONG', {
                        song_data:{
                            ...this.song_data,
                            currentTime: this.currentTime    
                        },
                        currentTime: this.currentTime
                    })
                }
            }else{
                this.isPlaying = false
                this.$store.dispatch('PAUSE_SONG')
            }
        },
        like(){
            if(!this.isLiked) this.song_data.actions.likes++
            else this.song_data.actions.likes--
            this.isLiked = !this.isLiked;
        }
    },
    watch: {
        'getPlayerCurrentSongData.id': function(){
            if(this.song_data.id === this.getPlayerCurrentSongData.id){
                this.isPlaying = this.isPlayerPlaying                
            } else this.isPlaying = false
        },
        isPlayerPlaying(){
            if(this.song_data.id === this.getPlayerCurrentSongData.id){
                this.isPlaying = this.isPlayerPlaying
            } else this.isPlaying = false
        },
        getPlayerCurrentTime(){
            if(this.song_data.id === this.getPlayerCurrentSongData.id){
                this.currentTime = this.getPlayerCurrentTime
                this.wavesurfer.seekTo(this.getPlayerCurrentTime/this.song_data.duration)
            }
        }

    }
}
</script>
