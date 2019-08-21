<template>
    <div class="m-box">
      <div class="mine-box" v-if="tabNav==3">
        <div class="m-header">
          <img class="m-pho" :src="headImgUrl" alt="" />
          <div class="m-middle" @click="goEdit()">
            <p class="m-name">{{nickname}}</p>
            <p class="m-level">我的级别：{{type}}</p>
          </div>
          <img class="m-icon" src="./../assets/images/next.png" />
        </div>
        <div class="m-item" @click="goInvite()">
          <img src="./../assets/images/man.png" />
          <p class="m-text">邀请好友</p>
        </div>
        <div class="m-item" @click="goResign()">
          <img src="./../assets/images/xu.png" />
          <p class="m-text">续课报名</p>
        </div>
        <div class="m-item" @click="goMistake()">
          <img src="./../assets/images/xuhuan.png" />
          <p class="m-text">错题集</p>
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
import axios from "axios";
export default {
  name: "usercenter",
  data() {
    return {
      tabNav: 3,
      headImgUrl:'',
      type:'',
      nickname:''
    };
  },
  mounted:function(){
          axios
          .get(this.$store.state.baseUrlFront + "wxinfo/findUserInfo", {
            params: { USER_ID: localStorage.getItem("USER_ID") }
          })
          .then(res => {
            // console.log(res);
            this.headImgUrl = res.data.data.headimgurl;
            this.nickname = res.data.data.nickname;
            if(res.data.data.type == "0"){
              this.type = "L1探花";
            }else if(res.data.data.type == "1"){
              this.type = "L2榜眼";
            }else{
             this.type = "L3状元";
            }
          });
  },
  methods: {
      goMistake(){
      this.$router.push({
          path: "/CalendarForM"
        });
    },
    goResign(){
        this.$router.push({
          path: "/Resign"
        });
    },
    goInvite(){
          this.$router.push({
          path: "/Invite"
        });
    },
    goEdit(){
           this.$router.push({
          path: "/EditMine"
        });
    }
  }
}
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
<style scoped>
.n-active{
  color:green;
  font-size:1rem;
}
</style>
