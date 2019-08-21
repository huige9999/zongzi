// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import global_ from './components/Global'
import '@/assets/css/reset.css'
import { unescape } from 'querystring';
import axios from 'axios';
Vue.config.productionTip = false
Vue.prototype.GLOBAL = global_
var os = function (){
	var ua = navigator.userAgent,
	isWindowsPhone = /(?:Windows Phone)/.test(ua),
	isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
	isAndroid = /(?:Android)/.test(ua),
	isFireFox = /(?:Firefox)/.test(ua),
	isChrome = /(?:Chrome|CriOS)/.test(ua),
	isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
	isPhone = /(?:iPhone)/.test(ua) && !isTablet,
	isPc = !isPhone && !isAndroid && !isSymbian;
	return {
		isTablet: isTablet,
		isPhone: isPhone,
		isAndroid: isAndroid,
		isPc: isPc
	};	
}();
if (os.isAndroid || os.isPhone || os.isTablet) {//判断是否是移动设备打开。
	/*路由验证*/
	router.beforeEach((to, from, next) => {
		//如果缓存中存在USER_ID，放行
		if (localStorage.getItem("USER_ID")) {
			if (to.path == "/BeforeLearn") {
				if (window.location.href.indexOf("?111") != -1) {
					localStorage.removeItem("learnDate");
				}
				if (localStorage.getItem("learnDate") == undefined) {
					var dayStr = "日一二三四五六".charAt(new Date().getDay());
					var dayType = 0;
					if (dayStr == "日") {
						dayType = 0;
					} else if (dayStr == "六") {
						dayType = 1;
					} else {
						dayType = 2;
					}
					if (dayType == 2) {
						//普通天跳转BeforeLearn界面
						next();
					} else if (dayType == 1) {
						//周六跳转Weekend界面
						next({ path: '/Weekend' });
					} else {
						//周末跳转Shangxi界面
						next({ path: '/Sunday' });
					}
				} else {
					next();
				}
			}else if(window.location.href.indexOf("RelationshipUSERID")!=-1){
				window.location.href="http://front.zongziguwen.com/#/RelationShip";
			}else {

				next();
			}

		} else {
			
		    if (to.path == "/Share") {
				next();
			} else if (to.path == "/Compare") {
				next();
			}else if(to.path == "/RelationShip"){
				next();
			}else {
				let USERID1 = window.location.href.split("user_id=")[1];
				if (!(USERID1 == undefined)) {
					USERID1 = USERID1.split("#/")[0];
				}
				let USERID2 = window.location.href.split("USERID=")[1];
				if (!(USERID2 == undefined)) {
					USERID2 = USERID2.split("#/")[0];
				}
				if (!(USERID1 == "" || USERID1 == undefined)) {
					localStorage.setItem("USER_ID", USERID1);
					window.location.href = "http://front.zongziguwen.com/#/Purchase";
				}
				if (!(USERID2 == "" || USERID2 == undefined)) {
					if (USERID2.indexOf("&groupId") != -1) {
						//包含groupId的特殊情况处理
						let tmpUSERID = USERID2.split("&groupId=")[0];
						let tmpGROUPID = USERID2.split("&groupId=")[1];
						localStorage.setItem("USER_ID", tmpUSERID);
						localStorage.setItem("GROUP_ID", tmpGROUPID);
						window.location.href = "http://front.zongziguwen.com/#/ToPingtuan";
					} else if (window.location.href.indexOf("TYindex") != -1) {
						localStorage.setItem("USER_ID", USERID2);
						window.location.href = "http://front.zongziguwen.com/#/TYindex";
					} else if (window.location.href.indexOf("Invite") != -1) {
						let tmpUSERID = USERID2.split("&inviterId=")[0];
						let tmpINVITERID = USERID2.split("&inviterId=")[1];
						localStorage.setItem("USER_ID", tmpUSERID);
						localStorage.setItem("inviter_id", tmpINVITERID);
						window.location.href = "http://front.zongziguwen.com/#/Invite";
					} else if (window.location.href.indexOf("Share") != -1) {
						localStorage.setItem("USER_ID", USERID2);
						window.location.href = "http://front.zongziguwen.com/#/Share";
					}
					// else if(window.location.href.indexOf("SaleInvite")!=-1){
					// 	localStorage.setItem("USER_ID",USERID2);
					// 	window.location.href="http://front.zongziguwen.com/#/SaleInvite";
					// }
		      else {
						localStorage.setItem("USER_ID", USERID2);
						//判断用户是不是会员
						//发送请求判断用户有没有购买
						axios
							.get("/wxinfo/findUserInfo", {
								params: {
									USER_ID: localStorage.getItem("USER_ID")
								}
							})
							.then(res => {
								console.log("判断用户是不是会员");
								console.log(res);
								if (res.data.data.flag == "1") {
									window.location.href = "http://front.zongziguwen.com/#/BeforeLearn";
								} else {
									window.location.href = "http://front.zongziguwen.com/#/Purchase";
								}
							});


					}

				}
				if (localStorage.getItem("USER_ID") == "" || localStorage.getItem("USER_ID") == undefined) {
					if (window.location.href.indexOf("Invite") != -1) {
						let inviterIds = window.location.href.split("inviter_id=")[1];
						//授权登录
						window.location.href = "qrCode/oauth_user2?type=2&inviter_id=" + inviterIds;
					} else if (window.location.href.indexOf("ToPingtuan") != -1) {
						let groupIds = window.location.href.split("groupId=")[1];
						//授权登录
						window.location.href = "qrCode/oauth_user2?type=3&group_id=" + groupIds;
					} else if (window.location.href.indexOf("TYindex") != -1) {

						window.location.href = "qrCode/oauth_user2?type=4";
						// }else if(window.location.href.indexOf("SaleInvite")!=-1){
						// 	window.location.href =  "qrCode/oauth_user2?type=6";
						// }else{
					} else {
						//授权登录
						window.location.href = "qrCode/oauth_user2?type=1";
					}
				}
			}
		}


	})
} else {
	//否则就是PC浏览器打开
	window.location.href = "http://front.zongziguwen.com/homepage/index.html"
}
// Vue.prototype.$autoPlayQues = (src,cb) =>{
// 	App.methods.autoPlayQues(src,cb);
// }

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
