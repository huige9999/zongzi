<template>
  <div class="m-box">
    <div class="m-inner">
      <app-header :c_time="completed" :f_time="total" isShowZ="true">
        <p slot="title" class="ph-title">做一做</p>
      </app-header>
      <my-mask ref="mymask">
        <div class="exit" @click="handleClick"></div>
      </my-mask>
      <audio id="rightanswer" src="rightanswer.wav" style="display:none"></audio>
      <audio id="wronganswer" src="wronganswer.wav?222" style="display:none"></audio>
      <audio id="endanswer" src="endanswer.wav" style="display:none"></audio>
      <div class="m-contain">
        <!-- <p class="m-title">我的错题</p> -->
        <!--题目-->
        <p class="m-question" v-html="calcContent"></p>
      </div>
    </div>
    <div class="bottom-contain">
      <div class="answer-box">
        <!--选项-->
        <div
          v-if="!(item.content=='')"
          class="answer-item"
          :class="judgeClass(item)"
          v-for="item,index in options"
          :key="index"
          @click="choose(item)"
        >
          {{item.content}}
          <img
            v-if="item.answer==1&&item.show"
            src="./../assets/images/success.png"
            alt
          />
          <img v-if="item.answer==0&&item.show" src="./../assets/images/error.png" alt />
        </div>
      </div>
      <!-- <div class="control-btn" @click="nextQuesTion()">{{found?'下一题':'请选择'}}</div>-->
    </div>
    <div class="tipContainer" v-if="showHappy==1" @click="changeHappy">
      <img src="./../assets/images/toppraise.png" class="toppraiseImg" style="width:64vw" />
      <div class="happyImg"></div>
    </div>
    <div class="tipContainer" v-if="showUnHappy==1" @click="changeUnHappy">
      <img src="./../assets/images/topcriticize.png" class="topcriticize" style="width:60vw" />
      <div class="unhappyImg"></div>
    </div>
    <ul class="couten" v-if="showFlower==1" style="list-style: none;"></ul>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import MyMask from '@/components/MyMask';
