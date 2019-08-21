<template>
    <div class="m-box">
      <div class="listen-box"  v-if="tabNav==2">
        <div class="l-header">古文音频</div>
      <audio id="audio" :src='audioSrc'  style='display:none'>
      </audio>
        <div class="l-list">
          <div class="l-item" v-for="item,index in audioList" :key="index">
            <div class="l-img">
              <img :src="item.pic_url" @click="playAudio(item.sound_path)"/>
            </div>
            <p class="l-text">{{item.title}}</p>
          </div>
        </div>
        <p class="select-text">请点击播放想听得古文</p>
        <div class="control-btn" @click="playControl()">{{btnText}}</div>
      </div>
    </div>
</template>

<script>
export default {
  name: "guwen",
  data() {
    return {
      tabNav: 2,
      audioList: [],
      audioSrc:'',
      isPlay: false,
      isEnd:false,
      currentTime:0,
      flag:0
    }
  },
  mounted:function(){
    //this.refreshDate()
  let imgUrl = '';
  let soundUrl = '';
  let title = '';
   for(let i=0;i<this.$store.state.ex_guwen.length;i++){
   imgUrl =this.$store.state.imgUrlFront + this.$store.state.ex_guwen[i].pic_url;
   soundUrl = this.$store.state.soundUrlFront + this.$store.state.ex_guwen[i].sound_path;
   title = this.$store.state.ex_guwen[i].title;
   this.audioList.push({"title":title,"pic_url":imgUrl,"sound_path":soundUrl});
   }

       let audio = $('#audio')[0] ;
      let that = this ;
       audio.addEventListener('timeupdate', function () {
         //flag 1 重新播放，0空操作
        if(that.flag == 1){
          this.currentTime = 0;
          that.flag = 0;
        }
       })
           audio.addEventListener('ended', function () {
            that.isEnd = true ;
          }, false);
  },
          computed:{
        btnText(){
          let text = ''
          if(!this.isEnd){
            text = this.isPlay?'暂停':'继续'
          }else{
            text = '继续';
          }
          return text
        }
      },
  methods: {
    changeNav(n) {
      this.tabNav = n;
    },
           playControl(){
          if(this.isEnd){
            this.isEnd = false;
          }
          if(this.audioSrc == ''){
            alert("请选择一个音频播放")
          }else{
          if(!this.isPlay){
            audio.play() ;
            this.isPlay = true ;
          }else {
            audio.pause() ;
            this.isPlay = false ;
          }
          }
      },
      playAudio(sound_path){
         this.flag = 1;
        this.audioSrc = sound_path;
        audio.play();
        this.isPlay = true;
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
    margin: 8rem 0 0 0;
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
