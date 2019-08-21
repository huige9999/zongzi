<template>
  <div class="m-box">
    <div class="record-box" v-if="tabNav==1">
      <div class="r-header">学习记录</div>
      <div class="r-body">
        <div class="calendar">
          <div class="title">
            <h2 id="calendar-year">{{ctitleStr}}</h2>
            <label href id="pre" @click="prev()"></label>
            <label href id="next" @click="next()"></label>
          </div>
          <div class="body">
            <div class="body-list">
              <ul>
                <li>周一</li>
                <li>周二</li>
                <li>周三</li>
                <li>周四</li>
                <li>周五</li>
                <li>周六</li>
                <li>周日</li>
              </ul>
            </div>
            <div class="body-list">
              <ul id="days" v-html="holderStr"></ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="control-btn"
        @click="goBeforeLearn()"
        style="margin-left:50%;transform:translateX(-38%)"
      >查看学习记录</div>
    </div>
    <div class="listen-box" v-if="tabNav==2">
      <div class="l-header">古文音频</div>
      <audio id="audio" :src="audioSrc" style="display:none"></audio>
      <div class="l-list">
        <div class="l-item" v-for="item,index in audioList" :key="index">
          <div class="l-img">
            <img :src="item.pic_url" @click="playAudio(item.sound_path)">
          </div>
          <p class="l-text">{{item.title}}</p>
        </div>
      </div>
    </div>
    <div class="record-box" v-if="tabNav==3">
      <div class="r-header">错题集</div>
      <div class="r-body">
        <div class="calendar">
          <div class="title">
            <h2 id="calendar-year">{{ctitleStr}}</h2>
            <label href id="pre" @click="prev()"></label>
            <label href id="next" @click="next()"></label>
          </div>
          <div class="body">
            <div class="body-list">
              <ul>
                <li>周一</li>
                <li>周二</li>
                <li>周三</li>
                <li>周四</li>
                <li>周五</li>
                <li>周六</li>
                <li>周日</li>
              </ul>
            </div>
            <div class="body-list">
              <ul id="days" v-html="holderStr"></ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="control-btn"
        @click="goExercise()"
        style="margin-left:50%;transform:translateX(-38%)"
      >查看错题</div>
    </div>
    <div class="tabbar">
      <div class="tab-item" @click="goIndex()">
        <img
          class="learn"
          :src="tabNav==0?require('./../assets/images/learn-active.png'):require('./../assets/images/learn.png')"
        >
        <p class="tab-text" :class="tabNav==0?'active':''">今日学习</p>
      </div>
      <div class="tab-item" @click="changeNav(1)">
        <img
          class="rili"
          :src="tabNav==1?require('./../assets/images/rili-active.png'):require('./../assets/images/rili.png')"
        >
        <p class="tab-text" :class="tabNav==1?'active':''">学习记录</p>
      </div>
      <!-- <div class="tab-item" @click="changeNav(2)">
        <img
          class="listen"
          :src="tabNav==2?require('./../assets/images/listen-active.png'):require('./../assets/images/listen.png')"
        >
        <p class="tab-text" :class="tabNav==2?'active':''">听古文</p>
      </div> -->
      <div class="tab-item" @click="changeNav(3)">
        <img
          class="mine"
          :src="tabNav==3?require('./../assets/images/mine-active.png'):require('./../assets/images/mine.png')"
        >
        <p class="tab-text" :class="tabNav==3?'active':''">错题集</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
