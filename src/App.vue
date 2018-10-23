<template>
  <div id="app">
    <router-view v-if="keep"/>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    let that = this;
    window.onpopstate = () => {
      if (that.$store.state.allowBack === "false") {
        //    这个allowBack 是存在vuex里面的变量
        history.go(1);
        //return false;
      }
    };
  },
  data() {
    return {
      keep: false
    };
  },
  watch: {
    $route(to, from) {
      this.keep = false;
      this.keep = true;
      // window.location.reload();
      // 由于每次从跟进记录列表进入详情，预览图片组件都回创建一个用来预览的DOM节点，多次进入就会累积创建多个，且不被app视口控制
      // 检测是否是从详情列表返回到跟进记录列表，如果是，则需要删除预览图片组件创建的所有无法操作的DOM节点。
      // console.log(from);
      if (from.fullPath.indexOf("/details-list") >= 0) {
        let prevews = window.document.getElementsByClassName("ml-i-view");
        // console.log(prevews);
        for (let i = 0; i < prevews.length; i++) {
          let children = prevews[i];
          window.document.body.removeChild(children);
        }
      }
      // 处理存储在store中的keyWord缓存,客户池离开回到主页将关键字清除
      if (
        to.fullPath.indexOf("/home") >= 0 ||
        (to.fullPath == "/" && from.fullPath.indexOf("/customer") >= 0)
      ) {
        this.$store.commit("changeKey", "");
      }
      // 判断离开home页面，清除home页面图表的间歇定时器
      if (from.fullPath.indexOf("/home") >= 0 || from.fullPath == "/") {
        let tId = this.$store.state.timerId;
        window.clearInterval(tId);
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
