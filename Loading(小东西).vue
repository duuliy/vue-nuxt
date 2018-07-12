<template>
<div class="loading">
  <div class="loader-inner line-scale">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div >
  </div>
</div>
</template>
<script>

export default {
  name: "Loading",
  data() {
    return {
    };
  },
  components: {},
  created() {

  },
  methods: {

  }
};
</script>
<style type="text/css" scoped lang='less' >
.loading {
  text-align: center;
}
.loader-inner {
  display: inline-block;
}

@-webkit-keyframes line-scale {
  0% {
    -webkit-transform: scaley(1);
    transform: scaley(1);
  }

  50% {
    -webkit-transform: scaley(0.4);
    transform: scaley(0.4);
  }

  100% {
    -webkit-transform: scaley(1);
    transform: scaley(1);
  }
}

@keyframes line-scale {
  0% {
    -webkit-transform: scaley(1);
    transform: scaley(1);
  }

  50% {
    -webkit-transform: scaley(0.4);
    transform: scaley(0.4);
  }

  100% {
    -webkit-transform: scaley(1);
    transform: scaley(1);
  }
}

.line-scale > div:nth-child(1) {
  -webkit-animation: line-scale 1s 0.1s infinite
    cubic-bezier(0.2, 0.68, 0.18, 1.08);
  animation: line-scale 1s 0.1s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
}

.line-scale > div:nth-child(2) {
  -webkit-animation: line-scale 1s 0.2s infinite
    cubic-bezier(0.2, 0.68, 0.18, 1.08);
  animation: line-scale 1s 0.2s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
}

.line-scale > div:nth-child(3) {

  -webkit-animation: line-scale 1s 0.3s infinite
    cubic-bezier(0.2, 0.68, 0.18, 1.08);
  animation: line-scale 1s 0.3s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
}

.line-scale > div:nth-child(4) {
  -webkit-animation: line-scale 1s 0.4s infinite
    cubic-bezier(0.2, 0.68, 0.18, 1.08);
  animation: line-scale 1s 0.4s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
}

.line-scale > div:nth-child(5) {
  -webkit-animation: line-scale 1s 0.5s infinite
    cubic-bezier(0.2, 0.68, 0.18, 1.08);
  animation: line-scale 1s 0.5s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
}

.line-scale > div {
  background-color: rgb(135,187,255);
  width: 4px;
  height: 30px;
  border-radius: 2px;
  margin: 2px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  display: inline-block;
}
</style>
