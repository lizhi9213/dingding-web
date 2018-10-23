<template>
    <div class="app-container">
			<header class="mui-bar mui-bar-nav">
				<a class="mui-icon mui-icon-left-nav mui-pull-left" v-tap="{methods: back}" v-if="this.uId != ''"></a>
				<h1 class="mui-title" v-cloak v-html="title"></h1>
				<!-- <a class="mui-btn mui-btn-link mui-pull-right" v-tap="{methods:submit}">保存</a> -->
			</header>
			<div class="head-card">
				<img class="photo fl" v-if="type != 2" :src="info.ATTACH_ADDR === '' || info.ATTACH_ADDR === null? '/static/img/logo.png' : info.ATTACH_ADDR" alt="">
				<img class="photo fl" v-if="type == 2" :src="info.CUST_ADDR === '' || info.CUST_ADDR === null? '/static/img/logo.png' : info.CUST_ADDR" alt="">
				<p class="fl head-msg" @click="linkCustDetail">
					<span style="font-size: 16px; display: inline-block; margin-bottom: 6px;">{{info.SHOP_NAME === "" || info.SHOP_NAME ===null ? '无店铺名称' : info.SHOP_NAME}}</span> <br> {{info.CUST_NAME === null || info.CUST_NAME === "" ? "无老板姓名" : info.CUST_NAME}}
				</p>
			</div>
			<ul class="mui-table-view detail-list">
				<li class="mui-table-view-cell" v-cloak>
					<i class="mui-icon mui-icon-contact color1"></i>客户编号：<span class="fr">{{info.CUST_NO === " " || info.CUST_NO === null ? "无" : info.CUST_NO}}</span>
		  	</li>
        <li class="mui-table-view-cell" v-cloak>
					<i class="mui-icon mui-icon-phone color5"></i>客户电话：<span class="fr">{{info.PHONE_NUM === " " || info.PHONE_NUM === null ? "无" : info.PHONE_NUM}}</span>
		  	</li>
				<li class="mui-table-view-cell" v-if="type === 3" v-cloak>
					<i class="mui-icon mui-icon-undo color2"></i>客户来源：<span class="fr">{{info.CUST_SOURCE === " " || info.CUST_SOURCE === null ? "无" : info.CUST_SOURCE}}</span>
		  	</li>
				<li class="mui-table-view-cell" v-if="type !== 2" v-cloak>
					<i class="mui-icon mui-icon-navigate color3"></i>客户类型：<span class="fr">{{info.LABEL_NAME === " " || info.LABEL_NAME === null ? "无" : info.LABEL_NAME}}</span>
		  	</li>
				<li class="mui-table-view-cell" v-cloak>
					<i class="mui-icon mui-icon-location color4"></i>店铺地址：
          <span class="fr">
            {{info.SHOP_PROV === " " || info.SHOP_PROV === null ? "未选择省" : info.SHOP_PROV}}&nbsp;
            {{info.SHOP_CITY === " " || info.SHOP_CITY === null ? "未选择市" : info.SHOP_CITY}}&nbsp;
            {{info.SHOP_AREA === " " || info.SHOP_AREA === null ? "未选择区" : info.SHOP_AREA}}
          </span>
		  	</li>
        <li class="mui-table-view-cell" v-cloak v-if="type === 3">
					<i class="mui-icon mui-icon-map color3"></i>详细地址：<span class="fr">{{ info.SHOP_ADDR === " " || info.SHOP_ADDR === null ? '无' : info.SHOP_ADDR}}</span>
		  	</li>
				<li class="mui-table-view-cell" v-if="type === 3" v-cloak>
					<i class="mui-icon mui-icon-flag  color5"></i>证件号码：<span class="fr">{{info.CERT_NO === " " || info.CERT_NO === null ? "无" : info.CERT_NO}}</span>
		  	</li>
				<li class="mui-table-view-cell" v-if="type === 3" v-cloak>
					<i class="mui-icon mui-icon-weixin color3"></i>微信：<span class="fr">{{info.WECHAT === " " || info.WECHAT === null ? "无" : info.WECHAT}}</span>
		  	</li>
				<!-- <li class="mui-table-view-cell" v-cloak v-if="type === 1">
					<i class="mui-icon mui-icon-paperplane color5"></i>客户类型：<span class="fr">{{ info.LABEL_NAME === " " || info.LABEL_NAME === null ? '无' : info.LABEL_NAME}}</span>
		  	</li> -->
        <li class="mui-table-view-cell" v-cloak v-if="type === 2">
					<i class="mui-icon mui-icon-flag color3"></i>跟进方式：<span class="fr">{{info.DAIL_SOURCE === " " || info.DAIL_SOURCE === null? "无" : (info.DAIL_SOURCE == '1' ? '电话' : '微信')}}</span>
		  	</li>
        <li class="mui-table-view-cell" v-cloak v-if="type === 2">
					<i class="mui-icon mui-icon-paperplane color4"></i>跟进时间：<span class="fr">{{info.DAIL_TIME === " " || info.DAIL_TIME === null? "无" : info.DAIL_TIME}}</span>
		  	</li>
        <li class="mui-table-view-cell" v-cloak>
					<i class="mui-icon mui-icon-star color2"></i>归属负责人：<span class="fr">{{info.STAGE_NAME === " " || info.STAGE_NAME === null? "无" : info.STAGE_NAME}}</span>
		  	</li>
        <li class="mui-table-view-cell" v-if="type === 3" v-cloak>
					<i class="mui-icon mui-icon-paperplane color1"></i>最后一次联系时间：<span class="fr">{{info.LAST_TIME === " " || info.LAST_TIME === null? "无" : info.LAST_TIME}}</span>
		  	</li>
        <!-- <li class="mui-table-view-cell" v-cloak v-if="type === 2">
					<i class="mui-icon mui-icon-chatboxes color5"></i>备注描述：
          <pre v-cloak style="text-indent: 2em; padding-left: 28px;">{{info.REMARK === "" || info.REMARK === null ? '无' : info.REMARK}}</pre>
		  	</li> -->
        <li class="mui-table-view-cell" v-cloak v-if="type === 2">
					<i class="mui-icon mui-icon-chatboxes color5"></i>沟通结果：
          <pre v-cloak style="text-indent: 2em; padding-left: 28px;">{{info.REMARK === "" || info.REMARK === null ? '无' : info.REMARK}}</pre>
		  	</li>
        <li class="mui-table-view-cell imglist-container" v-cloak v-if="type === 2">
          <mu-grid-list class="img-list">
            <mu-sub-header>微信聊天截图</mu-sub-header>
            <mu-grid-tile v-if="list.length !== 0" v-for="(n, i) in list" titleBarClass="no-Bgc" :key="i+12">
            <img :src="n.ATTACH_ADDR" v-tap="{methods:toggleImg,vurl: n.ATTACH_ADDR}"/>
            </mu-grid-tile>
          </mu-grid-list>
          <p v-if="list.length === 0">暂无图片</p>
        </li>
			</ul>
      <ml-i-view v-model="imgShow" :url="imgUrl" :scale="4"></ml-i-view>
    </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
      id: "",
      uId: "",
      type: "",
      list: [],
      imgUrl: "",
      imgShow: false,
      title: "客户详情列表"
    };
  },
  created() {
    // console.log(this.$route.params);
    let cusNo = this.$route.params.cusno;
    this.id = this.$route.params.id;
    this.uId = this.$route.params.uid;
    this.type = parseInt(this.$route.params.type);
    if (this.type === 1 || this.type === 3) {
      this.getDetails(this.id);
    } else if (this.type === 2) {
      this.getRecordDetail(this.id, cusNo);
      this.getImgList(this.id);
      this.title = "跟进记录详情";
    }
  },
  methods: {
    toggleImg(params) {
      console.log(params.vurl);
      this.imgShow = !this.imgShow;
      if (this.imgShow) {
        this.imgUrl = params.vurl;
      } else {
        this.imgUrl = "";
      }
    },
    back() {
      this.$router.goBack();
    },
    linkCustDetail() {
      if (this.type == 2) {
        let cusId = this.info.CUST_NO;
        let hrefto = "/customer-details" + (cusId ? "/" + cusId : "");
        this.$router.push(hrefto);
      }
    },
    getDetails(a = "") {
      let that = this;
      let data = {};
      if (this.type == 1) {
        data.Action = "CustPoolDetail"; // 客户池详情
        data.CustNo = a;
      } else if (this.type == 3) {
        data.Action = "MyCustDetail"; // 我的客户详情
        data.CustNo = a;
      }
      this.axios
        .get("/CustomerManage.ashx", {
          params: data
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
            return;
          }
          if (res.data === {}) {
            Toast({
              message: "数据获取异常！",
              position: "middle",
              duration: 2000
            });
            return;
          }
          // 处理数据
          that.info = res.data;
          // console.log(that.info.ATTACH_ADDR)
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getRecordDetail(a = "", b = "") {
      let that = this;
      this.axios
        .get("/LinkManage.ashx", {
          params: {
            Action: "CustFollowDetail",
            RecordId: a,
            UserId: this.uId,
            CustNo: b
          }
        })
        .then(res => {
          console.log(res.data);
          that.info = res.data;
          // console.log(that.info.ATTACH_ADDR)
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getImgList(a = "") {
      let that = this;
      this.axios
        .get("/LinkManage.ashx", {
          params: {
            Action: "GetCustDailPic",
            RecordId: a,
            UserId: this.uId
          }
        })
        .then(res => {
          console.log(res.data);
          if (res.data.length > 0) {
            that.list = res.data;
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
  overflow: hidden;
  background-color: #efeff4;
  padding-bottom: 20px;
  overflow-y: auto;
}
.head-card {
  box-shadow: 0 1px 6px #ccc;
  height: 86px;
  margin-top: 12px;
  background-image: url(/static/img/detail-head.jpg);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  margin-bottom: 14px;
}
.head-card .photo {
  width: 50px;
  height: 50px;
  background-color: #fff;
  border: 2px solid #fff;
  border-radius: 50%;
  margin-left: 18px;
  margin-top: 12px;
}
.head-msg {
  color: #fff;
  margin: 0;
  margin-top: 18px;
  margin-left: 14px;
  text-align: left;
  font-size: 12px;
}
.detail-list .mui-table-view-cell::after {
  height: 1px;
}
.detail-list .mui-table-view-cell {
  text-align: left;
  padding: 0 16px;
  padding-right: 20px;
  line-height: 42px;
}
.detail-list .mui-table-view-cell:nth-last-child(1)::after {
  height: 0;
}
.detail-list .mui-table-view-cell i {
  margin-right: 6px;
}
.color1 {
  color: #52ace5;
}
.color2 {
  color: #ff7f8a;
}
.color3 {
  color: #4db7ad;
}
.color4 {
  color: #ffa977;
}
.color5 {
  color: #8c67df;
}
.detail-list .mui-table-view-cell.imglist-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding-bottom: 20px;
}
.img-list {
  width: 100%;
}
</style>

