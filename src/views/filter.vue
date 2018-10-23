<template>
	<div class="topfilter">
        <ul class="layui-row filter-ul" v-if = "ftype == 1">
            <li class="layui-col-xs4 layui-col-sm4" v-tap="{methods:searchBox}" v-if="!showSearch"><i class="el-icon-search" style="color:#888;margin-right: 4px;"></i><span class="search-text">搜索</span></li>
            <li class="layui-col-xs4 layui-col-sm4" v-tap="{methods:show}" v-if="!showSearch">筛选
                <span v-bind:class="{'triangle-up':show2,'triangle-down':!show2}"></span>
            </li>
            <li class="layui-col-xs4 layui-col-sm4" v-tap="{methods:show1}"  v-if="!showSearch">排序
                <span v-bind:class="{'triangle-up':show3,'triangle-down':!show3}"></span>
            </li>
        </ul>
        <ul class="layui-row filter-ul" v-if = "ftype == 2">
            <li class="layui-col-xs4 layui-col-sm4" v-tap="{methods:searchBox}" v-if="!showSearch"><i class="el-icon-search" style="color:#888;margin-right: 4px;"></i><span class="search-text">搜索</span></li>
             <li class="layui-col-xs4 layui-col-sm4" v-tap="{methods:show}" v-if="!showSearch">筛选
                <span v-bind:class="{'triangle-up':show2,'triangle-down':!show2}"></span>
            </li>
            <li class="layui-col-xs4 layui-col-sm4" v-tap="{methods:show1}"  v-if="!showSearch">范围
                <span v-bind:class="{'triangle-up':show3,'triangle-down':!show3}"></span>
            </li>
        </ul>
        <ul class="layui-row filter-ul" v-if = "ftype == 3">
            <li class="layui-col-xs6 layui-col-sm6" v-tap="{methods:searchBox}" v-if="!showSearch"><i class="el-icon-search" style="color:#888;margin-right: 4px;"></i><span class="search-text">搜索</span></li>
            <li class="layui-col-xs6 layui-col-sm6" v-tap="{methods:show1}"  v-if="!showSearch">排序
                <span v-bind:class="{'triangle-up':show3,'triangle-down':!show3}"></span>
            </li>
        </ul>
        <ul class="layui-row filter-ul">
            <li class="layui-col-xs12 layui-col-sm12 search-box"  v-if="showSearch">
               <i class="el-icon-back back-icon" v-tap="{methods:searchBox}" style="color:#888;"></i>
               <input type="text" v-if="sortType == -1" class="search-input" placeholder="请输入查询条件" v-model="wordValue">
               <input type="text" v-if="sortType != -1" class="search-input" :placeholder="holderMsg" v-model="wordValue">
               <i class="el-icon-circle-close" v-if="showClea" v-tap="{methods: cleanInput}"></i>
               <button type="button" class="mui-btn mui-btn-primary search-button" v-tap="{methods:confirmTap,type:3}">搜索</button>
            </li>
        </ul>
        <ul class="layui-row filter-ul" v-if="false">
           <li class="layui-col-xs6 layui-col-sm6" v-tap="{methods:show}">全公司
                <span v-bind:class="{'triangle-up':show2,'triangle-down':!show2}"></span>
            </li>
            <li class="layui-col-xs6 layui-col-sm6" v-tap="{methods:show1}">本月
                <span v-bind:class="{'triangle-up':show3,'triangle-down':!show3}"></span>
            </li>
        </ul>
        <div class="parent-shade" v-if="isActive" v-tap="{methods:closeFilter}"></div>
        <div class="trans-parent">
            <transition name="el-zoom-in-top">
                <div v-show="show2" class="transition-box filter_body">
                  <ul class="mui-table-view filter-sort">
                    <li class="mui-table-view-cell" v-for="(item, index) in typeList" :key="index + Math.random()+142" v-tap="{methods:confirmTap,type:1,index:item.ID}" v-html="item.PARAMS_NAME"></li>
                  </ul>
                </div>
            </transition>
            <transition name="el-zoom-in-top">
                <div v-show="show3" class="transition-box filter_body">
                  <div class="filter-rows" v-if="ftype === 2">
                    <ul class="mui-table-view filter-top-left">
                      <li class="mui-table-view-cell isType2"><span class="lable">开始时间：</span><mu-date-picker container="inline" v-model="startDate" :maxDate="endDate" underlineClass="noline" hintText="请选择开始时间" fullWidth/> <br/></li>
                      <li class="mui-table-view-cell isType2"><span class="lable">结束时间：</span><mu-date-picker container="inline" v-model="endDate" :minDate="startDate"  underlineClass="noline" hintText="请选择结束时间" fullWidth/> <br/></li>
                    </ul>
                  </div>
                  <div class="hadle-buttons" v-if="ftype == 2">
                    <div><el-button v-tap="{methods:clearCheck}" type="info" size="mini" plain>清空</el-button></div>
                    <div><el-button type="primary" v-tap="{methods:confirmTap,type:2}" size="mini">确定</el-button></div>
                  </div>
                  <ul class="mui-table-view filter-sort" v-if="ftype == 1">
                    <li class="mui-table-view-cell" v-for="(item, index) in sortList" :key="index + Math.random()+142" v-tap="{methods:confirmTap,type:2,index:index}" v-html="item"></li>
                  </ul>
                  <ul class="mui-table-view filter-sort" v-if="ftype == 3">
                    <li class="mui-table-view-cell" v-if="sortType == 1" v-tap="{methods:confirmTap,type:2,index:1}">产品名称</li>
                    <li class="mui-table-view-cell" v-if="sortType == 1" v-tap="{methods:confirmTap,type:2,index:2}">订单总额</li>
                    <li class="mui-table-view-cell" v-if="sortType != 1" v-tap="{methods:confirmTap,type:2,index:1}">班级排序</li>
                    <li class="mui-table-view-cell" v-if="sortType != 1 &&  sortType != 4" v-tap="{methods:confirmTap,type:2,index:2}">产品名称</li>
                    <li class="mui-table-view-cell" v-if="sortType == 4" v-tap="{methods:confirmTap,type:2,index:2}">剩余名额</li>
                  </ul>
                </div>
            </transition>
        </div>
        <P class="botton-line"></P>
    </div>
