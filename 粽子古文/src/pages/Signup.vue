<template>
  <div class="m-box">
    <div class="s-box">
      <p class="s-title">您还没有报名成为学员哦</p>
      <img class="s-img" src="./../assets/images/signup_img.png" alt>
      <div class="active-btn" @click="tiyan()">体验课程</div>
      <div class="normal-btn" @click="baoming()">我要报名</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "signup",
  mounted() {

  },
  methods: {
    tiyan() {
      this.$router.push({
        path: '/TYindex'
      });
    },
    baoming() {
      this.$router.push({
        path: '/Purchase'
      });
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.m-box {
  background: #f0efee;
  .s-box {
    width: 96%;
    height: 96%;
    margin: 22 / @rem auto;
    border-radius: 20 / @rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    .s-title {
      font-size: 38 / @rem;
      font-weight: 600;
      margin: 96 / @rem 0 66 / @rem 0;
      font-family: heiti;
    }
    .s-img {
      width: 546 / @rem;
      height: 596 / @rem;
    }
    @media screen and (min-width: 768px) {
      .s-img {
      width: 546 / @rem;
      height: 16rem;
    }
    }
  }
}
</style>
