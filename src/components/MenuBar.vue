<template>
    <div class="menubar" :class="{'afterAuth': isLoggedIn, 'studio-mode': isStudioMode}">
        <div class="menubar__brand" :class="{'studio-mode': isStudioMode}">
            <h4><router-link to="/">UrSound</router-link></h4>
        </div>
        <transition name="fade" mode="out-in">
            <div class="menubar__menu menubar__menu--studio" v-if="isStudioMode">
                <ul>
                    <li>File</li>
                    <li>Edit</li>
                    <li>Settings</li>
                </ul>
            </div>
        </transition>
        <transition name="fade" mode="in-out">
            <div class="menubar__menu" v-if="isStudioMode">
                <ul class="less-padding">
                    <li><a class="button">Save</a></li>
                    <li><a class="button button--outline">Exit Studio</a></li>
                </ul>
            </div>
            <div class="menubar__menu" v-else-if="!isStudioMode">
                <ul>
                    <li v-if="!isLoggedIn"><router-link to="/" class="">Home</router-link></li>
                    <li v-if="loginShow && !isLoggedIn"><router-link to="/login">Login</router-link></li>
                    <li v-if="signupShow && !isLoggedIn"><router-link to="/signup">Signup</router-link></li>
                    <li v-if="isLoggedIn"><a class="button" @click="createNewProject()">New Project</a></li>
                    <li v-if="isLoggedIn"><router-link to="/">Explore</router-link></li>
                    <li v-if="isLoggedIn"><router-link to="/"> <img :src="getUserProfileData.profile_img" class="profile-img">@{{ getUserProfileData.username }}</router-link></li>
                    <li v-if="isLoggedIn"><router-link to="/"> <i class="ion-android-notifications"><span class="count">14</span></i></router-link></li>
                    <li v-if="isLoggedIn"><router-link to="/"><i class="ion-ios-gear"></i></router-link></li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
import { Observable } from 'rxjs'
import { ProjectsService } from '../services'
import { mapGetters, mapActions } from 'vuex'


export default {
    data: () => ({
        loginShow: true,
        signupShow: false
    }),
    created(){
        this.updateMenu()
    },
    watch: {
        '$route.fullPath': function(){
            this.updateMenu()
        }
    },
    methods: {
        getPath(){
            return this.$route.path
        },
        updateMenu(){
            if (/\/login.*/.test(this.getPath())) {
              this.loginShow = false
              this.signupShow = true
            } else {
              this.loginShow = true
              this.signupShow = false;
            }
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
    computed: {
        ...mapGetters(['isLoggedIn', 'getUserProfileData']),
        isStudioMode(){
            if (/\/studio.*/.test(this.getPath())){
                return true
            }
            return false
        }
    }
}
</script>
