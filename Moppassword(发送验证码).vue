<template>
    <section>
        <mt-header fixed title="修改支付密码">
            <nuxt-link to="/mine/Paysetting" slot="left">
                <mt-button icon="back"></mt-button>
            </nuxt-link>
        </mt-header>
        <div class="topEmpty"></div>
        <div class="minelist f1">
            <p>已验证手机</p>
            <span>{{Bindingbard}}</span>
            <!--<div class="iphonenum" @click="send('hi')" style="color:#eb0c1c">获取验证码</div>-->
            <div id="btnSendCode" class="iphonenum" @click="sendMessage" style="color:#eb0c1c">{{verification}}</div>
        </div>
        <mt-field label="手机验证码" ref="Verf" placeholder="输入手机验证码" :attr="{ maxlength: 6 }"></mt-field>
        <mt-button  class="btn" type="danger" size="large" @click.native="Submitnext">下一步</mt-button>
    </section>
</template>

<script type="text/javascript">
    import axios from '~/plugins/axios'
    let http = require('~/plugins/http');
    let Getaxios = http.default;
    export default{
        data(){
            return {
                Bindingbard:"",
                InterValObj:"", //timer变量，控制时间
                count:60,//间隔函数，1秒执行
                curCount:"",//当前剩余秒数
                verification:"发送验证码"
            }
        },
        created() {
             Getaxios.getData('post', 'me')
                .then(res=>{
                    this.Bindingbard=res.data.mobile
                })

        },
        components: {
            axios
        },
        filters: {
            // 多行文本溢出
            textCut: function(value){
                return  value.length > 10 ? value.slice(0,10) + "..." : value ;
            }
        },
            beforeRouteEnter(to, from, next){
         next(vm=>{
              let that =this;
          Getaxios.getData('post', 'me')
             .then(res=>{
                 if(res.code!="2000"){
                    vm.$router.push({path: '/login'});
                 }
             })
        })
        },
        methods: {
            Submitnext(){
////               下一步
                Getaxios.getData('post', 'payment/sms/verify',{
                    code:123456
                }).then(res => {
                    // console.log(res.code);
                    if(res.code=="2000"){
                        this.$router.push({path: '/mine/Setpassword'})
                    }
                });
            },
            sendMessage() {
                let that=this
                Getaxios.getData('post', 'password/payment/sms').then(res => {
                    // console.log(res.code);
                    if(res.code=="2000"){
                        that.curCount = that.count;
                        $("#btnSendCode").attr("disabled", "true");
                        that.verification = that.curCount + "秒后可重新发送";
                        that.InterValObj = window.setInterval(that.SetRemainTime, 1000);
                    }
                })
            },
            SetRemainTime() {
                if (this.curCount == 0) {
                    window.clearInterval(this.InterValObj);
                    $("#btnSendCode").removeAttr("disabled");//启用按钮
                    this.verification = "重新发送验证码";
                }
                else {
                    this.curCount--;
                    this.verification = this.curCount + "秒后可重新发送";
                }
            }
        },
        head () {
            return {
                title: '修改支付密码'
            }
        }
    }

</script>

<style type="text/css" scoped lang="less">
    .mint-header{
        height:45.8px;
        color: #333333;
        font-size: 18.1px;
        background-color: white;
    }
    .topEmpty{
        content: '';
        display: block;
        height:45.8px;
        overflow: hidden;
    }
    /*按钮*/
    .mint-radio-input:checked + .mint-radio-core{
        background-color: #eb0c1c;
        border-color:#eb0c1c;
    }
    .mint-button--danger{
        background-color: #eb0c1c;
    }
    .btn{
        margin:104px auto;
        width: 92.5%;

    }
    .minelist{
        margin-top: 10.4px;
        width: 100%;
        height: 85.4px;
        position: relative;
        background-color: white;
        display: flex;
        align-items: center;
        p{
            position: absolute;
            left: 10px;
            top:14.3px;
            line-height: 41.7px;
            font-size: 14.6px;
            display: inline-block;
            color: #333333;
        }
        span{
            display: inline-block;
            position: absolute;
           color: #eb0c1c;
            font-size: 14.6px;
            left: 10px;
            top:50px;
        }
        .iphonenum{
            top: 38.1px;
            width: 98.9px;
            height: 21px;
            border-radius: 5px;
            border: solid 1px #eb0c1c;
            text-align: center;
            line-height: 23px;
            position: absolute;
            right: 10px;
        }
    }
</style>