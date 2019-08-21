<template>
  <!-- <div class="p-box">
      <div class="p-inner">
        <img src="./../assets/images/bm-img01.png" />
        <img src="./../assets/images/bm-img02.png" />
        <img src="./../assets/images/bm-img03.png" />
        <img src="./../assets/images/bm-img04.png" />
      </div>
      <div class="bottom-nav">
        <div class="b-left">
          <p class="b-title" style="text-align:center;line-height:3rem">3人组团￥<span style="font-size: 38/@rem;font-weight: 700;line-height: 40/@rem;">199</span></p>
        </div>
        <div class="b-right" @click="purchase()">原价￥<span style="font-size: 38/@rem;font-weight: 700;line-height: 40/@rem;">299</span></div>
                  
      </div>
  </div>-->
  <div class="main">
    <div>
      <img class="mainImg" src="./../assets/images/learnApplyBg.png?222" alt>
    </div>
    <div class="bottom">
      <div class="botTop">
        <div>
          <p>关注粽子古文</p>
          <p>长按识别二维码</p>
          <p style="color:#000;margin-top:2vw;font-weight:600;font-size:1.1rem">七天无理由退款</p>
        </div>
        <div style="margin-left:3vw">
          <img src="./../assets/images/footerimg.jpg" alt>
        </div>
      </div>
      <!-- <div class="botMsg">
                <div class="botMsgItem">
                    <p>100天</p>
                    <p>粽子古文训练营</p>
                </div>
                <div>
                    <p>开课日期：<span class="time">9月4日</span></p>
                </div>
      </div>-->
    </div>

    <div class="footer">
      <div class="left footerleft">
        <p>100天粽子古文训练营</p>
        <p>
          <strike>￥198</strike>&nbsp; &nbsp;&nbsp; 优惠价:￥
          <span>158</span>
        </p>
      </div>
      <div class="right footerright" @click="purchase()">立即报名</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import wx from "weixin-js-sdk";
import qs from "qs";
export default {
  name: "vip-purchase",
  data() {
    return {
      courseId: ""
    };
  },
  mounted() {
    if (window.location.href.indexOf("?from=singlemessage") != -1) {
      let inviter_ids = window.location.href.split("inviter_id=")[1];
      if (inviter_ids) {
        //alert(inviter_ids);
        localStorage.setItem("inviter_id", inviter_ids);
      }
      window.location.href = "http://front.zongziguwen.com/#/VipPurchase";
    }
    if (window.location.href.indexOf("?from=groupmessage") != -1) {
      let inviter_ids = window.location.href.split("inviter_id=")[1];
      if (inviter_ids) {
        //alert(inviter_ids);
        localStorage.setItem("inviter_id", inviter_ids);
      }
      window.location.href = "http://front.zongziguwen.com/#/VipPurchase";
    }
    if (window.location.href.indexOf("?from=timeline") != -1) {
      let inviter_ids = window.location.href.split("inviter_id=")[1];
      if (inviter_ids) {
        // alert(inviter_ids);
        localStorage.setItem("inviter_id", inviter_ids);
      }
      window.location.href = "http://front.zongziguwen.com/#/VipPurchase";
    }
    //缓存中存在inviter_id说明是通过别人分享点进来的
    if (localStorage.getItem("inviter_id")) {
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
        });
    }
    alert(localStorage.getItem("inviter_id"));
    // let that = this;
    //获取最新发布的课程
    // axios
    //   .get(this.$store.state.baseUrlFront + "course/lastCourse")
    //   .then(reses => {
    //     console.log(reses);
    //     if (reses.data.data == undefined) {
    //       alert("最新一期的课程还没出来哦！");
    //     } else {
    //       that.courseId = reses.data.data.course_id;
    //     }
    //   });
    // alert(window.location.href);


    // if (this.$store.state.USER_ID == "" || this.$store.state.USER_ID == undefined) {
    //   window.location.href = this.$store.state.baseUrlFront + "qrCode/oauth_user2?type=1";
    // }
  },
  //   created() {
  //     //调用接口获取微信配置参数
  //     axios
  //       .get(this.$store.state.baseUrlFront + "courseware/getWxSignature", {
  //         params: {
  //           url: location.href
  //         }
  //       })
  //       .then(res => {
  //         console.log(res);
  //         let params = {
  //           debug: false,
  //           appId: res.data.signature.appId,
  //           timestamp: res.data.signature.timestamp,
  //           nonceStr: res.data.signature.nonceStr,
  //           signature: res.data.signature.signature,
  //           jsApiList: ["chooseWXPay"]
  //         };
  //         wx.config(params);
  //         wx.ready(function() {
  //           console.log("config信息验证完毕");
  //         });
  //         wx.error(function(res) {
  //           console.log("config配置出错");
  //         });
  //       });
  //   },
  methods: {
    purchase() {
      this.$router.push({ name: "PurchaseChoose2" });
    }
  }
};
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
  background-color: #fff8ea;
  padding-bottom: 20vw;
}
.mainImg {
  margin-top: 3.75vw;
  width: 100%;
}
.botTop {
  display: flex;
  justify-content: center;
  align-items: center;
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

.botMsg {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 2.5vw;
  width: 100%;
  height: 19.25vw;
  background: url("./../assets/images/learnApplyBg2.png") no-repeat center
    center;
  background-size: 100% 100%;
}
.botMsg div {
  width: 50%;
  color: #ffffff;
  font-size: 4vw;
  box-sizing: border-box;
}
.botMsg div:first-child {
  padding-left: 5vw;
}
.botMsgItem p {
  margin-right: 0.5rem;
  line-height: 5vw;
}
.botMsgItem p:first-child {
  font-size: 4.5vw;
}
.time {
  font-size: 4.8vw;
}

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 15vw;
  /* line-height: 1.2rem; */
  background-color: #ffffff;
  text-align: center;
  font-size: 4.375vw;
}
.footer .left {
  display: inline-block;
  width: 59%;
  color: #ea2038;
  line-height: 6vw;
}
.footer .right {
  display: inline-block;
  width: 39%;
  line-height: 15vw;
  background-color: #ee5466;
  color: #ffffff;
}
.footer span {
  font-size: 6vw;
}

.footerleft {
  position: absolute;
  top: 2.75vw;
  left: 0;
}
.footerright {
  position: absolute;
  right: 0;
}
.footerleft p {
  text-align: left;
  margin-left: 3.75vw;
}
</style>