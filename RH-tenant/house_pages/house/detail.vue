<template>
	<view class="page-view">
		<u-swiper @click="swiperClick" v-if="houseInfo.headImg.length>0" :list="houseInfo.headImg" :height="300" indicator
			indicatorMode="line" circular autoplay></u-swiper>

		<view class="house-info">
			<view class="house-name">{{houseInfo.name || ''}}</view>
			<view class="landlord-bar">
				<view class="landlord-info">
					<image class="landlord-head-img" :src="landlordInfo.headImg" mode="aspectFill"></image>
					<view class="landlord-name">
						{{landlordInfo.name}}
					</view>
				</view>
				<view class="btn-view">

				</view>
			</view>
			<u--form :labelWidth='80' labelPosition="left" labelAlign="right">
				<u-divider text="租金信息"></u-divider>
				<u-form-item label="租金:">
					<u--text type="error" :text="'￥'+(houseInfo.price || '错误')"></u--text>
				</u-form-item>
				<u-form-item label="付款方式:">
					<text>押：{{houseInfo.depositNumber || ''}}月</text>
					<text>付：{{houseInfo.priceNumber || ''}}月</text>
				</u-form-item>
				<u-form-item label="水费:">
					<text>{{houseInfo.waterFee || 0}}元/吨</text>
				</u-form-item>
				<u-form-item label="电费:">
					<text>{{houseInfo.electricityFee || 0}}元/度</text>
				</u-form-item>
				<u-form-item label="网费:">
					<text>{{houseInfo.internetFee || 0}}元/年</text>
				</u-form-item>
				<u-form-item label="燃气费:">
					<text>{{houseInfo.fuelFee || 0}}元/月</text>
				</u-form-item>
				<u-divider text="房间信息"></u-divider>
				<u-form-item label="地址:">
					<view class="df">
						<text>{{houseInfo.provinceName || ''}}</text>
						<text v-show="houseInfo.cityName!=='直辖市'">{{houseInfo.cityName || ''}}</text>
						<text>{{houseInfo.areaName || ''}}</text>
						<text>{{houseInfo.addresInfo || ''}}</text>
					</view>
				</u-form-item>
				<u-form-item label="面积:">
					<text>{{houseInfo.area || ''}}</text>
				</u-form-item>
				<u-form-item label="楼层:">
					<text>{{houseInfo.floor || ''}}</text>
				</u-form-item>
				<u-form-item label="朝向:">
					<text v-if="houseInfo.toward===1">东</text>
					<text v-if="houseInfo.toward===2">西</text>
					<text v-if="houseInfo.toward===3">南</text>
					<text v-if="houseInfo.toward===4">北</text>
				</u-form-item>
				<u-form-item label="卫生间:">
					<text v-if="houseInfo.toilet===0">没有</text>
					<text v-if="houseInfo.toilet===1">独立</text>
					<text v-if="houseInfo.toilet===2">公用</text>
				</u-form-item>
				<u-form-item label="厨房:">
					<text v-if="houseInfo.kitchen===0">没有</text>
					<text v-if="houseInfo.kitchen===1">独立</text>
					<text v-if="houseInfo.kitchen===2">公用</text>
				</u-form-item>
				<u-form-item label="阳台:">
					<text v-if="houseInfo.balcony===1">有</text>
					<text v-if="houseInfo.balcony===0">无</text>
				</u-form-item>
			</u--form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: "",
				houseInfo: {},
				landlordInfo: {},
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
						this.landlordInfo = data.landlordUser
					}
				})
			},
			swiperClick(index) {
				uni.previewImage({
					current: index,
					urls: (this.houseInfo.headImg || []).map(item => item.url)
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.house-info {
		padding: 20rpx 36rpx 200rpx;

		.landlord-bar {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.landlord-info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 70%;

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
	}
</style>