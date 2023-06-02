<template>
	<view class="page-view">
		<u-navbar leftIconColor="#fff" title=" " bgColor="transparent" :autoBack="true">
		</u-navbar>
		<u-swiper @click="swiperClick" v-if="houseInfo.headImg.length>0" :list="houseInfo.headImg" :height="300" indicator
			indicatorMode="line" circular autoplay></u-swiper>
		<view class="house-info">
			<view class="house-name">{{houseInfo.name || ''}}</view>
			<view class="landlord-bar">
				<view class="landlord-info" @click="toLandlordDetail(landlordInfo)">
					<image class="landlord-head-img" :src="landlordInfo.headImg" mode="aspectFill"></image>
					<view class="landlord-name">
						{{landlordInfo.name}}
					</view>
				</view>
				<view class="btn-view">
					<u-icon v-if="houseInfo.isStar" :size="24" name="star-fill" color="#FFA92F" @click="starHosue"></u-icon>
					<u-icon v-else :size="24" name="star" @click="starHosue"></u-icon>
					<u-icon :size="26" name="phone" @click="callUser"></u-icon>
				</view>
			</view>
			<u-divider text="租金信息"></u-divider>
			<u--form class="form-card" :labelWidth='80' labelPosition="left" labelAlign="right">
				<u-form-item label="租金:">
					<u--text type="error" :text="'￥'+(houseInfo.price || '错误')"></u--text>
				</u-form-item>
				<u-form-item label="付款方式:">
					<text>押：{{houseInfo.depositNumber || 0}}月</text>
					<text>付：{{houseInfo.priceNumber || 0}}月</text>
				</u-form-item>
				<u-form-item label="水费:" v-if="houseInfo.waterFee !== null">
					<text>{{houseInfo.waterFee}}元/吨</text>
				</u-form-item>
				<u-form-item label="电费:" v-if="houseInfo.electricityFee !== null">
					<text>{{houseInfo.electricityFee}}元/度</text>
				</u-form-item>
				<u-form-item label="网费:" v-if="houseInfo.internetFee !== null">
					<text>{{houseInfo.internetFee}}元/年</text>
				</u-form-item>
				<u-form-item label="燃气费:" v-if="houseInfo.fuelFee !== null">
					<text>{{houseInfo.fuelFee}}元/月</text>
				</u-form-item>
			</u--form>
			<u-divider text="房间信息"></u-divider>
			<u--form class="form-card" :labelWidth='80' labelPosition="left" labelAlign="right">
				<u-form-item label="地址:">
					<view class="df">
						<text>{{houseInfo.provinceName || ''}}</text>
						<text v-show="houseInfo.cityName!=='直辖市'">{{houseInfo.cityName || ''}}</text>
						<text>{{houseInfo.areaName || ''}}</text>
						<text>{{houseInfo.addresInfo || ''}}</text>
					</view>
				</u-form-item>
				<u-form-item label="面积:" v-if="houseInfo.area !== null">
					<text>{{houseInfo.area}}</text>
				</u-form-item>
				<u-form-item label="楼层:" v-if="houseInfo.floor !== null">
					<text>{{houseInfo.floor}}</text>
				</u-form-item>
				<u-form-item label="朝向:" v-if="houseInfo.toward !== null">
					<text v-if="houseInfo.toward===1">东</text>
					<text v-if="houseInfo.toward===2">西</text>
					<text v-if="houseInfo.toward===3">南</text>
					<text v-if="houseInfo.toward===4">北</text>
				</u-form-item>
				<u-form-item label="卫生间:" v-if="houseInfo.toilet !== null">
					<text v-if="houseInfo.toilet===0">没有</text>
					<text v-if="houseInfo.toilet===1">独立</text>
					<text v-if="houseInfo.toilet===2">公用</text>
				</u-form-item>
				<u-form-item label="厨房:" v-if="houseInfo.kitchen !== null">
					<text v-if="houseInfo.kitchen===0">没有</text>
					<text v-if="houseInfo.kitchen===1">独立</text>
					<text v-if="houseInfo.kitchen===2">公用</text>
				</u-form-item>
				<u-form-item label="阳台:" v-if="houseInfo.balcony !== null">
					<text v-if="houseInfo.balcony===1">有</text>
					<text v-if="houseInfo.balcony===0">无</text>
				</u-form-item>
			</u--form>
			<u-divider text="评论信息"></u-divider>
			<view class="comment-view">
				<view class="comment-item" v-for="(item,index) in houseComments" :key="index">
					<view class="comment-head">
						<view class="comment-user">
							<image class="comment-user-head" :src="item.tenantsUser.headImg" mode="aspectFill"></image>
							<view class="comment-user-name">
								{{item.tenantsUser.name}}
							</view>
						</view>
						<u-rate :size="22" readonly active-color="#FFA92F" v-model="item.houseScore"></u-rate>
					</view>
					<view class="comment-text">
						{{item.houseComment}}
					</view>
					<view class="comment-img">
						<image class="comment-img-item" v-for="(imgItem,imgIndex) in item.houseCommentImg" :key="imgItem.url"
							:src="imgItem.url" mode="aspectFill" @click="previewImage(item.houseCommentImg,imgIndex)"></image>
					</view>
				</view>
				<u-empty mode="list" text="暂无评论" v-if="houseComments.length===0">
				</u-empty>
			</view>
			<u-button v-if="!leaseApplication" color="#FFA92F" @click="leaseHouse" :loading="btnloading" shape="circle"
				text="租赁"></u-button>
			<u-divider v-else text="已向房东发送租赁请求"></u-divider>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: "",
				houseInfo: {
					headImg: []
				},
				landlordInfo: {},
				houseComments: [],
				leaseApplication: null,
				btnloading: false
			}
		},
		onLoad(data) {
			this.id = data.id
			this.getDetail()
		},
		methods: {
			getDetail() {
				this.$http.request({
					url: "/api/rentalMarket/selectById",
					method: "get",
					data: {
						id: this.id
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1 && data) {
						try {
							data.house.headImg = JSON.parse(data.house.headImg)
						} catch (e) {
							data.house.headImg = []
						}
						this.houseInfo = data.house
						this.houseComments = (data.houseComments || []).map(item => {
							item.houseCommentImg = JSON.parse(item.houseCommentImg)
							return item
						})
						this.landlordInfo = data.landlordUser
						this.leaseApplication = data.leaseApplication
					}
				})
			},
			swiperClick(index) {
				uni.previewImage({
					current: index,
					urls: (this.houseInfo.headImg || []).map(item => item.url)
				})
			},
			callUser() {
				if (this.landlordInfo.phone) {
					uni.showModal({
						title: "提示",
						content: "是否电话联系房东？",
						success: ({
							confirm
						}) => {
							if (confirm) {
								uni.makePhoneCall({
									phoneNumber: this.landlordInfo.phone
								})
							}
						}
					})

				} else {
					uni.showToast({
						icon: 'none',
						title: "房东未留下电话，先收藏起来试试吧！"
					})
				}
			},
			starHosue() {
				this.$http.request({
					url: "/api/rentalMarket/starHouse",
					data: {
						rentalMarketId: this.id
					}
				}).then(({
					status
				}) => {
					if (status === 1) {
						this.getDetail()
					}
				})
			},
			leaseHouse() {
				uni.showModal({
					title: '提示',
					content: "您的信息将提供给房东，是否继续？",
					success: ({
						confirm
					}) => {
						if (confirm) {
							this.$http.request({
								url: "/api/leaseApplication/insert",
								method: "post",
								data: {
									houseId: this.houseInfo.id,
									landlordId: this.landlordInfo.id,
									rentalMarketId: Number(this.id)
								}
							}).then(({
								status
							}) => {
								if (status === 1) {
									uni.showToast({
										icon: 'none',
										title: "申请发送成功，等待处理。"
									})
									setTimeout(() => {
										this.getDetail()
									}, 1500)
								}
							})
						}
					}
				})
			},
			toLandlordDetail({
				id
			}) {
				uni.navigateTo({
					url: "/landlord_pages/detail/detail?id=" + id,
				})
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
	.house-info {
		padding: 20rpx 36rpx 200rpx;
		background-color: #fff;


		.landlord-bar {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.landlord-info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 70%;
				margin-top: 20rpx;

				.landlord-head-img {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					background-color: #f8f8f8;
					margin-right: 10rpx;
				}

				.landlord-name {
					width: calc(100% - 60rpx);
					color: #666;
					font-size: 28rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
			}

			.btn-view {
				width: 30%;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				::v-deep .u-icon {
					margin-left: 20rpx;
				}
			}

		}

		.house-name {
			font-size: 40rpx;
			line-height: 60rpx;
			color: #333;
			text-align: justify;
			margin-bottom: 10rpx;
			position: relative;
			padding-left: 30rpx;

			&:before {
				content: "";
				width: 20rpx;
				height: 40rpx;
				// background-color: #333;
				background-image: linear-gradient(135deg, #FFA92F, #FFDC2F);
				border-radius: 6rpx;
				position: absolute;
				left: 0;
				top: 0;
				bottom: 0;
				margin: auto 0;
			}
		}

		::v-deep .u-button {
			margin-top: 40rpx;
		}
	}

	.comment-view {
		width: 100%;
		box-sizing: border-box;

		.comment-item {
			box-sizing: border-box;
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