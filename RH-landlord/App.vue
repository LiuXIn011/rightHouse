<script>
	import {
		mapMutations,
		mapActions
	} from "vuex"
	export default {
		methods: {

		},
		onLaunch: function() {
			const token = uni.getStorageSync("token")
			if (token) {
				this.getUserInfo(true)
			}
		},
		onShow: function() {
			// 检查新版本是否存在
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function(res) {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							showCancel: false,
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，重启应用

									updateManager.applyUpdate();
								}
							}
						});

					});

					updateManager.onUpdateFailed(function(res) {
						// console.log('新的版本下载失败了');
					});
				}
			});
		},
		onHide: function() {},
		methods: {
			...mapActions(['getUserInfo'])
		}
	}
</script>

<style lang="scss">
	// uview-ui公共
	@import "@/uni_modules/uview-ui/index.scss";

	// uview-ui自定义样式

	.u-empty {
		height: 100%;
		position: relative;	
		width: 100%;
		left: 0;
		top: 0;
	}

	.flex-item-view {
		gap: 10rpx;
	}

	.u-upload {
		.u-upload__wrap {
			.u-upload__button {
				background-color: #ededee;
			}
		}
	}

	/*每个页面公共css */
	page {
		background-color: #f6f6f6;
		// height: 100%;
	}

	body,
	p,
	ul,
	ol,
	dl,
	dd,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	td,
	input,
	textarea,
	select,
	option {
		margin: 0;
		padding: 0;
	}

	body {
		/* font-family: "微软雅黑"; */
		/* background: #ffffff; */
		background: #f7f8fa;
	}

	ul,
	ol,
	li {
		list-style: none;
	}

	a {
		text-decoration: none;
	}

	img {
		border: none;
	}

	.like-btn {
		// transition: opacity .1s;
	}

	.like-btn-hover {
		opacity: 0.8;
	}

	.dfc {
		display: flex !important;
		flex-direction: column;
	}

	.df {
		display: flex;
	}

	.jsb {
		justify-content: space-between;
	}

	.jsa {
		justify-content: space-around;
	}

	.aic {
		align-items: center;
	}

	.jce {
		justify-content: flex-end;
	}

	.jcc {
		justify-content: center;
	}


	.tac {
		text-align: center;
	}


	.mb0 {
		margin-bottom: 0;
	}

	.mb5 {
		margin-bottom: 5rpx;
	}

	.mb10 {
		margin-bottom: 10rpx;
	}

	.mb20 {
		margin-bottom: 20rpx;
	}

	.mr0 {
		margin-right: 0;
	}

	.mr5 {
		margin-right: 5rpx;
	}

	.mr10 {
		margin-right: 10rpx;
	}

	.mr20 {
		margin-right: 20rpx;
	}

	.ml0 {
		margin-left: 0;
	}

	.ml5 {
		margin-left: 5rpx;
	}

	.ml10 {
		margin-left: 10rpx;
	}

	.ml20 {
		margin-left: 20rpx;
	}

	.mt5 {
		margin-top: 5rpx;
	}

	.mt10 {
		margin-top: 10rpx;
	}

	.mt20 {
		margin-top: 20rpx;
	}

	.w100 {
		width: 100% !important;
	}

	.cup {
		cursor: pointer;
	}
</style>
