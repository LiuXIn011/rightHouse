<template>
	<view class="history-view">
		<view class="history-item" v-for="(item,ind) in houseList" :key="ind">
			<view class="history-body">
				<image class="item-headImg" @click="showHeadImg(item)" :src="item.firstheadImg" mode="aspectFill">
				</image>
				<view class="item-info">
					<view class="item-status-name">
						<view class="item-name">
							{{item.name}}
						</view>
						<u-tag text="在租" plain size="mini" v-if="item.houseStatus===1" type="success"></u-tag>
						<u-tag text="退租" plain size="mini" v-if="item.houseStatus===0" type="error"></u-tag>
					</view>
					<view class="item-address">
						<text>地址：</text>
						<text>{{item.provinceName || ''}}</text>
						<text v-show="item.cityName!=='直辖市'">{{item.cityName || ''}}</text>
						<text>{{item.areaName || ''}}</text>
						<text>{{item.addresInfo || ''}}</text>
					</view>
					<view class="item-time">
						入住时间：{{item.checkInTime}}
					</view>
				</view>
			</view>
			<view class="history-btn" v-if="item.houseStatus===0">
				<u-button v-if="item.commentId" text="查看评价" size="mini" type="primary" @click="toComments(item)"></u-button>
				<u-button v-else text="评价" size="mini" type="success" @click="toComments(item)"></u-button>
			</view>
		</view>
		<u-empty mode="history" v-if="houseList.length===0">
		</u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				houseList: []
			}
		},
		onShow() {
			this.getHouseList()
		},
		methods: {
			getHouseList() {
				return this.$http.request({
					url: "/api/tenantsUser/getHouseByTenantId",
					data: {
						type: "all"
					},
					method: "get",
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						this.houseList = data.map(item => {
							if (
								item.headImg
							) {
								item.headImg = JSON.parse(item.headImg)
								if (item.headImg.length === 0) {
									item.headImg = [{
										url: '/static/image/no-img.jpg'
									}]
								}
							} else {
								item.headImg = [{
									url: '/static/image/no-img.jpg'
								}]
							}
							item.firstheadImg = item.headImg[0].url

							return item
						})
					}
				})
			},
			showHeadImg(data) {
				uni.previewImage({
					urls: (data.headImg || []).map(item => item.url)
				})
			},
			toComments(data) {
				let url = ''
				if (data.commentId) {
					url = `/house_pages/comments/add?id=${data.commentId}&houseId=${data.id}&landlordId=${data.landlordUser.id}`
				} else {
					url = `/house_pages/comments/add?houseId=${data.id}&landlordId=${data.landlordUser.id}`
				}
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.history-view {
		padding: 0 32rpx;

		.history-item {
			background-color: #fff;
			margin-top: 30rpx;
			border-radius: 10rpx;
			box-shadow: 0 6rpx 30rpx 0 rgba(55, 86, 223, 0.1);
			padding: 20rpx;

			.history-body {
				display: flex;
				justify-content: space-between;

				.item-headImg {
					width: 140rpx;
					height: 140rpx;
					background-color: #ddd;
					border-radius: 10rpx;
					flex-shrink: 0;
				}

				.item-info {
					width: calc(100% - 160rpx);
					display: flex;
					flex-direction: column;
					justify-content: center;



					.item-address,
					.item-time {
						color: #999;
						font-size: 28rpx;
					}

					.item-status-name {
						display: flex;
						width: 100%;
						justify-content: space-between;
						margin-bottom: 10px;

						.item-name {
							color: #FFA92F;
							font-size: 32rpx;
							text-align: justify;
							margin-right: 20rpx;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
						}

					}
				}
			}

			.history-btn {
				margin-top: 20rpx;
			}
		}
	}
</style>