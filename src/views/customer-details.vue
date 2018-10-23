<template>
  <div class="app-container">
    <!-- 头部 -->
    <header class="mui-bar mui-bar-nav">
			<a class="mui-icon mui-icon-left-nav mui-pull-left" v-tap="{methods:back}"></a>
			<h1 class="mui-title">客户详情</h1>
			<!-- <a class="mui-btn mui-btn-link mui-pull-right">新增</a> -->
			<a class="mui-btn mui-btn-link mui-pull-right" v-tap="{methods: toggelMenu}">操作</a>
	  </header>
    <mt-popup
      class="top-menu"
      v-model="topMenu"
      position="top">
      <ul class="mui-table-view menu-list">
        <li class="mui-table-view-cell" v-tap="{methods: openWv, href: 'customer-add',id: id}">编辑客户</li>
        <li class="mui-table-view-cell" v-tap="{methods: editContact, id: '-1', type: '-1'}">新增联系人</li>
        <li class="mui-table-view-cell" v-tap="{methods: openOrder,href:'order',id: id,type: '1'}">已购订单</li>
        <li class="mui-table-view-cell" v-tap="{methods: openOrder,href:'order',id: id,type: '3'}">消费记录</li>
        <li class="mui-table-view-cell" v-tap="{methods: openOrder,href:'order',id: id,type: '2'}">上课记录</li>
        <li class="mui-table-view-cell" v-tap="{methods: openOrder,href:'order',id: id,type: '4'}">未消费名额</li>
      </ul>
    </mt-popup>
    <!-- 2.0 客户卡片 -->
    <div class="detail-head" v-cloak>
		  <div class="cust-detalis-n" v-tap="{methods: openWv,href:'details-list',id: id, type: 3,cusno: -1}"  style="color:#52ace5;">
		  	<span>{{ info.SHOP_NAME === " " || info.SHOP_NAME === null ? "无" : info.SHOP_NAME }}</span><span>（ <i class="iconfont icon-guanzhukehu"></i> {{ info.CUST_NAME }} ）</span>
		  	<i class="el-icon-arrow-right fr" style="margin-top: 6px;"></i>
		  </div>
		  <div class="lable-group">
		  	<span>
          {{ info.SHOP_PROV === " " || info.SHOP_PROV === null ? '未选择省' : info.SHOP_PROV}}&nbsp;{{ info.SHOP_CITY ===" " || info.SHOP_CITY === null ? '未选择市' : info.SHOP_CITY }}&nbsp;{{ info.SHOP_AREA === " " || info.SHOP_AREA === null ? '未选择区' : info.SHOP_AREA}}
        </span>
        <p style="margin-top: 4px; margin-bottom: 6px;">
          <span style="display: inline-block; margin-right: 8px;">
            <i class="mui-icon mui-icon-phone" style="font-size: 18px;"></i>
            {{ info.PHONE_NUM === ' ' || info.PHONE_NUM === null ? '未填写' : info.PHONE_NUM}}
          </span>
        </p>
		  </div>
		  <!-- <p class="cust-desc">{{ info.followday }}</p> -->
	  </div>
    <!-- 3.0 操作选项 -->
	  <div class="contact-box">
      <!-- <i class="el-icon-arrow-right fr" style="margin-top: 14px;"></i> -->
      <div><span class="mui-icon-extra mui-icon-extra-peoples"></span> 负责人：{{ info.STAGE_NAME === " " || info.STAGE_NAME === null ? "无" : info.STAGE_NAME }}</div>
      <div><span class="mui-icon-extra mui-icon-extra-class"></span> {{cusType}}</div>
    </div>
    <!-- 4.0 跟进记录 -->
    <h3 class="record-title"><span class="iconfont icon-qianyuejilu"></span> 跟进记录</h3>
    <RecordList v-cloak :gridList="grid" :none="isNone"></RecordList>
    <div style="height: 58px; width: 100%;"></div>
    <!-- 5.0 联系人列表 -->
    <ul class="mui-table-view contact-list" :class="{'active': showMisk}">
		  <li class="mui-table-view-cell" v-for="(n,i) in plist" :key="i + Math.random()">
          <p style="display:inline-block" v-tap="{methods: editContact, type: n.LINK_TYPE,id: n.LINK_NO}"><span class="mui-icon mui-icon-person"></span> {{n.CUST_NAME}}&nbsp;{{n.PHONE_NUM1}}</p> 
          <a class="mui-icon mui-icon-phone fr" v-tap="{methods: call, number: n.PHONE_NUM1}"></a>
		  </li>
    </ul>
    <!-- 6.0 底部操作栏 -->
    <nav class="mui-bar mui-bar-tab" style="z-index: 18;">
	  	<div class="mui-tab-item" v-tap="{methods: openWv,href: 'record-add',type: '2',id: info.CUST_NO,name: info.SHOP_NAME,sid: info.SHOP_NO}">
	  		<span class="mui-icon iconfont icon-qianyuejilu tab-icon"></span>
	  		<span class="mui-tab-label">写跟进</span>
	  	</div>
	  	<div class="mui-tab-item" v-tap ="{methods: toggleMenu,type: 2}">
	  		<span class="mui-icon mui-icon-contact tab-icon"></span>
	  		<span class="mui-tab-label">联系人</span>
	  	</div>
	  </nav>
    <!-- 7.0 底部弹出 -->
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet" sheetClass="sheet-class ">
        <mu-list @itemClick="closeBottomSheet">
          <mu-sub-header>
            请选择一个
          </mu-sub-header>
          <mu-list-item v-for="(n,i) in sheetData" :key="i+n.ID" v-tap="{methods: choseType, id: n.id, text: n.PARAMS_NAME}" :title="n.PARAMS_NAME"/>
        </mu-list>
    </mu-bottom-sheet>
    <!-- 8.0 遮罩 -->
    <div class="mask" v-if="showMisk" v-tap ="{methods: toggleMenu,type: 2}"></div>
  </div>
