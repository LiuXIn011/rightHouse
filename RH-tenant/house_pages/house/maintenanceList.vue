<template>
	<view class="page-view">
		<view class="maintenance-item" v-for="(item) in list" :key="item.id">
			<view class="item-title">
				{{item.house.name}}
			</view>
			<view class="item-info">
				问题描述：{{item.title}}
			</view>
			<!-- <view class="df item-address">
				<text>地址：</text>
				<text>{{item.house.provinceName || ''}}</text>
				<text v-show="item.house.cityName!=='直辖市'">{{item.house.cityName || ''}}</text>
				<text>{{item.house.areaName || ''}}</text>
				<text>{{item.house.addresInfo || ''}}</text>
			</view> -->
			<view class="item-image-view">
				<s-image v-for="(hItem,hInd) in item.images" :key="hInd" @click="previewImg(item.images,hInd)"
					class="item-img" :src="hItem.url" mode="aspectFill">
				</s-image>
				<view class="item-img item-video" v-if="item.video" @click="previewVideo(item.video)">
					<u-icon name="play-circle" color="#fff" size="40"></u-icon>
				</view>
			</view>
			<view class="item-foot">
				<view class="item-create-time">
					{{item.createdAt}}
				</view>
				<u-tag v-if="item.status===0" text="维修中"></u-tag>
				<u-tag v-if="item.status===1" text="已维修" type="success"></u-tag>
			</view>
		</view>
		<u-overlay :show="videoShow" @click="videoShow = false">
			<view class="video-view">
				<video v-if="videoShow" :src="videoShowUrl" @tap.stop class="preview-video" autoplay controls></video>
			</view>
		</u-overlay>
		<u-empty mode="order" v-if="list.length===0" text="暂无报修!">
		</u-empty>
	</view>
</template>

<script>
	import sImage from "@/components/sImage/sImage.vue"
	export default {
		data() {
			return {
				list: [],
				videoShow: false,
				videoShowUrl: "",
			}
		},
		onShow() {
			this.getList()
		},
		onPullDownRefresh() {
			this.getList()
		},
		components: {
			sImage
		},
		methods: {
			getList() {
				return this.$http.request({
					url: "/api/landlordUser/getMaintenanceListByTenantId",
					method: "get",
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						this.list = (data || []).map(item => {
							item.images = JSON.parse(item.images || '[]')
							item.house = item.house || {}
							return item
						})
					}
				}).finally(() => {
					uni.stopPullDownRefresh();
				})
			},
			previewImg(urls, index) {
				uni.previewImage({
					urls: (urls || []).map(item => item.url),
					current: index
				})
			},
			previewVideo(url) {
				this.videoShow = true
				this.videoShowUrl = url
			},
		}
	}
</script>

<style scoped lang="scss">
	.page-view {
		padding: 0 32rpx 32rpx;

		.maintenance-item {
			box-shadow: 0 6rpx 30rpx 0 rgba(55, 86, 223, 0.1);
			padding: 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
			margin-top: 40rpx;

			.item-title {
				font-size: 32rpx;
				color: #FFA92F;
				line-height: 60rpx;
				border-bottom: 2rpx dashed #FFA92F;
			}

			.item-info {
				margin-top: 20rpx;
				color: #666;
				font-size: 28rpx;
				text-align: justify;
				line-height: 40rpx;
			}

			.item-image-view {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 15rpx;

				.item-img {
					width: 150rpx;
					height: 150rpx;
					// margin-right: 15rpx;
					// margin-bottom: 15rpx;
					border-radius: 10rpx;

					&:nth-child(4n) {
						margin-right: 0;
					}
				}

				.item-video {
					background-image: linear-gradient(135deg, #FFA92F, #FFDC2F);
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.item-address {
				color: #666;
				font-size: 28rpx;
				text-align: justify;
				line-height: 40rpx;
			}

			.item-foot {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item-create-time {
					color: #999;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}

		.video-view {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			.preview-video {
				width: 100%;
				max-width: 750rpx;
				background-color: #000;
				height: 420rpx;
			}
		}
	}
</style>
