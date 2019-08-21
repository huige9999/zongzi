function formatSeconds(value) {
  var theTime = parseInt(value);// 秒
  var theTime1 = 0;// 分
  var theTime2 = 0;// 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  var result = "" + theTime;
  result = (result.length == 1) ? '00:00:0' + result : '00:00:'+result;
  if (theTime1 > 0) {
    theTime1 = (theTime1 < 10) ? '00:0' + theTime1 : '00:'+theTime1 ;
    result = theTime<10? "" + theTime1 + ":0" + theTime : "" + theTime1 + ":" + theTime;
  }
  if (theTime2 > 0) {
    theTime2 = (theTime2.length == 1) ? '0' + theTime2 : theTime2;
    result = "" + theTime2 + ":" + result;
  }
  result = (result.length == 2) ? '00:' + result : result;
  return result;
}

export default {formatSeconds}
