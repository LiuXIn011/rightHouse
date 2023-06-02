<template>
	<view>
		<u-swiper @click="swiperClick" v-if="houseInfo.headImg.length>0" :list="houseInfo.headImg" :height="300"
			indicator indicatorMode="line" circular autoplay></u-swiper>
		<u-navbar leftIcon="home" title="入住房间" v-else placeholder @leftClick="goToIndex">
		</u-navbar>
		<view class="house-info">
			<view class="house-name">{{houseInfo.name || ''}}</view>
			<u--form :labelWidth='80' labelPosition="left" labelAlign="right">
				<u-divider text="租金信息"></u-divider>
				<u-form-item label="租金:">
					<u--text type="error" :text="'￥'+(houseInfo.price || '错误')"></u--text>
				</u-form-item>
				<u-form-item label="付款方式:">
					<text>押：{{houseInfo.depositNumber || 0}}月</text>
					<text>付：{{houseInfo.priceNumber || 0}}月</text>
				</u-form-item>
				<u-form-item label="水费:" v-if="houseInfo.waterFee !== null">
					<text>{{houseInfo.waterFee || 0}}元/吨</text>
				</u-form-item>
				<u-form-item label="电费:" v-if="houseInfo.electricityFee !== null">
					<text>{{houseInfo.electricityFee || 0}}元/度</text>
				</u-form-item>
				<u-form-item label="网费:" v-if="houseInfo.internetFee !== null">
					<text>{{houseInfo.internetFee || 0}}元/年</text>
				</u-form-item>
				<u-form-item label="燃气费:" v-if="houseInfo.fuelFee !== null">
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
				<u-form-item label="面积:" v-if="houseInfo.area !== null">
					<text>{{houseInfo.area || ''}}</text>
				</u-form-item>
				<u-form-item label="楼层:" v-if="houseInfo.floor !== null">
					<text>{{houseInfo.floor || ''}}</text>
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
			<u-button color="#FFA92F" :loading="btnloading" @click="joinHouse" shape="circle" text="入住"></u-button>
		</view>
		<u-loading-page color="#FFA92F" loading-color="#FFA92F" :icon-size="loadingIconSize" :image="loadingImg"
			:loading-text="loadingText" loading-mode="circle" :loading="pageLoading"></u-loading-page>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				houseId: "",
				houseId: "",
				houseInfo: {},
				btnloading: false,
				pageLoading: false,
				loadingImg: "",
				loadingIconSize: 50,
				loadingText: '加载中。。。',
			}
		},
		onLoad(data) {
			this.houseId = data.id
			this.landlordId = data.landlordId
			let shareTime = data.t
			this.pageLoading = true
			// 超过24小时就不能加入
			if (Date.now() - shareTime > 86400000) {
				this.loadingImg = '/static/image/join_error.png'
				this.loadingIconSize = 100
				this.loadingText = "邀请链接已过期"
			} else {
				// 获取详情
				this.getDetail()
			}
		},
		methods: {
			getDetail() {
				this.$http.request({
					url: "/api/house/selectById",
					method: "get",
					data: {
						id: this.houseId
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						this.houseInfo = data
						if (data.headImg) {
							this.houseInfo.headImg = JSON.parse(data.headImg)
						} else {
							this.houseInfo.headImg = []
						}
					}
				}).finally(() => {
					this.pageLoading = false
				})
			},
			goToIndex() {
				console.log(123123);
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			joinHouse() {
				this.$http.request({
					url: "/api/house/joinTenant",
					method: "get",
					data: {
						landlordId: this.landlordId,
						houseId: this.houseId
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						uni.showToast({
							title: "入住成功！",
							icon: 'none'
						})
						setTimeout(() => {
							uni.switchTab({
								url: "/pages/index/index"
							})
						}, 1000)
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
<style lang="scss" scoped>
	.house-info {
		padding: 20rpx 36rpx 200rpx;
		background-color: #fff;

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
</style>
