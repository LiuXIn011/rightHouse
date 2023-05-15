<template>
	<view class="page-view">
		<view class="user-info-view">
			<s-image class="user-avatar" mode="aspectFill" :src="userInfo.headImg||avatarUrl"></s-image>
			<text class="user-name" v-if="isLogin">{{userInfo.name}}</text>
			<text class="user-name" @click="toLogin" v-if="!isLogin">点击登录</text>
		</view>
		<view class="count-view">
			<view class="count-view-item">
				<u-count-to color="#2979ff" :bold="true" fontSize="100rpx" :startVal="0"
					:endVal="userInfo.houseLength || 0"></u-count-to>
				<view class="count-view-item-text">
					已有房屋
				</view>
			</view>
			<view class="count-view-item">
				<u-count-to color="#2979ff" :bold="true" fontSize="100rpx" :startVal="0"
					:endVal="userInfo.tenantsLength || 0"></u-count-to>
				<view class="count-view-item-text">
					已有租客
				</view>
			</view>
		</view>

		<u-cell-group>
			<u-cell isLink icon="setting-fill" title="个人设置" @click="showInfoSetting"></u-cell>
			<u-cell title="房间报修" isLink icon="file-text-fill" @click="toMaintenance">
				<u-badge slot="value" max="99" :value="userInfo.maintenanceLength || 0"></u-badge>
			</u-cell>
			<u-cell title="租赁申请" isLink icon="rmb-circle-fill" @click="toLeaseApplication">
				<u-badge slot="value" max="99" :value="userInfo.leaseApplicationLength || 0"></u-badge>
			</u-cell>
		</u-cell-group>
		<u-button type="error" v-if="isLogin" @click="logout" circle text="退出登录"></u-button>
		<u-popup :show="infoPopupShow" :round="20" mode="bottom" @close="infoPopupShow = false">
			<view class="info-popup-head">
				<u--text type="info" text="取消" @click="infoPopupShow = false"></u--text>
				<text>修改个人信息</text>
				<u--text type="primary" align="right" text="确认" @click="saveUserInfo"></u--text>
			</view>
			<u--form labelWidth='80' labelPosition="left" labelAlign="right" :model="userInfoData" ref="userInfoForm">
				<u-form-item label="姓名：" prop="name" borderBottom>
					<u--input v-model="userInfoData.name" placeholder="请输入" :maxlength="20" clearable>
					</u--input>
				</u-form-item>
				<u-form-item label="头像：" borderBottom>
					<u-upload :previewFullImage="true" :fileList="userInfoData.headImg" @afterRead="headImgAfterRead"
						@delete="headImgDeletePic" :maxCount="1"></u-upload>
				</u-form-item>
			</u--form>
		</u-popup>
	</view>
</template>

