import type { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import useRouterStore from '@/stores/router';
import useUserStore from '@/stores/user';

const whitePath = [
  '/login'
]
NProgress.configure({ showSpinner: false });
export default (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token')
    const userStore = useUserStore()

    NProgress.start();
    if (whitePath.includes(to.path)) {
      next()
      NProgress.done();
    } else if (token) {
      if (userStore.userInfo.id) {
        next()
        NProgress.done();
      } else {
        try {
          await userStore.getUserInfo()
          next()
          NProgress.done();
        } catch (error) {
          next('/login')
          NProgress.done();
        }
      }
    } else {
      next('/login')
      NProgress.done();
    }
  })
  router.afterEach((to) => {
    const routerStore = useRouterStore()
    if (
      to.path !== '/login' &&
      to.path !== '/home/index'
    ) {
      const data: any = to
      data.title = data.meta.title
      routerStore.pushHistoryRouter({
        title: data.title,
        name: data.name,
        fullPath: data.fullPath,
        path: data.path,
        query: data.query,
        ignoreCache: data.ignoreCache
      })
    }
  })
}
