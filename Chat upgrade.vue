<template>
  <div class="app" @click.stop='toggle'>
    <Header :data_name='my_name'></Header >
    <div class="chat_warp">
      <div class="chat">

        <div class="chat_left">
          <div class="myinfo">
            <ChangeInp :name='my_name' :stage='true' :Offline='myOnline' :isGuest='my_isGuest' :index='55'></ChangeInp>
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
              <FriendList :class="{showEwarp:item.id==toGroupId}" :name='item.name' :users='item.users' num='' v-for='item in FriendList' :key='item.id' @changeGroup='changeGroup(item.id)'></FriendList>
            </div>
            <div class="addGroup" @click='openbox' v-if='my_isGuest==false'>
              <img src="../assets/images/add@2x.png" alt=""> {{addGroup}}
            </div>
          </div>
        </div>

        <div class="chat_cont">

          <div class="cont_title" v-if='my_isGuest==false'>
            <div class="url" >
              {{url}}
            </div>
            <input id='copyURL' type="text" :value="url">
            <p @click.stop='copyUrl'>
              <img src="../assets/images/addpeople@2x.png" alt=""> {{copy}}
            </p>
          </div>
          <div class="cont_title cotit" v-else>
            <h3 style='font-size:22px;color:#B2D0FF;margin:15px 0 0 15px;letter-spacing:5.5px;'>多语即时聊天</h3>
            <p style='font-size:16px;color:#B2D0FF;'>Multi - Language IM</p>
          </div>

          <div class="main_name">
            {{now_groupName}}
          </div>

          <div class="cont_mian" @mousewheel="scrollMore">
            <p @click="getMoreMsg">&#xe615; {{scrollMoreXX}}</p>
            <div v-for='item in chatlist' :key='item.timeId'>
              <Chartleft v-if='item.userId!=my_id' :myname='item.userName' :now_time="item.showtime" :chart="item.content" :chart2="item.contT"></Chartleft>
              <Chartright v-if='item.userId==my_id' :myname='item.userName' :now_time="item.showtime" :chart="item.content"></Chartright>
            </div>
          </div>

          <div class="cont_Send">
            <textarea id='area' type='text' maxlength='800' v-model='desc' @input='descInput' @keydown="ifSend($event)"></textarea>
            <span> 800/{{remnant}}</span>
            <div class="btnSend" @click.stop="sendMsg">
              &nbsp;发送(
              <b>S</b>)
              <div class="triangle" @click.stop='tips=!tips'></div>
            </div>
            <div class="tips" v-if='tips'>
              <ul>
                <li @click.stop="changsend">
                  <Tick class="tick" v-if='tick' /> 按Enter键发送消息
                </li>
                <li @click.stop="changsend2">
                  <Tick class="tick" v-if='!tick' /> 按Ctrl+Enter键发送消息
                </li>
              </ul>
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
            <ChangeInp :item="item" :name='item.remark' v-for='item in groupList' :stage='false' :Offline='item.isOnline' :isGuest='my_isGuest' :key='item.id' :my_id='my_id' :index='item.id' @edit='edit'></ChangeInp>
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
import Tick from "./common/Tick";

