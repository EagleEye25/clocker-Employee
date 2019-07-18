import Vue from 'vue'
import Router from 'vue-router'
import clocker from '@/components/clocker.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: clocker
    },
  ]
})
