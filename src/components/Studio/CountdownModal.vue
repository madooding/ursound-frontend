<template>
    <div class="modal" :class="{'show': studioEnv.mode === 'COUNTDOWN'}">
        <div class="modal__container">
            <div class="modal__header">Recording starts in {{ countingTime }}</div>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
    data: () => ({
        timeutil: null,
        timeDiff: null,
        show: false,
        countingTime: null,
        bps: null
    }),
    computed: {
        ...mapGetters({ 'studioEnv': 'getStudioEnv', details: 'getStudioDetails' }),
        metronome () { return this.studioEnv.metronome }
    },
    methods: {
        countdown() {
            if(!this.timeDiff) this.timeDiff = Date.now()
            this.timeutil = requestAnimationFrame(this.countdown)
            let now = Date.now()
            let delta = now - this.timeDiff
            if(delta/1000 >= this.bps){
                this.timeDiff = Date.now()
                if(this.countingTime % this.details.time_signature == 1 && this.countingTime > 1) this.metronome.up.play()
                else if(this.countingTime > 1) this.metronome.down.play()
                if(this.countingTime - 1 <= 0) {
                    cancelAnimationFrame(this.timeutil)
                    this.$store.dispatch('STUDIO_RECORD')
                }
                this.countingTime -= 1
            }
        }
    },
    watch: {
        'studioEnv.mode': function () {
            if(this.studioEnv.mode === 'COUNTDOWN') {
                this.show = true
                this.metronome.up.play()
                this.countingTime = this.details.time_signature
                this.bps = 60/this.details.bpm
                this.timeDiff = null
                this.timeutil = requestAnimationFrame(this.countdown)
            } else {
                this.show = false
                cancelAnimationFrame(this.timeutil)
            }
        }
    },
    beforeDestroy () {
        cancelAnimationFrame(this.timeutil)
    }
}
</script>
