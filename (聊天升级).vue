<template>
  <div class="app" @click='toggle'>
    <Header :data_name='my_name'></Header>
    <div class="chat_warp">
      <div class="chat">

        <div class="chat_left">
          <div class="myinfo">
            <ChangeInp :name='my_name' :stage='true' :Offline='myOnline'></ChangeInp>
          </div>
          <div class="lang_change">
            <h4>{{change_lang}}</h4>

            <div class="select_box">
              <font></font>
              <span @click.stop='langChange'>{{my_lang}}</span>
              <ul v-if="ulSel==true">
                <li v-for='item in langs' :key='item.id' @click.stop='langlist(item)'>{{item.name}}</li>
              </ul>
            </div>

          </div>

          <div class="friendList_warp">
            <div class="friendList">
              <FriendList :name='item.name' :users='item.users' num='99' v-for='item in FriendList' :key='item.id' @changeGroup='changeGroup(item.id)'></FriendList>
            </div>
            <div class="addGroup" @click='openbox'>
              <img src="../assets/images/add@2x.png" alt=""> {{addGroup}}
            </div>
          </div>
        </div>

        <div class="chat_cont">

          <div class="cont_title">
            <div class="url">
              {{url}}
            </div>
            <input id='copyURL' type="text" :value="url">
            <p @click.stop='copyUrl'>
              <img src="../assets/images/addpeople@2x.png" alt=""> {{copy}}
            </p>
          </div>

          <div class="main_name">
            {{now_groupName}}
          </div>

          <div class="cont_mian">

            <div v-for='item in chatlist' :key='item.timeId'>
              <Chartleft v-if='item.userId!=my_id' :myname='item.userName' :now_time="item.showtime" :chart="item.content" :chart2="item.contT"></Chartleft>
              <Chartright v-if='item.userId==my_id' :myname='item.userName' :now_time="item.showtime" :chart="item.content"></Chartright>
            </div>
          </div>

          <div class="cont_Send">
            <textarea type='text' maxlength='800' v-model='desc' @input='descInput' @keyup.ctrl.enter="sendMsg"></textarea>
            <span>800/{{remnant}}</span>
            <div class="btnSend" @click.stop="sendMsg">
              发送
            </div>
          </div>

        </div>

        <div class="chat_right">

          <div class="right_tit">

          </div>

          <div class="line">
            <p>{{pog}} {{peo_num}} {{poo}}</p>
          </div>

          <div class="rightList">
            <ChangeInp :name='item.name' :stage='false' :Offline='item.isOnline' v-for='item in groupList' :key='item.id'></ChangeInp>
          </div>
        </div>

      </div>
    </div>

    <BombBox @createF='createF'></BombBox>
  </div>
</template>

<script>
import Header from "./common/Header";
import Chartleft from "./Chartroom/Chartleft";
import Chartright from "./Chartroom/Chartright";
import ChangeInp from "./Chartroom/Change_inp";
import FriendList from "./Chartroom/FriendList";
import BombBox from "./common/Bomb_box";