</template>
	
<script>
import { Toast } from "mint-ui";
export default {
  data: function() {
    return {
      show2: false,
      show3: false,
      isActive: false,
      showSearch: false,
      holderMsg: "可输入订单编号或者课程名称来查询",
      sortList: ["默认", "最近添加", "更新时间", "跟进时间"], // 排序
      typeList: [], // 类型筛选
      wordValue: "", // 搜索框关键字
      startDate: "", // 开始时间
      endDate: "", // 结束时间
      showClea: false // 清除显示
    };
  },
  props: ["ftype","sortType"], // 作用是用来接收父组件传入过来的id值
  created() {
    if(this.sortType == 1) {
      this.holderMsg = "可搜索订单编号或产品名称查询";
    }else if (this.sortType == 4){
      this.holderMsg = "订单编号、订单状态、产品名称、班级"
    } else {
      this.holderMsg = "可搜索学员姓名或产品名称查询";
    }
    this.getTypeList();
  },
  methods: {
    show() {
      if (this.show3 === true) {
        this.show1();
      }
      this.show2 = !this.show2;
      this.isActive = this.show2;
    },
    show1() {
      if (this.show2 === true) {
        this.show();
      }
      this.show3 = !this.show3;
      this.isActive = this.show3;
    },
    closeFilter() {
      if (this.show2 === true) {
        this.show();
      }
      if (this.show3 === true) {
        this.show1();
      }
    },
    searchBox() {
      document.activeElement.blur()
      // 搜索框处理函数
      if (this.show2 === true) {
        this.show();
      }
      if (this.show3 === true) {
        this.show1();
      }
      this.showSearch = !this.showSearch;
      this.$emit("on-search", this.showSearch);

    },
    clearCheck() {
      // 清空选择
      this.startDate = ""; // 开始时间
      this.endDate = ""; // 结束时间
    },
    cleanInput() {
      // 清空input框
      this.wordValue = "";
    },
    confirmTap(params) {
      // 把选中到 Id 值传给父组件,这里用每个index来代替
      let data = {};
      if (params.type === 1) {
        data.type = 1;
        data.typeId = params.index;
      } else if (params.type === 2 && this.ftype === 2) {
        data.type = 2;
        data.sDate = this.startDate;
        data.eDate = this.endDate;
      } else if (params.type === 2) {
        data.type = 2;
        data.sortId = params.index;
      } else {
        data.type = 3;
        data.keyWord = this.wordValue;
      }
      //console.log(data)
      this.$emit("getfilter", data);
      // 关闭当前到筛选下拉
      this.closeFilter();
    },
    getTypeList() {
      // 类型选择列表读取
      this.axios
        .get("/ComboBoxData.ashx", {
          params: {
            Action: "SysCustLabelList" // 客户类型
          }
        })
        .then(res => {
          // console.log(res.data);
          this.typeList = res.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  },
  watch: {
    wordValue(e) {
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

<style rel="stylesheet/scss" scoped>
.topfilter {
  position: fixed;
  top: 44px;
  left: 0;
  width: 100%;
  z-index: 99;
}

.trans-parent {
  position: relative;
}

.parent-shade {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(232, 232, 232, 0.6);
  z-index: 18;
  margin-top: 88px;
}

.trans-parent .transition-box {
  padding: 8px;
  padding-top: 0;
  padding-right: 0;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 36;
  background-color: #fff;
  border-top: 1px solid #ccc;
}

.triangle-down {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #888;
  position: relative;
  top: 12px;
  left: 4px;
}

.triangle-up {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #888;
  position: relative;
  top: -12px;
  left: 4px;
}

.filter-ul {
  padding: 0;
  margin: 0;
  z-index: 20;
}

.filter-ul li {
  text-align: center;
  background-color: #fff;
  line-height: 48px;
}
.botton-line {
  width: 100%;
  height: 1px;
  background-color: rgba(174, 174, 174, 0.5);
}
.search-icon {
  vertical-align: middle;
  margin-right: 4px;
}
.search-text {
  vertical-align: middle;
}
.search-box {
  position: relative;
  padding: 0 70px 0 40px;
}
.search-box .search-input {
  margin-bottom: 0;
  padding: 4px 15px;
  height: 34px;
}
.search-box .back-icon {
  position: absolute;
  top: 14px;
  left: 12px;
}
.search-box .search-button {
  position: absolute;
  top: 7px;
  right: 8px;
}
.filter_body {
  display: flex;
  flex-direction: column;
}
.filter_body .mui-table-view .mui-table-view-cell {
  line-height: 42px;
  padding-left: 10px;
}
.filter_body .mui-table-view .mui-table-view-cell::after {
  left: 2px;
}
.filter-rows {
  display: flex;
  font-size: 14px;
  text-align: left;
  padding-top: 10px;
}
.filter-rows .mui-table-view::before {
  height: 0;
}
.filter-rows .mui-table-view .mui-table-view-cell::after {
  height: 1px;
}
.filter-rows .mui-table-view {
  flex: 1;
}
.filter-rows .mui-table-view .mui-table-view-cell.isType2 {
  padding-left: 5em;
  position: relative;
}
.filter-rows .mui-table-view .mui-table-view-cell.isType2 .lable {
  position: absolute;
  top: 0;
  left: 0;
}
.filter-items .mui-table-view-cell::after {
  left: 0;
}
.filter-items .mui-table-view-cell {
  background: #f1efef;
}
.filter-top-left {
  text-align: left;
}
.filter-top-left .mui-table-view-cell {
  position: relative;
  padding-right: 24px;
}
.filter-top-left .mui-table-view-cell .right-icon {
  position: absolute;
  top: 14px;
  right: 2px;
}
.filter-top-left .mui-table-view-cell.active {
  color: #f90;
}
.filter-top-left .mui-table-view-cell.active .right-icon {
  color: #f90;
}
.hadle-buttons {
  padding-top: 20px;
  display: flex;
}
.hadle-buttons > div {
  flex: 1;
  text-align: center;
}
.filter-items .mui-table-view-cell {
  position: relative;
  padding-right: 34px;
}
.filter-items .mui-table-view-cell .checked {
  position: absolute;
  top: 10px;
  right: 6px;
  font-size: 21px;
}
.filter-sort {
  text-align: left;
}
.filter-sort::after {
  height: 0;
}
.filter-sort .mui-table-view-cell::after {
  border-bottom: 1px solid #ccc;
}
.filter-sort .mui-table-view-cell:nth-last-child(1)::after {
  border-bottom: none;
}

.topfilter .mui-table-view .mui-table-view-cell {
  margin-top: 0px;
}
.topfilter .el-icon-circle-close {
    position: absolute;
    padding: 6px;
    font-size: 18px;
    top: 9px;
    left: 50%;
    transform: translateX(78px);
}
</style>

