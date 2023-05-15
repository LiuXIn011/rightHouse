import { createRouter, createWebHistory } from 'vue-router';
import routerEach from './routerEach';

export const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/home/index',
    meta: {
      hideInMenu: true
    }
  },
  {
    path: '/login',
    name: 'login',
    // eslint-disable-next-line import/no-unresolved
    component: () => import('@/views/login/login.vue'),
    meta: {
      hideInMenu: true,
      icon: 'icon-tiktok-color',
      title: '登录'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/layout/index.vue'),
    redirect: '/home/index',
    meta: {
      icon: 'icon-command',
      title: '首页'
    },
    children: [
      {
        path: 'index',
        name: 'homeIndex',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/tenants',
    name: 'tenants',
    component: () => import('@/layout/index.vue'),
    redirect: '/tenants/tenantsList',
    meta: {
      icon: 'icon-user-group',
      title: '租客管理'
    },
    children: [
      {
        path: 'tenantsList',
        name: 'tenantsList',
        component: () => import('@/views/tenants/tenantsList.vue'),
        meta: {
          title: '租客列表'
        }
      }
    ]
  },
  {
    path: '/landlord',
    name: 'landlord',
    component: () => import('@/layout/index.vue'),
    redirect: '/landlord/landlordList',
    meta: {
      icon: 'icon-user',
      title: '房东管理'
    },
    children: [
      {
        path: 'landlordList',
        name: 'landlordList',
        component: () => import('@/views/landlord/landlordList.vue'),
        meta: {
          title: '房东列表'
        }
      }
    ]
  },
  {
    path: '/house',
    name: 'house',
    component: () => import('@/layout/index.vue'),
    redirect: '/house/houseList',
    meta: {
      icon: 'icon-home',
      title: '房屋管理'
    },
    children: [
      {
        path: 'houseList',
        name: 'houseList',
        component: () => import('@/views/house/houseList.vue'),
        meta: {
          title: '房屋列表'
        }
      },
      {
        path: 'market',
        name: 'market',
        component: () => import('@/views/house/market.vue'),
        meta: {
          title: '租房市场'
        }
      },
      {
        path: 'houseListMaintenance',
        name: 'houseListMaintenance',
        component: () => import('@/views/house/houseListMaintenance.vue'),
        meta: {
          title: '房屋报修'
        }
      }
    ]
  },
  {
    path: '/comments',
    name: 'comments',
    component: () => import('@/layout/index.vue'),
    redirect: '/comments/list',
    meta: {
      icon: 'icon-message',
      title: '评论管理'
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/comments/comments.vue'),
        meta: {
          title: '评论列表'
        }
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/layout/index.vue'),
    redirect: '/settings/systemSettings',
    meta: {
      icon: 'icon-settings',
      title: '系统管理'
    },
    children: [
      {
        path: 'systemSettings',
        name: 'systemSettings',
        component: () => import('@/views/settings/systemSettings.vue'),
        meta: {
          title: '系统设置'
        }
      }
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/not-found/index.vue'),
    meta: {
      hideInMenu: true
    }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
});
routerEach(router)
export default router;
