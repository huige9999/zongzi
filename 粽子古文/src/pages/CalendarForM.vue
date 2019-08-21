<template>
    <div class="m-box">
        <div class="record-box"  v-if="tabNav==1">
          <div class="r-header">错题集</div>
          <div class="r-body">
            <div class="calendar">
              <div class="title">
                <h2  id="calendar-year">{{ctitleStr}}</h2>
                <label href="" id="pre" @click="prev()"></label>
                <label href="" id="next" @click="next()"></label>
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
           <div class="control-btn" @click='goExercise()'>查看错题</div>
      </div>
      <div class="listen-box"  v-if="tabNav==2">
        <div class="l-header">古文音频</div>
        <div class="l-list">
          <div class="l-item" v-for="item,index in audioList" :key="index">
            <div class="l-img">
              <img :src="item.audioSrc" />
            </div>
            <p class="l-text">{{item.artical}}</p>
          </div>
        </div>
        <p class="select-text">请选择想听得古文（可多选）</p>
        <div class="control-btn">播放</div>
      </div>
      <div class="mine-box" v-if="tabNav==3">
        <div class="m-header">
          <img class="m-pho" src="./../assets/images/pho008.jpg" alt="" />
          <div class="m-middle">
            <p class="m-name">张菲菲</p>
            <p class="m-level">我的级别：状元</p>
          </div>
          <img class="m-icon" src="./../assets/images/next.png" />
        </div>
        <div class="m-item">
          <img src="./../assets/images/man.png" />
          <p class="m-text">邀请好友</p>
        </div>
        <div class="m-item">
          <img src="./../assets/images/xu.png" />
          <p class="m-text">续课报名</p>
        </div>
        <div class="m-item">
          <img src="./../assets/images/xuhuan.png" />
          <p class="m-text">开通另一个手机</p>
        </div>
      </div>
      <!-- <div class="tabbar">
        <div class="tab-item" @click="changeNav(0)">
          <img class="learn " :src="tabNav==0?require('./../assets/images/learn-active.png'):require('./../assets/images/learn.png')" />
          <p class="tab-text" :class="tabNav==0?'active':''">今日学习</p>
        </div>
        <div class="tab-item" @click="changeNav(1)">
          <img class="rili"  :src="tabNav==1?require('./../assets/images/rili-active.png'):require('./../assets/images/rili.png')" />
          <p class="tab-text" :class="tabNav==1?'active':''">学习记录</p>
        </div>
        <div class="tab-item" @click="changeNav(2)">
          <img class="listen" :src="tabNav==2?require('./../assets/images/listen-active.png'):require('./../assets/images/listen.png')" />
          <p class="tab-text" :class="tabNav==2?'active':''">听古文</p>
        </div>
        <div class="tab-item" @click="changeNav(3)">
          <img class="mine" :src="tabNav==3?require('./../assets/images/mine-active.png'):require('./../assets/images/mine.png')" />
          <p class="tab-text" :class="tabNav==3?'active':''">我的</p>
        </div>
      </div> -->
    </div>
</template>

