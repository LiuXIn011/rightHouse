<template>
	<view class="page-view">
		<u-navbar placeholder :leftText="locationAddressText" leftIcon="map" bgColor="#FFA92F"
			@leftClick="getUserLocationAuth(1)">
		</u-navbar>
		<view class="search-view">
			<u-search shape="round" placeholder="房屋名称/房东名称/地址" :showAction="false" v-model="searchData.keyword"
				@search="searchList"></u-search>
		</view>
		<scroll-view class="house-list" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="item-shell">
				<view class="house-item" v-for="(item,index) in houseList" :key="item.id">
					<image @click="toHouseDetail(item)" class="house-item-first-img" :src="item.firstImg" mode="aspectFill">
					</image>
					<view class="house-item-info">
						<view class="house-name" @click="toHouseDetail(item)">
							{{item.house.name}}
						</view>
						<view class="house-price-view" @click="toHouseDetail(item)">
							<view class="house-like-count">
								{{item.starCount}}收藏
							</view>
							<view class="house-price">
								￥{{item.house.fakePrice || item.house.price}}/月
							</view>
						</view>
						<view class="house-landlord" @click="toLandlordDetail(item)">
							<image class="house-landlord-head" :src="item.landlordUser.headImg" mode="aspectFill"></image>
							<view class="house-landlord-name">
								{{item.landlordUser.name}}
							</view>
						</view>
					</view>
				</view>
				<u-loadmore v-if="houseList.length>0" :status="loadmoreStatus" />
			</view>
			<u-empty text="附近暂无出租" mode="list" v-if="houseList.length===0">
			</u-empty>
		</scroll-view>
	</view>
</template>

