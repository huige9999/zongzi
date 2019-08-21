<template>
  <div class="bottom-nav">
    <div class="nav-item" @click="goLearnRecord()">
      <img src="./../assets/images/zr_icon_left.png" alt>
      <p>学习记录</p>
    </div>
    <div class="b-line"></div>
    <div class="nav-item" @click="goEditMine()">
      <img src="./../assets/images/zr_icon_right.png" alt>
      <p>个人中心</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "bottom-nav",
  methods: {
    goLearnRecord() {
      if (localStorage.getItem("isVip") == undefined || localStorage.getItem("isVip") == "") {
        alert("体验课不开放学习记录哦!");
      } else {
        //this.$router.push({name:'TabIndex'});
        this.$router.replace("TabIndex");
      }
    },
    goEditMine() {
      if (localStorage.getItem("isVip") == undefined || localStorage.getItem("isVip") == "") {
        alert("体验课不开放个人中心哦！")
      } else {
        //this.$router.push({name:'EditMine'});
        this.$router.replace("EditMine");
      }
    }
  }
}
</script>

<style lang="less" scoped>
@rem: 30rem;
.bottom-nav {
  width: 100vw;
  // height: 84/@rem;
  height: 7%;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 33;
  display: flex;
  align-items: center;
  background: #fff;
  font-family: heiti;
  .nav-item {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 28 / @rem;
    line-height: 58 / @rem;
    color: #68a945;
    img {
      width: 2.56666667rem;
      height: 58 / @rem;
      margin: 0 26 / @rem 0 97 / @rem;
      pointer-events: none;
    }
  }
  .b-line {
    width: 2 / @rem;
    height: 52 / @rem;
    background: #b4b0ad;
  }
}
</style>
