<template>
  <div class="app-container" v-scroll="onScroll">
    <!-- 头部栏 -->
    <header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-left-nav mui-pull-left" v-if="showBack" v-tap="{methods:back}"></a>
			<h1 class="mui-title">我的客户</h1>
			<a class="mui-btn mui-btn-link mui-pull-right" v-tap="{methods: openWv, href: 'customer-add', id: '-1'}">新增</a>
	  </header>
     <TopFilter :ftype="1" :sortType="-1" v-on:getfilter="custFilter" @on-search="seachFocus"></TopFilter>
    <!-- 客户列表 -->
     <ul class="cus-list">
       <li class="list-item" v-show="!isSearch && grid.length !== 0" v-for="(n,i) in grid" :key="i+2.651">
        <div class="list-item-left" v-tap="{methods: openWv, href: 'customer-details',id: n.CUST_NO}">
            <div class="img-box">
              <img :src="n.ATTACH_ADDR === '' || n.ATTACH_ADDR === null ? '/static/img/logo.png' : n.ATTACH_ADDR" alt="">
            </div>
        </div>
        <div class="list-item-content" v-tap="{methods: openWv, href: 'customer-details',id: n.CUST_NO}">
          <p class="content-title">{{ n.SHOP_NAME === "" ||  n.SHOP_NAME === null ? "无" : n.SHOP_NAME}}<i class="lable" :class="colorCase(n.LABEL_ID)">{{ n.LABEL_NAME === ' ' || n.LABEL_NAME === null ? '未填写' : n.LABEL_NAME}}</i></p>
          <p class="content-item shop"><span class="iconfont icon-guanzhukehu"></span>{{ n.CUST_NAME === "" || n.CUST_NAME === null ? "无" : n.CUST_NAME }} （ {{ n.STAGE_NAME === " " || n.STAGE_NAME === null ? "无人" : n.STAGE_NAME }}负责 ）</p>
          <p class="content-item addr">
            <span class="iconfont icon-iconfontdizhi"></span>
            {{ n.SHOP_PROV === " " || n.SHOP_PROV === null || n.SHOP_PROV === "" ? '未选省' : n.SHOP_PROV}}&nbsp;
            {{ n.SHOP_CITY === " " || n.SHOP_CITY === null || n.SHOP_CITY === "" ? '未选市' : n.SHOP_CITY }}&nbsp;
            {{ n.SHOP_AREA === " " || n.SHOP_AREA === null || n.SHOP_AREA === "" ? '未选区' : n.SHOP_AREA}}
          </p>
          <p class="content-item user"><span class="el-icon-star-off"></span>{{ n.CUST_NO === " " || n.CUST_NO === null ? "无" : n.CUST_NO }}</p>
          <!-- <p class="content-item user"><span class="iconfont icon-user"></span>{{ n.STAGE_NAME === " " || n.STAGE_NAME === null ? "无人" : n.STAGE_NAME }}负责</p> -->
        </div>
        <div class="list-item-right" v-tap="{methods: call, number: n.PHONE_NUM}">
          <i class="iconfont icon-dianhua"></i>
        </div>
       </li>
       <li class="no-list" v-cloak v-if="grid.length == 0 && !isSearch">
         <i class="" :class="{'el-icon-loading': !isNone,'icon-kehuchaxun': isNone, 'iconfont': isNone }"></i> <span style="font-size: 18px;" v-html="isNone ? '暂无数据' : '拼命加载中...'"></span>
			 </li>
			 <li class="no-list" v-cloak v-show="isSearch">
				 <span class="iconfont icon-pingjuchaxun"></span>
         <p>说明：</p>
         <p>1、输入名称越详细，越利于查询；</p>
         <p>2、输入框可以输入客户姓名、店铺名字、手机号码，来查询客户总池的信息；</p>
         <p>3、默认显示10条查重记录，如不详细，请完善查重条件。</p>
			 </li>
     </ul>
    <!-- <ul class="mui-table-view clientlist">
		  <li v-show="!isSearch && grid.length !== 0" class="mui-table-view-cell" v-tap="{methods: openWv, href: 'customer-details',id: n.CUST_NO}" v-for="(n,i) in grid" :key="i+2.331">
		  	<div class="list-box">
		  		<em></em>
              	<p>
              	    <span v-cloak class="title"> {{ n.SHOP_NAME === "" ||  n.SHOP_NAME === null ? "无" : n.SHOP_NAME}} （ <i class="iconfont icon-guanzhukehu"></i> {{ n.CUST_NAME === "" || n.CUST_NAME === null ? "无" : n.CUST_NAME }} ）</span>
                    <span v-cloak style="display: block;margin-bottom: 4px;">所在地：{{ n.SHOP_PROV === " " || n.SHOP_PROV === null ? '未选择省' : n.SHOP_PROV}}&nbsp;{{ n.SHOP_CITY === " " || n.SHOP_CITY === null ? '未选择市' : n.SHOP_CITY }}&nbsp;{{ n.SHOP_AREA === " " || n.SHOP_AREA === null ? '未选择区' : n.SHOP_AREA}}</span>
                    <i v-cloak class="user">负责人：{{ n.STAGE_NAME === " " || n.STAGE_NAME === null ? "无" : n.STAGE_NAME }}</i>
                     类型：<i v-cloak class="lable" :class="colorCase(n.LABEL_ID)">{{ n.LABEL_NAME === ' ' || n.LABEL_NAME === null ? '未填写' : n.LABEL_NAME}}</i>
              	</p>
		  	</div>
		  </li>
			<li class="mui-table-view-cell no-list" v-cloak v-if="grid.length == 0 && !isSearch">
        <i class="" :class="{'el-icon-loading': !isNone,'icon-kehuchaxun': isNone, 'iconfont': isNone }"></i> <span style="font-size: 18px;" v-html="isNone ? '暂无数据' : '拼命加载中...'"></span>
			</li>
			<li class="mui-table-view-cell no-list" v-cloak v-show="isSearch">
				<span class="iconfont icon-pingjuchaxun"></span>
        <p>说明：</p>
        <p>1、输入名称越详细，越利于查询；</p>
        <p>2、输入框可以输入客户姓名、店铺名字、手机号码，来查询客户总池的信息；</p>
        <p>3、默认显示10条查重记录，如不详细，请完善查重条件。</p>
			</li>
		</ul> -->
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import TopFilter from "./filter"; // 顶部筛选
export default {
  components: {
    TopFilter: TopFilter
  },
  data() {
    return {
      isSearch: false,
      keyWord: "", // 搜索框关键字
      typeId: "", // 类型
      sortId: -1, // 排序
      showClea: false, //清除按钮
      grid: [],
      isNone: false,
      showBack: true
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    call(params) {
      if (params.number === "" || params.number === null) {
        return;
      }
      window.location.href = `tel:${params.number}`;
    },
    back() {
      this.$router.goBack();
    },
    openWv(params) {
      var hrefto = "/" + params.href + (params.id ? "/" + params.id : "");
      this.$router.push(hrefto);
    },
    seachFocus(a) {
      console.log(a);
      this.showBack = !a;
    },
    getList() {
      let that = this;
      let Sort = this.sortId;
      let CustType = this.typeId;
      let keyWord = this.keyWord;
      this.axios
        .get("/CustomerManage.ashx", {
          params: {
            Action: "MyCustList",
            keyWord: keyWord,
            // UserId: that.$store.state.uId,
            UserId: that.$store.state.uId,
            CustType: CustType,
            Sort: Sort
          }
        })
        .then(res => {
          document.activeElement.blur();
          // console.log(res.data);
          if (res.data.type && res.data.type !== 1) {
            Toast({
              message: res.data.message + " 请联系管理员",
              position: "middle",
              duration: 2000
            });
            that.grid = [];
            setTimeout(function() {
              that.sortId = "";
              that.typeId = "";
              that.keyWord = "";
              that.isNone = false;
              that.getList();
            }, 1000);
            return;
          }

          that.isNone = false;
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
    colorCase(a) {
      switch (parseInt(a)) {
        case 8:
          // 单品客户
          return "color1";
          break;
        case 9:
          // 课包客户
          return "color2";
          break;
        case 20:
          // 书籍客户
          return "color3";
          break;
        case 21:
          // 其他客户
          return "color4";
          break;
        case 19:
          // 预见客户
          return "color5";
          break;
        case 22:
          // 异业客户
          return "color6";
          break;
        default:
          // 未选择
          return "color7";
      }
    },
    startSearch() {
      this.isSearch = true;
    },
    endSearch() {
      this.isSearch = false;
    },
    cleanInput() {
      this.keyWord = "";
      this.isSearch = false;
    },
    searchBtn() {
      // this.keyWord = "";
      this.grid = [];
      this.isNone = false;
      let keyWord = this.keyWord;
      this.getList(keyWord);
    },
    custFilter: function(data) {
      // 接收子组件fileter传过来到值
      //alert('接收成功！请在控制台查看接收到到数据')
      // console.log(data);
      if (data.type == "1") {
        // 客户类型
        this.typeId = data.typeId;
        this.getList();
      } else if (data.type == "2") {
        // 排序
        if (data.sortId == 0) {
          this.sortId = -1;
          this.getList();
        } else {
          this.sortId = data.sortId;
          this.getList();
        }
      } else if (data.type == "3") {
        // 关键字查询
        this.keyWord = data.keyWord;
        this.getList();
      }
    },
    onScroll(a, b) {
      //console.log(a)
      console.log(b);
    }
  },
  watch: {
    keyWord(e) {
      // console.log(e)
      if (e === "") {
        this.showClea = false;
      } else {
        this.showClea = true;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss"  scoped>
.app-container {
  background-color: #efeff4;
  height: 100%;
  padding-bottom: 16px;
  overflow: hidden;
  overflow-y: auto;
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
.app-container .mui-search i {
  position: absolute;
  top: 2px;
  right: 76px;
  padding: 6px;
  font-size: 18px;
  z-index: 6;
}
/* 列表 */
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
.color5 {
  border: 1px solid #f3b613;
  background-color: #f3b613;
}
.color6 {
  border: 1px solid #8c67df;
  background-color: #8c67df;
}
.color7 {
  border: 1px solid #909399;
  background-color: #909399;
}
.cus-list .no-list {
  margin: 0px;
  padding: 0px;
  border: none;
  box-shadow: none;
  border-radius: 0;
  background: transparent;
  width: 80%;
  margin: 0 auto;
  margin-top: 80px;
  color: #adadad;
  text-align: center;
}
.cus-list .no-list > .iconfont {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}
.cus-list .no-list > .iconfont.icon-kehuchaxun {
  display: inline-block;
  font-size: 32px;
  margin-right: 6px;
}
.cus-list .no-list > p {
  text-align: left;
  color: #adadad;
}
.cus-list .no-list .el-icon-loading {
  font-size: 32px;
  vertical-align: bottom;
}
.cus-list {
  margin-top: 56px;
}
.cus-list .list-item {
  min-height: 56px;
  padding: 14px 0;
  padding-right: 56px;
  padding-left: 72px;
  position: relative;
  overflow: hidden;
  background-color: #fff;
}
.cus-list .list-item::after {
  content: "";
  position: absolute;
  background-color: #ccc;
  height: 1px;
  width: 100%;
  bottom: 0px;
  left: 72px;
}
.cus-list .list-item:nth-last-child(-n + 2)::after {
  height: 0;
}
.cus-list .list-item .list-item-left {
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  width: 40px;
  height: 100%;
  position: absolute;
  color: #757575;
  top: 0;
  left: 15px;
}
.cus-list .list-item .list-item-left .img-box {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.cus-list .list-item .list-item-left .img-box img {
  display: block;
  width: 100%;
  height: 100%;
}
.cus-list .list-item .list-item-content {
  text-align: left;
}
.cus-list .list-item .list-item-content p {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cus-list .list-item .list-item-content .content-title {
  font-size: 16px;
  margin-bottom: 6px;
}
.cus-list .list-item .list-item-content .content-title .lable {
  display: inline-block;
  padding: 1px 6px;
  font-size: 12px;
  opacity: 0.8;
  color: #fff;
  margin-left: 6px;
}
.cus-list .list-item .list-item-content .content-item {
  color: #858585;
  margin-bottom: 4px;
}
.cus-list .list-item .list-item-content .content-item .iconfont {
  vertical-align: bottom;
  margin-right: 6px;
}
.cus-list .list-item .list-item-content .content-item.shop {
  color: #2196f3;
}
.cus-list .list-item .list-item-content .content-item.shop .iconfont {
  margin-right: 11px;
}
.cus-list .list-item .list-item-content .content-item.addr .iconfont {
  color: #2196f3;
}
.cus-list .list-item .list-item-content .content-item.user .el-icon-star-off {
  color: #2196f3;
  font-size: 16px;
  margin-right: 12px;
}
.cus-list .list-item .list-item-right {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 56px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 6;
}
.cus-list .list-item .list-item-right .iconfont {
  font-size: 22px;
}
</style>

