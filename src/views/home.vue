<template>
  <div class="app-container" v-scroll="onScroll">
    <header v-if="toggleHead" class="main-header">
      <h1 class="header-title fl">首页</h1>
      <div class="fr sign-out" v-tap="{methods:signOut}">
        <span class="iconfont icon-tuichu"></span>
      </div>
    </header>
    <header v-if="!toggleHead" class="mui-bar mui-bar-nav">
			<h1 class="mui-title">首页</h1>
			<a class="mui-icon iconfont icon-tuichu mui-pull-right" v-tap="{methods:signOut}"></a>
		</header>
    <div class="main-box">
      <div class="main-achi">
        <div class="achi-now">
          <p>
            <span class="now-title">当前业绩</span><br>
            <span class="now-number">{{achi.CONTMONEY === null || achi.CONTMONEY === '' || achi.CONTMONEY === undefined ? 0 : achi.CONTMONEY}}</span>
          </p>
          <!-- <img class="fr pie" src="/static/img/pie.png" @click="togglePic" alt=""> -->
        </div>
        <div class="achi-other">
          <p style="text-align: left;">目标业绩 {{achi.TARGETMONEY === null || achi.TARGETMONEY === "" || achi.TARGETMONEY === undefined ? 0 : achi.TARGETMONEY}}</p>
          <p style="text-align: right;">业绩差值 {{achi.MONEYSTEP === null || achi.MONEYSTEP === "" || achi.MONEYSTEP === undefined ? 0 : achi.MONEYSTEP}}</p>
        </div>
      </div>
    </div>
		<h3 class="cl-title" style="color: #ff8a4a;">业绩排名</h3>
		<div class="chart-box" ref="chart" style="margin-bottom: 0;"></div>
		<h3 class="cl-title" style="color: #ff8a4a;">业绩加销组排名</h3>
		<div class="chart-box" ref="sector" style="height: 340px;"></div>
		<nav class="mui-bar mui-bar-tab">
			<router-link class="mui-tab-item mui-active" to="/">
				<span class="mui-icon mui-icon-home tab-icon"></span>
				<span class="mui-tab-label">首页</span>
			</router-link>
			<router-link class="mui-tab-item" to="/customer">
				<span class="mui-icon iconfont icon-zhengchangkehu tab-icon"></span>
				<span class="mui-tab-label">客户池</span>
			</router-link>
			<router-link class="mui-tab-item" to="/customer-myself">
				<span class="mui-icon iconfont icon-guanzhukehu tab-icon"></span>
				<span class="mui-tab-label">我的客户</span>
			</router-link>
			<router-link class="mui-tab-item" to="/record">
				<span class="mui-icon iconfont icon-qianyuejilu tab-icon"></span>
				<span class="mui-tab-label">跟进记录</span>
			</router-link>
		</nav>
  </div>
</template>

