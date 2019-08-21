<template>
  <div class="m-box">
    <div class="i-box">
      <img class="banner" src="./../assets/images/zs-banner.png" alt>
      <div class="learn-btn" @click="goBeforeLearn()">我要学习</div>
    </div>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import BottomNav from "@/components/BottomNav";
import axios from 'axios';
export default {
  name: "index",
  components: {
    BottomNav
  },
  data() {
    return {
      isUpdateCourseWare: false,
      currentDate: "",
      isExpire: ""
    }
  },
  mounted() {
    /*判断store中是否有USER_ID 没有，需要授权登录
        如果不是第一次进入该页面需要清空store中的学习相关信息
        */
    this.$store.commit("save_ex_course", {});
    this.$store.commit("save_ex_exercise", []);
    this.$store.commit("save_ex_test", []);
    this.$store.commit("save_ex_guwen", []);
    // this.$store.commit("update_listenCompleted", false);
    // this.$store.commit("update_learnCompleted", false);
    // this.$store.commit("exerciseCompleted", false);
    // this.$store.commit("update_readArticleCompleted", false);
    this.$store.commit("update_correctNum", 0);
    this.$store.commit("update_incorrectNum", 0);
    this.$store.commit("update_cNum", 0);
    this.$store.commit("update_icNum", 0);
    this.$store.commit("update_isPreRecord", "");
    this.$store.commit("update_isPreMistake", "");


    //模拟新的一天
    // localStorage.removeItem("listenCompleted");
    // localStorage.removeItem("learnCompleted");
    // localStorage.removeItem("exerciseCompleted")
    // localStorage.removeItem("readArticleCompleted")
    // localStorage.removeItem("isDaka")

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
              //alert("课程已到期，请前往续费");
            } else {
              alert("当天课件尚未发布");
            }
          } else {
            this.isUpdateCourseWare = true;
            this.currentDate = res.data.data.current_time;
            this.isExpire = res.data.data.is_expire;
            this.$store.commit("save_ex_course", res.data.data.courseware);
          }
          //发送请求获取正文
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

        }
      });
    //发送请求获取练习
    axios
      .get(this.$store.state.baseUrlFront + "exercise/buyedExercise", {
        params: { USER_ID: USERID }
      })
      .then(res => {
        console.log(res);
        if (res.status == 200) {
          this.$store.commit("save_ex_exercise", res.data.data.exerciseList);
        }
      });
    //发送请求获取测一测题目
    axios
      .get(this.$store.state.baseUrlFront + "test/list", {
        params: { USER_ID: USERID }
      })
      .then(res => {
        console.log(res);
        if (res.status == 200) {
          this.$store.commit("save_ex_test", res.data.data.testList);
        }
      });
    //发送请求获取已购课程的所有音频
    // axios
    // .get(this.$store.state.baseUrlFront + "course/courseAllBuyed", {
    //   params: { USER_ID: USERID }
    // })
    // .then(res => {
    //   if (res.status == 200) {
    //     console.log(res.data.data.allSound);
    //     this.$store.commit("save_ex_guwen",res.data.data.allSound);
    //   }
    // });
    // }

    //判断今天是普通天<0>、周六<1>、周日<2>（不同天的跳转页面不同）
    let dayStr = "日一二三四五六".charAt(new Date().getDay());
    if (dayStr == "日") {
      this.dayType = 2;
    } else if (dayStr == "六") {
      this.dayType = 1;
    } else {
      this.dayType = 0;
    }
  },
  methods: {
    goBeforeLearn() {

      //localStorage中的操作
      if (localStorage.getItem("currentDate")) {
        if (localStorage.getItem("currentDate") == this.currentDate) {

        } else {
          //新的一天 清空localStorage中的指定内容
          localStorage.removeItem("listenCompleted");
          localStorage.removeItem("learnCompleted");
          localStorage.removeItem("exerciseCompleted");
          localStorage.removeItem("readArticleCompleted");
          localStorage.removeItem("shangxiCompleted");
          localStorage.removeItem("isDaka");
          localStorage.setItem("currentDate", this.currentDate);
        }
      } else {
        //第一次存放
        localStorage.setItem("currentDate", this.currentDate)
      }
      if (this.isExpire == "1") {
        //alert("课程已到期，请前往首页续费"); 
      } else {
        this.goNextPage();
      }

    },

    //this.$store.commit('update_isPreRecord','') ;
    // },
    goNextPage() {
      //判断当天课件有没有发布
      if (this.isUpdateCourseWare == true) {
        if (this.dayType == 0) {
          //普通天跳转BeforeLearn界面
          this.$router.push({
            path: "/BeforeLearn"
          });
        } else if (this.dayType == 1) {
          //周六跳转Weekend界面
          this.$router.push({
            path: "/Weekend"
          });
        } else {
          //周末跳转Shangxi界面
          this.$router.push({
            path: "/Sunday"
          });
        }
      } else {
        alert("没有当天的学习课件!")
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.i-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.banner {
  width: 642 / @rem;
  height: 700 / @rem;
  display: block;
  margin: 102 / @rem 0 0 0;
}
</style>