export default {
  name: "mine",
  data() {
    return {
      tabNav: 1,
      audioList: [],
      audioSrc: "",
      isPlay: false,
      isEnd: false,
      currentTime: 0,
      flag: 0,
      month_olypic: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //闰年每个月份的天数
      month_normal: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      month_name: [
        "01月",
        "02月",
        "03月",
        "04月",
        "05月",
        "06月",
        "07月",
        "08月",
        "09月",
        "10月",
        "11月",
        "12月"
      ],
      holderStr: "",
      ctitleStr: "",
      my_year: new Date().getFullYear(),
      my_month: new Date().getMonth(),
      my_day: new Date().getDate(),
      my_date: new Date(),
      headImgUrl: "",
      type: "",
      nickname: "",
      learnDay: 0,
      shareNum: 0,
      //记录补课日期
      unSignList: []
    };
  },
  mounted: function () {
    this.refreshDate();
    localStorage.removeItem("learnDate");
    localStorage.removeItem("cram");
    //判断是否从错题集返回过来的
    if (localStorage.getItem("misFlag") == undefined) {
      this.tabNav = 1;
    } else {
      this.tabNav = 3;
    }
    //获取个人信息
    axios.get(
      this.$store.state.baseUrlFront + 'qrCode/getPersonalInfo',
      {
        params: {
          USER_ID: localStorage.getItem("USER_ID")
        }
      }).then((res) => {
        if (res.status == 200) {
          this.learnDay = res.data.data.days;

        }
      })
    axios
      .get(this.$store.state.baseUrlFront + "wxinfo/findUserInfo", {
        params: { USER_ID: localStorage.getItem("USER_ID") }
      })
      .then(res => {
        this.headImgUrl = res.data.data.headimgurl;
        this.nickname = res.data.data.nickname;
        if (res.data.data.type == "0") {
          this.type = "L1探花";
        } else if (res.data.data.type == "1") {
          this.type = "L2榜眼";
        } else {
          this.type = "L3状元";
        }
      });

    // let imgUrl = "";
    // let soundUrl = "";
    // let title = "";
    // for (let i = 0; i < this.$store.state.ex_guwen.length; i++) {
    //   imgUrl =
    //     this.$store.state.imgUrlFront + this.$store.state.ex_guwen[i].pic_url;
    //   if (this.$store.state.ex_guwen[i].pic_url == undefined || this.$store.state.ex_guwen[i].pic_url == "") {
    //     imgUrl = require("./../assets/images/zs-banner.png");
    //   }
    //   soundUrl =
    //     this.$store.state.soundUrlFront +
    //     this.$store.state.ex_guwen[i].sound_path;
    //   title = this.$store.state.ex_guwen[i].title;
    //   this.audioList.push({
    //     title: title,
    //     pic_url: imgUrl,
    //     sound_path: soundUrl
    //   });
    // }

    // let audio = document.getElementById("audio");
    // let that = this;
    // if (!(audio == undefined)) {
    //   audio.addEventListener("timeupdate", function () {
    //     //flag 1 重新播放，0空操作
    //     if (that.flag == 1) {
    //       this.currentTime = 0;
    //       that.flag = 0;
    //     }
    //   });
    //   audio.addEventListener(
    //     "ended",
    //     function () {
    //       that.isEnd = true;
    //     },
    //     false
    //   );
    // }

    //获取朋友圈分享次数
    //获取个人信息
    axios.get(
      this.$store.state.baseUrlFront + 'wxinfo/shareShow',
      {
        params: {
          USER_ID: localStorage.getItem("USER_ID")
        }
      }).then((res) => {
        if (res.status == 200) {
          console.log(res);
          this.shareNum = res.data.data.share_times;
        }
      })
  },
  // computed: {
  //   btnText() {
  //     let text = "";
  //     if (!this.isEnd) {
  //       text = this.isPlay ? "暂停" : "继续";
  //     } else {
  //       text = "继续";
  //     }
  //     return text;
  //   }
  // },
  methods: {
    goMistake() {
      this.$router.push({
        path: "/CalendarForM"
      });
    },
    goIndex() {
      localStorage.removeItem("learnDate");
      localStorage.removeItem("cram");
      var dayStr = "日一二三四五六".charAt(new Date().getDay());
      var dayType = 0;
      if (dayStr == "日") {
        dayType = 2;
      } else if (dayStr == "六") {
        dayType = 1;
      } else {
        dayType = 0;
      }
      if (dayType == 0) {
        //普通天跳转BeforeLearn界面
        this.$router.push({
          path: "BeforeLearn"
        });
      } else if (dayType == 1) {
        //周六跳转Weekend界面
        this.$router.push({
          path: "Weekend"
        });
      } else {
        //周末跳转Shangxi界面
        this.$router.push({
          path: "Sunday"
        });
      }
    },
    changeNav(n) {
      this.tabNav = n;
      if (!(n == 3)) {
        localStorage.removeItem("misFlag");
      }
    },
    dayStart(month, year) {
      var tmpDate = new Date(year, month, 1);
      return tmpDate.getDay();
    },
    //根据年份判断某月有多少天(11,2018),表示2018年12月
    daysMonth(month, year) {
      var tmp1 = year % 4;
      var tmp2 = year % 100;
      var tmp3 = year % 400;

      if ((tmp1 == 0 && tmp2 != 0) || tmp3 == 0) {
        return this.month_olypic[month]; //闰年
      } else {
        return this.month_normal[month]; //非闰年
      }
    },
    refreshDate() {
      let that = this;
      //这个月的最后一天,用于查询这一个月的打卡状况
      let signDates = "";
      if (this.my_month == 1) {
        //平月
        signDates = this.my_year + "-" + "0" + (this.my_month + 1) + "-28";
      } else if (this.my_month == 0 || this.my_month == 2 || this.my_month == 4 || this.my_month == 6 || this.my_month == 7 || this.my_month == 9 || this.my_month == 11) {
        //大月
        if (this.my_month == 9 || this.my_month == 11) {
          signDates = this.my_year + "-" + (this.my_month + 1) + "-31";
        } else {
          signDates = this.my_year + "-" + "0" + (this.my_month + 1) + "-31";
        }
      } else {
        if (this.my_month == 10) {
          signDates = this.my_year + "-" + (this.my_month + 1) + "-30";
        } else {
          signDates = this.my_year + "-" + "0" + (this.my_month + 1) + "-30";
        }
      }
      //获取这个月的第一天
      let firstDates = "";
      if ((this.my_month + 1) >= 1 && (this.my_month + 1) <= 9) {
        firstDates = this.my_year + "-" + "0" + (this.my_month + 1) + "-01";
      } else {
        firstDates = this.my_year + "-" + (this.my_month + 1) + "-01";
      }
      //获取需要补课的日期
      axios
        .get(this.$store.state.baseUrlFront + "calandar/getUnStudied", {
          params: {
            USER_ID: localStorage.getItem("USER_ID"),
            timestart: firstDates,
            timeend:localStorage.getItem("currentDate"),
            courseId:localStorage.getItem("courseId")
          }
        })
        .then(res => {
          console.log("需要补课的日期:");
          console.log(res.data.data);
          if (!(res.data == undefined)) {
            this.unSignList = res.data.data;
            this.calendarRender(signDates);
          } else {
            this.calendarRender(signDates);
          }
        })






    },
    prev() {
      this.my_month--;
      if (this.my_month < 0) {
        this.my_year--;
        this.my_month = 11; //即12月份
      }
      this.refreshDate();
    },
    next() {
      this.my_month++;
      if (this.my_month > 11) {
        this.my_month = 0;
        this.my_year++;
      }
      this.refreshDate();
    },
    goBeforeLearn() {
      //获取选中的那一天
      let newDate = "";
      let doms = document.querySelector(".n-actives");
      if (doms) {
        //拼接一个完整的日期
        newDate = this.ctitleStr.replace("年", "-").replace("月", "-");
        if (parseInt(doms.innerHTML) < 10) {
          newDate = newDate + "0" + doms.innerHTML;
        } else {
          newDate = newDate + doms.innerHTML;
        }
        //判断选中的日期是否需要补课
        if (!(this.unSignList == undefined)) {
          for (let i = 0; i < this.unSignList.length; i++) {
            if (this.unSignList[i] == newDate) {
              localStorage.setItem("cram", "yes");
            }
          }
        }

        localStorage.setItem("learnDate", newDate);
        //根据newDate判断今天是周几
        var myDate = new Date(Date.parse(newDate));
        var dayStr = "日一二三四五六".charAt(myDate.getDay());
        if (dayStr == "日") {
          this.$router.push({ name: "Sunday" });
        } else if (dayStr == "六") {
          this.$router.push({ name: "Weekend" });
        } else {
          this.$router.push({ name: "BeforeLearn" });
        }
      } else {
        alert("请选择日历上学过的某一天");
      }
    },
    // playControl() {
    //   if (this.isEnd) {
    //     this.isEnd = false;
    //   }
    //   if (this.audioSrc == "") {
    //     alert("请选择一个音频播放");
    //   } else {
    //     if (!this.isPlay) {
    //       audio.play();
    //       this.isPlay = true;
    //     } else {
    //       audio.pause();
    //       this.isPlay = false;
    //     }
    //   }
    // },

    playAudio(sound_path) {
      this.flag = 1;
      this.audioSrc = sound_path;
      audio.play();
      this.isPlay = true;
    },
    goExercise() {
      //获取选中的那一天
      let newDate = "";
      let doms = document.querySelector(".n-actives");
      if (doms) {
        //拼接一个完整的日期
        newDate = this.ctitleStr.replace("年", "-").replace("月", "-");
        if (parseInt(doms.innerHTML) < 10) {
          newDate = newDate + "0" + doms.innerHTML;
        } else {
          newDate = newDate + doms.innerHTML;
        }
        localStorage.setItem("learnDate", newDate);
        this.$store.commit("update_learnDates", "yes");
        localStorage.setItem("misFlag", "yes");
        this.$router.push({ name: "ExerciseForUs" });
      } else {
        alert("请选择日历上的某一天");
      }
    },
    calendarRender(signDates) {

      //查询日期和是否打卡
      //获取打卡日期
      axios
        .get(this.$store.state.baseUrlFront + "sign/list", {
          params: {
            USER_ID: localStorage.getItem("USER_ID"),
            signDate: signDates,
            courseId:localStorage.getItem("courseId")
          }
        })
        .then(res => {
          console.log(res);
          // res.data.data[]
          var str = "";
          //计算当月的天数和每月第一天都是周几，day_month和day_year都从上面获得
          var totalDay = this.daysMonth(this.my_month, this.my_year);
          var firstDay = this.dayStart(this.my_month, this.my_year);
          //添加每个月的空白部分
          if (firstDay == 0) {
            firstDay = 7;
          }
          for (var i = 0; i < firstDay - 1; i++) {
            str += '<li style=\"cursor:pointer\" class="date-li">' + "</li>";
          }
          if (!(res.data.data == undefined)) {
            let flag = "111";
            //从一号开始添加知道totalDay，并为pre，next和当天添加样式
            var myclass;
            for (var i = 1; i <= totalDay; i++) {
              flag = "111";
              for (var j = 0; j < res.data.data.length; j++) {
                if (i == res.data.data[j]) {
                  str +=
                    "<li style=\"cursor:pointer\" class=\"n-active date-li\" onclick=\"let doms=document.querySelector('.n-actives');if(doms){doms.classList.remove('n-actives');}if(this.className.indexOf('n-active')!=-1){this.className='n-actives date-li n-active';}\">" +
                    i +
                    "</li>";
                  //打过卡的情况
                  flag = "222";
                  break;
                }
              }
              if (!(this.unSignList == undefined)) {
                for (var k = 0; k < this.unSignList.length; k++) {
                  //日期字符串取出天
                  //  let teDay = this.unSignList[k].split("-")[2];
                  //  if(teDay=="01"||teDay=="02"||teDay=="03"||teDay=="04"||teDay=="05"||teDay=="06"||teDay=="07"||teDay=="08"||teDay=="09"){
                  //    teDay = teDay.split("0")[1];
                  //  }
                  //  console.log("需要补课的天:");
                  //   console.log(teDay+","+i);
                  //拼凑出当前循环i对应的年月日
                  let tpyears = this.my_year;
                  let tpmonths = this.my_month <= 8 ? ("0" + (this.my_month + 1)) : (this.my_month + 1);
                  let tpdays = i <= 9 ? ("0" + i) : i;
                  let tpdate = tpyears + "-" + tpmonths + "-" + tpdays;
                  if (this.unSignList[k] == tpdate) {
                    flag = "333";
                    break;
                  }
                }
              }
              //没课的情况
              if (flag == "111") {
                //临时用的代码---节后需要删除
               // console.log(this.my_month+","+i);
                if (this.my_month == 1 && (i == 4 || i == 5 || i == 6 || i == 7 || i == 8 || i == 9 || i == 10)) {
                  str +=
                      "<li style=\"cursor:pointer\" class=\"n-activesss date-li\" onclick=\"let doms=document.querySelector('.n-actives');if(doms){doms.classList.remove('n-actives');}alert('粽子古文放假啦')\">" +
                    i +
                    "</li>";
                } else {
                  str +=
                    "<li style=\"cursor:pointer\" class=\"date-li\" onclick=\"let doms=document.querySelector('.n-actives');if(doms){doms.classList.remove('n-actives');}if(this.className.indexOf('n-active')!=-1){this.className='n-actives date-li n-active';}\">" +
                    i +
                    "</li>";
                }
              }
              //需要补课的情况
              if (flag == "333") {
                str +=
                  "<li style=\"cursor:pointer\" class=\"n-activess date-li\" onclick=\"let doms=document.querySelector('.n-actives');if(doms){doms.classList.remove('n-actives');}if(this.className.indexOf('n-activess')!=-1){this.className='n-actives date-li n-activess';}\">" +
                  i +
                  "</li>";
              }

            }

          } else {
            //从一号开始添加知道totalDay，并为pre，next和当天添加样式
            //没有打过卡的日历界面信息
            var myclass;
            let flag = "111";
            for (var i = 1; i <= totalDay; i++) {
              flag = "111";
              if (!(this.unSignList == undefined)) {
                for (var k = 0; k < this.unSignList.length; k++) {
                  //日期字符串取出天
                  //  let teDay = this.unSignList[k].split("-")[2];
                  //  if(teDay=="01"||teDay=="02"||teDay=="03"||teDay=="04"||teDay=="05"||teDay=="06"||teDay=="07"||teDay=="08"||teDay=="09"){
                  //    teDay = teDay.split("0")[1];
                  //  }
                  //  console.log("需要补课的天:");
                  //   console.log(teDay+","+i);
                  //拼凑出当前循环i对应的年月日
                  let tpyears = this.my_year;
                  let tpmonths = this.my_month <= 8 ? ("0" + (this.my_month + 1)) : (this.my_month + 1);
                  let tpdays = i <= 9 ? ("0" + i) : i;
                  let tpdate = tpyears + "-" + tpmonths + "-" + tpdays;
                  if (this.unSignList[k] == tpdate) {
                    flag = "333";
                    break;
                  }
                }
              }

              if (flag == "333") {
                str +=
                  "<li style=\"cursor:pointer\" class=\"n-activess date-li\" onclick=\"let doms=document.querySelector('.n-actives');if(doms){doms.classList.remove('n-actives');}if(this.className.indexOf('n-activess')!=-1){this.className='n-actives date-li n-activess';}\">" +
                  i +
                  "</li>";
              } else {
                //临时用的代码---节后需要删除
                if (this.my_month == 1 && (i == 4 || i == 5 || i == 6 || i == 7 || i == 8 || i == 9 || i == 10)) {
                  str +=
                    "<li style=\"cursor:pointer\" class=\"n-activesss date-li\" onclick=\"let doms=document.querySelector('.n-actives');if(doms){doms.classList.remove('n-actives');}alert('粽子古文放假啦')\">" +
                    i +
                    "</li>";
                } else {
                  str +=
                    "<li style=\"cursor:pointer\" class=\"date-li\" onclick=\"let doms=document.querySelector('.n-actives');if(doms){doms.classList.remove('n-actives');}if(this.className.indexOf('n-active')!=-1){this.className='n-actives date-li n-active';}\">" +
                    i +
                    "</li>";
                }
              }
            }
          }

          this.holderStr = str;
          this.ctitleStr = this.my_year + "年" + this.month_name[this.my_month];

        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.mine-box {
  width: 100%;
  display: flex;
  flex-direction: column;

  .e-header {
    width: 100%;
    height: 220 / @rem;
    background: #eff2db;
    margin-bottom: 20 / @rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .e-pho {
      width: 136 / @rem;
      height: 136 / @rem;
      border-radius: 100%;
      border: 2 / @rem solid #9e9e9e;
    }
  }

  .e-item {
    width: 94%;
    height: 106 / @rem;
    margin: 0 auto;
    border-bottom: 2 / @rem solid #45bb7f;
    display: flex;
    align-items: center;
    font-size: 32 / @rem;
    font-family: heiti;
    .classify {
      letter-spacing: 8 / @rem;
      margin-right: 4.8rem;
      margin-left: 1rem;
    }
  }

  .control-btn {
    margin: 124 / @rem auto;
  }
}

.listen-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .l-header {
    height: 86 / @rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32 / @rem;
    background: #cff9d8;
    font-family: heiti;
  }
  .l-list {
    width: 100%;
    height: 106vw;
    overflow: scroll;
    .l-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 48 / @rem 0 0 36 / @rem;
      float: left;
      .l-img {
        width: 196 / @rem;
        height: 148 / @rem;
        border: 2 / @rem solid #4d4031;
        border-radius: 10 / @rem;
        background: #eaf3ec;
        img {
          width: 196 / @rem;
          height: 148 / @rem;
        }
      }
      .l-text {
        font-size: 28 / @rem;
        color: #3f301f;
        margin-top: 20 / @rem;
      }
    }
  }
  @media screen and (min-width: 768px) {
    .l-list {
      width: 100%;
      height: 94vw;
      overflow: scroll;
      .l-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 1rem 0 0 36 / @rem;
        float: left;
        .l-img {
          width: 196 / @rem;
          height: 148 / @rem;
          border: 2 / @rem solid #4d4031;
          border-radius: 10 / @rem;
          background: #eaf3ec;
          img {
            width: 196 / @rem;
            height: 148 / @rem;
          }
        }
        .l-text {
          font-size: 28 / @rem;
          color: #3f301f;
          margin-top: 20 / @rem;
        }
      }
    }
  }
  .select-text {
    font-size: 26 / @rem;
    color: #3f301f;
    margin: 70 / @rem 0 0 0;
  }
}

.tabbar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 124 / @rem;
  border-top: 1 / @rem solid #a6a094;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .tab-text {
      font-size: 23 / @rem;
      margin-top: 20 / @rem;
      color: #333333;
      &.active {
        color: @btnColor;
      }
    }
    .learn {
      width: 70 / @rem;
      height: 48 / @rem;
    }
    .rili {
      width: 54 / @rem;
      height: 50 / @rem;
    }
    .listen {
      width: 62 / @rem;
      height: 46 / @rem;
    }
    .mine {
      width: 43 / @rem;
      height: 52 / @rem;
    }
  }
}

