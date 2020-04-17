// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import router from './routes';
import App from './app'
import BootstrapVue from 'bootstrap-vue'
import './styles/main.scss'
import VueSVGIcon from 'vue-svgicon'
import {
  store
} from './store'
import VModal from 'vue-js-modal'
import './assets/icons'
import VueFloatLabel from "vue-float-label";
import Vuelidate from 'vuelidate';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VTooltip from 'v-tooltip'
import VueCurrencyInput from 'vue-currency-input';
import "vue-loading-overlay/dist/vue-loading.css";
import axios from 'axios';
import Dropdown from 'bp-vuejs-dropdown';
import VueToastr from '@deveodk/vue-toastr';
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css';

Vue.use(VueToastr, {
  defaultPosition: 'toast-top-right',
  defaultType: 'info',
  defaultTimeout: 3000
})

Vue.use(VTooltip)
Vue.use(Dropdown)

const pluginOptions = {
  /* see config reference */
  globalOptions: {
    currency: 'USD'
  }
}

Vue.use(VueCurrencyInput, pluginOptions)
// require styles
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

Vue.use(Vuelidate)
Vue.use(VueFloatLabel);
Vue.use(VModal, {
  dialog: true,
  dynamic: true,
  injectModalsContainer: true,
  dynamicDefaults: {

  }
})
Vue.use(Vuex)
Vue.use(VueSVGIcon)
Vue.use(BootstrapVue)
Vue.config.productionTip = false

const event = new Vue();

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status == 401) {
    localStorage.removeItem("user");
    router.push("/register");
  } else {
    throw error
  }
})


/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  components: {
    App,
  },
  template: '<app/>',

})
