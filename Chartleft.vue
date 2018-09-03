<template>
  <div class="app">
    <!-- <img :src="imgsrc" alt=""> -->
    <div class="header_pic" ref='hpic'>
      {{nameIni}}
    </div>
    <div class="myname">{{myname | currency}} </div>
    <div class="left_ri">
      <div class="info_warp">
        <div class="info">
          <p>{{chart2}}</p> <br>
          <div class="linee"></div>
          <p>{{chart}}</p>
        </div>
      </div>
      <!-- <p>{{now_time}}</p> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Chartleft",
  data() {
    return {
      nameIni:""
    };
  },
  props: {
    chart: "",
    chart2: "",
    now_time: "",
    myname:""
  },
  mounted() {

      this.nameIni = this.myname.slice(0, 2).toUpperCase();

    // eventBus.$on("eventBusbacolrr", val => {
    //   this.$refs.hpic.style.backgroundColor = val;
    // });
  },
  filters: {
    currency(value) {
      if (value) {
        return value.slice(0, 12);
      }
    }
  }
};
</script>


<style type="text/css" scoped lang='less'>
.app {
  width: 100%;
  padding: 8px 0;
  overflow: hidden;
  position: relative;
  // border:1px solid red;
  .myname {
    font-size: 12px;
    color: rgba(156, 163, 177, 1);
    line-height: 22px;
    height: 22px;
    left:60px;
    font-weight: 700;
    position: absolute;
  }
  .header_pic {
    width: 31px;
    height: 31px;
    float: left;
    margin-top:5px;
    margin-left: 15px;
    border-radius: 50%;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
    text-align: center;
    background: rgba(87,162,255,1);
    line-height:31px;
  }
  .left_ri {
    float: left;
    margin:26px 0 0 15px;
  }
  .info_warp {
    width: auto;
    display: inline-block;
    position: relative;
    max-width: 600px;
    background: rgba(226, 226, 226, 1);
    border-radius: 9px;
    &:before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: 10px solid rgba(226, 226, 226, 1);
      border-left: 12px solid transparent;
      top: 8px;
      left: -7px;
    }
    .info {
      display: inline-block;
      margin: 0 auto;
      text-align: left;
      padding: 0 15px;
      .linee{
        border:.5px solid rgb(172, 172, 172);
      }
      p {
        font-family: "layicon";
        width: auto;
        font-size: 14px;
        color: rgba(44, 44, 44, 1);
        line-height: 18px;
        padding: 7px 0;
        display: inline-block;
        text-align: left;
        word-wrap:break-word;
        white-space:pre-wrap;        
        &:nth-of-type(1) {
          font-size: 14px;
          text-align: left;
        }
        &:nth-of-type(2) {
          color: rgba(44, 44, 44, 1);
          line-height: 18px;
        }
      }
    }
  }
  // p {
  //   font-size: 12px;
  //   color: #cfd6de;
  //   font-family: chartfont;
  //   margin-top: 5px;
  //   text-align: left;
  // }
}
</style>
