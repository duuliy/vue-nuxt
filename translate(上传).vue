<template>
  <div id="app" class="translate">
    <HeaderNav isfalg1='00'></HeaderNav>
    <div class="translate-box">
      <div class="translate_warp">
        <div class="translate_tit">
          <p>整篇文档自动翻译</p>
          <p>完美保留原文版面格式 </p>
        </div>
        <div class="translate1" v-if='uploading===false'>
          <!-- <div class="Drag draging" ref='drag'> -->
          <p class="tatit">云译通智能翻译{{options3}}</p>
          <div class="Drag-box">
            <div :class="upload==false?'Drag':'Drag draging'" ref='drag'>
              <!-- 拖拽地方 -->
              <div class="clickM">
                <div class="change" v-if='upload==false'>
                  <img src="./images/img_wj.png" alt="">
                  <h4>拖拽或选择文件</h4>
                </div>
                <div class="imgg" v-else>
                  <img src="./images/img_excel.png" alt="" v-if="upimg==='1'">
                  <img src="./images/img_jpg.png" alt="" v-if="upimg==='2'">
                  <img src="./images/img_pdf.png" alt="" v-else-if="upimg==='3'">
                  <img src="./images/img_ppt.png" alt="" v-else-if="upimg==='4'">
                  <img src="./images/img_text.png" alt="" v-else-if="upimg==='5'">
                  <img src="./images/img_word.png" alt="" v-else-if="upimg==='6'">
                  <img src="./images/img_ty.png" alt="" v-else-if="upimg==='0'">
                </div>
                <input type="file" name='imgup' @change="changeFn($event)" accept=".pdf,.Pdf_UneditableDocx,.Pdf_Docx,.Pdf_Pptx,.Doc,.Docx,.Xls,.Xlsx,.Ppt,.Pptx,.Odt,.Txt,.Jpg,.Jpeg,.Png,.Gif,.Bmp,.Tif,.Jfif,.Tiff,.Jp2,.Html">
              </div>
              <p v-show='upload==true'>{{fileName}}</p>
              <p>支持拖拽
                <span style='color:#13A2D8;'>Jpg、</span>
                <span style='color:#527DFF;'>Word、</span>
                <span style='color:#EA5656;'>Pdf、</span>
                <span style='color:#42C794;'>Excel、</span>
                <span style='color:#FF8F01;'>PPT、</span>
                <span style='color:#828282;'>Text</span>
                等20多种格式
              </p>
              <!-- <p>PDF、Word文档中的图片、扫描件、图纸、背景模糊的纯图片无法翻译</p> -->
              <p>CAD图纸、模糊的图片或广告画册类图片暂不支持</p>
            </div>
          </div>
          <div class="line"></div>
          <div class="lang_change">
            <el-form action="" label-width="100px">
              <el-row>
                <el-col :span="6">
                  <el-form-item label='源语言'>
                    <el-select v-model="value1" placeholder="请选择源语言" style='width:210px; height:36px; margin-left:-40px;'>
                      <el-option v-for="item in options" :key="item.id+1" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6" style='margin-left:20px;'>
                  <el-form-item label='目标语言'>
                    <el-select v-model="value2" placeholder="请选择目标语言" style='width:210px; height:36px; margin-left:-20px;'>
                      <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="6" style='margin-left:40px;'>
                  <el-form-item label='专业领域'>
                    <el-select v-model="value3" placeholder="请选择专业领域" style='width:210px; height:36px; margin-left:-20px;'>
                      <el-option v-for="item in options3" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->

              </el-row>

              <el-row>
                <el-col>
                  <el-button type="button" style='float:right;' @click='uploade'>开始翻译</el-button>
                </el-col>
              </el-row>
            </el-form>

          </div>
        </div>
        <!-- //这里是上传 -->
        <div class="uploading" v-else-if='uploading===true'>
          <div class="imgg2">
            <img class="img_warp" src="./images/gen.svg" alt="">
            <img src="./images/img_excel.png" alt="">
            <img src="./images/img_jpg.png" alt="" v-if="upimg==='2'">
            <img src="./images/img_pdf.png" alt="" v-else-if="upimg==='3'">
            <img src="./images/img_ppt.png" alt="" v-else-if="upimg==='4'">
            <img src="./images/img_text.png" alt="" v-else-if="upimg==='5'">
            <img src="./images/img_word.png" alt="" v-else-if="upimg==='6'">
            <img src="./images/img_ty.png" alt="" v-else-if="upimg==='0'">
          </div>
          <h2>处理中 {{Percentage}}%</h2>
        </div>
      </div>
    </div>
    <Footer></Footer>
    <Login></Login>
  </div>
