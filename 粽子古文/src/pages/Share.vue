<template>
  <div class="main">
    <audio id="audio3" :src="audioSrc" style="display:none"></audio>
    <img class="finger" src="./../assets/images/finger.png" alt>
    <div class="header">每天学一点，名校近一点</div>
    <div class="cont">
      <div class="cont-header">
        <div class="userMsg">
          <img class="userImg" :src="headImgUrl" alt>
          <p class="userName">{{nickname}}</p>
        </div>
        <div class="learn">
          <p class="learnNum">{{learnDay}}</p>
          <span>学习天数</span>
          <!-- <p class="shareNum" style="font-size:4.75vw;color:#28915C;margin-top:3vw;">{{shareNum}}</p>
          <span>分享次数</span> -->
        </div>
      </div>

      <div class="todayLearn">
        <h3>我今天学了</h3>
        <p class="toLearnMsg">{{articleStr}}</p>
        <p class="tolearnTitle">{{"--<<"+articleTitle+">>"}}</p>
        <div class="myVoiceWrap" v-if="isMyVoice">
          <label>我的朗诵:</label>
          <div class="VoiceWrap">
            <!-- <img :src="waveImg" class="shareWave"> -->
            <div class="shareWave"></div>
            <img :src="playImg" class="sharePlay" @click="playRecord">
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="footerMsg">
          <p>请向朋友索取邀请码</p>
          <p>报名有优惠！</p>
        </div>
        <div class="footerImg">
          <img src="./../assets/images/footerimg.jpg" alt>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import wx from "weixin-js-sdk";
