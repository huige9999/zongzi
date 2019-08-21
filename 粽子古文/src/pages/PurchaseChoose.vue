<template>
  <div class="p-box">
    <div class="p-header">单人购买</div>
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
          <div class="pt-btn" v-text="selectItem"></div>
          <div class="pt-btnList" v-if="btnListShow">
            <div
              class="pt-btn"
              v-for="(item,index) of btnListData"
              :key="index"
              @click="btnListItemClick(item,index)"
            >{{item}}</div>
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
        <span class="price" style="margin-right:0.7rem">{{realPrice}}</span>
      </div>
      <div class="btnHeight"></div>
    </div>
    <div class="control-btn" @click="purchase()" style="top:4rem">确定</div>

    <div class="botTop" style="position:relative;top:31vw">
      <div>
        <p>关注粽子古文</p>
        <p>长按识别二维码</p>
      </div>
      <div style="margin-left:3vw">
        <img src="./../assets/images/footerimg.jpg" alt>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import wx from "weixin-js-sdk";
export default {
  name: "purchase-choose",
  data() {
    return {
      btnListShow: false,
      btnListData: ["L1 探花", "L2 榜眼", "L3 状元"],
      selectItem: 'L1 探花',
      courseIndex: '0',
      courseId: '',
      realPrice: ''

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
        wx.ready(function () {
          console.log("config信息验证完毕");
        });
        wx.error(function (res) {
          console.log("config配置出错");
        });
      });
  },
  mounted() {
    let that = this;
    axios
      .get(this.$store.state.baseUrlFront + "course/lastCourse", { params: { type: this.courseIndex } })
      .then(reses => {
        //查询实际需要付款的价格
        axios
          .get(this.$store.state.baseUrlFront + "money/findActualMoney", {
            params: {
              USER_ID: localStorage.getItem("USER_ID"),
              course_id:reses.data.data.course_id
            }
          })
          .then(res => {
            that.realPrice = res.data.data.actualMoney;
          });
      });

  },
  methods: {
    handleSanjiaoClick() {
      this.btnListShow = this.btnListShow === true ? false : true;
    },
    btnListItemClick(val, index) {
      this.btnListShow = this.btnListShow === true ? false : true;
      this.selectItem = val;
      this.courseIndex = index;
      let that = this;
          axios
      .get(this.$store.state.baseUrlFront + "course/lastCourse", { params: { type: this.courseIndex } })
      .then(reses => {
        //查询实际需要付款的价格
        axios
          .get(this.$store.state.baseUrlFront + "money/findActualMoney", {
            params: {
              USER_ID: localStorage.getItem("USER_ID"),
              course_id:reses.data.data.course_id
            }
          })
          .then(res => {
            that.realPrice = res.data.data.actualMoney;
          });
      });
    },
    purchase() {
      let that = this;
      //判断是否有即将开课的课程
      axios
        .get(this.$store.state.baseUrlFront + "course/lastCourse", { params: { type: this.courseIndex } })
        .then(reses => {
          console.log(reses);
          if (reses.data.data == undefined) {
            alert("最新一期的课程还没出来哦！");
          } else {
            that.courseId = reses.data.data.course_id;

            //发起支付请求
            axios
              .get(this.$store.state.baseUrlFront + "money/buyCourse.do", {
                params: {
                  USER_ID: localStorage.getItem("USER_ID"),
                  course_id: that.courseId,
                  totalfee: ""
                }
              })
              .then(res => {
                console.log(res);

                //调用微信支付JS
                //res.obj.appId res.obj.nonceStr  res.obj.timeStamp
                wx.chooseWXPay({
                  timestamp: res.data.obj.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  nonceStr: res.data.obj.nonceStr, // 支付签名随机串，不长于 32 位
                  package: res.data.obj.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                  signType: res.data.obj.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign: res.data.obj.paySign, // 支付签名
                  success: function (res) {
                    console.log(res);
                    alert("购买成功,去关注粽子古文准备开始学习吧!");
                    //this.$router.push({ name: "AddTeacher" });
                    //跳转首页
                    window.location.href = "http://front.zongziguwen.com/#/AddTeacher";
                  }
                });
              });

          }
        });










    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.p-box {
  width: 100vw;
  height: 100vh;
  background: #fff;
  .p-header {
    width: 100%;
    height: 165 / @rem;
    background: @btnColor;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 48 / @rem;
    font-weight: 600;
    color: #fff;
    font-family: heiti;
  }
  .pt-list {
    width: 100%;
    .pt-item {
      width: 100%;
      height: 94 / @rem;
      border-bottom: 2 / @rem solid #999;
      display: flex;
      align-items: center;
      color: #444444;
      .line {
        width: 4 / @rem;
        height: 34 / @rem;
        background: @btnColor;
        margin-left: 22 / @rem;
      }
      .pt-title {
        font-size: 30 / @rem;
        margin-left: 13 / @rem;
        margin-right: auto;
        font-family: heiti;
      }
      .black-text {
        font-size: 1.2rem;
        font-weight: bold;
        margin-right: 26 / @rem;
        color: #000;
      }

      .pt-btn {
        width: 160 / @rem;
        height: 56 / @rem;
        background: #62ce97;
        border-radius: 8 / @rem 0 0 8 / @rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 1rem;
        margin-right: 2 / @rem;
        font-weight: bold;
      }
      // 样式修改
      .pt-btnList {
        position: absolute;
        top: 56 / @rem;
      }
      .sanjiao {
        width: 58 / @rem;
        height: 56 / @rem;
        background: #62ce97;
        border-radius: 0 8 / @rem 8 / @rem 0;
        display: flex;
        justify-content: center;
        margin-right: 24 / @rem;
        div {
          width: 0;
          height: 0;
          margin-top: 19 / @rem;
          border-width: 18 / @rem;
          border-style: solid;
          border-color: #fff transparent transparent transparent;
        }
      }
      .price {
        font-size: 40 / @rem;
        color: #ea2038;
        font-weight: 600;
        margin-right: 6 / @rem;
      }
      .old-price {
        font-size: 24 / @rem;
        color: #666666;
        text-decoration: line-through;
        margin-right: 24 / @rem;
      }
      input {
        flex: 1;
        margin-left: 40 / @rem;
      }
      .yanzheng {
        width: 204 / @rem;
        height: 56 / @rem;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #62ce97;
        border: 2 / @rem solid #62ce97;
        border-radius: 6 / @rem;
        margin-right: 24 / @rem;
      }
    }
  }
  .notice-box {
    width: 94%;
    margin: 40 / @rem auto 0;
    font-size: 28 / @rem;
    line-height: 40 / @rem;
    .cannot-pay {
      margin-top: 60 / @rem;
      text-align: right;
    }
  }
}
.s-red {
  font-size: 26 / @rem;
  color: #ea2038;
  font-weight: 600;
}
.pt-btnGroup {
  position: relative;
  display: flex;
  align-items: center;
}
</style>
<style scoped>
.botTop {
  display: flex;
  justify-content: center;
  align-items: center;
}
.botTop p {
  margin-right: 0.3rem;
  font-family: "heiti";
  text-align: center;
  color: #45bb7f;
}
.botTop p:first-child {
  font-size: 4.975vw;
}
.botTop p:last-child {
  font-size: 3.5vw;
  line-height: 6.25vw;
}
.botTop img {
  width: 25vw;
  height: 25vw;
}
</style>