<script>
let echarts = require("echarts");
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      achi: {},
      myChart: {}, //条形图实例
      opt: {}, // 条形图配置项
      toggleHead: true,
      flatPie: true,
      myPie: {}, // 饼形图实例
      pieOpt: {} // 饼形图配置项
    };
  },
  created() {
    history.pushState(null, null, location.href);
  },
  mounted() {
    this.getAchi();
    this.inintPage();
  },
  updated() {
    let that = this;
    // 定时刷新图表数据
    let timerId = window.setInterval(function() {
      that.setCharts();
    }, 5000);
    this.$store.commit("setTimerId", timerId);
  },
  methods: {
    openWv(params) {
      var hrefto = "/" + params.href + (params.id ? "/" + params.id : "");
      this.$router.push(hrefto);
    },
    inintPage() {
      let that = this;
      // 绘制业绩排名
      let chartDom = this.$refs.chart;
      // 基于准备好的dom，初始化条形实例
      this.myChart = echarts.init(chartDom);
      // 绘制加销业绩排名
      let pieDom = this.$refs.sector;
      // 基于准备好的dom，初始化饼形图实例
      this.myPie = echarts.init(pieDom);
      // 调用请求chart数据配置
      this.setCharts();
    },
    /* 设置echarts图表数据*/
    setCharts() {
      let that = this;
      // 请求数据并绘制条形图表/业绩排名
      this.axios
        .get("/ReportManage.ashx", {
          params: {
            Action: "UserTargetMoneySort"
          }
        })
        .then(res => {
          // console.log(res.data);
          let result = res.data;
          let nameList = [];
          let cuntList = [];
          for (let i = 0; i < result.length; i++) {
            nameList.push(result[i].NAME);
            cuntList.push(result[i].CONTMONEY / 10000);
          }
          // console.log(nameList);
          // console.log(cuntList);
          // that.opt.xAxis.data = nameList;
          // that.opt.series.data = cuntList;
          that.opt = {
            title: {
              subtext: "单位/万元"
            },
            tooltip: {},
            xAxis: [
              {
                type: "category",
                boundaryGap: true,
                data: nameList,
                axisLabel: {
                  show: true,
                  interval: 0,
                  formatter: function(val) {
                    return val.split("").join("\n");
                  }
                }
              }
            ],
            yAxis: {
              type: "value"
            },
            grid: {
              x: 40,
              y: 60,
              x2: 30,
              y2: 66
            },
            series: [
              {
                name: "销量",
                type: "bar",
                data: cuntList,
                itemStyle: {
                  normal: {
                    color: function(params) {
                      // 如果柱状图数量多余当前颜色，则会循环当前颜色数组渲染
                      var colorList = [
                        "#ff7f50",
                        "#87cefa",
                        "#61a0a8",
                        "#d48265",
                        "#91c7ae",
                        "#749f83",
                        "#ca8622",
                        "#bda29a",
                        "#6e7074",
                        "#607d8b",
                        "#c4ccd3"
                      ];
                      return colorList[params.dataIndex];
                    }
                  }
                }
              }
            ]
          };
          // that.myChart.clear();
          that.myChart.setOption(that.opt, true);
        })
        .catch(function(err) {
          console.log(err);
        });
      // 绘制饼形图图表/加销业绩
      this.axios
        .get("/ReportManage.ashx", {
          params: {
            Action: "UserJiaTargetMoneySort"
          }
        })
        .then(res => {
          console.log(res.data);
          let result = res.data;
          let nameList = [];
          let cuntList = [];
          for (let i = 0; i < result.length; i++) {
            nameList.push(result[i].NAME);
            cuntList.push(result[i].CONTMONEY / 10000);
          }
          // console.log(nameList);
          // console.log(cuntList);
          // that.opt.xAxis.data = nameList;
          // that.opt.series.data = cuntList;
          that.pieOpt = {
            title: {
              subtext: "单位/万元"
            },
            tooltip: {},
            xAxis: [
              {
                type: "category",
                boundaryGap: true,
                data: nameList,
                axisLabel: {
                  show: true,
                  interval: 0,
                  formatter: function(val) {
                    return val.split("").join("\n");
                  }
                }
              }
            ],
            yAxis: {
              type: "value"
            },
            grid: {
              x: 40,
              y: 60,
              x2: 30,
              y2: 66
            },
            series: [
              {
                name: "销量",
                type: "bar",
                data: cuntList,
                itemStyle: {
                  normal: {
                    color: function(params) {
                      // 如果柱状图数量多余当前颜色，则会循环当前颜色数组渲染
                      var colorList = [
                        "#ff7f50",
                        "#87cefa",
                        "#61a0a8",
                        "#d48265",
                        "#91c7ae",
                        "#749f83",
                        "#ca8622",
                        "#bda29a",
                        "#6e7074",
                        "#607d8b",
                        "#c4ccd3"
                      ];
                      return colorList[params.dataIndex];
                    }
                  }
                }
              }
            ]
          };
          // that.myPie.clear();
          that.myPie.setOption(that.pieOpt, true);
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    /* 退出登录 */
    signOut() {
      let that = this;
      MessageBox.confirm("确定要退出吗？", "颠峰CRM提示您").then(
        action => {
          //console.log("确定")
          this.cleanDingId(); //发送给服务器清除钉钉id
        },
        promise => {
          console.log("点击了取消");
        }
      );
    },
    cleanDingId() {
      let that = this;
      that.axios
        .get("/UserManage.ashx", {
          params: {
            Action: "CheckLogout",
            DingId: that.$store.state.dingId
          }
        })
        .then(res => {
          // alert(JSON.stringify(res.data));
          // alert(that.$store.state.dingId);
          // 清空缓存
          that.$store.commit("sessionuId", 0); // 设置uId
          that.$store.commit("sessionuName", ""); // 设置uName
          that.$store.commit("setDingId", ""); // 清空钉钉Id
          // 退回登陆页面
          that.$router.replace("/login");
        })
        .catch(function(err) {
          alert(err);
          // alert(JSON.stringify(err));
        });
    },
    /* 业绩展示 */
    getAchi(a = "") {
      let that = this;
      this.axios
        .get("/ReportManage.ashx", {
          params: {
            Action: "UserTargetMoney",
            UserId: that.$store.state.uId
          }
        })
        .then(res => {
          // console.log(res.data);
          that.achi = res.data;
          if (that.achi.CONTMONEY == undefined) {
            this.popupVisible = false;
            if (a != "" && that.flatPie) {
              Toast({
                message: "无法获取业绩展示数据！",
                position: "middle",
                duration: 2000
              });
              that.flatPie = false;
            }
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    /*控制获取顶部卷曲的高度并控制顶部的显示隐藏*/
    onScroll(a, b) {
      //console.log(a)
      // console.log(b);
      if (240 - b.scrollTop < 0) {
        this.toggleHead = false;
      } else {
        this.toggleHead = true;
      }
    }
  }
};
</script>

<style scoped>
.app-container {
  background-color: #efeff4;
  padding-top: 0 !important;
}
.line {
  text-align: center;
}
.cl-title {
  font-weight: normal;
  font-size: 15px;
  line-height: 36px;
  margin: 0;
  margin-top: 12px;
  background: -webkit-gradient(
    linear,
    55% 100%,
    55% 0%,
    from(#f1f1f1),
    to(#ffffff)
  );
}
.ach-box {
  display: flex;
}
.ach-box .ach-tiem {
  flex: 1;
  text-align: center;
  line-height: 34px;
  color: #fff;
}
.ach-box .ach-tiem > p {
  margin: 0;
  line-height: 24px;
  margin-bottom: 6px;
  color: #fff;
}
.bg-color1 {
  background-color: #52ace5;
}
.bg-color2 {
  background-color: #4db7ad;
}
.bg-color3 {
  background-color: #ffa977;
}
.chart-box {
  width: 100%;
  padding: 0 15px;
  height: 420px;
  margin-bottom: 66px;
  background-color: #fff;
}
.main-box {
  width: 100%;
  height: 240px;
  background: url(/static/img/banner.jpg) no-repeat top center;
  background-size: cover;
  padding: 14px 16px;
  position: relative;
}
.main-header {
  position: fixed;
  width: 100%;
  height: 44px;
  z-index: 12;
  padding: 0 16px;
  top: 0px;
  left: 0px;
}
.main-header .header-title {
  color: #fff;
  font-size: 15px;
  line-height: 54px;
}
.main-header .sign-out {
  margin-top: 10px;
  color: #fff;
  padding: 6px;
  background-color: rgba(35, 35, 35, 0.2);
  border-radius: 50%;
}
.main-header .sign-out .iconfont {
  font-size: 18px;
}
.main-box .main-achi {
  position: absolute;
  bottom: 14px;
  left: 0;
  width: 100%;
  overflow: hidden;
  padding: 0 16px;
}
.main-box .main-achi .achi-now {
  text-align: left;
  margin-bottom: 12px;
  overflow: hidden;
}
.main-box .main-achi .achi-now > p {
  color: #fff;
  text-align: left;
  display: inline-block;
}
.main-box .main-achi .achi-now .pie {
  width: 60px;
  height: 60px;
  margin-right: 20px;
}
.main-box .main-achi .achi-now > p .now-title {
  display: inline-block;
  margin-bottom: 6px;
}
.main-box .main-achi .achi-now > p .now-number {
  font-size: 26px;
  font-weight: 600;
}
.main-box .main-achi .achi-other {
  display: flex;
}
.main-box .main-achi .achi-other p {
  flex: 1;
  color: #fff;
}
.pie-box {
  margin: 0 auto;
  width: 280px;
  height: 320px;
  position: relative;
}
</style>

