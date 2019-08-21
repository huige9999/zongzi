<template>
  <div class="m-box">
    <div class="l-box">
      <!-- <img class="l-img01" src="./../assets/images/laugh-img01.png" />
        <div class="l-content-warp" style=" width:81vw;height: 10vw;overflow: hidden;">
        <div class="l-content">
          <p class="l-detail">
            {{tale}}
          </p>
          <div v-if="!(this.tale_answer=='')" class="answer-btn" @click="show_answer()">答案</div>
        </div>
      </div>-->
      <div class="laugh-main">
        <div class="laugh-cont">
          <img class="bg" src="../assets/images/laughbg.png" alt style="height:25vw">
          <img class="child1" src="../assets/images/laughchild.png" alt>
          <img class="child2" src="../assets/images/laughbgchild.png" alt>
          <img class="laughbg" src="../assets/images/laugh.png" alt>
          <!-- <div style="width:48vw;height:41vw"></div> -->
          <p>{{tale}}</p>
          <!-- <button v-if="!(this.tale_answer=='')" class="laugh-btn" @click="show_answer()">答&nbsp;案</button> -->
          <div v-if="!(this.tale_answer=='')" class="laugh-btn" @click="show_answer()">答案</div>
        </div>
        <!-- <div class="laugh-nextBox">
            <button  class="laugh-next">下一页</button>
        </div>-->
      </div>
      <div class="goods-div" style="background-color: #382509;width: 0.8vw;height: 4vw;"></div>
      <img
        src="./../assets/images/laugh_zongzi.png"
        style="height:26vw;margin-left:3vw"
        class="laughzongzi"
      >
    </div>
    <div class="mask" v-if="answer_off">
      <div class="tc-box">
        <p>{{tale_answer}}</p>
        <img @click="close_answer()" class="exit" src="./../assets/images/exit.png">
      </div>
    </div>
    <div class="control-btn" @click="go_Daka()" style="position:absolute;bottom:0">下一页</div>
  </div>
  <!-- </div> -->
</template>

<script>
import axios from "axios";
export default {
  name: "laugh",
  data() {
    return {
      tale: "",
      tale_answer: "",
      answer_off: false
    };
  },
  mounted() {
    //卷轴打开效果
    let divDom = document.querySelector(".bg");
    let heights = divDom.style.height;
    let heightVal = parseInt(heights.split("vw")[0]);
    var lineDom = document.querySelector(".goods-div");
    let times = setInterval(function () {
      heightVal++;
      divDom.style.height = heightVal + "vw";
      if (heightVal == 86) {
        clearInterval(times);
        //设置下拉粽子的弹跳效果
        lineDom.style.animationName = "myfirst";
        lineDom.style.animationDuration = "1s";
        lineDom.style.animationIterationCount = "3";
      }
    }, 10);
    this.tale = this.$store.state.ex_course.tale;
    this.tale_answer = this.$store.state.ex_course.tale_answer;
    console.log(this.$store.state.ex_course.tale);
  },
  methods: {
    show_answer() {
      this.answer_off = true;
    },
    close_answer() {
      this.answer_off = false;
    },
    go_Daka() {
      if (
        localStorage.getItem("isVip") == undefined ||
        localStorage.getItem("isVip") == ""
      ) {
        this.$router.push({ name: "TYindex" });
      } else {
        if (localStorage.getItem("learnDate") == undefined) {
          this.$router.push({ name: "Daka" });
        } else {
          //从日历界面进入
          if (localStorage.getItem("cram") == "yes") {
            //需要补课
            this.$router.replace("Daka");
          } else {
            this.$router.replace("TabIndex");
          }

        }
      }

    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.l-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mask {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  .postion(0, 0, 22);
  .tc-box {
    width: 700 / @rem;
    height: 82%;
    background: #c0a88c;
    border-radius: 18 / @rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .postion(28, 46, 122);
    z-index: 9999;
    p {
      color: green;
      font-size: 2rem;
      display: flex;
      align-items: center;
      height: 79%;
    }
    .exit {
      width: 56 / @rem;
      height: 56 / @rem;
      position: absolute;
      left: 320 / @rem;
      bottom: 52 / @rem;
    }
    .control-btn {
      margin-top: 60 / @rem;
    }
  }
}
</style>
<style>
@keyframes myfirst {
  0% {
    /*transform: translate(0px, 0px);*/
    height: 4vw;
  }
  50% {
    /*transform: translate(0px, 30px);*/
    height: 11vw;
  }
  100% {
    /*transform: translate(0px, 0px);*/
    height: 4vw;
  }
}
</style>
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
  font-family: tahoma, arial, "Hiragino Sans GB", "heiti", simsun, sans-serif;
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
.laugh-main {
  background-color: #fff6e3;
}
@media screen and (min-width: 768px) {
  .laugh-main {
    background-color: #fff6e3;
    transform: scale(0.8);
  }
}
.goods-div {
  margin-left: 10%;
  margin-top: 3vw;
}
@media screen and (min-width: 768px) {
  .goods-div {
    margin-left: 7%;
    margin-top: -18vw;
    transform: scale(0.8);
    margin-bottom: -1.8rem;
  }
}
@media screen and (min-width: 768px) {
  .laughzongzi {
    transform: scale(0.5);
  }
}
.laugh-cont {
  position: relative;
  top: 0.95rem;
  width: 94vw;
  margin: 0 auto;
  overflow: hidden;
}
@media screen and (min-width: 768px) {
  .laugh-cont {
    position: relative;
    top: -2rem;
    width: 94vw;
    margin: 0 auto;
    overflow: hidden;
  }
}
.bg {
  width: 85%;
  margin-left: 7%;
  margin-top: 20vw;
}
.child1 {
  position: absolute;
  top: 20px;
  left: -2vw;
  width: 86vw;
}
.child2 {
  z-index: 5;
  position: absolute;
  top: 5vw;
  left: 31vw;
  width: 28vw;
}
.laughbg {
  z-index: 5;
  position: absolute;
  top: 29vw;
  left: 26vw;
  width: 40vw;
}
.laugh-cont p {
  margin-left: 18.7vw;
  width: 56vw;
  height: 57vw;
  overflow: scroll;
  font-size: 1.2rem;
  line-height: 1.7rem;
  text-align: justify;
  position: absolute;
  top: 42vw;
}

.laugh-btn {
  position: absolute;
  z-index: 10;
  margin-left: 33.3vw;
  width: 19vw;
  height: 7vw;
  border-radius: 2.28rem;
  background-color: #7bd6a7;
  color: #ffffff;
  font-family: "heiti";
  box-shadow: #65af89 0px 0px 10px;
  text-indent: 1.2rem;
  top: 21rem;
  line-height: 7vw;
  font-size: 3em;
  text-indent: 1.2rem;
  letter-spacing: 0.6rem;
}
</style>