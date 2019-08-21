<template>
  <div class="m-box">
    <layer ref="layer"></layer>
    <div class="bl-box">
      <!-- <img class="bl-img" src="./../assets/images/bl_img.png"  alt=""/> -->
      <img class="bl-img" :src="imgPath" alt>
      <p class="act-title" style="margin-bottom:1.4rem">{{articleTitle}}</p>
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
import layer from "@/components/Layer";
export default {
  name: "tybefore-learn",
  components: {
    BottomNav, layer
  },
  data() {
    return {
      articleTitle: "",
      imgPath: ""
    };
  },
  mounted() {
    axios
      .get(this.$store.state.baseUrlFront + "course/TYCourse", {
        params: { courseType: this.$store.state.courseType }
      })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.$store.commit(
            "save_ex_course",
            res.data.data.courseware
          );
          this.articleTitle = this.$store.state.ex_course.title;
          this.imgPath = this.$store.state.imgUrlFront + this.$store.state.ex_course.pic_url;
        }
      });

  },
  methods: {
    goListen() {
      this.$router.push({ name: "Listen" });
    },
    goLearn() {
      let flag = "";
      //判断听一听是否完成
      if (localStorage.getItem("courseType") == 3) {
        flag = localStorage.getItem("listenCompleted3")
      } else if (localStorage.getItem("courseType") == 4) {
        flag = localStorage.getItem("listenCompleted4")
      } else {
        flag = localStorage.getItem("listenCompleted5")
      }
      if (flag == "yes") {
        this.$router.push({ name: "Learn" });
      } else {
        alert("请先完成听一听");
      }
    },
    goExercise() {
      let flag = "";
      if (localStorage.getItem("courseType") == 3) {
        flag = localStorage.getItem("learnCompleted3")
      } else if (localStorage.getItem("courseType") == 4) {
        flag = localStorage.getItem("learnCompleted4")
      } else {
        flag = localStorage.getItem("learnCompleted5")
      }
      if (flag == "yes") {
        //将isPreMistake变''说明不是从错题集日历页面跳转的
        this.$store.commit('update_isPreMistake', '');
        this.$router.push({ name: "Exercise" });
      } else {
        alert("请先完成学一学");
      }
    },
    goReadArticle() {
      let flag = "";
      if (localStorage.getItem("courseType") == 3) {
        flag = localStorage.getItem("exerciseCompleted3")
      } else if (localStorage.getItem("courseType") == 4) {
        flag = localStorage.getItem("exerciseCompleted4")
      } else {
        flag = localStorage.getItem("exerciseCompleted5")
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
      let flag = "";
      if (localStorage.getItem("courseType") == 3) {
        flag = localStorage.getItem("learnCompleted-now3")
      } else if (localStorage.getItem("courseType") == 4) {
        flag = localStorage.getItem("learnCompleted-now4")
      } else {
        flag = localStorage.getItem("learnCompleted-now5")
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
      if (localStorage.getItem("courseType") == 3) {
        flag = localStorage.getItem("exerciseCompleted-now3")
      } else if (localStorage.getItem("courseType") == 4) {
        flag = localStorage.getItem("exerciseCompleted-now4")
      } else {
        flag = localStorage.getItem("exerciseCompleted-now5")
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
      if (localStorage.getItem("courseType") == 3) {
        flag = localStorage.getItem("readArticleCompleted-now3")
      } else if (localStorage.getItem("courseType") == 4) {
        flag = localStorage.getItem("readArticleCompleted-now4")
      } else {
        flag = localStorage.getItem("readArticleCompleted-now5")
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
  //平板
  @media screen and (min-width: 768px) {
    .btn-group {
      position: absolute;
      width: 64%;
      display: flex;
      flex-wrap: wrap;
      margin-left: 4vw;
      bottom: 1.7rem;
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
      width: 64%;
      display: flex;
      flex-wrap: wrap;
      margin-left: 22vw;
      bottom: 3.2rem;
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