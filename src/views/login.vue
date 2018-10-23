<template>
  <div class="app-container">
    <mt-popup
        class="popup-fade-l"
        v-model="popupVisible"
        position="right">
        <div class="start-page">
            <div class="logo">
              <img src="/static/img/logo.png" alt="巅峰集团">
            </div>
            <div class="login-box">
                <form class="form">
                    <!-- <mu-text-field icon=" " :iconClass="['iconfont','icon-user','color-fff','iconform']" v-model="userName" hintTextClass="color-fff-i text-left" inputClass="color-fff-b" hintText="请输入用户名"/><br/> -->
                    <div class="input-group" style="margin-bottom: 15px;">
                      <i class="iconfont icon-user"></i><el-input v-model="userName" clearable auto-complete="off" placeholder="请输入用户名"></el-input>
                    </div>
                    <div class="input-group">
                      <i class="iconfont icon-lock"></i><el-input type="password" clearable auto-complete="off" v-model="passWord" placeholder="请输入密码"></el-input>
                    </div>
                    <!-- <mu-text-field icon=" " :iconClass="['color-fff','iconfont','icon-lock','iconform']" v-model="userName" :type="passType" hintTextClass="color-fff-i text-left" inputClass="color-fff-b" hintText="请输入密码"/><br/> -->
                </form>
                <div class="submit">
                  <mu-raised-button @click="submint" label="登陆" class="demo-raised-button" primary fullWidth/>
                  <p v-if="errorTips" style="text-align: left; margin-top: 8px; color: #F56C6C;">自动登录失败，请尝试手动登录！</p>
                </div>
            </div>
        </div>
    </mt-popup>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
export default {
  data() {
    return {
      passType: "password",
      userName: "",
      passWord: "",
      dingId: "",
      errorTips: false, // 自动登录失败提示；
      popupVisible: false // 当前为false表示先显示启动页海报，如果自动登陆失败则变为true打开表单
    };
  },
  created() {
    let that = this;
    history.pushState(null, null, location.href);
    // 从钉钉获取codeId,请求后台用户数据
    let user = "";
    let code = ""; // created函数中的全局code
    dd.ready(function() {
      dd.runtime.permission.requestAuthCode({
        corpId: "dingf1fbc86c1849d27835c2f4657eb6378f",
        onSuccess: function(result) {
          // alert(JSON.stringify(result))
          code = result.code;
          let userId = "";
          that.axios
            .get("/DingBandage.ashx", {
              params: {
                Action: "getUserInfo",
                code: code,
                rnd: Math.random()
              }
            })
            .then(res => {
              // alert(JSON.stringify(res.data));
              if (res.data.UserId != "" && res.data.UserName != "") {
                setTimeout(() => {
                  that.$store.commit("sessionuId", res.data.UserId); // 设置uId
                  that.$store.commit("sessionuName", res.data.UserName); // 设置uName
                  that.$store.commit("setDingId", res.data.DingId); // 设置钉钉id到store
                  that.dingId = res.data.DingId; // 将后台传回来的钉钉Id保存
                  // 跳转home
                  that.$router.push({ path: "/home" }); // 跳转到home页面
                }, 800);
              } else {
                setTimeout(() => {
                  that.$store.commit("setDingId", res.data.DingId); // 设置钉钉id到store
                  that.dingId = res.data.DingId; // 将后台传回来的钉钉Id保存
                  that.popupVisible = true; // 打开登陆表单
                }, 800);
              }
            })
            .catch(function(err) {
              that.popupVisible = true; // 打开登陆表单
              // alert(JSON.stringify(err));
            });
        },
        onFail: function(err) {
          that.popupVisible = true; // 打开登陆表单
          // alert(JSON.stringify(err));
        }
      });
    });

    // 自动检测机制，如果5s后无法获取到code，自动切换成手动登陆，可以用来区分钉钉端和电脑端
    setTimeout(function() {
      if (code == "") {
        // 当前code 继续为空说明请求时间过长，或者请求不到
        that.errorTips = true;
        setTimeout(function(){
          that.errorTips = false;
        },5000);
        that.popupVisible = true;
      }
    }, 5000);
  },
  methods: {
    openWv(params) {
      this.$router.push(hrefto);
    },
    toggingType() {
      if (this.passType === "password") {
        this.passType = " ";
      } else {
        this.passType = "password";
      }
    },
    submint() {
      let that = this;
      if (that.userName === "") {
        Toast({
          message: "请输入用户名",
          className: "toast-style",
          iconClass: "icon el-icon-circle-close-outline",
          position: "middle",
          duration: 1500
        });
        return;
      }
      if (that.passWord === "") {
        Toast({
          message: "请输入密码",
          className: "toast-style",
          iconClass: "icon el-icon-circle-close-outline",
          position: "middle",
          duration: 1500
        });
        return;
      }

      that.axios
        .get("/UserManage.ashx", {
          params: {
            Action: "CheckLogin",
            username: that.userName,
            DingId: that.dingId,
            password: that.passWord
          }
        })
        .then(res => {
          // alert(JSON.stringify(res.data));
          if (parseInt(res.data.type) === 1) {
            // 登陆成功
            // 提示
            Toast({
              message: "登陆成功",
              className: "toast-style",
              iconClass: "icon el-icon-circle-check-outline",
              position: "middle",
              duration: 700
            });
            // 登陆跳转
            setTimeout(() => {
              // 设置到store中
              that.$store.commit("sessionuId", res.data.USER_ID); // 设置uId
              that.$store.commit("sessionuName", res.data.USER_NAME); // 设置uName
              that.$store.commit("setDingId", that.dingId); // 设置钉钉id到store
              // 跳转操作
              that.$router.push({ path: "/home" }); // 跳转到home页面
              // console.log(this.$store.state.uId);
              console.log(this.$store.state.uName);
            }, 800);
          } else {
            that.$store.commit("setDingId", ""); // 清空钉钉Id
            Toast({
              message: "账号或密码错误",
              className: "toast-style",
              iconClass: "icon el-icon-circle-check-outline",
              position: "middle",
              duration: 1000
            });
          }
        })
        .catch(function(err) {
          // alert(JSON.stringify(err));
        });
    }
  }
};
</script>

<style rel="stylesheet/scss"  scoped>
.app-container {
  overflow: hidden;
  height: 100%;
  position: relative;
  background-image: url("/static/img/start.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
}
.app-container i {
  font-style: normal;
}
.logo {
  width: 48%;
  margin: 0 auto;
  margin-top: 60px;
}
.logo img {
  display: block;
  width: 100%;
}
.login-box {
  width: 80%;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 10px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.3);
}
.form {
  padding: 16px 0;
  padding-right: 18px;
  position: relative;
}
.form .el-icon-view {
  position: absolute;
  right: 18px;
  bottom: 38px;
  color: #ccc;
  padding: 6px;
}
.login-box .submit {
  padding: 0 18px;
  padding-bottom: 28px;
}
.form .input-group {
  padding-left: 44px;
  position: relative;
}
.form .input-group .iconfont {
  font-size: 22px;
  color: #fff;
  position: absolute;
  top: 8px;
  left: 12px;
}
.start-page {
  width: 100%;
  height: 100%;
  background-image: url("/static/img/login.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  overflow: hidden;
  position: relative;
}
.mint-toast {
  z-index: 3100 !important;
}
</style>

