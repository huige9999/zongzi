<template>
  <div class="m-box">
    <div class="m-inner">
      <app-header isShowL="true" :c_time="sentenceIndex" :f_time="sentenceLength">
        <p slot="title" class="ph-title">读一读</p>
      </app-header>
      <!-- <audio id="audio" :src='audioSrc'  style='display:none'>
      </audio>-->
      <!-- <audio id="audio4" :src='audioSrc'  controls  style='display:none'>
      </audio>-->
      <audio id="audio2" :src="audioSrc2" style="display:none"></audio>
      <div class="artical" style="width:84%">
        <!-- 遍历课文段落列表渲染 -->
        <!-- <p v-if="isVip==true" v-for="item,index in paraphList" :key="index" v-html="item" :class="curOff(item,index,paraphList)?'active':''"></p>
        <p v-if="isVip==false" v-for="item,index in paraphList" :key="index" v-html="item.sentence" :class="curOff(item,index,paraphList)?'active':''"></p>-->
        <p
          v-if="dayTypes==true"
          v-for="item,index in paraphList"
          :key="index"
          v-html="item"
          :class="curOff(item,index,paraphList)?'active':''"
          style="text-align:center"
        ></p>
        <p
          v-if="dayTypes==false"
          v-for="item,index in paraphList"
          :key="index"
          v-html="item"
          :class="curOff(item,index,paraphList)?'active':''"
        ></p>
      </div>
      <div class="control-btn" @click="goNext()" style="bottom:0;position:absolute;">下一页</div>
    </div>

    <div class="bottom-contain" style="bottom:6.5rem;">
      <div class="audio-box">
        <div class="audio-inner">
          <div class="audio-item" @click="playControl()" id="yuanyin">
            <p>原音</p>
            <div
              :style="{backgroundImage:'url('+yuanyinSrc+')',backgroundSize:'100% 100%'}"
              class="audioImg"
            ></div>
            <!-- <img :src="yuanyinSrc" alt id="playImg"> -->
          </div>
          <div class="audio-item" @click="record()">
            <p>点击录音</p>
            <!-- <img class="l-img" src="./../assets/images/_luyin_normal.png" alt=""/> -->
            <img class="l-img" :src="luyinSrc" alt>
          </div>
          <div class="audio-item" @click="playRecord()">
            <p>录音</p>
            <div
              :style="{backgroundImage:'url('+yuanyinSrc2+')',backgroundSize:'100% 100%'}"
              class="audioImg"
            ></div>
            <!-- <img :src="yuanyinSrc2" alt> -->
          </div>
        </div>
        <div class="audio-pro">
          <div class></div>
        </div>
        <div class="audiowarp" style="display:none"></div>
      </div>
      <!--原音的进度条-->
      <!-- <progress-bar id="n-all"  :c_times="currentTime" :f_times="duration" style="position:relative;top:-1.8rem;left:8%;display:''">
         <p slot="titles" class="ph-title"></p>
      </progress-bar>-->
      <!--录音的进度条-->
      <div class="n-phbox" id="n-all2" style="display:block">
        <div class="n-complete" id="n-cur2" style="margin:0 auto;height:0.6rem;"></div>
        <div class="n-uncomplete"></div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import ProgressBar from "@/components/ProgressBar";
