<template>
    <div class="menubar" :class="{'afterAuth': isLoggedIn}">
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
        <div class="menubar__menu">
            <ul class="less-padding">
                <li><a class="button">Save</a></li>
                <li><a class="button button--outline">Exit Studio</a></li>
            </ul>
        </div>
        <div class="menubar__menu" v-if="!isStudioMode">
            <ul>
                <li v-if="!isLoggedIn"><router-link to="/" class="">Home</router-link></li>
                <li v-if="loginShow && !isLoggedIn"><router-link to="/login">Login</router-link></li>
                <li v-if="signupShow && !isLoggedIn"><router-link to="/signup">Signup</router-link></li>
                <li v-if="isLoggedIn"><router-link to="/studio" class="button">New Project</router-link></li>
                <li v-if="isLoggedIn"><router-link to="/">Explore</router-link></li>
                <li v-if="isLoggedIn"><router-link to="/"> <img :src="getUserProfileData.profile_img" class="profile-img">@{{ getUserProfileData.username }}</router-link></li>
                <li v-if="isLoggedIn"><router-link to="/"> <i class="ion-android-notifications"><span class="count">14</span></i></router-link></li>
                <li v-if="isLoggedIn"><router-link to="/"><i class="ion-ios-gear"></i></router-link></li>
            </ul>
        </div>
    </div>
</template>

<script>
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
