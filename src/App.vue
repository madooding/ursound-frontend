<template>
  <div id="app">
  <MenuBar/>
  <transition name="bottom-slide" mode="out-in">
    <PlayerBar v-if="isLoggedIn && !isStudioMode"/>
  </transition>
  <transition name="fade" mode="out-in">
    <router-view/>
  </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuBar from './components/MenuBar'
import PlayerBar from './components/PlayerBar'

export default {
  components:{
    MenuBar,
    PlayerBar
  },
  name: 'App',
  computed: {
    ...mapGetters(['isLoggedIn']),
    isStudioMode(){
      if (/\/studio.*/.test(this.$route.path)){
        return true
      }
      return false
    }
  }
}
</script>

<style>
</style>
