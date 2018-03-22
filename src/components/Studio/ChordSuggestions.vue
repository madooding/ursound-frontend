<template>
    <transition name="track-options" mode="out-in">
        <div class="track-options chord-suggestions" v-show="show">
            <div class="close-btn"><i class="ion-close" @click="toggle()"></i></div>
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
