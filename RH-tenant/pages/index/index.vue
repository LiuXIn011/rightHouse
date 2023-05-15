<template>
	<view class="page-veiw">
		<u-navbar v-if="houseList.length>1" bgColor="transparent" leftIconColor="#fff" @leftClick="chooseHouse"
			leftIconSize="30px" leftIcon="list-dot">
		</u-navbar>
		<u-swiper @click="swiperClick" :list="houseInfo.headImg" :interval="5000" height="80%" indicatorMode="line"
			bgColor="#ddd" circular autoplay></u-swiper>
		<view class="house-info-view">
			<view class="house-title-view">
				<view class="house-name">
					{{houseInfo.name || '无名'}}
				</view>
				<view class="house-close" @click="closeHousue">
					<u-icon size="46rpx" name="close" color="#fa3534"></u-icon>
				</view>
			</view>
			<view class="house-price-view">
				<view class="house-info-text">
					<view>房租：{{houseInfo.price || ''}}</view>
					<view>房东：{{houseInfo.landlordUser.name || ''}}</view>
					<view>入住时间：{{houseInfo.checkInTime || ''}}</view>
				</view>
				<view class="house-check-in-number">
					<text class="house-check-in-title">已入住</text>
					<u-count-to color="#fff" :bold="true" fontSize="80rpx" :startVal="0"
						:endVal="houseInfo.checkInDays || 0"></u-count-to>
					<text class="house-check-in-unit">天</text>
				</view>
			</view>
			<view class="btn-view">
				<u-button type="warning" color='#FFA92F' @click="makePhone" text="联系房东"></u-button>
				<u-button type="primary" text="房间报修" @click="toMaintenance"></u-button>
			</view>
		</view>
		<u-loading-page color="#FFA92F" loading-color="#FFA92F" :icon-size="loadingSize" :image="loadingImg"
			:loading-text="loadingText" loading-mode="circle" :loading="pageLoading"></u-loading-page>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				houseList: [],
				houseInfo: {},
				pageLoading: false,
				loadingSize: 50,
				loadingImg: "",
				loadingText: '加载中...',
			}
		},
		onLoad() {
			this.pageLoading = true
		},
		onShow() {
			if (this.isLogin) {
				this.getHouseList()
			} else {
				this.loadingImg = '/static/image/nohouse.png'
				this.loadingSize = 200
				this.loadingText = "登陆后查看"
			}
		},
		computed: {
			...mapState(['isLogin']),
		},
		methods: {
			getHouseList() {
				return this.$http.request({
					url: "/api/tenantsUser/getHouseByTenantId",
					method: "get",
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						this.houseList = data
						if (
							data &&
							Array.isArray(data) &&
							data.length > 0
						) {
							this.switchHouseInfo(data[0])
							this.pageLoading = false
						} else {
							this.loadingImg = '/static/image/nohouse.png'
							this.loadingSize = 200
							this.loadingText = "暂无租房"
							this.pageLoading = true
						}
					}
				})
			},
			switchHouseInfo(data) {
				this.houseInfo = JSON.parse(JSON.stringify(data))
				if (
					this.houseInfo.headImg
				) {
					this.houseInfo.headImg = JSON.parse(this.houseInfo.headImg)
					if (this.houseInfo.headImg.length === 0) {
						this.houseInfo.headImg = [{
							url: '/static/image/no-img.jpg'
						}]
					}
				} else {
					this.houseInfo.headImg = [{
						url: '/static/image/no-img.jpg'
					}]
				}
			},
			swiperClick(index) {
				uni.previewImage({
					current: index,
					urls: (this.houseInfo.headImg || []).map(item => item.url)
				})
			},
			chooseHouse() {
				uni.showActionSheet({
					title: "选择房屋",
					itemList: this.houseList.map(item => item.name),
					success: ({
						tapIndex
					}) => {
						this.switchHouseInfo(this.houseList[tapIndex])
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			makePhone() {
				uni.showModal({
					title: '将要拨打电话',
					content: this.houseInfo.landlordUser.phone,
					success: (res) => {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: this.houseInfo.landlordUser.phone
							})
						}
					}
				})
			},
			toMaintenance() {
				uni.navigateTo({
					url: "/house_pages/house/maintenance?houseId=" + this.houseInfo.id
				})
			},
			closeHousue() {
				uni.showModal({
					title: "提示",
					content: "是否确认退租？",
					success: (res) => {
						if (res.confirm) {
							let data = {
								landlordId: this.houseInfo.landlordUser.id,
								houseId: this.houseInfo.id
							}
							return this.$http.request({
								url: "/api/house/houseOut",
								method: "post",
								data
							}).then(({
								status
							}) => {
								if (status === 1) {
									this.getHouseList()
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-veiw {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		position: relative;

		::v-deep .u-swiper {
			align-items: start;
		}

		::v-deep .u-swiper__wrapper {
			height: 100% !important;
		}

		::v-deep .u-swiper__wrapper__item__wrapper__image {
			height: 100% !important;
		}

		.house-info-view {
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			box-shadow: 0 4rpx 20rpx 0 rgba(218, 218, 218, 0.25);
			background-color: #fff;
			border-radius: 50rpx 50rpx 0 0;
			padding: 32rpx;
			box-sizing: border-box;

			.house-title-view {
				width: 100%;
				margin-bottom: 20rpx;
				padding-bottom: 10rpx;
				border-bottom: dashed 2rpx #FFA92F;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.house-name {
					width: 100%;
					color: #FFA92F;
					font-size: 40rpx;
					line-height: 60rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					margin-right: 20rpx;
				}

				.house-close {
					height: 60rpx;
					width: 60rpx;
					flex-shrink: 0;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}


			.house-price-view {
				width: 100%;
				display: flex;
				justify-content: space-between;

				.house-info-text {
					width: 80%;

					& view {
						color: #999;
						font-size: 28rpx;
						margin-bottom: 10rpx;
					}

					.house-out {
						color: #fa3534;
						font-size: 32rpx;
					}
				}

				.house-check-in-number {
					flex-shrink: 0;
					width: 200rpx;
					height: 200rpx;
					// background-color: #FFA92F;
					background-image: linear-gradient(#FFA92F, #FFDC2F);
					border-radius: 10rpx;
					position: relative;

					.house-check-in-title {
						font-size: 32rpx;
						color: #fff;
						font-weight: bold;
						position: absolute;
						top: 10rpx;
						left: 0;
						right: 0;
						margin: 0 auto;
						text-align: center;
					}

					.house-check-in-unit {
						font-size: 24rpx;
						color: #fff;
						position: absolute;
						bottom: 10rpx;
						right: 10rpx;
					}

					::v-deep .u-count-num {
						display: block;
						position: absolute;
						margin: auto;
						left: 0;
						top: 0;
						bottom: 0;
						right: 0;
						text-align: center;
						line-height: 200rpx;
					}
				}
			}

			.btn-view {
				margin-top: 20rpx;
				display: flex;

				::v-deep .u-button {
					border: none;
					border-radius: 0;

					&:first-child {
						border-radius: 40rpx 0 0 40rpx;
					}

					&:last-child {
						border-radius: 0 40rpx 40rpx 0;
					}
				}
			}
		}
	}
</style>