<template>
	<view class="page-view">
		<view @click="openPicker">
			<slot :addresText="addresText">
				<view class="show-click-view">
					<u--input v-model="addresText" disabled placeholder="请选择">
					</u--input>
					<u-icon v-if="!disabled" slot="right" name="arrow-right"></u-icon>
				</view>
			</slot>
		</view>
		<u-picker title="请选择" closeOnClickOverlay :loading="loading" keyName="name" :defaultIndex="defaultIndex"
			:show="showAddressPicker" ref="uPicker" :columns="addressList" @confirm="addressPickerConfirm"
			@change="changeHandler" @cancel="showAddressPicker = false" @close="showAddressPicker = false">
		</u-picker>
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
				default: () => [],
				type: Array
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
			this.getAddressCode()
		},
		watch: {
			defaultCity() {
				this.getAddressCode()
			}
		},
		methods: {
			openPicker() {
				if (!this.disabled) {
					this.showAddressPicker = true
					this.getAddressCode()
				}
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
