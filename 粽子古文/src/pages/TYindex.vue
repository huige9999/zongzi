<template>
  <div class="index-box">
    <div class="i-inner">
      <div class="i-header">
        <img class="zong-img" src="./../assets/images/zong.png" alt>
        <p class="i-title">子古文体验课</p>
      </div>
      <img class="banner" src="./../assets/images/index-banner.png" alt>
    </div>
    <div class="learn-btn" @click="goNextPage()">我要体验</div>
  </div>
</template>

<script>
import TyBottomNav from "@/components/TyBottomNav";
export default {
  name: "ty-index",
  data() {
    return {
      dayType: 0
    };
  },
  mounted() {
    //判断今天是普通天<0>、周六<1>、周日<2>（不同天的跳转页面不同）
    // let dayStr = "日一二三四五六".charAt(new Date().getDay());
    // if (dayStr == "日") {
    //   this.dayType = 2;
    // } else if (dayStr == "六") {
    //   this.dayType = 1;
    // } else {
    //   this.dayType = 0;
    // }
  },
  methods: {
    goNextPage() {
      this.$router.push({
        path: "/TYthreeLevel"
      });
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
    height: 854 / @rem;
    .postion(54, 64, 22);
    .banner {
      width: 642 / @rem;
      height: 700 / @rem;
      display: block;
      margin: 1.4rem 0 0 0;
    }
    @media screen and (min-width: 768px) {
      .banner {
        width: 642 / @rem;
        height: 700 / @rem;
        display: block;
        margin-top: -1.4rem;
      }
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
    @media screen and (min-width: 768px) {
      .i-header {
        height: 98 / @rem;
        width: 100%;
        position: absolute;
        left: 0;
        top: 2rem;
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
  .learn-btn {
    bottom: 3.4rem;
  }
  @media screen and (min-width: 768px) {
    .learn-btn {
      bottom: 1.4rem;
    }
  }
}
</style>
