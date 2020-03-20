import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from 'components/recommend/Recommend'
import Rank from 'components/rank/Rank'
import Singer from 'components/singer/Singer'
import SongMenu from 'components/songMenu/SongMenu'
import SingerDetail from 'components/singer/Singer-detail.vue'
import Disc from 'components/disc/Disc.vue'
import RecommendDisc from 'components/disc/RecommendDisc.vue'
import Album from 'components/album/Album.vue'
import RankList from 'components/rank/RankList.vue'
import Search from 'components/search/Search.vue'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/recommend',
    name: 'recommend',
    component: Recommend,
    children: [{
      path: 'recommendDisc:id',
      component: RecommendDisc
    }, {
      path: 'album:id',
      component: Album
    }]

  }, {
    path: '/rank',
    name: 'rank',
    component: Rank,
    children: [{
      path: ':id',
      component: RankList
    }]
  }, {
    path: '/singer',
    name: 'singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  }, {
    path: '/songMenu',
    name: 'songMenu',
    component: SongMenu,
    children: [{
      path: ':id',
      component: Disc
    }]
  }, {
    path: '/search',
    name: 'search',
    component: Search
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
