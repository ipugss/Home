var phone = new RegExp("^[1][3,4,5,7,8][0-9]{9}$");
var email=new RegExp("^[a-z0-9A-Z]+[-|a-z0-9A-Z._]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
var search={
		url:"https://www.baidu.com/s?ie=UTF-8&wd=",
		
		do_search:function(){
			var word=$("input[name='search-input']").val();
			if(word!=null&&word!=""){
				window.location=this.url+word;
			}
		},
}

/*
 * 
 * 设置
 * 
 * 
 */
var set={
		$dom:null,
		init:function(){
			this.$dom=$("#setting");
			//阻止事件向上传递
			$(".setting,#setting").click(function(e){
				e=e||window.even;
				e.stopPropagation(); 
			});
			this.$dom.click(function(){
				$(".setting").css({"animation":"setting 0.3s linear forwards","display":"block"});
				$("body").bind("click",function(e){
					e=e||window.even;
					var target=e.target||e.srcElement;
					if(target!=$(".setting")[0]){
						console.log(target);
						console.log($(".setting")[0]);
						$(".setting").css("animation","unset");
						$(".setting").animate({"right":"-400px"},300,function(){
							$(this).hide();
							$(this).css({"right":"0"});
						});
						$("body").unbind("click");
					}
				});
			});
		},
		
		
		
}


var background={
		HiddenBar:null,
		index:0,
		
		//给body绑定鼠标双击事件
		init:function(){
			$("body").dblclick(function(){
				background.ChangeBackground();
			});
			
			
		},
		//更换背景
		ChangeBackground:function(){
			$.ajax({
				type:"post",
				url:"/ajax/load_img",
				success:function(data){
					background.ChangeBackgroundAnimate(data);
				}
			});
		},
		//更换背景动画
		ChangeBackgroundAnimate:function(url){
			background.HiddenBar.stop();
			background.HiddenBar.animate({"opacity":"1"},400,function(){
				$(".img-src").css("background-image","url("+url+"").ready(function(){
					background.HiddenBar.stop();
					background.HiddenBar.animate({"opacity":"0"},600,function(){
					});
				});
			});
		},
		//hidden 层动画
		HiddenBarHide:function(){
			this.HiddenBar.stop();
			this.HiddenBar.animate({"opacity":".4"},200);
		},
		HiddenBarShow:function(){
			this.HiddenBar.stop();
			this.HiddenBar.animate({"opacity":"0"},200);
		},
		HiddenBarAnimate:function(){
			this.HiddenBar.stop();
			this.HiddenBar.animate({"opacity":"0"},400,function(){
				background.HiddenBar.animate({"opacity":"0.3"},400);
			});
		},
}


var header_content_right={
		$dom:null,
		//初始化
		init:function(){
			this.$dom=$(".header-content-right");
		}
}

var search_content={
		$dom:null,
		//初始化
		init:function(){
			this.$dom=$(".search-content");
		}
}

var my_project={
		$dom:null,
		//初始化
		init:function(){
			this.$dom=$(".my-project");
		}
		
}

var windows={
		//窗口宽高
		width:0,
		height:0,
		//刷新窗口大小
		refresh:function(){
			windows.width=document.body.clientWidth;
			windows.height=document.body.clientHeight;
		},
		//初始化
		init:function(){
			this.refresh();
			header_content_right.init();
			search_content.init();
			my_project.init();
			my_favour.init();
			if(this.width>1100){
				$("#narrow").css("display","none");
				$("#enlarge").css("display","block");
				
			}else{
				$("#enlarge").css("display","none");
				$("#narrow").css("display","block");
			}
			header_content_right.$dom.show(400);
			if(this.width<=640){
				$(".header-content-left ul li").not(":first").css("display","none");
			}else{
				$(".header-content-left ul li").css("display","block");
			}
			search_content.$dom.show(400);
			var centerLen=502.2947;//windows.width*0.28867513;
			$(".first_page").css("transform","rotateY(0deg) translateZ("+centerLen+"px) translateY(0px)");
			$(".second_page").css("transform","rotateY(120deg) translateZ("+centerLen+"px) translateY(0px)");
			$(".third_page").css("transform","rotateY(240deg) translateZ("+centerLen+"px) translateY(0px)");
			
		},
		
		//窗口变化后调用的方法
		resize:function(){
			//刷新当前窗口可视区域宽高
			windows.refresh();
			//判断当前宽度是否小于1200px,小于收起菜单
			if(windows.width<1100){
				header_content_right.$dom.stop()
				header_content_right.$dom.animate({"right":"-500px"},400,function(){
					$("#narrow").show();
					$("#enlarge").hide();
					header_content_right.$dom.animate({"right":"0px"},200);
				});
				
				my_favour.$dom.css({"opacity":"0","display":"none"});
				
				my_project.$dom.css({"opacity":"0","display":"none"});
				
				
				
			}else{
				header_content_right.$dom.stop();
				header_content_right.$dom.animate({"right":"-500px"},400,function(){
					$("#enlarge").show();
					$("#narrow").hide();
					header_content_right.$dom.animate({"right":"0px"},400);
				});
			}
			if(windows.width<=640){
				$(".header-content-left ul li").not(":first").hide();
			}else{
				$(".header-content-left ul li").show();
			}
			//实时控制应用栏宽度
			application.refresh();
		}
		
		
}


var my_favour={
		width:0,
		height:0,
		$dom:null,
		init:function(){
			this.$dom=$(".my-favour");
			this.refresh();
		},
		refresh:function(){
			if(windows.width<1032){
				this.$dom.css({"width":"100%","height":this.height+"px","display":"none"});
			}else{
				this.width=$(".page-content").width()-$(".search-content").width()-30;
				this.height=$(window).height()-$(".header").height()-$(".bj-dot-bar").height()-20;
				//this.$dom.css({"width":this.width+"px","height":this.height+"px","display":"block"});
			}
		}
}


var application={
		former:null,     //用户最先前的默认应用
		show:new Array(),       //当前显示的应用
		hide:new Array(),		 //未显示的应用
		init:function(){
			var width=windows.width;
			var this_width=108;
			this.former=$(".application ul li");
			for(var i=0;i<this.former.length-1;i++){
				this_width+=this.former[i].offsetWidth+12;
				if(this_width>width){
					this.hide.push(this.former[i]);
					$(this.former[i]).remove();
				}else{
					this.show.push(this.former[i]);
				}
			}
			this.home();
			this.music();
			this.translate();
		},
		refresh:function(){
			var width=windows.width;
			var this_width=108;
			this.show=$(".application ul li");   //当前显示的item
			
			for(var i=0;i<this.show.length-1;i++){
				this_width+=76;
			}
			if(this_width>width){
				for(var i=this.show.length-2;i>=0;i--){
					if(this_width>width){
						this_width-=76;
						this.hide.push(this.show[i]);
						$(this.show[i]).remove();
					}else{
						break;
					}
				}
			}else{
				for(var i=this.hide.length-1;i>=0;i--){
					this_width+=76;
					if(this_width<=width){
						$(".application ul li:last").before(this.hide[i]);
						this.hide.pop(this.hide[i]);
					}else{
						this_width-=76;
						break;
					}
				}
			}
		},
		
		//主页
		home:function(){
			$("#home").click(function(){
				var centerLen=870*0.28867513;
				$(".first_page").css("transform","rotateY(0deg) translateZ("+centerLen+"px) translateY(0px)");
				$(".second_page").css("transform","rotateY(120deg) translateZ("+centerLen+"px) translateY(0px)");
				$(".third_page").css("transform","rotateY(240deg) translateZ("+centerLen+"px) translateY(0px)");
			});
		},
		
		//音乐
		music:function(){
			$("#music").click(function(){
				var centerLen=870*0.28867513;
				$(".first_page").css("transform","rotateY(120deg) translateZ("+centerLen+"px) translateY(0px)");
				$(".second_page").css("transform","rotateY(240deg) translateZ("+centerLen+"px) translateY(0px)");
				$(".third_page").css("transform","rotateY(360deg) translateZ("+centerLen+"px) translateY(0px)");
			});
		},
		
		//翻译
		translate:function(){
			$("#translate").click(function(){
				var centerLen=502.2947;//windows.width*0.28867513;
				$(".first_page").css("transform","rotateY(240deg) translateZ("+centerLen+"px) translateY(0px)");
				$(".second_page").css("transform","rotateY(360deg) translateZ("+centerLen+"px) translateY(0px)");
				$(".third_page").css("transform","rotateY(480deg) translateZ("+centerLen+"px) translateY(0px)");
			});
		}
}


/*
 * 
 * 加载文档之前绑定
 * 
 */
$(".img-src").ready(function(){
	
});


/*
 * 
 * 加密方法
 * 
 */
var encript={
	key:null,
	//获取key
	getkey:function(){
		this.key="chen";
	},
	//加密
	des:function(message){
		var encrypted=CryptoJS.DES.encrypt(message,this.key);
		return encrypted.toString();
	}
	
		
}



/*
 * 
 * 
 * 登录
 * 
 * 
 */
var login={
		$dom:null,
		$close:null,
		$do_login:null,
		$access_login:null,
		$username:null,
		$password:null,
		account_type:0,//（0）默认本站登录，（1）表示网易云登录
		login_type:0,//默认用户名登录（0），手机号登录（1），邮箱（2）
		
		
		init:function(){
			this.$dom=$(".login");
			this.$close=$(".login .close");
			this.$do_login=$("#login-go");
			this.$access_login=$("#login_access");
			this.$username=$("#login-username");
			this.$password=$("#login-password");
			
			//打开窗口
			this.$access_login.click(function(){
				$(".login").show();
			});
			//关闭窗口
			this.$close.click(function(){
				$(".login-content").animate({"width":"0px","height":"0px"},300,function(){
					$(".login").hide();
					$(".login-content").css({"width":"300px","height":"400px"});
				});
			});
			
			//登录输入框判断
			$(".login-content-input input").focus(function(){
				if($(this).attr("name")=="password"){
					$(this).attr("type","password");
				}
				$(this).siblings(".login-alert").css({"top":"-20px","font-size":"8px"});
				$(this).siblings(".clear").show();
				
			});
			$(".login-content-input input[type='text'],input[type='password']").blur(function(){
				var value=$(this).val();
				if(value!=null&&value!=""){
				}else{
					$(this).siblings(".login-alert").css({"top":"10px","font-size":"12px"});
				}
			});
			
			this.$do_login.click(function(){
				login.go();
			});
			
			$(".fast_login_bar>span").click(function(){
				if(login.account_type==0){
					$(this).children("#netease_login").attr("class","iconfont icon-icon-home2");
					$(this).children("span").text("返回");
					$($(".login-alert")[0]).text("网易手机账号");
					$(".login-alert").css("color","rgb(160, 12, 12)");
					login.account_type=1;
				}else{
					$(this).children("#netease_login").attr("class","iconfont icon-CN_NetEasemusic");
					$(this).children("span").text("网易云账号登录");
					$($(".login-alert")[0]).text("用户名/手机号码/邮箱");
					$(".login-alert").css("color","rgba(0, 0, 0, 0.34)");
					login.account_type=0;
				}
			});
			
			
		},
		
		container:$("<div style='width:200px;height:80px;background:#111;line-height: 80px;opacity:.7;position:fixed;top:50%;left:50%;transform: translate(-50%,-50%);z-index:4;border-radius:6px;text-align:center;color:#ffffff;font-size:14px;'></div>"),
		
		//返回登录信息并解析
		go:function(){
			$.when(this.to()).done(function(data){
				if(data.code=="502"){
					//登陆失败，重新绑定click事件
					login.$do_login.bind("click",function(){login.go();});
					login.$do_login.css("cursor","pointer");
					
					login.container.html("");
					login.container.html("请检查用户名密码");
					setTimeout(function(){
						login.container.remove();
						login.container.html("");
						login.$access_login.click();
					},2000);
					return;
				}else if(data.code=="200"){
					login.container.html("");
					login.container.html("登录成功");
					$(".can-hide").hide();
					//判断是什么用户登录，若为网易云用户解析用户信息
					if(login.account_type==1){
						$("#enlarge li:last").prev().before("<li><a href='javascript:void(0)'><img class='head_icon' src='"+data.account.head_icon+"'>"+data.account.netease_nickname+"</a></li>");
						$("#narrow li:last").before("<li><a href='javascript:void(0)'><img class='head_icon' src='"+data.account.head_icon+"'>"+data.account.netease_nickname+"</a></li>");
						$(".can-hide").append("<li><a href='javascript:void(0)'><img class='head_icon' src='"+data.account.head_icon+"'>"+data.account.netease_nickname+"</a></li>");
						
						user=data.account;
						console.log(user);
						playsheet.init();
					}else{
						$("#enlarge li:last").prev().before("<li><a href='javascript:void(0)'><img class='head_icon' src='"+data.account.head_icon+"'>"+data.account.nickname+"</a></li>");
						$("#narrow li:last").before("<li><a href='javascript:void(0)'><img class='head_icon' src='"+data.account.head_icon+"'>"+data.account.nickname+"</a></li>");
						$(".can-hide").append("<li><a href='javascript:void(0)'><img class='head_icon' src='"+data.account.head_icon+"'>"+data.account.nickname+"</a></li>");
						
					}
					
				
				}
				
				setTimeout(function(){
					login.container.remove();
					login.container.html("");
				},2000);
				
			});
			
		},
		
		//登录方法
		to:function(){
			var defer=$.Deferred();
			var username=login.$username.val();
			var password=login.$password.val();
			if(username==null||username==""){
				
				login.container.html("用户名不能为空");
				$("body").append(login.container);
				setTimeout(function(){
					login.container.html("");
					login.container.remove();
				},1000);
				
				return;
			}else if(password==null||password==""){
				login.container.html("密码不能为空");
				$("body").append(login.container);
				setTimeout(function(){
					login.container.html("");
					login.container.remove();
				},1000);
				return;
			}else{
				$(".login-content").animate({"width":"0px","height":"0px"},300,function(){
					//预处理用户名
					if(phone.test(username)){
						login.login_type=1;
					}else if(email.test(username)){
						login.login_type=2;
					}
					
					$(".login").hide();
					$(".login-content").css({"width":"300px","height":"400px"});
					
					//等待返回信息
					login.container.append("<i class='iconfont icon-loading' id='wait'></i>");
					$("body").append(login.container);
					//解绑
					login.$do_login.unbind("click");
					login.$do_login.css("cursor","unset");
					
					console.log("account_type:"+login.account_type+"     login_type:"+login.login_type);
					$.ajax({
						url:"/ajax/login",
						type:"post",
						dataType:"json",
						data:login.key(username,password),
						success:function(data){
							defer.resolve(data)
						}
					});
					
					});
				}
			return defer;
		},
		key:function(username,password){
			var keyvalue=null;
			//密码MD5加密
			password=hex_md5(password);
			if(login.account_type==1){
				var myMsg=JSON.stringify(myFunc(JSON.stringify({"phone":username,"password":password,"rememberLogin":true,"checkToken": "","csrf_token": ""})));
				keyvalue= {"username":username,"password":password,"account_type":login.account_type,"login_type":login.login_type,"issave":document.getElementsByName("issave")[0].checked,"key":myMsg};
			}else{
				keyvalue= {"username":username,"password":password,"account_type":login.account_type,"login_type":login.login_type,"issave":document.getElementsByName("issave")[0].checked};
			}
			return keyvalue;
		}
}

/*
 * 
 * 
 * 注册
 * 
 * 
 */
var register={
		$dom:null,
		$close:null,
		$do_register:null,
		$access_register:null,
		register_type:0,
		container:$("<div style='width:200px;height:80px;background:#111;line-height: 80px;opacity:.7;position:fixed;top:50%;left:50%;transform: translate(-50%,-50%);z-index:4;border-radius:6px;text-align:center;color:#ffffff;font-size:14px;'></div>"),
		
		init:function(){
			this.$dom=$(".register");
			this.$close=$(".register .close");
			this.$do_register=$("#register-go");
			this.$access_register=$("#register_access");
			//打开窗口
			this.$access_register.click(function(){
				$(".register-content").show();
				$(".register").show();
			});
			//关闭窗口
			this.$close.click(function(){
				$(".register-content").animate({"width":"0px","height":"0px"},300,function(){
					$(".register").hide();
					$(".register-content").css({"width":"300px","height":"400px"});
				});
			});
			
			//注册输入框判断
			$(".register-content-input input[type='text']").focus(function(){
				if($(this).attr("name")=="password"){
					$(this).attr("type","password");
				}
				$(this).siblings(".register-alert").css({"top":"-20px","font-size":"8px"});
				$(this).siblings(".clear").show();
				
			});
			$(".register-content-input input[type='text'],input[type='password']").blur(function(){
				var value=$(this).val();
				if(value!=null&&value!=""){
				}else{
					$(this).siblings(".register-alert").css({"top":"10px","font-size":"12px"});
				}
			});
			
			this.$do_register.click(function(){
				register.go();
			});
		},
		
		//注册

		
		go:function(){
			$.when(register.to()).done(function(data){
				
				if(data.code!=null&&data.code==200){
					register.container.html("注册成功");
					$(".register-content").animate({"width":"0px","height":"0px"},300,function(){
						register.$dom.hide();
						$(".register-content").css({"width":"300px","height":"400px"});
					});
					setTimeout(function(){
						register.container.html("");
						register.container.remove();
						login.$dom.show();
					},2000);
				}else{
					register.container.html("注册失败");
					setTimeout(function(){
						register.container.html("");
						register.container.remove();
					},1000);
					
				}
				
			});
		},
		
		
		to:function(){
			var defer=$.Deferred();
			
			
			var username=$(".register-content-input input[type='text']").val();
			var password=$($(".register-content-input input[type='password']")[0]).val();
			var checkP=$($(".register-content-input input[type='password']")[1]).val();
			if(username==null||username==""){
				register.container.html("用户名不能为空啦");
				$("body").append(register.container);
				setTimeout(function(){
					register.container.html("");
					register.container.remove();
					
				},1000);
				return;
			}else if(password==null||password==""){
				register.container.html("密码不能为空呦");
				$("body").append(register.container);
				setTimeout(function(){
					register.container.html("");
					register.container.remove();
					
				},1000);
				return;
			}else if(checkP==null||checkP==""){
				register.container.html("请确认密码撒");
				$("body").append(register.container);
				setTimeout(function(){
					register.container.html("");
					register.container.remove();
					
				},1000);
				return;
			}else if(password!=checkP){
				register.container.html("两次密码不一致嘞");
				$("body").append(register.container);
				setTimeout(function(){
					register.container.html("");
					register.container.remove();
					
				},1000);
				return;
			}else{
				register.container.append("<i class='iconfont icon-loading' id='wait'></i>");
				$("body").append(register.container);
				//解绑
				this.$do_register.unbind("click");
				this.$do_register.css("cursor","unset");
				//预处理用户名
				if(phone.test(username)){
					register.register_type=1;
				}else if(email.test(username)){
					register.register_type=2;
				}
				//密码MD5加密
				password=hex_md5(password);
				
				
				
				
				$.ajax({
					type:"post",
					url:"/ajax/register",
					data:{
						"register_type":register.register_type,
						"username":username,
						"password":password
					},
					dataType:"json",
					success:function(data){
						defer.resolve(data)
					}
				});
				this.$do_register.click(function(){register.go();});
				this.$do_register.css("cursor","pointer");
			}
			return defer;
		},
}


/*
 * 
 * 用户信息存储
 * 
 */
var user={
		playsheet:null,
		background:null,
		init:function(){
			
		}
}


$(function(){
	windows.init();
	login.init();
	register.init();
	//清除输入框
	$(".clear").click(function(){
		$(this).siblings("input").val("");
		$(this).siblings("input").blur();
		$(this).hide();
	});
	
	//设置
	set.init();
	
	//实时控制窗口
	var rt1;
	$(window).resize(function(){
		windows.refresh();
		clearTimeout(rt1);
		rt1=setTimeout(windows.resize,1000);
	});
	
	//选择搜索方式hover
	var rt2;
	$(".search-img-content").hover(function(){
		$(".search-img").css("width","200px");
		$(".select").slideDown(200);
	},function(){
		clearTimeout(rt2);
		rt2=setTimeout(function(){
			$(".search-img").css("width","230px");
			$(".select").slideUp(200);
		},400);
	});
	
	//搜索框focus事件
	background.HiddenBar=$(".hidden-bar");
	$("input[name='search-input']").focus(function(){
		background.HiddenBarHide();
		$(".search-img-content>img").css({"width":"200px"});
	});
	//搜索框unfocus事件
	$("input[name='search-input']").blur(function(){
		background.HiddenBarShow();
		$(".search-img-content>img").css({"width":"230px"});
	});
	//搜索框回车事件
	$("input[name='search-input']").bind("keyup",function(e){
		if(e.keyCode=="13"){
			search.do_search();
		}
	});
	
	//搜索方法
	$("#do_search").click(function(){
		search.do_search();
	});
	
	//更换搜索方法
	$(".search-img-content>div img").click(function(){
		var alt=$(this).attr("alt");
		if(alt=="baidu"){
			$(".search-img-content>img").attr("src","/image/baidu.png");
			search.url="https://www.baidu.com/s?ie=UTF-8&wd=";
			$("#do_search").text("百度一下");
			$("#do_search").css("background","#0399f4");
		}else if(alt=="sougou"){
			$(".search-img-content>img").attr("src","/image/sougou.png");
			search.url="https://www.sogou.com/web?_asf=www.sogou.com&ie=utf8&query=";
			$("#do_search").text("搜狗搜索");
			$("#do_search").css("background","#fd6853");
		}else if(alt=="biying"){
			$(".search-img-content>img").attr("src","/image/biying.png");
			search.url="https://cn.bing.com/search?q=";
			$("#do_search").text("必应");
			$("#do_search").css("background","#047fab");
		}
	});
	
	//背景预处理及事件
	background.init();
	
	//底部应用hover
	application.init();
	
/*	//底部应用hover事件
	var rt3
	$(".application ul li").hover(function(){
		clearTimeout(rt3);
		$(this).css("transform","translateZ(36px) rotateX(-75deg)");
		rt3=setTimeout(function(){
			$(this).css("transform","translateZ(24px) rotateX(-75deg)");
		},3000);
	},function(){
		clearTimeout(rt3);
		$(this).css("transform","translateZ(24px) rotateX(-75deg)");
	});*/
	
	//底部应用栏hover事件
	var rt4;
	$(".application").hover(function(){
		clearTimeout(rt4);
		$(this).css("opacity","1");
		$(".application ul li").css("margin","14px 6px 0");
	},function(){
		clearTimeout(rt4);
		rt4=setTimeout(function(){
			$(".application").css("opacity","0.3");
			$(".application ul li").css("margin","14px -32px 0");
			},30000);
	});
	
	
	
	
});