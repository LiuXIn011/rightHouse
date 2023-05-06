<template>
	<view class="page-view">
		<view class="form-view">
			<u--form :labelWidth='80' labelPosition="left" labelAlign="right" :model="formData" ref="formRef">
				<u-divider text="房屋评价"></u-divider>
				<u-form-item label="评分:">
					<u-rate :size="22" :readonly="id" active-color="#FFA92F" v-model="formData.houseScore"></u-rate>
				</u-form-item>
				<u-form-item label="评价:" prop="houseComment">
					<u--textarea :disabled="id" v-model="formData.houseComment" count maxlength="200" placeholder="请输入遇到的问题" focus>
					</u--textarea>
				</u-form-item>
				<u-form-item label="图片:" borderBottom>
					<u-upload :disabled="id" :previewFullImage="true" :fileList="formData.houseCommentImg" @afterRead="houseImagesAfterRead"
						@delete="houseImagesDeletePic" multiple :maxCount="9">
					</u-upload>
				</u-form-item>
				<u-divider text="房东评价"></u-divider>
				<u-form-item label="评分:">
					<u-rate :readonly="id" :size="22" active-color="#FFA92F" v-model="formData.landlordScore"></u-rate>
				</u-form-item>
				<u-form-item label="评价:" prop="landlordComment">
					<u--textarea :disabled="id" v-model="formData.landlordComment" count maxlength="200" placeholder="请输入遇到的问题" focus>
					</u--textarea>
				</u-form-item>
				<u-form-item label="图片:" borderBottom>
					<u-upload :disabled="id" :previewFullImage="true" :fileList="formData.landlordCommentImg"
						@afterRead="landlordImagesAfterRead" @delete="landlordImagesDeletePic" multiple :maxCount="9">
					</u-upload>
				</u-form-item>
			</u--form>
		</view>
		<u-button v-if="!id" color="#FFA92F" :loading="btnloading" shape="circle" @click="save" text="提交"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				houseId: "",
				landlordId: "",
				id: "",
				formData: {
					houseScore: 0,
					houseComment: "",
					houseCommentImg: [],
					landlordScore: 0,
					landlordComment: "",
					landlordCommentImg: [],
				},
				formRules: {
					houseComment: [{
							required: true,
							message: '请输入房屋评价',
							trigger: ['blur', 'change'],
						},
						{
							min: 0,
							max: 200,
							message: '文字长度在200个字符以内'
						},
					],
					landlordComment: [{
							required: true,
							message: '请输入房东评价',
							trigger: ['blur', 'change'],
						},
						{
							min: 0,
							max: 200,
							message: '文字长度在200个字符以内'
						},
					],
				},
				btnloading: false
			}
		},
		onLoad(data) {
			if (data.id) {
				this.id = data.id
				this.getCommentDetail()
			}
			this.houseId = data.houseId
			this.landlordId = data.landlordId
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.formRef.setRules(this.formRules)
		},
		methods: {
			houseImagesAfterRead(event) {
				let fileList = event.file
				fileList.forEach((item) => {
					let currentIndex = this.formData.houseCommentImg.length
					this.formData.houseCommentImg.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
					this.uploadImg(item.url, currentIndex, 1)
				})
			},
			landlordImagesAfterRead(event) {
				let fileList = event.file
				fileList.forEach((item) => {
					let currentIndex = this.formData.landlordCommentImg.length
					this.formData.landlordCommentImg.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
					this.uploadImg(item.url, currentIndex, 2)
				})
			},
			uploadImg(filePath, index, type) {
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
						if (type === 1) {
							// 房屋图片
							if (data.status === 1 && statusCode === 200) {
								this.formData.houseCommentImg = this.formData.houseCommentImg.map((item,
									ind) => {
									if (ind === index) {
										item = data.data
										item.status = 'success'
									}
									return item
								})
							} else {
								this.formData.houseCommentImg = this.formData.houseCommentImg.map((item,
									ind) => {
									if (ind === index) {
										item.status = 'failed'
										item.message = '上传失败'
									}
									return item
								})
							}
						} else {
							// 房东图片
							if (data.status === 1 && statusCode === 200) {
								this.formData.landlordCommentImg = this.formData.landlordCommentImg.map((item,
									ind) => {
									if (ind === index) {
										item = data.data
										item.status = 'success'
									}
									return item
								})
							} else {
								this.formData.landlordCommentImg = this.formData.landlordCommentImg.map((item,
									ind) => {
									if (ind === index) {
										item.status = 'failed'
										item.message = '上传失败'
									}
									return item
								})
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
			houseImagesDeletePic(event) {
				this.formData.houseCommentImg.splice(event.index, 1)
			},
			landlordImagesDeletePic(event) {
				this.formData.landlordCommentImg.splice(event.index, 1)
			},
			save() {
				this.$refs.formRef.validate().then(res => {
					let data = JSON.parse(JSON.stringify(this.formData))
					data.houseId = this.houseId
					data.landlordId = this.landlordId
					data.houseCommentImg = data.houseCommentImg.filter(item => item.status === 'success')
					data.landlordCommentImg = data.landlordCommentImg.filter(item => item.status === 'success')
					this.btnloading = true
					this.$http.request({
						url: "/api/comments/insert",
						method: "post",
						data: data
					}).then(async ({
						status
					}) => {
						if (status === 1) {
							this.$goBack("评价成功！")
						}
					}).finally(() => {
						this.btnloading = false
					})
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			getCommentDetail() {
				this.$http.request({
					url: "/api/comments/selectById",
					data: {
						id: this.id
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1 && data) {
						data.landlordCommentImg=JSON.parse(data.landlordCommentImg)
						data.houseCommentImg=JSON.parse(data.houseCommentImg)
						this.formData = data
					}
				})
			}
		}
	}
</script>


<style scoped lang="scss">
	.page-view {
		padding: 0 30rpx 50rpx;
		background-color: #fff;
		overflow: hidden;

		::v-deep .u-textarea {
			border: 2rpx solid #dadbde;
		}

		.form-view {
			overflow: hidden;
			margin: 20rpx 0;
		}
	}
</style>