<template>
  <div id="app">
  <MenuBarBeforeAuth></MenuBarBeforeAuth>
    <router-view/>
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
