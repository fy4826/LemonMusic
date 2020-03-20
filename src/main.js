import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import axios from 'axios'
import VueAxios from 'vue-axios'

import {
  Toast,
  Grid,
  GridItem,
  Image,
  Search,
  Icon,
  NavBar,
  Swipe,
  SwipeItem,
  Tab,
  Tag,
  Tabs,
  Lazyload,
  SwipeCell,
  List,
  Loading,
  Progress,
  Circle,
  Dialog
} from 'vant'
import '@vant/touch-emulator'
import 'assets/css/reset.scss'
import 'assets/css/icon.scss'
Vue.use(Search).use(Icon).use(NavBar).use(Swipe).use(SwipeItem).use(Image).use(Grid).use(GridItem).use(Tab).use(Tabs).use(Tag).use(SwipeCell).use(List).use(Loading).use(Progress).use(Circle).use(Toast).use(Dialog)
Vue.use(Lazyload, {
  lazyComponent: true,
  loading: require('assets/images/logo.png')
})
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
fastclick.attach(document.body)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
