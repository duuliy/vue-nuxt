<template>
    <div id='app'>
        <HeaderNav iscolor='false' isfalg1='4'></HeaderNav> 

        <div class="banner">
          <div class="bannerImg"></div>
          <div class="bannercont_warp">
          <div class="bannercont">
            <div class="contleft ">
              <img src="./images/img_logo.png" alt="">
              <p>
                爱特曼科技是由微软亚洲研究院（MSRA）和微软搜索技术中心（Bing STC）的资深技术专家成立的创业公司，
                以消弭人类跨语言沟通障碍为己任，聚焦世界领先机器翻译和文字智能技术的研发和应用，追求语言认知计算的极致自动化。
                2016年和2017年先后获得知名创投机构5000万人民币投资。
              </p>
            </div>
            <div class="contright">
               <div class="right_tit">
                 <img src="./images/ermodel.png" alt="">
                 <div class="tit_font">
                  <h4>您有拓展空间, &nbsp;我有黑科技</h4>  
                  <p>那,何不坐下来聊聊 ...</p>
                 </div>
               </div>
                 <ul>
                   <li>电话: 18080852868</li>
                   <li>客服: 18080852868</li>
                   <li>邮箱：344324354@qq.com</li>
                 </ul>
            </div>
          </div>
          </div>
        </div>
        <div class="map_warp">
        <div class="map">
          <div class="map_tit">
            <p>
              地址: &nbsp;四川省成都市高新区楚峰国际
            </p>
            <div class="lookmap">查看地图</div>
          </div>
          <div class="mapcont">
            <div class="amap-page-container">
              <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
                <el-amap-marker vid="component-marker" :position="componentMarker.position"></el-amap-marker>
              </el-amap>
            </div>
          </div>
          <ul >
            <li>
              <h4>
                公交
              </h4>
              <p>
                乘坐44 / 766路，到光复西路丹巴路站 
                乘坐551路，到丹巴路云岭东路站 乘坐101路，到云岭东路丹巴路站 
                下车后步行约5分钟即可到达
              </p>
            </li>
            <li>
              <h4>
                地铁
              </h4>
              <p>
                乘坐2号线到威宁路站下车，4号出口 
                乘坐13号线到真北路站下车，3号出口
              </p>
            </li>
            <li>
              <h4>
                自己驾车
              </h4>
              <p>
                公司靠近中环路——金沙江路出 
                内环高架桥——位于丹巴路和云岭东路的交汇处
              </p>
            </li>
          </ul>
        </div>
        </div>
        <Footer class="footer"></Footer>   
       <Login></Login>
    </div>
</template>
<script>
import Footer from "@c/common/Footer";
import HeaderNav from "@c/common/HeaderNav";
import Login from "@c/common/Login";
import { amapManager } from 'vue-amap';

  const exampleComponents = {
      props: ['text'],
      template: `<div>text from  parent: {{text}}</div>`
    }

export default {
  naem: "about",
  data() {
    return {
       count: 1,
          slotStyle: {
            padding: '2px 8px',
            background: '#eee',
            color: '#333',
            border: '1px solid #aaa'
          },
          zoom: 18,
          center: [104.0636694431,30.5785375671],
          //信息窗口
          // renderMarker: {
          //   position: [104.0636694431,30.5785375671],
          //   contentRender: (h, instance) => {
          //     return h(
          //       'div',
          //       {
          //         style: {background: '#80cbc4', whiteSpace: 'nowrap', border: 'solid #ddd 1px', color: '#f00'},
          //         on: {
          //           click: () => {
          //             const position = this.renderMarker.position;
          //             this.renderMarker.position = [position[0] + 0.002, position[1] - 0.002];
          //           }
          //         }
          //       },
          //       ['marker inner text']
          //     )
          //   }
          // },
          componentMarker: {
            position: [104.0636594431,30.5785875671]
          }
        };
  },
  components: {
    HeaderNav,
    Footer,
    Login
  },
  methods: {}
};
</script>
<style type="text/css" scoped lang="scss">
* {
  font-family: 微软雅黑;
}
.bannerImg {
  background: url("./images/breather-168766-unsplash.png") no-repeat;
  width: 100%;
  height: 327px;
}
.bannercont_warp {
  width: 100%;
  height: inherit;
  .bannercont {
    position: relative;
    width: 1200px;
    height: 408px;
    margin: 0 auto;
    .contleft {
      overflow: hidden;
      width: 337px;
      height: 434px;
      border: 4px solid rgba(105, 170, 245, 1);
      text-align: center;
      position: absolute;
      bottom: 70px;
      background-color: white;
      img {
        margin-top: 50px;
      }
      p {
        text-align: left;
        width: 283px;
        font-size: 14px;
        color: rgba(71, 71, 71, 1);
        line-height: 27px;
        margin: 40px auto;
      }
    }
    .contright {
      margin-left: 370px;
      overflow: hidden;
      .right_tit {
        color: rgba(74, 74, 74, 1);
        margin-top: 88px;
        img {
          margin-top: -50px;
        }
        .tit_font {
          margin: 20px 0 0 0;
          display: inline-block;
          h4 {
            display: inline-block;
            font-size: 28px;
            line-height: 30px;
            font-weight: 700;
          }
          p {
            // display: inline-block;
            font-weight: 700;
            font-size: 22px;
            line-height: 30px;
          }
        }
      }
      ul {
        margin-top: 45px;
        li {
          margin-left: 50px;
          float: left;
          list-style: none;
          width: 233px;
          height: 96px;
          background: rgba(255, 255, 255, 1);
          border-radius: 8px;
          border: 2px solid rgba(241, 241, 241, 1);
          font-size: 14px;
          color: rgba(61, 61, 61, 1);
          line-height: 96px;
          cursor: pointer;
          text-align: center;

          &:hover {
            background: rgba(79, 83, 91, 1);
            color: rgba(255, 255, 255, 1);
          }
          &:nth-of-type(1) {
            margin-left: -26px;
          }
        }
      }
    }
  }
}
.map_warp {
  width: 100%;
  height: inherit;
  overflow: hidden;
  .map {
    width: 1200px;
    margin: 0 auto;
    font-size: 14px;
    color: rgba(61, 61, 61, 1);
    font-weight: 700;
    padding-bottom: 280px;
    .map_tit {
      border-bottom: 1px solid rgba(195, 195, 195, 1);
      p {
        line-height: 20px;
        padding: 5px 0;
        display: inline-block;
      }
      .lookmap {
        cursor: pointer;
        display: inline-block;
        width: 82px;
        height: 31px;
        border-radius: 3px;
        border: 1px solid rgba(121, 121, 121, 1);
        text-align: center;
        line-height: 31px;
        margin-left: 20px;
        &:hover {
          color: white;
          background-color: rgba(105, 170, 245, 1);
        }
      }
    }
    .mapcont {
      width: 1196px;
      height: 406px;
      margin-top: 40px;
    }
    ul {
      margin-top: 40px;
      li {
        float: left;
        list-style: none;
        margin-left: 235px;
        h4 {
          font-weight: 700;
        }
        p {
          width: 240px;
        }
        &:nth-of-type(1) {
          margin-left: -40px;
        }
      }
    }
  }
}
//高德地图
 .amap-demo {
      width: 1196px;
      height: 406px;
  }
</style>
