<template>
	<view class="page-view">
		<view class="form-view">
			<u--form :labelWidth='80' labelPosition="left" labelAlign="right" :model="formData" ref="formRef">
				<u-form-item label="问题描述:" prop="title">
					<u--textarea v-model="formData.title" count maxlength="200" placeholder="请输入遇到的问题" focus>
					</u--textarea>
				</u-form-item>
				<u-form-item label="问题图片:" borderBottom>
					<u-upload :previewFullImage="true" :fileList="formData.images" @afterRead="imagesAfterRead"
						@delete="imagesDeletePic" multiple :maxCount="9"></u-upload>
				</u-form-item>
				<u-form-item label="问题视频:" borderBottom>
					<u-upload accept="video" :previewFullImage="true" :fileList="videoShowList"
						@afterRead="videoAfterRead" @delete="videoDeletePic" :maxCount="1"></u-upload>
				</u-form-item>
			</u--form>
		</view>
		<u-button color="#FFA92F" :loading="btnloading" shape="circle" @click="save" text="提交"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					houseId: "",
					title: "",
					images: [],
					video: ""
				},
				btnloading: false,
				formRules: {
					title: [{
							required: true,
							message: '必须告诉我你遇到的问题',
							// blur和change事件触发检验
							trigger: ['blur', 'change'],
						},
						{
							min: 0,
							max: 200,
							message: '文字长度在200个字符以内'
						},
					],
				}
			}
		},
		onLoad(data) {
			this.formData.houseId = data.houseId
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.formRef.setRules(this.formRules)
		},
		computed: {
			videoShowList() {
				if (this.formData.video) {
					return [
						this.formData.video
					]
				} else {
					return []
				}
			}
		},
		methods: {
			imagesAfterRead(event) {
				let fileList = event.file
				fileList.forEach((item) => {
					let currentIndex = this.formData.images.length
					this.formData.images.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
					this.uploadImg(item.url, 'updateImage', currentIndex)
				})
			},
			imagesDeletePic(event) {
				this.formData.images.splice(event.index, 1)
			},
			videoAfterRead(event) {
				let file = event.file
				this.formData.video = {
					...file,
					status: 'uploading',
					message: '上传中'
				}
				this.uploadImg(file.url, 'updateVideo')
			},
			videoDeletePic(event) {
				this.formData.video = ''
			},
			uploadImg(filePath, type, index) {
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
						if (type === "updateImage") {
							if (data.status === 1 && statusCode === 200) {
								this.formData.images = this.formData.images.map((item, ind) => {
									if (ind === index) {
										item = data.data
										item.status = 'success'
									}
									return item
								})
							} else {
								this.formData.images = this.formData.images.map((item, ind) => {
									if (ind === index) {
										item.status = 'failed'
										item.message = '上传失败'
									}
									return item
								})
							}
						} else if (type === "updateVideo") {
							if (data.status === 1 && statusCode === 200) {
								this.formData.video = {
									...data.data,
									status: "success"
								}
							} else {
								this.formData.video.status = 'failed'
								this.formData.video.message = '上传失败'
							}
						}
					},
					fail: (err) => {
						this.formData.images = this.formData.images.map((item, ind) => {
							if (ind === index) {
								item.status = 'failed'
								item.message = '上传失败'
							}
							return item
						})
					},
					complete: (e) => {}
				});
			},
			save() {
				this.$refs.formRef.validate().then(res => {
					let data = JSON.parse(JSON.stringify(this.formData))
					data.images = data.images.filter(item => item.status === 'success')
					if (data.video.status === 'success') {
						data.video = data.video.url
					}
					this.btnloading = true
					this.$http.request({
						url: "/api/house/maintenance",
						method: "post",
						data: data
					}).then(async ({
						status
					}) => {
						if (status === 1) {
							this.$goBack("报修成功，等待处理！")
						}
					}).finally(() => {
						this.btnloading = false
					})
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})

			},
		}
	}
</script>

<style scoped lang="scss">
	.page-view {
		padding: 0 30rpx 50rpx;
		background-color: #fff;

		::v-deep .u-textarea {
			border: 2rpx solid #dadbde;
		}

		.form-view {
			margin: 20rpx 0;
		}
	}
</style>
