<template>
	<view class="page-veiw">
		<u-swipe-action>
			<u-swipe-action-item @click="deleteItem(item)" v-for="(item,index) in list" :key="item.id"
				:options="swipeActionOptions">
				<view class="house-item">
					<image class="house-img" @click="toDetail(item.id)" :src="item.house.firstImg" mode="aspectFill"></image>
					<view class="house-info">
						<view class="house-name" @click="toDetail(item.id)">
							{{item.house.name}}
						</view>
						<view class="house-price" @click="toDetail(item.id)">
							￥{{item.house.price}}
						</view>
						<view class="house-star-count" @click="toDetail(item.id)">
							{{1}}人已收藏
						</view>
						<view class="house-landlord" @click="toLandlordDetail(item.landlordUser.id)">
							<image class="house-landlord-head" :src="item.landlordUser.headImg" mode="aspectFill"></image>
							<view class="house-landlord-name">
								{{item.landlordUser.name}}
							</view>
						</view>
					</view>
				</view>
			</u-swipe-action-item>
		</u-swipe-action>
		<u-empty mode="list" v-if="list.length===0">
		</u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				swipeActionOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#f56c6c'
					}
				}]
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			getList() {
				this.$http.request({
					url: "/api/rentalMarket/tenantStarHouseList"
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						this.list = (data || []).map(item => {
							try {
								item.house.headImg = JSON.parse(item.house.headImg)
								item.house.firstImg = item.house.headImg[0].url
							} catch (e) {
								//TODO handle the exception
								item.house.headImg = []
								item.house.firstImg = ''
							}
							return item
						})
					}
				})
			},
			deleteItem(data) {
				uni.showModal({
					title: "提示",
					content: `是否取消关注${data.house.name}`,
					success: ({
						confirm
					}) => {
						if (confirm) {
							this.$http.request({
								url: "/api/rentalMarket/updateStarStatus",
								method: "post",
								data: {
									rentalMarketId: data.id,
									status: 0
								}
							}).then(({
								status
							}) => {
								if (status === 1) {
									this.getList()
								}
							})
						}
					}
				})
			},
			toDetail(id) {
				uni.navigateTo({
					url: "/house_pages/house/detail?id=" + id,
				})
			},
			toLandlordDetail(id) {
				uni.navigateTo({
					url: "/landlord_pages/detail/detail?id=" + id,
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page-veiw {
		padding: 0 32rpx;

		::v-deep .u-swipe-action-item {
			margin-top: 20rpx;
			overflow: visible;
		}

		.house-item {
			background-color: #fff;
			box-sizing: border-box;
			box-shadow: 0 6rpx 30rpx 0 rgba(55, 86, 223, 0.1);
			border-radius: 10rpx;
			overflow: hidden;
			padding: 20rpx;
			display: flex;
		}

		.house-img {
			width: 200rpx;
			height: 160rpx;
			flex-shrink: 0;
			background-color: #f8f8f8;
		}

		.house-info {
			margin-left: 20rpx;

			.house-name {
				font-size: 30rpx;
				color: #333;
			}

			.house-price {
				font-size: 28rpx;
				color: red;
			}

			.house-star-count {
				font-size: 24rpx;
				color: #999;
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
</style>