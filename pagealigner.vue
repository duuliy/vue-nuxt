<template>
  <div id='app'>

    <div class="toolbar">

    </div>

    <div class="aligner">
      <table class="align-main-table" cellspacing='0' cellpadding="0">
        <tr v-for='(item,index) in list' :key='index' :item-id='index+1' @click="changeBgColor($event,index+1)">
          <td class="line-num">
            <!-- 差个算法用页数和cloumtype写行数 -->
            <span class="line-No">{{item.No}}</span>      
          </td>
          <td>
            <div :class="`content-cell src ${listL[index].isDisabled?'isDisabled':''}`" @dblclick="editor($event,index)" @blur="cancelEditor" @keydown="breakUp">
              {{listL[index].Cont}}
            </div>
          </td>
          <td>
            <div :class="`content-cell tgt ${listR[index].isDisabled?'isDisabled':''}`" @dblclick="editor($event,index)" @blur="cancelEditor" @keydown="breakUp">
              {{listR[index].Cont}}
            </div>
          </td>
        </tr>
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
import { sortBy, cloneDeep,debounce } from "lodash";

export default {
  naem: "pagealigner",
  data() {
    return {
      //布局 分页（意译）
      listAll: [],
      listLall: [],
      listRall: [],
      list: [],
      listL: [],
      listR: [],
      rowType: 50,
      pages: 1,
      total: "",
      jumpPage: "",
      //功能开始
      maxLength: 0,//最大的length
      nodeList: [],//记录节点
      selectPosition: 0,//光标的位置
      lodtype: '',//上次点击的单元格类型
      type: '',//单元格类型
      idList: [],//记录选中的id
      nodeList: [],//记录选中节点
      oldNode: null,//记录上一次的点击对象
      srcLength: 0,//左边的length
      tarLength: 0,//右边的length
    }
  },
  created() {
    for (let i = 0; i <= 68; i++) {
      let data = {
        No: i + 1,
        srcCont: "src内容0" + (i + 1),
        tgtCont: "tgt内容0" + (i + 1),
      }
      i > 48 && (data.tgtCont = "");
      this.listAll.push(data)
    };
    this.init()

  },
  mounted() {
  },
  watch: {
    rowType() {
      this.total = Math.ceil(this.listAll.length / this.rowType);
      this.columnSort()  //有点重复
    },
    pages() {
      debounce(this.columnSort())
    },
    listAll(){
      this.list = this.rowNum(this.rowType);  //只作分页
    },
    maxLength() {
      let listAllModel=[];
      this.listLall.map((item, index) => {
        let data = {
          No: 1 + index,
          srcCont: item.Cont,
          tgtCont: this.listRall[index].Cont
        }
        listAllModel.push(data)
      })
      this.listAll=cloneDeep(listAllModel)
    },
    listLall() {
      this.listL = this.rowNum(this.rowType, 0, this.listLall);
      let i = 0;
      this.listLall.map(item => { item.isDisabled && i++ })
      this.srcLength = this.listLall.length - i;
    },
    listRall() {
      this.listR = this.rowNum(this.rowType, 0, this.listRall);
      let j = 0;
      this.listRall.map(item => { item.isDisabled && j++ })
      this.tarLength = this.listRall.length - j;
    },
  },
  methods: {
    //初始化
    init() {
      this.total = Math.ceil(this.listAll.length / 50);
      this.maxLength = this.listAll.length;
      //处理拿到的数据

      this.listLall = this.listFilter(this.listAll, 'srcCont');  //显示以及数据处理
      this.listRall = this.listFilter(this.listAll, 'tgtCont');
      this.listL = this.rowNum(this.rowType, 0, this.listLall);  //有点重复,否则报错
      this.listR = this.rowNum(this.rowType, 0, this.listRall);  //有点重复,否则报错


      //键盘鼠标事件初始化
      document.body.addEventListener('keydown', this.keyDistribution);
      document.addEventListener('selectionchange', this.selectionchange);
    },
    //数据处理
    listFilter(list, cont) {
      let listdata = [];
      list.map(item => {
        let data = {};
        // data.No = item.No;
        data.Cont = item[cont];
        // data.checked = false;
        data.isDisabled = item[cont] ? false : true;
        listdata.push(data)
      })
      return listdata
    },
    //分页(以下意译)
    rowNum(num, initial = 0, listAll = this.listAll) {
      let allList = cloneDeep(listAll)
      return listAll && (allList.slice(initial, num));
    },
    columnSort() {
      this.list = this.rowNum(this.rowType * this.pages, this.rowType * (this.pages - 1));
      this.listL = this.rowNum(this.rowType * this.pages, this.rowType * (this.pages - 1), this.listLall);
      this.listR = this.rowNum(this.rowType * this.pages, this.rowType * (this.pages - 1), this.listRall);
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
    //键盘分发
    keyDistribution(e) {
      // if (this.docType) {
      //   //双文档对齐
      //   if (this.tarLength === 0 || this.srcLength === 0) return;
      // } else {
      //   if (this.srcLength === 0) return;
      // }
      const len = this.idList.length;
      switch (true) {
        case e.ctrlKey && e.keyCode === 77:
          console.log('ctrl + m : 合并');
          if (len < 2) {
            this.$message.error('请保证最少选中两行');
            return;
          }
          this.merge();
          break;
        case e.ctrlKey && e.keyCode === 40:
          console.log('ctrl + ↓ : 下移');
          this.lenMsg(len, 0, this.moveDown)
          break;
        case e.ctrlKey && e.keyCode === 38:
          console.log('ctrl + ↑ : 上移');
          this.lenMsg(len, 0, this.moveUp)
          break;
        case e.keyCode === 88:
          console.log('x : 调换');
          this.lenMsg(len, 0, this.rowSwitch)
          break;
        case e.ctrlKey && e.keyCode === 73:
          console.log('ctrl + i : 插入');
          this.lenMsg(len, 0, this.insert,'up')
          break;
        case e.keyCode === 46:
          console.log('delete : 删除');
          this.lenMsg(len, 0, this.del, this.idList)
          break;
        case e.shiftKey && e.keyCode === 40:
          console.log('shift + ↓ : 向下多选');
          this.lenMsg(len, 0, this.multiSelect, 'down')
          break;
        case e.shiftKey && e.keyCode === 38:
          console.log('shift + ↑ : 向上多选');
          this.lenMsg(len, 0, this.multiSelect, 'up')
          break;
        case e.ctrlKey && e.keyCode === 90:
          console.log('shift + z : 撤回');
          // if (this.record.length <= 0) {
          //   this.$message.error('没有可后退的记录');
          //   return;
          // }
          //后退操作
          break;
        case e.ctrlKey && e.keyCode === 89:
          console.log('shift + y : 前进');
          // const leng = this.record.length;
          // if (leng <= 0) {
          //   this.$message.error('没有可前进的记录');
          //   return;
          // } else if (this.recordSteps === leng) {
          //   this.$message.error('没有可前进的记录');
          //   return;
          // } else {
          //   //前进操作
          // }
          break;
        //没有default
      }
    },
    //错误提示及回调
    lenMsg(len, num, callback, type) {
      if (len <= num) {
        this.$message.error('请选中单元格在进行操作');
        return;
      }
      type = type ? type : "";
      callback && callback(type)
    },
    //全局功能处理开始
    //双击编辑
    editor(e, item) {
      const that = e.target;
      if (this.hasDisabled(that)) return;
      that.setAttribute('contenteditable', true);
      this.selectChangeEnd(that);
    },
    //取消编辑
    cancelEditor(e) {
      e.target.setAttribute('contenteditable', false);
    },
    //检测是否为禁用状态
    hasDisabled(el) {
      return el.classList.contains('isDisabled'); //会向上找它的父节点
    },
    //光标移动到末尾
    selectChangeEnd(el) {
      let range = window.getSelection();//创建range select对象
      range.selectAllChildren(el);//range 选择节点元素下所有子内容
      range.collapseToEnd();//光标移至最后
    },
    //监听光标移动
    selectionchange(e) {
      const that = this.nodeList[0];
      if (that) {
        this.selectPosition = this.getSelectPosition(that);
      }
    },
    //获取实时光标位置值
    getSelectPosition(element) {
      let range = window.getSelection().getRangeAt(0); //获取指定的选取范围,0最后光标对象(固定)。
      var preCaretRange = range.cloneRange(); //克隆一个选中区域
      preCaretRange.selectNodeContents(element); //设置选中区域的节点内容为当前节点
      preCaretRange.setEnd(range.endContainer, range.endOffset); //重置选中区域的结束位置,起始位置
      return preCaretRange.toString().trim().length;
    },
    //选中单选
    changeBgColorAlone(item, node) {
      this.idList = [item];
      this.nodeList = [node];
    },
    //选中改变背景色
    changeBgColor(e, item) {
      const that = e.target;
      //是否为禁用状态
      if (this.hasDisabled(that)) return;
      //全局记录点击的单元格类型
      const type = this.type = that.classList;
      //根据类型来判断是改变父元素还是当前元素
      const node = type[0] === 'line-No' ? that.parentNode.parentNode : that;
      if (e.shiftKey) {
        //按住了shift键为多选
        let len = this.idList.length;
        let len1 = this.nodeList.length;
        //记录id
        if (this.lodtype[1] === type[1] || type[0] === 'line-No') {
          this.idList = !len ? [item] : [this.idList[0], item];
        } else {
          this.changeBgColorAlone(item, node)
        }

        //根据id记录节点
        let nodeList = this.multiSelectNode(this.idList);
        this.nodeList = !len1 ? [node] : nodeList;
      } else {
        //没有按住为单选
        this.changeBgColorAlone(item, node)
      }
      this.lodtype = type;
      //添加class
      this.nodeAddClass();
    },
    //给选中的节点添加class
    nodeAddClass() {
      if (this.oldNode) {
        this.oldNode.forEach(v => v.classList.remove('active'));
      } else {
        this.oldNode = [this.nodeList[0]];
      }
      this.nodeList.forEach(v => v.classList.add('active'));
      this.oldNode = this.nodeList;
    },
    //排序
    new_sort(val1,val2){
      if(val1<val2){
        return 1
      }else if(val1>val2){
        return -1
      }else{
        return 0
      }
    },
    //获取多选时的节点
    multiSelectNode(idList) {
      let nodeList = [];
      let select = ``;
      // let Intermediate = '' //总数
      // let idListModel = [];
      // let aModel = [];
      //get class
      const type = this.type.length > 1 ? this.type[1] : this.type[0]; //左边多选换右边的时候
      if (idList.length === 1) {
        select = type === 'line-No' ? `tr[item-id="${idList[0]}"]` : `tr[item-id="${idList[0]}"] .${type}`;
        nodeList.push(document.querySelector(select));
        return nodeList;
      }

      // aModel = idList[1] < idList[0] ? idList[1] : idList[0];
      // Intermediate = Math.abs(idList[1] - idList[0]);
      // for (let i = 0; i <= Intermediate; i++) idListModel.push(aModel + i)
      // // hack select
      // idListModel.map(v => {
      //   select = type === 'line-No' ? `tr[item-id="${v}"]` : `tr[item-id="${v}"] .${type}`;
      //   nodeList.push(document.querySelector(select));
      // })

      idList.sort(this.new_sort).reverse();
      for (let i = idList[0]; i <= idList[1]; i++) {
        // hack select
        select = type === 'line-No' ? `tr[item-id="${i}"]` : `tr[item-id="${i}"] .${type}`;
        nodeList.push(document.querySelector(select));
      }
      return nodeList;
    },
    //键盘多选
    multiSelect(direction) {
      let id = 0;
      const { min, max } = Math;
      if (direction === 'down') {
        //向下多选
        id = this.idList[this.idList.length - 1] + 1;
        //边界限定
        // id = min(id, this.maxLength);
      } else if (direction === 'up') {
        //向上多选
        id = this.idList[this.idList.length - 1] - 1;
        //边界限定
        // id = max(1, id);
      }
      if (this.type.length > 1) {
        //边界限定
        let type = this.type[1];
        // id = min(id, this[`${type}Length`]);  //暂时不论为啥这样
        id = id
      }
      //记录id --- 获取节点 --- 添加class
      this.idList = [this.idList[0], id];
      this.nodeList = this.multiSelectNode(this.idList);
      this.nodeAddClass();
    },
    //主要功能辅助函数
    //清除高亮
    clearblue(){
      this.idList = [];
      this.nodeList = [];
      this.nodeAddClass();
    },
    //对比src和tar
    contrastData() {
      let minArrType;
      if (this.srcLength > this.tarLength) {
        minArrType = 'tar';
      } else if (this.srcLength < this.tarLength) {
        minArrType = 'src';
      } else {
        minArrType = '';
      }
      return minArrType;
    },
    //自动补齐idList
    aotuIdList(idList) {
      if (idList.length === 1) return idList;
      let result = [];
      idList.sort(this.new_sort).reverse();
      for (let i = idList[0]; i <= idList[1]; i++) {
        result.push(i);
      }
      return result;
    },
    //主要功能开始
    //插入回调  之后抽象
    // insertcallback(list1,list2){
    //   this.list1.arr.splice(list1.star, list1.end, { Cont: list1.str, isDisabled: list1.boo });
    //   this.list2.arr.splice(list2.star, list2.end, { Cont: list2.str, isDisabled: list2.boo });
    // },
    //插入
    insert(direction = 'up', str = '') {
      //插入到当前选中行上方
      const typeArr = [...this.type];
      const currentIndex = this.idList[0];//当前的位置
      const index = direction === 'up' ? currentIndex - 1 : currentIndex ;//需要插入的位置
      //获取最小的数据是哪个
      const minArrType = this.contrastData();
      //获取最小的length
      const minLength = Math.min(this.srcLength, this.tarLength);
      //三种情况  在整条行上面添加 在srcitem上面添加 在tar上面添加 用switch进行判断
      switch (true) {
        case typeArr.findIndex(v => v === 'line-No') > -1:
          console.log('整行添加');
          //更新长度
          this.maxLength++
          this.listLall.splice(index, 0, { Cont: str, isDisabled: false });
          this.listRall.splice(index, 0, { Cont: str, isDisabled: false });
          break;
        case typeArr.findIndex(v => v === 'src') > -1:
          console.log('在src添加');
          if (minArrType === 'src') {
            //如果是数据量小的一方，另一方就不需要增加禁用，直接不动
            this.listLall.splice(index, 0, { Cont: str, isDisabled: false });
            // this.maxLength++   //这里省略了这个过程
            this.listLall.splice(this.maxLength, 1);
          } else {
            this.listLall.splice(index, 0, { Cont: str, isDisabled: false });
            this.listRall.splice(this.maxLength - 1, 0, { Cont: '', isDisabled: true });
            this.maxLength++
          }
          break;
        case typeArr.findIndex(v => v === 'tgt') > -1:
          console.log('在tgt添加');
          if (minArrType === 'tar') {
            this.listRall.splice(index, 0, { Cont: str, isDisabled: false })
            this.listRall.splice(this.maxLength, 1);
          } else {
            this.listRall.splice(index, 0, { Cont: str, isDisabled: false });
            this.listLall.splice(this.maxLength - 1, 0, { Cont: '', isDisabled: true });
            this.maxLength++
          }
          break;
      }
    },
    //删除回调 在末尾填充数据  
    pushData(direction, Intermediate) {
      for (let i = 0; i < Intermediate; i++) {
        if (direction === 'src') {
          this.listLall.push({ Cont: ``, isDisabled: true });
        } else if (direction === 'tgt') {
          this.listRall.push({ Cont: ``, isDisabled: true });
        }
      }
    },
    // //删除 函数回调
    // delcallback(){

    // },
    //删除
    del(idList) {
      const typeArr = [...this.type];
      //获取最小的数据是哪个
      const minArrType = this.contrastData();   //多个可写成一起，有点多余
      const index = idList.length === 1 ? idList[0] - 1 : Math.min(...idList) - 1;
      const Intermediate = idList.length === 1 ? 1 : Math.abs(idList[1] - idList[0]) + 1;
      switch (true) {
        case typeArr.findIndex(v => v === 'line-No') > -1:
          console.log('删除整行');
          this.listLall.splice(index, Intermediate);
          this.listRall.splice(index, Intermediate);
          this.maxLength = this.maxLength - Intermediate;   //循环的list问题
          break;
        case typeArr.findIndex(v => v === 'src') > -1:
          console.log('删除src');
          this.listLall.splice(index, Intermediate);
          if (minArrType === 'tgt') {
            this.listRall.splice(this.maxLength - 1, Intermediate);
            this.maxLength = this.maxLength - Intermediate;
          } else {
            this.pushData('src', Intermediate);
          }
          break;
        case typeArr.findIndex(v => v === 'tgt') > -1:
          console.log('删除tar');
          this.listRall.splice(index, Intermediate);
          if (minArrType === 'src') {
            this.listLall.splice(this.maxLength - Intermediate - 1, Intermediate);
            this.maxLength = this.maxLength - Intermediate;
          } else {
            this.pushData('tgt', Intermediate);
          }
          break;
      }
      this.clearblue()
    },
    // //上移下移回调
    // movecalkback(){

    // },
     //上移
    moveUp() {
      let minId = Math.min(...this.idList) - 2;
      if (minId < 0) {
        this.$message.error('当前已经是第一行');
        return;
      }
      let newIdList = this.aotuIdList(this.idList);
      const type = [...this.type];
      let delItem;
      let delItem1;
      switch (true) {
        case type.findIndex(v => v === 'line-No') > -1:
          console.log('整行上移');
          delItem = this.listLall.splice(minId, 1);
          delItem1 = this.listRall.splice(minId, 1);
          this.listLall.splice(minId + newIdList.length, 0, ...delItem);
          this.listRall.splice(minId + newIdList.length, 0, ...delItem1);
          this.idList = this.idList.map(v => v - 1);
          break;
        case type.findIndex(v => v === 'src') > -1:
          console.log('src上移');
          delItem = this.listLall.splice(minId, 1);
          this.listLall.splice(minId + newIdList.length, 0, ...delItem);
          this.idList = this.idList.map(v => v - 1);
          break;
        case type.findIndex(v => v === 'tgt') > -1:
          console.log('tar上移');
          delItem = this.listRall.splice(minId, 1);
          this.listRall.splice(minId + newIdList.length, 0, ...delItem);
          this.idList = this.idList.map(v => v - 1);
          break;
        //没有default
      }
      this.nodeList = this.multiSelectNode(this.idList);
      this.nodeAddClass();
    },
    //下移
    moveDown() {
      let maxId = Math.max(...this.idList);
      let minId = Math.min(...this.idList) - 1;
      let minLength = Math.min(this.srcLength, this.tarLength);   //左右一样长
      let newIdList = this.aotuIdList(this.idList);
      const type = [...this.type];
      let delItem;
      let delItem1;
      switch (true) {
        case type.findIndex(v => v === 'line-No') > -1:
          console.log('整行下移');
          if (maxId >= minLength) {
            this.$message.error('不能再往下移啦~');
            return;
          }
          delItem = this.listLall.splice(maxId, 1);
          delItem1 = this.listRall.splice(maxId, 1);
          this.listLall.splice(minId, 0, ...delItem);
          this.listRall.splice(minId, 0, ...delItem1);
          this.idList = this.idList.map(v => v + 1);
          break;
        case type.findIndex(v => v === 'src') > -1:
          console.log('src下移');
          if (maxId >= this.srcLength) {
            this.$message.error('不能再往下移啦~');
            return;
          }
          delItem = this.listLall.splice(maxId, 1);
          this.listLall.splice(minId, 0, ...delItem);
          this.idList = this.idList.map(v => v + 1);
          break;
        case type.findIndex(v => v === 'tgt') > -1:
          console.log('tar下移');
          if (maxId >= this.tarLength) {
            this.$message.error('不能再往下移啦~');
            return;
          }
          delItem = this.listRall.splice(maxId, 1);
          this.listRall.splice(minId, 0, ...delItem);
          this.idList = this.idList.map(v => v + 1);
          break;
        //没有default
      }
      this.nodeList = this.multiSelectNode(this.idList);
      this.nodeAddClass();
    },
    //调换
    rowSwitch() {
      let srcContent;
      let tarContent;
      const newIdList = this.aotuIdList(this.idList);
      newIdList.forEach(v => {
        if(this.listLall[v - 1].isDisabled||this.listRall[v - 1].isDisabled) return
        srcContent = this.listLall[v - 1];
        tarContent = this.listRall[v - 1];
        this.listLall.splice(v-1,1,tarContent)
        this.listRall.splice(v-1,1,srcContent)     //watcher追踪不到es6[]
      })
    },
    // //合并
    merge() {
      let content = '';
      let content1 = '';
      let idListModel=cloneDeep(this.idList);
      const idList = this.aotuIdList(this.idList);
      const typeArr = [...this.type];
      switch (true) {
        case typeArr.findIndex(v => v === 'line-No') > -1:
          console.log('整行合并');
          idList.forEach(v => {
            content += this.listLall[v - 1].Cont;
            content1 += this.listRall[v - 1].Cont;
          });
          this.listLall.splice(idList[0] - 1, 0, { Cont: content});
          this.listRall.splice(idList[0] - 1, 0, { Cont: content1});
          idListModel[0]=idListModel[0]+1
          idListModel[1]=idListModel[1]+1
          this.del(idListModel);
          break;
        case typeArr.findIndex(v => v === 'src') > -1:
          console.log('src合并');
          idList.forEach(v => {
            content += this.listLall[v - 1].Cont;
          });
          this.listLall.splice(idList[0] - 1, 0, { Cont: content });
          //留第一个，删除后面的
          idListModel[0]=idListModel[0]+1
          idListModel[1]=idListModel[1]+1
          this.del(idListModel);
          break;
        case typeArr.findIndex(v => v === 'tgt') > -1:
          console.log('tar合并');
          idList.forEach(v => {
            content += this.listRall[v - 1].Cont;
          });
          this.listRall.splice(idList[0] - 1, 0, { Cont: content });
          //留第一个，删除后面的
          idListModel[0]=idListModel[0]+1
          idListModel[1]=idListModel[1]+1
          this.del(idListModel);
          break;
      }
      this.clearblue()
    },
    // //拆分
    breakUp(e) {
      //拆分之后多插入一行
      if (!(e.ctrlKey && e.keyCode === 13)) return;
      const that = this.nodeList[0];
      let text = that.innerText;
      console.log('ctrl + enter : 拆分');
      let breakUpPrevStr = text.slice(0, this.selectPosition);
      let breakUpNextStr = text.slice(this.selectPosition);
      that.innerText = breakUpPrevStr;
      this.insert('down', breakUpNextStr);
      this.selectChangeEnd(that);
    },
    //以下功能暂时不做了 查找 替换 历史记录 前进 后退
    //查找
    searchData(v) {
      let flag = this.checked ? '' : 'i';
      const reg = new RegExp(v, flag);
      this.selectItemId = [];
      this.searchIndex = 0;
      //匹配项高亮显示
      for (let i = 0; i < this.maxLength; i++) {
        let str = this.list[i].tempContent;
        let str1 = this.list1[i].tempContent;
        if (reg.test(str) && str) {
          let val = str.match(reg)[0];
          this.list.splice(i, 1, { content: str.replace(reg, `<span class="red" style='color: red;'>${val}</span>`), tempContent: this.list[i].tempContent });
          this.selectItemId.push({ index: i + 1, type: 'list' });
        }
        if (reg.test(str1) && str1) {
          let val = str1.match(reg)[0];
          this.list1.splice(i, 1, { content: str1.replace(reg, `<span class="red" style='color: red;'>${val}</span>`), tempContent: this.list1[i].tempContent });
          this.selectItemId.push({ index: i + 1, type: 'list1' });
        }
      }
      this.type = ['num'];
      this.selectItemId = [...new Set(this.selectItemId)];
      this.idList = this.selectItemId.length ? [this.selectItemId[this.searchIndex].index] : [];
      this.nodeList = this.multiSelectNode(this.idList);
      this.nodeAddClass();
    },
  }
};
</script>
<style type="text/css" scoped lang="scss">
.align-main-table {
  user-select: none;
  line-height: 30px;
  width: 90%;
  border: 1px solid #cabdbd;
  tr {
    td{
      vertical-align: top;
      text-align: left;
      height: 100%;
      border: 1px solid #cabdbd;
      border-right: 0;
      border-top: 0;
    }
    td:not(:first-child) {
      width: 50%;
    }
    .line-num {
      vertical-align: middle;
      text-align: center;
      height: 100%;
      .line-No{
        color: red;
        width: 52px;
        min-height: 30px;
        display: inline-block;
      }
    }
  }
}
.content-cell {
  min-height: 30px;
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
