<template>
  <div class="main">
    <div class="shade" v-if="isActive" @click="pops"></div>
    <div class="pop" v-if="isActive" @click="pops">
      <img src="../assets/images/pop.png" alt id="popimg" />
    </div>
    <div class="cont">
      <div class="header">
        <p>
          <img src="../assets/images/logoBg.png" style="width:89vw;height:47vw" />
        </p>
        <p style="position:absolute;margin-left: 50%;transform: translateX(-50%);top: 27vw;">
          <span>{{withdraw}}</span>元
        </p>
        <a>可提现金额</a>
      </div>

      <div class="bottBox">
        <div class="middle">
          <div class="left midItem">
            <div
              @click="goRuleDetail"
              class="ruleDetail"
              style="height:7vw;color:rgb(60,187,127);border-radius:6vw;font-size:4.125vw;"
            >
              <label class="ruleLabel">规则详情</label>
            </div>
            <div>
              <button class="btnGroup" @click="withdrawMoney" style="margin-top:13vw">提现</button>
            </div>
          </div>
          <div class="right midItem">
            <div>
              <p>已购买</p>
              <!-- <div><span>{{count1}}</span><i>|</i><span>{{count2}}</span></div> -->
              <div>
                <span>{{inviteBuyNum}}</span>
              </div>
            </div>
            <div>
              <button class="btnGroup" @click="pops">邀请朋友</button>
            </div>
          </div>
        </div>
        <div class="voucher-warp" v-if="discount!=0">
          <img src="./../assets/images/discount.png" class="dcImg" />
        </div>
        <div class="botTop" v-bind:class="{ active: btnTrans }">
          <div>
            <p>关注粽子古文</p>
            <p>长按识别二维码</p>
          </div>
          <div style="margin-left:3vw">
            <img src="./../assets/images/footerimg.jpg" />
          </div>
        </div>
        <!-- <div class="footer">
                        <a href="http://front.zongziguwen.com/#/Rule">规则详情</a>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import wx from 'weixin-js-sdk';