<script>
export default {
  name: "mymistake",
  data() {
    return {
      tabNav: 1,
      audioList: [
        {
          audioSrc: require("./../assets/images/bianri.png"),
          artical: "两小儿辩日"
        },
        {
          audioSrc: require("./../assets/images/bianri.png"),
          artical: "两小儿辩日"
        },
        {
          audioSrc: require("./../assets/images/bianri.png"),
          artical: "两小儿辩日"
        },
        {
          audioSrc: require("./../assets/images/bianri.png"),
          artical: "两小儿辩日"
        },
        {
          audioSrc: require("./../assets/images/bianri.png"),
          artical: "两小儿辩日"
        },
        {
          audioSrc: require("./../assets/images/bianri.png"),
          artical: "两小儿辩日"
        },
        {
          audioSrc: require("./../assets/images/bianri.png"),
          artical: "两小儿辩日"
        },
        {
          audioSrc: require("./../assets/images/bianri.png"),
          artical: "两小儿辩日"
        }
      ],
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
      my_date: new Date()
    };
  },
  mounted: function() {
    this.refreshDate();
  },
  methods: {
    changeNav(n) {
      this.tabNav = n;
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
      var str = "";
      //计算当月的天数和每月第一天都是周几，day_month和day_year都从上面获得
      var totalDay = this.daysMonth(this.my_month, this.my_year);
      var firstDay = this.dayStart(this.my_month, this.my_year);
      //添加每个月的空白部分
      if (firstDay == 0) {
        firstDay = 7;
      }
      for (var i = 0; i < firstDay - 1; i++) {
        str += "<li class='date-li'>" + "</li>";
      }

      //从一号开始添加知道totalDay，并为pre，next和当天添加样式
      var myclass;
      for (var i = 1; i <= totalDay; i++) {
        //三种情况年份小，年分相等月份小，年月相等，天数小
        //点击pre和next之后，my_month和my_year会发生变化，将其与现在的直接获取的再进行比较
        //i与my_day进行比较,pre和next变化时，my_day是不变的
        /* console.log(my_year+" "+my_month+" "+my_day);
                console.log(my_date.getFullYear()+" "+my_date.getMonth()+" "+my_date.getDay());*/
        // if((this.my_year < this.my_date.getFullYear())||(this.my_year == this.my_date.getFullYear() && this.my_month < this.my_date.getMonth()) || (this.my_year == this.my_date.getFullYear() && this.my_month == this.my_date.getMonth() && i < this.my_day)){
        //     myclass = " class='lightgrey'";
        // }else if(this.my_year == this.my_date.getFullYear() && this.my_month == this.my_date.getMonth() && i == this.my_day){
        //     myclass = " class = 'green greenbox'";
        // }else{
        //     myclass = " class = 'darkgrey'";
        // }
        str +=
          "<li class='date-li'  onclick=\"let doms=document.querySelector('.n-active');if(doms){doms.classList.remove('n-active');}this.className='n-active date-li';\">" +
          i +
          "</li>";
      }
      this.holderStr = str;
      this.ctitleStr = this.my_year + "年" + this.month_name[this.my_month];
      //holder.innerHTML = str;
      //ctitle.innerHTML = my_year+'年'+month_name[my_month];
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
    goExercise() {
      //获取选中的那一天
      let newDate = "";
      let doms = document.querySelector(".n-active");
      if (doms) {
        //拼接一个完整的日期
        newDate = this.ctitleStr.replace("年", "-").replace("月", "-");
        if (parseInt(doms.innerHTML) < 10) {
          newDate = newDate + "0" + doms.innerHTML;
        } else {
          newDate = newDate + doms.innerHTML;
        }
        //console.log(newDate);
        //改变store中的preRecord字段并跳转到BeforeLearn界面
        //this.$store.commit("update_isPreMistake", newDate);
        localStorage.setItem("learnDate",newDate);
        this.$router.push({ name: "ExerciseForUs" });
      } else {
        alert("请选择日历上的某一天");
      }
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
  .m-header {
    width: 100%;
    height: 190 / @rem;
    margin-bottom: 54 / @rem;
    background: #eff2db;
    display: flex;
    align-items: center;
    .m-pho {
      width: 144 / @rem;
      height: 144 / @rem;
      display: inline-block;
      border: 2 / @rem solid #9e9e9e;
      border-radius: 100%;
      margin-left: 20 / @rem;
    }
    .m-middle {
      margin-left: 22 / @rem;
      margin-right: auto;
      .m-name {
        font-size: 38 / @rem;
        font-weight: 600;
        letter-spacing: 2 / @rem;
        line-height: 50 / @rem;
      }
      .m-level {
        font-size: 30 / @rem;
        letter-spacing: 4 / @rem;
        color: #333;
        margin-top: 8 / @rem;
      }
    }
    .m-icon {
      width: 22 / @rem;
      height: 38 / @rem;
      margin-right: 20 / @rem;
    }
  }
  .m-item {
    width: 100%;
    height: 106 / @rem;
    background: #eff2db;
    display: flex;
    align-items: center;
    margin-top: 10 / @rem;
    img {
      width: 52 / @rem;
      height: 52 / @rem;
      margin-left: 20 / @rem;
    }
    .m-text {
      font-size: 32 / @rem;
      margin-left: 24 / @rem;
    }
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
  }
  .l-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .l-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 48 / @rem 0 0 36 / @rem;
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
  .select-text {
    font-size: 26 / @rem;
    color: #3f301f;
    margin: 8.3rem 0 0 0;
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
  margin-top: 34 / @rem;
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
  }
  .r-body {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .calendar {
      width: 100vw;
      height: 82vw;
      box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
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
    }
  }
  .control-btn {
    margin-top: 340 / @rem;
  }
}
</style>
