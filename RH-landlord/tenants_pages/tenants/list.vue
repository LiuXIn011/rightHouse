<template>
	<view>
		<u-sticky bgColor="#fff">
			<u-subsection :list="statusList" :current="tenantStatus" @change="tabsChange"></u-subsection>
		</u-sticky>
		<view class="tenants-list">
			<view class="tenants-item" v-for="(item) in tenantList" :key="item.id">
				<view class="item-left">
					<s-image @click="previewHeadImg(item)" class="tenant-head-img" :src="item.headImg"
						mode="aspectFill">
					</s-image>
					<view>
						<view class="tenant-info">
							<text class="info-label">姓名：</text>
							<text class="info-value">{{item.name}}</text>
						</view>
						<view class="tenant-info" v-if="item.tenantStatus===1">
							<text class="info-label">电话：</text>
							<text class="info-value">{{item.phone}}</text>
						</view>
						<view class="tenant-info">
							<text class="info-label">入住日期：</text>
							<text class="info-value">{{item.checkInTime}}</text>
						</view>
						<view class="tenant-info" v-if="item.tenantStatus===0">
							<text class="info-label">退租日期：</text>
							<text class="info-value">{{item.outTime}}</text>
						</view>
					</view>
				</view>
				<!-- <u-button icon="phone-fill" shape="circle" type="primary"></u-button> -->
				<u-icon v-if="item.tenantStatus===1" @click="cellTenant(item)" name="phone" color="#2979ff"
					size="52rpx"></u-icon>
				<view class="close-btn" v-if="item.tenantStatus===1" @click="closeTenent(item)">
					<u-icon name="close" color="#fff" size="34rpx"></u-icon>
				</view>
			</view>
		</view>
		<u-empty mode="list" v-if="tenantList.length===0" text="暂无此类型租客">
		</u-empty>
		<view class="add-btn" @click="addTenants">
			<u-icon size="50rpx" bold color="#fff" name="plus"></u-icon>
		</view>
		<u-popup :round="10" :show="qrCodeShow" mode="center" @close="qrCodeClose">
			<view class="wx-qr-code-view">
				<view class="wx-qr-code-text-top">
					租客扫码加入
				</view>
				<s-image show-menu-by-longpress class="wx-qr-code" :src="wxQrCode"></s-image>
				<view class="wx-qr-code-text-bot">
					（长按分享给租客，有效期24H）
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import sImage from "@/components/sImage/sImage.vue"
	export default {
		data() {
			return {
				id: "",
				wxQrCode: "",
				qrCodeShow: false,
				tenantStatus: 1,
				tenantList: [],
				statusList: [{
					name: '退租租客',
					status: 0
				}, {
					name: '正常租客',
					status: 1
				}]

			}
		},
		components: {
			sImage
		},
		onLoad(data) {
			this.id = data.id
			uni.setNavigationBarTitle({
				title: `${decodeURI(data.name)}`
			})
		},
		onShow() {
			this.getTenantsList()
		},
		onPullDownRefresh() {
			this.getTenantsList()
		},
		methods: {
			tabsChange(item) {
				this.tenantStatus = item
				this.getTenantsList()
			},
			getTenantsList() {
				this.$http.request({
					url: "/api/house/getTenantsByHouseId",
					methods: "get",
					data: {
						houseId: this.id,
						tenantStatus: this.tenantStatus
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						this.tenantList = data.map(item => {
							item.headImg = item.headImg ||
								'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
							return item
						})
					}
				}).finally(() => {
					uni.stopPullDownRefresh();
				})
			},
			addTenants() {
				this.$http.request({
					url: "/api/house/addTenants",
					methods: "get",
					data: {
						id: this.id
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						let base64 = uni.arrayBufferToBase64(data.data)
						base64 = 'data:image/jpeg;base64,' + base64
						this.qrCodeShow = true
						this.wxQrCode = base64
					}
				})
			},
			qrCodeClose() {
				this.qrCodeShow = false
			},
			previewHeadImg({
				headImg
			}) {
				uni.previewImage({
					urls: [headImg]
				})
			},
			cellTenant({
				phone
			}) {
				uni.showModal({
					title: '将要拨打电话',
					content: phone,
					success: (res) => {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: phone
							})
						}
					}
				})
			},
			closeTenent(item) {
				uni.showModal({
					title: "提示",
					content: "是否确认清退该租客？",
					success: (res) => {
						if (res.confirm) {
							let data = {
								houseId: this.id,
								tanentId: item.id
							}
							return this.$http.request({
								url: "/api/house/houseOut",
								method: "post",
								data
							}).then(({
								status
							}) => {
								if (status === 1) {
									this.getTenantsList()
								}
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.tenants-list {
		padding: 20rpx 32rpx;

		.tenants-item {
			box-shadow: 0 6rpx 30rpx 0 rgba(55, 86, 223, 0.1);
			padding: 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			position: relative;
			overflow: hidden;

			.item-left {
				display: flex;
				align-items: center;

				.tenant-head-img {
					width: 140rpx;
					height: 140rpx;
					background-color: #ddd;
					border-radius: 50%;
					flex-shrink: 0;
					margin-right: 10px;
				}

				.tenant-info {
					display: flex;
					align-items: center;

					.info-label {
						color: #666;
						font-size: 28rpx;
						flex-shrink: 0;
					}

					.info-value {
						color: #999;
						font-size: 24rpx;
					}
				}
			}

			.close-btn {
				position: absolute;
				top: 0;
				right: 0;
				width: 50rpx;
				height: 50rpx;
				background-image: linear-gradient(135deg, #2979ff, #1dceff);
				border-radius: 0 0 0 36rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.wx-qr-code-view {
		padding: 20rpx;

		.wx-qr-code-text-top {
			text-align: center;
			font-size: 40rpx;
			font-weight: bold;
			color: #2979ff;
		}

		.wx-qr-code {
			margin-top: 20rpx;
			width: 500rpx;
			height: 500rpx;
			display: block;
		}

		.wx-qr-code-text-bot {
			text-align: center;
			font-size: 26rpx;
			color: #aaa;
		}
	}

	.add-btn {
		position: fixed;
		right: 20rpx;
		bottom: 100rpx;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background-image: linear-gradient(135deg, #2979ff, #1dceff);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 30rpx 0 rgba(0, 0, 0, 0.2);
	}
</style>