.control-btn {
  margin-top: -6rem;
}
.record-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .r-header {
    height: 86 / @rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32 / @rem;
    background: #cff9d8;
    font-family: heiti;
  }
  .r-body {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .calendar {
      width: 100vw;
      height: 82vw;
      // box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
      .title {
        height: 21%;
        position: relative;
        text-align: center;
        #calendar-year {
          font-size: 1rem;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: normal;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #pre {
          position: absolute;
          top: 37%;
          left: 30%;
          background-image: url(./../assets/images/prev.png);
          background-size: 100% 100%;
          /*没规定大小时，图片显示 0X0*/
          width: 5vw;
          height: 5vw;
        }

        #next {
          position: absolute;
          top: 37%;
          right: 30%;
          background-image: url(./../assets/images/next2.png);
          background-size: 100% 100%;
          width: 5vw;
          height: 5vw;
        }
      }
      .body {
        .body-list {
          ul {
            font-size: 14px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
            width: 100%;
            box-sizing: border-box;
            li {
              list-style: none;
              display: block;
              width: 14.28%;
              float: left;

              /*规定行高，垂直居中*/
              height: 36px;
              line-height: 36px;
              box-sizing: border-box;
              text-align: center;
              .green {
                color: #6ac13c;
              }

              .lightgrey {
                /*浅灰色显示过去的日期*/
                color: #a8a8a8;
              }
              .darkgrey {
                /*深灰色显示将来的日期*/
                color: #565656;
              }

              /*日期当天用绿色背景绿色文字加以显示*/
              .greenbox {
                border: 1px solid #6ac13c;
                background: #e9f8df;
              }
            }
          }
        }
      }
      @media screen and (min-width: 768px) {
        .body {
          .body-list {
            ul {
              font-weight: bold;
              width: 100%;
              box-sizing: border-box;
              li {
                list-style: none;
                display: block;
                width: 14.28%;
                float: left;
                font-size: 0.7rem;
                /*规定行高，垂直居中*/
                height: 36px;
                line-height: 36px;
                box-sizing: border-box;
                text-align: center;
                .green {
                  color: #6ac13c;
                }

                .lightgrey {
                  /*浅灰色显示过去的日期*/
                  color: #a8a8a8;
                }
                .darkgrey {
                  /*深灰色显示将来的日期*/
                  color: #565656;
                }

                /*日期当天用绿色背景绿色文字加以显示*/
                .greenbox {
                  border: 1px solid #6ac13c;
                  background: #e9f8df;
                }
              }
            }
          }
        }
      }
    }
  }
  .control-btn {
    margin-top: 1rem;
  }
  @media screen and (min-width: 768px) {
    .control-btn {
      margin-top: -6rem;
    }
  }
}
</style>