<template>
      <div class="p-box">
     <div class="p-header">3人成团</div>
      <div class="pt-list">
        <div class="pt-item">
          <div class="line"></div>
          <p class="pt-title">已选课程</p>
          <p class="black-text">粽子古文</p>
        </div>
        <div class="pt-item">
          <div class="line"></div>
          <p class="pt-title">请选择级别</p>
          <!-- 修改选择年级 -->
          <div class="pt-btnGroup">
            <div class="pt-btn" v-text="selectItem">L1 探花</div>
            <div class="pt-btnList" v-if="btnListShow">
              <div class="pt-btn" v-for="(item,index) of btnListData" :key="index" @click="btnListItemClick(item,index)">{{item}}</div>
            </div>
            <div class="sanjiao" @click="handleSanjiaoClick">
              <div></div>
            </div>
          </div>
          <!-- 修改选择年级结束 -->
        </div>
        <div class="pt-item">
          <div class="line"></div>
          <p class="pt-title">课程费用</p>
          <span class="s-red">￥</span>
          <span class="price">199.00</span>
          <span class="old-price">299.00</span>
        </div>
        <div class="btnHeight">

        </div>
        <!-- <div class="pt-item">
          <p class="pt-title">请添加您的手机号</p>
        </div>
        <div class="pt-item">
          <input placeholder="请填写手机号"/>
          <div class="yanzheng">获取验证码</div>
        </div>
        <div class="pt-item">
          <input placeholder="请填写验证码"/>
        </div> -->
      </div>
      <div class="control-btn" @click="groupbuyBefore()">确定</div>
            <div class="notice-box">
        <p style="padding-left:1rem;padding-right:1rem;"> 1、您选择【确定】支付199后，将邀请组团链接分享给好友，即发起团购。</p>
        <p style="padding-left:1rem;padding-right:1rem;">2、发起团购24小时内，满3人（含自己）报名，即组团成功，系统将推送学习账号给您。</p>
           <div class="botTop">
                <div>
                    <p>关注粽子古文</p>
                    <p>长按识别二维码</p>
                </div>
                <div style="margin-left:3vw">
                    <img src="./../assets/images/footerimg.jpg" alt="">
                </div>
            </div>
            <p class="cannot-pay">无法支付？联系糯米老师微信<span class="s-red">zongziguwen2</span></p>
      </div>
    </div>
</template>

