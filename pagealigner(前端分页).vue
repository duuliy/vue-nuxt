<template>
  <div id='app'>

    <div class="toolbar" >

    </div>

    <div class="aligner">
      <table class="align-main-table" cellspacing='0' cellpadding="0" border="1">
        <!-- <tboday> -->
        <tr v-for='item in list' :key='item.No'>
          <td class="line-num">
            <span>{{item.No}}</span >
          </td>
          <td :class="`content-cell src ${item.checked&&'checked'}`" @click="select()">
            <div class="src-warp">
              <div class="src-cont">
                {{item.srcCont}}
              </div>
            </div>
          </td>
          <td :class="`content-cell tgt ${item.checked&&'checked'}`" @click="select()">
            <div class="tgt-warp">
              <div class="tgt-cont">
                {{item.tgtCont}}
              </div>
            </div>
          </td>
        </tr>
        <!-- </tboday> -->
      </table>
    </div>

    <div class="aligner-info">
      <button v-for='item in 3' :key='item' @click="rowNumType(item)">
        {{50*item===150?200:50*item}}
      </button>

      <button @click="before()">上一页</button>
      {{pages}}/{{total}}
      <button @click="after()">下一页</button>

      <input type="text" v-model='jumpPage'>
      <button @click="jump(jumpPage)">跳转</button>
    </div>

  </div>
</template>
<script>
import "@a/scss/reset.scss";
import { sortBy, cloneDeep } from "lodash";

export default {
//还要改
  naem: "pagealigner",
  data() {
    return {
      //布局 分页
      listAll: [],
      list: [],
      rowType: 50,
      pages: 1,
      total: "",
      jumpPage: "",


    }
  },
  created() {
    for (let i = 0; i <= 201; i++) {
      let data = {
        No: i + 1,
        srcCont: "src内容0" + (i + 1),
        tgtCont: "tgt内容0" + (i + 1),
        isDisabled: false,
      }
      i > 49 && (data.srcCont = "");
      this.listAll.push(data)
    };
    this.list = this.rowNum(this.rowType);
    this.total = Math.ceil(this.listAll.length / 50);
  },
  mounted() {
  },
  watch: {
    rowType() {
      this.total = Math.ceil(this.listAll.length / this.rowType);
    },
    pages() {
      this.list = this.rowNum(this.rowType * this.pages, this.rowType * (this.pages - 1));
    }
  },
  methods: {
    //分页
    rowNum(num, initial = 0, listAll = this.listAll) {
      let allList = cloneDeep(listAll)
      return listAll && (allList.slice(initial, num));
    },
    columnSort(arr) {
      let Arr = sortBy(arr, item => {
        return item.No;
      })
      return Arr
    },
    rowNumType(item) {
      let listlength = this.list[this.list.length - 1].No;
      if (item === 1) {
        this.rowType = 50;
      } else if (item === 2) {
        this.rowType = 100;
      } else if (item === 3) {
        this.rowType = 200;
      }
      this.pages = Math.ceil(listlength / this.rowType);
      this.list = this.rowNum(this.rowType * this.pages, this.rowType * (this.pages - 1));
    },
    before() {
      (this.pages > 1) && this.pages--;
    },
    after() {
      (this.pages < this.total) && this.pages++;
    },
    jump(Page) {
      this.pages = Page;
    },
    //检测是否为禁用状态
    hasDisabled(el) {
      return el.classList.contains('isDisabled');
    },
    //选中
    select() {

    }
    //这个代码还有一点点冗余，以后继续加油吧
  }
};
</script>
<style type="text/css" scoped lang="scss">
.align-main-table {
  line-height: 30px;
  width: 90%;
  tr {
    .line-num {
      span {
        text-align: center;
        width: 52px;
        display: inline-block;
        color: red;
      }
    }
    .content-cell {
      width: 50%;
    }
    .checked {
      background-color: rgba(214, 234, 243, 1);
    }
  }
}

.active {
  background-color: #d6eaf3;
}
//是否禁用
.isDisabled {
  cursor: not-allowed;
  background-color: #f1f1f1;
}
</style>
