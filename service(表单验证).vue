<template>
  <div id='app'>
    <HeaderNav iscolor='false'></HeaderNav>
    <div class="cont_warp">
      <div class="banner">
        <div class="banner_tit">
          <h2>通过服务</h2>
          <p>个性化定制公司所需要的翻译需求</p>
          <p>通过服务, 更好的展示自身品牌价值 </p>
        </div>
      </div>
      <div class="formSerive">
        <el-form role="form" :rules="rule" :model="ruleForm" ref="ruleForm">
          <div class="form-group">
            <el-form-item>
              <p>称呼:</p>
              <el-input type="text" v-model="ruleForm.name" maxlength="30" class="form-control" style="height:50px;margin-top:5px;" placeholder="输入您的称呼"></el-input>
            </el-form-item>
          </div>
          <div class="form-group f2">
            <el-form-item prop="phoneNumber">
              <p>手机:</p>
              <el-input v-model="ruleForm.phoneNumber" class="form-control" style="height:50px;margin-top:5px;" placeholder="输入您的手机"></el-input>
            </el-form-item>
          </div>
          <div class="form-group ">
            <el-form-item prop="email">
              <p>邮箱:</p>
              <el-input type="email" v-model="ruleForm.email" class="form-control" style="height:50px;margin-top:5px;" placeholder="输入您的邮箱"></el-input>
            </el-form-item>
          </div>
          <div class="form-group">
            <el-form-item>
              <p>公司名称:</p>
              <el-input type="text" v-model="ruleForm.companyName" maxlength="50" class="form-control" style="height:50px;margin-top:5px;" placeholder="请输入您的公司名称"></el-input>
            </el-form-item>
          </div>
          <div class="form-group f2">
            <el-form-item>
              <p>公司所属行业:</p>
              <el-select v-model="ruleForm.companyCategory" maxlength="50" filterable allow-create default-first-option placeholder="选择您的公司所属行业" style='width:100%;margin-top:5px;'>
                <el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-button style="margin-top:35px; width:100%;color:rgba(255,255,255,1);height:50px;
                                    background:rgba(95,146,239,1);border-radius:10px;font-size:18px;
                                    box-shadow:6px 0px 13px rgba(169,207,255,1);" @click='submit'>提交</el-button>
        </el-form>
      </div>
    </div>
    <Footer class="footer"></Footer>
    <!-- <Login></Login> -->
  </div>
</template>
<script>
import "@a/scss/reset.scss";
import Footer from "@c/common/Footer";
import HeaderNav from "@c/common/HeaderNav";
// import Login from "@c/common/Login";

export default {
  naem: "service",
  data() {
    let checkPhone = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error("手机号不能为空"));
      // } else {
      const reg = /^1[0-9]{10}$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("请输入正确的手机号"));
      }
      // }
    };

    return {
      ruleForm: {
        name: "",
        phoneNumber: "",
        email: "",
        companyName: "",
        companyCategory: ""
      },
      rule: {
        phoneNumber: [{ validator: checkPhone, trigger: "blur" }],
        email: [
          // { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      options5: [
        { value: "广告营销", label: "广告营销" },
        { value: "O2O", label: "O2O" },
        { value: "在线教育", label: "在线教育" },
        { value: "智能硬件", label: "智能硬件" },
        { value: "社交网络", label: "社交网络" },
        { value: "旅游", label: "旅游" },
        { value: "信息安全", label: "信息安全" },
        { value: "计算机软件", label: "计算机软件" },
        { value: "物流/仓储", label: "物流/仓储" },
        { value: "汽车生产", label: "汽车生产" },
        { value: "电子商务", label: "电子商务" },
        { value: "数据服务", label: "数据服务" },
        { value: "通信/网络设备", label: "通信/网络设备" },
        { value: "贸易/进出口", label: "贸易/进出口" },
        { value: "游戏", label: "游戏" },
        { value: "医疗健康", label: "医疗健康" },
        { value: "分类信息", label: "分类信息" },
        { value: "人力资源服务", label: "人力资源服务" },
        { value: "移动互联网", label: "移动互联网" },
        { value: "广告/公关/会展", label: "广告/公关/会展" },
        { value: "咨询", label: "咨询" },
        { value: "媒体", label: "媒体" },
        { value: "生活服务", label: "生活服务" },
        { value: "音乐/视频/阅读", label: "音乐/视频/阅读" },
        { value: "企业服务", label: "企业服务" },
        { value: "互联网", label: "互联网" },
        { value: "互联网金融", label: "互联网金融" },
        { value: "工程施工", label: "工程施工" },
        { value: "其他行业", label: "其他行业" }
      ]
    };
  },
  components: {
    HeaderNav,
    Footer
    // Login
  },
  methods: {
    submit() {
      let that = this;
      if (this.ruleForm.phoneNumber || this.ruleForm.email) {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            that.$axios
              .post("/api/Customer/CreateCustomerAsync", {
                name: that.ruleForm.name,
                phoneNumber: that.ruleForm.phoneNumber,
                email: that.ruleForm.email,
                companyName: that.ruleForm.companyName,
                companyCategory: that.ruleForm.companyCategory
              })
              .then(res => {
                // console.log(res);
                if (res.status == "200") {
                  that.$alert("提交成功", {
                    confirmButtonText: "确定"
                  });
                }
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$alert("手机号码和邮箱不能同时为空", {
          confirmButtonText: "确定"
        });
      }
    }
  }
};
</script>
<style type="text/css" scoped lang="scss">
* {
  font-family: 微软雅黑;
}
.cont_warp {
  position: relative;
  padding-bottom: 430px;
  .banner {
    width: 100%;
    height: 745px;
    background: url("./images/banner.png") no-repeat;
    text-align: center;
    overflow: hidden;
    .banner_tit {
      color: white;
      margin-top: 85px;
      h2 {
        font-size: 35px;
        border-bottom: 3px solid white;
        width: 176px;
        margin: 0 auto;
        padding-bottom: 5px;
        letter-spacing: 9px;
      }
      p {
        letter-spacing: 5px;
        font-size: 20px;
        line-height: 28px;
        &:nth-of-type(1) {
          margin-top: 30px;
        }
      }
    }
  }
  .formSerive {
    width: 528px;
    height: 749px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 6px 0px 13px rgba(169, 169, 169, 1);
    position: absolute;
    z-index: 999;
    left: 50%;
    top: 285px;
    margin-left: -264px;
    form {
      width: 80%;
      margin: 45px auto;
      .form-group {
        margin-top: 10px;
      }
    }
  }
}
</style>