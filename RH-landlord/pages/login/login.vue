<template>
	<view class="content">
		<view class="imgback">
			<view class="log-box">
				<image src="/static/logo.png" mode="scaleToFill"></image>
				<text class="text">欢迎使用房适</text>
			</view>
			<view class="btn-box">
				<button class="btn" type="default" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信快速登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				jsCode: ""
			}
		},
		onLoad() {
			uni.login({
				success: (res) => {
					this.jsCode = res.code
				}
			})
		},
		methods: {
			...mapMutations(["setLogin", "setUserInfo"]),
			getPhoneNumber(res) {
				if (res.detail.errMsg != "getPhoneNumber:ok") {
					uni.showToast({
						title: "请授权！",
						icon: "none"
					})
					return
				} else {
					this.$http.request({
						url: "/api/landlordUser/loginByWx",
						methods: "get",
						params: {
							code: res.detail.code,
							userType: 1,
							jsCode: this.jsCode
						}
					}).then(async (res) => {
						if (res.status === 1) {
							await uni.setStorageSync("token", `Bearer ${res.data}`)

							await this.getUserInfo()
						}
					})
				}

			},
			getUserInfo() {
				return this.$http.request({
					url: "/api/landlordUser/selectById",
					methods: "get",
				}).then((res) => {
					if (res.status === 1) {
						this.setLogin(true)
						this.setUserInfo(res.data)
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
						// 跳转到上一页
						let pages = getCurrentPages(); // 当前页面
						let beforePage = pages[pages.length - 2]; // 前一个页面
						uni.navigateBack({
							success: function() {
								beforePage.onLoad(beforePage.options); // 执行前一个页面的onLoad方法
							},
							fail: function(e) {
								uni.switchTab({
									url: '/pages/index/index'
								})
							}
						});
					} else {
						this.setLogin(false)
					}
				}).catch(() => {
					this.setLogin(false)
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;

		.imgback {
			width: 750rpx;
			height: 100vh;
			// background: #4261ef;
			background-image: linear-gradient(135deg, #2979ff, #1dceff);
			// background: url("https://manybox.oss-cn-shanghai.aliyuncs.com/wechat/20210319161003793_logback.png") no-repeat;
			background-size: cover;
			overflow: hidden;

			.log-box {
				width: 100%;
				height: 349rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				margin-top: 202rpx;

				image {
					margin-bottom: 30rpx;
					width: 200rpx;
					height: 200rpx;
				}

				.text {
					height: 40rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 40rpx;
					text-align: center;
				}
			}

			.btn-box {
				margin-top: 572rpx;
				position: fixed;
				left: 112rpx;
				bottom: 120rpx;

				.btn {
					width: 526rpx;
					height: 88rpx;
					line-height: 88rpx;
					background: #ffffff;
					text-align: center;
					border-radius: 48rpx;
					font-size: 26rpx;
					font-weight: 600;
					color: #2979ff;

				}
			}
		}
	}
</style>