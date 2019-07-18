<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import settings from '../public/settings/settings.json'
export default {
  beforeMount() {
    if (settings.applicationType === 'management') {
      this.$router.push('/login');
    } else if (settings.applicationType === 'clocker') {
      this.$router.push('/clocker')
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
@import 'vue-awesome-notifications/dist/styles/style.scss';
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 99%;
    width: 99.8%;
    padding-left: 0.2%;
  }
</style>