<script>
	import amap from '../../common/amap-wx.130.js';
	export default {
		data() {
			return {
				searchData: {
					keyword: "",
					latitude: "",
					longitude: "",
					index: 1,
					size: 10
				},
				houseList: [],
				amapPlugin: null,
				locationAddressText: "",
				addressInfo: {},
				isFirstLoad: true,
				loadmoreStatus: "loadmore",
			}
		},
		onLoad() {
			this.amapPlugin = new amap.AMapWX({
				key: this.$mapKey
			});
			this.getUserLocationAuth(2)
		},
		onShow() {
			if (!isFirstLoad) {
				this.getList()
			}
			this.isFirstLoad = false
		},
		methods: {
			scrolltolower() {
				if (this.houseList.length >= (this.searchData.size * this.searchData.index)) {
					this.searchData.size += 10
					this.getList()
				}
			},
			searchList() {
				this.searchData.index = 1
				this.getList()
			},
			getList() {
				this.$http.request({
					url: "/api/rentalMarket/list",
					methods: "get",
					data: this.searchData
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						let dataList = (data || []).map(item => {
							item.house.headImg = JSON.parse(item.house.headImg)
							try {
								item.firstImg = item.house.headImg[0].url || ''
							} catch (e) {
								item.firstImg = ''
							}
							return item
						})
						this.houseList = dataList
						if (this.houseList.length < (this.searchData.size * this.searchData.index)) {
							this.loadmoreStatus = 'nomore'
						} else {
							this.loadmoreStatus = 'loadmore'
						}
					}
				})
			},
			toHouseDetail({
				id
			}) {
				uni.navigateTo({
					url: "/house_pages/house/detail?id=" + id,
				})
			},
			toLandlordDetail({
				landlordUser
			}) {
				uni.navigateTo({
					url: "/landlord_pages/detail/detail?id=" + landlordUser.id,
				})
			},
			getUserLocationAuth(type) {
				// type1选择地址  2定位地址
				// 查询是否授权
				uni.getSetting({
					success: (res) => {
						if (res.authSetting['scope.userLocation']) {
							// 已授权
							if (type === 1) {
								this.chooseLocationFun()
							} else {
								this.getLocationFun()
							}
						} else {
							// 未授权去获取授权
							uni.authorize({
								scope: 'scope.userLocation',
								success: () => {
									if (type === 1) {
										this.chooseLocationFun()
									} else {
										this.getLocationFun()
									}
								},
								fail: () => {
									uni.showToast({
										icon: 'none',
										title: '无法获取位置，请打开位置设置。'
									})
									setTimeout(() => {
										this.searchData.latitude = ''
										this.searchData.longitude = ''
										this.getList()
									}, 1500)
								}
							})
						}
					}
				})
			},

			chooseLocationFun() {
				uni.chooseLocation({
					success: (data) => {
						const {
							errMsg,
							latitude,
							longitude,
							name
						} = data
						console.log(data);
						if (errMsg === "chooseLocation:ok") {
							// 控制12个字符以内
							if (name.length > 12) {
								this.locationAddressText = name.slice(0, 12) + '...'
							} else {
								this.locationAddressText = name
							}
							this.searchData.latitude = latitude
							this.searchData.longitude = longitude
							this.searchList()
						}
					},
					fail: (err) => {
						uni.showToast({
							icon: 'error',
							title: '获取失败'
						})
					}
				})
			},
			getLocationFun() {
				uni.showLoading({
					title: "获取位置中"
				})
				if (!this.amapPlugin) {
					uni.showToast({
						icon: 'error',
						title: '定位组件异常'
					})
					return
				}
				this.amapPlugin.getRegeo({
					success: (data) => {
						console.log(data);
						try {
							// 显示的地址
							let addressTxt = data[0].desc
							// 控制12个字符以内
							if (addressTxt.length > 12) {
								this.locationAddressText = addressTxt.slice(0, 12) + '...'
							} else {
								this.locationAddressText = addressTxt
							}
							this.searchData.latitude = data[0].latitude
							this.searchData.longitude = data[0].longitude
							this.getList()
						} catch (e) {
							uni.showToast({
								title: "获取位置失败，请重启小程序",
								icon: "error"
							})
							this.locationAddressText = '点击获取位置'
							setTimeout(() => {
								this.searchData.latitude = ''
								this.searchData.longitude = ''
								this.getList()
							}, 1500)
						}
					},
					fail: () => {
						uni.showToast({
							icon: 'error',
							title: '定位失败'
						})
						this.locationAddressText = '点击获取位置'
						setTimeout(() => {
							this.searchData.latitude = ''
							this.searchData.longitude = ''
							this.getList()
						}, 1500)
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page-view {
		.search-view {
			padding: 16rpx 32rpx;
			background-color: #FFA92F;
		}

		.house-list {
			height: calc(100vh - 280rpx);

			.item-shell {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 12rpx 32rpx 32rpx;
			}

			.house-item {
				width: 330rpx;
				background-color: #fff;
				box-sizing: border-box;
				box-shadow: 0 6rpx 30rpx 0 rgba(55, 86, 223, 0.1);
				border-radius: 10rpx;
				overflow: hidden;
				// margin: 0 32rpx 20rpx;
				margin-top: 20rpx;

				.house-item-first-img {
					display: block;
					width: 100%;
					height: 330rpx;
					background-color: #f8f8f8;
				}

				.house-item-info {
					padding: 20rpx;

					.house-name {
						font-size: 28rpx;
						color: #333;
					}

					.house-price-view {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: 10rpx;

						.house-like-count {
							font-size: 24rpx;
							color: #999;
						}

						.house-price {
							font-size: 28rpx;
							color: red;
						}
					}

					.house-landlord {
						display: flex;
						align-items: center;
						margin-top: 10rpx;

						.house-landlord-head {
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
							margin-right: 10rpx;
							background-color: #f8f8f8;
						}

						.house-landlord-name {
							width: calc(100% - 50rpx);
							font-size: 24rpx;
							color: #666;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
						}
					}
				}
			}
		}
	}
</style>