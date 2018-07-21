<template>
  <div class="hello">
    this is test
    <button @click='getMsg'>获取本地信息</button>
    <button @click='setMsg'>存信息</button>
    <button @click='removeMsg'>删除</button>
    <button @click='resetMsg'>重置数据库</button>
    <button @click='getLength'>获取离线仓库中的 key 的数量（即数据仓库的“长度”）。</button>
    <button @click='getIdtoName'>根据 key 的索引获取其名</button>
    <button @click='getAllkey'>获取所有key</button>
    <button @click='getAllVAKEY'>迭代数据仓库中的所有 value/key 键值对。</button>

  </div>
</template>
<script src="localforage.js"></script>
<script>
export default {
  name: "HelloWorld",
  data() {
    return {};
  },
  methods: {
    //获取本地信息
    getMsg() {
      this.$getItem("somekey")
        .then(value => {
          console.log(value);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //存信息
    setMsg() {
      this.$setItem("somekey", "some value")
        .then(value => {
          console.log(value);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除
    removeMsg() {
      this.$removeItem("somekey")
        .then(() => {
          console.log("Key is cleared!");
        })
        .catch(err => {
          console.log(err);
        });
    },
    //重置数据库
    resetMsg() {
      this.$clear()
        .then(() => {
          console.log("Database is now empty.");
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取离线仓库中的 key 的数量（即数据仓库的“长度”）。
    getLength() {
      this.$length()
        .then(numberOfKeys => {
          console.log(numberOfKeys);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //根据 key 的索引获取其名
    getIdtoName() {
      this.$key(2)
        .then(keyName => {
          console.log(keyName);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取所有key
    getAllkey() {
      this.$keys()
        .then(keys => {
          console.log(keys);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //迭代数据仓库中的所有 value/key 键值对。
    getAllVAKEY() {
      this.$iterate((value, key, iterationNumber) =>{
          console.log([key, value]);
        })
        .then(()=> {
          console.log("Iteration has completed");
        })
        .catch((err) =>{
          console.log(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
