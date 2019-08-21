<template>
  <div class="index-box">
    <div class="i-inner">
      <!-- <div class="i-header">
        <img class="zong-img" src="./../assets/images/zong.png" alt="" />
        <p class="i-title">子古文体验课</p>
      </div>-->
      <img class="banner" src="./../assets/images/zs-banner.png" alt>
    </div>
    <div :class="isShangxiCompleted()?'s-active':'s-normal'" class="sxbtn" @click="goShangxi()">赏一赏</div>
    <div
      :class="isReadArticleCompleted()?'s-active':'s-normal'"
      @click="goReadArticle()"
      style="margin-left:28vw"
    >读一读</div>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import BottomNav from "@/components/BottomNav";
import axios from "axios";
export default {
  name: "sunday",
  data() {
    return {
      isUpdateCourseWare: false,
      currentDate: "",
      isExpire: "",
      modules: "",
      activemodules: ""
    };
  },
  components: {
    BottomNav
  },
  mounted() {
    let that = this;
    this.$store.commit("save_ex_course", {});
    this.$store.commit("save_ex_exercise", []);
    this.$store.commit("save_ex_test", []);
    this.$store.commit("save_ex_guwen", []);
    this.$store.commit("update_correctNum", 0);
    this.$store.commit("update_incorrectNum", 0);
    this.$store.commit("update_cNum", 0);
    this.$store.commit("update_icNum", 0);
    this.$store.commit("update_isPreRecord", "");
    this.$store.commit("update_isPreMistake", "");
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
        localStorage.removeItem("cNum");
        localStorage.removeItem("icNum");
        localStorage.removeItem("testid");
        localStorage.removeItem("readArticleCompleted-now");
        localStorage.removeItem("isDaka");
        localStorage.removeItem("learnDate");
        localStorage.removeItem("shareFlag");
        localStorage.setItem("currentDate", this.getToday());
      }
    } else {
      //第一次存放
      localStorage.setItem("currentDate", this.getToday());
    }
    let USERID = localStorage.getItem("USER_ID");
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
              //alert("课程已到期，请前往首页续费");
            }
            this.$store.commit("save_ex_course", res.data.data.courseware);

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
    //       console.log(res.data.data.allSound);
    //       this.$store.commit("save_ex_guwen", res.data.data.allSound);
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

          localStorage.setItem("courseId", res.data.data.course_id);
          //定时器判断是否需要更新按钮状态
          setInterval(function () {
            if (!(localStorage.getItem("shangxiCompleted") == 'yes')) {
              //如果状态是赏一赏都还没完成 请求更新
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
                    if (res.data.data.module.length == 1 && res.data.data.module.indexOf('s') != -1) {
                      //测一测已经完成
                      localStorage.setItem('shangxiCompleted', 'yes');
                      localStorage.setItem('readArticleCompleted-now', 'yes');
                    } else if (res.data.data.module.length == 2 && res.data.data.module.indexOf('sd') != -1) {
                      localStorage.setItem('shangxiCompleted', 'yes');
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
    goShangxi() {
      console.log("去赏析页面");
      this.$router.push({
        path: "/Shangxi"
      });
      //this.$router.replace("ShangXi");
    },
    goReadArticle() {
      //判断赏一赏是否完成
      //let flag = localStorage.getItem("shangxiCompleted");
      let flag = "";
      if (localStorage.getItem("learnDate") == undefined) {
        flag = localStorage.getItem("shangxiCompleted");
      } else {
        if (localStorage.getItem("cram") == "yes") {
          //需要补课
          if (this.modules == "") {
            flag = "no";
          } else {
            if (this.modules.indexOf("s") != -1) {
              flag = "yes";
            } else {
              flag = "no"
            }
          }
        } else {
          //不需要补课
          flag = "yes";
        }
      }
      if (flag == "yes") {
        this.$router.push({
          path: "/ReadArticle"
        });
      } else {
        alert("请先完成赏一赏");
      }
    },
    isShangxiCompleted() {
      return true;
    },
    isReadArticleCompleted() {
      let flag = "";
      if (localStorage.getItem("learnDate") == undefined) {
        flag = localStorage.getItem("readArticleCompleted-now");
      } else {
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
.index-box {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #fff6e4;
  .i-inner {
    width: 644 / @rem;
    .postion(54, 64, 22);
    .banner {
      width: 642 / @rem;
      height: 23.466667rem;
      display: block;
      margin: -0.1rem 0 0 0;
    }
    .i-banner {
      width: 100%;
      height: 100%;
      .postion(0, 0, 22);
    }
    .i-header {
      height: 98 / @rem;
      width: 100%;
      .postion(0, 130, 22);
      display: flex;
      align-items: center;
      .zong-img {
        width: 112 / @rem;
        height: 100%;
        margin-left: 58 / @rem;
      }
      .i-title {
        font-size: 64 / @rem;
        font-weight: 700;
        line-height: 98 / @rem;
        color: #68a945;
      }
    }
  }
  @media screen and (min-width: 768px) {
    .i-inner {
      width: 644 / @rem;
      //.postion(54, 64, 22);
      position: absolute;
      left: 1.8rem;
      top: -0.05rem;
      .banner {
        width: 642 / @rem;
        height: 21.466667rem;
        display: block;
        margin: -0.8rem 0 0 0;
        transform: scale(0.8);
      }
      .i-banner {
        width: 100%;
        height: 100%;
        .postion(0, 0, 22);
      }
      .i-header {
        height: 98 / @rem;
        width: 100%;
        .postion(0, 130, 22);
        display: flex;
        align-items: center;
        .zong-img {
          width: 112 / @rem;
          height: 100%;
          margin-left: 58 / @rem;
        }
        .i-title {
          font-size: 64 / @rem;
          font-weight: 700;
          line-height: 98 / @rem;
          color: #68a945;
        }
      }
    }
  }
  .s-active {
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
  .s-normal {
    width: 11rem;
    height: 2.8rem;
    margin-top: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3rem;
    background: #b5b5b5;
    color: #fff;
    font-size: 32 / @rem;
    box-shadow: 0 4 / @rem 4 / @rem #666;
  }
  .sxbtn {
    margin-top: 106vw;
    margin-left: 28vw;
  }
  @media screen and (min-width: 768px) {
    .sxbtn {
      margin-top: 77vw;
      margin-left: 28vw;
    }
  }
}
</style>
