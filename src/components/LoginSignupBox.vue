<template>
    <div class="box">
        <transition mode="out-in" name="fade">
            <h4 v-if="pageMode === 'login'" key="login">Log In</h4>
            <h4 v-else-if="pageMode === 'signup'" key="signup">Sign Up</h4>
        </transition>
        <transition name="expand" mode="out-in">
            <div class="inputContainer" v-if="getPath == '/signup'">
                <span class="inputContainer__prefix inputContainer__prefix--email"></span>
                <input name="email" type="text" placeholder="Email" v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }" data-vv-name="email" data-vv-delay="500">
                <transition name="expand" mode="out-in">
                    <span v-if="errors.has('email')" class="inputContainer__message inputContainer__message--error">{{ errors.first('email') }}</span>
                </transition>
            </div>
        </transition>
        <div class="inputContainer">
            <span class="inputContainer__prefix inputContainer__prefix--username"></span>
            <input name="username" type="text" placeholder="Username" v-validate="'required|alpha_dash'" :class="{'input': true, 'is-danger': errors.has('email') }" data-vv-name="username" data-vv-delay="500">
            <transition name="expand" mode="out-in">
                <span v-if="errors.has('username')" class="inputContainer__message inputContainer__message--error">{{ errors.first('username') }}</span>
            </transition>
        </div>
        <div class="inputContainer">
            <span class="inputContainer__prefix inputContainer__prefix--lock"></span>
            <input type="password" placeholder="Password" name="password" v-validate="'required|min:6'" :class="{'input': true, 'is-danger': errors.has('email') }" data-vv-name="password" data-vv-delay="500">
            <transition name="expand" mode="out-in">
                <span v-if="errors.has('password')" class="inputContainer__message inputContainer__message--error">{{ errors.first('password') }}</span>
            </transition>
        </div>
        <transition name="fade" mode="in-out">
            <div class="inputContainer">
                <button class="button button--submit" v-bind:key="btnTxt" :class="{'button': true, 'button--submit': true, 'button--loading': defaultLoginLoading}">
                    {{ btnTxt }}!
                </button>
            </div>
        </transition>
        <hr class="or">
        <div class="inputContainer">
            <button @click="facebookLoginClick" :class="{'button': true, 'button--facebook': true, 'button--loading': fbloginLoading}">
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
        fbloginLoading: false,
        defaultLoginLoading: false
    }),
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
    },
    methods: {
        async facebookLoginClick(){
            try {
                this.fbloginLoading = true
                let response = await this.$checkFacebookLoginState()
                if(response.status === "not_authorized"){
                    let loginStatus = await this.$facebookLogin()
                    console.log(loginStatus)
                }
            } catch (error){
                console.log(error)
            } finally {
                this.fbloginLoading = false
            }
        }
    }
}
</script>