<script>
	import sImage from "@/components/sImage/sImage.vue"
	import {
		mapState,
		mapMutations,
		mapActions
	} from "vuex"
	export default {
		data() {
			return {
				avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
				infoPopupShow: false,
				userInfoData: {
					name: "",
					headImg: []
				},
			}
		},
		components: {
			sImage
		},
		computed: {
			...mapState(['isLogin', 'userInfo']),
			formRules() {
				return {
					name: [{
							required: true,
							message: '此项为必填',
							// blur和change事件触发检验
							trigger: ['blur', 'change'],
						},
						{
							min: 0,
							max: 20,
							message: '文字长度在20个字符以内'
						},
					],
				}
			}
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.userInfoForm.setRules(this.formRules)
		},
		onShow() {
			if (this.isLogin) {
				this.getUserInfo()
			}
		},
		methods: {
			...mapMutations(["setLogin", "setUserInfo"]),
			...mapActions(["getUserInfo"]),
			login() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			logout() {
				uni.showModal({
					title: "提示",
					content: "是否退出登录？",
					success: (res) => {
						if (res.confirm) {
							this.setLogin(false)
							this.setUserInfo({})
							uni.removeStorage({
								key: "token",
							});
						}
					}
				})

			},
			toLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			requestSubscribeMessage() {
				uni.requestSubscribeMessage({
					tmplIds: ['4g2brsgOcsiXpw0url5F8_1_uq8eypuuEfcg99Yt6zM'],
					success: (res) => {
						console.log(res);

					}
				})
			},
			showInfoSetting() {
				if (this.isLogin) {
					this.infoPopupShow = true
					this.userInfoData.name = this.userInfo.name
					if (this.userInfo.headImg) {
						this.userInfoData.headImg = [{
							url: this.userInfo.headImg
						}]
					}
				} else {
					this.toLogin()
				}

			},
			toMaintenance() {
				uni.navigateTo({
					url: "/house_pages/house/maintenanceList"
				})
			},
			toLeaseApplication() {
				uni.navigateTo({
					url: "/house_pages/house/leaseApplication"
				})
			},
			headImgAfterRead(event) {
				let fileList = event.file
				this.userInfoData.headImg = [{
					...fileList,
					status: 'uploading',
					message: '上传中'
				}]
				this.uploadImg(fileList.url)
			},
			headImgDeletePic(event) {
				this.userInfoData.headImg.splice(event.index, 1)
			},
			uploadImg(filePath) {
				//上传
				let token = uni.getStorageSync('token')
				uni.uploadFile({
					url: `${this.$baseUrl}/api/file/upload`,
					header: {
						'Authorization': token,
						'content-type': 'application/x-www-form-urlencggoded;charset=UTF-8'
					},
					filePath,
					name: "file",
					success: ({
						statusCode,
						data
					}) => {
						data = JSON.parse(data)
						if (data.status === 1 && statusCode === 200) {
							this.userInfoData.headImg = this.userInfoData.headImg.map((item, ind) => {
								item = data.data
								item.status = 'success'
								return item
							})
						} else {
							this.userInfoData.headImg = this.userInfoData.headImg.map((item, ind) => {
								item.status = 'failed'
								item.message = '上传失败'
								return item
							})
						}
					},
					fail: (err) => {
						this.userInfoData.headImg = this.userInfoData.headImg.map((item, ind) => {
							item.status = 'failed'
							item.message = '上传失败'
							return item
						})
					},
					complete: (e) => {}
				});
			},
			saveUserInfo() {
				let data = {}
				data.name = this.userInfoData.name
				data.id = this.userInfoData.id
				if (
					this.userInfoData.headImg &&
					Array.isArray(this.userInfoData.headImg) &&
					this.userInfoData.headImg.length > 0 &&
					this.userInfoData.headImg.every(item => item.status === 'success')
				) {
					data.headImg = this.userInfoData.headImg[0].url
				}
				this.$http.request({
					url: "/api/landlordUser/update",
					method: "post",
					data
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						this.setUserInfo({
							...this.userInfo,
							...data
						})
						this.infoPopupShow = false
						uni.showToast({
							icon: "success",
							title: "修改成功！"
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page-view {
		.user-info-view {
			height: 450rpx;
			background-image: linear-gradient(135deg, #2979ff, #1dceff);
			// background-color: #2979ff;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// border-radius: 0 0 40rpx 40rpx;

			.user-avatar {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				border: 4rpx solid #fff;
			}

			.user-name {
				color: #fff;
				margin-top: 10rpx;
			}
		}

		.count-view {
			height: 200rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin: -80rpx 0 30px;

			.count-view-item {
				width: 330rpx;
				height: 200rpx;
				background-color: #fff;
				// background-image: linear-gradient(135deg, #7f65ff, #3d64ff);
				box-shadow: 0 6rpx 20rpx 0 rgba(55, 86, 223, 0.3);
				border-radius: 30rpx;

				::v-deep .u-count-num {
					display: block;
					margin: 0 auto;
					color: #3d64ff;
				}

				.count-view-item-text {
					text-align: center;
					color: #2979ff;
				}
			}
		}

		::v-deep .u-button {
			width: 400rpx;
			margin: 20px auto;
		}
	}

	.info-popup-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		border-bottom: solid 1px #eee;
		padding: 0 60rpx;
	}
</style>