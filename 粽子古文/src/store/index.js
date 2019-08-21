import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  // strict:true,
  state: {
    name: '',
    USER_ID:'',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHQiOjE1MzU0NDAzNTMyOTksInVpZCI6IjVkYzM3MzhkOGE5MTQxNDRiODE1MDlkNDY0ZmU2NjE1IiwiaWF0IjoxNTM0ODM1NTUzMjk5fQ.jzrTHhe2wtu4-izD9q12etwt7YpRasswf4q-Zq5vu4w',
   //课件
    ex_course: {},
    //习题
    ex_exercise:[],
    //测一测
    ex_test:[],
    //所有音频
    ex_guwen:[],
    // baseUrlFront: 'http://192.168.1.112:8085/guwen-emcee/',
    // imgUrlFront:'http://192.168.1.112:8080/guwen-admin/TP/',
    // soundUrlFront:'http://192.168.1.112:8080/guwen-admin/TS/',
    baseUrlFront: '',
    imgUrlFront:'',
    soundUrlFront:'',
    //当天听一听是否完成
    listenCompleted:false,
    //当天学一学是否完成
    learnCompleted: false,
    //当天做一做是否完成
    exerciseCompleted: false,
    //当天读一读是否完成
    readArticleCompleted: false,
    //当天赏一赏是否完成
    shangxiCompleted:false,
    //当天比一比是否完成
    compareCompleted:false,
    //连续答对题目数
    correctNum: 0,
    //连续答错题目数
    incorrectNum: 0,
    //正确答题数
    cNum:0,
    //错误答题数
    icNum:0,
    //是否是从查询以往学习课件的日历页面跳转过来的标识
    isPreRecord:'',
    //是否是从查询以往错题记录日历页面跳转过来的标识
    isPreMistake:'',
    //整篇文章
    whole:'',
    happyFlag:1,
    unHappyFlag:1,
    courseType:3,
    testid:""
  },

  mutations: {
    update_whole(state, p) {
      state.whole = p;
    },
    save_ex_course(state, payload) {
      state.ex_course = payload;
    },
    save_ex_exercise(state, payload) {
      state.ex_exercise = payload;
    },
    save_ex_test(state, payload) {
      state.ex_test = payload;
    },
    save_testid(state,p){
     state.testid = p;
    },
    save_ex_guwen(state, payload) {
      state.ex_guwen = payload;
    },
    updatet_token(state, p) {
      state.token = p;
    },
    update_USERID(state, p) {
      state.USER_ID = p;
    },
    update_listenCompleted(state, p) {
      state.listenCompleted = p;
    },
    update_learnCompleted(state, p) {
      state.learnCompleted = p;
    },
    update_readArticleCompleted(state,p){
      state.readArticleCompleted = p;
    },
    update_shangxiCompleted(state,p){
      state.shangxiCompleted = p;
    },
    update_correctNum(state, p) {
      state.correctNum = p;
      //连续答对一旦错了一道清0
        state.incorrectNum = 0;
    },
    update_incorrectNum(state, p) {
      state.incorrectNum = p;
      state.correctNum = 0; 
    },
    update_happyFlag(state, p) {
      state.happyFlag = p;
    },
    update_unHappyFlag(state, p) {
      state.unHappyFlag = p;
    },
    update_cNum(state, p) {
      state.cNum = p;
    },
    update_icNum(state, p) {
      state.icNum = p;
    },
    update_isPreRecord(state, p) {
      state.isPreRecord = p;
    },
    update_isPreMistake(state, p) {
      state.isPreMistake = p;
    },
    exerciseCompleted(state, p) {
      state.exerciseCompleted = p;
    },
    update_courseType(state, p) {
      state.courseType = p;
    },
    update_compareCompleted(state,p){
      state.compareCompleted = p;
    }
  }
})
