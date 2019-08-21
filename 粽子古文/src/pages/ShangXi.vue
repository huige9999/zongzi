<template>
  <div class="m-box">
    <img src="./../assets/images/shangxibg.png" alt style="width:100%">
    <div class="m-inner">
      <app-header isShowZ="false" isShowL="true" :c_time="currentTimes" :f_time="duration">
        <p slot="title" class="ph-title">赏一赏</p>
      </app-header>
      <!-- <audio id="audio" :src='audioSrc' autoplay style='display:none'>
      </audio>-->
      <!-- <audio id="audio" :src='audioSrc'  controls  style='display:none'>
      </audio>-->
      <div class="artical">
        <div class="main-content">
          <div class="l-item" v-for="item,index in paraphList" :key="index">
            <!--每一段的内容-->

            <p
              v-if="index!=1 && index!=0"
              class="sentence"
              :class="curOff(item,index,paraphList)?'active':''"
            >
              <img
                class="finger"
                src="./../assets/images/finger.png"
                alt
                v-if="curOff(item,index,paraphList)"
              >
              {{item.sentence}}
            </p>
            <p
              v-if="index==1"
              class="sentence"
              :class="curOff(item,index,paraphList)?'active':''"
              style="font-size:1rem;padding-left:8rem;"
            >
              <img
                class="finger"
                src="./../assets/images/finger.png"
                alt
                v-if="curOff(item,index,paraphList)"
              >
              {{item.sentence}}
            </p>
            <p
              v-if="index==0"
              class="sentence"
              :class="curOff(item,index,paraphList)?'active':''"
              style="font-size:1.4rem;font-weight:600;letter-spacing:1vw;"
            >
              <img
                class="finger"
                src="./../assets/images/finger.png"
                alt
                v-if="curOff(item,index,paraphList)"
              >
              {{item.sentence}}
            </p>
          </div>
        </div>
      </div>

      <div class="translate-contain">
        <img class="fanyi" src="./../assets/images/fanyi.png?222" alt>
        <div class="translate-box" style="letter-spacing:0.1rem">
          <p
            class="translate"
            :class="curOff2(itemM,indexM,allphraseArray)?'active':''"
            v-for="itemM,indexM in allphraseArray"
            :key="indexM"
          >{{itemM}}</p>
        </div>
        <div class="summary-box">
          <!-- <img class="wenli" src="./../assets/images/wenli.png" alt=""/> -->
          <img class="fanyi" src="./../assets/images/shangxi.png" alt style="top:1.4rem">
          <div class="summary">
            <p
              class="spara"
              :class="curOff3(item,index,introductionList)?'active':''"
              v-for="item,index in introductionList"
              :key="index"
            >{{item.sentence}}</p>
            <div class="sHeight" style="width:88vw;height:20vw;"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="bottom-contain" style="display:flex;align-center:center;flex-direction:row;bottom:0;"> -->
    <div
      class="control-btn"
      @click="playControl()"
      style="position:absolute;bottom:0;width:12rem"
    >{{btnText}}</div>
    <!-- </div> -->
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import axios from "axios";
import $ from "jquery";
import qs from "qs";
import wx from 'weixin-js-sdk';
export default {
  name: "shangXi",
  components: { AppHeader },
  data() {
    return {
      paraphList: "",
      allphraseArray: [],
      introductionList: "",
      audioSrc: "",
      currentTime: 0,
      currentTimes: 0,
      duration: 60,
      isPlay: true,
      isEnd: false,
      zArray: [],
      yArray: [],
      sArray: [],
      //音频播放次数(1次标识今天赏一赏任务完成)
      times: 0,
      onceFlag: false,
      onceIndex: "",
      poemIndex: 0,
      poemLength: 0
    };
  },
  created() {
    axios
      .get(this.$store.state.baseUrlFront + "course/courseBuyed", {
        params: {
          USER_ID: localStorage.getItem("USER_ID"),
          learnDate: localStorage.getItem("learnDate")
        }
      })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          if (res.data.data == undefined) {
          } else {
            this.$store.commit("save_ex_course", res.data.data.courseware);
          }
        }
      });
  },
  mounted() {
    this.poemLength = this.$store.state.ex_course.poemList.length;
    this.updateContent();
    this.audioSrc =
      this.$store.state.soundUrlFront + this.$store.state.ex_course.sound_path;
    let that = this;
    // let audio = $("#audio")[0];
    let audio = document.getElementById("myaudio");
    audio.src = this.audioSrc;
    //自动播放音频
    axios
      .get(this.$store.state.baseUrlFront + "courseware/getWxSignature", {
        params: {
          url: location.href
        }
      })
      .then(res => {
        console.log(res);
        let params = {
          debug: false,
          appId: res.data.signature.appId,
          timestamp: res.data.signature.timestamp,
          nonceStr: res.data.signature.nonceStr,
          signature: res.data.signature.signature,
          jsApiList: []
        };
        wx.config(params);
        wx.ready(function () {
          console.log("config信息验证完毕");
          audio.play();
        })
      })
    // audio.addEventListener(
    //   "timeupdate",
    //   function() {
    //     that.currentTime = this.currentTime;
    //     if(!(that.poemLength == 1)){
    //        if(that.poemIndex<that.poemLength){
    //           let times = that.$store.state.ex_course.poemList[that.poemIndex].article[0].time;
    //           if(Number(this.currentTime.toFixed(1))>=Number(times)+0.5){
    //             that.allphraseArray = [];
    //             that.updateContent();
    //           }

    //        }
    //     }
    //   },
    //   false
    // );
    $(audio).bind("timeupdate", function () {
      that.currentTime = this.currentTime;
      if (!(that.poemLength == 1)) {
        if (that.poemIndex < that.poemLength) {
          let times = that.$store.state.ex_course.poemList[that.poemIndex].article[0].time;
          if (Number(this.currentTime.toFixed(1)) >= Number(times) + 0.5) {
            that.allphraseArray = [];
            that.updateContent();
          }

        }
      }
    })
    // audio.addEventListener(
    //   "ended",
    //   function() {
    //     that.isEnd = true;
    //     console.log("音频播放结束");
    //     if(localStorage.getItem("cram")=="yes"){
    //       		           axios
    //           .post(
    //             this.$store.state.baseUrlFront + "module/saveModule",
    //             qs.stringify({
    //                USER_ID: localStorage.getItem("USER_ID"),
    //                date: localStorage.getItem("learnDate"),
    //                module:"s",
    //                activemodule:""
    //             }),
    //             {
    //               headers: {
    //                 "Content-Type": "application/x-www-form-urlencoded"
    //               }
    //             }
    //           )
    //           .then(res => {
    //             console.log(res);
    //           });
    //     }else{
    //             localStorage.setItem("shangxiCompleted", "yes");
    //     }

    //     let thats = that;
    //     setTimeout(function() {
    //       //自动跳转下一个页面
    //       //thats.$router.push({ name: "ReadArticle" });
    //       thats.$router.replace("ReadArticle");
    //     }, 1000);
    //   },
    //   false
    // );
    $(audio).bind("ended", function () {
      that.isEnd = true;
      if (localStorage.getItem("cram") == "yes") {
        axios
          .post(
            that.$store.state.baseUrlFront + "module/saveModule",
            qs.stringify({
              USER_ID: localStorage.getItem("USER_ID"),
              date: localStorage.getItem("learnDate"),
              module: "s",
              activemodule: ""
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          )
          .then(res => {
            console.log(res);
          });
      } else {
        localStorage.setItem("shangxiCompleted", "yes");
        axios
          .post(
            that.$store.state.baseUrlFront + "module/saveModule",
            qs.stringify({
              USER_ID: localStorage.getItem("USER_ID"),
              date: localStorage.getItem("currentDate"),
              module: "s",
              activemodule: ""
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          )
          .then(res => {
            console.log(res);
          });
      }

      let thats = that;
      setTimeout(function () {
        //自动跳转下一个页面
        //thats.$router.push({ name: "ReadArticle" });
        thats.$router.replace("ReadArticle");
      }, 1000);
    })
  },
  computed: {
    btnText() {
      let that = this;
      let text = "";
      if (!this.isEnd) {
        text = this.isPlay ? "暂停" : "继续";
      } else {
        text = "继续";
        //播放次数记录
        this.times++;
        //记录当天听一听任务已完成
        if (this.times == "1") {
          //this.$store.commit('update_shangxiCompleted',true);
          localStorage.setItem("shangxiCompleted", "yes");
        }
        //跳转到下一个页面
        setTimeout(function () {
          //自动跳转下一个页面
          that.$router.push({ name: "ReadArticle" });
        }, 1000);
      }
      return text;
    }
  },
  beforeDestroy() {
    let audio = document.getElementById("myaudio");
    $(audio).unbind("timeupdate");
    $(audio).unbind("ended");
    audio.pause();
  },
  methods: {
    playControl() {
      let audio = document.getElementById("myaudio");
      // if (this.isEnd) {
      //   //this.isEnd = false;
      //   //音频播放结束再点击跳转下一个学习界面
      //   this.$router.push({
      //     path: "/ReadArticle"
      //   });
      // }
      if (!this.isPlay) {
        wx.ready(function () {
          audio.play();
        })
        this.isPlay = true;
      } else {
        audio.pause();
        this.isPlay = false;
      }
    },
    curOff(item, index, paraphList) {
      //  let off = false;
      //  if(this.currentTime<=this.yArray[0]){
      //     if(this.currentTime>item.time && !(paraphList[index+1] == undefined) && this.currentTime<=paraphList[index+1].time){
      //       off = true;
      //     }else{
      //       off = false;
      //     }
      //  }else{
      //    off = false;
      //  }
      //  return off;
      let scrollDom = document.querySelector(".m-inner");

      let off = false;
      if (this.currentTime <= this.yArray[0]) {
        if (
          this.currentTime > item.time &&
          !(paraphList[index + 1] == undefined) &&
          this.currentTime <= paraphList[index + 1].time
        ) {
          off = true;
        } else if (
          paraphList[index + 1] == undefined &&
          this.currentTime <= this.yArray[0] &&
          this.currentTime != 0 &&
          this.currentTime > paraphList[index].time
        ) {
          off = true;
        } else {
          off = false;
        }
      } else {
        off = false;
      }
      if (off == true && this.onceIndex != index) {
        this.onceFlag = false;
      }
      if (off == true && this.onceFlag == false) {
        //计算出滚动高度
        let avgVal = 0;
        $(".active").each(function () {
          if ($(this).prev().length == 1) {
            let $tempDom = $(this).prev();
            avgVal = $tempDom[0].offsetHeight / 2;
            //console.log(avgVal);
          } else {
            avgVal = 20;
          }
        });
        //记录当前index
        this.onceIndex = index;
        //记录滚动前的scrollTop
        // let temp =  scrollDom.scrollTop;
        //scollTop增加
        // scrollDom.scrollTop++
        $(".m-inner").animate(
          { scrollTop: scrollDom.scrollTop + avgVal },
          1000
        );
        this.onceFlag = true;
      }
      //进度条分子
      if (off == true) {
        this.currentTimes = index + 1;
      }
      return off;
    },
    curOff2(item, index, paraphList) {
      let scrollDom = document.querySelector(".m-inner");
      let articalDom = document.querySelector(".artical");
      let off = false;
      if (this.currentTime <= this.sArray[0]) {
        if (
          this.currentTime > this.yArray[index] &&
          !(paraphList[index + 1] == undefined) &&
          this.currentTime <= this.yArray[index + 1]
        ) {
          // console.log("普通句子");
          //   console.log("111:"+this.currentTime+","+this.yArray[index]+","+this.yArray[index + 1])
          off = true;
        } else if (
          paraphList[index + 1] == undefined &&
          this.currentTime <= this.sArray[0] &&
          this.currentTime != 0 &&
          this.currentTime > this.yArray[index]
        ) {
          // console.log("最后一句");
          off = true;
        } else {
          // console.log("222:"+this.currentTime+","+this.yArray[index]+","+this.yArray[index + 1]);
          off = false;
        }
      } else {
        // console.log("yyyyyyyyy");
        off = false;
      }
      if (off == true && this.onceIndex != index) {
        this.onceFlag = false;
      }
      if (off == true && this.onceFlag == false) {
        //计算出滚动高度
        let avgVal = 0;
        $(".translate.active").each(function () {
          if ($(this).prev().length == 1) {
            let $tempDom = $(this).prev();
            avgVal = $tempDom[0].offsetHeight;
            //console.log(avgVal);
          } else {
            avgVal = 20;
          }
        });
        //记录当前index
        this.onceIndex = index;
        $(".m-inner").animate(
          { scrollTop: scrollDom.scrollTop + avgVal },
          1000
        );
        this.onceFlag = true;
      }
      if (off == true) {
        this.currentTimes = this.zArray.length + index + 1;
      }
      return off;
    },
    curOff3(item, index, introductionList) {
      let scrollDom = document.querySelector(".m-inner");
      let off = false;
      if (this.currentTime >= this.sArray[0]) {
        if (
          this.currentTime > this.sArray[index] &&
          !(introductionList[index + 1] == undefined) &&
          this.currentTime <= this.sArray[index + 1]
        ) {
          off = true;
        } else if (
          this.introductionList[index + 1] == undefined &&
          this.currentTime > this.sArray[index] &&
          this.currentTime != 0
        ) {
          off = true;
        } else {
          off = false;
        }
      } else {
        off = false;
      }
      if (off == true && this.onceIndex != index) {
        this.onceFlag = false;
      }
      if (off == true && this.onceFlag == false) {
        //计算出滚动高度
        let scrollDom = document.querySelector(".m-inner");
        let avgVal = 0;
        $(".spara.active").each(function () {
          if ($(this).prev().prevObject.length == 1) {
            let $tempDom = $(this).prev().prevObject;
            avgVal = $tempDom[0].offsetHeight;
          } else {
            //这里始终没有执行
            avgVal = 0;
            console.log(avgVal + ":222");
          }
        });

        //记录当前index
        this.onceIndex = index;
        $(".m-inner").animate(
          { scrollTop: scrollDom.scrollTop + avgVal },
          1000
        );
        this.onceFlag = true;
      }
      if (off == true) {
        this.currentTimes = this.zArray.length + this.yArray.length + index + 1;
      }

      return off;
    },
    updateContent() {
      //   $(".m-inner").animate(
      // { scrollTop: 0 },1000);
      document.querySelector(".m-inner").scrollTop = 0;
      let newPara = new Array();
      for (let i = 0; i < this.$store.state.ex_course.poemList[this.poemIndex].article.length; i++) {
        newPara[i] = this.$store.state.ex_course.poemList[this.poemIndex].article[i];
      }
      //筛选出正文并存放在newPara中
      for (let i = 0; i < newPara.length; i++) {
        if (newPara[i].sentence == "译文") {
          //从当前i的位置开始删除后面的所有数组内容
          newPara.splice(i);
        }
      }
      this.paraphList = newPara;
      console.log("1111:");
      console.log(this.paraphList);
      this.introductionList = this.$store.state.ex_course.poemList[this.poemIndex].introductionList;
      for (let i = 2; i < this.paraphList.length; i++) {
        this.allphraseArray.push(this.paraphList[i].allphrase);
      }
      console.log("222:");
      console.log(this.allphraseArray);
      let audio = $("#audio")[0];
      let that = this;
      let a = new Array();
      let b = new Array();
      let c = new Array();
      let ywFlag = 0;
      for (let i = 0; i < this.$store.state.ex_course.poemList[this.poemIndex].article.length; i++) {
        if (this.$store.state.ex_course.poemList[this.poemIndex].article[i].sentence == "译文") {
          ywFlag = i;
          b.push(this.$store.state.ex_course.poemList[this.poemIndex].article[i].time);
        }
        if (
          !(this.$store.state.ex_course.poemList[this.poemIndex].article[i].sentence == "译文") &&
          ywFlag == 0
        ) {
          a.push(this.$store.state.ex_course.poemList[this.poemIndex].article[i].time);
        }
      }
      for (
        let i = 0;
        i < this.$store.state.ex_course.poemList[this.poemIndex].introductionList.length;
        i++
      ) {
        c.push(this.$store.state.ex_course.poemList[this.poemIndex].introductionList[i].time);
      }
      //   if(this.poemLength>1){

      //   }else{
      // this.duration = c[c.length - 1];
      //   }

      this.duration = a.length + b.length + c.length;
      this.zArray = a;
      this.yArray = b;
      this.sArray = c;
      ++this.poemIndex;

    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.m-box {
  // background: url("./../assets/images/beijing.jpg");
  .m-inner {
    height: 91%;
    overflow: scroll;
    .main-content {
      width: 94%;
      margin: 56 / @rem auto 0;
      font-size: 40 / @rem;
      line-height: 2.333333rem;
      text-align: center;
      letter-spacing: 0.1rem;
      .l-item {
        line-height: 2rem;
        position: relative;
        p:last-child {
          font-family: "heiti";
        }
        .finger {
          width: 1.3rem;
          height: 1rem;
          // .postion(0,0,2);
          position: absolute;
          left: -0.4rem;
          top: 0.4rem;
        }
        .sentence {
          font-size: 1.4rem;
          padding-left: 1rem;
          font-family: heiti;
          &.active {
            color: #259359;
          }
        }
      }
    }
  }
}

.translate-contain {
  width: 94%;
  // padding-bottom: 680 / @rem;
  margin: 56 / @rem auto 0;
  font-size: 40 / @rem;
  line-height: 56 / @rem;
  position: relative;
  text-align: justify;
  font-family: "heiti";
  .translate {
    font-size: 1.2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    text-indent: 1rem;
    &.active {
      color: #259359;
    }
  }
  .summary-box {
    width: 100%;
    position: relative;
    .wenli {
      width: 100%;
      margin-top: 30 / @rem;
      .postion(0, 0, 11);
    }
    .summary {
      width: 88vw;
      position: absolute;
      left: 2.8vw;
      top: 4vw;
      text-align: justify;
      letter-spacing: 0.1rem;
      .spara {
        &.active {
          color: #259359;
        }
      }
    }
  }
  .fanyi {
    width: 1.3rem;
    height: 1rem;
    //.postion(0,0,2);
    position: absolute;
    left: -0.4rem;
    top: 0.4rem;
  }
}
.pinyin {
  padding-left: 1rem;
  font-size: 1.2rem;
  font-family: "heiti";
  &.active {
    color: #259359;
  }
}

.translate {
  font-size: 1.2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-family: "heiti";
  &.active {
    color: #259359;
  }
}

.summary {
  text-indent: 1em;
  font-size: 1.2rem;
  font-family: heiti;
  .spara {
    &.active {
      color: #259359;
    }
  }
}
</style>
