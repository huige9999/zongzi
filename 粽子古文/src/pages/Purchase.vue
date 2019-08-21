<template>
  <div class="main">
    <div>
      <img class="mainImg" src="./../assets/images/learnApplyBg.png?222" alt>
    </div>
    <div class="bottom">
      <div class="botTop">
        <div style="padding-top:3vw">
          <p>关注粽子古文</p>
          <p style="line-height:5vw">长按识别二维码</p>
        </div>
        <div style="margin-left:3vw">
          <img src="./../assets/images/footerimg.jpg" alt>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="left" @click="purchase()">
        <!-- <p><strike>原价￥299</strike> &nbsp;特别活动价 ￥<span>99</span></p> -->
        <p>粽子古文100天 ￥198</p>
        <!-- <p><strike style="margin-left:4vw">￥198</strike> &nbsp; &nbsp;&nbsp; 优惠价:￥<span>158</span></p> -->
        <p>朋友推荐价￥158</p>
      </div>
      <div class="right" style="font-size:1rem">
        <p>开课时间:{{enroll_starttime}}</p>
        <p>报名截止:{{enroll_endtime}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import wx from "weixin-js-sdk";
export default {
  name: "purchase",
  data() {
    return {
      courseId: "",
      enroll_starttime: '',
      enroll_endtime: ''
    };
  },
  mounted() {
    axios.get(this.$store.state.baseUrlFront + 'test/showEnrollInfo').then((res) => {
      console.log(res);
      this.enroll_endtime = res.data.data.enroll_endtime;
      this.enroll_starttime = res.data.data.enroll_starttime;
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    purchase() {
      this.$router.push({ name: "PurchaseChoose" });
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
  font-family: "楷体";
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
  display: flex;
}
.footer .left {
  display: inline-block;
  width: 62%;
  color: #fff;
  background-color: #ee5466;
  line-height: 6vw;
  margin-left: -4vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.footer .right {
  display: inline-block;
  width: 41%;
  color: #ea2038;
  display: flex;
  flex-direction: column;
  line-height: 7vw;
  justify-content: center;
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