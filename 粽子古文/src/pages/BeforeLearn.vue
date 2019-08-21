<template>
  <div class="m-box">
    <div class="bl-box">
      <!-- <img class="bl-img" src="./../assets/images/bl_img.png"  alt=""/> -->
      <img class="bl-img" :src="imgPath" alt>
      <p class="act-title" style="margin-bottom:1.4rem">{{articleTitle}}</p>
      <!-- <p class="bl-title">每天学一点 名校近一点</p> -->
      <div class="btn-group">
        <div @click="goListen()" :class="isListenCompleted()?'active':'bl-btn'">听一听</div>
        <div @click="goLearn()" :class="isLearnCompleted()?'active':'bl-btn'">学一学</div>
        <div @click="goExercise()" :class="isExerciseCompleted()?'active':'bl-btn'">做一做</div>
        <div @click="goReadArticle()" :class="isReadArticleCompleted()?'active':'bl-btn'">读一读</div>
      </div>
    </div>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import BottomNav from "@/components/BottomNav";
import axios from "axios";
export default {
  name: "before-learn",
  components: {
    BottomNav
  },
  data() {
    return {
      articleTitle: "",
      imgPath: "",
      isUpdateCourseWare: false,
      currentDate: "",
      isExpire: "",
      modules: "",
      activemodules: ""
    };
  },
  mounted() {
    let that = this;
    this.$store.commit("save_ex_course", {});
    this.$store.commit("save_ex_exercise", []);
    this.$store.commit("save_ex_test", []);
    this.$store.commit("save_ex_guwen", []);
    this.$store.commit("update_correctNum", 0);
    this.$store.commit("update_incorrectNum", 0);
    this.$store.commit("update_happyFlag", 1);
    this.$store.commit("update_unHappyFlag", 1);
    this.$store.commit("update_isPreRecord", "");
    this.$store.commit("update_isPreMistake", "");
    this.$store.commit("update_cNum", 0);
    this.$store.commit("update_icNum", 0);
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
        localStorage.removeItem("isDaka");
        localStorage.removeItem("learnCompleted-now");
        localStorage.removeItem("exerciseCompleted-now")
        localStorage.removeItem("readArticleCompleted-now");
        localStorage.removeItem("learnDate");
        localStorage.removeItem("course_id");
        localStorage.removeItem("cNum");
        localStorage.removeItem("icNum");
        localStorage.removeItem("testid");
        localStorage.removeItem("shareFlag");
        localStorage.setItem("currentDate", this.getToday());

        this.$store.commit("update_listenCompleted", "");
        this.$store.commit("update_learnCompleted", "");
        this.$store.commit("update_readArticleCompleted", "");
        this.$store.commit("exerciseCompleted", "");


      }
    } else {
      //第一次存放
      localStorage.setItem("currentDate", this.getToday())
    }
    let USERID = localStorage.getItem("USER_ID")
    //发送请求获取课件
    axios
      .get(this.$store.state.baseUrlFront + "course/courseBuyed", {
        params: {
          USER_ID: USERID,
          learnDate: localStorage.getItem("learnDate")
        }
      })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          if (res.data.data.courseware == undefined) {
            this.isExpire = res.data.data.is_expire;
            this.isUpdateCourseWare = false;
            if (this.isExpire == "1") {
              alert("课程到期，欢迎续课");
            } else {
              alert("当天课件尚未发布");
            }
          } else {
            this.isUpdateCourseWare = true;
            this.currentDate = res.data.data.current_time;
            this.isExpire = res.data.data.is_expire;
            if (this.isExpire == "1") {
              //alert("课程已到期，请前往续费");
            }
            this.$store.commit("save_ex_course", res.data.data.courseware);
            this.articleTitle = this.$store.state.ex_course.title;
            this.imgPath = this.$store.state.imgUrlFront + this.$store.state.ex_course.pic_url;
          }
          //发送请求获取正文
          axios.get(
            this.$store.state.baseUrlFront + 'courseware/whole',
            {
              params: {
                courseware_id: res.data.data.courseware.courseware_id,
                learnDate: localStorage.getItem("learnDate")
              }
            }).then((reses) => {
              if (reses.status == 200) {
                console.log(reses);
                if (!(res.data.data == undefined)) {
                  let wholes = reses.data.data.whole.split("译文")[0];
                  this.$store.commit("update_whole", wholes);
                }
              }
            })
          //发送请求获取练习
          axios
            .get(this.$store.state.baseUrlFront + "exercise/buyedExercise", {
              params: {
                USER_ID: USERID,
                learnDate: localStorage.getItem("learnDate"),
                courseware_id: res.data.data.courseware.courseware_id,
              }
            })
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                if (!(res.data.data == undefined)) {
                  this.$store.commit("save_ex_exercise", res.data.data.exerciseList);
                }
              }
            });

        }
      });
    //发送请求获取测一测题目
    axios
      .get(this.$store.state.baseUrlFront + "test/list", {
        params: {
          USER_ID: USERID,
          learnDate: localStorage.getItem("learnDate")
        }
      })
      .then(res => {
        console.log(res);
        if (res.status == 200) {
          if (!(res.data.data == undefined)) {
            this.$store.commit("save_ex_test", res.data.data.testList);
          }
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
    //       if (!(res.data.data == undefined)) {
    //         this.$store.commit("save_ex_guwen", res.data.data.allSound);
    //       }
    //     }
    //   });
    //发送请求判断用户有没有购买
    axios
      .get(this.$store.state.baseUrlFront + "wxinfo/findUserInfo", {
        params: {
          USER_ID: USERID
        }
      })
      .then(res => {
        console.log("判断用户是不是会员");
        console.log(res);
        if (res.data.data.flag == "1") {
          localStorage.setItem("isVip", "yes");
          localStorage.setItem("courseId", res.data.data.course_id);
          //定时器判断是否需要更新按钮状态
          setInterval(function () {
            if (!(localStorage.getItem("listenCompleted") == 'yes')) {
              //如果状态是听一听都还没完成 请求更新
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
                    if (res.data.data.module.length == 1 && res.data.data.module.indexOf('t') != -1) {
                      //听一听已经完成
                      localStorage.setItem('listenCompleted', 'yes');
                      localStorage.setItem('learnCompleted-now', 'yes');
                    } else if (res.data.data.module.length == 2 && res.data.data.module.indexOf('tx') != -1) {
                      //学一学已经完成
                      localStorage.setItem('listenCompleted', 'yes');
                      localStorage.setItem('learnCompleted-now', 'yes');
                      localStorage.setItem('learnCompleted', 'yes');
                      localStorage.setItem('exerciseCompleted-now', 'yes');


                    } else if (res.data.data.module.length == 3 && res.data.data.module.indexOf('txz') != -1) {
                      //做一做已经完成
                      localStorage.setItem('listenCompleted', 'yes');
                      localStorage.setItem('learnCompleted-now', 'yes');
                      localStorage.setItem('learnCompleted', 'yes');
                      localStorage.setItem('exerciseCompleted-now', 'yes');
                      localStorage.setItem('exerciseCompleted', 'yes');
                      localStorage.setItem('readArticleCompleted-now', 'yes');
                    } else if (res.data.data.module.length == 4 && res.data.data.module.indexOf('txzd') != -1) {
                      //读一读已经完成
                      localStorage.setItem('listenCompleted', 'yes');
                      localStorage.setItem('learnCompleted-now', 'yes');
                      localStorage.setItem('learnCompleted', 'yes');
                      localStorage.setItem('exerciseCompleted-now', 'yes');
                      localStorage.setItem('exerciseCompleted', 'yes');
                      localStorage.setItem('readArticleCompleted-now', 'yes');
                      localStorage.setItem('readArticleCompleted', 'yes');
                    }
                  }
                });
            }
          }, 2000)
        }
      });
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
    goListen() {
      //  this.GLOBAL.myAudio.src= this.$store.state.soundUrlFront + this.$store.state.ex_course.sound_path;
      // this.GLOBAL.myAudio.load();
      // this.GLOBAL.myAudio.play();
      this.$router.replace({ name: "Listen" });
    },
    goLearn() {
      //判断听一听是否完成
      let flag = "";
      if (localStorage.getItem("learnDate") == undefined) {
        flag = localStorage.getItem("listenCompleted");
      } else {
        if (localStorage.getItem("cram") == "yes") {
          if (this.modules == "") {
            flag = "no";
          } else {
            if (this.modules.indexOf("t") != -1) {
              flag = "yes";
            } else {
              flag = "no";
            }
          }
        } else {
          flag = "yes";
        }
      }
      if (flag == "yes") {
        this.$router.push({ name: "Learn" });
      } else {
        alert("请先完成听一听");
      }
    },
    goExercise() {
      let flag = "";
      if (localStorage.getItem("learnDate") == undefined) {
        flag = localStorage.getItem("learnCompleted");
      } else {
        if (localStorage.getItem("cram") == "yes") {
          if (this.modules == "") {
            flag = "no";
          } else {
            if (this.modules.indexOf("x") != -1) {
              flag = "yes";
            } else {
              flag = "no";
            }
          }
        } else {
          flag = "yes";
        }
      }
      if (flag == "yes") {
        this.$router.push({ name: "Exercise" });
      } else {
        alert("请先完成学一学");
      }
    },
    goReadArticle() {
      let flag = ""
      if (localStorage.getItem("learnDate") == undefined) {
        flag = localStorage.getItem("exerciseCompleted");
      } else {
        if (localStorage.getItem("cram") == "yes") {
          if (this.modules == "") {
            flag = "no";
          } else {
            if (this.modules.indexOf("z") != -1) {
              flag = "yes";
            } else {
              flag = "no";
            }
          }

        } else {
          flag = "yes";
        }
      }
      if (flag == "yes") {
        this.$router.push({ name: "ReadArticle" });
      } else {
        alert("请先完成做一做");
      }
    },
    isListenCompleted() {
      //听一听一直为可点状态
      return true;
    },
    isLearnCompleted() {
      //学一学完成后变绿
      //判断是不是从日历界面过来的,如果是全部绿色并且为可进入状态
      let flag = "";
      if (localStorage.getItem("learnDate") == undefined) {
        //不是从日历界面进入
        flag = localStorage.getItem("learnCompleted-now");
      } else {
        //从日历界面进入
        if (localStorage.getItem("cram") == "yes") {
          //需要补课
          if (this.activemodules == "") {
            flag = "no";
          } else {
            if (this.activemodules.indexOf("x") != -1) {
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
    isExerciseCompleted() {
      //做一做完成后变绿
      let flag = "";
      if (localStorage.getItem("learnDate") == undefined) {
        flag = localStorage.getItem("exerciseCompleted-now");
      } else {
        //从日历界面进入
        if (localStorage.getItem("cram") == "yes") {
          //需要补课
          if (this.activemodules == "") {
            flag = "no";
          } else {
            if (this.activemodules.indexOf("z") != -1) {
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
    isReadArticleCompleted() {
      //读一读完成后变绿
      let flag = "";
      if (localStorage.getItem("learnDate") == undefined) {
        flag = localStorage.getItem("readArticleCompleted-now");
      } else {
        //从日历界面进入
        if (localStorage.getItem("cram") == "yes") {
          //需要补课
          if (this.activemodules == "") {
            flag = "no";
          } else {
            if (this.activemodules.indexOf("d") != -1) {
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

.bl-box {
  width: 100%;
  height: 93%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .bl-img {
    width: 460 / @rem;
    height: 490 / @rem;
    margin-top: 3.3rem;
    border-radius: 0.8rem;
  }
  @media screen and (min-width: 768px) {
    .bl-img {
      width: 460 / @rem;
      height: 490 / @rem;
      margin-top: 0.2rem;
      border-radius: 0.8rem;
    }
  }
  @media screen and (min-width: 1024px) {
    .bl-img {
      width: 460 / @rem;
      height: 490 / @rem;
      margin-top: 0.8rem;
      border-radius: 0.8rem;
    }
  }
  .act-title {
    font-size: 1.43333333rem;
    color: #72531c;
    margin: 32 / @rem 0 74 / @rem;
    letter-spacing: 0.3rem;
  }
  .bl-title {
    font-size: 1.66666667rem;
    color: #478e24;
    margin-top: 0.5rem;
    font-family: heiti;
  }
  .btn-group {
    position: absolute;
    width: 64%;
    display: flex;
    flex-wrap: wrap;
    margin-left: 4vw;
    bottom: 5.6rem;
    .bl-btn {
      width: 6.4rem;
      height: 2.9rem;
      margin: 0 34 / @rem 26 / @rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 18 / @rem;
      background: #b5b5b5;
      color: #fff;
      font-size: 1.26666667rem;
      box-shadow: 0 4 / @rem 4 / @rem #b5b5b5;
    }
    .active {
      width: 6.4rem;
      height: 2.9rem;
      margin: 0 34 / @rem 26 / @rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 18 / @rem;
      background: #5fd097;
      color: #fff;
      font-size: 1.26666667rem;
      box-shadow: 0 4 / @rem 4 / @rem #666;
    }
  }
  @media screen and (min-width: 768px) {
    .btn-group {
      position: absolute;
      display: flex;
      flex-wrap: wrap;
      bottom: 1.7rem;
      margin-left: 4vw;
      .bl-btn {
        width: 6.4rem;
        height: 2.9rem;
        margin: 0 34 / @rem 26 / @rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 18 / @rem;
        background: #b5b5b5;
        color: #fff;
        font-size: 1.26666667rem;
        box-shadow: 0 4 / @rem 4 / @rem #b5b5b5;
      }
      .active {
        width: 6.4rem;
        height: 2.9rem;
        margin: 0 34 / @rem 26 / @rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 18 / @rem;
        background: #5fd097;
        color: #fff;
        font-size: 1.26666667rem;
        box-shadow: 0 4 / @rem 4 / @rem #666;
      }
    }
  }
  @media screen and (min-width: 1024px) {
    .btn-group {
      position: absolute;
      display: flex;
      flex-wrap: wrap;
      bottom: 3.2rem;
      margin-left: 22vw;
      .bl-btn {
        width: 6.4rem;
        height: 2.9rem;
        margin: 0 34 / @rem 26 / @rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 18 / @rem;
        background: #b5b5b5;
        color: #fff;
        font-size: 1.26666667rem;
        box-shadow: 0 4 / @rem 4 / @rem #b5b5b5;
      }
      .active {
        width: 6.4rem;
        height: 2.9rem;
        margin: 0 34 / @rem 26 / @rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 18 / @rem;
        background: #5fd097;
        color: #fff;
        font-size: 1.26666667rem;
        box-shadow: 0 4 / @rem 4 / @rem #666;
      }
    }
  }
}
</style>