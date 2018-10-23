<template>
  <div class="app-container">
    <header class="mui-bar mui-bar-nav">
			<a v-if="showBack" class="mui-icon mui-icon-left-nav mui-pull-left" v-tap="{methods:back}"></a>
			<h1 class="mui-title" v-html="title"></h1>
	  </header>
    <!-- 搜索栏 -->
    <!-- <div class="mui-search">
      <input type="search" class="mui-input-clear" placeholder="请输入条件">
      <button type="button" class="mui-btn mui-btn-primary" style="border:1px solid #36a1db; background-color: #36a1db;">查询</button>
    </div> -->
    <!-- 客户列表 -->
    <TopFilter :ftype="3" :sortType="type" @getfilter="orderFilter" @on-search="seachFocus"></TopFilter>
    <ul class="mui-table-view clientlist">
		  <li class="mui-table-view-cell" v-cloak v-for="n in grid" :key="n.id">
		  	<div class="list-box">
		  		<em :class="{'em-color1':type == 1, 'em-color2':type == 2, 'em-color3':type == 3}"></em>
              	<p>
              	  <span class="title"> 
                        <i class="mui-icon-extra" :class="{'mui-icon-extra-order': (type == 1 || type == 4), 'mui-icon-extra-prech': type == 2, 'mui-icon-extra-university': type == 3}"></i>
                        <i v-if="type == 1"> {{ n.订购编号 === " " || n.订购编号 === null ? "无编号" : n.订购编号 }} </i>
                        <i v-if="type == 4"> {{ n.订单编号 === " " || n.订单编号 === null ? "无编号" : n.订单编号 }} </i>
                        <i v-if="type == 2 || type == 3">{{n.班级 === " " || n.班级 === null ? "暂无班级" : n.班级}}</i>
                    </span>
                    <span v-if="type == 1 " class="span-b"><i class="name-clolor">{{ n.产品名称 }}</i></span>
                    <span v-if="type == 4" class="span-b"><i class="name-clolor">{{ n.班级 == "" || n.班级 == null ? '无班级' : n.班级 }}</i></span>
                    <span v-if="type == 4" class="span-b">产品名称：{{n. 产品名称 === " " || n. 产品名称 === null ? "无产品名称" : n. 产品名称}}</span>
                    <span v-if="type == 2 || type == 3" class="span-b"><i class="product">产品：{{ n.产品 === " " || n.产品 === null ? "无名称" : n.产品}}</i>&nbsp;&nbsp; 学员：{{n.学员 === " " || n.学员 === null ? "无姓名" : n.学员}}</span>
                    <span v-if="type == 1" class="span-b">总额：￥{{ n.订单总额 === " " || n.订单总额 === null ? "0" : n.订单总额 }}&nbsp;&nbsp;&nbsp;已收：￥ {{ n.已收款总额 === " " || n.已收款总额 === null ? "0" : n.已收款总额 }}</span>
                    <span v-if="type == 4" class="span-b">总名额：{{ n.总名额 === " " || n.总名额 === null ? "0" : n.总名额 }} 名&nbsp;&nbsp;&nbsp;已消费名额：{{ n.已消费名额 === " " || n.已消费名额 === null ? "0" : n.已消费名额 }} 名</span>
                    <span v-if="type == 2" class="span-b"><i class="product">类型：{{n.上课类型 === " " || n.上课类型 === null ? "未选择" : n.上课类型}}</i>&nbsp;&nbsp; 签到：{{n.是否签到 === " " || n.是否签到 === null ? "未选择" : n.是否签到}}</span>
                    <span v-if="type == 3" class="span-b"><i class="product">价格：￥{{n.消费价格 === " " || n.消费价格 === null ? '0' : n.消费价格}}</i>&nbsp;&nbsp;状态：{{n.学员状态 === " " || n.学员状态 === null ? "未选择" : n.学员状态}}</span>
                    <span v-if="type == 3" class="span-b">身份证：{{n.身份证号}}</span>
                    <span v-if="type == 4" class="span-b">剩余名额：{{n. 剩余名额 === " " || n. 剩余名额 === null ? "0" : n. 剩余名额}} 名&nbsp;&nbsp;&nbsp;订单状态：{{n. 订单状态 === " " || n. 订单状态 === null ? "未选择" : n. 订单状态}}</span>
                    <span v-if="type == 1 " class="span-b">订单状态：{{n. 订单状态 === " " || n. 订单状态 === null ? "未选择" : n. 订单状态}}</span>
                    <span v-if="type == 1" class="span-b">订购日期：{{n.订购时间 === "" || n.订购时间 === null ? "无" : n.订购时间}}</span>
                    <span v-if="type == 4" class="span-b">订单时间：{{n.订单时间 === "" || n.订单时间 === null ? "无" : n.订单时间}}</span>
                    <span v-if="type == 2" class="span-b">签到时间：{{n.签到时间 === "" || n.签到时间 === null ? "无" : n.签到时间}}</span>
                    <span v-if="type == 1" class="span-b">意见：<i class="option-msg">{{n.收款审批意见 === " " || n.收款审批意见 === null ? "未填写" : n.收款审批意见}}</i></span>
              	</p>
		  	</div>
		  </li>
			<li class="mui-table-view-cell no-list" v-cloak v-if="grid.length == 0">
				<span class="wait-icon" :class="{'el-icon-loading': !isNone,'icon-pingjuchaxun': isNone,'iconfont': isNone}"></span> <span v-html="isNone ? '暂无数据' : '拼命加载中...'"></span>
			</li>
		</ul>
  </div>
</template>

