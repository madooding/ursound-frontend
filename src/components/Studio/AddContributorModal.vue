<template>
    <div class="modal" :class="{ 'show': show }">
        <div class="modal__container">
            <div class="modal__btn btn--close" @click="toggle()"><i class="ion-close"></i></div>
            <div class="modal__header">Add New Contributor</div>
            <div class="modal__add-contributor">
                <div class="inputContainer compact">
                    <span class="inputContainer__prefix"><i class="ion-ios-search"></i></span>
                    <input name="search" type="text" placeholder="Search by username" :class="{ 'input': true }" data-vv-name="username" data-vv-delay="500" v-model="username">
                </div>
                <div class="user-list" v-if="users_data.length > 0">
                    <div class="user" v-for="user in users_data" :key="user.user_id">
                        <div class="user__profile-pic"><img :src="user.profile_img" alt=""></div>
                        <div class="user__username">{{ user.username }}</div>
                        <button class="user__add-btn" @click="addContributor(user.user_id)">Add</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { UserService } from '../../services'
import { mapGetters } from 'vuex'
import { Observable } from 'rxjs'
import _ from 'lodash'

export default {
    data: () => ({
        show: false,
        username: '',
        users_data: []
    }),
    computed: {
        ...mapGetters({ 'studioEnv': 'getStudioEnv', details: 'getStudioDetails', tracks: 'getStudioTracks' })
    },
    methods: {
        toggle() {
            this.$store.dispatch('STUDIO_SET_MODE', 'EDIT')
        },
        addContributor (user_id) {

        },
        search() {
            Observable.fromPromise(UserService.searchUsersByUsername(this.username))
                .pluck('data')
                .subscribe(result => {
                    this.users_data = result.result
                })
        },
        debounce: _.debounce(function(){
            this.search()
        }, 500)
    },
    mounted () {
        this.search()
    },
    watch: {
        'studioEnv.mode': function () {
            if(this.studioEnv.mode === 'ADD_NEW_CONTRIBUTOR') this.show = true
            else this.show = false
        },
        username () {
            this.debounce()
        }
    }
}

</script>
