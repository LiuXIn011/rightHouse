<template>
	<view class="page-view">
		<view @click="openPicker">
			<slot :addresText="addresText">
				<view class="show-click-view">
					<u--input border="none" v-model="addresText" disabled placeholder="请选择">
					</u--input>
					<u-icon v-if="!disabled" slot="right" name="arrow-right"></u-icon>
				</view>
			</slot>
		</view>
		<!-- <u-picker title="请选择" closeOnClickOverlay :loading="loading" keyName="name" :defaultIndex="defaultIndex"
			:show="showAddressPicker" ref="uPicker" :columns="addressList" @confirm="addressPickerConfirm"
			@change="changeHandler" @cancel="showAddressPicker = false" @close="showAddressPicker = false">
		</u-picker> -->
	</view>
</template>

<script>
	export default {
		options: {
			virtualHost: true
		},
		name: "cityPicker",
		props: {
			defaultCity: {
				default: '',
				type: String
			},
			disabled: {
				default: false,
				type: Boolean
			}
		},
		data() {
			return {
				addressList: [],
				defaultIndex: [],
				showAddressPicker: false,
				loading: false,
				addresText: ""
			}
		},
		created() {
			// this.getAddressCode()
		},
		watch: {
			defaultCity(data) {
				this.addresText = data
			}
		},
		methods: {
			openPicker() {
				if (!this.disabled) {
					// this.showAddressPicker = true
					// this.getAddressCode()
					this.getUserLocationAuth()
				}
			},
			getUserLocationAuth() {
				// 查询是否授权
				uni.getSetting({
					success: (res) => {
						if (res.authSetting['scope.userLocation']) {
							// 已授权
							this.chooseLocationFun()
						} else {
							// 未授权去获取授权
							uni.authorize({
								scope: 'scope.userLocation',
								success: () => {
									this.chooseLocationFun()
								},
								fail: () => {
									uni.showToast({
										icon: 'none',
										title: '无法获取位置，请打开位置设置'
									})
								}
							})
						}
					}
				})
			},

			chooseLocationFun() {
				uni.chooseLocation({
					success: (data) => {
						const {
							errMsg,
							address,
						} = data
						if (errMsg === "chooseLocation:ok") {
							let municipalityList = ['北京市', '上海市', '重庆市', '天津市']
							
							let reg =
								'(?<province>[^省]+自治区|.*?省|.*?行政区|.*?市)(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)(?<county>[^县]+县|.+区|.+市|.+旗|.+海域|.+岛)?(?<village>.*)'
							let regMunicipality =
								'(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)(?<county>[^县]+县|.+区|.+市|.+旗|.+海域|.+岛)?(?<village>.*)'
							// 微信开发者工具和真机返回的数据格式不一致，需要兼容
							let addressFormat = (address.match(reg) || address.match(regMunicipality))
							if (addressFormat) {
								if (addressFormat.length === 4) {
									data.provinceName = addressFormat[1]
									data.cityName = '直辖市'
									data.areaName = addressFormat[2]
									data.addresInfo = addressFormat[3]
								} else {
									let isMunicipality = municipalityList.some(item => address.includes(item))
									if (isMunicipality) {
										data.provinceName = addressFormat[1]
										data.cityName = '直辖市'
										data.areaName = addressFormat[3]
										data.addresInfo = addressFormat[4]
									} else {
										data.provinceName = addressFormat[1]
										data.cityName = addressFormat[2]
										data.areaName = addressFormat[3]
										data.addresInfo = addressFormat[4]
									}
								}
							} else {
								uni.showToast({
									icon: 'error',
									title: '解析失败！'
								})
							}
							this.$emit("change", data)
							this.addresText = `${data.provinceName}${data.cityName==='直辖市'?'':data.cityName}${data.areaName}`
						}
					},
					fail: (err) => {
						uni.showToast({
							icon: 'error',
							title: '获取失败'
						})
					}
				})
			},
			addressPickerConfirm({
				indexs,
				value
			}) {
				this.$emit("change", value)
				this.addresText = value.filter(item => item.name !== "直辖市").map(item => item.name).join("/")
				this.showAddressPicker = false
			},
			changeHandler(e) {
				const {
					columnIndex,
					value,
					values,
					index,
					picker = this.$refs.uPicker
				} = e
				if (columnIndex === 0) {
					picker.setColumnValues(1, value[0].child)
					picker.setColumnValues(2, value[0].child[0].child)
				} else if (columnIndex === 1) {
					picker.setColumnValues(2, value[0].child[index].child)
				}

			},
			getAddressCode() {
				// 没选过才查数据
				if (!this.addresText) {
					this.loading = true
					this.$http.request({
						url: "/api/house/getCityCode",
						methods: "get",
					}).then((res) => {
						this.loading = false
						if (res.status === 1) {
							if (
								this.defaultCity &&
								Array.isArray(this.defaultCity) &&
								this.defaultCity.length === 3
							) {
								this.addressList = []
								this.defaultIndex = []
								this.addresText = ''
								// 查找省数据
								for (let i = 0; i < res.data.length; i++) {
									let provinceItem = res.data[i]
									if (provinceItem.id == this.defaultCity[0].id) {
										this.addressList.push(res.data)
										this.defaultIndex.push(i)
										this.addresText += (provinceItem.name + '/')
										// 查找市数据
										for (let j = 0; j < provinceItem.child.length; j++) {
											let cityItem = provinceItem.child[j]
											if (cityItem.id == this.defaultCity[1].id) {
												this.addressList.push(provinceItem.child)
												this.defaultIndex.push(j)
												// 直辖市不显示
												if (cityItem.name !== '直辖市') {
													this.addresText += (cityItem.name + '/')
												}
												// 查找地区数据
												for (let k = 0; k < cityItem.child.length; k++) {
													let areaItem = cityItem.child[k]
													if (areaItem.id == this.defaultCity[2].id) {
														this.addressList.push(cityItem.child)
														this.defaultIndex.push(k)
														this.addresText += areaItem.name
														break
													}
												}
												break
											}
										}
										break
									}
								}
							} else {
								this.addressList = [
									res.data,
									res.data[0].child,
									res.data[0].child[0].child,
								]
							}


						} else {
							this.showAddressPicker = false
						}
						// this.defaultIndex = [3, 4, 4]
					}).catch(() => {
						this.loading = false
						this.showAddressPicker = false
					})
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.show-click-view {
		display: flex;
		align-items: center;
	}
</style>