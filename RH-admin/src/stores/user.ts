import { defineStore } from 'pinia';
import router from '@/router/index';
import { getUserInfo } from '@/api/user';
import routerStore from './router';

interface userInfoType {
  id: string | number
  name: string | number
  remark: string | number
  phone: string | number
  status: number
  head_img: string
  created_at: string
  updated_at: string
}
interface userState {
  userInfo: userInfoType
}
export default defineStore('user', {
  state: (): userState => {
    return {
      userInfo: {
        id: '',
        name: '',
        remark: '',
        phone: '',
        status: 1,
        head_img: '',
        created_at: '',
        updated_at: ''
      }
    }
  },
  actions: {
    setUserInfo (data: userInfoType) {
      this.userInfo = data
    },
    logOut () {
      const rStore = routerStore()
      window.localStorage.removeItem('cacheRoutes')
      window.localStorage.removeItem('token')
      rStore.removeHistoryRouter()
      router.replace('/login')
    },
    getUserInfo () {
      return getUserInfo().then(({
        status,
        data
      }) => {
        if (status === 1) {
          this.userInfo = data
        }
      })
    }
  }
})