export default {
  name: "Change",
  data() {
    return {
      //left
      my_id: "",
      my_name: "",
      //发送时组的id
      toGroupId: "",
      myName_int: "",
      myOnline: "",
      change_lang: "请选择您的母语",
      group_name: "a、b、c",
      group_num: "99+ ",
      addGroup: "创建群聊",
      ulSel: false,
      my_lang: "简体中文",
      my_langId: "0",
      langs: [],
      FriendList: [],

      //cont
      url: "",
      copy: "添加新成员 将该链接复制给需要聊天的小伙伴就可以啦！",
      now_groupName: "",
      desc: "",
      remnant: 800,
      //聊天信息
      my_img: require("../assets/images/Bitmap.png"),
      other_img: require("../assets/images/Bitmap.png"),
      chatlist: [
        // {
        //   timeId: new Date().valueOf(),
        //   showtime: new Date().toLocaleTimeString("chinese", { hour12: false }),
        //   user_id: "c84f385f-ad9e-4a5a-9fef-7cd0bd5caa68",
        //   user_cont: "这里左边聊天",
        //   user_contT: "this is left chart"
        // },
        // {
        //   id: "",
        //   showtime: new Date().toLocaleTimeString("chinese", { hour12: false }),
        //   toGroupId:"",
        //   userId: "",
        //   userLang:"",
        //   userName:"",
        //   content: "这里右边聊天",
        //   contT:"".
        // },
      ],
      receiveM: {},
      //signalR
      connection: null,
      sendstate: true,

      //right
      pog: "成员",
      peo_num: 0,
      poo: "人",
      groupList: []
    };
  },
  components: {
    Header,
    Chartleft,
    Chartright,
    ChangeInp,
    FriendList,
    BombBox
  },
  async created() {
    const res = await this.$axios.get("/api/App/GetLanguages");
    this.langs = res.data;
  },
  mounted() {
    if (sessionStorage.getItem("chatlang")) {
      let chatlang = sessionStorage.getItem("chatlang").split(",");
      this.my_lang = chatlang[0];
      this.my_langId = chatlang[1];
    }
    this.connectServer();
    // this.getMsg();
  },
  watch: {
    receiveM() {
      let that = this;
      this.$axios
        .post("/api/Translate/Translate", {
          fromLang: that.receiveM.userLang,
          toLang: that.my_langId,
          content: that.receiveM.content
        })
        .then(res => {
          that.chatlist.push(that.showmsg(that.receiveM, res.data));
          that.$nextTick(() => {
            $(".cont_mian").scrollTop($(".cont_mian")[0].scrollHeight);
          });
          // console.log("watch");
          // console.log(that.chatlist);
        });
    }
  },
  methods: {
    toggle() {
      this.ulSel = false;
    },
    copyUrl() {
      this.url;
      if (document.execCommand) {
        const e = document.querySelector("#copyURL");
        e.select();
        document.execCommand("copy");
        return true;
      }
      if (window.clipboardData) {
        window.clipboardData.setData("copyURL", this.url);
        return true;
      }
      return false;
    },
    descInput() {
      let txtVal = this.desc.length;
      this.remnant = 800 - txtVal;
    },
    langChange() {
      this.ulSel = !this.ulSel;
    },
    langlist(item) {
      this.my_lang = item.name;
      this.my_langId = item.id;
      this.ulSel = false;
      sessionStorage.setItem("chatlang", [this.my_lang, this.my_langId]);
    },
    changeGroup(id) {
      let that = this;
      this.FriendList.map(item => {
        if (item.id == id) {
          that.groupList = item.users;
          that.peo_num = that.groupList.length;
          that.url = sessionStorage.getItem("chaturl") + item.code;
          that.now_groupName = item.name;
          that.toGroupId = item.id;
          $(".cont_mian").empty();
        }
      });
    },
    showmsg(receiveM, cont) {
      let m = {};
      m.id = receiveM.id;
      (m.showtime = new Date().toLocaleTimeString()),
        (m.toGroupId = receiveM.toGroupId);
      m.userId = receiveM.userId;
      m.userLang = receiveM.userLang;
      m.userName = receiveM.userName;
      m.content = receiveM.content;
      m.contT = cont;

      return m;
    },
    //singlR
    connectServer() {
      let self = this;
      this.connection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Warning) //达到警告级别
        .withUrl("/test/testchat", signalR.HttpTransportType.WebSockets) //类型是WebSockets
        .build();
      //设置用户的社交信息
      this.connection.on("SetSocialUserInfo", function(userInfo) {
        console.log("设置用户的社交信息");
        // console.log(userInfo);
        self.my_id = userInfo.user.id;
        self.my_name = userInfo.user.name;
        self.myOnline = userInfo.user.isOnline;
        const chaobj = () => {
          let newChaobj = [];
          userInfo.socialGroups.map(item => {
            let newobj = item.group;
            delete item.group;
            newChaobj.push(Object.assign(newobj, item));
          });
          return newChaobj;
        };
        self.FriendList = chaobj();
        if (self.FriendList[0]) {
          self.groupList = self.FriendList[0].users;
          self.now_groupName = self.FriendList[0].name;
          self.toGroupId = self.FriendList[0].id;
          self.url =
            sessionStorage.getItem("chaturl") + self.FriendList[0].code;
        }
        self.peo_num = self.groupList.length;
        console.log(self.FriendList);
      });

      this.getMsg();

      // 用户上线
      this.connection.on("UserConnected", function(userInfo) {
        console.log("用户上线");
        console.log(userInfo);
        self.FriendList.map(item => {
          userInfo.groupRemarkInfos.map(index => {
            if (item.code == index.group.code) {
              const add = () => {
                let boo = [];
                item.users.map(ite => {
                  if (ite.id == userInfo.user.id) {
                    boo.push(1);
                  }
                });
                if (boo.length == 0) {
                  return -1;
                }
              };
              let boo = add();
              if (boo == -1) {
                item.users.push(userInfo.user);
                self.peo_num = item.users.length;
              }
            }
          });
        });
        self.FriendList.map(item => {
          item.users.map(ite => {
            if (ite.id == userInfo.user.id) {
              ite.isOnline = true;
            }
          });
        });
        console.log(self.FriendList);
      });
      // 用户下线
      this.connection.on("UserDisconnected", function(userId) {
        console.log("用户下线");
        console.log(userId);
        self.FriendList.map(item => {
          item.users.map(ite => {
            if (ite.id == userId) {
              ite.isOnline = false;
            }
          });
        });
      });

      // 用户离开处理函数
      this.connection.on("UserLeft", userId => {
        console.log("用户离开了");
        console.log(userId);

        self.FriendList.map(item => {
          for (let i = item.users.length - 1; i >= 0; i--) {
            if (item.users[i].id == userId) {
              item.users.splice(i, 1);
              self.peo_num--;
            }
          }
        });
      });

      this.connection
        .start()
        .then(res => {
          console.log("连接成功了");
          // this.sendMsg();
        })
        .catch(function(err) {
          console.log("建立连接异常：" + err);
        });
    },
    openbox() {
      eventBus.$emit("open", true);
    },
    async createF() {
      let that = this;
      const res = await this.$axios.get("/api/App/CreateChatGroupAsync");
      let data = res.data;
      let group = {
        users: [{}]
      };
      group.id = data.group.id;
      group.code = data.group.code;
      group.name = data.group.name;

      group.users[0].id = data.user.id;
      group.users[0].name = data.user.name;
      group.users[0].isGuest = data.user.isGuest;
      group.users[0].isOnline = data.user.isOnline;
      group.users[0].lang = data.user.lang;
      group.users[0].remark = data.user.remark;

      this.FriendList.push(group);
      // console.log(this.FriendList);

      this.groupList = group.users;
      this.peo_num = this.groupList.length;
      this.url = data.url;
      sessionStorage.setItem("chaturl", this.url.split("=")[0] + "=");
    },
    //content內容
    getSendMsg(content) {
      let m = {};
      m.id = new Date().getTime();
      m.userId = this.my_id;
      m.userName = this.my_name;
      m.userLang = this.my_langId;
      m.toGroupId = this.toGroupId;
      m.content = content;

      return m;
    },
    sendMsg() {
      let self = this;
      if (this.desc && this.sendstate === true) {
        let dd = this.getSendMsg(this.desc);
        this.connection
          .invoke("SendToGroup", dd)
          .then(res => {
            console.log("发送了");
            self.receiveM = dd;
            self.desc = "";
          })
          .catch(err => {
            console.log("发送异常：" + err);
          });
      }
    },
    getMsg() {
      // 接收组的信息
      let self = this;

      this.connection.on("ReceiveGroupMsg", function(m) {
        console.log("消息:");
        // console.log(m);
        self.receiveM = m;
        console.log(self.receiveM);
      });
    }
  }
};
</script>


