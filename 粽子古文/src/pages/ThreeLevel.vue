<template>
  <div class="m-box">
    <div class="l-box">
      <img class="level-img" @click="chooseLevel(0)" src="./../assets/images/level01.png">
      <img class="level-img" @click="chooseLevel(1)" src="./../assets/images/level02.png">
      <img class="level-img" @click="chooseLevel(2)" src="./../assets/images/level03.png">
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "three-level",
  mounted() {
    /*判断store中是否有USER_ID 没有，需要授权登录
    如果不是第一次进入该页面需要清空store中的学习相关信息
    */
    let USERID = this.getQueryString('USERID');
    if (!(USERID == "" || USERID == undefine)) {
      this.$store.commit('update_USERID', USERID);
    } else {
      console.log("url中没有携带USERID!");
    }
    this.$store.commit('save_ex_course', {});
    this.$store.commit('save_ex_exercise', []);
    this.$store.commit('save_ex_test', []);
    this.$store.commit('update_listenCompleted', false);
    this.$store.commit('update_learnCompleted', false);
    this.$store.commit('exerciseCompleted', false);
    this.$store.commit('update_correctNum', 0);
    this.$store.commit('update_incorrectNum', 0);
    this.$store.commit('update_cNum', 0);
    this.$store.commit('update_icNum', 0);
    this.$store.commit('update_isPreRecord', '');
    this.$store.commit('update_isPreMistake', '');
    //   axios
    //  .get(
    //      "/api/haidong-emcee/exercise/buyedExercise",
    //     {
    //      params: { USER_ID: "5dc3738d8a914144b81509d464fe6615" }
    //     }
    //    )
    //    .then(res => {
    //      console.log(res);
    //      if (res.status == 200) {
    //        console.log(res);
    //     // this.quesTions = res.data.data.exerciseList;
    //     //习题保存到store中
    //      this.$store.commit('save_ex_exercise',res.data.data.exerciseList) ;
    //   }
    //   });
  },
  methods: {
    chooseLevel(courseType) {
      let USERID = this.$store.state.USER_ID;
      if (USER_ID == '' || USER_ID == undefined) {
        window.location.href = this.$store.state.baseUrlFront + "qrCode/oauth_user2";
      } else {


      }


    },
    getQueryString(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    }
  }
}
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
