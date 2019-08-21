<template>
    <div class="rule">
        <div class="cont">
            <div class="top">
                <p>欢迎成为粽子古文推广大使！</p>
                <p>学好古文，就是这么简单！</p>
            </div>
            <div class="msg">
                <div class="msgCont">
                    <div class="item">
                        <h3>一、推广规则</h3>
                        <p>自己成功推荐一个学员（最终付费为准），可以获得推广费50元。</p>
                        <p>被邀请的朋友，首次购买课程，即可获得40元课程抵扣券。</p>
                    </div>
                    <div class="item">
                        <h3>二、页面说明</h3>
                        <p>分享“邀请朋友”页面，即可发送邀请给你的朋友。</p>
                        <p>已购买：显示成功购买学员数。</p>
                        <p>可提现金额：系统根据已购买人数自动统计的推广费总额。</p>
                        <p>提现：点击提现可以申请提取现金。</p>
                        <p>优惠券：40元 非会员首次购买课程抵扣券</p>
                    </div>
                    <div class="item">
                        <h3>三、注意事项：</h3>
                        <p>点击绑定：邀请页面发送以后，对方点击即绑定上下家关系。</p>
                        <p>推广费计算系统由程序自动实时统计，打开页面即可实时更新。</p>
                        <p>期间若有疑问，可以联系本公司客服微信（zongziguwen2）。</p>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: "Rule"
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.rule{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f0efee;
    .cont{
        width: 93%;
        height: 96%;
        margin: 25/@rem  auto;
        background-color: #fff;
        border-radius: 35/@rem; 
        overflow: hidden;
        .top{
            background: url('../assets/images/logoBg.png') no-repeat;
            background-position: 50% 28%;
            background-size: 450/@rem;
            padding-top: 250/@rem;
            p{
                text-align: center;
                color: #478e24;
                font-size: 34/@rem;
                line-height: 61/@rem;
            }
        }
        .msg{
            height: 70%;
            padding-top: 100/@rem; 
            font-size: 27/@rem;
            background: url("../assets/images/rule.png") no-repeat center center;
            background-size: 130% 109%;
           font-family: heiti;
            .msgCont{
                width: 100%;
                height: 82%;
                overflow: scroll;
                .item{
                    padding-top: 40/@rem;
                    width: 80%;
                    margin: 0 auto;
                    p{
                        margin-top: 13/@rem;
                        margin-left: 9%;
                        width: 88%;
                        text-align: justify;
                        line-height: 36/@rem;
                    }
                }
            }
            
        }
            
    }
}



</style>
