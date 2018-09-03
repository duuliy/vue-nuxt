<template>
  <div class="showEdname" @click='changeGroup'>
    <div class="header_pic" ref='nameIn'>
      <div :class="nameIn_f1" v-if='nameIn.nameIni'>
        <span>{{nameIn.nameIni}}</span>
      </div>
      <div :class="nameIn_f2" v-if='nameIn.nameInt'>
        <span>{{nameIn.nameInt}}</span>
      </div>
      <div :class="nameIn_f3" v-if='nameIn.nameInr'>
        <span>{{nameIn.nameInr}}</span>
      </div>
      <div :class="nameIn_f4" v-if='nameIn.nameInf'>
        <span>{{nameIn.nameInf}}</span>
      </div>
    </div>
    <div class="show">
      <!-- <p>{{name.split('_')[1]}}</p> -->
      <p>{{name}}</p>
      <span>{{num}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "FriendList",
  data() {
    return {
      state: false,
      i: 0,
      namearr: "",
      nameIn: {
        nameIni: "",
        nameInt: "",
        nameInr: "",
        nameInf: ""
      },
      nameIn_f1: "nameIn f1",
      nameIn_f2: "nameIn f2",
      nameIn_f3: "nameIn f3",
      nameIn_f4: "nameIn f4",
      colors: () => {
        const allcolors = [
          "#669AF1",
          "#54CFE1",
          "#50D18D",
          "#E1A754",
          "#E16454",
          "#5464E1",
          "#7C54E1",
          "#B556EC",
          "#589ABF",
          "#2F66C0",
          "#DF5F8F",
          "#75A922",
          "#A87AA3",
          "#BA311F",
          "#0013A4",
          "#2CB5AD",
          "#7274A5",
          "#196896",
          "#E9D600",
          "#EA045A",
          "#AFC824",
          "#7E3C77",
          "#873126",
          "#3A9986",
          "#798ACA",
          "#454BB6"
        ];
        let num = Math.floor(Math.random() * 26);
        if (num >= 0 && num <= 25) {
          return allcolors[num];
        } else {
          this.colors();
        }
      }
    };
  },
  props: {
    name: "",
    users: "",
    num: ""
  },
  created() {
    this.addfont();
  },
  mounted() {
    let that = this;
    this.addco();

  },
  watch: {
    users() {
      this.i = 0;
      this.addco();
      this.addfont();
    }
  },
  updated() {
    // if (this.users.length === 1){
    //   // console.log(this.users.length)
    //   this.$refs.nameIn.children[0].className = "nameIn one";
    // }else if(this.users.length === 2) {
    //   this.$refs.nameIn.children[0].className = "nameIn thr1";
    //   this.$refs.nameIn.children[1].className = "nameIn two";
    // } else if (this.users.length === 3) {
    //   this.$refs.nameIn.children[0].className = "nameIn thr1";
    //   this.$refs.nameIn.children[1].className = "nameIn thr2";
    //   this.$refs.nameIn.children[2].className = "nameIn thr3";
    // }
  },
  methods: {
    changeGroup() {
      this.$emit("changeGroup");
    },
    addco() {
      if (this.users.length === 1) {
        this.nameIn_f1 = "nameIn one";
        this.nameIn_f2 = "nameIn";
        this.nameIn_f3 = "nameIn";
        this.nameIn_f4 = "nameIn";
      } else if (this.users.length === 2) {
        this.nameIn_f1 = "nameIn thr1";
        this.nameIn_f2 = "nameIn two";
        this.nameIn_f3 = "nameIn";
        this.nameIn_f4 = "nameIn";
      } else if (this.users.length === 3) {
        this.nameIn_f1 = "nameIn thr1";
        this.nameIn_f2 = "nameIn thr2";
        this.nameIn_f3 = "nameIn thr3";
        this.nameIn_f4 = "nameIn";
      } else if (this.users.length >= 4) {
        this.nameIn_f1 = "nameIn f1";
        this.nameIn_f2 = "nameIn f2";
        this.nameIn_f3 = "nameIn f3";
        this.nameIn_f4 = "nameIn f4";
      }
    },
    addfont() {
      this.nameIn = {
          nameIni: "",
          nameInt: "",
          nameInr: "",
          nameInf: ""
        };
      Object.keys(this.nameIn).map(item => {
        if (this.users[this.i]) {
          this.nameIn[item] = this.users[this.i].name.slice(0, 1).toUpperCase();
        }
        this.i++;
      });
    },
    getallColor() {
      let colorArr = new Array();
      let that = this;
      function getColor() {
        let now_color = that.colors();
        if (colorArr.length < 4) {
          for (let i = 0; i <= colorArr.length; i++) {
            if (now_color == colorArr[i]) {
              break;
            } else {
              if (i == colorArr.length) {
                colorArr.push(now_color);
                break;
              }
            }
          }
          getColor();
        }
      }
      getColor();
      return colorArr;
    }
  }
};
</script>


