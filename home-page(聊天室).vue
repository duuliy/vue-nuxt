<template>
  <div class="app">
      <Header data_name='duuliy'></Header>
      <div class="chart_warp">
        <div class="chart">

          <div class="chart_top">

            <div class="topleft">
              <p>{{other_lang}}</p>
              <div class="le_info">
                <img :src="other_img" alt="">
                <div class="le_info_ri" >
                  <p>{{other_name}}</p>
                <p>
                  {{other_state}} 
                   <img :src="other_stateImg" alt="" v-if='other_state=="在线"'>
                   <img :src="other_stateImg2" alt="" v-else>
                </p>
                </div>
              </div>
            </div>

            <div class="topmid">
              <div class="mid_url">
                {{mid_url}}
              </div>
              <p>将该链接复制给对方, 与国外友人畅聊无阻碍</p>
            </div>


            <div class="topright">
              <p>{{my_lang}}</p>
              <div class="ri_info">
                <img :src="my_img" alt="">
                <div class="ri_info_ri">
                  <p>{{my_name}}</p>
                <p>
                  {{my_state}} 
                   <img :src="my_stateImg" alt="" v-if='my_state=="在线"'>
                   <img :src="my_stateImg2" alt="" v-else>
                </p>
                </div>
              </div>
            </div>
        </div>

        <div class="chartcont">
          <div class="conputTime">
            {{conputTime()}}
           </div>
          <div v-for='item in chatlist' :key='item.timeId'>
          <Chartleft v-if='item.user_id!=myid' :imgsrc="other_img" :now_time="item.showtime"
          :chart="item.user_cont"  :chart2="item.user_contT" 
          ></Chartleft>
          <Chartright v-if='item.user_id==myid' :imgsrc='my_img' :now_time="item.showtime"
          :chart="item.user_cont"  :chart2="item.user_contT" 
          ></Chartright>
          </div>
        </div>

        <div class="line"></div>

        <div class="chartSend">
           <textarea style='resize:none; border:none; width:1200px; height:120px; box-shadow: 5px 3px 5px #d6d6d6;'
           maxlength='800' v-model='desc'  @input='descInput' @keyup.enter="sendMsg"
          ></textarea>
          <span>800/{{remnant}}</span>
          <div class="btnSend" @click="sendMsg">
            发送
          </div>
        </div>
        </div>
      </div>
      <Footer></Footer>
  </div>
</template>

<script>
import { setLgToken, getLgToken } from "../assets/js/auth";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Chartleft from "./Chartroom/Chartleft";
import Chartright from "./Chartroom/Chartright";

export default {
  name: "home-page",
  data() {
    return {
      other_lang: "",
      other_img: require("../assets/images/Bitmap.png"),
      other_name: "",
      other_state: "离线",
      other_stateImg: require("../assets/images/img_zx.png"),
      other_stateImg2: require("../assets/images/img_lx.png"),

      mid_url: "https://github.com/duuliy",

      my_lang: "",
      my_img: require("../assets/images/Bitmap.png"),
      my_name: "",
      my_state: "在线",
      my_stateImg: require("../assets/images/img_zx.png"),
      my_stateImg2: require("../assets/images/img_lx.png"),

      remnant: 800,
      desc: "",
      //获取后台信息
      myid: "",
      otherid: "",
      //聊天信息
      chatlist: [
        {
          timeId: new Date().valueOf(),
          showtime: new Date().toLocaleTimeString(),
          user_id: "c84f385f-ad9e-4a5a-9fef-7cd0bd5caa68",
          user_cont: "这里左边聊天",
          user_contT: "this is left chart"
        },
        {
          timeId: new Date().valueOf() + 1,
          showtime: new Date().toLocaleTimeString(),
          user_id: "b7793c83-bca3-45c7-9269-7707fa139f4e",
          user_cont: "这里右边聊天",
          user_contT: "this is right chart"
        }
      ],
      conputTime: () => new Date().toLocaleDateString(),
      //signalR
      connection: null
    };
  },
  components: {
    Header,
    Footer,
    Chartleft,
    Chartright
  },
  created() {
    let that = this;
    let uid = window.location.search.split("=")[1];

    this.$axios
      .all([
        that.$axios.get("/api/App/GetCurrentChatUser"),
        that.$axios.get("/api/app/GetChatUser?uid=" + uid)
      ])
      .then(
        that.$axios.spread((acct, perms) => {
          // console.log(acct.data);
          // console.log(perms.data);
          that.my_name = acct.data.name;
          that.other_name = perms.data.name;
          that.myid = acct.data.id;
          that.otherid = perms.data.id;
          // console.log(that.myid)
          if (acct.data.lang == 10) {
            that.my_lang = "Engish";
          } else if (acct.data.lang == 0) {
            that.my_lang = "中文";
          }
          if (perms.data.lang == 10) {
            that.other_lang = "Engish";
          } else if (perms.data.lang == 0) {
            that.other_lang = "中文";
          }
        })
      );
  },
  mounted() {
    this.connectServer();
    this.getMsg();
  },
  methods: {
    descInput() {
      let txtVal = this.desc.length;

      this.remnant = 800 - txtVal;
    },
    connectServer() {
      let self = this;
      this.connection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Warning) //达到警告级别
        .withUrl("/test/testchat", signalR.HttpTransportType.WebSockets) //类型是WebSockets
        .build();
      //对方信息更新
      this.connection.on("UsersUpdated", function(users) {
        // console.log("对方信息更新");
        // console.log(users);
        users.map(item => {
          if (item.id == self.otherid) {
            item.isOnline == true
              ? (self.other_state = "在线")
              : (self.other_state = "离线");
          }
        });
      });
      // 自己信息更新
      this.connection.on("UsersJoined", function(users) {
        // console.log("自己信息更新");
        // console.log(users);
        users.map(item => {
          if (item.id == self.otherid) {
            item.isOnline == true
              ? (self.other_state = "在线")
              : (self.other_state = "离线");
          }
        });
      });
      //双方信息更新
      this.connection.on("SetUsersFriends", function(users) {
        // console.log("双方信息更新");
        // console.log(users);
        users.map(item => {
          if (item.id == self.otherid) {
            item.isOnline == true
              ? (self.other_state = "在线")
              : (self.other_state = "离线");
          }
        });
      });
      this.connection.start().catch(function(err) {
        console.log("建立连接异常：" + err);
      });
    },
    //content內容
    getSendMsg(content) {
      let m = {};
      m.fromId = this.myid;
      if (this.my_lang == "中文") {
        m.fromLang = "0";
      } else if (this.my_lang == "Engish") {
        m.fromLang = "10";
      }
      m.toId = this.otherid;
      if (this.other_lang == "中文") {
        m.toLang = "0";
      } else if (this.other_lang == "Engish") {
        m.toLang = "10";
      }
      m.fromContent = content;

      return m;
    },
    addmyMsg(a, b, c) {
      let ss = {};
      ss.timeId = new Date().valueOf();
      (ss.showtime = new Date().toLocaleTimeString()), (ss.user_id = a);
      ss.user_cont = b;
      ss.user_contT = c;

      return ss;
    },
    sendMsg() {
      let self = this;
      if (this.desc) {
        let dd = this.getSendMsg(this.desc);
        // console.log(dd);

        let amM = this.addmyMsg(this.myid, this.desc, "");
        // console.log(amM);
        this.chatlist.push(amM);
        this.desc = "";
        this.connection.invoke("Send", dd).catch(function(err) {
          console.log("发送异常：" + err);
          //消息过期不管
        });
        $('.chartcont').scrollTop(530)
        console.log($('.chartcont')[0].scrollHeight);
        console.log($('.chartcont')[0].scrollHeight+60)
      }
    },
    getMsg() {
      // 接收原文的信息
      let self = this;
      this.connection.on("ReceiveMsg", function(m) {
        console.log("原文:");
        console.log(m);
        let amM = self.addmyMsg(this.otherid, m.toContent, "");
        self.chatlist.push(amM);
      });
      // 接收翻译后的的信息
      this.connection.on("ReceiveTranslate", function(m) {
        console.log("翻译后:");
        console.log(m);
      });
    }
  }
};
</script>


