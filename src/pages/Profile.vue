<template>
    <div class="profile--bg">
        <div class="user-profile">
            <div class="profile-info-bg">
                <div class="profile-info-container">
                    <div class="profile-img">
                        <img v-if="!loading_user_profile" :class="{'loading': !loading_user_profile }" :src="user_profile.profile_img" alt="">
                    </div>
                    <div class="profile-contact" v-if="!loading_user_profile" >
                        <div class="fullname">
                            {{ `${user_profile.first_name} ${user_profile.last_name}` }}
                        </div>
                        <div class="sub-contact">
                            {{ `@${user_profile.username} - ${user_profile.email}`}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="profile-menu-container">
                <div class="profile-menu">
                    <div class="items">
                        {{ sumTracks }} Tracks
                    </div>
                    <div class="items">
                        {{ followers }} Followers
                    </div>
                    <div class="items">
                        {{ following }} Following
                    </div>
                    <div class="items highlight" v-if="user_id != getUserProfileData.user_id">
                        + Follow
                    </div>
                    <div class="items pull-right">Edit Profile</div>
                </div>
            </div>
        </div>
        <div class="user-works">
            <div class="user-works-container">
                <div class="user-works-tabs">
                    <div class="items" :class="{'active': mode === 'OWNED_SONG'}" @click="changeMode('OWNED_SONG')">Tracks</div>
                    <div class="items" :class="{'active': mode === 'COLLABORATIVE_SONG'}" @click="changeMode('COLLABORATIVE_SONG')">Collaborative</div>
                    <div class="items pull-right">Sort by&nbsp;&nbsp;<div class="dropdown-btn">Created Date</div></div>
                </div>
                <div class="loading-project" v-if="loading_songs_data"></div>
                <div class="song-list" v-if="!loading_songs_data && songs.length > 0">
                    <Song v-for="song in songs" :key="song.id" v-bind:song_data="song"></Song>
                </div>
                <div class="no-projects-yet" v-if="!loading_songs_data && songs.length == 0">
                    No{{ mode == 'COLLABORATIVE_SONG' ? ' Collaborative ' : ' ' }}Projects Yet
                </div>
            </div>
            <div class="create-new-project-btn" @click="createNewProject()">
                + &nbsp;Create New Project
            </div>
        </div>
    </div>
</template>

<script scoped>
import _ from 'lodash'
import Song from '../components/Song'
import { UserService, StudioService, ProjectsService } from '../services/'
import { Observable } from 'rxjs'
import { mapGetters } from 'vuex'


export default {
    components: {
        Song
    },
    props: ['user_id'],
    data: () => ({
        songs: [],
        user_profile: null,
        loading_user_profile: true,
        loading_songs_data: true,
        mode: 'OWNED_SONG'
    }),
    created () {
        Observable.fromPromise(UserService.getUserProfileByUserId(this.user_id))
            .pluck('data')
            .pluck('user')
            .subscribe(res => {
                this.loading_user_profile = false
                this.user_profile = res
                this.loadOwnedProjects()
            }, err => {
                if(err.response.data.status && err.response.data.status == '404') this.$router.push('/explore') 
                console.log(err);
            })
    },
    computed: {
        ...mapGetters(['isLoggedIn', 'getUserProfileData']),
        followers () {
            if(!this.user_profile) return 0
            return this.user_profile.followers.length
        },
        following () {
            if(!this.user_profile) return 0
            return this.user_profile.following.length
        },
        sumTracks () {
            if(!this.user_profile) return 0
            return this.user_profile.owned_projects.length + this.user_profile.collaborated_projects.length
        }
    },
    methods: {
        loadOwnedProjects () {
            this.loading_songs_data = true
            this.songs = []
            Observable.fromPromise(UserService.getOwnedProjectDatas(this.user_id))
                .pluck('data').pluck('projects')
                .subscribe(projects => {
                    this.songs = _.map(projects, project => ({
                       id: project.project_id,
                       name: project.details.name,
                       owner:  this.user_profile.username,
                       url: "https://wavesurfer-js.org/example/media/small-demo.wav",
                       cover_url: project.details.cover != null ? project.details.cover : "https://i.pinimg.com/564x/93/cf/35/93cf3590ca4f015d976d40c1de389dec.jpg",
                       duration: StudioService.beats2milliseconds(project.details.bpm, project.details.bars * project.details.time_signature)/1000,
                       actions: {
                           comments: project.comments.length,
                           likes: project.likes.length
                       }
                    }))
                    this.loading_songs_data = false
                })
        },
        loadCollaboratedProjects () {
            this.loading_songs_data = true
            this.songs = []
            Observable.fromPromise(UserService.getCollaboratedProjectDatas(this.user_id))
                .pluck('data').pluck('projects')
                .subscribe(projects => {
                    this.songs = _.map(projects, project => ({
                       id: project.project_id,
                       name: project.details.name,
                       owner:  this.user_profile.username,
                       url: "https://wavesurfer-js.org/example/media/small-demo.wav",
                       cover_url: project.details.cover != null ? project.details.cover : "https://i.pinimg.com/564x/93/cf/35/93cf3590ca4f015d976d40c1de389dec.jpg",
                       duration: StudioService.beats2milliseconds(project.details.bpm, project.details.bars * project.details.time_signature)/1000,
                       actions: {
                           comments: project.comments.length,
                           likes: project.likes.length
                       }
                    }))
                    this.loading_songs_data = false
                })
        },
        changeMode (mode) {
            this.mode = mode
        },
        createNewProject () {
            Observable.fromPromise(ProjectsService.createNewProject())
                .pluck('data')
                .flatMap(data => {
                    return Promise.resolve(ProjectsService.parseProjectData(data))
                }, (data, project) => ({ ...project }))
                .subscribe(result => {
                    this.$router.push({ path: `/studio/${result.details.project_id}` })
                })
        }
    },
    watch: {
        mode () {
            switch(this.mode) {
                case 'OWNED_SONG': this.loadOwnedProjects()
                    break
                case 'COLLABORATIVE_SONG': this.loadCollaboratedProjects()
                    break
            }
        }
    }
}

</script>


<style scoped>
    div.profile--bg {
        width: 100%;
        min-height: calc(100vh - 58px);
        height: auto;
        background-color: #EEE;
        display: flex;
        flex-direction: column;
        padding-bottom: 78px;
    }
</style>