<script>
import axios from "axios";
import wx from "weixin-js-sdk";
    export default {
        name: "to-pingtuan",
        data(){
          return{
            btnListShow:false,
            btnListData:["L1 探花","L2 榜眼","L3 状元"],
            selectItem:'L1 探花',
            courseIndex:'0',
            courseId:''
          }
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
        console.log(res);
        let params = {
          debug: false,
          appId: res.data.signature.appId,
          timestamp: res.data.signature.timestamp,
          nonceStr: res.data.signature.nonceStr,
          signature: res.data.signature.signature,
          jsApiList: ["chooseWXPay"]
        };
        wx.config(params);
        wx.ready(function() {
          console.log("config信息验证完毕");
        });
        wx.error(function(res) {
          console.log("config配置出错");
        });
      });
  },
    mounted(){
      if(window.location.href.indexOf("?from=singlemessage")!=-1){
        let groupIds = window.location.href.split("?groupId=")[1];
        window.location.href="http://front.zongziguwen.com/#/ToPingtuan?groupId="+groupIds;
      }
        if(window.location.href.indexOf("?from=groupmessage")!=-1){
              let groupIds = window.location.href.split("?groupId=")[1];
         window.location.href="http://front.zongziguwen.com/#/ToPingtuan?groupId="+groupIds;
    }
          if(window.location.href.indexOf("?from=timeline")!=-1){
               let groupIds = window.location.href.split("?groupId=")[1];
         window.location.href="http://front.zongziguwen.com/#/ToPingtuan?groupId="+groupIds;
    }
      //页面加载的时候获取groupId 存入localStorage
        let groupId = window.location.href.split("?groupId=")[1];

        // let groupId2 = window.location.href.split("&groupId=")[1];
        let groupId2 = " ";
        //	localStorage.setItem("GROUP_ID",tmpGROUPID);
        if(!(localStorage.getItem("GROUP_ID")==undefined)){
           groupId2 = localStorage.getItem("GROUP_ID");
          localStorage.removeItem("GROUP_ID");
        }
        //授权登录过用户点击分享的情况
        if(!(groupId==undefined || groupId=="")){
          localStorage.setItem("group_id",groupId);
              //console.log(groupId);
        }
          if(!(groupId2==undefined || groupId2=="")){
          localStorage.setItem("group_id",groupId2);
              //console.log(groupId);
        }
      
     
    },
        methods:{
          handleSanjiaoClick(){
            this.btnListShow=this.btnListShow===true ? false : true;
          },
          btnListItemClick(val,index){
            this.btnListShow=this.btnListShow===true ? false : true;
            this.selectItem=val;
             this.courseIndex = index;
          },
          groupbuyBefore(){ 
		        //判断团购状态
             axios.get(
          this.$store.state.baseUrlFront+'wxinfo/findByGroupId',
          {
            params: { 
               USER_ID: localStorage.getItem("USER_ID")
            }
          }).then((res)=>{
              console.log(res) ;
            if(res.data.data.list.length==0){
               //团购失败进入团购前支付页面
                 this.grouppurchase()
             }else{
              if(res.data.data.list[0].group_state=="2"){
                   localStorage.removeItem("group_id");
                //团购中进入等待页面
                 this.$router.push({ name: "Pingtuan" });
              }else if(res.data.data.list[0].group_state=="0"){
                  alert("团购失败，联系管理员退款");
                   localStorage.removeItem("group_id");
                    this.$router.push({ name: "Purchase" });
              }else{
                localStorage.removeItem("group_id");
                  //团购成功进入团购前支付页面
                 alert("已经团购成功，不需要重复购买，请耐心等待!")
              }
             }
        })
          },
          grouppurchase(){
            
            //调用支付接口,成功后跳转拼团页面
                   let that = this;
      //判断是否有即将开课的课程
      axios
      .get(this.$store.state.baseUrlFront + "course/lastCourse",{params: { type:this.courseIndex}})
      .then(reses => {
        console.log(reses);
        if (reses.data.data == undefined) {
          alert("最新一期的课程还没出来哦！");
        } else {
          that.courseId = reses.data.data.course_id;
          if(localStorage.getItem("group_id")==undefined || localStorage.getItem("group_id")==""){
                   //发起支付请求
        axios
          .get(this.$store.state.baseUrlFront + "money/groupbuyCourse.do", {
            params: {
              USER_ID: localStorage.getItem("USER_ID"),
              course_id: that.courseId,
              totalfee:"199"
            }
          })
          .then(res => {
            //调用微信支付JS
            //res.obj.appId res.obj.nonceStr  res.obj.timeStamp
            wx.chooseWXPay({
              timestamp: res.data.obj.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: res.data.obj.nonceStr, // 支付签名随机串，不长于 32 位
              package: res.data.obj.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: res.data.obj.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: res.data.obj.paySign, // 支付签名
              success: function(res) {
                //this.$router.push({ name: "AddTeacher" });
                //跳转首页
                window.location.href="http://front.zongziguwen.com/#/Pingtuan";
               //this.$router.push({ name: "Pingtuan" });
              }
            });
          });
          }else{
                 //发起支付请求
        axios
          .get(this.$store.state.baseUrlFront + "money/groupbuyCourse.do", {
            params: {
              USER_ID: localStorage.getItem("USER_ID"),
              course_id: that.courseId,
              totalfee:"199",
              group_id:localStorage.getItem("group_id")
            }
          })
          .then(res => {
            //调用微信支付JS
            //res.obj.appId res.obj.nonceStr  res.obj.timeStamp
            wx.chooseWXPay({
              timestamp: res.data.obj.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: res.data.obj.nonceStr, // 支付签名随机串，不长于 32 位
              package: res.data.obj.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: res.data.obj.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: res.data.obj.paySign, // 支付签名
              success: function(res) {
                //this.$router.push({ name: "AddTeacher" });
                //跳转首页
               //window.location.href="http://front.zongziguwen.com/#/AddTeacher";
               //this.$router.push({ name: "Pingtuan" });
                window.location.href="http://front.zongziguwen.com/#/Pingtuan";
              }
            });
          });
          }
      

        }
      });


          
          }
        }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .p-box{
    width: 100vw;
    height: 100vh;
    background: #fff;
    .p-header{
      width: 100%;
      height: 165/@rem;
      background: @btnColor;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 48/@rem;
      font-weight: 600;
      color: #fff;
      font-family: heiti;
      letter-spacing: 0.3rem;
    }
    .pt-list{
      width: 100%;
      .pt-item{
        width: 100%;
        height: 94/@rem;
        border-bottom: 2/@rem solid #999;
        display: flex;
        align-items: center;
        color: #444444;
        .line{
          width: 4/@rem;
          height: 34/@rem;
          background: @btnColor;
          margin-left: 22/@rem;
        }
        .pt-title{
          font-size: 30/@rem;
          margin-left: 13/@rem;
          margin-right: auto;
          font-family: heiti;
        }
      	  .black-text{
          font-size: 1.2rem;
          font-weight: bold;
          margin-right: 26/@rem;
          color: #000;
        } 
        
       
        .pt-btn{
          width: 160/@rem;
          height: 56/@rem;
          background: #62ce97;
          border-radius: 8/@rem 0 0 8/@rem ;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 1rem ;
          margin-right: 2/@rem;
          font-weight: bold;
        } 
        // 样式修改
        .pt-btnList{
          position: absolute;
          top: 56/@rem;
        }
        .sanjiao{
          width: 58/@rem;
          height: 56/@rem;
          background: #62ce97;
          border-radius:0 8/@rem 8/@rem 0 ;
          display: flex;
          justify-content: center;
          margin-right: 24/@rem;
          div{
            width: 0;
            height: 0;
            margin-top: 19/@rem;
            border-width: 18/@rem;
            border-style: solid;
            border-color: #fff  transparent transparent transparent;
          }
        }
        .price{
          font-size: 40/@rem;
          color: #ea2038;
          font-weight: 600;
          margin-right: 6/@rem;
        }
        .old-price{
          font-size: 24/@rem;
          color: #666666;
          text-decoration: line-through;
          margin-right: 24/@rem;
        }
        input{
          flex: 1;
          margin-left: 40/@rem;
        }
        .yanzheng{
          width: 204/@rem ;
          height: 56/@rem ;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #62ce97;
          border: 2/@rem solid #62ce97;
          border-radius: 6/@rem;
          margin-right: 24/@rem;
        }
      }
    }
    .notice-box{
      width: 94%;
      margin: 1rem auto 0;
      font-size: 28/@rem;
      line-height: 40/@rem;
      .cannot-pay{
        margin-top: 0.1rem;
        text-align: right;
        padding-right: 2vw;
      }
    }
  }
  .s-red{
    font-size: 26/@rem;
    color: #ea2038;
    font-weight: 600;
  }
  .pt-btnGroup{
    position: relative;
    display: flex;
    align-items: center;
  }
  .btnHeight{ 
    height:12vw;
  }

</style>
<style scoped>
.botTop{
    display: flex;
    justify-content: center;
    align-items: center;
}
.botTop p{
    margin-right: .3rem;
    font-family: "heiti";
    text-align: center;
    color: #45bb7f;
}
.botTop p:first-child{
    font-size: 4.975vw;
}
.botTop p:last-child{
    font-size: 3.5vw;
    line-height: 6.25vw;
}
.botTop img{
    width: 25vw;
    height:25vw;
}
</style>