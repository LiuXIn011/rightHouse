<template>
	<view class="page-view">
		<u--form :labelWidth='80' labelPosition="left" labelAlign="right" :model="formData" ref="formRef">
			<u-form-item label="名称：" prop="name" borderBottom>
				<u--input :disabled="pageType===3" border="none" v-model="formData.name" placeholder="请输入" :maxlength="20">
				</u--input>
			</u-form-item>
			<u-form-item label="对外租金：" prop="fakePrice" borderBottom>
				<u-input :disabled="pageType===3" v-model="formData.fakePrice" placeholder="请输入" type="digit" :maxlength="10">
					<u-tag slot="prefix" text="￥" size="mini" type="primary"></u-tag>
				</u-input>
			</u-form-item>
			<u-form-item label="实际租金：" prop="price" borderBottom>
				<u-input :disabled="pageType===3" v-model="formData.price" placeholder="请输入" type="digit" :maxlength="10">
					<u-tag slot="prefix" text="￥" size="mini" type="primary"></u-tag>
					<u--text slot="suffix" type="info" text="租客不可见"></u--text>
				</u-input>
			</u-form-item>

			<u-form-item label="图片：" prop="headImg" borderBottom>
				<u-upload :previewFullImage="true" :disabled="pageType===3" :fileList="formData.headImg"
					@afterRead="headImgAfterRead" @delete="headImgDeletePic" multiple :maxCount="9"></u-upload>
			</u-form-item>

			<u-form-item label="其他费用：" labelPosition="top" prop="waterFee" borderBottom>
				<view class="flex-item-view">
					<u-input :disabled="pageType===3" v-model="formData.waterFee" type="number" :maxlength="4">
						<u-tag slot="prefix" text="水" size="mini" type="primary"></u-tag>
						<u--text slot="suffix" type="info" text="元/吨"></u--text>
					</u-input>
					<u-input :disabled="pageType===3" v-model="formData.electricityFee" type="number" :maxlength="4">
						<u-tag slot="prefix" text="电" size="mini" type="success"></u-tag>
						<u--text slot="suffix" type="info" text="元/度"></u--text>
					</u-input>
				</view>
				<view class="flex-item-view">
					<u-input :disabled="pageType===3" v-model="formData.internetFee" type="number" :maxlength="4">
						<u-tag slot="prefix" text="网" size="mini" type="warning"></u-tag>
						<u--text slot="suffix" type="info" text="元/年"></u--text>
					</u-input>
					<u-input :disabled="pageType===3" v-model="formData.fuelFee" type="number" :maxlength="4">
						<u-tag slot="prefix" text="气" size="mini" type="error"></u-tag>
						<u--text slot="suffix" type="info" text="元/月"></u--text>
					</u-input>
				</view>
			</u-form-item>
			<u-form-item label="付款方式：" labelPosition="top" prop="depositNumber" borderBottom>
				<view class="flex-item-view">
					<u-input :disabled="pageType===3" inputAlign="right" v-model="formData.depositNumber" type="number"
						:maxlength="2">
						<u--text slot="prefix" type="info" text="押："></u--text>
						<u-tag slot="suffix" text="月" size="mini" type="primary"></u-tag>
					</u-input>
					<u-input :disabled="pageType===3" inputAlign="right" v-model="formData.priceNumber" type="number"
						:maxlength="2">
						<u--text slot="prefix" type="info" text="付："></u--text>
						<u-tag slot="suffix" text="月" size="mini" type="success"></u-tag>
					</u-input>
				</view>
			</u-form-item>
			<u-form-item label="实体信息：" labelPosition="top" borderBottom>
				<view class="flex-item-view">
					<u-input :disabled="pageType===3" inputAlign="right" v-model="formData.area" type="digit" :maxlength="10">
						<u--text slot="prefix" type="info" text="面积："></u--text>
						<u-tag slot="suffix" text="m²" size="mini" type="primary"></u-tag>
					</u-input>
					<u-input :disabled="pageType===3" inputAlign="right" v-model="formData.floor" type="digit" :maxlength="10">
						<u--text slot="prefix" type="info" text="楼层："></u--text>
						<u-tag slot="suffix" text="层" size="mini" type="success"></u-tag>
					</u-input>
				</view>
			</u-form-item>
			<u-form-item label="朝向：" prop="toward" borderBottom>
				<view v-if="pageType===3" class="df">
					<u-tag :show="formData.toward===1" text="东" type="success"></u-tag>
					<u-tag :show="formData.toward===2" text="西" type="success"></u-tag>
					<u-tag :show="formData.toward===3" text="南" type="primary"></u-tag>
					<u-tag :show="formData.toward===4" text="北" type="primary"></u-tag>
				</view>
				<u-radio-group v-if="pageType!==3" v-model="formData.toward" placement="row">
					<u-radio label="东" :name="1"></u-radio>
					<u-radio label="西" :name="2"></u-radio>
					<u-radio label="南" :name="3"></u-radio>
					<u-radio label="北" :name="4"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="卫生间：" prop="toilet" borderBottom>
				<view v-if="pageType===3" class="df">
					<u-tag :show="formData.toilet===0" text="没有" type="error"></u-tag>
					<u-tag :show="formData.toilet===1" text="独立" type="success"></u-tag>
					<u-tag :show="formData.toilet===2" text="公用" type="primary"></u-tag>
				</view>
				<u-radio-group v-if="pageType!==3" v-model="formData.toilet" placement="row">
					<u-radio label="没有" :name="0"></u-radio>
					<u-radio label="独立" :name="1"></u-radio>
					<u-radio label="公用" :name="2"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="厨房：" prop="kitchen" borderBottom>
				<view v-if="pageType===3" class="df">
					<u-tag :show="formData.toilet===0" text="没有" type="error"></u-tag>
					<u-tag :show="formData.kitchen===1" text="独立" type="success"></u-tag>
					<u-tag :show="formData.kitchen===2" text="公用" type="primary"></u-tag>
				</view>
				<u-radio-group v-if="pageType!==3" v-model="formData.kitchen" placement="row">
					<u-radio label="没有" :name="0"></u-radio>
					<u-radio label="独立" :name="1"></u-radio>
					<u-radio label="公用" :name="2"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="阳台：" prop="balcony" borderBottom>
				<view v-if="pageType===3" class="df">
					<u-tag :show="formData.balcony===1" text="有" type="success"></u-tag>
					<u-tag :show="formData.balcony===0" text="无" type="error"></u-tag>
				</view>
				<u-radio-group v-if="pageType!==3" v-model="formData.balcony" placement="row">
					<u-radio label="有" :name="1"></u-radio>
					<u-radio label="无" :name="0"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="地址：" prop="provinceName" borderBottom @click="showAddressPicker=true">
				<cityPicker :disabled="pageType===3" :defaultCity="defaultCity" @change="addresChange">
				</cityPicker>
			</u-form-item>
			<u-form-item label="详情地址：" prop="addresInfo" borderBottom>
				<u--input :disabled="pageType===3" placeholder="请输入" v-model="formData.addresInfo" :maxlength="20">
				</u--input>
			</u-form-item>
			<u-form-item label="备注：" prop="note" borderBottom>
				<u--textarea :disabled="pageType===3" v-model="formData.note" :maxlength="200" placeholder="请输入内容" count>
				</u--textarea>
			</u-form-item>
		</u--form>
		<view class="btn-view">
			<u-button v-if="pageType!==3" :type="formData.rentalMarket?'error':'success'"
				:text="formData.rentalMarket?'下架':'发布'" @click="release"></u-button>
			<u-button type="primary" :text="pageType===3?'返回':'确定'" @click="save"></u-button>
		</view>
	</view>
