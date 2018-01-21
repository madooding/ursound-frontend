<template>
    <div class="menubarBeforeAuth">
        <div class="menubarBeforeAuth__brand">
            <h4><router-link to="/">UrSound</router-link></h4>
        </div>
        <div class="menubarBeforeAuth__menu">
            <ul>
                <li><router-link to="/" class="">Home</router-link></li>
                <li v-if="loginShow"><router-link to="/login">Login</router-link></li>
                <li v-if="signupShow"><router-link to="/signup">Signup</router-link></li>
            </ul>
        </div>
    </div>
</template>

<script>
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
    }
}
</script>
