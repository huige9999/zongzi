<template>
  <div class="my-mask" v-if="tc_off">
    <div class="tc-box">
      <div class="title-box">
        <!-- <img class="title-img" src="./../assets/images/knowledgehometitle.png"> -->
        <img class="title-img1" src="./../assets/images/zhi.png">
        <img class="title-img2" src="./../assets/images/shiwu.png">
      </div>
      <div class="artical-box">
        <p v-html="articalStr"></p>
      </div>
      <img class="little-boy" src="./../assets/images/littleboy.png">
      <!-- <img @click="close_tc()" class="exit" src="./../assets/images/roundexit.png"> -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from "axios"
export default {
  name: "mask",
  data() {
    return {
      tc_off: false,
      articalStr: ""
    }
  },
  methods: {
    show_tc(_content) {
      let regp = /【(.+?)】/g;
      let result = _content.match(regp);
      let _tmpStr1 = '';
      let _tmpStr2 = '';
      if (result) {
        for (let i = 0; i < result.length; i++) {
          _tmpStr1 = result[i].split("【")[1].split("】")[0];
          _tmpStr2 = "<label style='color: #C69A1F;'>" + _tmpStr1 + "</label>";
          _content = _content.split("【" + _tmpStr1 + "】").join(_tmpStr2);
        }
      }

      // let _tmpStr1 = '';
      // let _tmpStr2 = '';
      // if(_content.indexOf("【")!=-1){

      //   _tmpStr1 = _content.split("【")[1].split("】")[0];
      //   _tmpStr2 ="<label style='color: #2b8552;'>"+_tmpStr1+"</label>";
      //  _content =  _content.split("【"+_tmpStr1+"】").join(_tmpStr2);
      // }
      let _tmpArray = _content.split("；");

      if (_tmpArray.length >= 2) {
        this.articalStr = _tmpArray.join("<br/>");
      } else {
        this.articalStr = _tmpArray;
      }
      this.tc_off = true;
    },
    close_tc() {
      this.tc_off = false;
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.my-mask {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  .postion(0, 0, 22);
  z-index: 2;
}
.tc-box {
  width: 700 / @rem;
  height: 92%;
  background-image: url("../assets/images/bluebg.png");
  background-size: 100% 100%;
  border-radius: 18 / @rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 0.93333333rem;
  top: 0.9rem;
  .title-box {
    width: 100%;
    .title-img1 {
      position: absolute;
      width: 10vw;
      left: 21vw;
      top: 32px;
    }
    .title-img2 {
      position: absolute;
      width: 34vw;
      left: 36vw;
      top: 18px;
    }
  }
  .artical-box {
    width: 604 / @rem;
    margin-top: 5.8rem;
    position: absolute;
    z-index: 1;
    left: 2rem;
    p {
      font-size: 1.2rem;
      line-height: 1.9rem;
      font-weight: bold;
    }
  }
  .little-boy {
    position: absolute;
    width: 19vw;
    right: 2px;
    bottom: 0rem;
  }
  .exit {
    width: 2.8rem;
    height: 2.8rem;
    position: absolute;
    left: 320 / @rem;
    bottom: 52 / @rem;
    z-index: 99999;
    background-image: url( ./../assets/images/roundexit.png);
    background-size:100% 100%;
  }
}
</style>
