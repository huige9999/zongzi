<template>
  <div class="m-box">
    <div class="l-box">
      <img class="level-img" @click="chooseLevel(3)" src="./../assets/images/level01.png">
      <img class="level-img" @click="chooseLevel(4)" src="./../assets/images/level02.png">
      <img class="level-img" @click="chooseLevel(5)" src="./../assets/images/level03.png">
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ty-three-level",
  data() {
    return {
      dayType: 0,
      currentDate: ''
    }
  },
  mounted() {
    //判断今天是普通天<0>、周六<1>、周日<2>（不同天的跳转页面不同）
    let dayStr = "日一二三四五六".charAt(new Date().getDay());
    if (dayStr == "日") {
      this.dayType = 0;
    } else if (dayStr == "六") {
      this.dayType = 0;
    } else {
      this.dayType = 0;
    }
    //清空store中的学习相关内容
    this.$store.commit("save_ex_course", {});
    this.$store.commit("save_ex_exercise", []);
    this.$store.commit("save_ex_test", []);

    this.$store.commit("update_correctNum", 0);
    this.$store.commit("update_incorrectNum", 0);
    this.$store.commit("update_cNum", 0);
    this.$store.commit("update_icNum", 0);
    this.$store.commit("update_isPreRecord", "");
    this.$store.commit("update_isPreMistake", "");
  },
  methods: {
    chooseLevel(courseType) {
      localStorage.setItem("courseType", courseType);
      //courseType存入store
      this.$store.commit("update_courseType", courseType);
      axios
        .get(this.$store.state.baseUrlFront + "course/TYCourse", {
          params: { courseType: String(courseType) }
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            if (res.data.data == undefined) {
              alert("当前级别课程未发布,尽情期待!");
            } else {
              this.$store.commit(
                "save_ex_course",
                res.data.data.courseware
              );
              this.currentDate = this.getToday();
              // this.currentDate = res.data.data.currentDate;
              localStorage.setItem("course_id", res.data.data.course_id);
              //res.data.data.course_id
              // this.$store.commit(
              //   "save_ex_exercise",
              //   res.data.data.courseware.
              // );
              // this.$store.commit(
              //   "save_ex_test",
              //   res.data.data.coursewareList[0].exercise
              // );
              //获取并保存正文
              axios.get(
                this.$store.state.baseUrlFront + 'courseware/whole',
                {
                  params: { courseware_id: res.data.data.courseware.courseware_id }
                }).then((reses) => {
                  if (reses.status == 200) {
                    console.log(reses);
                    let wholes = reses.data.data.whole.split("译文")[0];
                    this.$store.commit("update_whole", wholes);
                  }
                })
              //获取并保存题目
              axios.get(
                this.$store.state.baseUrlFront + 'exercise/tyExercise',
                {
                  params: { course_id: res.data.data.course_id }
                }).then((res) => {
                  if (res.status == 200) {
                    console.log(res);
                    this.$store.commit(
                      "save_ex_exercise",
                      res.data.data.exerciseList
                    );
                    console.log("级别选择的体验课程题目:");
                    console.log(this.$store.state.ex_exercise);
                  }
                })
              this.goIndexPage();

            }
          }
        });
    },
    goIndexPage() {
      console.log(this.currentDate);
      localStorage.removeItem("isVip");
      //localStorage中的操作
      if (localStorage.getItem("currentDate")) {
        if (localStorage.getItem("currentDate") == this.currentDate) {

        } else {
          localStorage.removeItem("listenCompleted3");
          localStorage.removeItem("learnCompleted3");
          localStorage.removeItem("exerciseCompleted3");
          localStorage.removeItem("readArticleCompleted3");
          localStorage.removeItem("shangxiCompleted3");
          localStorage.removeItem("learnCompleted-now3");
          localStorage.removeItem("exerciseCompleted-now3");
          localStorage.removeItem("readArticleCompleted-now3");

          localStorage.removeItem("listenCompleted4");
          localStorage.removeItem("learnCompleted4");
          localStorage.removeItem("exerciseCompleted4");
          localStorage.removeItem("readArticleCompleted4");
          localStorage.removeItem("shangxiCompleted4");
          localStorage.removeItem("learnCompleted-now4");
          localStorage.removeItem("exerciseCompleted-now4");
          localStorage.removeItem("readArticleCompleted-now4");


          localStorage.removeItem("listenCompleted5");
          localStorage.removeItem("learnCompleted5");
          localStorage.removeItem("exerciseCompleted5");
          localStorage.removeItem("readArticleCompleted5");
          localStorage.removeItem("shangxiCompleted5");
          localStorage.removeItem("learnCompleted-now5");
          localStorage.removeItem("exerciseCompleted-now5");
          localStorage.removeItem("readArticleCompleted-now5");
          localStorage.setItem("currentDate", this.currentDate);
        }
      } else {

        localStorage.setItem("currentDate", this.currentDate)
      }



      if (this.dayType == 0) {
        //普通天跳转BeforeLearn界面
        this.$router.push({
          path: "/TYBeforeLearn"
        });
      } else if (this.dayType == 1) {
        //周六跳转Weekend界面
        this.$router.push({
          path: "/Weekend"
        });
      } else {
        this.$router.push({
          path: "/Sunday"
        });
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

.m-box {
  background: #fff;
}
.l-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .level-img {
    width: 656 / @rem;
    height: 200 / @rem;
    margin-top: 90 / @rem;
  }
  .level-img:nth-of-type(1) {
    margin-top: 210 / @rem;
  }
  @media screen and (min-width: 768px) {
    .level-img:nth-of-type(1) {
      margin-top: 2rem;
    }
  }
}
</style>
