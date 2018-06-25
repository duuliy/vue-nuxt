import Vue from 'vue'
import about from './about.vue'
import VueAMap from 'vue-amap';


Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});
/* eslint-disable no-new */
window.eventBus=new Vue()
new Vue({
  el: '#app',
  template: '<about/>',
  components: { about }
})
      