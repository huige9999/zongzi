<template>
  <div class="m-box">
    <div class="e-header">
      <img class="e-pho" :src="headImgUrl">
    </div>
    <div class="e-item">
      <span class="classify">姓名</span>
      <span>{{nickname}}</span>
    </div>
    <div class="e-item">
      <span class="classify">级别</span>
      <span>{{type}}</span>
    </div>
    <div class="e-item">
        <span class="classify">学习</span><span>{{learnDay}}天</span>
    </div>
    <div class="e-item">
      <span class="classify">分享</span>
      <span>{{shareNum}}次</span>
    </div>
    <div class="e-item">
      <span class="classify">账户</span>
      <span>{{redpackNum}}元</span>
    </div>
     <!-- <div class="e-item">
        <span class="classify">邀请</span><span>{{inviteNum}}人</span>
    </div> -->
    <div class="e-item" v-if="isTest">
      <span class="classify">绑定</span>
      <div class="bindBtn" @click="goRelationShip">绑定子账号</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "edit-mine",
  data() {
    return {
      headImgUrl: '',
      type: '',
      nickname: '',
      learnDay: 0,
      shareNum: 0,
      redpackNum: 0,
      isTest: false
    }
  },
  mounted() {
    // let USERIDS = localStorage.getItem("USER_ID");
    // if (USERIDS == '195ebfd95a4141b3b96747439d4fe2c9' || USERIDS == 'eed50d876cd84a198e04df2532c7a5a2' || USERIDS == '340588da9eeb421a87c4015db3b0d0a2') {
    //   this.isTest = true;
    // }
    axios.get(this.$store.state.baseUrlFront + "wxinfo/checkSon", { params: { USER_ID: localStorage.getItem("USER_ID") } }).then(res => {
      console.log(res)
      if (res.data && res.data.data && res.data.data.is_son == '0') {
        //不是子账号
        this.isTest = true;
      } else {
        this.isTest = false;
      }
    }).catch(err => {
      console.log(err);
      // if (USERIDS == '195ebfd95a4141b3b96747439d4fe2c9' || USERIDS == 'eed50d876cd84a198e04df2532c7a5a2' || USERIDS == '340588da9eeb421a87c4015db3b0d0a2') {
      //   this.isTest = true;
      // }
    })
    axios
      .get(this.$store.state.baseUrlFront + "wxinfo/findUserInfo", {
        params: { USER_ID: localStorage.getItem("USER_ID") }
      })
      .then(res => {
        // console.log(res);
        this.headImgUrl = res.data.data.headimgurl;
        this.nickname = res.data.data.nickname;
        if (res.data.data.type == "0") {
          this.type = "L1 探花";
        } else if (res.data.data.type == "1") {
          this.type = "L2 榜眼";
        } else {
          this.type = "L3 状元";
        }
      });
    //获取个人信息
    axios.get(
      this.$store.state.baseUrlFront + 'qrCode/getPersonalInfo',
      {
        params: {
          USER_ID: localStorage.getItem("USER_ID")
        }
      }).then((res) => {
        if (res.status == 200) {
          this.learnDay = res.data.data.days;
          if (!(res.data.data.redpack == undefined)) {
            this.redpackNum = res.data.data.redpack;
            //this.inviteNum = res.data.data.inviter_num;
          }
          //  this.learnDay = parseInt(res.data.data.days)+1;
        }
      })

    //获取朋友圈分享次数
    //获取个人信息
    axios.get(
      this.$store.state.baseUrlFront + 'wxinfo/shareShow',
      {
        params: {
          USER_ID: localStorage.getItem("USER_ID")
        }
      }).then((res) => {
        if (res.status == 200) {
          console.log(res);
          this.shareNum = res.data.data.share_times;
        }
      })

  },
  methods: {
    goRelationShip() {
      this.$router.push({ name: "RelationShip" });
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.e-header {
  width: 100%;
  height: 220 / @rem;
  background: #eff2db;
  margin-bottom: 20 / @rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .e-pho {
    width: 136 / @rem;
    height: 136 / @rem;
    border-radius: 100%;
    border: 2 / @rem solid #9e9e9e;
  }
}

.e-item {
  width: 94%;
  height: 106 / @rem;
  margin: 0 auto;
  border-bottom: 2 / @rem solid #45bb7f;
  display: flex;
  align-items: center;
  font-size: 32 / @rem;
  font-family: heiti;
  .classify {
    letter-spacing: 8 / @rem;
    margin-right: 4.8rem;
    margin-left: 1rem;
  }
  .bindBtn {
    width: 100px;
    height: 34px;
    border-radius: 24px;
    background-color: #45bb7f;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 14px;
    margin-left: -34px;
  }
}

.control-btn {
  margin: 124 / @rem auto;
}
</style>
