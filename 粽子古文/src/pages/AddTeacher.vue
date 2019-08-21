<template>
      <div class="main">
        <div class="header">
            <img src="./../assets/images/logo.png" alt="">
            <p>长按识别二维码</p>
        </div>

        <div class="cont">
            <h2>添加老师</h2>
            <div class="contImg">
                <img :src="teacherQrCode" alt="">
            </div>
        </div>

        <div class="footer">
            <h3>欢&nbsp;迎&nbsp;加&nbsp;入&nbsp;【&nbsp;粽&nbsp;子&nbsp;古&nbsp;文&nbsp;】</h3>
            <p>有任何问题都可以咨询老师</p>
            <p>老师会在课程开始前将你加入学员群</p>
        </div>


    </div>
</template>

<script>
import axios from 'axios'
import wx from 'weixin-js-sdk';
    export default {
        name: "AddTeacher",
        data(){
            return {
                teacherQrCode:''
            }
        },
        mounted(){
            let that = this;
           //购买成功获取老师二维码
         axios.get(
          this.$store.state.baseUrlFront+'course/teacherCode',
          {
            params:{USER_ID:localStorage.getItem("USER_ID")}
          }).then((reses)=>{
              console.log(reses);
            that.teacherQrCode =  that.$store.state.imgUrlFront+reses.data.data.teacherCode;
        })



            // setTimeout(function(){
            //     window.location.href="http://front.zongziguwen.com/index_purchase.html";
            // },"5000")
        }
    }
</script>
<style scoped>
@charset "utf-8";html{background-color:#fff;color:#000;font-size:12px}
body,ul,ol,dl,dd,h1,h2,h3,h4,h5,h6,figure,form,fieldset,legend,input,textarea,button,p,blockquote,th,td,pre,xmp{margin:0;padding:0}
body,input,textarea,button,select,pre,xmp,tt,code,kbd,samp{line-height:1.5;font-family:tahoma,arial,"Hiragino Sans GB",simsun,sans-serif}
h1,h2,h3,h4,h5,h6,small,big,input,textarea,button,select{font-size:100%}
h1,h2,h3,h4,h5,h6{font-family:tahoma,arial,"Hiragino Sans GB","微软雅黑",simsun,sans-serif}
h1,h2,h3,h4,h5,h6,b,strong{font-weight:normal}
address,cite,dfn,em,i,optgroup,var{font-style:normal}
table{border-collapse:collapse;border-spacing:0;text-align:left}
caption,th{text-align:inherit}
ul,ol,menu{list-style:none}
fieldset,img{border:0}
img,object,input,textarea,button,select{vertical-align:middle}
article,aside,footer,header,section,nav,figure,figcaption,hgroup,details,menu{display:block}
audio,canvas,video{display:inline-block;*display:inline;*zoom:1}
blockquote:before,blockquote:after,q:before,q:after{content:"\0020"}
textarea{overflow:auto;resize:vertical}
input,textarea,button,select,a{outline:0 none;border: none;}
button::-moz-focus-inner,input::-moz-focus-inner{padding:0;border:0}
mark{background-color:transparent}
a,ins,s,u,del{text-decoration:none}
sup,sub{vertical-align:baseline}
html {overflow-x: hidden;height: 100%;font-size: 50px;-webkit-tap-highlight-color: transparent;}
body {font-family: Arial, "Microsoft Yahei", "Helvetica Neue", Helvetica, sans-serif;color: #333;font-size: .28em;line-height: 1;-webkit-text-size-adjust: none;}
hr {height: .02rem;margin: .1rem 0;border: medium none;border-top: .02rem solid #cacaca;}
a {color: #363636;text-decoration: none;}
.hade{
    display: none;

}
</style>
<style scoped>
.main{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: url("./../assets/images/addTeacherbg.jpg") no-repeat;
    background-size: 100% 100%;
    text-align: center;
}
.header img{
    margin-top: 15%;
    width: 22.5vw;
    height: 22.5vw;
}
.header p{
    margin-top: 4vw;
    font-size: 5vw;
    font-family:heiti;
}

.cont h2{
    margin: 6% 0 3.5vw 0;
    font-size: 5.5vw;
    font-weight: 600;
    font-family:heiti;
}
.contImg{
    margin: 0 auto;
    width: 37.5vw;
    height: 37.5vw;
    border: 0.5vw solid #449970;
    border-radius: 2.5vw;
    overflow: hidden;
}
.contImg img{
    width: 100%;
    height: 100%;
}

.footer{
    position: fixed;
    bottom: 15%;
    right: 0;
    left: 0;
    font-family:heiti;
}
.footer h3{
    font-size: 3.75vw;
    margin-bottom: 6.25vw
}
.footer p{
    line-height: 5.75vw;
}
</style>