</template>

<script>
	import cityPicker from "@/components/cityPicker/cityPicker.vue"
	export default {
		data() {
			return {
				formData: {
					name: "",
					provinceId: "",
					provinceName: "",
					cityId: "",
					cityName: "",
					areaId: "",
					areaName: "",
					addresInfo: "",
					area: "",
					price: "",
					fakePrice: "",
					longitude: "",
					latitude: "",
					depositNumber: 1,
					floor: 1,
					priceNumber: 1,
					toward: 3,
					toilet: 1,
					kitchen: 1,
					balcony: 1,
					waterFee: '',
					electricityFee: '',
					internetFee: '',
					fuelFee: '',
					headImg: [],
					note: "",
					parentId: 0
				},
				pageType: 0,
				defaultCity: '',
			}
		},
		computed: {
			formRules() {
				return {
					name: [{
							required: true,
							message: '此项为必填',
							trigger: ['blur', 'change'],
						},
						{
							min: 0,
							max: 20,
							message: '文字长度在20个字符以内'
						},
					],
					fakePrice: [{
						required: true,
						type: 'float',
						message: '此项为必填',
						trigger: ['blur', 'change'],
					}],
					price: [{
						required: true,
						type: 'float',
						message: '此项为必填',
						trigger: ['blur', 'change'],
					}],
					// waterFee: [{
					// 		validator: (rule, value, callback) => {
					// 			return this.formData.waterFee !== '' && this.formData.waterFee !== null && this
					// 				.formData
					// 				.waterFee !== undefined
					// 		},
					// 		message: '请填写水费,免费请填0.'
					// 	},
					// 	{
					// 		validator: (rule, value, callback) => {
					// 			return this.formData.electricityFee !== '' && this.formData.electricityFee !==
					// 				null && this
					// 				.formData.electricityFee !==
					// 				undefined
					// 		},
					// 		message: '请填写电费,免费请填0.'
					// 	},
					// 	{
					// 		validator: (rule, value, callback) => {
					// 			return this.formData.internetFee !== '' && this.formData.internetFee !== null &&
					// 				this.formData
					// 				.internetFee !== undefined
					// 		},
					// 		message: '请填写网费,免费请填0.'
					// 	}
					// ],
					depositNumber: [{
							validator: (rule, value, callback) => {
								return this.formData.depositNumber !== '' && this.formData.depositNumber !==
									null && this
									.formData.depositNumber !== undefined
							},
							message: '请填写押金方式,无需押金请填0.'
						},
						{
							validator: (rule, value, callback) => {
								return this.formData.priceNumber !== '' && this.formData.priceNumber !== null &&
									this.formData
									.priceNumber !== undefined
							},
							message: '请填写一次付租月数.'
						}
					],
					provinceName: [{
						validator: (rule, value, callback) => {
							return this.formData.provinceName &&
								this.formData.cityName &&
								this.formData.areaName &&
								this.formData.longitude &&
								this.formData.latitude
						},
						message: '请选择地址'
					}],
					addresInfo: [{
						required: true,
						message: '请填写详细地址',
						trigger: ['blur', 'change'],
					}],
					headImg: [{
						validator: (rule, value, callback) => {
							return this.formData.headImg.every(item => item.status === 'success')
						},
						message: '请正确上传图片'
					}]
				}
			}
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.formRef.setRules(this.formRules)
		},
		onLoad(data) {
			// type  1新增  2编辑  3查看
			this.pageType = Number(data.type)
			if (this.pageType == 1) {
				this.formData.parentId = data.pid
				if (data.pid != 0) {
					// 设置默认地址
					this.getAddress(data.pid)
				}
				if (data.name) {
					this.formData.name = data.name + '-'
				}
			} else if (this.pageType == 2) {
				uni.setNavigationBarTitle({
					title: "编辑"
				})
				this.getDetail(data.id)
			} else if (this.pageType == 3) {
				uni.setNavigationBarTitle({
					title: "查看"
				})
				this.getDetail(data.id)
			}
		},
		components: {
			cityPicker
		},
		methods: {
			addresChange(data) {
				// if (
				// 	data &&
				// 	Array.isArray(data) &&
				// 	data.length === 3
				// ) {
				// 	this.formData.provinceId = data[0].id
				// 	this.formData.provinceName = data[0].name
				// 	this.formData.cityId = data[1].id
				// 	this.formData.cityName = data[1].name
				// 	this.formData.areaId = data[2].id
				// 	this.formData.areaName = data[2].name
				// }
				if (data) {
					this.formData.provinceName = data.provinceName
					this.formData.cityName = data.cityName
					this.formData.areaName = data.areaName
					this.formData.addresInfo = data.addresInfo
					this.formData.longitude = data.longitude
					this.formData.latitude = data.latitude
				}
			},
			save() {
				if (this.pageType === 3) {
					uni.navigateBack()
					return
				}
				this.$refs.formRef.validate().then(res => {
					this.formData.headImg = this.formData.headImg.filter(item => item.status === 'success')
					if (this.formData.id) {
						// 编辑
						this.editHouse()
					} else {
						// 新增
						this.insertHouse()
					}

				}).catch(errors => {
					console.log(errors);
					uni.showToast({
						icon: "error",
						title: '校验失败'
					})
				})
			},
			release() {
				if (this.formData.rentalMarket) {
					// 下架
					this.unreleaseHouse()
				} else {
					this.$refs.formRef.validate().then(res => {
						// 发布
						if (
							(this.formData.headImg &&
								Array.isArray(this.formData.headImg) &&
								this.formData.headImg.length === 0) ||
							!this.formData.headImg
						) {
							uni.showToast({
								icon: "none",
								title: "发布到房市必须上传图片"
							})
							return
						}
						if (this.formData.id) {
							if (this.formData.status === 2) {
								uni.showToast({
									icon: "none",
									title: "已经租赁的房屋无法发布"
								})
								return
							}

							// 先编辑再发布
							this.$http.request({
								url: "/api/house/update",
								method: "post",
								data: this.formData
							}).then(async ({
								status
							}) => {
								if (status === 1) {
									this.releaseHouse(this.formData.id)
								}
							})
						} else {
							// 先新增再发布
							this.$http.request({
								url: "/api/house/insert",
								method: "post",
								data: this.formData
							}).then(async ({
								status,
								data
							}) => {
								if (status === 1) {
									this.releaseHouse(data)
								}
							})
						}
					}).catch(errors => {
						uni.$u.toast('校验失败')
					})
				}


			},
			unreleaseHouse() {
				uni.showModal({
					title: "提示",
					content: "是否从租房市场下架？",
					success: ({
						confirm
					}) => {
						if (confirm) {
							this.$http.request({
								url: "/api/rentalMarket/updateStatus",
								method: "post",
								data: {
									id: this.formData.rentalMarket.id,
									status: 2
								}
							}).then(({
								status,
								data
							}) => {
								if (status === 1) {
									this.$goBack("已从房市下架！")
								}
							})
						}
					}
				})
			},
			releaseHouse(houseId) {
				uni.showModal({
					title: "提示",
					content: "是否发布到租房市场？",
					success: ({
						confirm
					}) => {
						if (confirm) {
							this.$http.request({
								url: "/api/rentalMarket/insert",
								method: "post",
								data: {
									houseId
								}
							}).then(({
								status,
								data
							}) => {
								if (status === 1) {
									this.$goBack("已成功发布到房市！")
								}
							})
						}
					}
				})
			},
			getAddress(id) {
				this.$http.request({
					url: "/api/house/selectById",
					method: "get",
					data: {
						id
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						// this.defaultCity = [{
						// 		id: data.provinceId
						// 	},
						// 	{
						// 		id: data.cityId
						// 	},
						// 	{
						// 		id: data.areaId
						// 	}
						// ]
						this.defaultCity = `${data.provinceName}${data.cityName==='直辖市'?'':data.cityName}${data.areaName}`
						this.formData.provinceId = data.provinceId
						this.formData.provinceName = data.provinceName
						this.formData.cityId = data.cityId
						this.formData.cityName = data.cityName
						this.formData.areaId = data.areaId
						this.formData.areaName = data.areaName
						this.formData.addresInfo = data.addresInfo
						this.formData.addresInfo = data.addresInfo
						this.formData.addresInfo = data.addresInfo
						this.formData.longitude = data.longitude
						this.formData.latitude = data.latitude
					}
				})
			},
			insertHouse() {
				this.$http.request({
					url: "/api/house/insert",
					method: "post",
					data: this.formData
				}).then(async ({
					status
				}) => {
					if (status === 1) {
						this.$goBack("添加成功！")
					}
				})
			},
			editHouse() {
				this.$http.request({
					url: "/api/house/update",
					method: "post",
					data: this.formData
				}).then(async ({
					status
				}) => {
					if (status === 1) {
						this.$goBack("修改成功！")
					}
				})
			},
			getDetail(id) {
				this.$http.request({
					url: "/api/house/selectById",
					method: "get",
					data: {
						id
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						for (let key in this.formData) {
							this.formData[key] = data[key]
						}
						if (data.headImg) {
							this.formData.headImg = JSON.parse(data.headImg).map(item => {
								item.status = 'success'
								return item
							})
						} else {
							this.formData.headImg = []
						}
						this.formData.id = data.id
						this.formData.status = data.status
						this.formData.rentalMarket = data.rentalMarket
						this.defaultCity = `${data.provinceName}${data.cityName==='直辖市'?'':data.cityName}${data.areaName}`
					}
				})
			},
			headImgAfterRead(event) {
				let fileList = event.file
				fileList.forEach((item) => {
					let currentIndex = this.formData.headImg.length
					this.formData.headImg.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
					this.uploadImg(item.url, currentIndex)
				})
			},
			headImgDeletePic(event) {
				this.formData.headImg.splice(event.index, 1)
			},
			uploadImg(filePath, index) {
				//上传
				let token = uni.getStorageSync('token')
				uni.uploadFile({
					url: `${this.$baseUrl}/api/file/upload`,
					header: {
						'Authorization': token,
						'content-type': 'application/x-www-form-urlencggoded;charset=UTF-8'
					},
					filePath,
					name: "file",
					success: ({
						statusCode,
						data
					}) => {
						data = JSON.parse(data)
						if (data.status === 1 && statusCode === 200) {
							this.formData.headImg = this.formData.headImg.map((item, ind) => {
								if (ind === index) {
									item = data.data
									item.status = 'success'
								}
								return item
							})
						} else {
							this.formData.headImg = this.formData.headImg.map((item, ind) => {
								if (ind === index) {
									item.status = 'failed'
									item.message = '上传失败'
								}
								return item
							})
						}
					},
					fail: (err) => {
						this.formData.headImg = this.formData.headImg.map((item, ind) => {
							if (ind === index) {
								item.status = 'failed'
								item.message = '上传失败'
							}
							return item
						})
					},
					complete: (e) => {}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.page-view {
		padding: 0 30rpx 50rpx;

		.flex-item-view {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		::v-deep .u-radio {
			margin-right: 30rpx;
		}
	}

	.btn-view {
		margin-top: 20rpx;
		display: flex;
		border-radius: 40rpx;
		overflow: hidden;

		::v-deep .u-button {
			border: none;
			border-radius: 0;
		}
	}
</style>