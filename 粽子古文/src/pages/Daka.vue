<template>
  <div class="daka-main">
    <div class="daka-cont">
      <img class="daka-contBg" src="./../assets/images/learnClockBg.png" alt>
      <div class="daka-imgGroup">
        <div>
          <img src="./../assets/images/learnClockleft.png" alt>
          <span class="daka-leftNum">{{cNum+"题"}}</span>
        </div>
        <div>
          <img src="./../assets/images/learnClockRight.png" alt>
          <span class="daka-rightNum">{{icNum+"题"}}</span>
        </div>
      </div>

      <div class="daka-btnGroup">
        <div>
          <button class="daka-butBack" @click="goBeforeLearn()">返回</button>
        </div>
        <div>
          <button class="daka-butClock" @click="daka()">打卡</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "daka",
  data() {
    return {
      cNum: 0,
      icNum: 0,
      dayType: 0
    };
  },
  mounted() {


    //查询打卡记录
    // axios
    //   .get(this.$store.state.baseUrlFront+"sign/listPersonal", {
    //     params: {
    //       USER_ID: localStorage.getItem("USER_ID")
    //     }
    //   })
    //   .then(res => {
    //     console.log(res);
    //  if(res.data.data==undefined){
    //     //一次也没有打过卡
    //  }else{
    //     if (res.data.data[0].state == "1") {
    //       //判断一下res.data.data[0].state == '1'
    //       //最新一天的打卡时间res.data.data[0].sign_date
    //       let date = new Date();
    //       let year = date.getFullYear();
    //       let month = date.getMonth() + 1;
    //       let day = date.getDate();
    //       if (month < 10) {
    //         month = "0" + month;
    //       }
    //       if (day < 10) {
    //         day = "0" + day;
    //       }
    //       let nowDate = year + "-" + month + "-" + day;
    //       if (nowDate == res.data.data[0].sign_date) {
    //         //状态为已打卡
    //         localStorage.setItem("isDaka","yes");
    //       }
    //     }
    //  }
    //   });
    //记录日历界面进入的日期或者当前日期
    let signDate =
      localStorage.getItem("learnDate") == undefined
        ? localStorage.getItem("currentDate")
        : localStorage.getItem("learnDate");
    //查询这个日期下是否打卡，并保存在缓存中!
    axios
      .get(this.$store.state.baseUrlFront + "sign/getSignNowDate", {
        params: {
          USER_ID: localStorage.getItem("USER_ID"),
          sign_date: signDate
        }
      })
      .then(res => {
        console.log(res);
        if (res.data.data.state == "0") {
          localStorage.removeItem("isDaka");
        } else {
          localStorage.setItem("isDaka", "yes");
        }
      });
    //判断signDate是周几
    var myDate = new Date(Date.parse(signDate));
    var dayStr = "日一二三四五六".charAt(myDate.getDay());
    if (dayStr == "日") {
      this.dayType = 2;
    } else if (dayStr == "六") {
      this.dayType = 1;
    } else {
      this.dayType = 0;
    }

    if (this.dayType == 0) {
      //普通天情况
      let allNum = 0;
      //发送请求获取练习
      axios
        .get(this.$store.state.baseUrlFront + "exercise/buyedExercise", {
          params: {
            USER_ID: localStorage.getItem("USER_ID"),
            learnDate: signDate
          }
        })
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            if (!(res.data.data == undefined)) {
              allNum = res.data.data.exerciseList.length;
              console.log("allNum:" + allNum)
              axios
                .get(
                  this.$store.state.baseUrlFront + "exercise/mistakeExercise",
                  {
                    params: {
                      USER_ID: localStorage.getItem("USER_ID"),
                      learnDate: signDate
                    }
                  }
                )
                .then(res => {
                  console.log(res);
                  if (res.status == 200) {
                    if (!(res.data.data == undefined)) {
                      console.log("wrongNum:" + res.data.data.exerciseList.length);
                      this.icNum = res.data.data.exerciseList.length;
                      this.cNum = allNum - this.icNum;
                    }
                  }
                });


            }
          }
        });
    } else if (this.dayType == 1) {
      //周六情况
      this.icNum = localStorage.getItem("icNum");
      this.cNum = localStorage.getItem("cNum");
    } else {
      //周日情况
      this.icNum = 0;
      this.cNum = 0;
    }

  },
  methods: {
    //跳转首页(BeforeLearn的方法
    goBeforeLearn() {
      if (localStorage.getItem("cram") == "yes") {
        this.$router.push({ name: "TabIndex" });
      } else {
        if (this.dayType == 0) {
          this.$router.push({ name: "BeforeLearn" });
        } else if (this.dayType == 1) {
          this.$router.push({ name: "Weekend" });
        } else {
          this.$router.push({ name: "Sunday" });
        }
      }

    },
    daka() {
      if (localStorage.getItem("isDaka") == undefined) {
        //没有打卡情况
        let signDates = localStorage.getItem("learnDate") == undefined ? localStorage.getItem("currentDate") : localStorage.getItem("learnDate");
        axios
          .get(this.$store.state.baseUrlFront + "course/logoutStudy", {
            params: {
              USER_ID: localStorage.getItem("USER_ID"),
              sign_date: signDates,
              sign_state: "1"
            }
          })
          .then(res => {
            localStorage.setItem("isDaka", "yes");
            if (this.dayType == 0) {
              //普通天打卡成功跳转
              this.$router.push({ name: "Share" });
            } else if (this.dayType == 1) {
              //周六打卡成功跳转
              this.$router.push({ name: "Compare" });
            } else {
              //周日打卡成功跳转
              this.$router.push({ name: "Share" });
            }
          });
      } else {
        if (localStorage.getItem("cram") == undefined) {
          //已经打过卡 && 非补课情况
          if (this.dayType == 0) {
            //普通天打卡成功跳转
            let flag = confirm("今天已经打过卡啦！前往分享?");
            if (flag == true) {
              this.$router.push({ name: "Share" });
            }
          } else if (this.dayType == 1) {
            //周六打卡成功跳转
            let flag = confirm("今天已经打过卡啦！前往分享?");
            if (flag == true) {
              this.$router.push({ name: "Share" });
            }
          } else {
            //周日打卡成功跳转
            let flag = confirm("今天已经打过卡啦！前往分享?");
            if (flag == true) {
              this.$router.push({ name: "Share" });
            }
          }
        } else {
          //已经打过卡 && 补课情况
          this.$router.push({ name: "TabIndex" });
        }

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
.daka-main {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fbf1dd;
  padding: 2.5vw;
}
.daka-cont {
  box-sizing: border-box;
  padding-top: 14.5vw;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 3.75vw;
}
@media screen and (min-width: 768px) {
  .daka-cont {
    box-sizing: border-box;
    padding-top: 4vw;
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 3.75vw;
  }
}
@media screen and (min-width: 1024px) {
  .daka-cont {
    box-sizing: border-box;
    padding-top: 8vw;
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 3.75vw;
  }
}
.daka-contBg {
  display: block;
  width: 76.5vw;
  height: 85.375vw;
  margin: 0 auto;
}

.daka-imgGroup {
  display: flex;
  justify-content: center;
  margin-top: 5.125vw;
}
@media screen and (min-width: 1024px) {
  .daka-imgGroup {
    display: flex;
    justify-content: center;
    margin-top: 2.875vw;
  }
}
.daka-imgGroup div {
  width: 30%;
  text-align: center;
}
.daka-imgGroup img {
  display: inline-block;
  width: 8.75vw;
  height: 8.125vw;
  /* vertical-align: middle; */
}
.daka-imgGroup span {
  display: inline-block;
  margin-left: 1.25vw;
  font-size: 4.25vw;
  vertical-align: middle;
}
.daka-leftNum {
  color: #45bb7f;
}
.daka-rightNum {
  color: #e8b77b;
}

.daka-btnGroup {
  display: flex;
  justify-content: space-around;
  margin-top: 12vw;
  padding-left: 2rem;
  padding-right: 2rem;
}
@media screen and (min-width: 768px) {
  .daka-btnGroup {
    display: flex;
    justify-content: space-around;
    margin-top: 2vw;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
@media screen and (min-width: 1024px) {
  .daka-btnGroup {
    display: flex;
    justify-content: space-around;
    margin-top: 2vw;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
.daka-btnGroup div {
  width: 50%;
  text-align: center;
}
.daka-btnGroup button {
  width: 27vw;
  height: 11.25vw;
  border-radius: 1.6rem;
  font-size: 4.625vw;
  font-family: "heiti";
}
.daka-butBack {
  background-color: #ffffff;
  border: 0.25vw solid #2b9c62;
  color: #2b9c62;
}
.daka-butClock {
  background-color: #45bb7f;
  color: #ffffff;
}
</style>
