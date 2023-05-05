import { defineStore } from 'pinia';
import type { RouteLocationNormalized, Router } from 'vue-router';

interface TagProps {
  title: string
  name: string
  fullPath: string
  path: string
  query?: any
  ignoreCache?: boolean
}
interface stateTypes {
  historyRouter: TagProps[]
}

interface removeProps {
  route: TagProps
  $route: RouteLocationNormalized
  index: number
}
export default defineStore('routerStore', {
  state: (): stateTypes => (
    {
      historyRouter: []
    }
  ),
  actions: {
    pushHistoryRouter (data: TagProps) {
      if (data.title && !this.historyRouter.some((_route: TagProps) => _route.title === data.title)) {
        this.historyRouter.push(data)
        window.localStorage.setItem('cacheRoutes', JSON.stringify(this.historyRouter))
      }
    },
    setHistoryRouter (data: TagProps[]) {
      this.historyRouter.push(...data)
    },
    tagClose (data: removeProps, $router: Router) {
      // 判断关闭的是不是当前的页面
      if (data.$route.fullPath === data.route.path) {
        // 判断是否是最后一个
        if (data.index === 0) {
          // 路由跳转
          $router.push({
            path: '/home/index'
          })
        } else {
          // 路由跳转
          $router.push({
            path: this.historyRouter[this.historyRouter.length - 2].path
          })
        }
      }
      this.historyRouter.splice(data.index, 1)
      window.localStorage.setItem('cacheRoutes', JSON.stringify(this.historyRouter))
    },
    removeHistoryRouter () {
      this.historyRouter = []
    }
  }
})
