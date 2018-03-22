<template>
    <transition name="track-options" mode="out-in">
        <div class="track-options chord-suggestions" v-show="show">
            <div class="close-btn"><i class="ion-close" @click="toggle()"></i></div>
            <div class="options-container">
                <div class="chord-section">
                    <div class="topic">Suggested Chords</div>
                    <div class="group-btn">
                        <div class="chord">Silence</div>
                        <div class="chord">Dm</div>
                        <div class="chord">Em</div>
                        <div class="chord">F</div>
                        <div class="chord">G</div>
                        <div class="chord">Am</div>
                        <div class="chord">Bdim</div>
                        <div class="chord">Bb</div>
                    </div>
                </div>
                <div class="duration-section">
                    <div class="topic">Duration</div>
                    <div class="group-btn">
                        <div class="duration active">4/4</div>
                        <div class="duration">3/4</div>
                        <div class="duration">2/4</div>
                        <div class="duration">1/4</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data: () => ({
        show: false
    }),
    methods: {
        toggle() {
            this.show = !this.show
        }
    },
    computed: {
        ...mapGetters({ "getActiveTrack": "getStudioActiveTrack" })
    },
    watch: {
        'getActiveTrack.id' () {
            if(this.getActiveTrack && this.getActiveTrack.type == 'PIANO') this.show = true
            else this.show = false
        }
    }
}
</script>
