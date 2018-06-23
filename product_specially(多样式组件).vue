<template>
 <figure>
   <div :class="whclass">
     <img :src="'../../../static/images/'+imgsrc" alt="">
     <div class="warp">
       <div class="btn-group">
         <span @click="addcart">&#xe50f;</span> |
         <span>&#xe682;</span> |
         <span @click="aboutdetail">&#xe616;</span>
       </div>
     </div>
   </div>
   <figcaption>
     <h3>{{productTitle}}</h3>
     <h5>￥ {{productPrice | currency}}</h5>
   </figcaption>
 </figure>
</template>
<script>
  export default{
    data () {
      return {}},
    name:"product_specially",
    props:{
      imgsrc:{},
      productTitle:{},
      productPrice:{},
      whclass:{}
    },
    filters:{
      currency: function(value){
        return value+".00"
      }
    },
    methods:{
      addcart(){
        this.$emit('clicked')
      },
      aboutdetail(){
        this.$emit('clicktwo')
      }
    }
  }
</script>
<style scoped lang="less">
  @font-face {
    font-family: 'speciallyfont';
    src: url('../../../static/font/font_gjrbumtujbhb0529/iconfont.woff');
  }
  //宽高
  @mywidth1:270px;
  @myheight1:340px;

  @mywidth2:235px;
  @myheight2:272px;

  @mywidth3:276px;
  @myheight3:245px;

  @mywidth4:318px;
  @myheight4:220px;

  @mywidth5:420px;
  @myheight5:380px;
  //按钮特效
  @changeheight22:320px;
  @changeheight23:290px;

  @changeheight32:290px;
  @changeheight33:220px;

  @changeheight42:250px;
  @changeheight43:200px;

  @changeheight52:360px;
  @changeheight53:330px;
  .a{
    .img-group(@mywidth1,@myheight1,@changeheight32,@changeheight33)
  }
  .b{
    .img-group(@mywidth2,@myheight2,@changeheight32,@changeheight33)
  }
  .c{
    .img-group(@mywidth3,@myheight3,@changeheight42,@changeheight43)
  }
  .d{
    .img-group(@mywidth4,@myheight4,@changeheight32,@changeheight33)
  }
  .e{
    .img-group(@mywidth5,@myheight5,@changeheight52,@changeheight53)
  }
  .img-group(@mywidth,@myheight,@changeheight2,@changeheight3){
    width: @mywidth;
    height: @myheight;
    position: relative;

    >img{
      width: @mywidth;
      height:  @myheight;
      position: absolute;
      top: 0;
      left: 0;
    }
    .warp{
      width: @mywidth;
      height:  @myheight;
      background-color: rgba(153, 156, 166,0);
      opacity: 0;
      position: absolute;
      text-align: center;
      -webkit-transition:all .3s linear;
      overflow: hidden;
      .btn-group{
        margin: @changeheight2 auto;
        font-size: 20px;
        font-family: 'speciallyfont';
        color: white;
        width: 220px;
        height: 48px;
        -webkit-transition:all .3s linear;
        span{
          line-height: 30px;
          width: 30px;
          height: 30px;
          text-align: center;
          display: inline-block;
          -webkit-transition:all .3s linear;
          border-radius:30px;
          &:hover{
            background-color: rgba(77,77,77,0.7);
            cursor: pointer;
          }
        }
      }
      &:hover .btn-group{
        margin: @changeheight3 auto;
      }
    }
    &:hover .warp {
      background-color: rgba(126, 129, 139, 0.5);
      opacity: 1;
    }
  }
</style>
