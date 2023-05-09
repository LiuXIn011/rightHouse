<template>
	<view class="page-view">
		<view class="lease-item" v-for="(item) in list" :key="item.id">
			<view class="item-title">
				{{item.house.name}}
			</view>
			<view class="df item-address">
				<text>地址：</text>
				<text>{{item.house.provinceName || ''}}</text>
				<text v-show="item.house.cityName!=='直辖市'">{{item.house.cityName || ''}}</text>
				<text>{{item.house.areaName || ''}}</text>
				<text>{{item.house.addresInfo || ''}}</text>
			</view>
			<view class="tanent-view">
				<view class="tanent-info">
					<image :src="item.tenantsUser.headImg" mode="aspectFill" class="tanent-img"></image>
					<view>
						<view class="tanent-name">
							{{item.tenantsUser.name}}
						</view>
						<view class="tanent-phone">
							{{item.tenantsUser.phone}}
						</view>
					</view>
				</view>
				<u-icon @click="callPhone(item.tenantsUser.phone)" name="phone-fill" color="#2979ff" size="32"></u-icon>
			</view>
			<view class="item-address">
				<text>申请日期：{{item.createdAt}}</text>
			</view>
			<view class="btn-view">
				<u-button size='small' type="primary" text="通过申请" @click="updateLease(item,1)"></u-button>
				<u-button size='small' type="error" text="驳回申请" @click="updateLease(item,2)"></u-button>
			</view>
		</view>
		<u-empty marginTop="40px" mode="order" v-if="list.length===0" text="暂无申请!">
		</u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			getList() {
				this.$http.request({
					url: "/api/leaseApplication/selectByLandlordId",
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						this.list = data
					}
				})
			},
			updateLease(item, status) {
				let content = ''
				let data = {}
				if (status === 1) {
					content = "是否通过申请？租客将直接入住房屋。"
					data = {
						id: item.id,
						status,
						houseId: item.house.id,
						tenantId: item.tenantsUser.id,
						landlordId: item.landlordUser.id,
					}
				} else {
					// 驳回
					content = "是否驳回申请？"
					data = {
						id: item.id,
						status
					}
				}
				// 通过
				uni.showModal({
					title: "提示",
					content,
					success: ({
						confirm
					}) => {
						if (confirm) {
							this.updateSave(data)
						}
					}
				})
			},
			updateSave(data) {
				this.$http.request({
					url: "/api/leaseApplication/updateStatus",
					method: "post",
					data
				}).then(({
					status
				}) => {
					if (status === 1) {
						this.getList()
					}
				})
			},
			callPhone(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-view {
		padding: 0 32rpx 32rpx;

		.lease-item {
			box-shadow: 0 6rpx 30rpx 0 rgba(55, 86, 223, 0.1);
			padding: 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
			margin-top: 40rpx;

			.item-title {
				font-size: 32rpx;
				color: #2979ff;
				line-height: 60rpx;
				border-bottom: 2rpx dashed #2979ff;
			}

			.item-address {
				color: #999;
				font-size: 28rpx;
				text-align: justify;
				line-height: 40rpx;
				margin-top: 10rpx;
			}

			.tanent-view {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.tanent-info {
					display: flex;
					align-items: center;

					.tanent-img {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						margin-right: 20rpx;
						background-color: #e3e3e3;
						overflow: hidden;
					}

					.tanent-name {
						font-size: 28rpx;
						color: #333;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					.tanent-phone {
						font-size: 24rpx;
						color: #999;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
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