<template>
  <div id="app">
  <MenuBar/>
  <PlayerBar v-if="isLoggedIn"/>
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
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style>
</style>
