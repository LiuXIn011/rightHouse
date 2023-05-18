<template>
	<view class="page-veiw">
		<view v-for="(item,index) in list" :key="index" class="house-item"
			:style="{marginTop:itemMarginTop(index),transform:itemTransformScaleX(index) }">
			<view class="house-item-title">
				<text>{{item.title}}</text>
				<u-icon v-if="item.pid!==0" size="18" name="close" @click="closeItem"></u-icon>
			</view>
			<view class="house-info">
				<view class="house-info-item" v-for="(hItem,hIndex) in item.houseList" :key="hItem.id">
					<view class="house-info-item-title" @click="toChild(hItem)">
						{{hItem.name || ''}}
					</view>
					<view class="house-info-item-body">
						<s-image @click="previewImg(hItem)" v-if="hItem.firstHeadImg" class="house-info-item-img"
							:src="hItem.firstHeadImg" mode="aspectFill">
						</s-image>
						<view class="house-info-item-info" @click="toChild(hItem)">
							<view class="house-info-item-info-item">
								<text class="item-key">状态：</text>
								<u-tag text="已租" v-if="hItem.status===2" size="mini" type="success"></u-tag>
								<u-tag text="待租" v-if="hItem.status===1" size="mini" type="error"></u-tag>
								<u-tag text="已发布" v-if="hItem.releaseFlag===1" size="mini" type="success"></u-tag>
								<u-tag text="未发布" v-else size="mini" type="error"></u-tag>
							</view>
							<view class="house-info-item-info-item">
								<text class="item-key">租金：</text>
								<u--text type="error" :text="'￥'+hItem.price"></u--text>
							</view>
							<view class="house-info-item-info-item">
								<text class="item-key">创建时间：</text>
								<text class="item-value">{{hItem.createdAt}}</text>
							</view>
							<view class="house-info-item-info-item">
								<text class="item-key">地址：</text>
								<text class="item-value">{{hItem.provinceName + hItem.cityName +hItem.areaName+hItem.addresInfo}}</text>
							</view>
						</view>
					</view>
					<view class="house-btn">
						<u-button text="查看" size="mini" type="success" @click="editHouse(hItem,3)"></u-button>
						<u-button v-if="hItem.status===2" text="租客" size="mini" type="primary" @click="tenants(hItem)"></u-button>
						<u-button v-if="hItem.status===1" text="编辑" size="mini" type="warning"
							@click="editHouse(hItem,2)"></u-button>
						<u-button v-if="hItem.status===1" text="删除" size="mini" type="error" @click="deleteHouse(hItem)"></u-button>
					</view>
				</view>
				<u-empty v-if="item.houseList.length===0" mode="list" :text="isLogin?'暂无住房,点击右下角新增一个吧':'请登录后查看'">
				</u-empty>
			</view>
		</view>
		<view class="add-btn" v-if="isLogin" @click="addHouse">
			<u-icon size="50rpx" bold color="#fff" name="plus"></u-icon>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	import sImage from "@/components/sImage/sImage.vue"
	export default {
		data() {
			return {
				list: [{
					pid: 0,
					title: "全部",
					name: "",
					houseList: []
				}],
			}
		},
		components: {
			sImage
		},
		onLoad() {

		},
		onShow() {
			if (this.isLogin) {
				this.getHouseList()
			} else {
				this.list = [{
					pid: 0,
					title: "全部",
					name: "",
					houseList: []
				}]
			}
		},
		onPullDownRefresh() {
			if (this.isLogin) {
				this.getHouseList(this.list[this.list.length - 1].pid, true)
			} else {
				uni.stopPullDownRefresh();
			}
		},
		computed: {
			...mapState(['isLogin']),
		},
		methods: {
			itemMarginTop(index) {
				return ((this.list.length - index - 1) * 30) + 'rpx'
			},
			itemTransformScaleX(index) {
				return `scaleX(${1 - ((this.list.length - index - 1) * 0.05)})`
			},
			toChild(data) {
				this.list.push({
					pid: data.id,
					title: data.name + '的全部房间',
					name: data.name,
					houseList: []
				})
				this.getHouseList(data.id)
			},
			getHouseList(parentId = this.list[this.list.length - 1].pid, isPullDownRefresh) {
				return this.$http.request({
					url: "/api/house/select",
					method: "get",
					data: {
						parentId
					}
				}).then(({
					status,
					data
				}) => {
					this.list = this.list.map(item => {
						if (status === 1) {
							if (item.pid === parentId) {
								item.houseList = data
							}
						} else {
							item.houseList = []
						}
						return item
					})
				}).catch(() => {
					this.list = this.list.map(item => {
						if (item.pid === parentId) {
							item.houseList = []
						}
						return item
					})
				}).finally(() => {
					if (isPullDownRefresh) {
						uni.stopPullDownRefresh();
					}
				})
			},
			closeItem() {
				this.list = this.list.slice(0, this.list.length - 1)
			},
			addHouse() {
				uni.navigateTo({
					url: `/house_pages/house/add?pid=${this.list[this.list.length - 1].pid}&type=1&name=${this.list[this.list.length - 1].name || ''}`
				})
			},
			editHouse(data, type) {
				uni.navigateTo({
					url: `/house_pages/house/add?id=${data.id}&type=${type}`
				})
			},
			tenants(data, type) {
				uni.navigateTo({
					url: `/tenants_pages/tenants/list?id=${data.id}&name=${data.name}`
				})
			},
			previewImg({
				headImg
			}) {
				uni.previewImage({
					urls: headImg.map(item => item.url)
				})
			},
			deleteHouse({
				id
			}) {
				uni.showModal({
					title: "提示",
					content: "是否确认删除？",
					success: (res) => {
						if (res.confirm) {
							this.$http.request({
								url: "/api/house/delete",
								methods: "get",
								data: {
									id
								}
							}).then(async ({
								status
							}) => {
								await this.getHouseList()
								await uni.showToast({
									icon: 'none',
									title: "删除成功！"
								})
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-veiw {
		width: 100%;
		height: 100vh;
		overflow: hidden;

		.house-item {
			width: 680rpx;
			height: 80%;
			border-radius: 50rpx;
			padding: 40rpx;
			box-sizing: border-box;
			box-shadow: 0 0 30rpx 0 rgba(0, 0, 0, 0.2);
			position: fixed;
			left: 0;
			right: 0;
			margin: 0 auto;
			top: 200rpx;
			transition: all 1s;
			background-color: #fff;
			animation: mymove 1s;

			.house-item-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32rpx;
				height: 32rpx;
				color: #333;
				padding-bottom: 20rpx;
				border-bottom: 1px solid #ddd;
			}

			.house-info {
				height: calc(100% - 52rpx);
				overflow: hidden;
				overflow-y: auto;
			}

			.house-info-item {
				margin-top: 20rpx;
				background-color: #f7f8fa;
				border-radius: 20rpx;
				padding: 20rpx;
				box-sizing: border-box;

				.house-info-item-title {
					color: #333;
					font-size: 28rpx;
					line-height: 40rpx;
					text-align: justify;
					// height: 40rpx;
					// white-space: nowrap;
					// text-overflow: ellipsis;
					// overflow: hidden;
					border-bottom: 2rpx #ddd dashed;
				}

				.house-info-item-body {
					display: flex;
					margin-top: 20rpx;

					.house-info-item-img {
						width: 180rpx;
						height: 180rpx;
						flex-shrink: 0;
						border-radius: 10rpx;
						margin-right: 20rpx;
					}

					.house-info-item-info {
						width: 100%;

						.house-info-item-info-item {
							display: flex;
							font-size: 24rpx;
							margin-bottom: 10rpx;
							align-items: center;

							.item-key {
								color: #666;
								flex-shrink: 0;
							}

							.item-value {
								color: #999;
							}

							::v-deep .u-tag-wrapper {
								margin-right: 10rpx;
							}
						}
					}
				}

				.house-btn {
					display: flex;
					margin-top: 20rpx;
					align-items: center;
					justify-content: flex-end;

					::v-deep .u-button {
						width: 22%;
						margin: 0 0 0 10rpx;
					}
				}
			}
		}

		.add-btn {
			position: fixed;
			right: 20rpx;
			bottom: 100rpx;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background-image: linear-gradient(135deg, #2979ff, #1dceff);
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 0 30rpx 0 rgba(0, 0, 0, 0.2);
		}
	}

	@keyframes mymove {
		from {
			top: -200rpx;
			opacity: .9;
		}

		to {
			top: 200rpx;
			opacity: 1;
		}
	}
</style>