import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { auth: true },
    component: () => import('../views/Home')
  },
  {
    path: '/m',
    name: 'Mobile',
    meta: { auth: true },
    component: () => import('../views/Mobile')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { auth: false },
    component: () => import('../views/Login')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    let url = localStorage.getItem('url')
    if (url === null || url.trim() === '') {
      next({
        path: '/login'
      })
      return
    }
    let auth = localStorage.getItem('auth')
    if (auth === null || auth.trim() === '') {
      next({
        path: '/login'
      })
      return
    }
    if (auth === 'true') {
      let username = localStorage.getItem('username')
      let password = localStorage.getItem('password')
      if (username === null || username.trim() === '' || password === null || password.trim() === '') {
        next({
          path: '/login'
        })
        return
      }
    }
  }
  next()
})
export default router