import qs from "qs";
export default {
  name: "sale-invite",
  data() {
    return {
      inviteBuyNum: 0,
      withdraw: 0,
      isActive: false,
      discount: 0,
      nickname: "",
      btnTrans: false,
      withdrawLock: false,
      tipShow:false
    }
  },
  created() {
    let that = this;
    axios.get(
      this.$store.state.baseUrlFront + 'qrCode/getPersonalInfo',
      {
        params: {
          USER_ID: localStorage.getItem("USER_ID")
        }
      }).then((res) => {
        if (res.status == 200) {
          console.log(res);
          //昵称赋值(用于分享)
          that.nickname = res.data.data.nickname;
          //调用接口获取微信配置参数
          axios
            .get(this.$store.state.baseUrlFront + "courseware/getWxSignature", {
              params: {
                url: location.href
              }
            })
            .then(res => {
              console.log(res);
              let params = {
                debug: false,
                appId: res.data.signature.appId,
                timestamp: res.data.signature.timestamp,
                nonceStr: res.data.signature.nonceStr,
                signature: res.data.signature.signature,
                jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'hideOptionMenu', 'onMenuShareAppMessage']
              };
              wx.config(params);
              wx.ready(function () {
                console.log("config信息验证完毕");
                wx.checkJsApi({
                  jsApiList: [
                    'getLocation',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                  ],
                  success: function (res) {
                  }
                });

                wx.onMenuShareAppMessage({
                  title: '粽子古文',
                  desc: '你的朋友' + that.nickname + '正在学习『粽子古文』，点一点，有优惠；转一转，免费学!',
                  link: 'http://front.zongziguwen.com/#/Invite?inviter_id=' + localStorage.getItem("USER_ID"),
                  imgUrl: 'http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrT91xoVHLEEXDjw0e1YQ22ujEaeIX4bbc3znWoeVFZjTN/64',
                  trigger: function (res) {
                    //alert('用户点击发送给朋友');
                    if(that.tipShow){
                      alert("邀请朋友功能需要是会员才可以哦!");
                    }
                  },
                  success: function (res) {
                    alert('分享成功啦!');
                  },
                  cancel: function (res) {
                    alert('已取消');
                  },
                  fail: function (res) {
                    //alert(res.errMsg);
                  }
                });

                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareTimeline({
                  title: '你的朋友' + that.nickname + '正在学习『粽子古文』，点一点，有优惠；转一转，免费学!',
                  desc: '你的朋友' + that.nickname + '正在学习『粽子古文』，点一点，有优惠；转一转，免费学!',
                  link: 'http://front.zongziguwen.com/#/Invite?inviter_id=' + localStorage.getItem("USER_ID"),
                  imgUrl: 'http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrT91xoVHLEEXDjw0e1YQ22ujEaeIX4bbc3znWoeVFZjTN/64',
                  trigger: function (res) {
                    //alert('用户点击分享到朋友圈');
                     if(that.tipShow){
                      alert("邀请朋友功能需要是会员才可以哦!");
                    }
                  },
                  success: function (res) {
                    alert('分享成功啦');

                  },
                  cancel: function (res) {
                    //alert('已取消');
                  },
                  fail: function (res) {
                    // alert(res.errMsg);
                  }
                });

              });
              wx.error(function (res) {
                console.log("config配置出错")
              });
            });
        }
      })

  },
  mounted() {
    //获取url中的saleId
    // let str=window.location.href.split("sale_id=")[1];
    // if(!(str==undefined || str=="")){
    //    localStorage.setItem("SALE_ID",str);
    // }
    let that = this;
    //获取邀请者的基本信息
    axios
      .get(this.$store.state.baseUrlFront + "wxinfo/checkBuyed", {
        params: { USER_ID: localStorage.getItem("USER_ID") }
      })
      .then(res => {
        console.log(res);
        if (!(res.data.data.has_course == 1)) {
          //alert("邀请朋友功能需要是会员才可以哦!");
          that.tipShow = true;
        }
      })

    //点击别人分享的链接情况
    //从链接地址中取出inviter_id存放缓存
    if (window.location.href.indexOf("?from=singlemessage") != -1) {
      let inviter_ids = window.location.href.split("inviter_id=")[1];
      if (inviter_ids) {
        // alert("1111:"+inviter_ids);
        localStorage.setItem("inviter_id", inviter_ids);
      }
      window.location.href = "http://front.zongziguwen.com/#/Invite";
    }
    if (window.location.href.indexOf("?from=groupmessage") != -1) {
      let inviter_ids = window.location.href.split("inviter_id=")[1];
      if (inviter_ids) {
        //  alert("333"+inviter_ids);
        localStorage.setItem("inviter_id", inviter_ids);
      }
      window.location.href = "http://front.zongziguwen.com/#/Invite";
    }
    if (window.location.href.indexOf("?from=timeline") != -1) {
      let inviter_ids = window.location.href.split("inviter_id=")[1];
      if (inviter_ids) {
        //  alert("222"+inviter_ids);
        localStorage.setItem("inviter_id", inviter_ids);
      }
      window.location.href = "http://front.zongziguwen.com/#/Invite";
    }
    //缓存中存在inviter_id说明是通过别人分享点进来的
    if (localStorage.getItem("inviter_id") && !(localStorage.getItem("inviter_id") == "undefined")) {
      //被邀请者绑定邀请者
      axios
        .post(
          this.$store.state.baseUrlFront + "invite/saveInviter",
          qs.stringify({
            USER_ID: localStorage.getItem("USER_ID"),
            inviter_id: localStorage.getItem("inviter_id")
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          console.log(res);
          localStorage.removeItem("inviter_id");
        }).catch(err => {
        });
    }
    //获取邀请者的基本信息
    axios
      .get(this.$store.state.baseUrlFront + "invite/inviterInfo", {
        params: { USER_ID: localStorage.getItem("USER_ID") }
      })
      .then(res => {
        console.log(res);
        if (!(res.data.data == undefined)) {
          this.inviteBuyNum = res.data.data.inviteBuyNum;
          this.withdraw = res.data.data.withdraw;
          this.discount = res.data.data.discount;
          if (res.data.data.discount != 0) {
            //有优惠券情况
            this.btnTrans = false;
          } else {
            //没有优惠券情况
            this.btnTrans = true;
          }
        }

      })

  },
  methods: {
    pops() {
      this.isActive = !this.isActive
    },
    withdrawMoney() {
      let that = this;
      if (this.withdraw == 0) {//账户没有金额可提现
        alert("当前没有可提现金额");
      } else {
        if (this.withdrawLock == false) {
          this.withdrawLock = true;
          axios
            .post(
              this.$store.state.baseUrlFront + "money/withdrawMoney",
              qs.stringify({
                USER_ID: localStorage.getItem("USER_ID"),
                totalfee: this.withdraw
              }),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }
            )
            .then(res => {
              console.log(res);
              if (res.data.data == "SUCCESS") {
                alert("提现成功!");
                that.withdraw = 0;
                that.withdrawLock = false;
                location.reload();
              } else {
                alert("提现失败!");
                that.withdrawLock = false;
              }

            }).catch(err => {
              alert("出错啦!");
            });
        }

      }
    },
    goRuleDetail() {
      location.href = "http://front.zongziguwen.com/#/Rule";
    }
  }
}
</script>
<style scoped>
@charset "utf-8";
html {
  background-color: #fff;
  color: #000;
  font-size: 12px;
}
body,
ul,
ol,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
figure,
form,
fieldset,
legend,
input,
textarea,
button,
p,
blockquote,
th,
td,
pre,
xmp {
  margin: 0;
  padding: 0;
}
body,
input,
textarea,
button,
select,
pre,
xmp,
tt,
code,
kbd,
samp {
  line-height: 1.5;
  font-family: tahoma, arial, "Hiragino Sans GB", simsun, sans-serif;
}
h1,
h2,
h3,
h4,
h5,
h6,
small,
big,
input,
textarea,
button,
select {
  font-size: 100%;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: tahoma, arial, "Hiragino Sans GB", "微软雅黑", simsun, sans-serif;
}
h1,
h2,
h3,
h4,
h5,
h6,
b,
strong {
  font-weight: normal;
}
address,
cite,
dfn,
em,
i,
optgroup,
var {
  font-style: normal;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
  text-align: left;
}
caption,
th {
  text-align: inherit;
}
ul,
ol,
menu {
  list-style: none;
}
fieldset,
img {
  border: 0;
}
img,
object,
input,
textarea,
button,
select {
  vertical-align: middle;
}
article,
aside,
footer,
header,
section,
nav,
figure,
figcaption,
hgroup,
details,
menu {
  display: block;
}
audio,
canvas,
video {
  display: inline-block;
  *display: inline;
  *zoom: 1;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "\0020";
}
textarea {
  overflow: auto;
  resize: vertical;
}
input,
textarea,
button,
select,
a {
  outline: 0 none;
  border: none;
}
button::-moz-focus-inner,
input::-moz-focus-inner {
  padding: 0;
  border: 0;
}
mark {
  background-color: transparent;
}
a,
ins,
s,
u,
del {
  text-decoration: none;
}
sup,
sub {
  vertical-align: baseline;
}
html {
  overflow-x: hidden;
  height: 100%;
  font-size: 50px;
  -webkit-tap-highlight-color: transparent;
}
body {
  font-family: Arial, "Microsoft Yahei", "Helvetica Neue", Helvetica, sans-serif;
  color: #333;
  font-size: 0.28em;
  line-height: 1;
  -webkit-text-size-adjust: none;
}
hr {
  height: 0.02rem;
  margin: 0.1rem 0;
  border: medium none;
  border-top: 0.02rem solid #cacaca;
}
a {
  color: #363636;
  text-decoration: none;
}
.hade {
  display: none;
}
</style>
<style scoped>
.main {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #f0efee;
}
.shade {
  position: absolute;
  z-index: 1;
  background-color: black;
  opacity: 0.3;
  width: 100%;
  height: 100%;
}
.pop {
  position: absolute;
  z-index: 2;
  width: 400px;
  left: 35vw;
}
#popimg {
  width: 54%;
}
.cont {
  height: 100%;
  width: 100%;
  background: url("./../assets/images/invite.png") no-repeat center center;
  background-size: 100% 100%;
  text-align: center;
}

