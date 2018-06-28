<template>
    <section>
        <mt-header fixed title="上传头像">
            <nuxt-link to="/mine/Perdata" slot="left">
                <mt-button icon="back"></mt-button>
            </nuxt-link>
        </mt-header>
        <div class="topEmpty"></div>
        <div class="headerD">
            <div>
                <img src="~static/img/mine/touxiang.png" alt="">
                <div class="edit">
                    <p>编辑</p>
                    <input type="file"  name='imgup'  @change="changeFn($event)" accept="image/*;capture=camera">
                </div>
            </div>
        </div>
        <!-- <mt-actionsheet class="sheetVi"
                :actions="actions"
                v-model="sheetVisible">
                123
        </mt-actionsheet> -->
    </section>
</template>

<script type="text/javascript">

    import axios from '~/plugins/axios'
        let http = require('~/plugins/http');
    let Getaxios = http.default;
    export default{
        name: 'upload',
        data(){
            return {
                // sheetVisible: false,
                // sheetVisible2: false,
                // actions: []
            }
        },
        created() {

        },
            beforeRouteEnter(to, from,  next){
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
            // takePhoto() {
            //     console.log('taking photo');
            // },

            // openAlbum() {
            //     console.log('opening album');
            // },
            changeFn(e) {
                let deviceFile = e.target.files;
                // console.log(deviceFile[0]);
            }
        },
        mounted() {
            // this.actions = [{
            //     name: '拍照',
            //     method: this.takePhoto
            // }, {
            //     name: '从相册中选择',
            //     method: this.openAlbum
            // }]
        }
        ,
//        async asyncData () {
//            let { data } = await axios.post('/api/Sex')
//            return { Sex: data }
//        },
        components: {
            axios
        },
        head () {
            return {
                title: '上传头像'
            }
        }
    }

</script>

<style type="text/css" scoped lang="less">
    .topEmpty{
        content: '';
        display: block;
        height:45.8px;
        overflow: hidden;

    }
    .mint-header {
        height: 45.8px;
        color: #333333;
        font-size: 18.1px;
        background-color: white;
    }
    .mint-actionsheet-listitem, .mint-actionsheet-button{
        font-size: 13.9px;
    }
    .sheetVi{
        font-size: 13.9px;
    }
    .mint-actionsheet-list> .mint-actionsheet-listitem{
        font-size: 13.9px;
    }
    .headerD{
        width: 100%;
        height: 6.55rem;
        background-color: white;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        .headerDd{
            width: 128px;
            height: 128px;
            display: flex;
            align-items: center;
            background-color: white;
            border: none;
            justify-content: center;
            -webkit-box-shadow:0 0 0 white;
            box-shadow:0 0 0 white;
            img{
                width: 98px;
                height: 98px;
            }
        }
    }
    .edit{
        width: 40px;
        margin: 0 auto;
        height:15px;
        overflow: hidden;
        margin-top: 10.4px;
        position: relative;
        p{
            font-size: 14.6px;
            line-height: 15px;
            color: #eb0c1c;
        }
        input{
            position:absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top:0;
            opacity: 0;
            z-index: 1;
        }
    }
</style>
