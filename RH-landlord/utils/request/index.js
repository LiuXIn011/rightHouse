import Request from "@/utils/luch-request/index.js";
import store from "@/store";
const env = require("../../config");
const loginUrlArr = [
	"api/landlordUser/getPhoneNumber",
	"api/landlordUser/loginByWx",
	"api/landlordUser/refreshLogin",
]; // 接口无需设置token请求头
const http = new Request();
http.setConfig((config) => {
	/* 设置全局配置 */
	config.baseURL = env.baseUrl;
	config.header = {
		...config.header,
	};
	return config;
});

http.interceptors.request.use(
	(config) => {
		/* 请求之前拦截器。可以使用async await 做异步操作 */
		config.header = {
			...config.header,
			"Authorization": uni.getStorageSync("token"),
			requestType: 2,
			userType: 6,
			method: config.method.toUpperCase(),
		};

		if (loginUrlArr.includes(config.url)) {
			delete config.header["Authorization"];
		}
		uni.showLoading({
			title: "加载中...",
			mask: true,
		});
		return config;
	},
	(config) => {}
);

http.interceptors.response.use(
	async (response) => {
			uni.hideLoading();
			/* 请求之后拦截器。可以使用async await 做异步操作  */
			const {
				data,
				data: {
					status,
					message
				},
				statusCode,
			} = response;
			if (status !== 1) {
				await uni.showToast({
					title: message || '请求异常',
					icon: "none",
					duration: 2000,
				});
			}
			return data;
		},
		async (response) => {
			// 请求错误做点什么。可以使用async await 做异步操作
			await uni.hideLoading();
			if (response.statusCode === 401) {
				// token过期
				const refreshLogin = store.state.refreshLogin;
				// 如果正在重新登录则不执行操作
				if (refreshLogin) {
					return;
				}
				await uni.removeStorage({
					key: "token",
				});
				await uni.navigateTo({
					url: "/pages/login/login",
				});
				await uni.showToast({
					icon: "none",
					title: "您的登录已过期，请重新登录！",
				});
			} else {
				await uni.showToast({
					title: "请求异常！",
					icon: "none",
				});
			}

			console.log(response);
		}
);

export {
	http
};
