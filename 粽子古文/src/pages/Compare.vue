<template>
  <div class="compare-container">
    <img class="finger" src="./../assets/images/finger.png" alt>
    <div class="compare-up">
      <img src="./../assets/images/fenshu_compare.png">
      <img :src="levelImg" style="width:19vw;position:absolute;left:37vw;top:14vw;">
      <label style="position:absolute;right:40vw;top:29vw;color:white;font-size:1.5rem">{{trueNum}}</label>
    </div>
    <div class="compare-down">
      <div class="user-item" v-for="item,index in userList" :key="index">
        <div class="user-item-left">
          <img :src="item.headimgurl">
          <span style="text-indent:1vw">{{item.nickname}}</span>
        </div>
        <div class="user-item-right">正确数:{{item.true_num}}</div>
      </div>
    </div>
    <!-- <button class="control-btn" @click="daka()" v-if="showDaka==true">打卡</button> -->
  </div>
</template>

<script>
import axios from "axios";
import wx from "weixin-js-sdk";
import qs from "qs";
export default {
  name: "compare",
  data() {
    return {
      userList: "",
      levelImg: "",
      trueNum: "",
      learnDay: 0,
      showDaka: true,
      testid: "",
      dates: "",
      USERID: ""
    };
  },
  created() {
    let that = this;
    let USERID = localStorage.getItem("USER_ID");
    this.testid = localStorage.getItem("testid");
    //this.trueNum = localStorage.getItem("cNum");
    this.dates = localStorage.getItem("learnDate") == undefined ? localStorage.getItem("currentDate") : localStorage.getItem("learnDate");
    if (window.location.href.split("USER_ID=").length == 2) {
      let str1 = window.location.href.split("USER_ID=")[1];
      this.USERID = str1.split("A")[0];
      this.testid = str1.split("A")[1].split("B")[0];
      this.dates = str1.split("A")[1].split("B")[1].split("C")[0];
      this.trueNum = str1.split("A")[1].split("B")[1].split("C")[1]
      console.log("USERID:" + this.USERID);
      console.log("testid:" + this.testid);
      console.log("dates:" + this.dates);
      console.log("trueNum:" + this.trueNum);
    } else {
      this.USERID = USERID;
      this.trueNum = localStorage.getItem("cNum");
    }
    //获取个人信息
    axios
      .get(this.$store.state.baseUrlFront + "qrCode/getPersonalInfo", {
        params: {
          USER_ID: this.USERID
        }
      })
      .then(res => {
        if (res.status == 200) {
          console.log(res);
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
                  desc: "『粽子古文』，我已学习" + that.learnDay + "天。复旦名师指导，一线教师编写，古文学习好帮手",
                  link:
                    "http://front.zongziguwen.com/#/Compare?USER_ID=" +
                    that.USERID + "A" + that.testid + "B" + that.dates + "C" + that.trueNum,
                  imgUrl:
                    "http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrTy0rZEwxmUTHbNvIpgP9AibOj1Ss9Hnh0icjJMBpB1eBd1/64",
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
                    "http://front.zongziguwen.com/#/Compare?USER_ID=" +
                    that.USERID + "A" + that.testid + "B" + that.dates + "C" + that.trueNum,
                  imgUrl:
                    "http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrTy0rZEwxmUTHbNvIpgP9AibOj1Ss9Hnh0icjJMBpB1eBd1/64",
                  trigger: function (res) {
                    //alert('用户点击分享到朋友圈');
                  },
                  success: function (res) {
                    //alert('分享成功啦');
                    axios
                      .get(
                        that.$store.state.baseUrlFront + "wxinfo/shareUpdate",
                        {
                          params: {
                            USER_ID: localStorage.getItem("USER_ID"),
                            type: 1
                          }
                        }
                      )
                      .then(reses => {
                        console.log(reses);
                      });
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
  mounted() {

    if (localStorage.getItem("cram") == "yes") {
      //补课情况下
      axios
        .post(
          this.$store.state.baseUrlFront + "module/saveModule",
          qs.stringify({
            USER_ID: localStorage.getItem("USER_ID"),
            date: localStorage.getItem("learnDate"),
            module: "cb",
            activemodule: "b"
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          console.log(res);
        });
    } else {
      if (localStorage.getItem("learnDate") == undefined) {
        //正常学习情况
        localStorage.setItem("compareCompleted", "yes");
        axios
          .post(
            this.$store.state.baseUrlFront + "module/saveModule",
            qs.stringify({
              USER_ID: localStorage.getItem("USER_ID"),
              date: localStorage.getItem("currentDate"),
              module: "cb",
              activemodule: "b"
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          )
          .then(res => {
            console.log(res);
          });
      }
    }

    //保存用户答对题目数(如果传的true_num为空后台不保存)
    // this.getLevelImg(this.$store.state.cNum);
    // this.trueNum = this.$store.state.cNum;
    let that = this;
    let times = localStorage.getItem("learnDate") == undefined ? localStorage.getItem("currentDate") : localStorage.getItem("learnDate");
    //从url中获取times和userid和testid
    if (window.location.href.split("USER_ID=").length == 2) {
      let str1 = window.location.href.split("USER_ID=")[1];
      this.USERID = str1.split("A")[0];
      this.testid = str1.split("A")[1].split("B")[0];
      this.dates = str1.split("A")[1].split("B")[1].split("C")[0];
      this.trueNum = str1.split("A")[1].split("B")[1].split("C")[1]
      console.log("USERID:" + this.USERID);
      console.log("testid:" + this.testid);
      console.log("dates:" + this.dates);
      console.log("trueNum:" + this.trueNum);
    } else {
      this.trueNum = localStorage.getItem("cNum");
    }


    //发送请求获取学员测一测信息
    axios
      .get(this.$store.state.baseUrlFront + "test/listRank", {
        params: {
          USER_ID: this.USERID == "" ? localStorage.getItem("USER_ID") : this.USERID,
          time: this.dates == "" ? times : this.dates

        }
      })
      .then(res => {
        console.log("1111111:");
        console.log(res);
        if (res.status == 200) {
          that.userList = res.data.data;
          //获取test_id，并借此获取用户的答对数
          axios
            .get(this.$store.state.baseUrlFront + "wxinfo/findUserInfo", {
              params: { USER_ID: this.USERID == "" ? localStorage.getItem("USER_ID") : this.USERID }
            })
            .then(res => {
              console.log("22222222:");
              console.log(res);
              axios
                .get(this.$store.state.baseUrlFront + "test/list", {
                  params: {
                    // course_id: res.data.data.course_id,
                    USER_ID: localStorage.getItem("USER_ID"),
                    test_time: this.dates == "" ? times : this.dates
                  }
                })
                .then(res => {
                  console.log("3333333:");
                  console.log(res);
                  if (res.status == 200) {
                    //测试用-假设已经成功获取到正确答题数
                    // this.trueNum = 30;
                    // this.getLevelImg(this.trueNum);
                    axios
                      .get(this.$store.state.baseUrlFront + "test/personalTest", {
                        params: {
                          USER_ID: this.USERID == "" ? localStorage.getItem("USER_ID") : this.USERID,
                          test_id: res.data.data.test_id
                        }
                      })
                      .then(res => {
                        //test
                        console.log("444444444:");
                        console.log(res.data.data.true_num);
                        //测试用-假设已经成功获取到正确答题数
                        this.trueNum = res.data.data.true_num || 0;
                        //this.trueNum = 30;
                        this.getLevelImg(this.trueNum);
                      })

                  }
                });
            })


        }
      });
  },
  methods: {
    getLevelImg(score) {
      if (score >= 26 && score <= 30) {
        this.levelImg = require("./../assets/images/youxi.png");
      } else if (score >= 21 && score <= 25) {
        this.levelImg = require("./../assets/images/lianghao.png");
      } else if (score >= 16 && score <= 20) {
        this.levelImg = require("./../assets/images/hege.png");
      } else {
        this.levelImg = require("./../assets/images/xunuli.png");
      }
    },
    // goNext(){
    //       if (localStorage.getItem("learnDate") == undefined) {
    //         //非日历界面进入
    //         if (localStorage.getItem("isDaka") == undefined) {
    //           //今天没有打卡
    //             this.$router.replace("Daka");

    //         } else {
    //             this.$router.replace("Weekend");
    //         }
    //       } else {
    //         if(localStorage.getItem("cram")=="yes"){
    //             if (localStorage.getItem("isDaka") == undefined) {
    //           //今天没有打卡
    //             this.$router.replace("Daka");

    //         } else {
    //             this.$router.replace("TabIndex");
    //         }
    //         }else{
    //            //日历界面进入
    //           this.$router.replace("TabIndex");
    //         }

    //       }
    // }
    //   daka(){
    //     if(localStorage.getItem("learnDate")==undefined){
    //       //非日历界面进入
    //       if(localStorage.getItem("isDaka")=="yes"){
    //          alert("今天已经打过卡啦!");
    //          this.$router.push({ name: "Weekend" });
    //       }else{
    //                  axios
    //         .get(this.$store.state.baseUrlFront + "course/logoutStudy", {
    //           params: {
    //             USER_ID: localStorage.getItem("USER_ID"),
    //             sign_date: localStorage.getItem("currentDate"),
    //             sign_state: "1"
    //           }
    //         })
    //         .then(res => {
    //           alert("打卡成功!");
    //           localStorage.setItem("isDaka", "yes");
    //           //跳转到首页
    //             this.$router.push({ name: "Weekend" });
    //         });
    //       }
    //     }else{
    //        if(localStorage.getItem("cram")=="yes"){
    //             if(localStorage.getItem("isDaka")=="yes"){
    //          alert("今天已经打过卡啦!");
    //          this.$router.push({ name: "TabIndex" });
    //       }else{
    //                  axios
    //         .get(this.$store.state.baseUrlFront + "course/logoutStudy", {
    //           params: {
    //             USER_ID: localStorage.getItem("USER_ID"),
    //             sign_date: localStorage.getItem("learnDate"),
    //             sign_state: "1"
    //           }
    //         })
    //         .then(res => {
    //             alert("打卡成功!");
    //           localStorage.setItem("isDaka", "yes");
    //           //跳转到首页
    //             this.$router.push({ name: "TabIndex" });
    //         });
    //       }

    //        }else{
    //            this.$router.push({ name: "TabIndex" });
    //        }

    //     }
    // }
  }
};
</script>

<style scoped>
.compare-container {
  width: 100vw;
  height: 100vh;
  background-color: #fff6e3;
}
.compare-container .compare-up {
  width: 100%;
  height: 45%;
  text-align: center;
}
.compare-up img {
  width: 67vw;
  margin-top: 3vw;
}
.compare-container .compare-down {
  width: 100%;
  height: 46%;
  overflow: scroll;
  font-size: 1.2rem;
  margin-top: 7vw;
}
.compare-down .user-item {
  width: 90%;
  height: 12vw;
  border-radius: 5vw;
  margin: 0 auto;
  background-color: white;
  margin-top: 3vw;
}
.user-item .user-item-left {
  width: 50%;
  height: 100%;
  float: left;
  display: flex;
  align-items: center;
}
.user-item-left img {
  border-radius: 50%;
  width: 11vw;
  margin-left: 3vw;
}
.user-item .user-item-right {
  width: 50%;
  height: 100%;
  float: left;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.control-btn {
  width: 16.26666667rem;
  height: 3.066666667rem;
  background: #45bb7f;
  border-radius: 0.5333333rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 1.06666667rem;
  letter-spacing: 0.23333333rem;
  font-weight: 500;
  position: relative;
  margin-left: 50%;
  transform: translateX(-50%);
}
.finger {
  animation: eighth 0.8s infinite;
  width: 8vw;
  position: absolute;
  right: 4vw;
  top: 3vw;
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

