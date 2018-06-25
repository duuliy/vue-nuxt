<template>
	<!-- banner -->
	<mt-swipe :auto="4000" class='banners' :stopPropagation="true" :showIndicators="isShow">
		<mt-swipe-item v-for='(item,index) in banners' :key='index'>
			<img :src="'http://www.yuzhua.com'+(item.img||item)" class='banner' :onerror="defaultBanner" />
		</mt-swipe-item>
	</mt-swipe>
</template>

<script type="text/javascript">
	export default{
		props:{
		    banners: {},
            isShow: {
		        default: true
			}
		},
		mounted(){
			setTimeout(() => {
				$('.banners div div').eq(0).addClass('is-active ')
			}, 0);
		},
		data(){
			return{
				defaultBanner:'this.src="/img/sort/defaultBanner.png"' 
			}
		}
	}
</script>

<style type="text/css" scoped>
	.banners{
		width: 100%;
		height: 4.62rem;
        background-color: #fff;
	}
	.banner{
		width: 100%;
		height: 100%;  
		object-fit: cover;
	}
</style>