import axios from "axios";
import wx from "weixin-js-sdk";
import qs from "qs";
export default {
  name: "read-article",
  data() {
    return {
      paraphList: [],
      // articleTitle:'',
      // articleWriter:'',
      imgPath: "",
      audioSrc: "",
      //录音的音频
      audioSrc2: "",
      yuanyinSrc: require("./../assets/images/luyin_active.png"),
      yuanyinSrc2: require("./../assets/images/original_normal.png"),
      luyinSrc: require("./../assets/images/_luyin_normal.png"),
      currentTime: 0,
      currentTimes: 0,
      duration: 60,
      isPlay: false,
      isEnd: false,
      localIds: "",
      times: "",
      times2: "",
      dayType: 2,
      dArray: [],
      zArray: [],
      yArray: [],
      sArray: [],
      sentenceIndex: 0,
      sentenceLength: 0,
      dayTypes: false,
      isPlay2: false,
      isEnd2: true
    };
  },
  components: {
    AppHeader,
    ProgressBar
  },
  mounted() {
    // localStorage.setItem("readArticleCompleted-now","yes");
    if (localStorage.getItem("cram") == "yes") {
      axios
        .post(
          this.$store.state.baseUrlFront + "module/saveModule",
          qs.stringify({
            USER_ID: localStorage.getItem("USER_ID"),
            date: localStorage.getItem("learnDate"),
            module: "txzs",
            activemodule: "xzd"
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
      if (!(localStorage.getItem("isVip") == undefined) && localStorage.getItem("learnDate") == undefined) {
        localStorage.setItem("readArticleCompleted-now", "yes");
        axios
          .post(
            this.$store.state.baseUrlFront + "module/saveModule",
            qs.stringify({
              USER_ID: localStorage.getItem("USER_ID"),
              date: localStorage.getItem("currentDate"),
              module: "txzs",
              activemodule: "xzd"
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
    if (localStorage.getItem("isVip") == undefined) {
      let type = localStorage.getItem("courseType");
      localStorage.setItem("readArticleCompleted-now" + type, "yes");
    }
    this.sentenceLength = this.$store.state.ex_course.readingList.length;

    var dayStr = "日一二三四五六".charAt(new Date().getDay());
    if (dayStr == "日") {
      this.dayType = 0;
    } else if (dayStr == "六") {
      this.dayType = 1;
    } else {
      this.dayType = 2;
    }
    this.imgPath =
      this.$store.state.imgUrlFront + this.$store.state.ex_course.pic_url;
    this.audioSrc =
      this.$store.state.soundUrlFront + this.$store.state.ex_course.sound_path;
    //let audio = $("#audio")[0];
    let audio = document.getElementById("myaudio");
    audio.src = this.audioSrc;
    let that = this;
    if (localStorage.getItem("learnDate") == undefined) {
      if (localStorage.getItem("isVip") == undefined) {
        //非会员按非周日情况算
        this.dayTypes = false;
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
        this.zArray = a;
        this.yArray = b;
        this.sArray = c;
        this.updateContent();
      } else {
        //会员的情况
        //非日历界面跳转
        if (this.dayType == 0) {
          this.dayTypes = true;
          this.updateContent2();
        } else {
          this.dayTypes = false;
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
          this.zArray = a;
          this.yArray = b;
          this.sArray = c;
          this.updateContent();
        }
      }

    } else {
      if (localStorage.getItem("isVip") == undefined) {
        this.dayTypes = false;
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
        this.zArray = a;
        this.yArray = b;
        this.sArray = c;
        this.updateContent();
      } else {
        //日历界面跳转过来
        let newDate = localStorage.getItem("learnDate")
        let myDate = new Date(Date.parse(newDate));
        let dayStr = "日一二三四五六".charAt(myDate.getDay());
        if (dayStr == "日") {
          this.dayTypes = true;
          this.updateContent2();
        } else {
          this.dayTypes = false;
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
          this.zArray = a;
          this.yArray = b;
          this.sArray = c;
          this.updateContent();
        }
      }

    }


    //待测试。。。
    // this.paraphList.push(this.$store.state.ex_course.reading_content);

    //筛选出读一读的音频
    // for(let i=0;i<a.length;i++){
    //  if(a[i]==this.$store.state.ex_course.reading_time){
    //    d.push(a[i]);
    //    if(a[i+1]==undefined){
    //      d.push(b[0]);
    //    }else{
    //      d.push(a[i+1]);
    //    }
    //  }
    //  this.dArray = d;
    // }
    // if(localStorage.getItem("isVip")==undefined){
    //   audio.addEventListener(
    //     "timeupdate",
    //     function() {
    //       that.currentTimes = Number(this.currentTime.toFixed(1));
    //       that.currentTime = Number(this.currentTime.toFixed(1));
    //       that.duration = b[0];
    //       if (Number(this.currentTime.toFixed(0)) == b[0]) {
    //         that.isPlay = false;
    //         that.isEnd = true;
    //         audio.pause();
    //         this.currentTime = 0.0
    //       }
    //     },
    //     false
    //   );
    // }else{

    //     audio.addEventListener(
    //   "timeupdate",
    //   function() {
    //      let ts2 = 0;
    //       let totals2 = Number(that.dArray[1])-Number(that.dArray[0]);
    //       console.log("totals2:"+totals2);
    //     that.currentTimes = this.currentTime;
    //     that.currentTime = Number(this.currentTime.toFixed(0))-Number(that.dArray[0]);

    //     ts2=that.currentTime;
    //       let totalWidth = $("#n-all2").css("width");
    //       console.log(ts2+","+Number(that.dArray[0])+","+Number(this.currentTime.toFixed(0)));
    //      // console.log(ts2+","+totals2+","+totalWidth);
    //       let width = (ts2 / totals2) * parseInt(totalWidth);

    //       $("#n-cur2").css("margin", "");
    //       $("#n-cur2").css("width", width);

    //     if (Number(this.currentTime.toFixed(1)) >= Number(that.dArray[1])+0.5) {
    //       that.isPlay = false;
    //       that.isEnd = true;
    //       audio.pause();
    //       that.currentTime = 0.0;
    //       that.currentTimes = 0.0;
    //        document.getElementById("n-all2").style.display = "block";
    //         $("#n-cur2").css("width", 0);
    //     }

    //   },
    //   false
    // );
    $(audio).bind("timeupdate", function () {
      let ts2 = 0;
      let totals2 = Number(that.dArray[1]) - Number(that.dArray[0]);
      // console.log("totals2:" + totals2);
      that.currentTimes = this.currentTime;
      that.currentTime = Number(this.currentTime.toFixed(0)) - Number(that.dArray[0]);

      ts2 = that.currentTime;
      let totalWidth = $("#n-all2").css("width");
      console.log(ts2 + "," + Number(that.dArray[0]) + "," + Number(this.currentTime.toFixed(0)));
      // console.log(ts2+","+totals2+","+totalWidth);
      let width = (ts2 / totals2) * parseInt(totalWidth);

      $("#n-cur2").css("margin", "");
      $("#n-cur2").css("width", width);

      if (Number(this.currentTime.toFixed(1)) >= Number(that.dArray[1]) + 0.5) {
        that.isPlay = false;
        that.isEnd = true;
        audio.pause();
        that.currentTime = 0.0;
        that.currentTimes = 0.0;
        document.getElementById("n-all2").style.display = "block";
        $("#n-cur2").css("width", 0);
      }
    })
    // }

  },
  created() {
    //调用接口获取微信配置参数
    axios
      .get(this.$store.state.baseUrlFront + "courseware/getWxSignature", {
        params: {
          url: location.href
        }
      })
      .then(res => {
        //console.log(res);
        let params = {
          debug: false,
          appId: res.data.signature.appId,
          timestamp: res.data.signature.timestamp,
          nonceStr: res.data.signature.nonceStr,
          signature: res.data.signature.signature,
          jsApiList: [
            "startRecord",
            "stopRecord",
            "uploadVoice",
            "onVoicePlayEnd",
            "playVoice",
            "downloadVoice",
            "stopVoice",
            "pauseVoice"
          ]
        };
        wx.config(params);
        wx.ready(function () {
          let audio = document.getElementById("myaudio");
          audio.play();
          // if(audio.currentTime>=0.1){
          //   audio.pause();
          // }
          let times = setInterval(function () {
            audio.pause();
            clearInterval(times);
          }, 1)
        });
        wx.error(function (res) {
          // console.log("config配置出错");
        });
      });
    if (localStorage.getItem("isVip") == undefined) {
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
  computed: {
    btnText() {
      console.log(this.isEnd);
      let text = "";
      if (!this.isEnd) {
        text = this.isPlay ? "下一页" : "下一页";
      } else {
        text = "下一页";
      }
      return text;
    }
  },
  beforeDestroy() {
    let audio = document.getElementById("myaudio");
    $(audio).unbind("timeupdate");
    audio.pause();
  },
  methods: {
    record() {
      //如果正在播放原音，不可以录音
      if (this.isPlay == true) {
        alert("原音频播放时不可录音");
      } else {
        //录音播放active
        this.yuanyinSrc2 = require("./../assets/images/luyin_active.png");
        //下一页可点击
        this.isEnd = true;

        let doms = document.getElementById("n-all2");
        // let doms2 = document.getElementById("n-all");
        if (doms.style.display.length > 0) {
          //开始录音
          this.touchstart();
          this.luyinSrc = require("./../assets/images/_luyin_active.png");
          //隐藏原音进度条
          // if(!(doms2.style.display.length>0)){
          //     doms2.style.display="none";
          // }
        } else {
          //停止录音
          this.touchend();
          this.luyinSrc = require("./../assets/images/_luyin_normal.png");

        }
      }
    },
    //按下开始录音
    touchstart() {
      //外圈显示
      let circleDom = document.querySelector(".audiowarp");
      circleDom.style.display = "";
      $("#n-cur2").css("width", 0);
      let that = this;
      let t = 0;
      let total = this.duration + 5;
      that.times = setInterval(function () {
        t++;
        console.log(t + "," + total);
        //如果当前时间超出总时间则停止计时
        if (t > total) {
          document.getElementById("n-all2").style.display = "block";
          circleDom.style.display = "none";
          clearInterval(that.times);
          $("#n-cur2").css("width", 0);
          that.luyinSrc = require("./../assets/images/_luyin_normal.png");
          wx.stopRecord({
            success: function (res) {
              that.localIds = res.localId;
              if (!(localStorage.getItem("isVip") == undefined)) {
                //停止录音后将音频上传到微信服务器并下载到本地
                that.uploadVoice();
              }

            },
            fail: function (res) {
              console.log("结束录音fail" + JSON.stringify(res));
            }
          });
        } else {
          let totalWidth = $("#n-all2").css("width");
          let width = (t / total) * parseInt(totalWidth);
          $("#n-cur2").css("margin", "0 auto");
          $("#n-cur2").css("width", width);
        }
      }, 1000);
      //let totalWidth =  $('#all').css('width') ;
      document.getElementById("n-all2").style.display = "";
      let recordTimer = setTimeout(function () {
        wx.startRecord({
          success: function () {
            // alert("开始录音喽!");
            //localStorage.rainAllowRecord = 'true';
          },
          cancel: function () {
            alert("用户拒绝授权录音");
          }
        });
      }, 300);
    },

    //松手结束录音
    touchend() {
      //外圈隐藏
      let circleDom = document.querySelector(".audiowarp");
      circleDom.style.display = "none";
      clearInterval(this.times);
      document.getElementById("n-all2").style.display = "block";
      let that = this;
      $("#n-cur2").css("width", 0);
      wx.stopRecord({
        success: function (res) {
          that.localIds = res.localId;
          if (!(localStorage.getItem("isVip") == undefined)) {
            //停止录音后将音频上传到微信服务器并下载到本地
            that.uploadVoice();
          }

        },
        fail: function (res) {
          console.log("结束录音fail" + JSON.stringify(res));
        }
      });
    },
    playRecord() {
      if (localStorage.getItem("isVip") == undefined) {
        let that = this;
        if (that.localIds.length > 0) {
          this.yuanyinSrc2 = require("./../assets/images/luyin_active.png");
          wx.playVoice({
            localId: that.localIds // 需要播放的音频的本地ID，由stopRecord接口获得
          });
          wx.onVoicePlayEnd({
            success: function (res) {
              that.yuanyinSrc2 = require("./../assets/images/original_normal.png");
            }
          });

        } else {
          alert("请先录音");
        }
      } else {
        let that = this;
        let audio = $("#audio2")[0];
        if (this.isPlay == false) {
          if (this.audioSrc2.length > 0) {
            audio.load();
            wx.ready(function () {
              audio.play();
            })
            let ts2 = 0;
            audio.oncanplay = function () {
              let totals2 = audio.duration.toFixed(0);
              that.isPlay2 = true;
              that.isEnd2 = false;
              //真实录音音频进度条
              audio.addEventListener(
                "timeupdate",
                function () {

                  ts2 = this.currentTime.toFixed(0);
                  let totalWidth = $("#n-all2").css("width");

                  let width = (ts2 / totals2) * parseInt(totalWidth);
                  $("#n-cur2").css("position", "absolute");
                  $("#n-cur2").css("right", "0");
                  $("#n-cur2").css("width", width);

                },
                false
              );
              audio.addEventListener("ended", function () {
                document.getElementById("n-all2").style.display = "block";
                $("#n-cur2").css("width", 0);
                $("#n-cur2").css("position", "");
                $("#n-cur2").css("right", "");
                that.isPlay2 = false;
                that.isEnd2 = true;
                ts2 = 0;
              });


            }




            //   	this.times2 = setInterval(function() {
            //    ts2++;
            //   //如果当前时间超出总时间则停止计时
            //   if (ts2==30) {
            //     document.getElementById("n-all2").style.display = "block";
            //     clearInterval(that.times2);
            //        $("#n-cur2").css("width", 0);
            //        $("#n-cur2").css("position", "");
            //         $("#n-cur2").css("right", "");
            //   } else {
            //     let totalWidth = $("#n-all2").css("width");
            //     let width = (ts2 / totals2) * parseInt(totalWidth);
            //     $("#n-cur2").css("position", "absolute");
            //     $("#n-cur2").css("right", "0");
            //     $("#n-cur2").css("width", width);
            //   }
            // }, 1000);
          } else {
            alert("录音加载中");
          }
        }
        // let that = this;
        // if (that.localIds.length > 0) {
        //   this.yuanyinSrc2 = require("./../assets/images/luyin_active.png");
        //   wx.playVoice({
        //     localId: that.localIds // 需要播放的音频的本地ID，由stopRecord接口获得
        //   });
        //   wx.onVoicePlayEnd({
        //     success: function(res) {
        //       that.yuanyinSrc2 = require("./../assets/images/original_normal.png");
        //     }
        //   });
        //   let ts2 = 0;
        //   let totals2 = 30;
        //   //模拟进度条
        //   	this.times2 = setInterval(function() {
        //    ts2++;
        //   //如果当前时间超出总时间则停止计时
        //   if (ts2==30) {
        //     document.getElementById("n-all2").style.display = "block";
        //     clearInterval(that.times2);
        //        $("#n-cur2").css("width", 0);
        //        $("#n-cur2").css("position", "");
        //         $("#n-cur2").css("right", "");
        //   } else {
        //     let totalWidth = $("#n-all2").css("width");
        //     let width = (ts2 / totals2) * parseInt(totalWidth);
        //     $("#n-cur2").css("position", "absolute");
        //     $("#n-cur2").css("right", "0");
        //     $("#n-cur2").css("width", width);
        //   }
        // }, 1000);
        // } else {
        //   alert("请先录音");
        // }
      }

    },
    curOff(item, index, paraphList) {
      let off = false;
      if (this.dArray[index] >= this.currentTimes) {
        off = false;
      } else {
        off = true;
        if (
          !(this.dArray[index + 1] == undefined) &&
          this.currentTimes - this.dArray[index + 1] >= 0.5
        ) {
          off = false;
        }
      }
      return off;
      //  if(localStorage.getItem("isVip")==undefined){
      //     let off = false;
      //     if (item.time >= this.currentTime) {
      //       off = false;
      //     } else {
      //       off = true;
      //       if (
      //         !(paraphList[index + 1] == undefined) &&
      //         paraphList[index + 1].time - this.currentTime <= 1
      //       ) {
      //         off = false;
      //       }
      //       if (paraphList[index + 1] == undefined) {
      //         setTimeout(function() {
      //           off = false;
      //         }, 3000);
      //       }
      //     }
      //     this.curOffFlag = off;
      //     return off;
      //  }else{
      //           let off = false;
      //     if (this.dArray[index] >= this.currentTimes) {
      //       off = false;
      //     } else {
      //       off = true;
      //       if (
      //         !(this.dArray[index+1]== undefined) &&
      //          this.currentTimes-this.dArray[index+1] >=0.5
      //       ) {
      //         off = false;
      //       }
      //     }
      //     return off;

      //  }
    },
    playControl() {
      let audio = document.getElementById("myaudio");

      if (this.isEnd) {
        //this.isEnd = false;
        //读一读已经完成的标识
        this.$store.commit("update_readArticleCompleted", true);
        // this.$router.push({
        //   path: "/TYthreeLevel"
        // });
      }
      let doms = document.getElementById("n-all2");
      if (this.isEnd2 == true) {
        if (doms.style.display.length > 0) {
          if (!this.isPlay) {
            // if(localStorage.getItem("isVip")==undefined){

            // }else{
            //     audio.currentTime =  Number(this.dArray[0]) + 0.5;
            // }

            audio.currentTime = Number(this.dArray[0]) + 0.5;
            wx.ready(function () {
              audio.play();
            })

            this.isPlay = true;
            //播放中，图标变为暂停
            this.yuanyinSrc = require("./../assets/images/luyin_active.png");
            //audio.currentTime =  Number(this.dArray[0]) + 0.5;

            // let that = this;
            // let ts2 = 0;
            // let totals2 = Number(this.dArray[1])-Number(this.dArray[0]);
            // console.log("totals2:"+totals2);
            //     this.times2 = setInterval(function() {
            //     ts2=that.currentTime;
            //     console.log("currentTime:"+ts2);
            //   //如果当前时间超出总时间则停止计时
            //   if (ts2==0) {
            //     document.getElementById("n-all2").style.display = "block";
            //     clearInterval(that.times2);
            //        $("#n-cur2").css("width", 0);
            //   } else {
            //     let totalWidth = $("#n-all2").css("width");
            //      console.log("totalWidth:"+totalWidth);
            //     let width = (ts2 / totals2) * parseInt(totalWidth);

            //     $("#n-cur2").css("margin", "");
            //     $("#n-cur2").css("width", width);
            //   }
            // }, 100);

          } else {
            // clearInterval(this.times2);
            //audio.pause();
            //this.isPlay = false;
            //播放停止，图标变为灰色
            //this.yuanyinSrc = require("./../assets/images/original_normal.png");
            //进度条隐藏
            //document.getElementById("n-all").style.visibility = "hidden";
          }
        } else {
          alert("录音的时候不可以听原音");
        }
      }
    },
    goNext() {
      let that = this;
      // console.log(this.isEnd);
      //关闭正在播放的录音
      wx.stopVoice({
        localId: that.localIds
      })
      // if (this.isEnd) {
      if (this.sentenceIndex < this.sentenceLength) {
        if (localStorage.getItem("learnDate") == undefined) {
          if (localStorage.getItem("isVip") == undefined) {
            this.updateContent();
          } else {
            if (this.dayType == 0) {
              this.updateContent2();
            } else {
              this.updateContent();
            }
          }

        } else {
          if (localStorage.getItem("isVip") == undefined) {
            this.updateContent();
          } else {
            let newDate = localStorage.getItem("learnDate")
            let myDate = new Date(Date.parse(newDate));
            let dayStr = "日一二三四五六".charAt(myDate.getDay());
            if (dayStr == "日") {
              this.updateContent2();
            } else {
              this.updateContent();
            }
          }

        }
      } else {

        //判断如果正式课进入笑一笑
        // localStorage.removeItem("readArticleCompleted");
        if (localStorage.getItem("cram") == "yes") {
          axios
            .post(
              that.$store.state.baseUrlFront + "module/saveModule",
              qs.stringify({
                USER_ID: localStorage.getItem("USER_ID"),
                date: localStorage.getItem("learnDate"),
                module: "txzds",
                activemodule: "xzd"
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
            localStorage.setItem("readArticleCompleted", "yes");
            axios
              .post(
                that.$store.state.baseUrlFront + "module/saveModule",
                qs.stringify({
                  USER_ID: localStorage.getItem("USER_ID"),
                  date: localStorage.getItem("currentDate"),
                  module: "txzds",
                  activemodule: "xzd"
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
          localStorage.setItem("readArticleCompleted" + type, "yes");
        }
        if (
          localStorage.getItem("isVip") == undefined ||
          localStorage.getItem("isVip") == ""
        ) {
          this.$router.replace("Laugh");
        } else {
          //是否从日历界面跳转过来
          if (localStorage.getItem("learnDate") == undefined) {
            //如果是周日直接进入打卡页面
            if (this.dayType == 0) {
              this.$router.replace("Daka");
            } else {
              this.$router.replace("Laugh");
            }
          } else {
            //从日历界面进入的
            if (localStorage.getItem("cram") == "yes") {
              //需要补课
              let newDate = localStorage.getItem("learnDate")
              let myDate = new Date(Date.parse(newDate));
              let dayStr = "日一二三四五六".charAt(myDate.getDay());
              if (dayStr == "日") {
                this.$router.replace("Daka");
              } else {
                this.$router.replace("Laugh");
              }
            } else {
              let newDate = localStorage.getItem("learnDate")
              let myDate = new Date(Date.parse(newDate));
              let dayStr = "日一二三四五六".charAt(myDate.getDay());
              if (dayStr == "日") {
                this.$router.replace("TabIndex");
              } else {
                this.$router.replace("Laugh");
              }
            }
          }
        }


      }

      // } else {
      //   alert("音频播放结束后才能进入下一节");
      // }
    },
    updateContent() {
      let d = new Array();
      //this.paraphList.push(this.$store.state.ex_course.readingList[this.sentenceIndex].sentence);
      this.paraphList[0] = this.$store.state.ex_course.readingList[this.sentenceIndex].sentence;

      //筛选出读一读的音频
      for (let i = 0; i < this.zArray.length; i++) {
        if (this.zArray[i] == this.$store.state.ex_course.readingList[this.sentenceIndex].time) {
          d.push(this.zArray[i]);
          if (this.zArray[i + 1] == undefined) {
            d.push(this.yArray[0]);
          } else {
            d.push(this.zArray[i + 1]);
          }
        }
        this.dArray = d;
      }
      this.duration = Number(this.dArray[1]) - Number(this.dArray[0]);
      ++this.sentenceIndex;
    },
    updateContent2() {
      let d = new Array();

      if (this.$store.state.ex_course.readingList[this.sentenceIndex].reading_content.indexOf("\r\n") != -1) {
        if (this.$store.state.ex_course.readingList[this.sentenceIndex].is_whole == "1") {
          let oldStr = this.$store.state.ex_course.readingList[this.sentenceIndex].reading_content;
          let strArray = oldStr.split("\r\n");
          let newStr = ""
          for (let i = 0; i < strArray.length; i++) {
            newStr += "<p>" + strArray[i] + "</p>";
          }
          this.paraphList[0] = newStr;

        } else {
          let oldStr = this.$store.state.ex_course.readingList[this.sentenceIndex].reading_content;
          let strArray = oldStr.split("\r\n");
          let newStr = ""
          for (let i = 0; i < strArray.length; i++) {
            if (i == 1) {
              newStr += "<p style='font-size:1rem;padding-left:6rem;'>" + strArray[i] + "</p>";
            } else {
              newStr += "<p>" + strArray[i] + "</p>";
            }
          }
          this.paraphList[0] = newStr;
        }

      } else {
        this.paraphList[0] = this.$store.state.ex_course.readingList[this.sentenceIndex].reading_content;
      }


      d.push(this.$store.state.ex_course.readingList[this.sentenceIndex].start_time);
      d.push(this.$store.state.ex_course.readingList[this.sentenceIndex].end_time);
      this.dArray = d;
      this.duration = Number(this.dArray[1]) - Number(this.dArray[0]);
      ++this.sentenceIndex;
    },
    uploadVoice() {
      let that = this;
      wx.uploadVoice({
        localId: that.localIds,
        success: function (res) {
          let serverId = res.serverId;
          that.downloadVoice(serverId);
        }
      })

    },
    downloadVoice(serverIds) {
      let that = this;
      let dates = localStorage.getItem("learnDate") == undefined ? localStorage.getItem("currentDate") : localStorage.getItem("learnDate");
      wx.downloadVoice({
        serverId: serverIds,
        success: function (res) {
          that.localIds = res.localId;
        }
      });
      // axios
      // .get(this.$store.state.baseUrlFront + "voice/saveVoice", {
      //   params: { 
      //     mediaId:serverIds,
      //     USER_ID:localStorage.getItem("USER_ID"),
      //     course_id:localStorage.getItem("course_id"),
      //     date:localStorage.getItem("currentDate")
      //   }
      // })
      // .then(res => {
      //   console.log(res);
      // });
      axios
        .post(
          this.$store.state.baseUrlFront + "voice/saveVoice",
          qs.stringify({
            mediaId: serverIds,
            USER_ID: localStorage.getItem("USER_ID"),
            date: dates
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          console.log(res);
          that.audioSrc2 = res.data.data.voice_path;
        });

    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.artical {
  width: 90%;
  height: 58vw;
  overflow: scroll;
  margin: 5.03333333rem auto;
  font-size: 1.36rem;
  line-height: 70 / @rem;
  font-weight: 600;
  font-family: "heiti";
  text-align: justify;
  p {
    &.active {
      color: #2d8f5a;
    }
  }
}
@media screen and (min-width: 768px) {
  .artical {
    width: 90%;
    height: 58vw;
    overflow: scroll;
    margin: 1.53333333rem auto;
    font-size: 1.1rem;
    line-height: 1.6rem;
    font-weight: 600;
    text-align: justify;
    p {
      &.active {
        color: #2d8f5a;
      }
    }
  }
}
.audio-box {
  width: 100%;
  margin-bottom: -1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .audio-inner {
    width: 74%;
    display: flex;
    justify-content: space-around;
    .audio-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #333;
      font-size: 26 / @rem;
      // img { 
      //   width: 104 / @rem;
      //   height: 104 / @rem;
      //   margin-top: 44 / @rem;
      // }
      .audioImg {
        width: 104 / @rem;
        height: 104 / @rem;
        margin-top: 44 / @rem;
      }
      .l-img {
        width: 140 / @rem;
        height: 140 / @rem;
        margin-top: 28 / @rem;
      }
    }
  }
}
</style>
<style scoped>
.n-phbox {
  width: 14.8rem;
  height: 0.6rem;
  border: 0.13rem solid #fff;
  border-radius: 0.6rem;
  margin-bottom: 1rem;
  position: relative;
  top: 3rem;
  background-color: #edfff2;
}
.n-complete {
  width: 0rem;
  border-radius: 0.6rem;
  background: #6fe4a8;
}
.n-uncomplete {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  background: #edffe5;
}
.audiowarp {
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  border: 1px solid #87ebb8;
  position: absolute;
  top: -3vw;
  z-index: -1;
  animation: myFifth 0.8s infinite;
}
</style>
<style>
@keyframes myFifth {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(0.8);
  }
}
</style>