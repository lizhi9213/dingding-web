<template>
  <div class="record-box">
    <!-- 客户列表 -->
    <ul class="mui-table-view record-list">
		  <li class="mui-table-view-cell"  v-for="(n,i) in gridList" :key="i + Math.random()">
		  	<div class="list-box" v-tap="{methods: openWv, href: 'details-list', type: 2, id: n.RECORD_ID,cusno: n.CUST_NO}">
          <h4 class="title"> {{n.SHOP_NAME === " " || n.SHOP_NAME === null ? '无店铺名称' : n.SHOP_NAME}}</h4>
          <div class="list-body">
              <i class="iconfont fl" :class="{'icon-dianhua': n.DAIL_SOURCE == 8, 'icon-gongzhonghao': n.DAIL_SOURCE == 6, 'icon-pingjuchaxun': n.DAIL_SOURCE != 6 && n.DAIL_SOURCE != 8}"></i> 
              <p class="fl">
                 <span style="display:block;margin-bottom: 4px;">跟进方式：{{n.DAIL_SOURCE == 8 ? '电话' : (n.DAIL_SOURCE == 6 ? '微信' : '未选择')}}</span>
                 <span style="display:block;margin-bottom: 4px;">客户：{{n.CUST_NAME === " " || n.CUST_NAME === null ? '无客户名称' : n.CUST_NAME}}</span>
                 <span style="display:block;">时间：{{n.DAIL_TIME === " " || n.DAIL_TIME === null ? '未填写' : n.DAIL_TIME}}</span>
              </p>
              <pre class="fl" style="width:100%; margin-top: 10px; margin-bottom: 12px; padding: 6px;">{{n.REMARK === " " || n.REMARK === null ? '未填写' : n.REMARK}}</pre>
          </div>        	
		  	</div>
		  </li>
			<li class="mui-table-view-cell no-list" v-cloak v-if="grid.length == 0">
				<span class="tips-icon" :class="{'el-icon-loading': !isNone,'icon-pingjuchaxun': isNone,'iconfont': isNone}"></span> <span v-html="isNone ? '暂无数据' : '拼命加载中...'"></span>
			</li>
		</ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      grid: [],
      isNone: false
    };
  },
  props: ["gridList", "none"],
  created() {
    console.log(this.gridList)
  },
  methods: {
    openWv(params) {
      let urlType = params.type;
      if (urlType === undefined) {
        urlType = ""
      }else {
        urlType = urlType === " " || urlType === null ? "/-1" : ("/" + urlType);
      }

      let urlId = params.id;
      if (urlId === undefined) {
        urlId = ""
      }else {
        urlId = urlId === " " || urlId === null ? "/-1" : ("/" + urlId);
      }

      let cusNo = params.cusno;
      if (cusNo === undefined) {
        cusNo = "";
      } else {
        cusNo = cusNo === " " || cusNo === null ? "/-1" : "/" + cusNo;
      }


      var tohref = "/" + params.href + urlType + urlId + "/" + this.$store.state.uId + cusNo;
      this.$router.push(tohref);
    }
  },
  watch: {
    gridList(e) {
      if(e.length != 0) {
        this.grid = e;
      }
    },
    none(e) {
      this.isNone = e;
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

.record-list {
  text-align: left;
  margin: 0 12px;
  margin-top: 10px;
  background-color: transparent;
}
.record-list .list-box {
  padding: 6px 30px 6px 12px;
  position: relative;
  box-shadow: 0 -1px 1px rgba(255, 255, 255, 1) inset;
}
.record-list .list-box .list-body {
  color: #858585;
  padding-top: 28px;
  overflow: hidden;
}
.record-list .list-box .list-body i {
  padding: 6px 12px;
  background-color: #f90;
  color: #fff;
  border-radius: 6px;
  margin-right: 10px;
  font-size: 32px;
  margin-top: 2px;
}
.record-list .list-box .title {
  margin: 0;
  padding: 0;
  width: 100%;
  color: #4a4a4a;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
  padding: 6px 0;
  font-weight: normal;
  font-size: 15px;
  top: 0;
  left: 0;
  background-color: rgba(54, 161, 219, 0.6);
  color: #fff;
  text-indent: 16px;
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
.record-list .no-list {
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  text-align: center;
  margin-top: 60px;
  font-size: 18px;
}
.record-list .no-list .tips-icon {
  font-size: 26px;
}
</style>