<style type="text/css" scoped lang='less'>
.universal {
  display: none;
}
.foo {
  background: rgba(87, 162, 255, 1);
  border: 0.5px solid white;
}
.one {
  width: 32px !important;
  font-size: 16px !important;
  line-height: 32px;
  height: 32px !important;
  border-radius: 50%;
  background: rgba(87, 162, 255, 1);
}
.thr1 {
  font-size: 14px !important;
  line-height: 30px;
  height: 32px !important;
  top: 0;
  left: 0;
  border-radius: 14.5px 0 0 14.5px;
  background: rgba(87, 162, 255, 1);
  border: 0.5px solid white;
}
.two {
  font-size: 14px !important;
  line-height: 30px;
  height: 32px !important;
  top: 0;
  right: 0;
  border-radius: 0 14.5px 14.5px 0;
  background: rgba(87, 162, 255, 1);
  border: 0.5px solid white;
}
.thr2 {
  top: 0;
  right: 0;
  border-radius: 0 14.5px 0 0;
  background: rgba(87, 162, 255, 1);
  border: 0.5px solid white;
}
.thr3 {
  bottom: 0;
  right: 0;
  border-radius: 0 0 14.5px 0;
  background: rgba(87, 162, 255, 1);
  border: 0.5px solid white;
}

.showEdname {
  cursor: pointer;
  width: 100%;
  height: 53px;
  border-bottom: 1px solid rgba(20, 25, 31, 1);
  .header_pic {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 1);
    color: rgba(255, 255, 255, 1);
    float: left;
    margin: 10px 0 0 15px;
    position: relative;

    .nameIn {
      width: 16px;
      height: 16px;
      position: absolute;
      text-align: center;
      font-size: 8px;
      &.f1 {
        top: 0;
        left: 0;
        border-radius: 14.5px 0 0 0;
        background: rgba(87, 162, 255, 1);
        border: 0.5px solid white;
      }
      &.f2 {
        top: 0;
        right: 0;
        border-radius: 0 14.5px 0 0;
        background: rgba(87, 162, 255, 1);
        border: 0.5px solid white;
      }
      &.f3 {
        bottom: 0;
        left: 0;
        border-radius: 0 0 0 14.5px;
        background: rgba(87, 162, 255, 1);
        border: 0.5px solid white;
      }
      &.f4 {
        bottom: 0;
        right: 0;
        border-radius: 0 0 14.5px 0;
        background: rgba(87, 162, 255, 1);
        border: 0.5px solid white;
      }
    }
  }
  .show {
    float: left;
    margin: 18px 0 0 10px;
    p {
      display: inline-block;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 98px;
      margin-right: 20px;
    }
    span {
      display: inline-block;
      background: rgba(231, 89, 89, 1);
      border-radius: 20px;
      line-height: 17px;
      font-size: 12px;
      padding: 0 6px;
      float: right;
      margin-top: 3px;
    }
  }
}

</style>