export default {
  name: "Change",
  data() {
    return {
      //left
      my_id: "",
      my_name: "",
      my_isGuest: "",
      //发送时组的id
      toGroupId: "",
      myName_int: "",
      myOnline: "",
      change_lang: "请选择您的母语",
      addGroup: "创建群聊",
      ulSel: false,
      my_lang: "",
      my_langId: "",
      langs: [],
      lang_cn: [
        "zh-CN",
        "en",
        ["zh-TW", "zh-HK"],
        "ru",
        "ja",
        "ko",
        "fr",
        "de",
        "es",
        "pt",
        "ar",
        "it",
        "th",
        "vi",
        "lo",
        "fi",
        "ms",
        "tr",
        "id",
        "he",
        "pl",
        "nl",
        "no",
        "cs",
        "da",
        "bg",
        "fa"
      ],
      FriendList: [],

      //cont
      url: "",
      copy: "添加新成员 将该链接复制给需要聊天的小伙伴就可以啦！",
      pageindex: 0,
      last: "",
      oldscrollH: "",
      scrollMoreXX: "查看更多消息",
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
      tips: false,
      tick: false,
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
    BombBox,
    Tick
  },
  async created() {
    const res = await this.$axios.get("/api/App/GetLanguages");
    this.langs = res.data;
    // console.log(this.langs)Abbreviation
    this.langs.map((item, index) => {
      // console.log(index)
      item.Abbreviation = this.lang_cn[index];
    });
    // console.log(this.langs);
    const locallang = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
    const locallang2 = locallang.slice(0, 2);
    let langnum = 0;
    this.langs.map(item => {
      if (item.Abbreviation == locallang2 || item.Abbreviation == locallang) {
        this.my_langId = item.id;
        this.my_lang = item.name;
        langnum++;
      } else if (locallang2 == "zh") {
        langnum++;
        if (locallang == "zh-CN") {
          this.my_langId = "0";
          this.my_lang = "简体中文(简体中文)";
        } else if (locallang == "zh-TW" || locallang == "zh-HK") {
          this.my_langId = "20";
          this.my_lang = "繁体中文(繁體中文)";
        }
      }
    });
    if (langnum == 0) {
      this.my_langId = "10";
      this.my_lang = "英语(English)";
    }
  },
  mounted() {
    if (sessionStorage.getItem("chatlang")) {
      let chatlang = sessionStorage.getItem("chatlang").split(",");
      this.my_lang = chatlang[0];
      this.my_langId = chatlang[1];
    }
    this.connectServer();
  },
  watch: {
    receiveM() {
      let that = this;
      this.$axios
        .post("/api/Chat/Translate", {
          recordId: that.receiveM.id,
          userId: that.my_id,
          fromLang: that.receiveM.userLang,
          toLang: that.my_langId,
          fromContent: that.receiveM.content
        })
        .then(res => {
          // console.log(res.data.data);

          if (that.toGroupId == that.receiveM.toGroupId) {
            that.chatlist.push(
              that.showmsg(that.receiveM, res.data.data.toContent)
            );
            that.$nextTick(() => {
              $(".cont_mian").scrollTop($(".cont_mian")[0].scrollHeight);
            });
          }

          // console.log("watch");
          console.log(that.receiveM);
        });
    }
  },
  methods: {
    toggle() {
      this.ulSel = false;
      this.tips = false;
      // eventBus.$emit("inptoggle", false);
    },
    copyUrl() {
      console.log(this.url);
      if (!this.url) {
        alert("目前没有链接，请您创建群聊");
      } else {
        this.url;
        if (document.execCommand) {
          const e = document.querySelector("#copyURL");
          e.select();
          document.execCommand("copy");
          alert("复制成功，将链接发送给小伙伴把！");
          return true;
        }
        if (window.clipboardData) {
          window.clipboardData.setData("copyURL", this.url);
          alert("复制成功，将链接发送给小伙伴把！");
          return true;
        }
        return false;
      }
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
          // $(".cont_mian").empty();
          that.chatlist = [];
          this.pageindex = 0;
          that.getHisMsgs(this.pageindex);
          that.scrollMoreXX = "查看更多消息";
        }
      });
    },
    showmsg(receiveM, cont) {
      let m = {},
        myDate = new Date().getTime();
      m.id = receiveM.id;
      m.showtime = this.getLocalTime(myDate);
      m.toGroupId = receiveM.toGroupId;
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

        console.log(userInfo);
        // console.log(userInfo.socialGroups[0]);
        self.my_id = userInfo.user.id;
        self.my_name = userInfo.user.name;
        self.myOnline = userInfo.user.isOnline;
        self.my_isGuest = userInfo.user.isGuest;
        const chaobj = () => {
          let newChaobj = [];
          userInfo.socialGroups.map(item => {
            let newobj = item.group;
            delete item.group;
            let newUsers = {
              users: []
            };
            item.users.map(ite => {
              let newUser = ite.user;
              delete ite.user;
              newUsers.users.push(Object.assign(newUser, ite));
            });

            newChaobj.push(Object.assign(newUsers, newobj));
            // newChaobj.push(Object.assign(newobj, item));
          });
          return newChaobj;
        };
        // console.log(chaobj())
        self.FriendList = chaobj();
        // console.log(self.FriendList)
        if (self.FriendList[0]) {
          self.groupList = self.FriendList[0].users;
          self.now_groupName = self.FriendList[0].name;
          self.toGroupId = self.FriendList[0].id;
          // self.url =sessionStorage.getItem("chaturl") + self.FriendList[0].code;
          self.url =
            window.location.href + "Chat/Join?c=" + self.FriendList[0].code;
          self.getHisMsgs(0);
        }
        self.peo_num = self.groupList.length;
        // console.log(self.FriendList);
      });

      self.connection.on("ReceiveGroupMsg", function(m) {
        console.log("消息:");
        // console.log(m);
        self.receiveM = m;
        console.log(self.receiveM);
      });
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
                userInfo.user.remark = index.remark;

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

      // 更新用户昵称，接收
      this.connection.on("UsersNameUpdatedInGroup", user => {
        // console.log(user)

        // self.FriendList.map((item,i)=>{
        //   if(item.id==user[0].groupId){
        //     item.users.map((ite)=>{
        //       if(ite.id==user[0].userId){
        //         ite.remark=user[0].newName;
        //         // self.$set(self.FriendList.item[i].remark, user[0].newName);
        //       }
        //     })
        //   }
        // })

        self.groupList.map(item => {
          if (item.id == user[0].userId) {
            item.remark = user[0].newName;
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
      // console.log('创建群')
      // console.log(data)
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
      group.users[0].remark = data.remark;

      this.FriendList.push(group);
      // console.log(this.FriendList);

      this.groupList = group.users;
      this.peo_num = this.groupList.length;
      this.url = data.url;
      this.toGroupId = data.group.id;
      this.now_groupName = data.group.name;
      this.chatlist = [];

      sessionStorage.setItem("chaturl", this.url.split("=")[0] + "=");
      // this.connectServer();
      // location.reload();
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
      if (this.toGroupId && this.desc && this.sendstate === true) {
        let dd = this.getSendMsg(this.desc);
        this.connection
          .invoke("SendToGroup", dd)
          .then(res => {
            console.log("发送了");
            // self.receiveM = dd;
            self.desc = "";
            self.remnant = 800;
          })
          .catch(err => {
            console.log("发送异常：" + err);
          });
      } else {
        alert("非法发送!");
      }
    },
    ifSend(event) {
      event = event || window.event;
      console.log(event.keyCode);
      if (this.tick === false) {
        if (event.keyCode == 13 && event.ctrlKey) {
          this.sendMsg();
        } else if (event.keyCode == 13) {
          // document.getElementById("area").value += "\n";
        }
      } else if (this.tick === true) {
        if (event.keyCode == 13 && event.ctrlKey) {
          document.getElementById("area").value += "\n";
        } else if (event.keyCode == 13) {
          event.returnValue = false;
          this.sendMsg();
        }
      } 
      if (event.keyCode == 83 && event.altKey) {
        this.sendMsg();
      }
    },
    getLocalTime(timestamp) {
      let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate() + " ";
      let h = date.getHours() + ":";
      let m = date.getMinutes() + ":";
      let s = date.getSeconds();
      //  return Y+M+D+h+m+s;
      return h + m + s;
    },
    //拿历史记录
    getHisMsg(item) {
      let m = {};
      m.id = item.id;
      m.showtime = this.getLocalTime(item.serverReceiveTimestamp);
      m.toGroupId = item.toGroupId;
      m.userId = item.userId;
      m.userLang = item.userLang;
      m.userName = item.userName;
      m.content = item.content;
      item.toContent ? (m.contT = item.toContent) : (m.contT = item.content);
      return m;
    },
    async getHisMsgs(Inde) {
      let that = this;
      const res = await this.$axios.post("/api/Chat/GetGroupChatMessage", {
        userId: that.my_id,
        groupId: that.toGroupId,
        pageIndex: Inde,
        pageSize: 20
      });
      // console.log(res.data.result);
      if (res.data.result.length == 0) {
        this.scrollMoreXX = "暂无更多消息";
      } else {
        res.data.result.map(item => {
          let mm = this.getHisMsg(item);
          this.chatlist.unshift(mm);
        });
        this.oldscrollH = $(".cont_mian")[0].scrollHeight;
      }
      // console.log(this.chatlist);
    },
    getMoreMsg() {
      if (this.scrollMoreXX != "暂无更多消息") {
        this.pageindex++;
        this.getHisMsgs(this.pageindex);
        this.$nextTick(() => {
          $(".cont_mian").scrollTop(
            $(".cont_mian")[0].scrollHeight - this.oldscrollH
          );
        });
      }
    },
    scrollMore() {
      if (this.scrollMoreXX != "暂无更多消息") {
        let coor = $(".cont_mian").scrollTop();
        if (coor == 0) {
          let now = new Date().getSeconds();
          let tigger = now - this.last;
          if (tigger == "0") {
            this.pageindex++;
            this.getHisMsgs(this.pageindex);
            this.$nextTick(() => {
              $(".cont_mian").scrollTop(
                $(".cont_mian")[0].scrollHeight - this.oldscrollH
              );
            });
          }
          this.last = now;
        }
      }
    },
    edit(Id, name) {
      let that = this;
      this.connection
        .invoke("UpdateUserNameInGroup", {
          userId: Id,
          groupId: that.toGroupId,
          newName: name
        })
        .then(res => {
          // alert("修改成功");
        })
        .catch(err => {
          alert("修改失败" + err);
          // console.log("发送异常：" + err);
        });
    },
    changsend() {
      this.tick = true;
    },
    changsend2() {
      this.tick = false;
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
      width: 196px;
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
        width: 195px;
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
      .showEwarp {
        background: rgba(69, 83, 102, 1);
      }
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
    p {
      width: 140px;
      margin: 3px auto 0 auto;
      font-family: chartfont;
      color: rgba(78, 169, 233, 1);
      font-size: 13px;
      cursor: pointer;
    }
    .scrollR(@track2);
  }
  .cont_Send {
    position: relative;
    width: 100%;
    height: 104px;
    overflow: hidden;
    .tips {
      right: 10px;
      top: 5px;
      border-radius: 3px;
      position: absolute;
      border: 1px solid rgb(216, 216, 216);
      box-shadow: 5px 5px 5px rgb(216, 216, 216);
      ul li {
        width: 180px;
        height: 25px;
        font-size: 14px;
        cursor: pointer;
        line-height: 25px;
        position: relative;
        text-indent: 20px;
        .tick {
          position: absolute;
          left: -17px;
        }
      }
    }
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
      text-align: left;
      line-height: 30px;
      border-radius: 5px;
      bottom: 8px;
      right: 8px;
      color: white;
      font-size: 16px;
      cursor: pointer;
      &:hover {
        background: rgba(95, 146, 239, 0.9);
      }
      &:hover .triangle {
        background: rgba(199, 203, 209, 0.5);
      }
      b {
        text-decoration: underline;
        position: relative;
        font-size: 12px;
      }
      .triangle {
        display: inline-block;
        position: relative;
        width: 16px;
        height: 18px;
        border-radius: 5px;
        top: 3px;
        line-height: 16px;
        &:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 8px solid white;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          top: 5px;
          left: 4px;
        }
      }
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
