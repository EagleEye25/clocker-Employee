import Vue from 'vue';
import App from './App.vue';

import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';
import router from './router';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import VueAWN from "vue-awesome-notifications";
import VueApexCharts from 'vue-apexcharts';
import VueTour from 'vue-tour'

require('vue-tour/dist/vue-tour.css')
Vue.use(VueTour)

Vue.use(VueApexCharts);

let options = {
  position: 'top-right',
  maxNotifications: 5,
};

Vue.use(VueAWN, options);

Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);

Vue.use(VueMaterial)

Vue.config.productionTip = false

new Vue({
  router,
  VueCtkDateTimePicker,
  VueAWN,
  render: h => h(App)
}).$mount('#app')