import axios from "axios";
import qs from "qs";
import $ from "jquery";
export default {
  components: { AppHeader, MyMask },
  name: "exercise",
  data() {
    return {
      //是否找到正确答案(可以进入下一题的判断标识)
      found: false,
      //每一题选择次数
      chooseTimes: 0,
      //完成的题目数
      completed: 1,
      //题目总数
      total: 10,
      //题目列表
      quesTions: [],
      //选项列表
      options: [],
      //每一题的题目内容
      content: "",
      //题目中的关键字
      keyword: "",
      //题目类型
      type: "",
      //做题结果保存
      resultList: [],
      //题目id
      exerciseId: "",
      //题目答案
      answer: "",
      showHappy: 0,
      showUnHappy: 0,
      isGoMyMis: false,
      showFlower: 0,
      keyword_num: "",
      modules: "",
      //题目注释
      explains: ""
    };
  },
  mounted() {
    if (localStorage.getItem("cram") == "yes") {
      axios
        .post(
          this.$store.state.baseUrlFront + "module/saveModule",
          qs.stringify({
            USER_ID: localStorage.getItem("USER_ID"),
            date: localStorage.getItem("learnDate"),
            module: "tx",
            activemodule: "xz"
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          console.log(res);
        });
      //初始化modules
      this.getExerciseState();
    } else {
      if (!(localStorage.getItem("isVip") == undefined) && localStorage.getItem("learnDate") == undefined) {
        localStorage.setItem("exerciseCompleted-now", "yes");
        axios
          .post(
            this.$store.state.baseUrlFront + "module/saveModule",
            qs.stringify({
              USER_ID: localStorage.getItem("USER_ID"),
              date: localStorage.getItem("currentDate"),
              module: "tx",
              activemodule: "xz"
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          )
          .then(res => {
            console.log(res);
          });
      }
    }
    //如果是非会员
    if (localStorage.getItem("isVip") == undefined) {
      let type = localStorage.getItem("courseType");
      localStorage.setItem("exerciseCompleted-now" + type, "yes");
    }
    this.quesTions = this.$store.state.ex_exercise;
    this.total = this.quesTions.length;
    this.updateContent();
  },
  computed: {
    //返回题目
    calcContent() {
      let html = "";
      let newHtml = "";
      if (this.content.split("；").length >= 2) {
        if (this.keyword) {
          if (this.keyword_num || this.keyword_num === 0) {
            let count = 0;
            let tmpArray = new Array();
            let nums = parseInt(this.keyword_num);
            html = this.content.split("；")[1];
            if (html.indexOf(this.keyword) > -1) {
              //关键字在分号右边
              for (let i = 0; i < html.length; i++) {
                tmpArray.push(html.charAt(i));
              }
              for (let j = 0; j < html.length; j++) {
                if (tmpArray[j] == this.keyword) {
                  count++;
                  if (count - 1 == nums) {
                    tmpArray[j] = `<span class="key-text">${this.keyword}</span>`;
                    break;
                  }
                }
              }
              html = tmpArray.join("");
              newHtml = this.content.split("；")[0] + "<br/>" + html;
            } else {
              //关键字在分号左边
              html = this.content.split("；")[0];
              for (let i = 0; i < html.length; i++) {
                tmpArray.push(html.charAt(i));
              }
              for (let j = 0; j < html.length; j++) {
                if (tmpArray[j] == this.keyword) {
                  count++;
                  if (count - 1 == nums) {
                    tmpArray[j] = `<span class="key-text">${this.keyword}</span>`;
                    break;
                  }
                }
              }
              html = tmpArray.join("");
              newHtml = html + "<br/>" + this.content.split("；")[1];
            }

            return newHtml;

          } else {
            if (this.content.split("；")[1].indexOf(this.keyword) > -1) {
              //关键字在分号右边
              html = this.content
                .split("；")[1]
                .split(this.keyword)
                .join(`<span class="key-text">${this.keyword}</span>`);
              newHtml = this.content.split("；")[0] + "<br/>" + html;
            } else {
              //关键字在分号左边
              html = this.content.split("；")[0].split(this.keyword).join(`<span class="key-text">${this.keyword}</span>`);
              newHtml = html + "<br/>" + this.content.split("；")[1]
            }

            return newHtml;
          }

        } else {
          html = this.content
            .split("；")[1];
          newHtml = this.content.split("；")[0] + "<br/>" + html;
          return newHtml;
        }
      } else {
        if (this.keyword) {
          if (this.keyword_num || this.keyword_num === 0) {
            let count = 0;
            let tmpArray = new Array();
            let nums = parseInt(this.keyword_num);
            html = this.content;
            for (let i = 0; i < html.length; i++) {
              tmpArray.push(html.charAt(i + 1));
            }
            for (let j = 0; j < html.length; j++) {
              if (tmpArray[j] == this.keyword) {
                count++;
                if (count - 1 == nums) {
                  tmpArray[j] = `<span class="key-text">${this.keyword}</span>`;
                  break;
                }
              }
            }
            html = tmpArray.join("");
            return html;

          } else {
            html = this.content
              .split(this.keyword)
              .join(`<span class="key-text">${this.keyword}</span>`);
            return html;
          }

        } else {
          html = this.content;
          return html;
        }
      }
    }
  },
  methods: {
    handleClick() {
      let that = this;
      this.$refs.mymask.close_tc();
      if (this.completed < this.quesTions.length) {
        setTimeout(function () {
          ++that.completed;
          that.updateContent();
        }, 1000);
      } else {
        this.saveExercise();
      }

    },
    updateContent() {
      let keyword = this.quesTions[this.completed - 1].keyword;
      this.found = false;
      this.chooseTimes = 0;
      this.options = this.quesTions[this.completed - 1].chosen;
      this.content = this.quesTions[this.completed - 1].content;
      this.type = this.quesTions[this.completed - 1].type;
      this.answer = this.quesTions[this.completed - 1].answer;
      this.explains = this.quesTions[this.completed - 1].explains || '';
      //保存当前页的题目id
      this.exerciseId = this.quesTions[this.completed - 1].exercise_id;
      if (keyword) this.keyword = keyword;
      if (!(this.quesTions[this.completed - 1].keyword_num == undefined)) {
        this.keyword_num = this.quesTions[this.completed - 1].keyword_num;
      } else {
        this.keyword_num = "";
      }
      //判断连续答对题目数和连续答错题目数
      // if (this.$store.state.cNum >= 6 && this.$store.state.happyFlag == 1) {
      //   this.$store.commit("update_happyFlag", 0);
      //   this.showHappy = 1;
      //   let that = this;
      //   setTimeout(function () {
      //     that.showHappy = 0;
      //   }, 3000);
      // }
      // if (
      //   this.$store.state.icNum >= 6 &&
      //   this.$store.state.unHappyFlag == 1
      // ) {
      //   this.$store.commit("update_unHappyFlag", 0);
      //   this.showUnHappy = 1;
      //   let that = this;
      //   setTimeout(function () {
      //     that.showUnHappy = 0;
      //   }, 3000);
      // }
    },
    choose(item) {
      let rightanswerdom = document.getElementById("rightanswer");
      let wronganswerdom = document.getElementById("wronganswer");
      rightanswerdom.load();
      wronganswerdom.load();
      this.chooseTimes += 1;
      let that = this;
      //保存用户第一次选的答案(exercise_id和is_true))
      // if (this.chooseTimes == 1) {
      //   //数组里保存对象
      //   this.resultList.push({
      //     exercise_id: this.exerciseId,
      //     is_true: this.found ? 0 : 1
      //   });
      // }
      if (item.answer == 1 && this.chooseTimes == 1) {
        this.found = true;
        this.resultList.push({
          exercise_id: this.exerciseId,
          is_true: 0
        });
        //播放正确音频
        rightanswerdom.play();
        //记录一下一次就答对的题目数
        this.$store.commit("update_correctNum", ++this.$store.state.correctNum);
        //记录一下答对的题目数(非连续))
        this.$store.commit("update_cNum", ++this.$store.state.cNum);
        //是否有注释
        if (this.explains) {
          setTimeout(() => {
            this.$refs.mymask.show_tc(this.explains);
          }, 1000)
        } else {
          //进入下一题
          if (this.completed < this.quesTions.length) {
            setTimeout(function () {
              ++that.completed;
              that.updateContent();
            }, 1000);
          } else {
            this.saveExercise();
          }
        }
      }
      if (this.chooseTimes == 1 && item.answer != 1) {
        wronganswerdom.load();
        //播放正确音频
        wronganswerdom.play();
        this.resultList.push({
          exercise_id: this.exerciseId,
          is_true: 1
        });
        //记录一下答错的题目数
        this.$store.commit(
          "update_incorrectNum",
          ++this.$store.state.incorrectNum
        );
        //记录一下答错的题目数(非连续))
        this.$store.commit("update_icNum", ++this.$store.state.icNum);
        this.isGoMyMis = true;
        // console.log("2:" + this.$store.state.icNum);
      }
      if (this.chooseTimes >= 2) {
        //找到题目中的正确选项
        // this.options.find(item => {
        //   return item.answer == 1;
        // }).show = true;
        // item.show = true;
        // this.found = true;

        //如果找到了正确答案进入下一题
        if (item.answer == 1) {
          this.found = true;
          //播放正确音频
          rightanswerdom.play();
          if (this.explains) {
            setTimeout(() => {
              this.$refs.mymask.show_tc(this.explains);
            }, 1000)
          } else {
            //进入下一题
            if (this.completed < this.quesTions.length) {
              setTimeout(function () {
                ++that.completed;
                that.updateContent();
              }, 1000);
            } else {
              this.saveExercise();
            }
          }
          // this.$refs.mymask.show_tc();
          //进入下一题
          // if (this.completed < this.quesTions.length) {
          //   setTimeout(function () {
          //     ++that.completed;
          //     that.updateContent();
          //   }, 1000);
          // } else {
          //   this.saveExercise();
          // }
        } else {
          //播放选错音频
          wronganswerdom.play();
        }
      }
      item.show = true;
    },
    judgeClass(item) {
      let _class = "";
      if (item.answer == 1 && item.show) {
        _class = "success";
      } else if (item.show) {
        _class = "error";
      } else {
        _class = "";
      }
      if (this.type == "句子翻译题") {
        _class += " column";
      }
      return _class;
    },
    saveExercise() {
      let that = this;
      let dates = localStorage.getItem("learnDate") == undefined ? localStorage.getItem("currentDate") : localStorage.getItem("learnDate");
      let endanswerdom = document.getElementById("endanswer");
      if (localStorage.getItem("cram") == "yes") {

        if (that.isGoMyMis == true) {

          //从日历界面进入的情况
          axios
            .post(
              that.$store.state.baseUrlFront + "module/saveModule",
              qs.stringify({
                USER_ID: localStorage.getItem("USER_ID"),
                date: localStorage.getItem("learnDate"),
                module: "tx",
                activemodule: "xz"
              }),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }
            )
            .then(res => {
              console.log(res);
              //更新下modules状态
              this.getExerciseState();

              axios
                .post(
                  this.$store.state.baseUrlFront + "exercise/saveExercise",
                  qs.stringify({
                    USER_ID: localStorage.getItem("USER_ID"),
                    exerciseList: JSON.stringify(this.resultList),
                    date: dates
                  }),
                  {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    }
                  }
                )
                .then(res => {
                  console.log(res);
                  setTimeout(function () {
                    //进入我的错题
                    //that.$router.push({ name: "ExerciseForUs" });
                    that.$router.replace("ExerciseForUs");
                  }, 1000);
                });
            });



        } else {
          //播放答题结束音频
          endanswerdom.play();
          this.fallFlower();
          axios
            .post(
              that.$store.state.baseUrlFront + "module/saveModule",
              qs.stringify({
                USER_ID: localStorage.getItem("USER_ID"),
                date: localStorage.getItem("learnDate"),
                module: "txz",
                activemodule: "xz"
              }),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }
            )
            .then(res => {
              console.log(res);
              //更新下modules状态
              this.getExerciseState();
              axios
                .post(
                  this.$store.state.baseUrlFront + "exercise/saveExercise",
                  qs.stringify({
                    USER_ID: localStorage.getItem("USER_ID"),
                    exerciseList: JSON.stringify(this.resultList),
                    date: dates
                  }),
                  {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    }
                  }
                )
                .then(res => {
                  console.log(res);
                });
            });


          setTimeout(function () {
            //进入读一读
            // that.$router.push({ name: "ReadArticle" });
            that.$router.replace("ReadArticle");
          }, 8000);
        }

      } else {



        if (that.isGoMyMis == true) {
          //如果是体验课程的话不要调用此接口
          if (localStorage.getItem("isVip") == undefined) {
            axios
              .post(
                this.$store.state.baseUrlFront + "exercise/saveTyExercise",
                qs.stringify({
                  USER_ID: localStorage.getItem("USER_ID"),
                  course_id: localStorage.getItem("course_id"),
                  exerciseList: JSON.stringify(this.resultList),
                  date: dates
                }),
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                }
              )
              .then(res => {
                console.log(res);
                setTimeout(function () {
                  //进入我的错题
                  //that.$router.push({ name: "ExerciseForUs" });
                  that.$router.replace("ExerciseForUs");
                }, 1000);
              });
          } else if (!(localStorage.getItem("learnDate") == undefined)) {
            //从日历界面进入的情况
            localStorage.setItem("exerciseCompleted", "yes");
            //播放答题结束音频
            endanswerdom.play();
            this.fallFlower();
            setTimeout(function () {
              //进入我的错题
              //that.$router.push({ name: "ReadArticle" });
              that.$router.replace("ReadArticle");
            }, 8000);
          } else {
            axios
              .post(
                this.$store.state.baseUrlFront + "exercise/saveExercise",
                qs.stringify({
                  USER_ID: localStorage.getItem("USER_ID"),
                  exerciseList: JSON.stringify(this.resultList),
                  date: dates
                }),
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                }
              )
              .then(res => {
                console.log(res);
                setTimeout(function () {
                  //进入我的错题
                  //that.$router.push({ name: "ExerciseForUs" });
                  that.$router.replace("ExerciseForUs");
                }, 1000);
              });
          }
        } else {
          //播放答题结束音频
          endanswerdom.play();
          this.fallFlower();
          //如果是非会员
          if (localStorage.getItem("isVip") == undefined) {
            let type = localStorage.getItem("courseType");
            localStorage.setItem("exerciseCompleted" + type, "yes");
          } else {
            localStorage.setItem("exerciseCompleted", "yes");
            axios
              .post(
                that.$store.state.baseUrlFront + "module/saveModule",
                qs.stringify({
                  USER_ID: localStorage.getItem("USER_ID"),
                  date: localStorage.getItem("currentDate"),
                  module: "txz",
                  activemodule: "xz"
                }),
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                }
              )
              .then(res => {
                console.log(res);
              }).catch(err => {
                console.log(err);
              })
          }
          //保存习题

          //如果是体验课程的话不要调用此接口（判断依据是否有USER_ID）
          if (
            localStorage.getItem("isVip") == undefined ||
            localStorage.getItem("isVip") == ""
          ) {
            axios
              .post(
                this.$store.state.baseUrlFront + "exercise/saveTyExercise",
                qs.stringify({
                  USER_ID: localStorage.getItem("USER_ID"),
                  course_id: localStorage.getItem("course_id"),
                  exerciseList: JSON.stringify(this.resultList),
                  date: dates
                }),
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                }
              )
              .then(res => {
                console.log(res);
              });
          } else {
            axios
              .post(
                this.$store.state.baseUrlFront + "exercise/saveExercise",
                qs.stringify({
                  USER_ID: localStorage.getItem("USER_ID"),
                  exerciseList: JSON.stringify(this.resultList),
                  date: dates
                }),
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                }
              )
              .then(res => {
                console.log(res);
              });
          }
          setTimeout(function () {
            //进入读一读
            // that.$router.push({ name: "ReadArticle" });
            that.$router.replace("ReadArticle");
          }, 8000);
        }




      }

    },
    getExerciseState() {

      axios
        .get(this.$store.state.baseUrlFront + "module/getModule", {
          params: {
            USER_ID: localStorage.getItem("USER_ID"),
            date: localStorage.getItem("learnDate")
          }
        })
        .then(res => {
          console.log(res);
          this.modules = res.data.data.module;
        });

    },
    changeHappy() {
      if (this.showHappy == 1) {
        this.showHappy = 0;
      } else {
        this.showHappy = 1;
      }
    },
    changeUnHappy() {
      if (this.showUnHappy == 1) {
        this.showUnHappy = 0;
      } else {
        this.showUnHappy = 1;
      }
    },
    fallFlower() {
      let that = this;
      this.showFlower = 1;
      var num = 0;
      //var win = (parseInt($(".couten").css("width"))) - 60;
      $(".couten").css("height", $(document).height());
      $("li").css({});
      var timer;
      setTimeout(function () {
        clearTimeout(timer);
      }, 3000);
      setTimeout(function () {
        $(".counten").html("");
        that.showFlower = 0;
      }, 10000);

      var add = function () {
        var hb = parseInt(Math.random() * (5 - 1) + 1);
        var Wh = parseInt(Math.random() * (70 - 30) + 20);
        var Left = parseInt(Math.random() * (405 - 0) + 0);
        var rot = parseInt(Math.random() * (45 - -45) - 45) + "deg";
        num++;
        $(".couten").append(
          "<li class='li" +
          num +
          "'  style='position:absolute;animation:all 3s linear;top:-100px;left:" +
          Left +
          "px'><a href='javascript:;' style='display:block'><img src='flower" +
          hb +
          ".png' style='width:" +
          Wh +
          "px;transform:rotate(" +
          rot +
          ")'></a></li>"
        );
        $(".li" + num).animate(
          { top: $(window).height() + 20, left: Left },
          5000,
          function () {
            //删掉已经显示的红包
            //this.remove()
          }
        );
        timer = setTimeout(add, 100);
      };
      //增加红包
      var num = 0;
      //setTimeout(add, 400);
      add();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/public.less";

.m-contain {
  width: 100vw;
  margin-top: 86 / @rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 1.2rem;
  .m-title {
    font-size: 53 / @rem;
    font-weight: 500;
  }
  .m-question {
    width: 82%;
    margin-top: 64 / @rem;
    font-size: 1.3333333rem;
    line-height: 56 / @rem;
    font-weight: bold;
    font-family: heiti;
    padding-right: 2rem;
    letter-spacing: 0.1rem;
  }
}
@media screen and (min-width: 768px) {
  .m-contain {
    width: 100vw;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 1.2rem;
    .m-title {
      font-size: 53 / @rem;
      font-weight: 500;
    }
    .m-question {
      width: 82%;
      margin-top: 64 / @rem;
      font-size: 1.3333333rem;
      line-height: 56 / @rem;
      font-weight: bold;
      font-family: heiti;
      padding-right: 2rem;
      letter-spacing: 0.1rem;
    }
  }
}
.answer-box {
  width: 100%;
  // display: flex;
  // justify-content: space-around;
  flex-wrap: wrap;
  // margin-bottom: 124 / @rem;
  height: 66vw;
  .answer-item {
    font-family: heiti;
    width: 22.1333333rem;
    // height: 90 / @rem;
    height: 3.3rem;
    position: relative;
    margin-left: 5.5vw;
    box-sizing: border-box;
    border-radius: 12 / @rem;
    background: #fff;
    font-size: 1.42666667rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    box-shadow: 5 / @rem 5 / @rem 5 / @rem #bbb;
    // float: left;
    &.success {
      background: #c6fee1;
      border: 2 / @rem solid #c6fee1;
    }
    &.error {
      background: #ffd4d5;
      border: 2 / @rem solid #ffd4d5;
    }
    img {
      width: 34 / @rem;
      height: 34 / @rem;
      position: absolute;
      right: 14 / @rem;
      top: 35%;
    }
  }
  .column {
    width: 22.73333333rem;
    height: 5.2rem;
    padding: 0.7rem;
    line-height: 1.8rem;
    font-size: 1.226666667rem;
    margin-left: 4.6vw;
  }
}
@media screen and (min-width: 768px) {
  .answer-box {
    width: 100%;
    // display: flex;
    // justify-content: space-around;
    flex-wrap: wrap;
    // margin-bottom: 124 / @rem;
    height: 63vw;
    .answer-item {
      font-family: heiti;
      width: 22.1333333rem;
      // height: 90 / @rem;
      height: 3.3rem;
      position: relative;
      margin-left: 5.5vw;
      box-sizing: border-box;
      border-radius: 12 / @rem;
      background: #fff;
      font-size: 1.42666667rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 1rem;
      box-shadow: 5 / @rem 5 / @rem 5 / @rem #bbb;
      // float: left;
      &.success {
        background: #c6fee1;
        border: 2 / @rem solid #c6fee1;
      }
      &.error {
        background: #ffd4d5;
        border: 2 / @rem solid #ffd4d5;
      }
      img {
        width: 34 / @rem;
        height: 34 / @rem;
        position: absolute;
        right: 14 / @rem;
        top: 35%;
      }
    }
    .column {
      width: 22.73333333rem;
      height: 4.2rem;
      padding: 0.7rem;
      line-height: 1.8rem;
      font-size: 1.226666667rem;
      margin-left: 4.6vw;
    }
  }
}
.tipContainer {
  width: 83vw;
  height: 57vw;
  text-align: center;
  position: absolute;
  top: 51vw;
  margin-left: 50%;
  transform: translateX(-50%);
  .happyImg {
    animation: myThird 0.8s infinite;
    margin: 0 auto;
    display: block;
    width: 64vw;
    height: 37vw;
  }
  .unhappyImg {
    animation: myFourth 0.8s infinite;
    margin: -3px auto;
    display: block;
    width: 43vw;
    height: 28vw;
    transform: rotate(10deg);
  }
}
</style>
<style scoped>
@keyframes myThird {
  0% {
    background-image: url(./../assets/images/praiseleft.png);
    background-size: 100% 100%;
  }
  50% {
    background-image: url(./../assets/images/praiseright.png);
    background-size: 100% 100%;
  }
  100% {
    background-image: url(./../assets/images/praiseleft.png);
    background-size: 100% 100%;
  }
}
@keyframes myFourth {
  0% {
    background-image: url(./../assets/images/sweat1.png?11);
    background-size: 100% 100%;
    /*transform: rotate(-13deg);*/
  }
  33.33% {
    background-image: url(./../assets/images/sweat2.png?11);
    background-size: 100% 100%;
    /* transform: rotate(13deg);*/
  }
  66.66% {
    background-image: url(./../assets/images/sweat3.png?11);
    background-size: 100% 100%;
    /*transform: rotate(-13deg);*/
  }
  99.99% {
    background-image: url(./../assets/images/sweat4.png?11);
    background-size: 100% 100%;
    /*transform: rotate(-13deg);*/
  }
}
</style>
<style scoped>
.couten {
  width: 418px;
  height: 170vw;
  overflow: hidden;
  overflow-y: hidden;
  background-color: #fff6e4;
}
.couten li {
  position: absolute;
  animation: all 3s linear;
  top: -100px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.couten li a {
  display: block;
}
ol,
ul {
  list-style: none;
}
</style>
