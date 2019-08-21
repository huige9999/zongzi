<template>
  <div class="m-box">
    <div class="m-inner">
      <app-header isShowZ="false" isShowL="true" :c_time="currentTime" :f_time="duration">
        <p slot="title" class="ph-title">听一听</p>
      </app-header>
      <!-- <audio id="audio" :src='audioSrc'  controls  autoplay="false">
      </audio>-->
      <!-- <img class="l-img" src="./../assets/images/bianri.png" alt="" /> autoplay-->
      <img class="l-img" :src="imgPath" alt>
      <div class="l-artical">
        <div class="l-topic">
          <p class="l-title">{{articleTitle}}</p>
          <p class="l-author">{{articleWriter}}</p>
        </div>
        <div class="l-content">
          <!-- 遍历课文段落列表渲染 -->
          <p
            v-for="(item,index) in paraphList"
            :key="index"
            v-html="item.sentence"
            :class="curOff(item,index,paraphList)?'active':''"
          ></p>
        </div>
      </div>
    </div>

    <!-- <div class="bottom-contain">
      <div class="control-btn" @click="playControl()" style="top:11vh" >{{btnText}}</div>
    </div>-->
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import $ from "jquery";
import axios from "axios";
import qs from "qs";
import wx from "weixin-js-sdk";
export default {
  name: "listen",
  data() {
    return {
      paraphList: [],
      articleTitle: "",
      articleWriter: "",
      imgPath: "",
      audioSrc: "",
      currentTime: 0,
      currentTimes: 0,
      duration: 60,
      isPlay: true,
      isEnd: false,
      zArray: [],
      yArray: [],
      sArray: [],
      //音频播放次数(1次标识今天学一学任务完成)
      times: 0,
      onceIndex: 0,
      onceFlag: false
    };
  },
  components: { AppHeader },
  created() {
    if (localStorage.getItem("isVip") == undefined) {
      axios
        .get(this.$store.state.baseUrlFront + "course/TYCourse", {
          params: { courseType: this.$store.state.courseType }
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.$store.commit("save_ex_course", res.data.data.courseware);
          }
        });
    } else {
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
    }
  },
  mounted() {
    let newPara = new Array();
    let that = this;

    for (let i = 0; i < this.$store.state.ex_course.article.length; i++) {
      newPara[i] = this.$store.state.ex_course.article[i];
    }

    //筛选出正文并存放在newPara中
    for (let i = 0; i < newPara.length; i++) {
      if (newPara[i].sentence == "译文") {
        //从当前i的位置开始删除后面的所有数组内容
        newPara.splice(i);
      }
    }

    this.paraphList = newPara;
    //正文加拼音
    for (var i = 0; i < this.paraphList.length; i++)
      for (var j = 0; j < this.paraphList[i].words.length; j++) {
        if (!(this.paraphList[i].words[j].pinyin == "")) {
          this.paraphList[i].sentence = this.paraphList[i].sentence.replace(
            this.paraphList[i].words[j].word,
            this.paraphList[i].words[j].word +
            "<label>(</label><label>" +
            this.paraphList[i].words[j].pinyin +
            "</label><label>)</label>"
          );
        }
      }

    this.articleTitle = this.$store.state.ex_course.title;
    this.articleWriter = this.$store.state.ex_course.writer;
    this.imgPath =
      this.$store.state.imgUrlFront + this.$store.state.ex_course.pic_url;
    this.audioSrc =
      this.$store.state.soundUrlFront + this.$store.state.ex_course.sound_path;
    let audio = document.getElementById("myaudio");
    //let audio = $("#audio")[0];
    // let audio = new Audio();
    //  let audio = this.GLOBAL.myAudio
    audio.src = this.audioSrc;
    //播放音频
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
          audio.play();
        });
      });
    //  document.addEventListener('WeixinJSBridgeReady',function(){
    // audio.play();
    //  },false)
    let a = new Array();
    let b = new Array();
    let c = new Array();
    let ywFlag = 0;
    for (let i = 0; i < this.$store.state.ex_course.article.length; i++) {
      if (this.$store.state.ex_course.article[i].sentence == "译文") {
        ywFlag = i;
        b.push(this.$store.state.ex_course.article[i].time);
      }
      if (
        !(this.$store.state.ex_course.article[i].sentence == "译文") &&
        ywFlag == 0
      ) {
        a.push(this.$store.state.ex_course.article[i].time);
      }
    }
    for (
      let i = 0;
      i < this.$store.state.ex_course.introductionList.length;
      i++
    ) {
      c.push(this.$store.state.ex_course.introductionList[i].time);
    }
    this.duration = b[0];
    this.zArray = a;
    this.yArray = b;
    this.sArray = c;
    console.log("听一听停止时间")
    console.log(b[0]);
    $(audio).bind("timeupdate", function () {
      console.log(this.currentTime);
      //用作顶部进度条的分子分母
      that.currentTimes = Number(this.currentTime.toFixed(2));

      that.currentTime = this.currentTime;
      if (Number(this.currentTime.toFixed(0)) >= Number(b[0]) + 0.5) {
        that.isPlay = false;
        that.isEnd = true;
        audio.pause();
        this.currentTime = 0.0;
        //播放次数记录
        that.times++;
        //记录当天听一听任务已完成
        if (that.times == "1") {
          if (localStorage.getItem("cram") == "yes") {
            //记录补课状态下的听一听任务已经完成
            axios
              .post(
                that.$store.state.baseUrlFront + "module/saveModule",
                qs.stringify({
                  USER_ID: localStorage.getItem("USER_ID"),
                  date: localStorage.getItem("learnDate"),
                  module: "t",
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
            if (!(localStorage.getItem("isVip") == undefined)) {
              //非补课状态下听一听任务已经完成
              localStorage.setItem("listenCompleted", "yes");
              axios
                .post(
                  that.$store.state.baseUrlFront + "module/saveModule",
                  qs.stringify({
                    USER_ID: localStorage.getItem("USER_ID"),
                    date: localStorage.getItem("currentDate"),
                    module: "t",
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
          }
          //如果是非会员
          if (localStorage.getItem("isVip") == undefined) {
            let type = localStorage.getItem("courseType");
            localStorage.setItem("listenCompleted" + type, "yes");
          }
        }
        setTimeout(function () {
          //跳转到下一个页面
          that.$router.replace("Learn");
        }, 1000);
      }
    })
  },
  beforeDestroy() {
    let audio = document.getElementById("myaudio");
    $(audio).unbind("timeupdate");
    audio.pause();
  },
  // computed: {
  //   btnText() {
  //     let that = this;
  //     let text = "";
  //     if (!this.isEnd) {
  //       text = this.isPlay ? "暂停" : "继续";
  //     } else {
  //       text = "继续";
  //       //播放次数记录
  //       this.times++;
  //       //记录当天听一听任务已完成
  //       if (this.times == "1") {
  //         //this.$store.commit('update_listenCompleted',true);
  //         localStorage.setItem("listenCompleted", "yes"); localStorage.setItem("listenCompleted", "yes");
  //       }
  //       setTimeout(function() {
  //         //跳转到下一个页面
  //         //that.$router.push({ name: "Learn" });
  //         that.$router.replace("Learn");
  //       }, 1000);
  //     }
  //     return text;
  //   }
  // },
  methods: {
    curOff(item, index, paraphList) {
      let scrollDom = document.querySelector(".l-content");

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
            avgVal = 0;
          }
        });
        //记录当前index
        this.onceIndex = index;
        //记录滚动前的scrollTop
        // let temp =  scrollDom.scrollTop;
        //scollTop增加
        // scrollDom.scrollTop++
        scrollDom.scrollTop += avgVal;
        $(".l-content").animate(
          { scrollTop: scrollDom.scrollTop + avgVal },
          1000
        );
        this.onceFlag = true;
      }

      return off;
    }
    // playControl() {
    //   if (this.isEnd) {
    //     //this.isEnd = false;
    //     this.$router.push({ name: "Learn" });
    //   }
    //   if (!this.isPlay) {
    //     audio.play();
    //     this.isPlay = true;
    //   } else {
    //     audio.pause();
    //     this.isPlay = false;
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";
.l-img {
  width: 652 / @rem;
  height: 356 / @rem;
  display: block;
  margin: 50 / @rem auto 0;
}

.l-artical {
  width: 82%;
  margin: 1.26666667rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .l-topic {
    display: flex;
    align-items: flex-end;
    font-family: "heiti";
    font-weight: 400;
    .l-title {
      margin-left: 100 / @rem;
      font-size: 46 / @rem;
      font-weight: 600;
    }
    .l-author {
      font-size: 24 / @rem;
      // font-weight: 500;
      margin-left: 20 / @rem;
    }
  }
  .l-content {
    font-size: 1.36rem;
    line-height: 2.7rem;
    letter-spacing: 0.0333338rem;
    margin-top: 1.3666667rem;
    height: 16rem;
    overflow: scroll;
    p {
      &.active {
        color: #2d8f5a;
      }
    }
  }
  @media screen and (min-height: 956px) {
    .l-content {
      font-size: 1.36rem;
      line-height: 2.7rem;
      letter-spacing: 0.0333338rem;
      margin-top: 1.3666667rem;
      height: 11rem;
      overflow: scroll;
      p {
        &.active {
          color: #2d8f5a;
        }
      }
    }
  }
}
</style>