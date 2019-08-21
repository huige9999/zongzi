<template>
    <div class="m-box">
       <img class="finger" src="./../assets/images/finger.png" alt="">
      <div class="i-box">
        <img class="i-img" src="./../assets/images/tuijian_img.png" />
        <div class="i-item">
          <img class="item-img" src="./../assets/images/i-img01.png" />
          <div class="item-right">
            <p class="i-title">好友报名，给孩子找个小伙伴，共同成长</p>
            <!-- <p class="i-content">好友报名本期课程，享受立减20元优惠！</p> -->
          </div>
        </div>
        <div class="i-item">
          <img class="item-img" src="./../assets/images/i-img02.png" />
          <div class="item-right">
            <p class="i-title">每推荐1人，自己即得20元续课优惠券。（自动计入个人账户)</p>
            <!-- <p class="i-content">自己报名本期课程，享受立减20元优惠！</p> -->
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from "axios";
import wx from 'weixin-js-sdk';
    export default {
        name: "invite",
        data(){
          return {
              isActive:false,
              nickname:'',
              learnDay:0
          }
        },
                created(){
                //获取个人信息
             axios.get(
          this.$store.state.baseUrlFront+'qrCode/getPersonalInfo',
          {
            params: { 
               USER_ID: localStorage.getItem("USER_ID")
            }
          }).then((res)=>{
            if(res.status==200){
              console.log(res) ;
              this.nickname=res.data.data.nickname;
              this.learnDay = parseInt(res.data.data.days)+1;
                    
                 //调用接口获取微信配置参数
    axios
      .get(this.$store.state.baseUrlFront+"courseware/getWxSignature",{
        params:{
          url:location.href
        }
      })
      .then(res => {
        let that = this;
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
			      desc: '你的朋友'+that.nickname+'正在学习『粽子古文』，邀请你一起参与。好友在一起，学习更有劲!',
			       link: 'http://front.zongziguwen.com/#/VipPurchase?inviter_id='+localStorage.getItem("USER_ID"),
			       imgUrl: 'http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrT91xoVHLEEXDjw0e1YQ22ujEaeIX4bbc3znWoeVFZjTN/64',
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
			        //alert(res.errMsg);
			      }
			   });

  // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
			  wx.onMenuShareTimeline({
          title:'你的朋友'+that.nickname+'正在学习『粽子古文』，邀请你一起参与。好友在一起，学习更有劲!',
			      desc: '你的朋友'+that.nickname+'正在学习『粽子古文』，邀请你一起参与。好友在一起，学习更有劲!',
			      link: 'http://front.zongziguwen.com/#/VipPurchase?inviter_id='+localStorage.getItem("USER_ID"),
			      imgUrl: 'http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrT91xoVHLEEXDjw0e1YQ22ujEaeIX4bbc3znWoeVFZjTN/64',
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
			       // alert(res.errMsg);
			      }
			});

      });
      wx.error(function(res){
        console.log("config配置出错")
      });
      });
            }
        })

    },
    mounted(){
      
    },
        methods:{
  
        }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;
  .m-box{
    background: #f0efee;
    .i-box{
      width: 96%;
      height: 96%;
      margin: 22/@rem auto ;
      border-radius: 20/@rem;
      background: #fff6e3;
      display: flex;
      flex-direction: column;
      align-items: center;
      .i-img {
        width: 100%;
        height: 480/@rem;
      }
      .i-item{
        width: 648/@rem;
        height: 186/@rem;
        background: #fff;
        border-radius: 16/@rem;
        display: flex;
        align-items: center;
        .item-img{
          width: 114/@rem;
          height: 114/@rem;
          margin: 0 50/@rem 0 48/@rem;
        }
        .item-right{
          width: 13.8rem;
          .i-title{
            font-size: 33/@rem ;
            color: @btnColor;
            font-weight: 600;
            line-height: 54/@rem;
            font-family: heiti;
          }
          .i-content{
            font-size: 24/@rem;
            line-height: 34/@rem;
          }
        }
      }
      .i-item:nth-of-type(1){
        margin-top: 88/@rem;
      }
      .i-item:nth-of-type(2){
        margin-top: 24/@rem;
      }
    }
  }
</style>
<style scoped>
.finger {
  animation: eighth 0.8s infinite;
  width:8vw;
  position: absolute;
  right:4vw;
  top:3vw;
}
@keyframes eighth {
  0% {
    transform: scale(1) rotate(-85deg);
    
  }
  50% {
    transform: scale(1.2) rotate(-85deg);
  }
  100% {
    transform: scale(0.8) rotate(-85deg);
  }
}
</style>