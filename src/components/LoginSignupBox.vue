<template>
    <div class="box">
        <transition mode="out-in" name="fade">
            <h4 v-if="pageMode === 'login'" key="login">Log In</h4>
            <h4 v-else-if="pageMode === 'signup'" key="signup">Sign Up</h4>
        </transition>
        <transition name="expand" mode="out-in">
            <div class="inputContainer" v-if="getPath == '/signup'">
                <span class="inputContainer__prefix inputContainer__prefix--email"></span>
                <input type="text" placeholder="Email">
            </div>
        </transition>
        <div class="inputContainer">
            <span class="inputContainer__prefix inputContainer__prefix--username"></span>
            <input type="text" placeholder="Username">
        </div>
        <div class="inputContainer">
            <span class="inputContainer__prefix inputContainer__prefix--lock"></span>
            <input type="password" placeholder="Password">
        </div>
        <transition name="fade" mode="out-in">
            <div class="inputContainer">
                <button class="button button--submit" v-bind:key="btnTxt">
                    {{ btnTxt }}!
                </button>
            </div>
        </transition>
        <hr class="or">
        <div class="inputContainer">
            <button class="button button--facebook">
                <i></i> {{ btnTxt }} with Facebook
            </button>
        </div>
        <div class="box__footer">
            <p><router-link to="">Forgot password ?</router-link></p>
            <p v-if="getPath === '/login'">New here ? <router-link to="/signup">Sign Up</router-link></p>
            <p v-else-if="getPath === '/signup'">Have an account ? <router-link to="/login">Log In</router-link></p>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
    }),
    created(){
        this.pageMode = this.whichMode
    },
    computed: {
        getPath(){
            return this.$route.fullPath
        },
        btnTxt() {
            if(/\/login.*/.test(this.$route.fullPath)){
                return "Log In"
            }else{
                return "Sign Up"
            }
        },
        pageMode(){
            if(/\/login.*/.test(this.$route.fullPath)){
                return "login"
            }
            return "signup"
        }
    }
}
</script>
