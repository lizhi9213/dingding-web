<template>
    <div class="app-container">
        <!-- 头部 -->
        <header class="mui-bar mui-bar-nav">
		    	<a class="mui-icon mui-icon-left-nav mui-pull-left" v-tap="{methods:back}"></a>
		    	<h1 class="mui-title" v-cloak v-html="title"></h1>
		    	<a class="mui-btn mui-btn-link mui-pull-right" v-tap="{methods: submit}">保存</a>
	      </header>
        <form class="form">
            <!-- 1.0 输入框列表 -->
            <mu-text-field label="店铺名称" v-model="shopName" icon=" " :iconClass="['iconfont','icon-kehu','iconform']" hintText="请填写店铺名称（必填）" inputClass="input-p12" fullWidth /><br/>
            <mu-text-field label="店铺简称" v-model="cusAbbre" icon=" " hintText="请填写店铺简称" inputClass="input-p12" fullWidth /><br/>
            <mu-text-field label="客户姓名" v-model="cusName" icon=" "  hintText="请填写客户姓名（必填）" inputClass="input-p12" fullWidth /><br/>
            <mu-text-field label="电话" v-model="cusPhone"  :disabled="id !=='-1'" icon=" " @blur="checkPhone" :iconClass="['iconfont','icon-dianhua','iconform']"  type="number" hintText="请填写电话（必填）" inputClass="input-p12" fullWidth /><br/>
            <mu-text-field label="微信号" v-model="wxNo" icon=" "  hintText="请填写微信号" inputClass="input-p12" fullWidth /><br/>
            <mu-text-field label="客户级别" v-model="levelT" icon=" " :disabled="id !=='-1'"  hintText="请选择客户级别" @focus="onFocus(1,1)" @blur="onBlur" inputClass="input-p12" fullWidth /><br/>
            <div class="mu-text-field has-label has-icon full-width">
			      	<i class="mu-text-field-icon mu-icon material-icons"></i>
			      	<div class="mu-text-field-content">
			      		<div class="mu-text-field-label">客户来源</div>
			      		<div class="mu-text-field-input input-p12" style="text-align: left;" v-html="'从钉钉外部获取'"></div>
			      		<div>
			      			<hr class="mu-text-field-line">
			      		</div>
			      		<div class="mu-text-field-help">
			      			<div>
			      			</div>
			      		</div>
			      	</div>
			      </div>
            <mu-text-field label="客户地址" icon=" " v-model="showPca" hintText="请选择客户地址" @focus="onFocus(3)" @blur="onBlur" inputClass="input-p12" fullWidth /><br/>
            <mu-text-field label="详细地址" v-model="detAddr" icon=" " :iconClass="['iconfont','icon-iconfontdizhi','iconform']"  hintText="请填写详细地址" inputClass="input-p12" fullWidth /><br/>
            <div class="mu-text-field has-label has-icon full-width">
			      	<i class="mu-text-field-icon mu-icon material-icons"></i>
			      	<div class="mu-text-field-content">
			      		<div class="mu-text-field-label">负责人</div>
			      		<div class="mu-text-field-input input-p12" style="text-align: left;" v-html="this.$store.state.uName ? this.$store.state.uName : '无法读取'"></div>
			      		<div>
			      			<hr class="mu-text-field-line">
			      		</div>
			      		<div class="mu-text-field-help">
			      			<div>
			      			</div>
			      		</div>
			      	</div>
			      </div>
            <!-- 头像图片可能无法调用选择本地文件功能 -->
            <div class="upload-img">
              <p class="upload-title">上传头像</p>
              <i class="material-icons iconfont icon-icon-- iconform"></i>
              <el-upload
                class="avatar-uploader"
                action="http://171.8.5.209:19000/data/Upload.ashx?Action=UploadFiles"
                :show-file-list="false"
                :accept="'image/*'"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <div class="upload-box" v-if="imageUrl">
                  <img :src="imageUrl" class="avatar left-view">
                  <span class="rigt-name" v-html="imgName"></span>
                </div>
                <div class="upload-box" v-else>
                  <div class="left-view has-icon">
                    <i class="avatar-uploader-icon" :class="{'el-icon-upload': !isLoading && !isBig,'el-icon-loading': isLoading,'el-icon-picture-outline': isBig}"></i>
                  </div>
                  <span class="rigt-name" v-if="id === '-1'" style="text-align:left;" :class="{'color-red': isBig}" v-html="upTips"></span>
                  <span class="rigt-name1" v-if="id !== '-1'" style="text-align:left;" v-html="editName"></span>
                </div>
              </el-upload>
            </div>
        </form>
        <div style="padding: 0 15px; margin-bottom: 20px;">
            <mu-raised-button label="保存" class="demo-raised-button" @click="submit" primary fullWidth/>
        </div>
        <!-- 2.0 底部弹出 -->
        <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet" :sheetClass="sheetClass">
            <mu-list @itemClick="closeBottomSheet">
              <mu-sub-header>
                请选择一个
              </mu-sub-header>
              <mu-list-item v-if="!sheetToogle" v-for="(n,i) in sheetData" :key="i+12" v-tap="{methods: selectOption,text: n.PARAMS_NAME,id: n.ID}" :title="n.PARAMS_NAME"/>
              <mu-picker v-if="sheetToogle" :slots="addressSlots" :visible-item-count="5" @change="addressChange" :values="address"/>
            </mu-list>
        </mu-bottom-sheet>
        
    </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      title: "新增客户",
      id: "",
      bottomSheet: false, // 底部控制
      sheetToogle: false, // 单列/三列切换开关
      nowLN: 0, // 当前选择列表的所属序号
      sheetClass: "", //底部样式
      showPca: "", //input框中显示的省市区
      sheetData: [], // 底部单列表选择数据集
      typeData: [], // 客户类型数据集
      levelData: [], // 客户级别数据集
      sourceData: [], // 客户来源数据集
      cityData: {}, // 省市数据集合
      areaData: {}, // 市区数据集合
      addressSlots: [], // 选择器配置
      address: [], // 地址集合，选择器需要
      addressProvince: "", // 省
      addressCity: "", // 市
      adressArea: "", // 区
      shopName: "", //店铺名称
      cusAbbre: "", // 店铺简称
      cusName: "", // 客户姓名
      cusPhone: "", // 客户电话
      levelT: "", // 客户级别文字
      levelV: "", // 客户级别ID
      detAddr: "", // 详细地址
      imageUrl: "", // 图片地址
      imgName: "", //图片名字
      upTips: "点击上传图片",
      isLoading: false, //等待
      isBig: false, // 图片过大
      fileLength: "",
      filesAddr: "",
      sExt: "",
      wxNo: "", // 微信号
      editName: "", // 图片名称
      editImg:"" // 编辑暂存图片地址，用于比较是否编辑过
    };
  },
  created() {
    // console.log(this.$route.params);
    this.id = this.$route.params.id;
    this.getCitys();
    this.getOption();
    if (this.id !== "-1") {
      this.title = "编辑客户";
      this.getData();
    }
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    getData() {
      let that = this;
      this.axios
        .get("/CustomerManage.ashx", {
          params: {
            Action: "MyCustDetail",
            CustNo: that.id
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
      this.shopName = a.SHOP_NAME; //店铺名称
      this.cusAbbre = a.SHOP; //店铺简称
      this.cusName = a.CUST_NAME; //客户姓名
      this.cusPhone = a.PHONE_NUM; //客户电话
      this.wxNo = a.WECHAT; //微信号
      this.addressProvince = a.SHOP_PROV; //省
      this.addressCity = a.SHOP_CITY; //市
      this.adressArea = a.SHOP_AREA; //区
      this.showPca = a.SHOP_PROV + " " + a.SHOP_CITY + " " + a.SHOP_AREA; //显示的省市区
      this.detAddr = a.SHOP_ADDR; // 详细地址
      this.imageUrl = a.ATTACH_ADDR; // 客户头像
      this.editImg = a.ATTACH_ADDR; // 暂存头像地址
      this.levelT = a.CUST_LEVEL; // 客户等级
      this.levelV = a.CUST_LEVEL_ID; // 客户等级id
      this.filesAddr = a.ATTACH_ADDR; // 文件地址
      this.fileLength = a.ATTACH_SIZE; // 文件大小
      this.sExt = a.ATTACH_TYPE; // 文件类型
    },
    onFocus(a, b) {
      document.activeElement.blur();
      // a弹出列表类型 b列表数据识别
      // 弹出类型的样式
      if (a === 1) {
        this.sheetClass = "sheet-class";
      } else {
        this.sheetClass = "";
      }
      // 保存选择的列表序号
      this.nowLN = b;
      // 先清空Sheet中的列表数据，再跟进type来填充数据后渲染底部
      this.sheetData = [
        {
          PARAMS_NAME: "暂无数据",
          ID: "-1"
        }
      ];
      if (a === 1) {
        this.sheetToogle = false; // 显示单列选择器
        if (this.levelData.length !== 0) {
          this.sheetData = this.levelData; // 级别
        }
        console.log(this.sheetData);
      } else {
        this.sheetToogle = true; // 显示三列选择器
      }

      // 打开底部列表
      this.openBottomSheet();
    },
    onBlur() {
      console.log("离开焦点事件！");
      // 关闭底部列表
      this.closeBottomSheet();
    },
    closeBottomSheet() {
      this.bottomSheet = false;
    },
    openBottomSheet() {
      this.bottomSheet = true;
    },
    selectOption(params) {
      // 根据保存的序号判定选择事件的，id和文字信息保存到不同到类别中
      this.levelT = params.text; // 客户级别文字
      this.levelV = params.id; // 客户级别ID
      // 关闭底部弹出层
      this.closeBottomSheet();
      // 让input框失去焦点
      document.activeElement.blur();
    },
    getCitys() {
      // http://116.255.223.137:9008/data/ComboBoxData.ashx?Action='GetPCAJson'
      // /ComboBoxData.ashx?Action=SysProCityArea
      let that = this;
      this.axios
        .get("/ComboBoxData.ashx", {
          params: {
            Action: "SysProCityArea"
          }
        })
        .then(res => {
          // console.log(res.data);
          let result = res.data;
          // cityData areaData
          for (let i = 0; i < result.length; i++) {
            // 省外层
            let provinceItem = result[i];
            that.cityData[provinceItem.text] = [];
            // 市列表
            let city = provinceItem.children;
            for (let j = 0; j < city.length; j++) {
              that.cityData[provinceItem.text].push(city[j].text);
              let cityItem = city[j];
              // 市外层
              that.areaData[cityItem.text] = [];
              // 区列表
              let area = cityItem.children;
              for (let k = 0; k < area.length; k++) {
                that.areaData[cityItem.text].push(area[k].text);
              }
            }
          }
          // console.log(JSON.stringify(that.cityData));
          // console.log(JSON.stringify(that.areaData));
          // 设置插件初始化参数
          let plist = Object.keys(that.cityData); // 省列表
          let fprovince = plist[0]; // 第一个省级名字
          let clist = that.cityData[fprovince]; // 第一个省所属市列表
          let fcity = clist[0]; // 第一个市级名字
          let alist = that.areaData[fcity]; // 第一个市级所属区列表
          let farea = alist[0]; // 第一个区名字
          // 设置参数
          that.addressSlots = [
            {
              width: "100%",
              textAlign: "right",
              values: plist // 此方法用于遍历数据体第一层信息
            },
            {
              width: "100%",
              textAlign: "center",
              values: clist
            },
            {
              width: "100%",
              textAlign: "left",
              values: alist
            }
          ];
          that.address.push(fprovince, fcity, farea);
          that.addressProvince = fprovince;
          that.addressCity = fcity;
          that.adressArea = farea;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getOption() {
      let that = this;
      // 获取列表
      this.axios
        .get("/ComboBoxData.ashx", {
          params: {
            Action: "SysParamCombo", // 客户级别
            pid: 2
          }
        })
        .then(res => {
          //console.log(res.data);
          this.levelData = res.data; // 级别
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    checkPhone() {
      console.log("验证手机号");
      // 服务器数据匹配
      let that = this;
      let Id = this.id === "-1" ? "" : this.id;
      this.axios
        .get("/ComboBoxData.ashx", {
          params: {
            Action: "CheckCustPhone",
            Id: Id,
            PhoneNum: that.cusPhone
          }
        })
        .then(res => {
          console.log(res.data);
          // 如果重复，就做处理
          if (res.data.type === 3) {
            Toast({
              message: res.data.message,
              position: "middle",
              duration: 2000
            });
            that.cusPhone = "";
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    addressChange(value, index) {
      let that = this;
      // console.log("value:" + value);
      // console.log("index:" + index);
      switch (index) {
        case 0:
          // 设置第一列显示value
          this.addressProvince = value;
          // 设置第二列整列数据，和显示value
          const arr = this.cityData[value];
          this.addressSlots[1].values = arr;
          this.addressCity = arr[0];
          // 设置第三列整列数据，和显示value
          this.addressSlots[2].values = this.areaData[this.addressCity];
          this.adressArea = this.areaData[this.addressCity][0];
          break;
        case 1:
          // 设置第二列显示value
          this.addressCity = value;
          // 设置第三列整列数据，和显示value
          that.addressSlots[2].values = this.areaData[value];
          this.adressArea = this.areaData[value][0];
          break;
        case 2:
          // 设置第二列显示value
          this.adressArea = value;
          break;
      }
      this.address = [this.addressProvince, this.addressCity, this.adressArea];
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = "";
      console.log(res);
      if (res.ok === true) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.fileLength = res.fileLength;
        this.filesAddr = res.filesAddr;
        this.sExt = res.sExt;
      } else {
        this.imageUrl = "/static/img/fail.png";
        this.imgName = "上传失败，请重新上传！";
      }
      console.log(this.imageUrl);
    },
    beforeAvatarUpload(file) {
      // console.log(file);
      this.imgName = file.name;
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = true;//file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        Toast({
          message: "图片只能上传jpg/png格式！",
          position: "middle",
          duration: 2000
        });
      }
      if (!isLt2M) {
        Toast({
          message: "上传图片大小不能超过2M！",
          position: "middle",
          duration: 2000
        });
        this.isLoading = false;
        this.isBig = true;
        this.upTips = "图片过大！";
        this.imageUrl = "";
      } else {
        this.isLoading = true;
        this.upTips = "上传中...";
        this.imageUrl = "";
      }
      return isJPG && isLt2M;
    },
    submit() {
      let that = this;
      document.activeElement.blur(); // 所有input失去焦点
      // console.log(this.$store.state.uId)
      // console.log(this.$store.state.uName)
      // 判断逻辑
      if (this.shopName === "") {
        Toast({
          message: "客户名称不能为空！",
          position: "middle",
          duration: 2000
        });
        return;
      }
      if (this.cusName === "") {
        Toast({
          message: "客户姓名不能为空！",
          position: "middle",
          duration: 2000
        });
        return;
      }
      if (this.cusPhone === "") {
        Toast({
          message: "客户电话不能为空！",
          position: "middle",
          duration: 2000
        });
        return;
      }
      // 采集数据
      let data = {};
      if (this.id === "-1") {
        data.FileSize = this.fileLength; // 头像
        data.FileAddr = this.filesAddr;
        data.FileType = this.sExt;
        data.ShopName = this.shopName; // 客户名称
        data.Shop = this.cusAbbre; // 客户简称
        data.CustName = this.cusName; // 客户姓名
        data.PhoneNum = this.cusPhone; // 客户电话
        data.CustLevel = this.levelV; // 客户级别
        data.CustSource = 765; // 客户来源
        data.ShopProv = this.addressProvince; // 客户地址省
        data.ShopCity = this.addressCity; // 客户地址市
        data.ShopArea = this.adressArea; // 客户地址区
        data.ShopAddr = this.detAddr; // 客户详细地址
        data.Wechat = this.wxNo; // 微信号
        data.UserId = this.$store.state.uId; // 用户uid
        data.Action = "AddCustShop";
      } else if (this.id !== "-1") {
        data.CustNo = this.id;
        data.FileSize = this.fileLength; // 文件大小e
        if(this.filesAddr === this.editImg) {
          // 没有编辑头像
          let imgarr = this.editImg.split("/");
          let fi = imgarr.length - 1;
          data.FileAddr = imgarr[fi]; // 文件地址e
        }else {
          data.FileAddr = this.filesAddr; // 文件地址e
        }
        data.FileType = this.sExt; // 文件类型e
        data.ShopName = this.shopName; // 店铺名称e
        data.Shop = this.cusAbbre; // 客户简称e
        data.CustName = this.cusName; // 客户姓名e
        data.CustProv = this.addressProvince; // 客户地址省e
        data.CustCity = this.addressCity; // 客户地址市e
        data.CustArea = this.adressArea; // 客户地址区e
        data.CustAddr = this.detAddr; // 客户详细地址e
        data.Wechat = this.wxNo; // 微信号e
        data.UserId = this.$store.state.uId; // 用户uide
        data.Action = "UpdateCustShop";
      }
      console.log(data);
      // 将数据发送到服务器保存
      this.axios
        .get("/CustomerManage.ashx", {
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
            // 回退到前一个页面
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
    address(e) {
      this.showPca = e.join(" ");
    }
  }
};
</script>

<style rel="stylesheet/scss"  scoped>
.app-container {
  padding-top: 50px;
}
.app-container .form {
  width: 100%;
  overflow: hidden;
}
.app-container .demo-raised-button {
  letter-spacing: 4px;
}
.form {
  padding-right: 15px;
}
.upload-img {
  padding-left: 54px;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
}
.upload-img .material-icons {
  position: absolute;
  color: rgba(0, 0, 0, 0.54);
  top: 86px;
  left: 16px;
}
.upload-img .upload-title {
  text-align: left;
  color: rgba(0, 0, 0, 0.54);
  font-size: 12px;
  margin-bottom: 10px;
}
.upload-img .upload-box {
  width: 100%;
  height: 92px;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 10px 10px 10px 90px;
}
.upload-box .left-view {
  vertical-align: middle;
  display: inline-block;
  width: 70px;
  height: 70px;
  float: left;
  position: relative;
  z-index: 1;
  margin-left: -80px;
  text-align: center;
  line-height: 78px;
  border-radius: 5px;
}
.upload-box .left-view.has-icon {
  background-color: rgba(0, 122, 255, 0.25);
  color: #fff;
}
.upload-box .left-view i {
  font-size: 28px;
}
.upload-box .rigt-name {
  line-height: 70px;
  margin-top: 0;
  display: block;
  color: #606266;
  margin-right: 40px;
  overflow: hidden;
  padding-left: 4px;
  text-overflow: ellipsis;
  transition: color 0.3s;
  white-space: nowrap;
}
.upload-box .rigt-name1 {
  line-height: 70px;
  margin-top: 0;
  display: block;
  color: #606266;
  margin-right: 40px;
  overflow: hidden;
  padding-left: 4px;
  text-overflow: ellipsis;
  transition: color 0.3s;
  white-space: nowrap;
}
.color-red {
  color: #f56c6c !important;
}
</style>

