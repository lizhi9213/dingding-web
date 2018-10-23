<template>
    <div class="app-container">
      <!-- 头部 -->
      <header class="mui-bar mui-bar-nav">
		  	<a class="mui-icon mui-icon-left-nav mui-pull-left" v-tap="{methods:back}"></a>
		  	<h1 class="mui-title">新增跟进记录</h1>
		  	<a class="mui-btn mui-btn-link mui-pull-right" v-tap="{methods: submit}">保存</a>
	    </header>
      <form class="form">
        <!-- 1.0 输入框列表 -->
        <div class="mu-text-field has-label has-icon full-width" v-if="type === 1">
			  	<i class="mu-text-field-icon mu-icon material-icons icon-dianpu iconfont iconform"></i>
			  	<div class="mu-text-field-content">
			  		<div class="mu-text-field-label">店铺名称</div>
			  		<div class="mu-text-field-hint" :class="{'show': shopName === ''}">
			  			请选择（必填）
			  		</div>
			  		<div class="mu-text-field-input input-p12" style="text-align: left;" v-tap="{methods: togglePopleft,type: 1}" v-html="shopName"></div>
			  		<div>
			  			<hr class="mu-text-field-line">
			  		</div>
			  		<div class="mu-text-field-help">
			  			<div>
			  			</div>
			  		</div>
			  	</div>
			  </div>
        <div class="mu-text-field has-label has-icon full-width">
			  	<i class="mu-text-field-icon mu-icon material-icons iconfont iconform" :class="{'icon-kehu': type === 2}"></i>
			  	<div class="mu-text-field-content">
			  		<div class="mu-text-field-label">联系人</div>
			  		<div class="mu-text-field-hint" :class="{'show': contactName === ''}">
			  			请选择（必填）
			  		</div>
			  		<div class="mu-text-field-input input-p12" style="text-align: left;" v-tap="{methods: togglePopleft,type: 2}" v-html="contactName"></div>
			  		<div>
			  			<hr class="mu-text-field-line">
			  		</div>
			  		<div class="mu-text-field-help">
			  			<div>
			  			</div>
			  		</div>
			  	</div>
			  </div>
        <mu-text-field label="跟进方式" v-model="modeT" icon=" "  hintText="请选择跟进方式" @focus="onFocus" @blur="onBlur" inputClass="input-p12" fullWidth /><br/>
        <mu-text-field label="记录沟通结果" v-model="cResult" icon=" " hintText="请填写记录沟通结果" inputClass="input-p12" multiLine :rows="3" :rowsMax="6" fullWidth/><br/>
        <div class="upload-box">
          <el-upload
            class="upload-demo"
            action="http://171.8.5.209:19000/data/Upload.ashx?Action=UploadWxPicture"
            :accept="'image/*'"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :file-list="fileList2"
            list-type="picture">
            <div class="upload-input mu-text-field has-label has-icon full-width">
			      	<i class="mu-text-field-icon mu-icon material-icons iconfont icon-icon-- iconform"></i>
			      	<div class="mu-text-field-content">
			      		<div class="mu-text-field-label">上传微信聊天图片</div>
			      		<div class="mu-text-field-hint show">
			      			点击选择图片
			      		</div>
			      		<div class="mu-text-field-input input-p12"></div>
			      		<div>
			      			<hr class="mu-text-field-line">
			      		</div>
			      		<div class="mu-text-field-help">
			      			<div>
			      			</div>
			      		</div>
			      	</div>
			      </div>
          </el-upload>
        </div>
      </form>
      <div style="padding: 0 15px; margin-bottom: 20px;">
          <mu-raised-button label="提交" class="demo-raised-button" @click="submit" primary fullWidth/>
      </div>
      <!-- 2.0店铺/联系人列表选择，右侧过渡显示 -->
      <mt-popup
        class="popup-fade-l"
        v-model="popupVisible"
        position="right">
        <div class="select-box">
          <div class="mui-search" v-cloak>
            <input type="search" class="mui-input-clear" v-model="keyWord" placeholder="请输入查询条件">
            <i class="search-icon material-icons">search</i>
            <i class="clean-cion el-icon-circle-close" v-if="sClean" v-tap="{methods: cleanInput}"></i>
          </div>
          <ul class="mui-table-view shop-list">
            <li class="mui-table-view-cell" v-cloak v-if="slistData.length !== 0 && ltp === 1" v-for="n in slistData" :key="n.SHOP_NO" v-tap="{methods: choseOption,id: n.SHOP_NO,text: n.SHOP_NAME,nu: n.CUST_NO}">
              <i class="iconfont icon-store fl"></i>
              <span class="shop-name fl">{{n.SHOP_NAME === "" || n.SHOP_NAME === null ? "无" : n.SHOP_NAME}}</span><span class="fl">（{{n.CUST_NAME}} / {{n.PHONE_NUM}}）</span>
            </li>
            <li class="mui-table-view-cell" v-cloak v-else v-for="(n,i) in slistData" :key="i+20" v-tap="{methods: choseOption,id: n.LINK_NO,text: n.CUST_NAME}">
              <i class="iconfont icon-zhengchangkehu"></i>{{n.CUST_NAME === "" || n.CUST_NAME === null ? "无名称" : n.CUST_NAME}}（{{n.PHONE_NUM1 === "" || n.PHONE_NUM1 === null ? "无号码" : n.PHONE_NUM1}}）
            </li>
            <li class="mui-table-view-cell no-data" v-cloak v-if="slistData.length === 0">
              <i class="iconfont icon-wushuju"></i><br><span>˙︿˙&nbsp;{{ltp === 1 ? "暂无店铺信息" : "暂无联系人信息"}}</span>
            </li>
            <li class="mui-table-view-cell no-back" v-cloak v-if="slistData.length === 0">
              <mu-raised-button label="返回" backgroundColor="#E6A23C" class="demo-raised-button" @click="togglePopleft" primary fullWidth/>
            </li>
          </ul>
        </div>
      </mt-popup>
      <!-- 3.0 底部弹出 -->
      <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet" sheetClass="sheet-class">
          <mu-list @itemClick="closeBottomSheet">
            <mu-sub-header>
              请选择一个
            </mu-sub-header>
            <mu-list-item v-for="(item,index) in sheetDate" :key="index+12" v-tap="{methods: selectOption,text: item.text,id: item.value}" :title="item.text"/>
          </mu-list>
      </mu-bottom-sheet>
        
    </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      type: "", // 1 跟进列表进入 2 详情单个客户写跟进
      popupVisible: false, // 右侧过渡控制
      bottomSheet: false, // 底部控制
      ltp: "", // 右侧渲染类型标记 1 店铺 2 联系人
      slistData: [], //右侧列表数据集
      keyWord: "", // 关键字搜索
      sClean: false, // input清除按钮
      sheetDate: [
        {
          text: "电话",
          value: "1"
        },
        {
          text: "微信",
          value: "2"
        }
      ],
      fileList2: [],
      CustNo: "", // 客户id
      shopName: "", // 店铺名字
      shopId: "", // 店铺id
      contactName: "", // 联系人姓名
      contactId: "", // 联系人id
      modeV: "", // 跟进方式id
      modeT: "", // 跟进方式text
      cResult: "", // 沟通跟进记录结果
      FileAddr: [], // 文件地址
      FileSize: [], // 文件大小
      FileType: [] // 文件类型
    };
  },
  created() {
    console.log(this.$route.params);
    this.type = parseInt(this.$route.params.type);
    if (this.type === 2) {
      this.shopName = this.$route.params.cname; // 店铺名字
      this.CustNo = this.$route.params.cid; //客户id
      this.shopId = this.$route.params.sid; //店铺id
    }
  },
  methods: {
    openWv() {},
    back() {
      this.$router.goBack();
    },
    getShopList(a = "") {
      let that = this
      // 获取店铺列表
      this.axios
        .get("/ComboBoxData.ashx", {
          params: {
            Action: "AllShopList",
            keyWord: a
          }
        })
        .then(res => {
          console.log(res.data);
          this.slistData = res.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getContactList(b = "") {
      let that = this;
      let data = {};
      // 客户id查询所属联系人
      data.Action = "CustLinkList";
      data.keyWord = b;
      data.CustNo = this.CustNo;
      data.ShopNo = this.shopId;

      console.log(data);
      // 获取联系人列表
      this.axios
        .get("/LinkManage.ashx", {
          params: data
        })
        .then(res => {
          console.log(res.data);
          this.slistData = res.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    cleanInput() {
      document.activeElement.blur();
      this.keyWord = "";
    },
    onFocus() {
      // console.log('进入焦点事件！')
      // 先清空Sheet中的列表数据，再跟进type来填充数据后渲染底部
      // 打开底部列表
      document.activeElement.blur();
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
      this.bottomSheet = true;
    },
    selectOption(params) {
      // 选择事件
      this.modeV = params.id;
      this.modeT = params.text;
      // 关闭底部弹出层
      this.closeBottomSheet();
      // 让input框失去焦点
      document.activeElement.blur();
    },
    togglePopleft(params) {
      document.activeElement.blur();
      // 编辑页面进入，店铺不能编辑
      if (this.type === 2 && params.type === 1) {
        return;
      }
      this.slistData = [];
      this.ltp = params.type;
      if (params.type === 1) {
        // 获取主页进入店铺列表
        this.getShopList();
      } else if (params.type === 2) {
        if (this.shopId === "" && this.type == 1) {
          Toast({
            message: "请先选择店铺！",
            position: "middle",
            duration: 2000
          });
          return;
        } else {
          // 联系人
          this.getContactList();
        }
      }
      this.popupVisible = !this.popupVisible;
    },
    choseOption(params) {
      // 选中店铺名或者联系人名
      document.activeElement.blur();
      if (this.ltp === 1) {
        this.shopName =
          params.text === "" || params.text === null ? "无" : params.text;
        this.shopId = params.id;
        this.CustNo = params.nu;
        console.log(this.shopId);
      } else if (this.ltp === 2) {
        this.contactName = params.text;
        this.contactId = params.id;
      }
      this.popupVisible = false;
    },
    searchShop() {
      // 搜索关键字，显示店铺列表
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      let nowAddr = file.response.filesAddr;
      nowAddr = nowAddr.split("/");
      for (let i = 0; i < this.FileAddr.length; i++) {
        let index = i;
        if (this.FileAddr[index] == nowAddr[2]) {
          this.FileAddr.splice(index, 1);
          this.FileSize.splice(index, 1);
          this.FileType.splice(index, 1);
          break;
        }
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeAvatarUpload(file, fileList) {
      // 上传前回调
      // console.log(file)
      //return false;
    },
    handleSuccess(res, file, fileList) {
      console.log(res);
      // console.log(file);
      if (file.status === "success") {
        // addr = addr.split("/");
        // console.log (addr)
        this.FileAddr.push(res.filesAddr);
        this.FileSize.push(res.fileLength);
        this.FileType.push(res.sExt);
      }
    },
    submit() {
      let that = this;
      document.activeElement.blur(); // 所有input失去焦点
      if (this.type === 1 && this.shopName === "") {
        Toast({
          message: "店铺名称不能为空！",
          position: "middle",
          duration: 2000
        });
        return;
      }
      if (this.contactName === "") {
        Toast({
          message: "联系人姓名不能为空！",
          position: "middle",
          duration: 2000
        });
        return;
      }
      // 采集数据
      let data = {};
      data.Action = "AddCustDail";
      data.CustNo = this.CustNo; // 客户编号custno:KH1605080 linkno:699847
      // data.ShopNo = this.shopId; // 店铺
      data.LinkNo = this.contactId; // 联系人
      data.DailSource = this.modeV; // 跟进方式
      data.Remark = this.cResult; // 备注
      data.FileAddr = this.FileAddr.join(","); // 文件地址
      data.FileSize = this.FileSize.join(","); // 文件大小
      data.FileType = this.FileType.join(","); // 文件类型
      data.UserId = this.$store.state.uId; // 跟进人id
      console.log(data);
      // 上传数据到服务器
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
            // 回退到前一个页面
            window.history.go('-1');
            setTimeout(function() {
              window.location.reload();
            }, 300);
          } else {
            Toast({
              message: res.data.message,
              position: "middle",
              duration: 2000
            })
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  },
  watch: {
    keyWord(e) {
      // 判断是否显示清除图标
      if (e === "") {
        this.sClean = false;
      } else {
        this.sClean = true;
      }
      // 查询列表
      if (this.ltp === 1) {
        // 查询店铺名关键字
        this.getShopList(e);
      } else if (this.ltp === 2) {
        // 查询联系人关键字
        this.getContactList(e)
      }
    },
    shopId(e) {
      this.contactName = "";
      this.contactId = "";
    }
  }
};
</script>

<style rel="stylesheet/scss"  scoped>
.app-container {
  padding-top: 54px;
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
.upload-box {
  padding-left: 15px;
  margin-bottom: 20px;
  padding-top: 72px;
  position: relative;
}
.upload-box .upload-input {
  position: absolute;
  top: 0;
  left: 0;
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

