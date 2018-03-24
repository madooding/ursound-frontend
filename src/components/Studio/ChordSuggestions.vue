<template>
    <transition name="track-options" mode="out-in">
        <div class="track-options chord-suggestions" v-show="show">
            <div class="close-btn"><i class="ion-close" @click="toggle()"></i></div>
            <div class="options-container">
                <div class="chord-section">
                    <div class="topic">Suggested Chords</div>
                    <transition name="fade" mode="in-out">
                        <div class="loading" v-if="loading" :key="false"></div>
                        <div class="group-btn" v-if="!loading" :key="true">
                            <div class="chord" v-for="(chord, i) in suggestedChords" :key="i" @click="addChord(chord.chord_ID)">{{ mapChord(chord.chord_ID) }}</div>
                            <div class="chord" @click="addSilence()">Silence</div>
                        </div>
                    </transition>
                </div>
                <div class="duration-section">
                    <div class="topic">Duration</div>
                    <div class="group-btn">
                        <div class="duration" v-for="n in details.time_signature" :key="n" :class="{ 'active': activeDuration == n }" @click="setActiveDuration(n)">{{ n }}/{{ details.time_signature }}</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import _ from 'lodash'
import { StudioService } from '../../services'
import { mapGetters } from 'vuex'

export default {
    data: () => ({
        show: false,
        suggestedChords: [],
        activeDuration: 4,
        loading: false
    }),
    mounted () {
        this.getSuggestedChords()
    },
    methods: {
        toggle () {
            this.show = !this.show
        },
        setActiveDuration (n) {
            this.activeDuration = n
        },
        getSuggestedChords () {
            if (!this.show) return
            this.loading = true
            let sequences = _.takeRight(_.map(_.sortBy(this.getActiveTrack.sequences, ['start_beat']), each => each.chord), 4)
            StudioService.getSuggestedChords(sequences)
                .finally(() => {
                    this.loading = false
                })
                .subscribe(res => {
                    this.suggestedChords = res
                }, err => {
                    console.log(err);
                })
        },
        mapChord: (chord) => StudioService.mapChord(this.currentKey, chord),
        addChord (chord_id) {
            this.$store.dispatch('ADD_CHORD_REGION', {
                chord_id,
                chord_duration: this.activeDuration
            })
        },
        addSilence () {
            this.$store.dispatch('STUDIO_BEAT_FORWARD', this.activeDuration)
        }
    },
    computed: {
        ...mapGetters({ "getActiveTrack": "getStudioActiveTrack", 'details':  'getStudioDetails', currentKey: 'getStudioCurrentKey' })
    },
    watch: {
        'getActiveTrack.id' () {
            if(this.getActiveTrack && this.getActiveTrack.type == 'PIANO') this.show = true
            else this.show = false
        },
        'getActiveTrack.sequences' () {
            this.getSuggestedChords()
        }
    }
}
</script>
