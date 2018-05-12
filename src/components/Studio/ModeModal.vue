<template>
    <div class="modal" :class="{'show': show}">
        <div class="modal__container">
            <div class="modal__header">{{ renderText }}</div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
    data: () => ({
        show: false
    }),
    computed: {
        ...mapGetters({ 'studioEnv': 'getStudioEnv', details: 'getStudioDetails', tracks: 'getStudioTracks' }),
        renderText () {
            let txt = ''
            switch(this.studioEnv.mode) {
                case 'LOAD_PROJECT': txt = 'Loading Project...'
                                    break
                case 'UPLOADING_AUDIO': txt = 'Uploading Audio...'
                                    break
                case 'SYNC_PROJECT': txt = 'Syncing Project...'
                                    break
            }
            return txt
        }
    },
    mounted () {
        this.shouldRender()
    },
    methods: {
        shouldRender () {
            let triggerMode = ['LOAD_PROJECT', 'UPLOADING_AUDIO', 'SYNC_PROJECT']
            if(_.some(triggerMode, mode => this.studioEnv.mode == mode)) {
                this.show = true
            }
            else this.show = false
        }
    },
    watch: {
        'studioEnv.mode': function () {
            this.shouldRender()
        }
    }
}

</script>