<script>
import TopFilter from "./filter"; // 顶部筛选
export default {
  components: {
    TopFilter: TopFilter
  },
  data() {
    return {
      type: 1,
      title: "已购订单",
      grid: [],
      isNone: false,
      showBack: true,
      keyWord: -1,
      Sort: -1
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.type = parseInt(this.$route.params.type);
    // 头部标题
    switch (this.type) {
      case 1:
        this.title = "已购订单";
        break;
      case 2:
        this.title = "上课记录";
        break;
      case 3:
        this.title = "消费记录";
        break;
      case 4:
        this.title = "未消费名额记录";
        break;
    }
    console.log("id:" + this.id + " type:" + this.type);
    this.getList(); // 测试号 KH0473308
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    openWv(params) {
      var hrefto = "/" + params.href + "/" + params.id;
      this.$router.push(hrefto);
    },
    seachFocus(a) {
      console.log(a);
      this.showBack = !a;
    },
    orderFilter(data) {
      console.log(data);
      if (data.type == 2) {
        this.Sort = data.sortId;
      } else if (data.type == 3) {
        this.keyWord = data.keyWord;
      }
      this.getList();
    },
    getList() {
      let that = this;
      let url = "";
      if (this.type === 1) {
        url = "/CustomerManage.ashx?Action=CustBuyHistoryList";
      } else if (this.type === 2) {
        url = "/CustomerManage.ashx?Action=CustClassRecordList";
      } else if (this.type === 3) {
        url = "/CustomerManage.ashx?Action=CustConsumeRecordList";
      } else if (this.type === 4) {
        url = "/CustomerManage.ashx?Action=ClassRecord";
      }
      this.axios
        .get(url, {
          params: {
            CustNo: that.id,
            keyWord: that.keyWord,
            Sort: that.Sort
          }
        })
        .then(res => {
          console.log(res.data);
          // 异常判定
          if (res.data.type && res.data.type !== 1) {
            Toast({
              message: res.data.message + " 请联系管理员",
              position: "middle",
              duration: 2000
            });
            that.grid = [];
            setTimeout(function() {
              that.getList();
            }, 1000);
            return;
          }

          // 处理数据
          that.grid = [];
          that.isNone = false;
          setTimeout(function() {
            that.grid = res.data;
            if (that.grid.length === 0) {
              that.isNone = true;
            }
          }, 500);
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
</script>

<style rel="stylesheet/scss"  scoped>
.app-container {
  height: 100%;
  position: relative;
}
.app-container i {
  font-style: normal;
}

.app-container .mui-search {
  margin-top: 10px;
  padding-right: 74px;
  padding-left: 15px;
}
.app-container .mui-search input {
  margin-bottom: 0px;
}
.app-container .mui-search .mui-btn {
  position: absolute;
  top: 0;
  right: 10px;
}
/* 列表*/
.mui-table-view::before {
  height: 0;
}

.mui-table-view::after {
  height: 0;
}

.mui-table-view .mui-table-view-cell::after {
  height: 0;
}

.mui-table-view .mui-table-view-cell {
  padding: 0;
  border: 1px solid #ccc;
  margin-bottom: 6px;
  border-radius: 5px;
  background: -webkit-gradient(
    linear,
    55% 100%,
    55% 0%,
    from(#f1f1f1),
    to(#ffffff)
  );
  overflow: hidden;
}

.clientlist {
  text-align: left;
  margin: 0 12px;
  margin-top: 56px;
}
.clientlist .list-box {
  padding: 6px 0px 6px 20px;
  position: relative;
  box-shadow: 0 -1px 1px rgba(255, 255, 255, 1) inset;
}
.clientlist .list-box em {
  display: block;
  width: 8px;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}

.clientlist .list-box em.em-color1 {
  background-color: #678ce1;
}
.clientlist .list-box em.em-color2 {
  background-color: #14c760;
}
.clientlist .list-box em.em-color3 {
  background-color: #f3b613;
}
.clientlist .list-box p {
  color: #858585;
}
.clientlist .list-box p .title {
  display: block;
  color: #4a4a4a;
  margin-bottom: 6px;
  overflow: hidden;
  white-space: nowrap;
  font-size: 18px;
  text-overflow: ellipsis;
}
.clientlist .list-box p .title > i {
  color: #52ace5;
  font-size: 18px;
}
/* .clientlist .list-box p .lable-box {
  display: block;
  padding: 6px 0px;
} */
/* .list-box p .lable-box i {
  display: inline-block;
  padding: 1px 6px;
  font-size: 12px;
  opacity: 0.8;
  color: #fff;
} */
.list-box p .span-b {
  display: block;
  margin-bottom: 4px;
}
.list-box p .span-b .product {
  display: inline-block;
  width: 12em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-box p .span-b .name-clolor {
  color: #ffa977;
  font-size: 16px;
}
.list-box p .span-b .option-msg {
  font-style: italic;
}
.list-box p .lable {
  display: inline-block;
  padding: 1px 6px;
  font-size: 12px;
  opacity: 0.8;
  color: #fff;
}
.color1 {
  border: 1px solid #4db7ad;
  background-color: #4db7ad;
}
.color2 {
  border: 1px solid #52ace5;
  background-color: #52ace5;
}
.color3 {
  border: 1px solid #ffa977;
  background-color: #ffa977;
}
.color4 {
  border: 1px solid #5cb85c;
  background-color: #5cb85c;
}
.list-box p .user {
  display: inline-block;
  font-size: 13px;
}
.list-box p .user:nth-of-type(-n + 2) {
  margin-right: 12px;
}
.clientlist .no-list {
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  text-align: center;
  margin-top: 110px;
  font-size: 18px;
}
.clientlist .no-list .wait-icon {
  font-size: 23px;
  margin-right: 6px;
}
</style>

