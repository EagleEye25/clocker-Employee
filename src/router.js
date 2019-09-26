import Vue from 'vue'
import Router from 'vue-router'
import clocker from '@/components/clocker.vue';
import install from '@/components/install.vue';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: clocker
    },
    {
      path: '/',
      component: install
    },
  ]
});

const doSetServer = (p) => {
  const serverAddy = window.localStorage.getItem('serverAddy') || '';
  return !serverAddy;
};

router.beforeEach((to, from, next) => {
  const setServer = doSetServer(to.path);

  if (setServer) {
    if (to.path !== '/') {
      next('/');
    }
  } else if (!setServer) {
    if (to.path !== '/login') {
      next('/login');
    }
  }
  next();
});

export default router;
