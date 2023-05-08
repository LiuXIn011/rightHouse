<template>
	<view class="page-view">
		<view class="search-view">
			<u-search shape="round" placeholder="房屋名称/房东名称" :showAction="false" v-model="searchData.keyword"
				@search="searchList"></u-search>
		</view>
		<scroll-view class="house-list" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="item-shell">
				<view class="house-item" v-for="(item,index) in houseList" :key="item.id" @click="toDetail(item)">
					<image class="house-item-first-img" :src="item.firstImg" mode="aspectFill"></image>
					<view class="house-item-info">
						<view class="house-name">
							{{item.house.name}}
						</view>
						<view class="house-price-view">
							<view class="house-like-count">
								{{item.starCount}}收藏
							</view>
							<view class="house-price">
								￥{{item.house.price}}/月
							</view>
						</view>
						<view class="house-landlord">
							<image class="house-landlord-head" :src="item.landlordUser.headImg" mode="aspectFill"></image>
							<view class="house-landlord-name">
								{{item.landlordUser.name}}
							</view>
						</view>
					</view>
				</view>
				<u-loadmore v-if="houseList.length>0" :status="loadmoreStatus" />
			</view>
			<u-empty mode="list" v-if="houseList.length===0">
			</u-empty>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchData: {
					keyword: "",
					index: 1,
					size: 10
				},
				houseList: [],
				loadmoreStatus: "loadmore"
			}
		},
		onShow() {
			this.getList()
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
				this.houseList = []
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
			toDetail({
				id
			}) {
				uni.navigateTo({
					url: "/house_pages/house/detail?id=" + id,
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
			height: calc(100vh - 100rpx);

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
							justify-content: space-between;
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