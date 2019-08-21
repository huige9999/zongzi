<template>
       <div class="m-box">
      <div class="shade" v-if="isActive"  @click="invite"></div>
     <div class="pop" v-if="isActive" @click="invite"><img src="../assets/images/pop.png" alt="" id="popimg"></div>
      <div class="p-box">
        <img class="pt-imgHeader" src="./../assets/images/logo.png" alt="">
        <img class="pt-img" src="./../assets/images/pintuanbg.png"/>
        <div class="content-box">
          <div class="c-header">
            <div class="line"></div>
            <div class="c-title">3人成团</div>
            <div class="line"></div>
          </div>
          <div class="person-box">
            <div class="person-item">
              <div class="p-pho">
                <img :src="headimg1" />
              </div>
              <p class="p-name">{{nickname1}}</p>
            </div>
            <img class="plus" src="./../assets/images/plus.png" />
            <div class="person-item">
              <div class="p-pho">
                <img v-if="headimg2!=''"  :src="headimg2" />
              </div>
              <p class="p-name">{{nickname2}}</p>
            </div>
            <img class="plus" src="./../assets/images/plus.png" />
            <div class="person-item">
              <div class="p-pho">
                <img v-if="headimg3!=''" :src="headimg3" />
              </div>
              <p class="p-name">{{nickname3}}</p>
            </div>
          </div>
          <p class="t-title">24小时组团进行中... ...</p>
          <p class="t-content">点击下方“邀请好友”，一起参团，享受优惠！</p>
          <!-- <div class="t-box">
             <span class="t-red">{{hours}}</span>小时<span class="t-red">{{minutes}}</span>分<span class="t-red">{{seconds}}</span>秒 后截止 
            {{timeText}}
          </div> -->
          <p class="gray-text top">谁是孩子熟识的小伙伴？</p>
          <p class="gray-text">邀请他们一起！</p>
          <p class="gray-text">集体学习，更有动力！</p>
          <div class="control-btn" @click="invite()" style="top:-1rem;left:12vw">邀请好友</div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import wx from 'weixin-js-sdk';
    export default {
        name: "pingtuan",
        data(){
          return {
            group_id:'',
            nickname1:'',
            headimg1:'',
            nickname2:'',
            headimg2:'',
            nickname3:'',
            headimg3:'',
            hours:'1',
            minutes:'1',
            seconds:'1',
            isActive:false
          }
        },
        created(){
                   let USERID = localStorage.getItem("USER_ID");
          let that = this;
         axios.get(
          this.$store.state.baseUrlFront+'wxinfo/findByGroupId',
          {
            params: { 
               USER_ID: USERID
            }
          }).then((res)=>{
              console.log(res) ;
              if(res.data.data.list.length == 0){
                alert("时间到，团购失败");
                localStorage.removeItem("group_id");
                //window.location.href="http://front.zongziguwen.com/#/Purchase";
                this.$router.push({ name: "Purchase" });
              }else{
              that.nickname1 = res.data.data.list[0].nickname;
              that.headimg1 = res.data.data.list[0].headimgurl;
              that.group_id = res.data.data.list[0].group_id;
              localStorage.setItem("group_id",that.group_id);
              if(!(res.data.data.list[1]==undefined)){
                that.nickname2 = res.data.data.list[1].nickname;
                that.headimg2 = res.data.data.list[1].headimgurl;
              }
              if(!(res.data.data.list[2]==undefined)){
                 that.nickname3 = res.data.data.list[2].nickname;
                 that.headimg3 = res.data.data.list[2].headimgurl;
                 alert("团购成功");
              }
              }
        })

    },
        mounted(){
          

        let that = this;
  //调用接口获取微信配置参数
    axios
      .get(this.$store.state.baseUrlFront+"courseware/getWxSignature",{
        params:{
          url:location.href
        }
      })
      .then(res => {
       console.log(res);
           let params = {
        debug:false,
        appId:res.data.signature.appId,
        timestamp:res.data.signature.timestamp,
        nonceStr:res.data.signature.nonceStr,
        signature:res.data.signature.signature,
        jsApiList: [ 'checkJsApi','onMenuShareTimeline','hideOptionMenu','onMenuShareAppMessage']
        };
      wx.config(params);
      wx.ready(function(){
        console.log("config信息验证完毕");
 //wx.hideOptionMenu();/***隐藏分享菜单****/ 
			 wx.checkJsApi({
		      jsApiList: [
		        'getLocation',
              'onMenuShareTimeline',
              'onMenuShareAppMessage'
		      ],
		      success: function (res) {
		        //alert(res.errMsg);
		      }
		    });

       wx.onMenuShareAppMessage({
			      title: '粽子古文',
			      desc: that.nickname1+'邀请您参加『粽子古文』团购，立享优惠价。孩子们一起学习，更有动力',
			       link: 'http://front.zongziguwen.com/#/ToPingtuan?groupId='+that.group_id,
			       imgUrl: 'http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrTy0rZEwxmUTHbNvIpgP9AibOj1Ss9Hnh0icjJMBpB1eBd1/64',
			      trigger: function (res) {
			        //alert('用户点击发送给朋友');
			      },
			      success: function (res) {
			        alert('分享成功啦!');
			      },
			      cancel: function (res) {
			        alert('已取消');
			      },
			      fail: function (res) {
			        alert(res.errMsg);
			      }
			   });

  // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
			  wx.onMenuShareTimeline({
			      desc: that.nickname1+'邀请您参加『粽子古文』团购，立享优惠价。孩子们一起学习，更有动力！',
			      link: 'http://front.zongziguwen.com/#/ToPingtuan?groupId='+that.group_id,
			      imgUrl: 'http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrTy0rZEwxmUTHbNvIpgP9AibOj1Ss9Hnh0icjJMBpB1eBd1/64',
			      trigger: function (res) {
			        //alert('用户点击分享到朋友圈');
			      },
			      success: function (res) {
			        alert('分享成功啦');

			      },
			      cancel: function (res) {
			        //alert('已取消');
			      },
			      fail: function (res) {
			        alert(res.errMsg);
			      }
			});

      });
      wx.error(function(res){
        console.log("config配置出错")
      });
      });
          
        },
       methods:{
         invite(){
             this.isActive=!this.isActive
         },
     countDown(times){
  var timer=null;
  timer=setInterval(function(){
    var day=0,
      hour=0,
      minute=0,
      second=0;//时间默认值
    if(times > 0){
      day = Math.floor(times / (60 * 60 * 24));
      hour = Math.floor(times / (60 * 60)) - (day * 24);
      minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    if (day <= 9) day = '0' + day;
    if (hour <= 9) hour = '0' + hour;
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    this.hours = hour;
    this.minutes = minute;
    this.seconds = second;
      let str="";
      str = this.hours+"小时"+this.minutes+"分"+this.seconds+"秒后截止";
      return str;
       console.log(this.hours+"小时"+this.minutes+"分"+this.seconds+"秒后截止");
    times--;
  },1000);
  if(times<=0){
    clearInterval(timer);
  }
}
       }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;
  .m-box{
    background: #f0efee;
    .shade{
        position:absolute;
        z-index:1;
        background-color: black;
        opacity: 0.3;
        width: 100%;
        height: 100%;
}
.pop{
    position: absolute;
    z-index: 2;
    width: 400px;
    left: 7vw;
}
#popimg{
    width: 80%;
    height: 80%;
} 
    .p-box{
      width: 96%;
      height: 96%;
      border-radius: 14/@rem;
      background: #fff;
      margin: 28/@rem auto;
      position: relative;
      .pt-imgHeader{
        position: absolute;
        left: 280/@rem;
        top: 20/@rem;
        z-index: 3;
        width: 150/@rem;
        height: 140/@rem;
      
      }
      .pt-img{
        width: 685/@rem;
        height: 680/@rem;
        .postion(10,90,2)
      }
      .content-box{
        width: 620/@rem;
        .postion(40,150,22) ;
        display: flex;
        flex-direction: column;
        align-items: center;
        .c-header{
          margin-top: 20/@rem;
          display: flex;
          align-items: center;
          .c-title{
            font-size: 46/@rem;
            font-weight: 600;
            margin: 0 26/@rem;
            color: #2ea468;
          }
          .line{
            width: 42/@rem;
            height: 4/@rem;
            background: #2ea468;
          }
        }
        .person-box{
          margin-top: 40/@rem;
          display: flex;
          align-items: center;
          .plus{
            width: 38/@rem;
            height: 38/@rem;
            margin: 0 12/@rem;
          }
          .person-item{
            display: flex;
            flex-direction: column;
            align-items: center;
            .p-pho{
              width: 158/@rem;
              height: 158/@rem;
              box-sizing: border-box;
              border: 2/@rem solid #45bb7f;
              border-radius: 16/@rem;
              padding: 8/@rem;
              img{
                width: 140/@rem ;
                height: 140/@rem ;
                border-radius:16/@rem;
              }
            }
            .p-name{
              font-size: 22/@rem;
              margin-top: 16/@rem;
            }
          }
        }
      }
      .t-title{
        font-size: 38/@rem;
        font-weight: 600;
        color: #ea2038;
        margin-top: 48/@rem;
      }
      .t-content{
        font-size: 28/@rem;
        color: #ea2038;
        margin-top: 32/@rem;
      }
      .t-box{
        width: 338/@rem;
        height: 54/@rem;
        margin-top: 48/@rem;
        box-sizing: border-box;
        border: 2/@rem solid #999792;
        border-radius: 6/@rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26/@rem;
        color: #666666;
        .t-red{
          color:#ea2038
        }
      }
      .gray-text{
        font-size: 32/@rem;
        color: #555555;
        margin-top: 24/@rem;
        &.top{
          margin-top: 7.2rem;
        }
      }
      .control-btn{
        margin-top: 88/@rem;
      }
    }
  }

</style>
