 <template>
  <div :class="stage==true?'showEdname':'showEdname pi2'">
    <div :class="Offline==true?'header_pic pcc' :'header_pic'" ref='hpic'>
      {{name.slice(0, 1).toUpperCase()}}
    </div>
    <div class="show" v-if='state==false'>
        {{name | currency}}
    </div>
    <div class="show edit" v-else>
      <input type="text" maxlength="18" v-model="name2" class='autofo' @blur='changeCount' @keyup.enter="editMsg">
    </div>
    <div class="img" @click.stop='edit' v-if='((stage===false)&&(isGuest===false))||(index===my_id)'></div>
  </div>
</template>

<script>
export default {
  name: "Change",
  data() {
    return {
      state: false,
      autofo: false,
      nameIni: "",
      name2: this.name,
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
          "#798ACA" ,
          "#454BB6"
        ];
        let num = Math.floor(Math.random() * 27) + 1;
        if (num >= 1 && num <= 26) {
          return allcolors[num];
        } else {
          return this.colors();
        }
      }
    };
  },
  props: {
    name: "",
    stage: "",
    Offline: "",
    isGuest: "",
    index: "",
    my_id: "",
    item: {}
  },
  created() {},
  mounted() {
    // console.log(this.name2)
    // let now_color=this.colors();
    // this.$refs.hpic.style.backgroundColor = now_color;
    // eventBus.$emit("eventBusbacolrr", now_color);
    // eventBus.$on("inptoggle", val => {
    //   this.state = val;
    // });
  },
  filters: {
    currency(value) {
      if (value) {
        return value.slice(0, 12);
      }
    }
  },
  methods: {
    changeCount() {
      this.$emit("edit", this.index, this.name2);
      setTimeout(()=>{
        this.state = false;
      },300)
    },
    editMsg() {
      if (this.state == true) {
        this.edit()
      }
    },
    edit() {
      this.state = !this.state;
      if (this.state == false) {
        // alert("修改成功!");
        this.$emit("edit", this.index, this.name2);
        // this.$nextTick(() => {
        //   $($(".autofo")[0]).blur();
        // });
      } else {
        this.$nextTick(() => {
          $($(".autofo")[0]).focus();
        });
      }
    }
  },
  watch:{
    name(){
      this.name2=this.name;
    }
  }
};
</script>


<style type="text/css" scoped lang='less'>
.showEdname {
  height: 35px;
  width: 200px;
  margin: 25px 0 0 15px;
  .header_pic {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: rgba(87, 162, 255, 1);
    border: 2px solid rgba(255, 255, 255, 1);
    font-size: 18px;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    line-height: 35px;
    float: left;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      bottom: -2px;
      right: -3px;
      background-color: #cfd6de;
    }
    &.pcc {
      &:after {
        background-color: rgba(117, 215, 76, 1);
      }
    }
  }
  .show {
    font-size: 18px;
    float: left;
    color: white;
    margin: 8px 0 0 10px;
    &.edit {
      margin: 8px 0 0 10px;
      input {
        width: 120px;
        border: none;
        background-color: #e7edf3;
      }
    }
  }
  .img {
    float: right;
    width: 17px;
    height: 17px;
    margin: 12px 0 0 0;
    cursor: pointer;
    background: url("../../assets/images/edit@2x.png");
  }
}

.pi2 {
  width: 185px;
  margin: 5px 0 0 15px;
  .header_pic {
    width: 22px;
    height: 22px;
    font-size: 12px;
    line-height: 22px;
    margin-top: 5px;
    &:after {
      content: "";
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      bottom: -2px;
      right: -3px;
      background-color: #cfd6de;
    }
    &.pcc {
      &:after {
        background-color: rgba(117, 215, 76, 1);
      }
    }
  }
  .show {
    font-size: 16px;
  }
  .img {
    width: 13px;
    height: 13px;
    margin: 12px 3px 0 0;
    background: url("../../assets/images/copy@2x.png");
  }
}
</style>
