<template>
    <div class="app-container">
      <!-- 头部栏 -->
      <header class="mui-bar mui-bar-nav">
		  	<a class="mui-icon mui-icon-left-nav mui-pull-left" v-tap="{methods:back}"></a>
		  	<h1 class="mui-title" v-cloak v-html="title"></h1>
		  	<a class="mui-btn mui-btn-link mui-pull-right" v-tap="{methods:submit}">保存</a>
	    </header>
      <form class="form">
        <!-- 1.0 输入框列表 -->
        <div class="mu-text-field has-label has-icon full-width">
			  	<i class="mu-text-field-icon mu-icon material-icons iconfont icon-dianpu iconform"></i>
			  	<div class="mu-text-field-content">
			  		<div class="mu-text-field-label">店铺名称</div>
			  		<div class="mu-text-field-hint" :class="{'show': shopName === ''}">
			  			请选择归属店铺（必填）
			  		</div>
			  		<div class="mu-text-field-input input-p12" style="text-align:left;" v-tap="{methods: togglePopleft}" v-html="shopName"></div>
			  		<div>
			  			<hr class="mu-text-field-line">
			  		</div>
			  		<div class="mu-text-field-help">
			  			<div>
			  			</div>
			  		</div>
			  	</div>
			  </div>
        <mu-text-field label="联系人姓名" v-model="cusName" icon=" "  hintText="请填写联系人姓名" inputClass="input-p12" fullWidth /><br/>
        <div class="mu-text-field has-icon full-width" v-for="(item, index) in contactList" :key="index + Math.random()">
			  	<i class="mu-text-field-icon mu-icon material-icons del-icons icon-shanchu iconfont iconform" v-tap="{methods: delPhoneNo,index: index}"></i>
			  	<div class="mu-text-field-content phone-content">
            <span>电话：</span>
			  		<input class="mu-text-field-input pnone-input" ref="phoneNo" :disabled="checkDisable(index,item)" placeholder="请输入电话号码" :value="item" @blur="inputLeave">
			  		<div>
			  			<hr class="mu-text-field-line">
			  		</div>
			  	</div>
			  </div>
        <div class="mu-text-field has-icon full-width" :class="{'error': contactList.length === 0}" style="min-height: 58px;">
			  	<i class="mu-text-field-icon mu-icon material-icons icon-0801zengjia iconfont iconform" v-tap="{methods:addContact}" style="color: #14c760; top: 6px;"></i>
			  	<div class="mu-text-field-content">
			  		<div v-tap="{methods:addContact}" class="mu-text-field-input input-p12" style="text-align:left;">添加联系方式</div>
			  		<div>
			  			<hr class="mu-text-field-line">
			  			<hr class="mu-text-field-focus-line" :class="{'error': contactList.length === 0}">
			  		</div>
            <div class="mu-text-field-help">
			  			<div v-html="contactList.length === 0 ? '请至少填写一个联系方式！' : ''">
              </div>
			  		</div>
			  	</div>
			  </div>
        <mu-text-field  label="职位"  v-model="cJobT" icon=" " hintText="请填写职位"  @focus="onFocus(2)" @blur="onBlur" inputClass="input-p12" fullWidth /><br/>
        <mu-text-field label="证件类型" v-model="cCardT" icon=" " :iconClass="['iconfont','icon-zhengjian','iconform']"  hintText="请选择证件类型" @focus="onFocus(3)" @blur="onBlur" inputClass="input-p12" fullWidth /><br/>
        <mu-text-field label="证件号" v-model="cusIdcard" icon=" "  hintText="请填写证件号" inputClass="input-p12" fullWidth /><br/>
      </form>
      <div style="padding: 0 15px; margin-bottom: 20px;">
          <mu-raised-button label="提交" class="demo-raised-button" @click="submit" primary fullWidth/>
      </div>
      <!-- 店铺列表选择，右侧过渡显示 -->
      <mt-popup
        class="popup-fade-l"
        v-model="popupVisible"
        position="right">
        <div class="select-box">
          <div class="mui-search" v-cloak>
            <input type="search" class="mui-input-clear" v-model="keyWord" @focus="keySeach" placeholder="请输入查询条件">
            <i class="search-icon material-icons">search</i>
            <i class="clean-cion el-icon-circle-close" v-if="sClean" v-tap="{methods: cleanInput}"></i>
          </div>
          <ul class="mui-table-view shop-list">
            <li class="mui-table-view-cell" v-cloak v-if="shopData.length !== 0" v-for="n in shopData" :key="n.SHOP_NO" v-tap="{methods: choseOption,id: n.SHOP_NO,text: n.SHOP_NAME}">
              <i class="iconfont icon-store fl"></i>
              <span class="shop-name fl">{{n.SHOP_NAME === "" || n.SHOP_NAME === null ? "无" : n.SHOP_NAME}}</span><span class="fl">（{{n.CUST_NAME === "" || n.CUST_NAME === null ? "无" : n.CUST_NAME}} / {{n.PHONE_NUM === null || n.PHONE_NUM === "" ? "无" : n.PHONE_NUM}}）</span>
            </li>
            <li class="mui-table-view-cell no-data" v-cloak v-if="shopData.length === 0">
              <i class="iconfont icon-wushuju"></i><br><span>˙︿˙&nbsp;暂无店铺信息</span>
            </li>
            <li class="mui-table-view-cell no-back" v-cloak v-if="shopData.length === 0">
              <mu-raised-button label="返回" backgroundColor="#E6A23C" class="demo-raised-button" @click="togglePopleft" primary fullWidth/>
            </li>
          </ul>
        </div>
      </mt-popup>
      <!-- 2.0 底部弹出列表 -->
      <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet" sheetClass="sheet-class">
          <mu-list @itemClick="closeBottomSheet">
            <mu-sub-header>
              请选择一个
            </mu-sub-header>
            <mu-list-item v-for="(item,index) in sheetData" :key="index+12" v-tap="{methods: selectOption,text: item.PARAMS_NAME,id: item.ID}" :title="item.PARAMS_NAME"/>
          </mu-list>
      </mu-bottom-sheet>    
    </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      title: "新增联系人",
      id: "", // 客户id
      type: -1, // -1 新增 1 主联系人 2 副联系人
      linId: "", // 联系人id
      popupVisible: false, // 右侧弹出选择列表开关
      bottomSheet: false, // 底部弹出控制
      sClean: false, // 清除图标开关
      tIndex: "",
      sheetData: [
        {
          text: "无数据",
          value: "-1"
        }
      ],
      contactList: [""], // 电话数据集
      shopData: [{ SHOP_NAME: "测试店铺名称", SHOP_NO: 122 }], // 店铺列表数据集
      jobData: [], // 职位数据集
      cardData: [
        {
          text: "身份证",
          value: "0"
        },
        {
          text: "军官证",
          value: "1"
        }
      ], // 证件类型数据集
      keyWord: "", // 店铺列表查询关键字
      cusName: "", // 联系人姓名
      shopName: "", //店铺名字
      shopNo: "", //店铺编号
      cJobT: "", // 职位text
      cJobV: "", // 职位id
      cCardT: "", // 证件类型text
      cCardV: "", // 证件类型id
      cusIdcard: "" // 证件号
    };
  },
  created() {
    // console.log(this.$route.params);
    this.id = this.$route.params.id;
    this.linId = this.$route.params.lid;
    this.type = parseInt(this.$route.params.type);
    this.getOptions(this.id);
    if (this.linId !== "-1") {
      this.title = "编辑联系人";
      this.getData();
    }
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    cleanInput() {
      document.activeElement.blur();
      this.keyWord = "";
    },
    checkDisable(a,b){
     let num = parseInt(b) || ""
     //console.log(a)
     console.log(num)
     if (a === 0){
       if(this.linId !== '-1' && (num === 0 || num === "")) {
         return false;
       }else if(this.linId == '-1'){
         return false;
       } else {
         return true;
       }
     } else{
        return false;
     }
    },
    getData() {
      let that = this;
      this.axios
        .get("/LinkManage.ashx", {
          params: {
            Action: "GetLinkDetail",
            LinkNo: that.linId
          }
        })
        .then(res => {
          console.log(res.data);
          that.setData(res.data);
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    setData(a) {
      this.shopName = a.SHOP_NAME; // 店铺名称
      this.cusName = a.CUST_NAME; // 联系人姓名
      this.contactList[0] = a.PHONE_NUM1; // 第一个电话不能修改
      if (
        a.PHONE_NUM2 !== " " &&
        a.PHONE_NUM2 !== null &&
        a.PHONE_NUM2 !== "" &&
        a.PHONE_NUM2 !== undefined
      ) {
        this.contactList[1] = a.PHONE_NUM2;
      }
      if (
        a.PHONE_NUM3 !== " " &&
        a.PHONE_NUM3 !== null &&
        a.PHONE_NUM3 !== "" &&
        a.PHONE_NUM3 !== undefined
      ) {
        this.contactList[2] = a.PHONE_NUM3;
      }
      this.cJobT = a.POSTNAME; // 职位名称
      this.cJobV = a.POST; // 职位名称id
      this.cCardT = a.CERTTYPENAME; // 证件类型
      this.cCardV = a.CERT_TYPE; // 证件类型id
      this.cusIdcard = a.CERT_NO; // 证件号码
    },
    onFocus(t) {
      this.tIndex = t;
      // t: 1/联系人类型 2/职位 3/证件类型
      // 先清空Sheet中的列表数据，再跟进type来填充数据后渲染底部
      this.sheetData = [
        {
          text: "暂无数据",
          value: "-1"
        }
      ];
      switch (t) {
        case 2:
          if (this.jobData.length !== 0) {
            this.sheetData = this.jobData; // 职位
          }
          break;
        case 3:
          if (this.cardData.length !== 0) {
            this.sheetData = this.cardData; // 证件类型
          }
          break;
      }
      // 打开底部列表
      this.openBottomSheet();
    },
    onBlur() {
      // console.log('离开焦点事件！')
      // 关闭底部列表
      this.closeBottomSheet();
    },
    closeBottomSheet() {
      this.bottomSheet = false;
    },
    openBottomSheet() {
      document.activeElement.blur();
      this.bottomSheet = true;
    },
    selectOption(params) {
      document.activeElement.blur();
      // 根据当前所属的分类列表，将当前选中的单条项目的id和text保存到对应的位置
      switch (this.tIndex) {
        case 2:
          this.cJobT = params.text;
          this.cJobV = params.id;
          break;
        case 3:
          this.cCardT = params.text;
          this.cCardV = params.id;
          break;
      }
      // 关闭底部弹出层
      this.closeBottomSheet();
    },
    addContact() {
      document.activeElement.blur();
      if (this.contactList.length === 3) {
        Toast({
          message: "电话号码最多能添加3个！",
          position: "middle",
          duration: 2000
        });
      } else {
        this.contactList.push("");
      }
    },
    inputLeave(index) {
      document.activeElement.blur();
      let checkMsg = true;
      // console.log(this.$refs.phoneNo);
      let inputs = this.$refs.phoneNo;
      let compare = "";
      for (let i = 0; i < inputs.length; i++) {
        //console.log(inputs[i].value);
        let thatInput = inputs[i];
        // 前台验证重复
        if (
          compare === inputs[i].value &&
          (compare !== "" || inputs[i].value !== "") &&
          i !== 0
        ) {
          Toast({
            message: "电话号码重复，请重新输入！",
            position: "middle",
            duration: 2000
          });
          this.contactList[i] = "";
          inputs[i].value = "";
          checkMsg = false;
        } else {
          compare = inputs[i].value;
        }
        // if (!/^1[34578]\d{9}$/.test(inputs[i].value) && checkMsg) {
        //   Toast({
        //     message: "电话号码格式不正确！",
        //     position: "middle",
        //     duration: 2000
        //   });
        //   inputs[i].value = "";
        //   checkMsg = false;
        // }
        // 同服务器数据库匹配
        this.contactList[i] = inputs[i].value;
        inputs[i].value = inputs[i].value;

        if (checkMsg) {
          this.checkPhone(thatInput.value, thatInput, i); // a 电话号码  b 当前input对象  c 当前序号
        }
      }
    },
    checkPhone(a, b, c) {
      // 服务器数据匹配
      let that = this;
      let Id = this.linId === "-1" ? "" : this.linId;
      this.axios
        .get("/ComboBoxData.ashx", {
          params: {
            Action: "CheckCustPhone",
            Id: Id,
            PhoneNum: a
          }
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.type === 3) {
            Toast({
              message: res.data.message,
              position: "middle",
              duration: 2000
            });
            that.contactList[c] = "";
            b.value = that.contactList[c];
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    delPhoneNo(params) {
      document.activeElement.blur();
      let i = params.index;
      this.contactList.splice(i, 1);
    },
    togglePopleft() {
      // 打开店铺选择列表
      document.activeElement.blur();
      if (this.linId !== "-1") {
        return;
      }
      this.popupVisible = !this.popupVisible;
    },
    choseOption(params) {
      document.activeElement.blur();
      this.shopName = params.text;
      this.shopNo = params.id;
      this.popupVisible = false;
    },
    getOptions(a) {
      let that = this;
      let parList = [
        {
          Action: "CustShopList", // 店铺列表
          CustNo: a
        },
        {
          Action: "SysParamCombo", // 职位
          pid: 3
        },
        {
          Action: "SysParamCombo", // 证件类型
          pid: 4
        }
      ];

      // 获取各种不同类别的选项列表，填充到数据集中
      for (let i = 0; i < parList.length; i++) {
        this.axios
          .get("/ComboBoxData.ashx", {
            params: parList[i]
          })
          .then(res => {
            console.log(res.data);
            switch (i) {
              case 0:
                that.shopData = res.data; //店铺
                break;
              case 1:
                that.jobData = res.data; // 职位
                break;
              case 2:
                that.cardData = res.data; // 证件类型
                break;
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },
    keySeach() {
      // 搜索关键字，显示店铺列表
      let that = this;
      this.axios
        .get("/ComboBoxData.ashx", {
          params: {
            Action: "CustShopList", // 店铺列表
            CustNo: that.id,
            keyWord: that.keyWord
          }
        })
        .then(res => {
          // console.log(res.data);
          this.shopData = res.data; //店铺
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    submit() {
      let that = this;
      document.activeElement.blur();

      // 先处理电话号码集合，以便于验证逻辑判断   1》replace(/[^\d]/g, '') 提取字符串中的数字 2》str.replace(/,,/g,',') 将字符串中的双逗号替换成单逗号
      for (let i = 0; i < this.contactList.length; i++) {
        if (
          !/^1[34578]\d{9}$/.test(this.contactList[i]) &&
          this.contactList[i] !== ""
        ) {
          Toast({
            message: "有电话号码格式不正确！",
            position: "middle",
            duration: 2000
          });
          return;
          break;
        }
      }

      if (this.contactList[0] === "") {
        // 如果第一个是电话号码值为空，删掉第一个
        this.contactList.splice(0, 1);
      }
      let Phone = this.contactList.join(",");
      Phone = Phone.replace(/[^\d]/g, ""); // 提取数字
      // 判断提取的是否有数字，如果没有数字为空，则后续传给后台的字段也为空
      if (Phone !== "") {
        Phone = this.contactList.join(","); // 拼接号码数组
        Phone = Phone.replace(/,,/g, ","); // 处理为空的双逗号问题
      }

      // 验证逻辑
      if (this.shopName === "") {
        Toast({
          message: "请选择一个所属店铺！",
          position: "middle",
          duration: 2000
        });
        return;
      }

      if (this.cusName === "") {
        Toast({
          message: "请填写联系人姓名！",
          position: "middle",
          duration: 2000
        });
        return;
      }

      if (Phone === "") {
        Toast({
          message: "请至少填写一条联系方式！",
          position: "middle",
          duration: 2000
        });
        return;
      }
      // /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/
      if (
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(
          this.cusIdcard
        ) &&
        this.cCardV === 470
      ) {
        Toast({
          message: "身份证号码输入有误！",
          position: "middle",
          duration: 2000
        });
        return;
      }

      if (!/^[a-zA-Z0-9]{7,21}$/.test(this.cusIdcard) && this.cCardV === 471) {
        Toast({
          message: "军官证号码输入有误！",
          position: "middle",
          duration: 2000
        });
        return;
      }

      // 采集数据阶段
      let data = {};
      if (this.linId === "-1") {
        data.CustNo = this.id; // 客户编号
        data.ShopNo = this.shopNo; // 所属店铺
        data.LinkName = this.cusName; // 联系人姓名
        data.PhoneNum = Phone; // 电话
        data.post = this.cJobV; // 联系人职位
        data.CertType = this.cCardV; // 证件类型
        data.CertId = this.cusIdcard; // 证件号
        data.UserId = this.$store.state.uId; // 登陆者id
        data.Action = "AddCustLink";
      } else {
        // 编辑保存
        data.LinkNo = this.linId; // 联系人编号
        data.linkName = this.cusName; // 联系人姓名
        data.PhoneNum = Phone; // 电话
        data.Post = this.cJobV; // 联系人职位
        data.CertType = this.cCardV; // 证件类型
        data.CertNo = this.cusIdcard; // 证件号
        data.UserId = this.$store.state.uId; // 登陆者id
        data.Action = "UpdateCustLink";
      }
      console.log(data);
      this.axios
        .get("/LinkManage.ashx", {
          params: data
        })
        .then(res => {
          console.log(res.data);
          if (res.data.type === 1) {
            Toast({
              message: "保存成功！",
              position: "middle",
              duration: 500
            });
            window.history.go("-1");
            setTimeout(function() {
              window.location.reload();
            }, 300);
          } else {
            Toast({
              message: res.data.message,
              position: "middle",
              duration: 2000
            });
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  },
  watch: {
    keyWord(e) {
      if (e === "") {
        this.sClean = false;
      } else {
        this.sClean = true;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss"  scoped>
.app-container {
  padding-top: 54px;
}
.app-container input {
    -webkit-user-select: auto !important;
}
.app-container .form {
  width: 100%;
  overflow: hidden;
}
.app-container .demo-raised-button {
  letter-spacing: 4px;
}
.form .mu-text-field .phone-content {
  text-align: left;
}
.form .mu-text-field .phone-content > span {
  color: #2196f3;
}
.mu-text-field .mu-text-field-content.phone-content .pnone-input {
  display: inline-block;
  width: auto;
}
.form {
  padding-right: 15px;
}
.form .mu-text-field .del-icons {
  padding: 6px;
  left: 10px;
  top: 4px;
  color: #f44336;
}
.select-box {
  width: 100%;
  height: 100%;
  padding-top: 10px;
  background-color: #efeff4;
  overflow-y: auto;
  padding-top: 50px;
  padding-bottom: 20px;
}
.select-box .mui-search {
  padding: 0 15px;
  padding-top: 6px;
  position: fixed;
  width: 100%;
  top: 0px;
  left: 0px;
  background-color: #efeff4;
  z-index: 3008;
}
.select-box .mui-search input {
  margin-bottom: 4px;
}
.clean-cion {
  font-size: 18px;
  padding: 6px;
  position: absolute;
  top: 8px;
  right: 16px;
}
.search-icon {
  position: absolute;
  top: 12px;
  left: 18px;
  color: rgba(0, 0, 0, 0.2);
}
.shop-list {
  background-color: transparent;
}
.shop-list .mui-table-view-cell::after {
  height: 1px;
}
.shop-list .mui-table-view-cell:nth-last-of-type(1)::after {
  height: 0px;
}
.shop-list .mui-table-view-cell {
  background-color: #fff;
  text-align: left;
  padding: 10px 15px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.shop-list .mui-table-view-cell i {
  font-size: 22px;
  vertical-align: top;
  margin-top: 2px;
  padding: 2px 6px;
  background-color: #52ace5;
  color: #fff;
  margin-right: 8px;
  border-radius: 2px;
}
.shop-list .mui-table-view-cell.no-data {
  background-color: transparent;
  text-align: center;
  margin-top: 40px;
}
.shop-list .mui-table-view-cell.no-data::after {
  height: 0;
}
.shop-list .mui-table-view-cell.no-data i {
  display: inline-block;
  background-color: transparent;
  color: #858585;
  font-size: 28px;
}
.shop-list .mui-table-view-cell.no-data span {
  font-size: 14px;
  color: #858585;
}
.shop-list .mui-table-view-cell.no-back {
  padding: 0 15px;
  background-color: transparent;
  width: 100%;
  position: fixed;
  bottom: 16px;
  left: 0;
}
.shop-list .mui-table-view-cell.no-back::after {
  height: 0;
}
.shop-list .mui-table-view-cell > span {
  margin-top: 4px;
}
.shop-list .mui-table-view-cell .shop-name {
  width: 5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

