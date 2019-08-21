<template>
  <div id="app">
    <router-view/>
    <audio id="myaudio"  controls style="display:none"></audio>
  </div>
</template>

<script>
export default {
  name: 'App'
  // data(){
  //   return {
  //     audioSrc:""
  //   }
  // },
  // methods:{
  //    playAudio(){
  //      let audio = document.getElementById("audio");
  //      audio.load();
  //    },
  //    autoPlayQues(src,cb){
  //       let audio = document.getElementById("audio");
  //       audio.addEventListener('ended',cb,false);
  //       audio.src = src;
  //       audio.load();
  //       audio.play();
  //    }
  // },
  // mounted(){
  //   let that = this;
  //     document.addEventListener('WeixinJSBridgeReady',that.playAudio,false);
  // }
}
</script>

<style>
@import "./common/font.css";
.date-li {
  list-style: none;
  display: block;
  width: 14.28%;
  float: left;

  /*规定行高，垂直居中*/
  height: 36px;
  line-height: 36px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
}
@media screen and (min-width: 768px) {
  .date-li {
    list-style: none;
    display: block;
    width: 7vw;
    float: left;
    font-size: 1rem;
    /*规定行高，垂直居中*/
    height: 36px;
    line-height: 36px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    margin-left: 7vw;
  }
}
.key-text {
  color: #2b8552;
  padding-bottom: 1px;
  border-bottom: 1px dashed #000;
}
.n-activesss {
  font-size: 1rem;
  background-image: url(/static/img/dl.071aaa4.png);
  background-size: 83% 131%;
  background-position-x: 52%;
  background-position-y: 10%;
  background-repeat: no-repeat;
  border-radius: 50%;
  width: 13vw;
  margin-left: 1vw;
}
.n-activess {
  font-size: 1rem;
  background-color: #dadada;
  border-radius: 50%;
  width: 13vw;
  margin-left: 1vw;
}
@media screen and (min-width: 768px) {
  .n-activess {
    font-size: 1rem;
    background-color: #dadada;
    border-radius: 50%;
    width: 7vw;
    margin-left: 7vw;
  }
}
.n-active {
  font-size: 1rem;
  background-color: #cff9d8;
  border-radius: 50%;
  width: 13vw;
  margin-left: 1vw;
}
@media screen and (min-width: 768px) {
  .n-active {
    font-size: 1rem;
    background-color: #cff9d8;
    border-radius: 50%;
    width: 7vw;
    margin-left: 7vw;
  }
}
.n-actives {
  font-size: 1rem;
  background-color: #fdf277;
}
/* .wave {
  display: inline-block;
  top: 0.66rem;
  position: relative;
  width: 2rem;
  height: 6.5px;
  background-size: 15px 15px;
  background-repeat: repeat-x;
  background-image: linear-gradient(
      150deg,
      transparent 45%,
      black 55%,
      transparent 60%
    ),
    linear-gradient(30deg, transparent 45%, black 55%, transparent 60%);
}
.wave label {
  position: absolute;
  top: -1.3rem;
  left: 0.4rem;
} */
.dashedtext {
  display: inline-block;
  color: #ff9f00;
  height: 6vw;
  line-height: 6vw;
}
</style>
