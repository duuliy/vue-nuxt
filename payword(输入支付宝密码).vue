<template>
    <div class="pay-tool">
        <mt-header fixed title="输入支付密码" color="white">
            <span class="icon icon-back" slot="left" @click="backHandle">清空</span>
            <nuxt-link to="" slot="right">
                <span>忘记密码?</span>
            </nuxt-link>
        </mt-header>
        <div class='topEmpty'></div>
        <div class="pay-tool-content">
            <div class="pay-tool-inputs">
                <div class="item" v-for="i in items"><span class="icon_dot" v-if="password[i]"></span></div>
            </div>
        </div>
        <div class="pay-tool-keyboard">
            <ul>
                <li @click="keyUpHandle($event)" v-for="val in keys">
                    {{ val }}
        </li>
                <li class="del" @click="delHandle"><span class="icon-del"><</span></li>
            </ul>
        </div>
    </div>
</template>

<script>
    const keys = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0];
    // let sendFlag = true // 防止重复发送密码
    export default {
        data () {
            return {
                items: [0, 1, 2, 3, 4, 5],
                keys: keys(),
                password: []
            }
        },
        methods: {
            backHandle () {
                this.clearPasswordHandle();  // 返回时清除password
                this.$emit('backFnc') // 返回上级
            },
            keyUpHandle (e) {
                let text = e.currentTarget.innerText;
                let len = this.password.length;
//                console.log(text);
                if (!text || len >= 6) return
                this.password.push(text)
                this.ajaxData()
            },
            delHandle () {
                if (this.password.length <= 0) return false;
                this.password.shift()
            },
            ajaxData () {
                if (this.password.length >= 6) {
                    let pay_pass = parseInt(this.password.join(' ').replace(/\s/g, ''));
//                    console.log(parseInt(this.password.join(' ').replace(/\s/g, '')))
                    this.$emit('payFnc',pay_pass);
                    this.clearPasswordHandle();
                }
                return false
            },
            clearPasswordHandle () {
//                console.log(123);
                this.password = [];
            }
        }
    }
</script>

<style lang="less" scoped>
    .mint-header{
        height:45.8px;
        color: #333333;
        font-size: 18.1px;
        background-color: white;
        /deep/h1{
            font-size: 14.6px;
            font-weight: 700;
        }
        /deep/.mint-header-button.is-right{
            font-size: 10.4px;
            color: #999999;
        }
        /deep/.mint-header-button.is-left{
            font-size: 10.4px;
            color: #999999;
        }
    }
    .topEmpty{
        content: '';
        display: block;
        height:45.8px;
        overflow: hidden;
    }
    .pay-tool {
        &-content {
            .pay-tool-inputs {
                width: 280px;
                margin: 25px auto;
                display: flex;
                justify-content: space-around;
                .item {
                    background-color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width:35px;
                    height: 35px;
                    line-height: 35px;
                    text-align: center;
                    &:last-child {
                        border-right: none;
                    }
                    .icon_dot {
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        border-radius: 10px;
                        background-color: black;
                        background-size: cover;
                    }
                }
            }
        }
        .pay-tool-keyboard {
            width: 100%;
            ul {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                li {
                    width: 33.1%;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    border-right: 1px solid #aeaeae;
                    border-bottom: 1px solid #aeaeae;
                    font-size: 20px;
                    font-weight: bold;
                    &:nth-child(1), &:nth-child(2), &:nth-child(3) {
                        border-top: 1px solid #eee;
                    }
                    &:nth-child(3), &:nth-child(6), &:nth-child(9), &:nth-child(12) {
                        border-right: none;
                    }
                    &:nth-child(10), &:nth-child(11), &:nth-child(12) {
                        border-bottom: none;
                    }
                    &:nth-child(10), &:nth-child(12), &:active {
                        background-color: #d1d4dd;
                    }
                    &:nth-child(12):active {
                        background-color: #fff;
                    }
                }
            }
        }
    }
</style>