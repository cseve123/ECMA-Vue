import Vue from 'vue'
import VueRouter from 'vue-router'
import User from '../views/User.vue'
// import Upload from '../views/Upload.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'User',
    component: User
  },
  {
    path: '/upload',
    name: 'Upload',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // components: Upload,
    // 组件按需加载
    component: () => import('../views/Upload.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
