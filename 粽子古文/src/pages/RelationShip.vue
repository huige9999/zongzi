<template>
  <div class="main">
    <div class="myBtn" @click="login" v-if="!isSon">开通子账号</div>
  </div>
</template>
<script>
import axios from "axios";
import wx from "weixin-js-sdk";
export default {
  name: 'relationShip',
  data() {
    return {
      relationship_id: '',
      isSon:false
    }
  },
  created() {
    let that = this;
    let userId = localStorage.getItem("USER_ID") || ''
    //判断有没有授权登录，没有授权登录不让他分享
    if (userId) {
      //判断是否是子账号 子账号不让他分享
      axios.get(this.$store.state.baseUrlFront + "wxinfo/checkSon", { params: { USER_ID:userId } }).then(res => {
        console.log(res)
        if (res.data && res.data.data && res.data.data.is_son == '0') {
          //非子账号
          // alert("不是子账号,可以分享");
           this.wxShare(userId)
        }else{
           alert("当前账号已经是子账号啦!");
           that.isSon = true;
        }
      }).catch(err => {
        console.log(err);

      })
    }

  },
  mounted() {
    //如果链接上有USER_ID(分享用户的USER_ID)的情况
    if (window.location.href.indexOf("?USER_ID=")!=-1) {
     // alert("分享者id:"+location.href.split("?USER_ID=")[1]);
      localStorage.setItem("RELATIONSHIP_ID", location.href.split("?USER_ID=")[1]);
      window.location.href = " http://front.zongziguwen.com/#/RelationShip";
    }
    if (localStorage.getItem("RELATIONSHIP_ID") && localStorage.getItem("RELATIONSHIP_ID")!=="undefined") {
      this.relationship_id = localStorage.getItem("RELATIONSHIP_ID");
    } else {
    //  alert("自己id:"+localStorage.getItem("USER_ID"));
      this.relationship_id = localStorage.getItem("USER_ID");
    }

  },
  methods: {
    login() {
    //  alert('携带id:'+ this.relationship_id);
      window.location.href = "qrCode/oauth_user2?type=7&relationship_id=" + this.relationship_id;
    },
    wxShare(userId){
        //调用接口获取微信配置参数
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
          jsApiList: [
            "checkJsApi",
            "onMenuShareTimeline",
            "hideOptionMenu",
            "onMenuShareAppMessage"
          ]
        };
        wx.config(params);
        wx.ready(function () {
          console.log("config信息验证完毕");
          wx.checkJsApi({
            jsApiList: [
              "getLocation",
              "onMenuShareTimeline",
              "onMenuShareAppMessage"
            ],
            success: function (res) {
              //alert(res.errMsg);
            }
          });

          wx.onMenuShareAppMessage({
            title: "点击链接，去开通子账号",
            desc: "点击链接，去开通子账号",
            link:
              "http://front.zongziguwen.com/#/RelationShip?USER_ID=" + userId,
            imgUrl:
              "http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrTy0rZEwxmUTHbNvIpgP9AibOj1Ss9Hnh0icjJMBpB1eBd1/64",
            trigger: function (res) {
              //alert('用户点击发送给朋友');
            },
            success: function (res) {
              //alert('分享成功啦!');
            },
            cancel: function (res) {
              alert("已取消");
            },
            fail: function (res) {
              // alert(res.errMsg);
            }
          });

          // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
          wx.onMenuShareTimeline({
            title: "点击链接，去绑定子账号",
            desc: "点击链接，去绑定子账号",
            link:
              "http://front.zongziguwen.com/#/Compare?USER_ID=" + userId,
            imgUrl:
              "http://wx.qlogo.cn/mmopen/yQtt8W9CWYUhkuiceRYpyAbgKlzD1pmVbjyFlicqOzEukT9JQdesjrTy0rZEwxmUTHbNvIpgP9AibOj1Ss9Hnh0icjJMBpB1eBd1/64",
            trigger: function (res) {
              //alert('用户点击分享到朋友圈');
            },
            success: function (res) {
              //alert('分享成功啦');

            },
            cancel: function (res) {
              //alert('已取消');
            },
            fail: function (res) {
              alert(res.errMsg);
            }
          });
        });
        wx.error(function (res) {
          console.log("config配置出错");
        });
      });
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  width: 92vw;
  height: 100vh;
  padding-left: 4vw;
  padding-right: 4vw;
  background-image: url("../assets/images/relationship-bg.jpg");
  background-size: 100% 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  .myBtn {
    width: 243px;
    height: 45px;
    background-color: #45bb7f;
    border-radius: 20px;
    margin-bottom:45px;
    display:flex;
    justify-content: center;
    align-items: center;
    color:#fff;
    font-size:17px;
  }
}
</style>