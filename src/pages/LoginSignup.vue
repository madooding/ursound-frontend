<template>
    <div id="loginSignup" class="loginSignup--container">
        <login-signup-box></login-signup-box>
    </div>
</template>

<script>
import MenuBarBeforeAuth from '../components/MenuBarBeforeAuth'
import LoginSignupBox from '../components/LoginSignupBox'
    export default {
        components: {
            MenuBarBeforeAuth,
            LoginSignupBox
        }
    }
</script>