<style type="text/css" scoped lang='less'>
@track1: rgba(51, 61, 75, 1);
@track2: white;
@track3: rgba(74, 91, 114, 1);

.scrollR(@track) {
  &::-ms-scrollbar {
    width: 8px;
    height: 20px;
  }
  &::-ms-scrollbar-button {
    display: none;
  }
  &::-ms-scrollbar-track {
    background: @track;
    height: 10px;
  }
  &::-ms-scrollbar-thumb {
    width: 8px;
    height: 20px;
    background: rgba(197, 208, 223, 1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 20px;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
  &::-webkit-scrollbar-track {
    background: @track;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    width: 8px;
    height: 20px;
    background: rgba(197, 208, 223, 1);
    border-radius: 3px;
  }
  &::-moz-scrollbar {
    width: 8px;
    height: 20px;
  }
  &::-moz-scrollbar-button {
    display: none;
  }

  &::-moz-scrollbar-track {
    background: @track;
    height: 10px;
  }
  &::-moz-scrollbar-thumb {
    width: 8px;
    height: 20px;
    background: rgba(197, 208, 223, 1);
    border-radius: 3px;
  }
}

.chat_warp {
  width: 100%;
  background: rgb(231, 237, 243) 100%;
  background-repeat: repeat-y;
  overflow: hidden;
  height: 100%;
  padding-bottom: 25px;
  .chat {
    width: 1400px;
    margin: 25px auto;
    box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.18);
  }
}

.chat_left {
  float: left;
  width: 233px;
  height: 748px;
  color: white;
  background: rgba(51, 61, 75, 1);
  .myinfo {
    overflow: hidden;
    height: 80px;
    width: 100%;
  }
  .lang_change {
    width: 233px;
    height: 84px;
    background: rgba(20, 25, 31, 1);
    h4 {
      font-size: 14px;
      line-height: 20px;
      padding: 10px 0 0 15px;
    }
    .sellang {
      margin: 5px 0 0 15px;
      width: 147px;
      height: 34px;
      font-size: 14px;
      color: white;
      border: none;
      background: linear-gradient(
        180deg,
        rgba(75, 89, 107, 1),
        rgba(51, 61, 75, 1)
      );
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      padding-left: 15px;
      position: relative;
    }
    .select_box {
      margin: 5px 0 0 15px;
      width: 147px;
      height: 34px;
      font-size: 14px;
      color: white;
      background: linear-gradient(
        180deg,
        rgba(75, 89, 107, 1),
        rgba(51, 61, 75, 1)
      );
      position: relative;
      font {
        pointer-events: none;
        position: absolute;
        right: 10px;
        top: 15px;
        width: 0;
        height: 0;
        border-top: 6px solid white;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
      }
      span {
        display: inline-block;
        width: 200px;
        height: 36px;
        line-height: 36px;
        cursor: pointer;
        color: white;
        text-indent: 10px;
      }
      ul {
        width: 145px;
        height: 249px;
        overflow-x: hidden;
        overflow-y: auto;
        position: absolute;
        z-index: 999;
        top: 34px;
        border: 1px solid rgba(75, 89, 107, 1);
        background: #fff;
        .scrollR(@track2);
        li {
          cursor: pointer;
          color: black;
          line-height: 34px;
          text-indent: 10px;
          &:hover {
            background: rgb(223, 227, 231);
          }
        }
      }
    }
  }

  .friendList_warp {
    width: inherit;
    height: 542px;
    .friendList {
      width: inherit;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      .scrollR(@track1);
    }
    .addGroup {
      cursor: pointer;
      width: inherit;
      height: 42px;
      line-height: 45px;
      font-size: 14px;
      color: rgba(165, 184, 211, 1);
      overflow: hidden;
      img {
        display: inline-block;
        vertical-align: middle;
        margin: -3px 3px 0 10px;
      }
    }
  }
}

.chat_cont {
  float: left;
  width: 950px;
  height: 748px;
  background-color: white;
  overflow: hidden;
  .cont_title {
    overflow: hidden;
    font-size: 14px;
    width: 100%;
    height: 81px;
    background: rgba(97, 151, 236, 1);
    color: rgba(255, 255, 255, 1);
    position: relative;
    .url {
      width: 380px;
      height: 27px;
      background: rgba(46, 115, 224, 1);
      border-radius: 2px;
      color: rgba(195, 216, 255, 1);
      text-align: center;
      line-height: 27px;
      margin: 15px 0 0 15px;
      position: absolute;
    }
    #copyURL {
      margin: 15px 0 0 15px;
      opacity: 0;
    }
    p {
      cursor: pointer;
      opacity: 0.9;
      overflow: hidden;
      font-size: 14px;
      line-height: 20px;
      margin: 8px 0 0 15px;
      letter-spacing: 0.2px;
      img {
        width: 20px;
        display: inline-block;
        float: left;
        margin: 2px 5px 0 0;
      }
    }
  }
  .main_name {
    width: 100%;
    height: 31px;
    background: rgba(232, 235, 241, 0.5);
    box-shadow: 0px 2px 4px 0px rgba(232, 235, 241, 0.18);
    line-height: 31px;
    padding-left: 15px;
    font-size: 16px;
    color: rgba(0, 0, 0, 1);
    font-weight: 700;
  }

  .cont_mian {
    height: 531px;
    width: 100%;
    border-bottom: 2px solid rgba(217, 217, 217, 0.5);
    position: relative;
    overflow-x: hidden;
    .scrollR(@track2);
  }
  .cont_Send {
    position: relative;
    width: 100%;
    height: 104px;
    overflow: hidden;
    textarea {
      width: 940px;
      resize: none;
      border: none;
      height: 60px;
      padding: 2px 5px;
      &:focus {
        outline: none;
      }
      .scrollR(@track2);
    }
    span {
      position: absolute;
      bottom: 10px;
      right: 98px;
      font-size: 12px;
      color: rgb(214, 214, 214);
    }
    .btnSend {
      position: absolute;
      width: 80px;
      height: 30px;
      background: rgba(95, 146, 239, 1);
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      bottom: 8px;
      right: 8px;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }
  }
}

.chat_right {
  float: left;
  width: 216px;
  height: 748px;
  background: rgba(74, 91, 114, 1);
  .right_tit {
    height: 80px;
    font-size: 14px;
    color: rgba(195, 216, 255, 1);
    line-height: 20px;
  }
  .line {
    height: 36px;
    border-top: 2px solid rgba(20, 25, 31, 1);
    border-bottom: 2px solid rgba(20, 25, 31, 1);
    font-size: 14px;
    color: rgba(185, 202, 227, 1);
    line-height: 36px;
    p {
      padding-left: 15px;
    }
  }
  .rightList {
    width: 100%;
    height: 628px;
    overflow-x: hidden;
    overflow-y: auto;
    .scrollR(@track3);
  }
}
</style>
