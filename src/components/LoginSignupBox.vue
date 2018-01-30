<template>
    <div class="box">
        <transition mode="out-in" name="fade">
            <h4 v-if="pageMode === 'login'" key="login">Log In</h4>
            <h4 v-else-if="pageMode === 'signup'" key="signup">Sign Up</h4>
        </transition>
        <transition name="expand" mode="in-out">
            <p v-if="isFacebookMode && !errors.has('signup')">Almost done!&nbsp;&nbsp; Just complete the form and signup</p>
            <p v-if="errors.has('signup')" class="error">{{ errors.first('signup')}}</p>
            <p v-if="errors.has('auth')" class="error">{{ errors.first('auth')}}</p>
        </transition>
        <transition name="expand" mode="in-out">
            <div class="inputContainer" v-if="isSignupMode && !isFacebookMode">
                <span class="inputContainer__prefix inputContainer__prefix--email"></span>
                <input name="email" type="text" placeholder="Email" v-validate="'required|email'" :class="{'input': true, 'is-error': errors.has('email') }" data-vv-name="email" data-vv-delay="500" v-model="email">
                <transition name="expand" mode="out-in">
                    <span v-if="errors.has('email')" class="inputContainer__message inputContainer__message--error">{{ errors.first('email') }}</span>
                </transition>
            </div>
        </transition>
        <div class="inputContainer">
            <span class="inputContainer__prefix inputContainer__prefix--username"></span>
            <input name="username" type="text" placeholder="Username" v-validate="'required|alpha_dash'" :class="{'input': true, 'is-error': errors.has('username') }" data-vv-name="username" data-vv-delay="500" v-model="username">
            <transition name="expand" mode="out-in">
                <span v-if="errors.has('username')" class="inputContainer__message inputContainer__message--error">{{ errors.first('username') }}</span>
            </transition>
        </div>
        <div class="inputContainer">
            <span class="inputContainer__prefix inputContainer__prefix--lock"></span>
            <input type="password" placeholder="Password" name="password" v-validate="'required|min:6'" :class="{'input': true, 'is-error': errors.has('password') }" data-vv-name="password" data-vv-delay="500" v-model="password">
            <transition name="expand" mode="out-in">
                <span v-if="errors.has('password')" class="inputContainer__message inputContainer__message--error">{{ errors.first('password') }}</span>
            </transition>
        </div>
        <transition name="fade" mode="in-out">
            <div class="inputContainer">
                <button @click="submitBtnClick" class="button button--submit" v-bind:key="btnTxt" :class="{'button': true, 'button--submit': true, 'button--loading': submitBtnLoading, 'button--disabled': errors.any()}">
                    {{ btnTxt }}!
                </button>
            </div>
        </transition>
        <transition name="expand" mode="out-in">
            <hr class="or" v-if="!isFacebookMode">
        </transition>
        <transition name="expand" mode="out-in">
            <div class="inputContainer" v-if="!isFacebookMode">
                <button @click="facebookLoginClick" :class="{'button': true, 'button--facebook': true, 'button--loading': fbloginLoading}">
                    <i></i> {{ btnTxt }} with Facebook
                </button>
            </div>
        </transition>
        <div class="box__footer">
            <p><router-link to="">Forgot password ?</router-link></p>
            <p v-if="getPath === '/login'">New here ? <router-link to="/signup">Sign Up</router-link></p>
            <p v-else-if="isSignupMode">Have an account ? <router-link to="/login">Log In</router-link></p>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import { AuthService, UserService } from '../services'