export default {
  name: "share",
  data() {
    return {
      nickname: "",
      headImgUrl: "",
      learnDay: 0,
      articleTitle: "",
      articleStr: "",
      // shareNum: 0,
      isMyVoice: false,
      audioSrc: "",
      playImg: require("./../assets/images/share_play.png"),
      isPlay: false,
      shareDates: ""
    };
  },
  mounted() {
    let USERID = localStorage.getItem("USER_ID");
    let relDate = "";
    let dates = this.getCurrentDate();
    if (window.location.href.split("USER_ID=").length == 2) {
      let str = window.location.href.split("USER_ID=")[1].split("A")[0];
      let str2 = window.location.href.split("USER_ID=")[1].split("A")[1];
      if (!(str == undefined)) {
        USERID = str;
        console.log(str);
      }
      if (!(str2 == undefined)) {
        this.shareDates = str2;
      }
    }
    axios
      .get(this.$store.state.baseUrlFront + "sign/listPersonal", {
        params: {
          USER_ID: USERID
        }
      })
      .then(res => {
        console.log(res);
        if (res.data.data == undefined) {
          //一次也没有打过卡
          relDate = "";
          axios
            .get(this.$store.state.baseUrlFront + "voice/getVoice", {
              params: {
                USER_ID: USERID
              }
            })
            .then(res => {
              //判断呢有没有录音频
              if (!(res.data.data == undefined)) {
                this.isMyVoice = true;
                this.audioSrc = res.data.data.voice_path;
              } else {
                this.isMyVoice = false;
              }
            });
          //获取今天学的课文
          axios
            .get(this.$store.state.baseUrlFront + "course/courseBuyed", {
              params: {
                USER_ID: USERID

              }
            })
            .then(reses => {
              console.log(reses);
              if (reses.status == 200) {
                let str = "";
                if (reses.data.data.courseware == undefined) {
                  this.articleTitle = "测一测"
                } else {
                  this.articleTitle = reses.data.data.courseware.title;
                }
                if (!(reses.data.data.courseware.article == undefined)) {
                  for (var i = 0; i < reses.data.data.courseware.article.length; i++) {
                    str += reses.data.data.courseware.article[i].sentence;
                  }
                } else if (!(reses.data.data.courseware.poemList[0] == undefined)) {
                  for (var i = 2; i < reses.data.data.courseware.poemList[0].article.length; i++) {
                    str += reses.data.data.courseware.poemList[0].article[i].sentence;
                  }
                } else {
                  str = "完成了测一测的所有题目!";
                }
                console.log(str);
                this.articleStr =
                  str.length <= 30
                    ? str.replace(/<\/?.*>/gi, "")
                    : str.substring(0, 30).replace(/<\/?.*>/gi, "") + "... ....";
              }
            });
        } else {
          relDate = this.shareDates == "" ? res.data.data[0].sign_date : this.shareDates;
          axios
            .get(this.$store.state.baseUrlFront + "voice/getVoice", {
              params: {
                USER_ID: USERID,
                date: relDate
              }
            })
            .then(res => {
              //判断呢有没有录音频
              if (!(res.data.data == undefined)) {
                this.isMyVoice = true;
                this.audioSrc = res.data.data.voice_path;
              } else {
                this.isMyVoice = false;
              }
            });
          //获取今天学的课文
          axios
            .get(this.$store.state.baseUrlFront + "course/courseBuyed", {
              params: {
                USER_ID: USERID,
                learnDate: relDate

              }
            })
            .then(reses => {
              console.log(reses);
              if (reses.status == 200) {
                let str = "";
                if (reses.data.data.courseware == undefined) {
                  this.articleTitle = "测一测"
                } else {
                  this.articleTitle = reses.data.data.courseware.title;
                }
                if (!(reses.data.data.courseware.article == undefined)) {
                  for (var i = 0; i < reses.data.data.courseware.article.length; i++) {
                    str += reses.data.data.courseware.article[i].sentence;
                  }
                } else if (!(reses.data.data.courseware.poemList == undefined)) {
                  for (var i = 2; i < reses.data.data.courseware.poemList[0].article.length; i++) {
                    str += reses.data.data.courseware.poemList[0].article[i].sentence;
                  }
                } else {
                  str = "完成了测一测的所有题目!";
                }
                console.log(str);
                this.articleStr =
                  str.length <= 30
                    ? str.replace(/<\/?.*>/gi, "")
                    : str.substring(0, 30).replace(/<\/?.*>/gi, "") + "... ....";
              }
            });

        }
      });

    //       //获取个人信息
    //          axios.get(
    //       this.$store.state.baseUrlFront+'qrCode/getPersonalInfo',
    //       {
    //         params: {
    //            USER_ID: USERID
    //         }
    //       }).then((res)=>{
    //         if(res.status==200){
    //           console.log(res) ;
    //           this.nickname=res.data.data.nickname;
    //           this.headImgUrl = res.data.data.headimgurl;
    //          // console.log("learnDay:"+res.data.data.days);
    //           //this.learnDay = parseInt(res.data.data.days)+1;
    //           this.learnDay = res.data.data.days;
    //         }
    //     })

    //获取朋友圈分享次数
    //获取个人信息
    // axios
    //   .get(this.$store.state.baseUrlFront + "wxinfo/shareShow", {
    //     params: {
    //       USER_ID: USERID
    //     }
    //   })
    //   .then(res => {
    //     if (res.status == 200) {
    //       console.log(res);
    //       this.shareNum = res.data.data.share_times;
    //     }
    //   });
  },
  created() {
    let that = this;
    let USERID = localStorage.getItem("USER_ID");
    let dates = localStorage.getItem("learnDate") == undefined ? localStorage.getItem("currentDate") : localStorage.getItem("learnDate");
    //点击别人分享链接的情况
    //获取别人分享的
    if (window.location.href.split("USER_ID=").length == 2) {
      let str = window.location.href.split("USER_ID=")[1].split("A")[0];
      let str2 = window.location.href.split("USER_ID=")[1].split("A")[1];
      if (!(str == undefined)) {
        USERID = str;
        console.log(str);
      }
      if (!(str2 == undefined)) {
        this.shareDates = str2;
        dates = str2;
      }
    }
    //获取个人信息
    axios
      .get(this.$store.state.baseUrlFront + "qrCode/getPersonalInfo", {
        params: {
          USER_ID: USERID
        }
      })
      .then(res => {
        if (res.status == 200) {
          console.log(res);
          this.nickname = res.data.data.nickname;
          this.headImgUrl = res.data.data.headimgurl;
          // console.log("learnDay:"+res.data.data.days);
          //this.learnDay = parseInt(res.data.data.days)+1;
          this.learnDay = res.data.data.days;
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
                jsApiList: [
                  "checkJsApi",
                  "onMenuShareTimeline",
                  "hideOptionMenu",
                  "onMenuShareAppMessage"
                ]
              };
              wx.config(params);
              wx.ready(function () {
                console.log("config信息验证完毕");
                //wx.hideOptionMenu();/***隐藏分享菜单****/
                wx.checkJsApi({
                  jsApiList: [
                    "getLocation",
                    "onMenuShareTimeline",
                    "onMenuShareAppMessage"
                  ],
                  success: function (res) {
                    //alert(res.errMsg);
                  }
                });

                wx.onMenuShareAppMessage({
                  title: "粽子古文",
                  desc:
                    "『粽子古文』，我已学习" + that.learnDay + "天。复旦名师指导，一线教师编写，古文学习好帮手",
                  link:
                    "http://front.zongziguwen.com/#/Share?USER_ID=" +
                    USERID + "A" + dates,
                  imgUrl:
                    "http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrT91xoVHLEEXDjw0e1YQ22ujEaeIX4bbc3znWoeVFZjTN/64",
                  trigger: function (res) {
                    //alert('用户点击发送给朋友');
                  },
                  success: function (res) {
                    //alert('分享成功啦!');
                  },
                  cancel: function (res) {
                    alert("已取消");
                  },
                  fail: function (res) {
                    // alert(res.errMsg);
                  }
                });

                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareTimeline({
                  title: "『粽子古文』，我已学习" + that.learnDay + "天。复旦名师指导，一线教师编写，古文学习好帮手",
                  desc: "『粽子古文』，我已学习" + that.learnDay + "天。复旦名师指导，一线教师编写，古文学习好帮手",
                  link:
                    "http://front.zongziguwen.com/#/Share?USER_ID=" +
                    USERID + "A" + dates,
                  imgUrl:
                    "http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrT91xoVHLEEXDjw0e1YQ22ujEaeIX4bbc3znWoeVFZjTN/64",
                  trigger: function (res) {
                    //alert('用户点击分享到朋友圈');

                  },
                  success: function (res) {
                    //alert('分享成功啦');
                    if (window.location.href.split("USER_ID=").length == 2 || localStorage.getItem("shareFlag")) {
                      //如果是别人分享的链接不算
                    } else {
                      axios
                        .get(
                          that.$store.state.baseUrlFront + "wxinfo/shareUpdate",
                          {
                            params: {
                              USER_ID: USERID,
                              type: 1
                            }
                          }
                        )
                        .then(reses => {
                          console.log(reses);
                          localStorage.setItem("shareFlag", "yes");
                        });
                    }
                  },
                  cancel: function (res) {
                    //alert('已取消');
                  },
                  fail: function (res) {
                    alert(res.errMsg);
                  }
                });
              });
              wx.error(function (res) {
                console.log("config配置出错");
              });
            });
        }
      });
  },
  methods: {
    goPurchase() {
      this.$router.push({ name: "Purchase" });
    },
    getCurrentDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (day >= 1 && day <= 9) {
        day = "0" + day;
      }
      let newStr = year + "-" + month + "-" + day;
      return newStr;
    },
    playRecord() {
      let that = this;
      let audio = $("#audio3")[0];
      if (this.isPlay == false) {
        audio.play();
        this.isPlay = true;
        this.playImg = require("./../assets/images/share_pause.png");
        $(".shareWave").addClass("myAnimationClass");
        audio.addEventListener("ended", function () {
          that.isPlay = false;
          that.playImg = require("./../assets/images/share_play.png");
          $(".shareWave").removeClass("myAnimationClass");
        });
      } else {
        audio.pause();
        this.isPlay = false;
        this.playImg = require("./../assets/images/share_play.png");
        $(".shareWave").removeClass("myAnimationClass");
      }
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
  font-family: tahoma, arial, "Hiragino Sans GB", "kaiti", simsun, sans-serif;
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
  left: 0;
  right: 0;
  padding: 6.125vw;
  background-color: #fff6e3;
}
.header {
  font-size: 5.5vw;
  font-weight: 600;
  text-align: center;
  font-family: heiti;
}
.finger {
  animation: eighth 0.8s infinite;
  width: 8vw;
  position: absolute;
  right: 4vw;
  top: 3vw;
}
.cont {
  position: relative;
  margin-top: 6.125vw;
  height: 92.7%;
  box-shadow: #dbdbdb 0px 0px 10px;
  border-radius: 3.125vw;
  background-color: #fff;
  background: url("./../assets/images/bg.png") no-repeat center center;
  background-size: 102% 102%;
}
.cont-header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 27%;
}
.cont-header div {
  width: 50%;
  text-align: center;
  /* background-color: #eeeeee;  */
}
.userImg {
  /* margin-top: 10%; */
  height: 21.25vw;
  width: 21.25vw;
  border: 0.125vw solid #eeeeee;
  border-radius: 10.625vw;
}
.userName {
  font-size: 4.125vw;
  margin-top: 2.5vw;
}
.learnNum {
  font-size: 4.75vw;
  color: #28915c;
}
.learn {
  border-left: 0.01rem solid #28915c;
}
.learn span {
  display: inline-block;
  margin-top: 5vw;
  width: 20.5vw;
  height: 6.25vw;
  line-height: 6.25vw;
  text-align: center;
  border: 0.125vw solid #28915c;
  border-radius: 1.25vw;
  font-size: 3.75vw;
}
.todayLearn {
  margin-top: 24%;
}
@media screen and (min-width: 768px) {
  .todayLearn {
    margin-top: 19%;
  }
}
@media screen and (min-width: 1024px) {
  .todayLearn {
    margin-top: 20%;
  }
}
.todayLearn h3 {
  text-align: center;
  font-size: 4.625vw;
  font-weight: 600;
  color: #28915c;
  margin-bottom: 3vw;
}
.toLearnMsg {
  text-indent: 2em;
  line-height: 6.25vw;
  font-size: 4.25vw;
  padding: 0 4vw;
}
.tolearnTitle {
  text-align: right;
  font-size: 4vw;
  padding: 2vw 4vw;
}
.footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6.25vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
@media screen and (min-width: 768px) {
  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2.25vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
@media screen and (min-width: 1024px) {
  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2.4vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
.footerImg img {
  width: 22.75vw;
  height: 22.75vw;
  margin-right: 3.75vw;
}
.footerMsg p {
  text-align: center;
  color: #fff;
  margin-left: 3.75vw;
}
.footerMsg p:first-child {
  font-size: 4vw;
}
.footerMsg p:last-child {
  margin-top: 2.5vw;
  font-size: 4.875vw;
}
.myVoiceWrap {
  position: relative;
}
.myVoiceWrap label {
  position: absolute;
  font-size: 1rem;
  left: 5vw;
  top: 3vw;
}
.myVoiceWrap .VoiceWrap {
  width: 48vw;
  height: 6vw;
  border-radius: 2vw;
  border: 1px solid #859c5b;
  position: absolute;
  left: 24vw;
  top: 2vw;
}
.VoiceWrap .shareWave {
  position: absolute;
  left: 3vw;
  top: 0.8vw;
  width: 3vw;
  height: 4vw;
  background-image: url(./../assets/images/share_wave3.png);
  background-size: 100% 100%;
}
.VoiceWrap .sharePlay {
  position: absolute;
  right: 3vw;
  width: 3vw;
  top: 1.2vw;
}
.myAnimationClass {
  animation: mySeventh 0.8s infinite;
}
@keyframes mySeventh {
  0% {
    background-image: url(./../assets/images/share_wave1.png);
    background-size: 100% 100%;
  }

  50% {
    background-image: url(./../assets/images/share_wave2.png);
    background-size: 100% 100%;
  }
  100% {
    background-image: url(./../assets/images/share_wave3.png);
    background-size: 100% 100%;
  }
}
@keyframes eighth {
  0% {
    transform: scale(1) rotate(-85deg);
  }
  50% {
    transform: scale(1.2) rotate(-85deg);
  }
  100% {
    transform: scale(0.8) rotate(-85deg);
  }
}
</style>