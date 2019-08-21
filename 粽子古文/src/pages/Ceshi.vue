 <template>
  <div class="m-box">
    <img class="i-bg" src="./../assets/images/beijing.jpg" alt="" />

    <div class="bottom-contain">

      <div class="control-btn" @click="bindWxLogin()">第三方登录</div>
    </div>
  </div>
</template>

<script>
  import AppHeader from "@/components/AppHeader"
  import axios from 'axios'

  export default {
    name: "ceshi",
    methods:{
      bindWxLogin(){
        window.location.href=this.$store.state.baseUrlFront+"qrCode/oauth_user2";
      }
    }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .artical{
    width: 94%;
    margin: 130/@rem auto;
    font-size: 40/@rem;
    line-height: 70/@rem;
    font-weight: 500;
    text-indent: 2em;
    span{
      &.active{
        color: #3c851a;
      }
    }
  }

  .audio-box{
    width: 100%;
    margin-bottom: 180/@rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .audio-inner{
      width: 74%;
      display: flex;
      justify-content: space-around;
      .audio-item{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #333;
        font-size: 26/@rem;
        img{
          width: 104/@rem;
          height: 104/@rem;
          margin-top: 44/@rem;
        }
        .l-img{
          width: 140/@rem;
          height: 140/@rem;
          margin-top: 28/@rem;
        }
      }
    }
  }

  .music_box{
    margin: 50px auto;
    width: 422px;
  }
  .content{
    width: 402px;
    height: 200px;
    overflow: hidden;
    padding: 10px;
    background: #ccc;
  }
  #lrc_list{
    margin: 10px auto;
    background: #ccc;
  }
  #lrc_list li{
    font: normal 14px/2.1 'microsoft yahei';
    text-align: center;
  }
  #lrc_list li.hover{
    color: red;
    font-weight: bold;
    font-size: 18px ;
    transition: 0.6s ;
  }

</style>
