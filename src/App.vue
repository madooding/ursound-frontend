<template>
  <div id="app">
  <MenuBarBeforeAuth></MenuBarBeforeAuth>
  <transition name="fade" mode="out-in">
    <router-view/>
  </transition>
  </div>
</template>

<script>
import MenuBarBeforeAuth from './components/MenuBarBeforeAuth'
export default {
  components:{
    MenuBarBeforeAuth
  },
  name: 'App'
}
</script>

<style>
</style>
