<style scoped>
    div.modal__container {
        width: 500px;
    }
</style>

<template>
    <div class="modal" :class="{ 'show': studioEnv.mode === 'SAVE_CHANGES' }">
        <div class="modal__container avoid-padding">
            <div class="modal__title">
                Save Changes?
                <div class="modal__btn btn--close"><i class="ion-close" @click="close()"></i></div>
            </div>
            <div class="modal__content">You haven't save and sync your song yet. Do you want to leave without saving?</div>
            <div class="modal__footer">
                <div class="modal__btn__group pull-right">
                    <div class="button modal__btn" @click="exit()">Exit Studio</div>
                    <div class="button modal__btn submit" @click="sync()">Sync</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ProjectsService } from '../../services'
import { mapGetters } from 'vuex'
import { Observable } from 'rxjs'

export default {

    computed: {
        ...mapGetters({ 'studioEnv': 'getStudioEnv', details: 'getStudioDetails', tracks: 'getStudioTracks', logs: 'getStudioLogs' })
    },
    methods: {
        sync () {
            let projectData = ProjectsService.parseStudioToProjectData({ details: this.details, tracks: this.tracks, logs: this.logs })
            Observable.fromPromise(ProjectsService.syncProjectData(projectData))
                .subscribe(result => {
                    this.$router.push('/explore')
                    this.$store.dispatch('RESET_STUDIO_ENV')
                }, err => {
                    console.log(err);
                })
        },
        close () {
            this.$store.dispatch('STUDIO_SET_MODE', 'EDIT')
        },
        exit () {
            this.$store.dispatch('RESET_STUDIO_ENV')
            this.$router.push('/explore')
        }
    }
}
</script>