export default {
    props: ['facebookMode'],
    data: () => ({
        email: '',
        username: '',
        password: '',
        formDisabled: false,
        fbloginLoading: false,
        submitBtnLoading: false
    }),
    mounted(){

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
        },
        isSignupMode(){
            return /\/signup.*/.test(this.getPath)
        },
        isFacebookMode(){
            return /^\/signup\/facebook.*/.test(this.getPath)
        }
    },
    methods: {
        matchError(code){
            switch (code) {
                case 'USERNAME_NOT_EXIST': 
                    this.errors.add('auth', 'This username is not registered yet.')
                    break
                case 'WRONG_PASSWORD':
                    this.errors.add('auth', "Wrong Password!")
                    break
                case 'ALREADY_EMAIL_USED': 
                    this.errors.add('signup', 'This email is already in used.')
                    break
                case 'ALREADY_USERNAME_USED':
                    this.errors.add('signup', 'This username is already in used.')
                    break
                case 'INVALID_TOKEN': 
                    this.errors.add('signup', 'Sorry, You need to re-signin or re-login with facebook again.')
                    break
                default : 
                    this.errors.add('signup', 'Something wrong D: Please, check your internet connection or refresh this page.')
                    break
            }
        },
        async facebookLoginClick(){
            try {
                this.fbloginLoading = true
                let response = await this.$checkFacebookLoginState()
                if(response.status === "not_authorized"){
                    let loginStatus = await this.$facebookLogin()
                    if(loginStatus.status === "connected"){
                        let loginResult = await AuthService.facebookLogin(loginStatus.authResponse.accessToken)
                        console.log(loginResult)
                        this.$ls.set("_token", loginResult.data.token)
                        this.$router.push('/explore')                        
                    }
                } else if(response.status === "connected"){
                    let loginResult = await AuthService.facebookLogin(response.authResponse.accessToken)
                    console.log(loginResult)
                    this.$ls.set("_token", loginResult.data.token)
                    this.$router.push('/explore')                    
                }
            } catch (error){
                if(error.response.data.code === 'NEED_SIGNUP'){
                    this.$router.push('/signup/facebook')
                    this.email = error.response.data.user_profile.email
                } else if(error.response.data.code === 'INVALID_EMAIL'){
                    this.$router.push('/signup')
                }
                else {
                    alert("Can't connect to API server.")
                }
            } finally {
                this.fbloginLoading = false
            }
        }, async submitBtnClick(){            
            if(this.errors.has('auth') || this.errors.has('signup')) { return }
            this.submitBtnLoading = true
            this.errors.clear()
            if(this.isSignupMode){
                this.$validator.validateAll({
                    email: this.email,
                    username: this.username,
                    password: this.password
                }).then(async result => {
                    if(result){
                        if(!this.isFacebookMode){
                            try {
                                let result = await UserService.defaultSignup(this.email, this.username, this.password)
                                this.$ls.set('_token', result.data.token)
                                this.$router.push('/explore')
                            } catch(err) {
                                console.log(err.response.data)
                                if(err.response.data){
                                    this.matchError(err.response.data.code)
                                    _.debounce(() => this.errors.remove('signup'), 3000)()
                                }
                            } finally {
                                this.submitBtnLoading = false
                            }
                        } else {
                            try {
                                let fbLoginState = await this.$checkFacebookLoginState()
                                if(fbLoginState.status === 'connected'){
                                    let result = await UserService.facebookSignup(this.username, this.password, fbLoginState.authResponse.accessToken)
                                    this.$ls.set('_token', result.data.token)
                                    this.$router.push('/explore')
                                }

                            } catch (err) {
                                console.log(err.response.data)
                                if(err.response.data){
                                     this.matchError(err.response.data.code)
                                    _.debounce(() => this.errors.remove('signup'), 3000)()
                                }
                            } finally {
                                this.submitBtnLoading = false;
                            }
                        }
                    } else {
                        this.submitBtnLoading = false;
                    }

                }).catch(err =>{
                    this.submitBtnLoading = false
                })
                
            }else{
                this.$validator.validateAll({
                    username: this.username,
                    password: this.password
                }).then(async result => {
                    if(result){
                        AuthService.defaultLogin(this.username, this.password)
                            .then(response => {
                                console.log(response.data)
                                this.$ls.set("_token", response.data.token)
                                this.$router.push('/explore')
                                this.submitBtnLoading = false
                            })
                            .catch(err => {
                                try {
                                    console.log(err.response.data)
                                    if(err.response.data){
                                        this.matchError(err.response.data.code)
                                        _.debounce(() => this.errors.remove('auth'), 3000)()
                                    }
                                } catch(err){
                                    alert("Connection problem!")
                                }
                                this.submitBtnLoading = false
                            })
                    } else {
                        this.submitBtnLoading = false
                    }
                }).catch(err => {
                    console.log(err)
                    this.submitBtnLoading = false
                })
                
            }
        }
    }
}
</script>
