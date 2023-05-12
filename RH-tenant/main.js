import App from './App'


import uView from '@/uni_modules/uview-ui'
Vue.use(uView)


import {
	http
} from "@/utils/request/index.js";
Vue.prototype.$http = http;


import config from '@/config.js'
Vue.prototype.$baseUrl = config.baseUrl
Vue.prototype.$mapKey = config.mapKey


import store from "./store";


// 回退方法
const goBack = (title, icon = "none") => {
	uni.showToast({
		icon,
		title
	})
	setTimeout(() => {
		uni.navigateBack({
			fail: () => {
				uni.switchTab({
					url: "/pages/index/index"
				})
			}
		})
	}, 1000)
}
Vue.prototype.$goBack = goBack


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store);
	return {
		app
	}
}
// #endif
