<template>
    <div class="m-box">
      <div class="m-inner">
        <app-header :c_time="completed" :f_time="total">
          <p slot="title" class="ph-title">测一测</p>
        </app-header>
        <div class="m-contain">
          <p class="m-title">我的错题</p>
          <p class="m-question" v-html="calcContent"></p>
        </div>
      </div>
      <div class="bottom-contain">
        <div class="answer-box">
          <div class="answer-item"
               :class="judgeClass(item)"
               v-for="item,index in options" :key="index"
               @click="choose(item)"
              >
            {{item.content}}
            <img v-if="item.answer==1&&item.show" src="./../assets/images/success.png" alt="">
            <img v-if="item.answer==0&&item.show" src="./../assets/images/error.png" alt="">
          </div>
        </div>
        <div class="control-btn" @click="nextQuesTion()">{{found?'下一题':'请选择'}}</div>
      </div>
    </div>
</template>

<script>
    import AppHeader from "@/components/AppHeader"
    import axios from 'axios'

    export default {
      components: {AppHeader},
      name: "my-mistakes",
      data(){
        return {
          found:false ,
          chooseTimes:0,
          completed:1,
          total:10,
          quesTions:[],
          options:[],
          content:'',
          keyword:'',
          type:''
        }
      },
      mounted(){
        // axios.get(
        //   'http://192.168.1.135:8090/haidong-emcee/exercise/buyedExercise',
        //   {
        //     params:{USER_ID:'5dc3738d8a914144b81509d464fe6615'}
        //   }).then((res)=>{
        //     if(res.status==200){
        //       console.log(res) ;
        //       this.quesTions = res.data.data.exerciseList ;
        //       this.total = this.quesTions.length ;
        //       this.updateContent() ;
        //     }
        // })
      },
      computed:{
        calcContent(){
          let html = '' ;
          if(this.keyword){
            html = this.content.split(this.keyword).join(`<span class="key-text">${this.keyword}</span>`) ;
          }else {
            html = this.content
          }
          return this.completed+'、'+html
        }
      },
      methods:{
        updateContent(){
          let keyword = this.quesTions[this.completed-1].keyword ;
          this.found = false ;
          this.chooseTimes = 0 ;
          this.options = this.quesTions[this.completed-1].chosen ;
          this.content = this.quesTions[this.completed-1].content ;
          this.type = this.quesTions[this.completed-1].type ;
          if(keyword) this.keyword = keyword ;
        },
        choose(item){
          this.chooseTimes += 1 ;
          if(item.answer == 1){
            this.found = true
          }
          if(this.chooseTimes==2) {
            this.options.find(item => {
              return item.answer == 1
            }).show = true;
            item.show = true ;
            this.found = true ;
          }
          if(this.chooseTimes<2){
            item.show = true ;
          }
        },
        judgeClass(item){
          let _class = '' ;
          if(item.answer==1&&item.show){
            _class = 'success'
          }else if(item.show){
            _class =  'error'
          }else {
            _class =  ''
          }
          if(this.type=='选择题'){
            _class += ' column'
          }
          return _class
        },
        nextQuesTion(){
          if(this.found&&this.completed<this.quesTions.length){
              ++this.completed ;
              this.updateContent() ;
          }
        }
      }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

      .m-contain{
        width: 100vw;
        margin-top: 86/@rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        .m-title{
          font-size: 53/@rem;
          font-weight: 500;
        }
        .m-question{
          width: 94%;
          margin-top: 64/@rem;
          font-size: 36/@rem ;
          line-height: 56/@rem;
          font-weight: 500;
        }
      }
      .answer-box{
        width: 100%;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        margin-bottom: 124/@rem;
        .answer-item{
          width: 304/@rem;
          height: 90/@rem;
          position: relative;
          box-sizing: border-box;
          border-radius: 12/@rem;
          background: #fff;
          font-size: 32/@rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 40/@rem;
          box-shadow: 5/@rem 5/@rem 5/@rem #bbb;
          &.success{
            background: #c7ffaf;
            border: 2/@rem solid #85ff4f;
          }
          &.error{
            background: #ffc7c8;
            border: 2/@rem solid #ff5357;
          }
          img {
            width: 34/@rem;
            height: 34/@rem;
            position: absolute;
            right: 14/@rem;
            top: 28/@rem;
          }
        }
        .column{
          width: 622/@rem;
          height: 90/@rem;
        }
      }




</style>
