<template>
  <div class="app-container">
     <!-- 头部 -->
    <header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-left-nav mui-pull-left" v-if="showBack" v-tap="{methods:back}"></a>
			<h1 class="mui-title">跟进记录</h1>
			<a class="mui-btn mui-btn-link mui-pull-right" v-tap="{methods: openWv, href: 'record-add',type: '1',id: '-1',name: '无',sid: '-1'}">新增</a>
	  </header>
    <TopFilter :ftype="2" :sortType="-1" v-on:getfilter="custFilter" @on-search="seachFocus"></TopFilter>
    <div style="width: 100%; height:50px;"></div>
    <RecordList v-cloak :gridList="grid" :none="isNone"></RecordList>
    <div style="width: 100%; height:14px;"></div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import RecordList from "./record-list"; // 引入跟进列表
import TopFilter from "./filter"; // 顶部筛选
export default {
  components: {
    RecordList: RecordList,
    TopFilter: TopFilter
  },
  data() {
    return {
      grid: [],
      showBack: true,
      isNone: false, // loading和无数据展示的控制开关
      keyWord: "", // 关键字
      lable: "",
      sDate: "", // 开始时间
      eDate: "" // 结束时间
    };
  },
  created() {
    this.getList();
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    seachFocus(a) {
      console.log(a);
      this.showBack = !a;
    },
    openWv(params) {
      var hrefto =
        "/" +
        params.href +
        (params.type ? "/" + params.type : "") +
        (params.id ? "/" + params.id : "") +
        (params.name ? "/" + params.name : "") +
        (params.sid ? "/" + params.sid : "");
      this.$router.push(hrefto);
    },
    getList() {
      let that = this;
      //console.log(that.lable)
      let userId = this.$store.state.uId;
      that.grid = [];
      that.isNone = false;
      // console.log(userId);
      this.axios
        .get("/LinkManage.ashx", {
          params: {
            Action: "FollwRecordList",
            UserId: userId,
            CustLabel: that.lable,
            keyWord: that.keyWord,
            sDate: that.sDate,
            eDate: that.eDate
          }
        })
        .then(res => {
          console.log(res.data);
          document.activeElement.blur();
          // 异常判定
          if (res.data.type && res.data.type !== 1) {
            Toast({
              message: res.data.message + " 请联系管理员",
              position: "middle",
              duration: 2000
            });
            that.grid = [];
            that.isNone = false;
            setTimeout(function() {
              that.keyWord = "";
              that.sDate = "";
              that.eDate = "";
              that.getList();
            }, 1000);
            return;
          }
          // 数据处理
          that.isNone = false;
          that.grid = [];
          setTimeout(function() {
            that.grid = res.data;
            if (that.grid.length == 0) {
              that.isNone = true;
            }
          }, 500);
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    custFilter: function(data) {
      // 接收子组件fileter传过来到值
      //alert('接收成功！请在控制台查看接收到到数据')
      console.log(data);
      if (data.type == "1") {
        // 筛选
        this.lable = data.typeId;
        this.getList();
      } else if (data.type == "2") {
        this.sDate = data.sDate;
        this.eDate = data.eDate;
        this.getList();
      } else if (data.type == "3") {
        this.keyWord = data.keyWord;
        this.getList();
      }
    }
  }
};
</script>

<style rel="stylesheet/scss"  scoped>
.app-container {
  position: relative;
  background-color: #efeff4;
}
.app-container i {
  font-style: normal;
}
</style>

