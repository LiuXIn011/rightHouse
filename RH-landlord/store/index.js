import Vue from 'vue'
import Vuex from 'vuex'
import {
	http
} from "@/utils/request/index.js";
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		isLogin: false, // 登录状态
		refreshLogin: false, // 是否正在重新登录
		userInfo: {}, //当前登录用户信息
		toPageTime: "", // 进入页面时间
	},
	mutations: {
		setLogin(state, data) {
			state.isLogin = data
		},
		setUserInfo(state, data) {
			state.userInfo = data
		},
		setRefreshLogin(state, data) {
			state.refreshLogin = data
		},
		setToPageTime(state, data) {
			state.toPageTime = data
		},
	},
	actions: {
		getUserInfo({
			commit
		}, appStart) {
			http.request({
				url: '/api/landlordUser/selectById',
				method: 'get',
			}).then(res => {
				if (res.status === 1) {
					commit("setLogin", true);
					commit("setUserInfo", res.data);
					// 有报修或租赁申请给红点
					if (
					(res.data.maintenanceLength && res.data.maintenanceLength > 0) ||
					(res.data.leaseApplicationLength && res.data.leaseApplicationLength > 0)
					) {
						uni.showTabBarRedDot({
							index: 1,
						})
					} else {
						uni.hideTabBarRedDot({
							index: 1,
						})
					}
					if (appStart) {
						// 调用页面方法
						let pages = getCurrentPages();
						if (
							pages &&
							Array.isArray(pages) &&
							pages[0]
						) {
							pages[0].onLoad(pages[0].options);
							pages[0].onShow()
						}
					}
				} else {
					commit("setLogin", false);
				}
			}).catch(() => {
				commit("setLogin", false);
			})
		},
	}
})

export default store