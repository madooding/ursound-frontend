<template>
    <div class="modal" :class="{'show': show}">
        <div class="modal__container">
            <div class="modal__btn btn--close"><i class="ion-close" @click="toggle()"></i></div>
            <div class="modal__header">Add New Track</div>
            <div class="modal__newtrack">
                <div class="type" @click="addTrack('PIANO')">
                    <div class="icon">
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                            <g id="XMLID_2_">
                                <path id="XMLID_6_" d="M10.3,29.4V2.8H5.2c-0.5,0-0.9,0.5-0.9,0.9v42.9c0,0.5,0.5,0.9,0.9,0.9h7c0.5,0,0.9-0.5,0.9-0.9V30.4h-1.9
                                    C10.8,30.4,10.3,29.9,10.3,29.4z"/>
                                <path id="XMLID_5_" d="M21.2,29.4V2.4h-3.3v27.1c0,0.5-0.5,0.9-0.9,0.9h-1.9v16.3c0,0.5,0.5,0.9,0.9,0.9h7c0.5,0,0.9-0.5,0.9-0.9
                                    V30.4h-1.9C21.7,30.4,21.2,29.9,21.2,29.4z"/>
                                <path id="XMLID_4_" d="M32.1,29.4l0.5-27.1h-3.7v27.1c0,0.5-0.5,0.9-0.9,0.9H26v16.3c0,0.5,0.5,0.9,0.9,0.9h7
                                    c0.5,0,0.9-0.5,0.9-0.9V30.4H33C32.5,30.4,32.1,29.9,32.1,29.4z"/>
                                <path id="XMLID_3_" d="M44.8,2.8h-5.1v26.6c0,0.5-0.5,0.9-0.9,0.9h-1.9v16.3c0,0.5,0.5,0.9,0.9,0.9h7c0.5,0,0.9-0.5,0.9-0.9V3.8
                                    C45.8,3.3,45.3,2.8,44.8,2.8z"/>
                            </g>
                        </svg>
                    </div>
                    <div class="name">Smart Piano</div>
                </div>
                <div class="type" @click="addTrack('AUDIO')">
                    <div class="icon">
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="12 -13 50 50" style="enable-background:new 12 -13 50 50;" xml:space="preserve">
                            <g id="Layer_1_1_">
                                <title>Play Btn</title>
                                <desc>Created with Sketch.</desc>
                                <g id="Page-1_1_">
                                    <g id="_x2F_studio_x2F_:song-id_1_" transform="translate(-30.000000, -244.000000)">
                                        <g id="Track-Panel_1_" transform="translate(0.000000, 72.000000)">
                                            <g id="Voice" transform="translate(0.000000, 146.000000)">
                                                <g id="mic" transform="translate(30.000000, 26.000000)">
                                                    <path d="M38.9,28.9v3.8c0,0.9-0.9,1.9-1.9,1.9s-1.9-0.9-1.9-1.9v-3.8c-8.5,0-15-6.6-15-15h3.8c0,7,6.1,11.3,13.2,11.3
                                                        s13.2-4.2,13.2-11.3h3.8C53.9,22.3,47.3,28.9,38.9,28.9z M37,21.3c-4.2,0-7.5-3.3-7.5-7.5V-3.1c0-4.2,3.3-7.5,7.5-7.5
                                                        s7.5,3.3,7.5,7.5v16.9C44.5,18.1,41.2,21.3,37,21.3z"/>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div class="name">Audio Record</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data: () => ({
        show: false
    }),
    computed: {
        ...mapGetters({ 'studioEnv': 'getStudioEnv', details: 'getStudioDetails' })
    },
    methods: {
        addTrack (type) {
            this.toggle()
        },
        toggle () {
            this.show = false
            this.$store.dispatch('STUDIO_SET_MODE', 'EDIT')
        }
    },
    watch: {
        'studioEnv.mode': function () {
            if(this.studioEnv.mode === 'ADD_NEW_TRACK') {
                this.show = true
            } else {
                this.show = false
            }
        }
    }
}

</script>