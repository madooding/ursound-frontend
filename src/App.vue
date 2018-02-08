<template>
  <div id="app">
  <MenuBar></MenuBar>
  <transition name="fade" mode="out-in">
    <router-view/>
  </transition>
  </div>
</template>

<script>
import MenuBar from './components/MenuBar'
export default {
  components:{
    MenuBar
  },
  name: 'App'
}
</script>

<style>
</style>
