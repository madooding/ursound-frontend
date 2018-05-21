<template>
    <div class="modal" :class="{'show': studioEnv.mode === 'NO_PERMISSION' }">
        <div class="modal__container">
            <div class="modal__header">You don't have a permission to view or edit this project.</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
    mounted () {
        
    },
    computed: {
        ...mapGetters({ 'studioEnv': 'getStudioEnv', details: 'getStudioDetails', tracks: 'getStudioTracks' })
    },
    watch: {
        'studioEnv.mode': function () {
            if(this.studioEnv.mode === 'NO_PERMISSION') _.debounce(() => {
                this.$router.push({ path: '/explore' })
                this.$store.dispatch('RESET_STUDIO_ENV')
            }, 3000)()
        }
    }
}

</script>

<style scoped>
    .modal__container {
        width: 600px;
    }
</style>
