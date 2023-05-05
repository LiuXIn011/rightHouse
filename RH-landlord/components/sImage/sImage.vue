<template>
	<image class="image-view" :showMenuByLongpress="showMenuByLongpress" :src="errorImagePath || src" :mode="mode"
		@error="imageError" @click="imageClick"></image>
</template>

<script>
	export default {
		name: "sImage",
		props: {
			src: {
				type: String,
				default: "",
			},
			mode: {
				type: String,
				default: "aspectFill",
			},
			showMenuByLongpress: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			src() {
				this.errorImagePath = null
			}
		},
		data() {
			return {
				errorImagePath: null
			};
		},
		methods: {
			imageError(e) {
				console.log(e);
				uni.showToast({
					icon: 'none',
					title: "图片出错"
				})
				this.errorImagePath = '../../static/image/image_error.jpg'
			},
			imageClick() {
				this.$emit("click")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.image-view {
		width: inherit;
		height: inherit;
		border-radius: inherit;
		display: inherit;
		background-color: #fff;
	}
</style>
