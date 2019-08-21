<template>
     <div class="main">
        <div class="cont">
            <div class="header">
                <img src="./../assets/images/img.png" alt="">
                <div class="userMsg">
                    <p>张哈哈</p>
                    <p>微信号：65352465</p>
                </div>
            </div>

            <div class="get">
                <h2>提现金额</h2>
                <div class="getInput">
                    <span>￥</span>
                    <input type="text" name="" id="">
                </div>
                <p class="hint">可提现金额￥<i>500</i>,<span>全部提现</span></p>
            </div>

            <div class="footer">
                <button class="confirm">提现</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "withdraw"
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
    left: 0;
    right: 0;
    padding: 6.125vw;
    background-color: #efeff5;
}
.cont{
    box-sizing: border-box;
    padding: 3.75vw 6.25vw 6.25vw 6.25vw;
    width: 100%;
    /* height: 5rem; */
    background-color: #ffffff;
}
.header{
    display: flex;
    /* justify-content: space-around; */
    align-items: center;
}
.header img{
    height: 14.625vw;
    width: 14.625vw;
    border: 0.125vw solid #eeeeee;
    border-radius: 10.625vw;
}
.userMsg{
    margin-left: 3.125vw; 
    color: #888888;
}
.userMsg p{
    font-size: 3.75vw;
    line-height: 4.5vw;
}
.get h2{
    margin-top: 7.75vw;
    font-size: 3.625vw;
    font-weight: 600;
}
.getInput{
    height: 13.75vw;
    line-height:15vw;
    border-bottom:0.125vw solid #eeeeee;
}
.getInput span{
    font-size: 6.25vw;
    vertical-align: middle;
}
.getInput input{
    height: 10vw;
    font-size: 5vw;
}
.hint{
    margin: 5.75vw 0;
    font-size: 3.125vw;
    color: #888888;
}
.hint span{
    margin-left: 2.5vw;
    font-size: 3.5vw;
    color: #586c96;
}
.footer{

}
.confirm{
    display: block;
    height: 11.25vw;
    width: 65.625vw;
    margin: 0 auto;
    background-color:#45bb7f; 
    color: #ffffff;
    font-size: 4.125vw;
    border-radius: 5.625vw;
    /* margin-bottom: .1rem; */
}
</style>