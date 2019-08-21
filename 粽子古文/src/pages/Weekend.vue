<template>
  <div class="m-box">
    <div class="w-box">
      <img class="w-img" src="./../assets/images/weekend_img.png">
      <div
        :class="isExerciseForWeekendCompleted()?'w-active':'w-normal'"
        @click="goExerciseForWeekend()"
      >测一测</div>
      <div :class="isCompareCompleted()?'w-active':'w-normal'" @click="goCompare()">比一比</div>
    </div>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import axios from "axios";
import BottomNav from "@/components/BottomNav";
export default {
  name: "weekend",
  components: {
    BottomNav
  },
  data() {
    return {
      isUpdateCourseWare: false,
      currentDate: "",
      isExpire: "",
      modules: "",
      activemodules: "",
      //当天测一测题目是否有
      testExist: ""
    };
  },
  created() {
    this.$store.commit("save_ex_course", {});
    this.$store.commit("save_ex_exercise", []);
    this.$store.commit("save_ex_test", []);
    this.$store.commit("save_ex_guwen", []);
    this.$store.commit("update_correctNum", 0);
    this.$store.commit("update_incorrectNum", 0);
    this.$store.commit("update_isPreRecord", "");
    this.$store.commit("update_isPreMistake", "");
    this.$store.commit("update_compareCompleted", "");
    let that = this;
    //localStorage中的操作
    if (localStorage.getItem("currentDate")) {
      if (localStorage.getItem("currentDate") == this.getToday()) {
        console.log("当天");
      } else {
        console.log("新的一天");
        //新的一天 清空localStorage中的指定内容
        localStorage.removeItem("listenCompleted");
        localStorage.removeItem("learnCompleted");
        localStorage.removeItem("exerciseCompleted");
        localStorage.removeItem("readArticleCompleted");
        localStorage.removeItem("shangxiCompleted");
        localStorage.removeItem("compareCompleted");
        localStorage.removeItem("isDaka");
        localStorage.removeItem("learnDate");
        localStorage.removeItem("redpack");
        localStorage.removeItem("cNum");
        localStorage.removeItem("icNum");
        localStorage.removeItem("testid");
        localStorage.removeItem("shareFlag");
        localStorage.setItem("currentDate", this.getToday());
      }
    } else {
      //第一次存放
      localStorage.setItem("currentDate", this.getToday());
    }

    let USERID = localStorage.getItem("USER_ID");
    //发送请求获取课件
    // axios
    //   .get(this.$store.state.baseUrlFront + "course/courseBuyed", {
    //     params: {
    //       USER_ID: USERID,
    //       learnDate: localStorage.getItem("learnDate")
    //     }
    //   })
    //   .then(res => {
    //     console.log(res);
    //     if (res.data.success) {
    //       if (res.data.data == undefined) {
    //         this.isUpdateCourseWare = false;
    //         alert("当天课件尚未发布");
    //       } else {
    //         this.isUpdateCourseWare = true;
    //         this.currentDate = res.data.data.current_time;
    //         this.isExpire = res.data.data.is_expire;
    //         if (this.isExpire == "1") {
    //           alert("课程已到期，请前往首页续费");
    //           window.location.href =
    //             "http://front.zongziguwen.com/index_purchase.html";
    //         }
    //         this.$store.commit("save_ex_course", res.data.data.courseware);

    //         this.articleTitle = this.$store.state.ex_course.title;
    //         this.imgPath =
    //           this.$store.state.imgUrlFront +
    //           this.$store.state.ex_course.pic_url;
    //       }
    //       //发送请求获取正文
    //       axios
    //         .get(this.$store.state.baseUrlFront + "courseware/whole", {
    //           params: { courseware_id: res.data.data.courseware.courseware_id }
    //         })
    //         .then(reses => {
    //           if (reses.status == 200) {
    //             console.log(reses);
    //             let wholes = reses.data.data.whole.split("译文")[0];
    //             this.$store.commit("update_whole", wholes);
    //           }
    //         });
    //     }
    //   });
    //发送请求获取练习
    // axios
    //   .get(this.$store.state.baseUrlFront + "exercise/buyedExercise", {
    //     params: { USER_ID: USERID }
    //   })
    //   .then(res => {
    //     console.log(res);
    //     if (res.status == 200) {
    //       this.$store.commit("save_ex_exercise", res.data.data.exerciseList);
    //     }
    //   });

    //发送请求判断用户有没有购买
    axios
      .get(this.$store.state.baseUrlFront + "wxinfo/findUserInfo", {
        params: { USER_ID: USERID }
      })
      .then(res => {
        console.log(res);
        if (res.data.data.flag == "1") {
          localStorage.setItem("isVip", "yes");
          localStorage.setItem("courseId", res.data.data.course_id);
          //定时器判断是否需要更新按钮状态
          setInterval(function () {
            if (!(localStorage.getItem("exerciseCompleted") == 'yes')) {
              //如果状态是测一测都还没完成 请求更新
              axios
                .get(that.$store.state.baseUrlFront + "module/getModule", {
                  params: {
                    USER_ID: USERID,
                    date: localStorage.getItem("currentDate")
                  }
                })
                .then(res => {
                  console.log(res);
                  if (res.data.data) {
                    //res.data.data.module;
                    //res.data.data.activemodule
                    if (res.data.data.module.length == 1 && res.data.data.module.indexOf('c') != -1) {
                      //测一测已经完成
                      localStorage.setItem('exerciseCompleted', 'yes');
                      localStorage.setItem('compareCompleted', 'yes');
                    } else if (res.data.data.module.length == 2 && res.data.data.module.indexOf('cb') != -1) {
                      localStorage.setItem('exerciseCompleted', 'yes');
                      localStorage.setItem('compareCompleted', 'yes');
                    }
                  }
                });
            }
          }, 2000)


        }
        if (localStorage.getItem("learnDate") == undefined) {
          //当天正常进入情况
          //发送请求获取测一测题目
          axios
            .get(this.$store.state.baseUrlFront + "test/list", {
              params: {
                //  course_id: res.data.data.course_id,
                USER_ID: localStorage.getItem("USER_ID"),
                test_time: localStorage.getItem("currentDate")
              }
            })
            .then(res => {
              console.log("获取测一测题目");
              console.log(res);
              if (res.status == 200) {
                if (res.data.data.testList.length == 0 || res.data.data.testList == undefined || res.data.data.test_id == undefined) {
                  //这一天测一测没有题目情况
                  this.testExist = false;
                } else {
                  //这一天测一测有题目情况
                  this.testExist = true;
                  this.$store.commit("save_ex_test", res.data.data.testList);
                  this.$store.commit("save_testid", res.data.data.test_id);
                  localStorage.setItem("testid", res.data.data.test_id);
                }

              }
            });
        } else {
          //从日历界面进入情况
          //发送请求获取测一测题目
          axios
            .get(this.$store.state.baseUrlFront + "test/list", {
              params: {
                //course_id: res.data.data.course_id,
                USER_ID: localStorage.getItem("USER_ID"),
                test_time: localStorage.getItem("learnDate")
              }
            })
            .then(res => {
              console.log("获取测一测题目");
              console.log(res);
              if (res.status == 200) {
                if (res.data.data.testList.length == 0 || res.data.data.testList == undefined || res.data.data.test_id == undefined) {
                  //这一天测一测没有题目情况
                  this.testExist = false;
                } else {
                  this.testExist = true;
                  this.$store.commit("save_ex_test", res.data.data.testList);
                  this.$store.commit("save_testid", res.data.data.test_id);
                  localStorage.setItem("testid", res.data.data.test_id);
                }
              }
            });
        }


      });
    //发送请求获取已购课程的所有音频
    // axios
    //   .get(this.$store.state.baseUrlFront + "course/courseAllBuyed", {
    //     params: {
    //       USER_ID: USERID,
    //       start_time: localStorage.getItem("currentDate")
    //     }
    //   })
    //   .then(res => {
    //     if (res.status == 200) {
    //       console.log(res.data.data.allSound);
    //       this.$store.commit("save_ex_guwen", res.data.data.allSound);
    //     }
    //   });
    if (localStorage.getItem("cram") == "yes") {
      //补课状态下一定是从日历界面进入的
      axios
        .get(this.$store.state.baseUrlFront + "module/getModule", {
          params: {
            USER_ID: USERID,
            date: localStorage.getItem("learnDate")
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.data == undefined) {
            this.modules = "";
            this.activemodules = "";
          } else {
            this.modules = res.data.data.module;
            this.activemodules = res.data.data.activemodule;
          }
        });
    }

  },
  methods: {
    goExerciseForWeekend() {
      if (this.testExist === false) {
        alert("这一天没有题目哦!");
      } else if(this.testExist === true){
        this.$router.push({ name: "ExerciseForWeekend" })
      }else if(this.testExist === ""){
           alert("获取题目中....");
      }
    },
    goCompare() {
      // let flag = localStorage.getItem("exerciseCompleted");
      let flag = "";
      if (localStorage.getItem("learnDate") == undefined) {
        //正常学习情况
        flag = localStorage.getItem("exerciseCompleted");
      } else {
        if (localStorage.getItem("cram") == "yes") {
          //需要补课
          if (this.modules == "") {
            flag = "no";
          } else {
            if (this.modules.indexOf("c") != -1) {
              flag = "yes";
            } else {
              flag = "no";
            }
          }
        } else {
          //不需要补课
          flag = "yes";
        }
      }
      if (flag == "yes") {
        this.$router.push({ name: "Compare" })
      } else {
        alert("请先完成测一测");
      }
    },
    isExerciseForWeekendCompleted() {
      return true;
    },
    isCompareCompleted() {
      //let flag = this.$store.state.compareCompleted;
      let flag = "";
      if (localStorage.getItem("learnDate") == undefined) {
        //普通天进入
        flag = localStorage.getItem("compareCompleted");
      } else {
        //日历界面进入
        if (localStorage.getItem("cram") == "yes") {
          //需要补课
          if (this.activemodules == "") {
            flag = "no";
          } else {
            if (this.activemodules.indexOf("b") != -1) {
              flag = "yes";
            } else {
              flag = "no";
            }
          }
        } else {
          //不需要补课
          flag = "yes";
        }
      }
      if (flag == "yes") {
        return true;
      } else {
        return false;
      }
    },
    getToday() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.w-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .w-img {
    width: 578 / @rem;
    height: 560 / @rem;
    margin-top: 122 / @rem;
  }
  @media screen and (min-width: 768px) {
    .w-img {
      width: 578 / @rem;
      height: 16rem;
      margin-top: 0.2rem;
    }
  }
  .w-active {
    width: 11rem;
    height: 2.8rem;
    margin-top: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3rem;
    background: #45bb7f;
    color: #fff;
    font-size: 32 / @rem;
    box-shadow: 0 4 / @rem 4 / @rem #666;
  }
  @media screen and (min-width: 768px) {
    .w-active {
      margin-top: 0.8rem;
    }
  }
  .w-normal {
    width: 11rem;
    height: 2.8rem;
    margin-top: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3rem;
    background: #b5b5b5;
    color: #fff;
    font-size: 32 / @rem;
    box-shadow: 0 4 / @rem 4 / @rem #666;
  }
  @media screen and (min-width: 768px) {
    .w-normal {
      margin-top: 0.8rem;
    }
  }
}
</style>