</template>

<script>
import RecordList from "./record-list"; // 引入跟进列表
// mint-ui 消息提示
import { Toast } from "mint-ui";
export default {
  components: {
    RecordList: RecordList
  },
  data() {
    return {
      id: "",
      isShow: false,
      showMisk: false,
      bottomSheet: false, // 底部控制
      sheetData: [],
      info: {},
      grid: [],
      plist: [],
      isNone: false,
      cusType: "", //类型text
      cusTypeId: "", //类型id
      topMenu: false,
      hZindex: "" //顶部样式
    };
  },
  created() {
    // console.log(this.$route.params);
    this.id = this.$route.params.id;
    this.getData(this.id);
    this.getRecord(this.id);
    // this.getTypeList(); // 类型列表
  },
  methods: {
    msg() {
      Toast({
        message: "此功能暂未开放！",
        position: "middle",
        duration: 2000
      });
    },
    back() {
      this.$router.goBack();
    },
    openWv(params) {
      let urlType = params.type;

      let urlId = params.id;

      let urlName = params.name;

      let urlSid = params.sid;

      let cusNo = params.cusno;

      if (urlType === undefined) {
        urlType = "";
      } else {
        urlType = urlType === " " || urlType === null ? "/-1" : "/" + urlType;
      }

      if (urlId === undefined) {
        urlId = "";
      } else {
        urlId = urlId === " " || urlId === null ? "/-1" : "/" + urlId;
      }

      if (urlName === undefined) {
        urlName = "";
      } else {
        urlName = urlName === " " || urlName === null ? "/-1" : "/" + urlName;
      }

      if (urlSid === undefined) {
        urlSid = "";
      } else {
        urlSid = urlSid === " " || urlSid === null ? "/-1" : "/" + urlSid;
      }

      if (cusNo === undefined) {
        cusNo = "";
      } else {
        cusNo = cusNo === " " || cusNo === null ? "/-1" : "/" + cusNo;
      }

      let tohref = "/" + params.href + urlType + urlId + urlName + urlSid + ( params.type == 3 ? "/" + this.$store.state.uId : "") + cusNo;

      // 路由跳转
      this.$router.push(tohref);
    },
    openOrder(params){
      let tohref = "/" + params.href + "/" + params.type + "/" + params.id;
      // 路由跳转
      this.$router.push(tohref);
    },
    editContact(params) {
      // console.log(params.type)
      let tohref =
        "/contacts-add" + "/" + this.id + "/" + params.id + "/" + params.type;
      // 路由跳转
      this.$router.push(tohref);
    },
    toggelMenu() {
      this.topMenu = !this.topMenu;
    },
    getData(a = "") {
      let that = this;
      this.axios
        .get("/CustomerManage.ashx", {
          params: {
            Action: "MyCustDetail",
            CustNo: a
          }
        })
        .then(res => {
          // console.log(res.data);
          that.info = res.data;
          that.cusType =
            that.info.LABEL_NAME === " " || that.info.LABEL_NAME === null
              ? "无"
              : that.info.LABEL_NAME;
          that.getPhoneList();
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getRecord(b = "") {
      let that = this;
      let userId = this.$store.state.uId;
      // console.log(userId);
      this.axios
        .get("/LinkManage.ashx", {
          params: {
            Action: "CustFollowList",
            UserId: userId,
            CustNo: b
          }
        })
        .then(res => {
          // console.log(res.data);
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
    getTypeList() {
      this.axios
        .get("/ComboBoxData.ashx", {
          params: {
            Action: "SysCustLabelList" // 客户类型
          }
        })
        .then(res => {
          console.log(res.data);
          this.sheetData = res.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getPhoneList() {
      let that = this;
      this.axios
        .get("/LinkManage.ashx", {
          params: {
            Action: "CustLinkList",
            keyWord: "",
            CustNo: that.info.CUST_NO,
            ShopNo: that.info.SHOP_NO
          }
        })
        .then(res => {
          // console.log(res.data);
          that.plist = res.data;
          if (that.plist.length === 0) {
            that.plist = [
              {
                CUST_NAME: "暂无数据",
                PHONE_NUM1: ""
              }
            ];
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    call(params) {
      if (params.number === "" || params.number === null) {
        return;
      }
      window.location.href = `tel:${params.number}`;
    },
    toggleMenu(params) {
      if (params.type === 1) {
        this.isShow = !this.isShow;
      } else {
        // 如果菜单有展开先关闭，再呈现联系人列表
        this.isShow = false;
        this.showMisk = !this.showMisk;
      }
    },
    closeBottomSheet() {
      this.bottomSheet = false;
    },
    openBottomSheet() {
      this.bottomSheet = true;
    },
    choseType(params) {
      // console.log(params);
      //测试代码
      this.cusType = params.text;
      this.cusTypeId = params.id;
      this.closeBottomSheet();
      //发送请求，待服务器返回成功数据后更改页面显示
      return;
      this.axios
        .get("/CustomerManage.ashx", {
          params: {
            Action: ""
          }
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.type === 1) {
            Toast({
              message: "保存成功！",
              position: "middle",
              duration: 500
            });
            // 回退到前一个页面
            window.history.go(-1);
          }
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
  background-color: #efeff4;
}
.detail-head {
  padding: 0 15px;
  padding-top: 14px;
  text-align: left;
  background-color: #fff;
  position: relative;
  overflow: hidden;
}

.detail-head .cust-detalis-n {
  line-height: 28px;
  font-size: 14px;
}
.detail-head .cust-detalis-n > span {
  display: inline-block;
  max-width: 8em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* .detail-head .lable-group > span {
  display: inline-block;
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 2px;
  margin-right: 0.6em;
  color: #fff !important;
  opacity: 0.8;
} */

.detail-head .lable-group .lable {
  display: inline-block;
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 2px;
  margin-right: 0.4em;
  color: #fff !important;
  opacity: 0.8;
}

.detail-head .lable-group .lable1 {
  color: #4db7ad;
  background-color: #4db7ad;
}

.detail-head .lable-group .lable2 {
  color: #52ace5;
  background-color: #52ace5;
}

.detail-head .lable-group .lable3 {
  color: #ffa977;
  background-color: #ffa977;
}

.detail-head .lable-group .lable4 {
  color: #5cb85c;
  background-color: #5cb85c;
}

.detail-head .cust-desc {
  margin: 0;
  padding: 10px 0;
  color: #858585;
}

.cust-haddle {
  display: flex;
  border-top: 1px solid #ccc;
  padding: 0px 15px;
  background-color: #fff;
  text-align: left;
  font-size: 14px;
}

.cust-haddle > div {
  flex: 1;
  line-height: 42px;
}

.cust-haddle > div:nth-of-type(1) {
  padding-right: 6px;
}

.cust-haddle > div:nth-of-type(2) {
  padding-left: 15px;
  border-left: 1px solid #ccc;
}

.cust-haddle .left-icon {
  font-size: 18px;
  border-radius: 50%;
  padding: 4px;
  color: #fff;
  margin-right: 10px;
}

.cust-haddle .left-icon.icon-clolor1 {
  background-color: #f90;
}

.cust-haddle .left-icon.icon-clolor2 {
  background-color: #45acfd;
}
.fr {
  float: right;
}
.contact-box {
  display: flex;
  border-top: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 1px 6px #ccc;
}
.contact-box > div {
  flex: 1;
  line-height: 42px;
  font-size: 14px;
  text-align: left;
  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 6px;
}
.contact-box > div:nth-of-type(1) {
  border-right: 1px solid #ccc;
}
.contact-box div span {
  font-size: 12px;
  padding: 5px;
  border-radius: 50%;
  color: #fff;
  margin-right: 4px;
}
.contact-box div:nth-of-type(1) span {
  background-color: #f90;
}

.contact-box div:nth-of-type(2) span {
  background-color: #52ace5;
}
.contact-box div span:nth-last-child(1) {
  background-color: #52ace5;
}
.record-title {
  color: #858585;
  background-color: #fff;
  font-size: 15px;
  text-align: left;
  margin: 0;
  margin-top: 14px;
  line-height: 36px;
  text-indent: 16px;
  border-bottom: 1px solid #ccc;
}
.record-title .iconfont {
  font-size: 17px;
  margin-right: 2px;
}
.contact-list {
  width: 100%;
  position: fixed;
  left: 0px;
  /* bottom: 50px; */
  bottom: -280px;
  z-index: 14;
  height: 280px;
  overflow-y: auto;
  transition: all 0.4s;
}
.contact-list.active {
  bottom: 50px;
}
.contact-list .mui-table-view-cell {
  line-height: 42px;
  font-size: 14px;
  text-align: left;
  text-indent: 10px;
}
.app-container .contact-list .mui-table-view-cell::after {
  height: 1px;
}
.contact-list .mui-table-view-cell .mui-icon-person {
  font-weight: 600;
  color: #45acfd;
}
.contact-list .mui-table-view-cell .mui-icon-phone {
  padding: 6px;
  margin-top: 3px;
  margin-right: 4px;
  z-index: 32;
}
.menu-list {
  padding: 10px 0;
  border-radius: 6px;
}
.menu-list::before {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #fff;
  transform: none;
  background-color: transparent;
  top: -8px;
  left: auto;
  right: 8px;
}
.menu-list .mui-table-view-cell {
  padding: 0 10px;
  line-height: 36px;
}
.menu-list .mui-table-view-cell::after {
  height: 1px;
  left: 0;
}
</style>

