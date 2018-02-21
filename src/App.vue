<template>
  <div id="app">
  <MenuBar/>
  <transition name="bottom-slide" mode="out-in">
    <PlayerBar v-if="isLoggedIn && !isStudioMode"/>
    <ControlBar v-if="isLoggedIn && isStudioMode"></ControlBar>
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
import ControlBar from './components/ControlBar'

export default {
  components:{
    MenuBar,
    PlayerBar,
    ControlBar
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
