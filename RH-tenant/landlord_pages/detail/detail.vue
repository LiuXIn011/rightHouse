<template>
	<view class="page-veiw">
		<u-navbar leftIconColor="#fff" bgColor="transparent" :autoBack="true">
		</u-navbar>
		<image class="head_bg" src="/static/image/landlord_bg.jpg" mode="aspectFill"></image>
		<view class="landlord-detail">
			<view class="landlord-info">
				<image :src="detail.headImg" class="landlord-img" mode="aspectFill"></image>
				<view class="landlord-text">
					<view class="landlord-name">
						{{detail.name || ''}}
					</view>
					<view class="landlord-days">
						已经入驻
						<u-count-to color="#FFA92F" :bold="true" fontSize="24rpx" :startVal="0"
							:endVal="detail.checkInDays || 0"></u-count-to>
						天
					</view>
				</view>
			</view>
		</view>
		<view class="content-view">
			<view class="content-tabs">
				<u-tabs :list="tabsList" @change="tabsChange"></u-tabs>
			</view>
			<u-transition :show="tabsIndex===0" mode="fade">
				<view class="hosue-view">
					<view class="house-item" v-for="(item,index) in detail.rentalMarkets" :key="item.id">
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
						</view>
					</view>
					<u-empty mode="list" text="暂无出租" v-if="detail.rentalMarkets.length===0">
					</u-empty>
				</view>
			</u-transition>
			<u-transition :show="tabsIndex===1" mode="fade">
				<view class="comment-view">
					<view class="comment-item" v-for="(item,index) in detail.comments" :key="item.key">
						<view class="comment-head">
							<view class="comment-user">
								<image class="comment-user-head" :src="item.tenantsUser.headImg" mode="aspectFill"></image>
								<view class="comment-user-name">
									{{item.tenantsUser.name}}
								</view>
							</view>
							<u-rate :size="22" readonly active-color="#FFA92F" v-model="item.landlordScore"></u-rate>
						</view>
						<view class="comment-text">
							{{item.landlordComment}}
						</view>
						<view class="comment-img">
							<image class="comment-img-item" v-for="(imgItem,imgIndex) in item.landlordCommentImg" :key="imgItem.url"
								:src="imgItem.url" mode="aspectFill" @click="previewImage(item.landlordCommentImg,imgIndex)"></image>
						</view>
					</view>
					<u-empty mode="list" text="暂无评论" v-if="detail.comments.length===0">
					</u-empty>
				</view>
			</u-transition>
		</view>
	</view>
</template>

<script>
	import {
		log
	} from 'util'
	export default {
		data() {
			return {
				landlordId: "",
				tabsIndex: 0,
				detail: {
					comments: [],
					rentalMarkets: [],
				},
				tabsList: [{
						name: '在租房屋'
					},
					{
						name: '租客评价'
					}
				],
			}
		},
		onLoad(data) {
			this.landlordId = data.id
		},
		onShow() {
			this.getDetail()
		},
		methods: {
			getDetail() {
				this.$http.request({
					url: "/api/landlordUser/getRentalMarketAndCommentsByLandlordId",
					data: {
						landlordId: this.landlordId
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						try {
							// 房屋图片处理
							data.rentalMarkets = data.rentalMarkets.map(item => {
								item.house.headImg = JSON.parse(item.house.headImg)
								item.firstImg = item.house.headImg[0].url || ''
								return item
							})
							// 评论图片处理
							data.comments = data.comments.map(item => {
								item.key = `${item.landlordComment}${item.id}`
								item.landlordCommentImg = JSON.parse(item.landlordCommentImg)
								return item
							})

						} catch (e) {
							//TODO handle the exception
						}
						data.checkInDays = Math.ceil((Date.now() - new Date(data.createdAt).getTime()) / 86400000);
						this.detail = data || {}
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
			tabsChange({
				index
			}) {
				this.tabsIndex = index
			},
			previewImage(list, current) {
				uni.previewImage({
					current,
					urls: list.map(item => item.url)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.head_bg {
		width: 100%;
		height: 400rpx;
		background-color: #f8f8f8;
	}

	.landlord-detail {
		padding: 32rpx;
		background-color: #fff;
		margin-top: -20rpx;
		border-radius: 20rpx;
		position: relative;
		z-index: 10;

		.landlord-info {
			display: flex;
			align-items: flex-end;
			margin-top: -110rpx;

			.landlord-img {
				width: 80px;
				height: 80px;
				border-radius: 50%;
				background-color: #f8f8f8;
				border: solid 16rpx #fff;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.landlord-name {
				font-size: 32rpx;
				color: #333;
			}

			.landlord-days {
				font-size: 24rpx;
				color: #999;
				margin-top: 10rpx;
			}
		}
	}

	.content-view {
		margin-top: 30rpx;
		position: relative;

		.content-tabs {
			background-color: #fff;
			padding: 0 10rpx;
		}
	}

	.hosue-view {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 12rpx 32rpx 32rpx;
		position: absolute;
		left: 0;
		top: 88rpx;
		width: 100%;
		box-sizing: border-box;

		.house-item {
			width: 330rpx;
			background-color: #fff;
			box-sizing: border-box;
			box-shadow: 0 6rpx 30rpx 0 rgba(55, 86, 223, 0.1);
			border-radius: 10rpx;
			overflow: hidden;
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
			}
		}
	}

	.comment-view {
		padding: 12rpx 32rpx 32rpx;
		position: absolute;
		left: 0;
		top: 88rpx;
		width: 100%;
		box-sizing: border-box;

		.comment-item {
			background-color: #fff;
			box-sizing: border-box;
			box-shadow: 0 6rpx 30rpx 0 rgba(55, 86, 223, 0.1);
			border-radius: 10rpx;
			overflow: hidden;
			margin-top: 20rpx;
			padding: 20rpx;

			.comment-head {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.comment-user {
					display: flex;
					align-items: center;

					.comment-user-head {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						margin-right: 10rpx;
						background-color: #f8f8f8;
					}

					.comment-user-name {
						font-size: 24rpx;
						color: #666;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
				}
			}

			.comment-text {
				font-size: 28rpx;
				color: #333;
				text-align: justify;
				margin-top: 20rpx;
			}

			.comment-img {
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;

				.comment-img-item {
					width: 200rpx;
					height: 200rpx;
					margin-bottom: 22rpx;
					margin-right: 22rpx;
					background-color: #f8f8f8;
					border-radius: 10rpx;

					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}
	}
</style>