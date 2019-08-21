<template>
  <div class="m-box">
    <div class="m-inner">
      <app-header isShowZ="false" isShowL="true" :c_time="currentTimes" :f_time="duration">
        <p slot="title" class="ph-title">学一学</p>
      </app-header>
      <!-- <audio id="audio" :src='audioSrc'  controls  autoplay="false" style='display:none'>
      </audio>-->
      <div class="artical">
        <div class="main-content">
          <div
            class="l-item"
            v-for="item,index in paraphList"
            :key="index"
            @click="playPara(index)"
          >
            <!--每一段的内容-->
            <img
              class="finger"
              src="./../assets/images/finger.png"
              alt
              v-if="curOff(index,colorFlag,paraphList)"
            >
            <p
              class="sentence"
              :class="curOff(index,colorFlag,paraphList)?'active':''"
              v-html="item.sentence"
            ></p>
            <!--每一段的翻译-->
            <p
              class="translate"
              :class="curOff(index,colorFlag,paraphList)?'active':''"
            >{{item.allphrase}}</p>
            <!--拼音+释译(内层循环)-->
            <p
              class="pinyin"
              v-for="itemN,indexN in item.words"
              :key="indexN"
              :class="curOff(index,colorFlag,paraphList)?'active':''"
            >
              <label style="border-bottom:1px dashed #000">{{itemN.word+":"}}</label>
              <label
                style="border-bottom:1px dashed #000"
                v-if="!(itemN.pinyin=='') && itemN.phrase.length+itemN.word.length<=16"
              >{{"("+itemN.pinyin+")"+itemN.phrase}}</label>
              <label
                style="border-bottom:1px dashed #000"
                v-if="!(itemN.pinyin=='') && itemN.phrase.length+itemN.word.length>16"
              >{{"("+itemN.pinyin+")"+itemN.phrase.substring(0,16-itemN.word.length)}}</label>
              <label
                style="border-bottom:1px dashed #000;display:inline-block;margin-left:3.1rem;"
                v-if="!(itemN.pinyin=='') && itemN.phrase.length+itemN.word.length>16"
              >{{itemN.phrase.substring(16-itemN.word.length)}}</label>

              <label
                style="border-bottom:1px dashed #000"
                v-if="itemN.pinyin=='' && itemN.phrase.length+itemN.word.length<=16"
              >{{itemN.phrase}}</label>
              <label
                style="border-bottom:1px dashed #000"
                v-if="itemN.pinyin=='' && itemN.phrase.length+itemN.word.length>16"
              >{{itemN.phrase.substring(0,16-itemN.word.length)}}</label>
              <label
                style="border-bottom:1px dashed #000;display:inline-block;margin-left:3.1rem;"
                v-if="itemN.pinyin=='' && itemN.phrase.length+itemN.word.length>16"
              >{{itemN.phrase.substring(16-itemN.word.length)}}</label>
            </p>
          </div>
        </div>
      </div>

      <div class="translate-contain">
        <img class="fanyi" src="./../assets/images/fanyi.png?222" alt>
        <div class="translate-box" @click="playPara2()" style="padding-right:1rem">
          <p
            class="translate"
            :class="curOff2(itemM,indexM,paraphList)?'active':''"
            v-for="itemM,indexM in paraphList"
            :key="indexM"
          >{{itemM.allphrase}}</p>
        </div>
        <div class="summary-box">
          <img class="wenli" src="./../assets/images/wenli.png" alt>
          <div class="summary" @click="playPara3()">
            <p
              class="spara"
              :class="curOff3(item,index,introductionList)?'active':''"
              v-for="item,index in introductionList"
              :key="index"
            >{{item.sentence}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="bottom-contain" style="display:none">
      <div class="control-btn" @click="playControl()">{{btnText}}</div>
    </div>-->
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import axios from "axios";
import $ from "jquery";
import qs from "qs";
import wx from 'weixin-js-sdk';
export default {
  name: "learn",
  components: { AppHeader },
  data() {
    return {
      paraphList: "",
      introductionList: "",
      allphraseStr: "",
      audioSrc: "",
      currentTime: 0,
      currentTimes: 0,
      duration: 60,
      isPlay: true,
      isEnd: false,
      //音频播放次数(1次标识今天学一学任务完成)
      times: 0,
      curOffFlag: false,
      pindex: 0,
      //flag=1 正文点击 flag=2 译文点击 flag=3赏析点击标识
      flag: 0,
      colorFlag: "",
      colorFlag2: "",
      colorFlag3: "",
      onceIndex: 0,
      onceFlag: false,
      zArray: [],
      yArray: [],
      sArray: [],
      timer: ""
    };
  },
  created() {
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
  mounted() {
    //判断型号
    this.currentTimes = 1;
    if (localStorage.getItem("cram") == "yes") {
      //补课情况下
      axios
        .post(
          this.$store.state.baseUrlFront + "module/saveModule",
          qs.stringify({
            USER_ID: localStorage.getItem("USER_ID"),
            date: localStorage.getItem("learnDate"),
            module: "t",
            activemodule: "x"
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
      //会员 && 正常上课(非日历界面进入)的情况下
      if (!(localStorage.getItem("isVip") == undefined) && localStorage.getItem("learnDate") == undefined) {
        localStorage.setItem("learnCompleted-now", "yes");
        axios
          .post(
            this.$store.state.baseUrlFront + "module/saveModule",
            qs.stringify({
              USER_ID: localStorage.getItem("USER_ID"),
              date: localStorage.getItem("currentDate"),
              module: "t",
              activemodule: "x"
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
      localStorage.setItem("learnCompleted-now" + type, "yes");
    }
    //用于筛选出正文
    let newPara = new Array();
    for (let i = 0; i < this.$store.state.ex_course.article.length; i++) {
      newPara[i] = this.$store.state.ex_course.article[i];
    }
    //筛选出正文并存放在newPara中
    // for (let i = 0; i < newPara.length; i++) {
    //   if (newPara[i].sentence == "总结" || newPara[i].sentence == "译文") {
    //     newPara.splice(i, 1);
    //     i = 0;
    //   }
    // }
    for (let i = 0; i < newPara.length; i++) {
      if (newPara[i].sentence == "译文") {
        //从当前i的位置开始删除后面的所有数组内容
        newPara.splice(i);
      }
    }

    this.paraphList = newPara;
    this.introductionList = this.$store.state.ex_course.introductionList;
    for (var i = 0; i < this.paraphList.length; i++) {
      this.allphraseStr += this.paraphList[i].allphrase;
    }
    //dot线
    //  for(var i=0;i<this.paraphList.length;i++)
    //     for(var j=0;j<this.paraphList[i].words.length;j++){
    //         this.paraphList[i].sentence= this.paraphList[i].sentence.replace(this.paraphList[i].words[j].word,"<span  class='dashedtext'>"+this.paraphList[i].words[j].word+"</span>");
    //     }
    //i=0的情况
    for (let i = 0; i < this.paraphList.length; i++) {
      //this.paraphList[i].sentence
      for (let j = 0; j < this.paraphList[i].words.length; j++) {
        //this.paraphList[i].words[j].word   this.paraphList[i].words[j].num
        if (this.paraphList[i].words[j].num == undefined) {
          //单个关键字(非一词多义)
          this.paraphList[i].sentence = this.paraphList[i].sentence.replace(
            this.paraphList[i].words[j].word,
            "<span  class='dashedtext'>" +
            this.paraphList[i].words[j].word +
            "</span>"
          );
        } else {
          //多个关键字(一词多义)
          let count = 0;
          let tmpArray = new Array();
          let nums = parseInt(this.paraphList[i].words[j].num);
          for (let k = 0; k < this.paraphList[i].sentence.length; k++) {
            tmpArray.push(this.paraphList[i].sentence.charAt(k));
          }
          for (let l = 0; l < this.paraphList[i].sentence.length; l++) {
            if (tmpArray[l] == this.paraphList[i].words[j].word) {
              count++;
              if (count - 1 == nums) {
                tmpArray[l] =
                  "<span  class='dashedtext'>" +
                  this.paraphList[i].words[j].word +
                  "</span>";
              }
            }
          }
          this.paraphList[i].sentence = tmpArray.join("");
        }
      }
    }

    this.audioSrc =
      this.$store.state.soundUrlFront + this.$store.state.ex_course.sound_path;
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
    let that = this;
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
    this.duration = a.length + 2;
    this.zArray = a;
    this.yArray = b;
    this.sArray = c;
    this.timer = setInterval(function () {
      console.log(audio.currentTime);
      that.currentTime = audio.currentTime;
      //点击哪一段读哪一段
      if (that.flag == 1) {
        audio.currentTime = Number(a[that.pindex]) + 0.5;
        that.flag = 0;

      } else if (that.flag == 2) {
        audio.currentTime = Number(b[that.pindex]) + 0.5;
        that.flag = 0;

      } else if (that.flag == 3) {
        audio.currentTime = Number(c[that.pindex]) + 0.5;
        that.flag = 0;

      }

      //轮询(正文部分 正(译))
      if (
        Number(audio.currentTime.toFixed(1)) ==
        Number(a[that.pindex + 1]) + 0.5
      ) {
        audio.pause();

        audio.currentTime = Number(b[that.pindex]) + 0.5;
        wx.ready(function () {
          audio.play();
        })
      }

      if (
        Number(audio.currentTime.toFixed(1)) ==
        Number(b[that.pindex + 1]) + 0.5 &&
        that.colorFlag2.length < 3
      ) {
        that.isPlay = false;
        audio.pause();
      }
      //轮询中的特殊情况(正文最后一段)
      if (that.pindex + 1 >= a.length) {
        if (Number(audio.currentTime.toFixed(1)) == Number(b[0]) + 0.5) {

          audio.pause();
          audio.currentTime = Number(b[that.pindex]) + 0.5;
          wx.ready(function () {
            audio.play();
          })


        }
        if (Number(audio.currentTime.toFixed(1)) == Number(c[0]) + 0.5) {
          that.isPlay = false;
          audio.pause();
        }
      }

      //译文终止
      if (that.colorFlag2.length == 3) {
        if (Number(audio.currentTime.toFixed(1)) == Number(c[0]) + 0.5) {
          that.isPlay = false;
          audio.pause();
        }
      }

      //赏析终止
      // if (that.colorFlag3.length == 3) {
      //   if (
      //     Number(audio.currentTime.toFixed(1)) ==
      //     Number(c[c.length - 1]) + 0.5
      //   ) {
      //     that.isPlay = false;
      //     audio.pause();
      //     that.isEnd = true;
      //     //播放次数记录
      //     that.times++;
      //     //记录当天学一学任务已完成
      //     if (that.times == 1) {
      //       //this.$store.commit("update_learnCompleted", true);
      //       localStorage.setItem("learnCompleted", "yes");
      //     }
      //     setTimeout(function() {
      //       //自动跳转下一个页面
      //       //that.$router.push({ name: "Exercise" });
      //       that.$router.replace("Exercise");
      //     }, 1000);
      //     clearInterval(timer);
      //   }
      // }
    }, 1);
    //     audio.addEventListener('ended',function(){
    //        that.isPlay = false;
    //      that.isEnd = true;
    //      //播放次数记录
    //      that.times++;
    //      //记录当天学一学任务已完成
    //     if (that.times == 1) {
    //       if(localStorage.getItem("cram")=="yes"){
    //              axios
    //         .post(
    //           that.$store.state.baseUrlFront + "module/saveModule",
    //           qs.stringify({
    //              USER_ID: localStorage.getItem("USER_ID"),
    //              date: localStorage.getItem("learnDate"),
    //              module:"tx",
    //              activemodule:"x"
    //           }),
    //           {
    //             headers: {
    //               "Content-Type": "application/x-www-form-urlencoded"
    //             }
    //           }
    //         )
    //         .then(res => {
    //           console.log(res);
    //         });
    //       }else{
    //             localStorage.setItem("learnCompleted", "yes");
    //       }
    //            //如果是非会员
    //     if(localStorage.getItem("isVip")==undefined){
    //        let type = localStorage.getItem("courseType");
    //        localStorage.setItem("learnCompleted"+type,"yes");
    //     }
    //     }
    //     setTimeout(function() {
    //       //自动跳转下一个页面
    //       //that.$router.push({ name: "Exercise" });
    //       that.$router.replace("Exercise");
    //     }, 1000);
    //     clearInterval(timer);
    // })
    $(audio).bind("ended", function () {
      console.log("学一学音频结束啦");
      that.isPlay = false;
      that.isEnd = true;
      //播放次数记录
      that.times++;
      //记录当天学一学任务已完成
      if (that.times == 1) {
        if (localStorage.getItem("cram") == "yes") {
          axios
            .post(
              that.$store.state.baseUrlFront + "module/saveModule",
              qs.stringify({
                USER_ID: localStorage.getItem("USER_ID"),
                date: localStorage.getItem("learnDate"),
                module: "tx",
                activemodule: "x"
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
            localStorage.setItem("learnCompleted", "yes");
            axios
              .post(
                that.$store.state.baseUrlFront + "module/saveModule",
                qs.stringify({
                  USER_ID: localStorage.getItem("USER_ID"),
                  date: localStorage.getItem("currentDate"),
                  module: "tx",
                  activemodule: "x"
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
          localStorage.setItem("learnCompleted" + type, "yes");
        }
      }
      setTimeout(function () {
        //自动跳转下一个页面
        //that.$router.push({ name: "Exercise" });
        that.$router.replace("Exercise");
      }, 1000);
      clearInterval(that.timer);
    })
  },
  // computed: {
  //   btnText() {
  //     let text = "";
  //     let that = this;
  //     if (!this.isEnd) {
  //       text = this.isPlay ? "暂停" : "继续";
  //     } else {
  //       text = "继续";
  //       //播放次数记录
  //       this.times++;
  //       //记录当天学一学任务已完成
  //       if (this.times == 1) {
  //         //this.$store.commit("update_learnCompleted", true);
  //         localStorage.setItem("learnCompleted", "yes");
  //              if(localStorage.getItem("isVip")==undefined){
  //            let type = localStorage.getItem("courseType");
  //            localStorage.setItem("learnCompleted"+type,"yes");
  //         }
  //       }
  //       setTimeout(function() {
  //         //自动跳转下一个页面
  //         // that.$router.push({ name: "Exercise" });
  //         that.$router.replace("Exercise");
  //       }, 1000);
  //     }
  //     return text;
  //   }
  // },

  beforeDestroy() {
    let audio = document.getElementById("myaudio");
    clearInterval(this.timer);
    $(audio).unbind("ended");
    audio.pause();
  },
  methods: {
    // playControl() {
    //   //let audio = $("#audio")[0];
    //   let audio = document.getElementById("myaudio");
    //   if (this.isEnd) {
    //     //this.isEnd = false;
    //     // this.$router.push({ name: "Exercise" });
    //     that.$router.replace("Exercise");
    //   }
    //   if (!this.isPlay) {
    //     audio.play();
    //     this.isPlay = true;
    //   } else {
    //     audio.pause();
    //     this.isPlay = false;
    //   }
    // },
    curOff(index, colorFlag, paraphList) {
      let scrollDom = document.querySelector(".m-inner");
      let articalDom = document.querySelector(".artical");
      //计算出滚动高度
      let avgVal = 0;
      // $(".sentence.active").each(function() {
      //   if (
      //     $(this).parent().prev().length == 1
      //   ) {
      //     let $tempDom = $(this).parent().prev();
      //     if (!($tempDom == undefined)) {
      //       avgVal = $tempDom[0].offsetHeight + 30;
      //     }
      //   } else {
      //     avgVal = 0;
      //   }
      // });
      $(".sentence.active").each(function () {
        if ($(this).parent().prev().prevObject.length == 1) {
          let $tempDom = $(this).parent().prev().prevObject;
          avgVal = $tempDom[0].offsetHeight + 30;
          if (!($tempDom == undefined)) {
            avgVal = $tempDom[0].offsetHeight + 30;

          }
        } else {
          //这里始终没有执行
          avgVal = 0;
          console.log(avgVal + ":222");
        }
      });
      if (colorFlag == index) {
        if (this.onceIndex != index) {
          this.onceFlag = false;
        }
        if (this.onceFlag == false) {
          //记录当前index
          this.onceIndex = index;
          //scollTop增加
          //   scrollDom.scrollTop +=avgVal;
          $(".m-inner").animate(
            { scrollTop: scrollDom.scrollTop + avgVal },
            1000
          );
          this.onceFlag = true;
        }

        return true;
      } else {
        return false;
      }
    },
    curOff2(item, index, paraphList) {
      if (this.colorFlag2.length > 1) {
        let scrollDom = document.querySelector(".m-inner");

        let off = false;
        if (this.currentTime <= this.sArray[0]) {
          if (
            this.currentTime > this.yArray[index] &&
            !(paraphList[index + 1] == undefined) &&
            this.currentTime <= this.yArray[index + 1]
          ) {
            off = true;
          } else if (
            paraphList[index + 1] == undefined &&
            this.currentTime <= this.sArray[0] &&
            this.currentTime != 0 &&
            this.currentTime > this.yArray[index]
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
          //let avgVal = 0;
          let scrollDom = document.querySelector(".m-inner");
          let translateDom = document.querySelector(".translate-box");
          //let avgVal = translateDom.offsetHeight;
          let avgVal = 100;
          $(".translate.active").each(function () {
            // if($(this).prev().length == 1){
            //    let $tempDom = $(this).prev();
            //    avgVal=$tempDom[0].offsetHeight/2;
            //    console.log(avgVal+":111");
            // }else{
            //    let scrollDom  = document.querySelector(".m-inner");
            //    let translateDom = document.querySelector(".translate-box");
            //   avgVal = translateDom.offsetHeight/2;
            //    console.log(avgVal+":222");
            // }

            if ($(this).prev().prevObject.length == 1) {
              let $tempDom = $(this).prev().prevObject;
              avgVal = $tempDom[0].offsetHeight / 2;
            } else {
              //这里始终没有执行
              let scrollDom = document.querySelector(".m-inner");
              let translateDom = document.querySelector(".translate-box");
              avgVal = translateDom.offsetHeight / 2;
              console.log(avgVal + ":222");
            }
          });

          //记录当前index
          this.onceIndex = index;
          // scrollDom.scrollTop += avgVal;
          $(".m-inner").animate(
            { scrollTop: scrollDom.scrollTop + avgVal },
            1000
          );
          this.onceFlag = true;
        }

        return off;
      } else {
        return false;
      }
    },
    curOff3(item, index, introductionList) {
      if (this.colorFlag3.length > 1) {
        let scrollDom = document.querySelector(".summary");
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
          let scrollDom = document.querySelector(".summary");
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
          $(".summary").animate(
            { scrollTop: scrollDom.scrollTop + avgVal },
            1000
          );
          this.onceFlag = true;
        }

        return off;
      } else {
        return false;
      }
    },
    playPara(index) {
      this.currentTimes = index + 1;
      let audio = document.getElementById("myaudio");
      // let audio = $("#audio")[0];
      this.colorFlag = index;
      this.colorFlag2 = "d";
      this.colorFlag3 = "d";
      this.pindex = index;
      let that = this;
      this.flag = 1;
      wx.ready(function () {
        audio.play();
      })
    },
    playPara2() {
      if (this.colorFlag2.length == 3) {
        //已经active不可点击
      } else {
        this.currentTimes = this.zArray.length + 1;
        // let audio = $("#audio")[0];
        let audio = document.getElementById("myaudio");
        this.pindex = 0;
        this.colorFlag = "d";
        this.colorFlag3 = "d";
        this.colorFlag2 = "333";
        this.flag = 2;
        wx.ready(function () {
          audio.play();
        })
      }
    },
    playPara3() {
      // this.currentTimes = this.zArray.length+2;
      //   let audio = $("#audio")[0];
      // this.pindex = 0;
      // this.colorFlag = "d";
      // this.colorFlag2 = "d";
      // this.colorFlag3 = "333";
      // this.flag = 3;
      // audio.play();
      if (this.colorFlag3.length == 3) {
        //已经active不可点击
      } else {
        //用于进度条（分母为正文长度+2）
        this.currentTimes = this.zArray.length + 2;
        //let audio = $("#audio")[0];
        let audio = document.getElementById("myaudio");
        this.pindex = 0;
        this.colorFlag = "d";
        this.colorFlag2 = "d";
        this.colorFlag3 = "333";
        this.flag = 3;
        wx.ready(function () {
          audio.play();
        })
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.m-box {
  // background: url("./../assets/images/beijing.jpg");
  .m-inner {
    height: 95%;
    overflow: scroll;
    .main-content {
      width: 94%;
      margin: 56 / @rem auto 0;
      font-size: 40 / @rem;
      line-height: 56 / @rem;
      letter-spacing: 0.1rem;
      .l-item {
        line-height: 2rem;
        margin-bottom: 1.66666667rem;
        position: relative;
        .finger {
          width: 1.3rem;
          height: 1rem;
          // .postion(0,0,2);
          position: absolute;
          left: -0.4rem;
          top: 0.4rem;
        }
        .sentence {
          font-size: 1.2rem;
          padding-left: 1rem;
          font-family: heiti;
          font-weight: bold;
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
    text-indent: 1.5em;
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
      width: 540 / @rem;
      .postion(82, 100, 33);
      overflow: scroll;
      height: 43vw;
      text-align: justify;
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
  margin-left: 1rem;
  font-size: 1.2rem;
  font-family: "heiti";
  width: auto;
  display: table;
  &.active {
    color: #259359;
  }
}

.translate {
  font-size: 1.2rem;
  padding-left: 1rem;
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
