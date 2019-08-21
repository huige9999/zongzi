<template>
  <div class="m-box">
    <div class="m-inner">
      <app-header :c_time="completed" :f_time="total" isShowK="true">
        <p slot="title" class="ph-title">测一测</p>
      </app-header>
      <my-mask ref="mymask">
        <div class="exit" @click="handleClick"></div>
      </my-mask>
      <audio id="rightanswer" src="rightanswer.wav" style="display:none"></audio>
      <audio id="wronganswer" src="wronganswer.wav?222" style="display:none"></audio>
      <audio id="endanswer" src="endanswer.wav" style="display:none"></audio>
      <audio id="coin" src="coin.wav" style="display:none"></audio>
      <layer ref="layer"></layer>
      <div class="m-contain">
        <p class="m-title" style="margin-left:-10vw">我们的错题</p>
        <!--题目-->
        <p class="m-question" v-html="calcContent"></p>
      </div>
    </div>
    <div class="bottom-contain" id="answerFrame">
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
    <!-- <div class="mo">
	      <div class="sen">
		      <img src="gx.png">
		      <h3 id="redpack-num">获得红包3元</h3>
		      <a href="#">确定</a>
	      </div>
    </div>-->
    <div class="mo">
      <div class="sen">
        <h3 id="redpack-num">+3</h3>
      </div>
    </div>
    <!-- <div class="imgdiv" v-if="showMoneyBox"></div> -->
    <!-- <img
      src="./../assets/images/greenflower.png"
      v-if="showMoneyBox"
      style="width:150vw;position:absolute;bottom:-11vw;z-index:20"
    >-->
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import axios from "axios";
import layer from "@/components/Layer";
import $ from "jquery";
import qs from "qs";
import MyMask from '@/components/MyMask';
export default {
  components: { AppHeader, layer, MyMask },
  name: "exerciseForWeekend",
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
      resultList2:[],
      //题目id
      exerciseId: "",
      //题目答案
      answer: "",
      showHappy: 0,
      showUnHappy: 0,
      showFlower: 0,
      keyword_num: "",
      explains: ""
      // showMoneyBox: false
    };
  },
  mounted() {
    this.$store.commit("update_cNum", 0);
    this.$store.commit("update_icNum", 0);
    this.quesTions = this.$store.state.ex_test;
    this.total = this.quesTions.length;
    this.updateContent();
  },
  computed: {
    // calcContent() {
    //   let html = "";
    //   let newHtml = "";
    //   if (this.content.split("；").length >= 2) {
    //     if (this.keyword) {
    //       if (this.keyword_num || this.keyword_num === 0) {
    //         let count = 0;
    //         let tmpArray = new Array();
    //         let nums = parseInt(this.keyword_num);
    //         html = this.content.split("；")[1];
    //         for (let i = 0; i < html.length; i++) {
    //           tmpArray.push(html.charAt(i + 1));
    //         }
    //         for (let j = 0; j < html.length; j++) {
    //           if (tmpArray[j] == this.keyword) {
    //             count++;
    //             if (count - 1 == nums) {
    //               tmpArray[j] = `<span class="key-text">${this.keyword}</span>`;
    //               break;
    //             }
    //           }
    //         }
    //         html = tmpArray.join("");
    //         newHtml = this.content.split("；")[0] + "<br/>" + html;
    //         return newHtml;
    //       } else {
    //         html = this.content
    //           .split("；")[1]
    //           .split(this.keyword)
    //           .join(`<span class="key-text">${this.keyword}</span>`);
    //         newHtml = this.content.split("；")[0] + "<br/>" + html;
    //         return newHtml;
    //       }
    //     } else {
    //       html = this.content.split("；")[1];
    //       newHtml = this.content.split("；")[0] + "<br/>" + html;
    //       return newHtml;
    //     }
    //   } else {
    //     if (this.keyword) {
    //       if (this.keyword_num || this.keyword_num === 0) {
    //         let count = 0;
    //         let tmpArray = new Array();
    //         let nums = parseInt(this.keyword_num);
    //         html = this.content;
    //         for (let i = 0; i < html.length; i++) {
    //           tmpArray.push(html.charAt(i + 1));
    //         }
    //         for (let j = 0; j < html.length; j++) {
    //           if (tmpArray[j] == this.keyword) {
    //             count++;
    //             if (count - 1 == nums) {
    //               tmpArray[j] = `<span class="key-text">${this.keyword}</span>`;
    //               break;
    //             }
    //           }
    //         }
    //         html = tmpArray.join("");
    //         return html;
    //       } else {
    //         html = this.content
    //           .split(this.keyword)
    //           .join(`<span class="key-text">${this.keyword}</span>`);
    //         return html;
    //       }
    //     } else {
    //       html = this.content;
    //       return html;
    //     }
    //   }
    // }
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
      // if (this.$store.state.cNum >= 16 && this.$store.state.happyFlag == 1) {
      //   this.$store.commit("update_happyFlag", 0);
      //   this.showHappy = 1;
      //   let that = this;
      //   setTimeout(function () {
      //     that.showHappy = 0;
      //   }, 3000);
      // }
      // if (this.$store.state.icNum >= 16 && this.$store.state.unHappyFlag == 1) {
      //   this.$store.commit("update_unHappyFlag", 0);
      //   this.showUnHappy = 1;
      //   let that = this;
      //   setTimeout(function () {
      //     that.showUnHappy = 0;
      //   }, 3000);
      // }

      if (this.completed == this.quesTions.length) {
        //如果是最后一题出现宝箱       
        if (localStorage.getItem("redpack") == undefined && localStorage.getItem("learnDate") == undefined) {
          //这周红包未领出现宝箱
          // this.showMoneyBox = true;
          document.getElementById("answerFrame").style.bottom = "7rem";
        }
      }
    },
    choose(item) {
      let rightanswerdom = document.getElementById("rightanswer");
      let wronganswerdom = document.getElementById("wronganswer");
      rightanswerdom.load();
      wronganswerdom.load();
      this.chooseTimes += 1;
      let that = this;
      if (item.answer == 1 && this.chooseTimes == 1) {
        this.found = true;
        //播放正确音频
        rightanswerdom.play();
        //记录一下一次就答对的题目数
        this.$store.commit("update_correctNum", ++this.$store.state.correctNum);
        //记录一下答对的题目数(非连续))
        this.$store.commit("update_cNum", ++this.$store.state.cNum);
        //console.log("1:" + this.$store.state.cNum);
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
      //保存用户第一次选的答案(exercise_id和is_true))
      if (this.chooseTimes == 1) {
        //数组里保存对象
        this.resultList.push({
          exercise_id: this.exerciseId,
          is_true: this.found ? 1 : 0
        });
        this.resultList2.push(this.exerciseId)
      }
      if (this.chooseTimes == 1 && item.answer != 1) {
        wronganswerdom.load();
        //播放正确音频
        wronganswerdom.play();
        //记录一下答错的题目数
        this.$store.commit(
          "update_incorrectNum",
          ++this.$store.state.incorrectNum
        );
        //记录一下答错的题目数(非连续))
        this.$store.commit("update_icNum", ++this.$store.state.icNum);
        // console.log("2:" + this.$store.state.icNum);
      }
      if (this.chooseTimes >= 2) {
        //如果找到了正确答案进入下一题
        if (item.answer == 1) {
          this.found = true;
          //播放正确音频
          rightanswerdom.play();
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
    nextQuesTion() {
      let layer = this.$refs.layer;
      /*当前没有找到正确答案但点击了下一题
       this.found==false
       答完所有题目
       this.found==true && this.completed = this.quesTions.length
      */
      if (this.found && this.completed < this.quesTions.length) {
        ++this.completed;
        this.updateContent();
      } else if (this.found == false) {
        layer.open({
          type: 2,
          content: "答错啦!再选一次试试", // 内容
          shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
          button: ["确定"], // 按钮内容 默认 知道了
          no() {
            // 点击确认回调
            console.log("取消");
            layer.open(); // 重新打开其他窗口
          }
        });
      } else {
        layer.open({
          type: 2,
          content: "已经是最后一题啦!", // 内容
          shadeClose: true, // 点击空白区域是否隐藏此弹出框  默认是false
          button: ["确定"], // 按钮内容 默认 知道了
          no() {
            //记录当前做一做已经完成
            //this.$store.commit("exerciseCompleted", true);
            localStorage.setItem("exerciseCompleted", "yes");
            //进入读一读
            //this.$router.push({ name: "ReadArticle" });
            this.$router.replace("ReadArticle");
          }
        });

        //已经答完所有题目，保存答题结果
        //console.log(this.resultList);
        //如果是体验课程的话不要调用此接口（判断依据是否有USER_ID）
        if (
          localStorage.getItem("USER_ID") == undefined ||
          localStorage.getItem("USER_ID") == ""
        ) {
          //体验课程  空操作
        } else {
          axios
            .get(this.$store.state.baseUrlFront + "exercise/saveExercise", {
              params: {
                USER_ID: localStorage.getItem("USER_ID"),
                exerciseList: JSON.stringify(this.resultList)
              }
            })
            .then(res => {
              console.log(res);
            });
        }
      }
    },
    saveExercise() {
      let that = this;
      let endanswerdom = document.getElementById("endanswer");
      //播放答题结束音频
      endanswerdom.play();
      this.fallFlower();
      if (localStorage.getItem("cram") == "yes") {
        axios
          .post(
            that.$store.state.baseUrlFront + "module/saveModule",
            qs.stringify({
              USER_ID: localStorage.getItem("USER_ID"),
              date: localStorage.getItem("learnDate"),
              module: "c",
              activemodule: ""
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
        localStorage.setItem("exerciseCompleted", "yes");
        axios
          .post(
            that.$store.state.baseUrlFront + "module/saveModule",
            qs.stringify({
              USER_ID: localStorage.getItem("USER_ID"),
              date: localStorage.getItem("currentDate"),
              module: "c",
              activemodule: ""
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
      //this.$store.state.cNum
      //this.$store.state.icNum
      localStorage.setItem("cNum", this.$store.state.cNum);
      localStorage.setItem("icNum", this.$store.state.icNum);
      let _date = localStorage.getItem("learnDate") ? localStorage.getItem("learnDate") : localStorage.getItem('currentDate');
      let resultListStr = this.resultList2.join(",");
      //保存正确答题数
      axios
        .get(this.$store.state.baseUrlFront + "test/save", {
          params: {
            USER_ID: localStorage.getItem("USER_ID"),
            test_id: localStorage.getItem("testid"),
            true_num: localStorage.getItem("cNum"),
            date: _date,
            exerciseList: resultListStr
          }
        })
        .then(res => {
          console.log(res);
          console.log("正确答题数保存成功");
        }).catch(err=>{
          console.log(err);
        })
      setTimeout(function () {
        //进入打卡
        that.$router.replace("Daka");
        let oldUrl = require("./../assets/images/box1.png")
        //模态框消失
        $(".mo").css("display", "none");
        $(".imgdiv").css("width", "28vw");
        $(".imgdiv").css("height", "28vw");
        $(".imgdiv").css("background-image", "url(" + oldUrl + ")");
        // that.showMoneyBox = false;
      }, 12000);
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
      // setTimeout(function() {
      //   clearTimeout(timer);
      // }, 3000);
      // setTimeout(function() {
      //   $(".counten").html("");
      //   that.showFlower = 0;
      // }, 10000);

      var add = function () {
        var hb = parseInt(Math.random() * (5 - 1) + 1);
        var Wh = parseInt(Math.random() * (70 - 30) + 20);
        var Left = parseInt(Math.random() * (405 - 0) + 0);
        var rot = parseInt(Math.random() * (45 - -45) - 45) + "deg";
        num++;
        if (hb == 1 || hb == 2 || hb == 3 || hb == 4) {
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
        }
        if (localStorage.getItem("learnDate") == undefined) {
          //不是从日历界面进入 && 这周红包未领
          if (localStorage.getItem("redpack") == undefined) {
            if (hb == 1 || hb == 2) {
              $(".couten").append(
                "<li  class='hbli" +
                num +
                "'  style='position:absolute;animation:all 3s linear;top:-100px;left:" +
                Left +
                "px'><a href='javascript:;' style='display:block'><img src='hb" +
                hb +
                ".png' style='width:" +
                Wh +
                "px;transform:rotate(" +
                rot +
                ")'></a></li>"
              );
            }
            //点击红包的时候弹出模态层
            $(document).on('click', '.hbli' + num, function () {
              let coindom = document.getElementById("coin");
              coindom.load();
              coindom.play();
              //停止落花
              setTimeout(function () {
                clearTimeout(timer);
              }, 3000);
              setTimeout(function () {
                $(".counten").html("");
                that.showFlower = 0;
              }, 10000);
              //模态框出现
              $(".mo").css("display", "block")
              //宝箱被打开
              let newUrl = require("./../assets/images/box2.png?111")
              $(".imgdiv").css("background-image", "url(" + newUrl + ")");
              $(".imgdiv").css("width", "38vw");
              $(".imgdiv").css("height", "38vw");
              //记录当天红包已经领取
              localStorage.setItem("redpack", "yes");
              //产生1到3的随机金额
              let array = [1, 1.5, 2, 2.5, 3];

              let redpackNum = array[Math.floor(Math.random() * 5)];
              $("#redpack-num").html("+" + redpackNum);
              //发送请求保存金额
              //   axios
              // .get(that.$store.state.baseUrlFront + "redpack/saveBalance", {
              //   params: {
              //     USER_ID: localStorage.getItem("USER_ID"),
              //     redpack: redpackNum
              //   }
              // })
              // .then(res => {
              //   console.log(res);
              // });
              axios
                .post(
                  that.$store.state.baseUrlFront + "redpack/saveBalance",
                  qs.stringify({
                    USER_ID: localStorage.getItem("USER_ID"),
                    redpack: redpackNum
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

            })

            // 点击模态的时候关闭模态层
            // $(".mo").click(function(){
            //   $(".mo").css("display", "none");
            //   let oldUrl = require("./../assets/images/box1.png")
            //    $(".imgdiv").css("background-image","url("+oldUrl+")");
            //         //模态框消失
            //     $(".imgdiv").css("width","28vw");
            //    $(".imgdiv").css("height","28vw");
            //       that.showMoneyBox = false;
            // });
            $(".hbli" + num).animate(
              { top: $(window).height() + 20, left: Left },
              5000,
              function () {
              }
            );
          }
        }

        $(".li" + num).animate(
          { top: $(window).height() + 20, left: Left },
          5000,
          function () {
          }
        );

        timer = setTimeout(add, 200);
      };
      //增加红包
      var num = 0;
      setTimeout(add, 800);
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
      font-size: 1.5rem;
      font-weight: 500;
    }
    .m-question {
      width: 82%;
      margin-top: 0.3rem;
      font-size: 1.2rem;
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
  height: 71vw;
  .answer-item {
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
    width: 20.73333333rem;
    height: 5.2rem;
    padding: 1.5rem;
    line-height: 1.8rem;
    font-size: 1.226666667rem;
    margin-left: 8vw;
  }
}
@media screen and (min-width: 768px) {
  .answer-box {
    width: 100%;
    // display: flex;
    // justify-content: space-around;
    flex-wrap: wrap;
    // margin-bottom: 124 / @rem;
    height: 61vw;
    .answer-item {
      width: 22.1333333rem;
      // height: 90 / @rem;
      height: 2.3rem;
      position: relative;
      margin-left: 5.5vw;
      box-sizing: border-box;
      border-radius: 12 / @rem;
      background: #fff;
      font-size: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0.5rem;
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
      font-size: 1rem;
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
@keyframes mySixth {
  0% {
    background-image: url(./../assets/images/box1.png);
    background-size: 100% 100%;
  }

  50% {
    background-image: url(./../assets/images/box2.png);
    background-size: 100% 100%;
  }
  100% {
    background-image: url(./../assets/images/box2.png);
    background-size: 100% 100%;
  }
}
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
.mo {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 100;
  display: none;
}
.mo .sen {
  width: 70%;
  height: 150px;
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.imgdiv {
  width: 28vw;
  height: 28vw;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  vertical-align: top;
  /* animation: mySixth 0.8s 1;  */
  background-image: url(./../assets/images/box1.png);
  background-size: 100% 100%;
  z-index: 100;
}
.mo .sen h3 {
  width: 50%;
  height: 30px;
  position: absolute;
  top: 96vw;
  left: -29vw;
  right: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  color: red;
  font-weight: bold;
  z-index: 100;
  font-size: 2rem;
  animation: myFifth 0.8s infinite;
}

/* .mo .sen a {
		width: 34%;
		height: 50px;
		background-color: rgb(174, 222, 244);
		box-shadow: rgba(174, 222, 244, 0.8) 0px 0px 2px, rgba(0, 0, 0, 0.0470588) 0px 0px 0px 1px inset;
		position: absolute;
		top: 100px;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		color: #fff;
		border-radius: 5px;
		text-align: center;
		line-height: 50px;
		text-decoration: none;
    font-size:1.2rem;
	} */
.bottom-contain {
  bottom: 5rem;
}
@media screen and (min-width: 768px) {
  .bottom-contain {
    bottom: 3.5rem;
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