</template>
<script>
import HeaderNav from "@c/common/header";
import Footer from "@c/common/Footer";
import Login from "@c/common/Login";
import { checkid } from "@/utils/user";
import "@a/scss/base.scss";
import "@a/scss/reset.scss";
export default {
  naem: "translate",
  components: {
    HeaderNav,
    Footer,
    Login
  },
  data() {
    return {
      upload: false,
      upimg: "",
      uploading: false,
      Percentage: 0,
      fileName: "",
      Files: "",
      options: [],
      options2: [],
      options3: "",
      options3id: "",
      value1: "",
      value2: "",
      value3: "",
      cid: "",
      props: {
        label: "content",
        value: "id",
        children: "domains"
      },
      connection: ""
    };
  },
  created() {
    window.name = '_all';
    checkid();
    this.getLaguage();
  },
  mounted() {
    let that = this;
    eventBus.$on("init", val => {
      that.init();
    });
    //进入
    if (this.$refs.drag) {
      this.$refs.drag.addEventListener(
        "dragenter",
        e => {
          e.preventDefault();
          e.stopPropagation();
          // console.log("进入");
        },
        false
      );

      //离开
      this.$refs.drag.addEventListener("dragleave", e => {
        e.preventDefault();
        e.stopPropagation();
        // console.log("离开");
      });

      //移动
      this.$refs.drag.addEventListener("dragover", e => {
        e.preventDefault();
        e.stopPropagation();
        // console.log("移动");
        e.dataTransfer.dropEffect = "copy";
      });

      //放下
      this.$refs.drag.addEventListener("drop", e => {
        e.preventDefault();
        e.stopPropagation();
        // const files = Array.from(e.dataTransfer.files);
        // files.forEach((v, i) => {
        //   console.log(v);
        //   console.log(i);
        // });
        // console.log("放下");
        // console.log(files);
        const files = e.dataTransfer.files;
        that.checkAll(files);
      });
    }
    //signalr

    // console.log(signalR)
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Warning)
      .withUrl("/test/progress", signalR.HttpTransportType.WebSockets)
      .build();
    // 进度处理
    this.connection.on("ProgressConnected", function(cid) {
      // console.log(cid)
      that.cid = cid;
    });
    // 进度处理
    this.connection.on("ProgressReported", function(p) {
      // c.log(p)
      that.Percentage = p.value;
    });
    this.connection.start().catch(function(err) {
      console.log("建立连接异常：" + err);
    });
  },
  methods: {
    changeFn(e) {
      let deviceFile = e.target.files;
      this.checkAll(deviceFile);
    },
    // goState(tab) {
    //   this.$emit("changetab", tab);
    // },
    checkAll(files) {
      let that = this;

      let length = files[0].name.split(".").length - 1;
      let str = files[0].name.split(".")[length].toLowerCase();
      this.fileName = files[0].name;
      // console.log(files[0].size);
      let size = files[0].size / 1024;
      if (size > 20000) {
        this.$alert(`文件大小必须小于20M`, "提示", {
          confirmButtonText: "确定"
        });
      } else {
        if (
          str === "doc" ||
          str === "xls" ||
          str === "ppt" ||
          str === "docx" ||
          str === "xlsx" ||
          str === "pptx" ||
          str === "odt" ||
          str === "txt" ||
          str === "pdf" ||
          str === "jpg" ||
          str === "jpeg" ||
          str === "png" ||
          str === "gif" ||
          str === "bmp" ||
          str === "tif" ||
          str === "tiff" ||
          str === "jfif" 
        ) {
          // console.log("开始上传");
          // console.log(files);
          if (str === "xls" || str === "xlsx") {
            this.upimg = "1";
          } else if (
            str === "jpg" ||
            str === "jpeg" ||
            str === "png" ||
            str === "gif" ||
            str === "bmp" ||
            str === "tif" ||
            str === "tiff" ||
            str === "jfif" 
          ) {
            this.upimg = "2";
          } else if (str === "pdf") {
            this.upimg = "3";
          } else if (str === "ppt" || str === "pptx") {
            this.upimg = "4";
          } else if (str === "txt") {
            this.upimg = "5";
          } else if (str === "docx" || str === "doc") {
            this.upimg = "6";
          } else {
            this.upimg = "0";
          }
          this.upload = true;
          this.Files = files;
        } else {
          this.$alert(`${files[0].name}不是被允许的格式`, "提示", {
            confirmButtonText: "确定"
          });
        }
      }
    },
    async uploade() {
      if (!this.Files) {
        this.$message.error("请拖拽或选择文件");
      } else if (this.value1 === "") {
        this.$message.error("请输入源语言");
      } else if (this.value2 === "") {
        this.$message.error("请输入目标语言");
      } else {
        //signalr
        this.uploading = true;
        // const config = {
        //       headers: {
        //         'Content-Type': 'multipart/form-data'
        //       }
        //     }
        let data = new FormData();
        data.append("ProgressId", this.cid);
        data.append("SrcLanguageType", this.value1);
        data.append("TgtLanguageType", this.value2);
        data.append("DomainTypeId", this.options3id);
        data.append("File", this.Files[0]);


        const res = await this.$axios.post(
          "/api/Translate/TranslateFileAsync",
          data
        );
        if (res.data.isSuccess === true) {
          this.Percentage = 100;
          window.location.href = `compare.html?id=${res.data.data}`;
        } else{
           this.$alert(`${res.data.errorMessage}`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              window.location.reload();
            }
          });
        }
      }
    },
    async getLaguage() {
      const [res, res2] = await Promise.all([
        this.$axios.get("/api/App/GetLanguages"),
        this.$axios.get("/api/App/GetDomainTypesAsync")
      ]);

      this.options2 = res.data;
      this.options = res.data;
      this.value1 = this.options[1].id;//初始化源语言
      this.value2 = this.options2[0].id;//初始化目标语言

      this.options3 = res2.data[0].name;
      this.options3id = res2.data[0].id;
    }
  },
  filters: {}
};
</script>
<style type="text/css" scoped lang="scss">
.translate-box {
  background: #f0f3f7;
  .translate_warp {
    margin: 0 auto;
    min-width: 1300px;
    width: 74%;
    padding-bottom: 108px;
  }
}
.translate_tit {
  text-align: center;
  p {
    color: #363636;
    font-size: 18px;
    font-weight: bolder;
    &:nth-child(1) {
      font-size: 26px;
      margin-top: 50px;
    }
    &:nth-child(2) {
      margin-top: 3px;
      letter-spacing: 3px;
      font-size: 20px;
    }
  }
}
.translate1 {
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  padding: 0 56px;
  margin-top: 33px;
  .tatit {
    text-align: center;
    line-height: 56px;
  }
  .Drag-box {
    padding: 14px 16px;
    background-color: #c0ddff;
    width: inherit;
    border-radius: 5px;
    margin: 0 auto 40px auto;
    text-align: center;
    .Drag {
      border: 1px dashed #98c7ff;
      background-color: #d3e6ff;
      border-radius: 5px;
      position: relative;
      .clickM {
        width: 154px;
        height: 115px;
        cursor: pointer;
        margin: 60px auto 32px auto;
        position: relative;
        h4 {
          font-size: 20px;
          font-weight: 700;
          color: rgba(56, 120, 237, 1);
          line-height: 48px;
          letter-spacing: 0.2px;
          text-decoration: underline;
        }
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .imgg {
          img {
            position: absolute;
            top: -22px;
            left: -10px;
          }
        }
      }
      p {
        &:nth-of-type(1) {
          font-size: 16px;
          color: rgba(6, 113, 255, 1);
          line-height: 32px;
          width: auto;
          max-width: 485px;
          margin: 0 auto;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &:nth-of-type(2) {
          font-size: 18px;
          color: rgba(71, 72, 75, 1);
          line-height: 25px;
        }
        &:nth-of-type(3) {
          margin-bottom: 32px;
          font-size: 14px;
          color: rgba(230, 33, 33, 1);
          line-height: 30px;
          letter-spacing: 0.7px;
        }
      }
    }
  }
  .draging {
    background: rgba(211, 230, 255, 1);
    border: 15px solid #98c7ff;
    &:after {
      display: none;
    }
    &:before {
      display: none;
    }
  }
}
.uploading {
  overflow: hidden;
  width: 74%;
  width: 1300px;
  height: 467px;
  background: rgba(255, 255, 255, 1);
  margin: 50px auto;
  .imgg2 {
    width: 172px;
    height: 172px;
    border-radius: 50%;
    margin: 100px auto 100px auto;
    position: relative;
    img {
      position: absolute;
    }
    @keyframes CDturn {
      from {
        transform: rotate(360deg);
      }
      to {
        transform: rotate(0deg);
      }
    }
    .img_warp {
      top: -73px;
      left: -77px;
      animation: 1s linear infinite CDturn;
      transform-origin: 164px 156px;
    }
  }
  h2 {
    width: 282px;
    height: 53px;
    font-size: 38px;
    color: rgba(63, 123, 232, 1);
    line-height: 53px;
    margin: 0 auto;
  }
}
/deep/.lang_change {
  margin: 0 auto;
  .el-form-item__label {
    line-height: 36px;
    font-size: 16px;
    float: left;
    text-align: left;
    width: 80px;
  }
  margin-top: 35px;
  .line {
    border: 1px solid rgba(240, 242, 245, 0.884);
    margin: 0 auto;
  }
  button {
    margin-bottom: 24px;
    color: rgba(255, 255, 255, 1);
    width: 139px;
    height: 47px;
    background: rgba(56, 120, 237, 1);
    border-radius: 4px;
    font-size: 18px;
  }
}
</style>
