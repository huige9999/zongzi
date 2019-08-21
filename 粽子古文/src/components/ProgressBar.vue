<template>
  <div class="pro-header">
    <slot name="titles"></slot>
    <div id="alls" class="ph-box">
      <div id="curs" class="complete"></div>
      <div class="uncomplete"></div>
    </div>
   <!-- <img class="laba" src="./../assets/images/laba.png" alt="" /> -->
    <div class="zheng" @click="show_tc()" v-if="isShowZ=='true'">正</div>
    <div  v-if="isShowL=='true'" style="margin-left:0.87rem"><img src="./../assets/images/laba.png" style="width:6vw"></div>
    <div class="mask" v-if="tc_off">
      <div class="tc-box">
        <div class="artical-box">
          <!-- <p v-for="item,index in articalList">{{item.seg_content}}</p> -->
          <p>{{articalStr}}</p>
        </div>
        <img @click="close_tc()" class="exit" src="./../assets/images/exit.png" />
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from "axios"
    export default {
      name: "progess-bar",
      props:['c_times','f_times','isShowZ','isShowL'],
      data(){
        return{
          tc_off:false,
          articalStr:""
        }
      },
      updated(){
      //  let totalWidth =  document.getElementById('all').offsetWidth;
      //  let widths = (this.c_time/this.f_time)*parseInt(totalWidth) ;
      //  document.getElementById('cur').style.width = widths+"/@rem";
      //  console.log(document.getElementById('cur').style.width);
       let totalWidth =  $('#alls').css('width') ;
       let width = (this.c_times/this.f_times)*parseInt(totalWidth) ;
        $('#curs').css('width',width) ;
      },
      methods:{
        show_tc(){
      axios
      .get("http://192.168.1.139:8080/haidong-emcee/course/courseBuyed", {
        params: { USER_ID: "5dc3738d8a914144b81509d464fe6615" }
      })
      .then(res => {
        if (res.status == 200) {
          console.log(res);
         //获取课件id res.dat.data.couseware.courseware_id
          //发送请求获取正文
            axios.get(
          'http://192.168.1.139:8080/haidong-emcee/courseware/whole',
          {
            params:{courseware_id:res.data.data.courseware.courseware_id}
          }).then((reses)=>{
            if(reses.status==200){
              console.log(reses) ;
              this.articalStr = reses.data.data.whole;
            }
        })
        }
      });
        //   if(!(ids=="" || ids==undefined)){
        //   //发送请求获取正文
        //     axios.get(
        //   'http://192.168.1.139:8080/haidong-emcee/courseware/whole',
        //   {
        //     params:{id:ids}
        //   }).then((res)=>{
        //     if(res.status==200){
        //       console.log(res) ;
        //     }
        // })
        //   }
          this.tc_off = true ;
        },
        close_tc(){
          this.tc_off = false ;
        }
      }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;
  .pro-header{
    height: 40/@rem;
    width: 100vw;
    margin-top: 36/@rem;
    display: flex;
    align-items: center;
    padding-top: 22/@rem;
    .ph-title{
      font-size: 40/@rem;
      font-weight: 600;
      margin: 0 30/@rem 0  ;
    }
    .ph-box{
      width: 444/@rem;
      height: 18/@rem;
      border: 4/@rem solid #fff;
      border-radius: 18/@rem;
      display: flex;
      .complete{
        width: 1/@rem;
        border-radius: 18/@rem;
        background: #b0ef94;
      }
      .uncomplete{
        flex:1 ;
        background:#edffe5 ;
      }
    }
    .laba{
      height: 100%;
      width: 38/@rem;
      margin-left: 34/@rem;
    }
    .zheng{
      width: 72/@rem;
      height: 72/@rem;
      background: #fff;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #28915c;
      font-size: 30/@rem;
      margin-left: 26/@rem;
    }
  }

  .mask{
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.3);
    .postion(0,0,22) ;
  }
  .tc-box{
    width: 700/@rem;
    height: 82%;
    background: #fff;
    border-radius: 18/@rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .postion(28,46,122) ;
    .artical-box{
      width: 604/@rem;
      margin-top: 90/@rem;
      p{
        font-size: 34/@rem;
        letter-spacing: 2/@rem;
        line-height: 62/@rem;
        text-indent: 2em;
      }
    }
    .exit{
      width: 56/@rem;
      height: 56/@rem;
      position: absolute;
      left: 320/@rem;
      bottom: 52/@rem;
    }
  }

</style>