.header {
  color: #45bb7f;
}
.header span {
  margin-left: 5vw;
  margin-right: 2.5vw;
  font-size: 12.5vw;
  color: #ff9c01;
}
.header a {
  display: inline-block;
  margin-top: 1.875vw;
  color: #45bb7f;
  font-size: 3vw;
  text-decoration: none;
  position: absolute;
  top: 44vw;
  transform: translateX(-50%);
}
.bottBox {
  position: fixed;
  bottom: 4%;
  right: 0;
  left: 0;
  height: 50%;
}
.middle {
  display: flex;
  justify-content: space-around;
}
.midItem p {
  font-size: 3.75vw;
  margin-bottom: 2.5vw;
  color: #888888;
}
.midItem span {
  color: #ff9c01;
  font-size: 5vw;
}
.right i {
  position: relative;
  bottom: 1vw;
  margin: 1.25vw;
}
.right span:first-child {
  color: #45bb7f;
}
.btnGroup {
  margin-top: 2.4rem;
  width: 24.625vw;
  height: 12vw;
  background-color: #45bb7f;
  color: #ffffff;
  border-radius: 6vw;
  font-size: 4.125vw;
  font-family: heiti;
}
.footer {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}
.footer a {
  color: #000;
  text-decoration: underline;
  font-size: 1.2rem;
}
.voucher-warp {
  display: flex;
  background-color: #eedea0;
  justify-content: center;
}
.voucher-left {
  width: 35vw;
  height: 15vw;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #c70319;
  color: #fff;
}
.voucher-right {
  font-size: 1.4rem;
  width: 20vw;
  height: 15vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eedea0;
  color: red;
}
.dcImg {
  width: 32vw;
  height: 17vw;
}
.ruleLabel {
  animation: ruleAni 1s infinite;
  -webkit-animation: ruleAni 1s infinite;
}
@keyframes ruleAni {
  0% {
    font-size: 4.125vw;
  }
  50% {
    font-size: 5.125vw;
  }
  100% {
    font-size: 4.125vw;
  }
}
</style>
<style scoped>
.botTop {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 30vw;
  top: 4vw;
  background-image: url("../assets/images/bt-bg.png");
  background-size: 100% 100%;
}
.botTop p {
  margin-right: 0.3rem;
  font-family: "heiti";
  text-align: center;
  color: #45bb7f;
}
.botTop p:first-child {
  font-size: 4.975vw;
}
.botTop p:last-child {
  font-size: 3.5vw;
  line-height: 6.25vw;
}
.botTop img {
  width: 25vw;
  height: 25vw;
}
.active {
  top: 22vw;
}
</style>