<style type="text/css" scoped lang='less'>
.chart_warp {
  width: 100%;
  background-color: rgb(231, 237, 243);
  overflow: hidden;
  padding-bottom: 35px;
  .chart {
    width: 1200px;
    margin: 25px auto;
    .chart_top {
      color: white;
      width: 100%;
      background-color: rgb(98, 165, 255);
      .topleft {
        float: left;
        width: 335px;
        height: 100px;
        background-color: rgb(135, 187, 255);
        p {
          margin: 10px 0 0 15px;
          font-size: 12px;
        }
        .le_info {
          margin: 15px 0 0 15px;
          img {
            width: 38px;
            float: left;
          }
          .le_info_ri {
            float: left;
            margin: -15px 0 0 0;
            p {
              font-size: 14px;
              img {
                width: 14px;
                float: none;
                vertical-align: top;
              }
              &:nth-of-type(1) {
                display: inline-block;
              }
              &:nth-of-type(2) {
                font-size: 12px;
              }
            }
          }
        }
      }
      .topmid {
        float: left;
        width: 530px;
        height: 100px;
        background-color: rgb(98, 165, 255);
        text-align: center;
        .mid_url {
          width: 400px;
          color: rgb(98, 165, 255);
          height: 30px;
          background-color: rgb(204, 226, 255);
          margin: 30px auto 0 auto;
          border-radius: 30px;
          line-height: 30px;
        }
        p {
          margin-top: 10px;
          font-size: 12px;
          letter-spacing: 1px;
        }
      }
      .topright {
        float: left;
        width: 335px;
        height: 100px;
        background-color: rgb(135, 187, 255);
        p {
          text-align: right;
          margin: 10px 15px 0 0;
          font-size: 12px;
        }
        .ri_info {
          margin: 15px 15px 0 0;
          img {
            width: 38px;
            float: right;
          }
          .ri_info_ri {
            float: right;
            margin: -15px 0 0 0;
            p {
              font-size: 14px;
              img {
                width: 14px;
                float: none;
                vertical-align: top;
              }
              &:nth-of-type(1) {
                display: inline-block;
              }
              &:nth-of-type(2) {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}

.chartcont {
  width: 1200px;
  height: 600px;
  background-color: white;
  box-shadow: 5px 3px 5px #d6d6d6;
  overflow-x: hidden;
  overflow-y: auto;
  .conputTime {
    text-align: center;
    color: rgb(214, 214, 214);
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 20px;
  }
  &::-webkit-scrollbar-button {
    background-color: white;
  }
  &::-webkit-scrollbar-track {
    background: white;
  }
  &::-webkit-scrollbar-thumb {
    width: 6px;
    height: 20px;
    background: rgba(197, 208, 223, 1);
    border-radius: 3px;
  }
}

.line {
  width: 100%;
  border: 1px solid rgba(224, 223, 223, 0.877);
  margin: 25px 0;
}
.chartSend {
  position: relative;
  span {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 12px;
    color: rgb(214, 214, 214);
  }
}
.btnSend {
  float: right;
  width: 80px;
  height: 40px;
  background-color: rgb(70, 144, 236);
  text-align: center;
  line-height: 40px;
  border-radius: 5px;
  margin-top: 15px;
  color: white;
  cursor: pointer;
}
</style>
