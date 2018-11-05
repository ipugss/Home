var audio={
		//播放器dom
		audioDom:null,
		//音轨上下文
		audioContext:null,
		//暂停播放标志
		ispaused:true,
		
		//初始化
		init:function(){
			this.audioDom=document.getElementById("audio");
			//this.audioDom.crossOrigin = 'anonymous';
			//this.audioContext=this.audioContext();
			this.audioDom.onloadstart=function(){
				lyric.jump(0);
				console.log("开始寻找资源")
			};

			//获取歌词，加载歌曲时长
			this.audioDom.onloadedmetadata=function(){
				//显示歌曲总时长
				lyric.jump(0);
				var duration=this.duration;
				var minute=parseInt(duration/60);
				var second=parseInt(duration%60);
				var time_str=(minute<10?("0"+minute):minute)+":"+(second<10?("0"+second):second);
				$(".right_time").text(time_str);
				//console.log("加载歌词");
			};
			
			this.audioDom.onprogress=function(){
					if(this.readyState>=1){
						//获取已经加载的资源的TimeRange
						var timeRanges=audio.audioDom.buffered;
						//获取已缓存的时间
						var times=timeRanges.end(timeRanges.length-1);
						//获得加载资源的百分比
						var percent=times/audio.audioDom.duration;
						$(".music_background_load").width(percent*100+"%");
					}
			};
			
			this.audioDom.oncanplaythrough=function(){
				console.log("可以正常播放且无需停顿时执行");
				if(!audio.ispaused){
					audio.play();
				}
			};
			var interval=null;
			//播放时执行
			this.audioDom.onplaying=function(){
				console.log("播放时执行");
				//歌词滚动
				clearInterval(interval);
				interval=setInterval(function(){
					lyric.jump(audio.audioDom.currentTime*1000);
				},200);
				/*//音轨
				sound_track.mark = true;
				//获取音轨解析对象
				var len = sound_track.sound_track_items.length;
				sound_track.parse(audio.audioContext,audio.audioDom,function(dataArr){//1024
					for(var i=0;i<len;i++){
						console.log(dataArr[i]);
						sound_track.sound_track_items[i].css("height", dataArr[i]+"px");
					}
				});*/
				
			},
			//暂停时执行
			this.audioDom.onpause=function(){
				console.log("暂停时执行");
				//停止歌词
				clearInterval(interval);
				/*//停止音轨
				sound_track.mark = false;*/
			},
			this.audioDom.onended=function(){
				console.log("播放完成，下一首");
				$(".next_song").click();
				
			},
			//当前播放时间改变时执行
			this.audioDom.ontimeupdate=function(){
				//获取当前播放时间
				var currentTime=this.currentTime;
				//获取歌曲总时长
				var duration=this.duration;
				//获取百分比
				var percent=currentTime/duration*100;
				//更改进度条
				$(".music_track").width(percent+"%");
				//更改拖动条位置
				$(".music_thumb").css("left",percent+"%");
				//显示当前播放位置
				var minute=parseInt(currentTime/60);
				var second=parseInt(currentTime%60);
				var ms=(currentTime%1).toFixed(1);
				var currentTime_str=(minute<10?("0"+minute):minute)+":"+(second<10?("0"+second):second);
				$(".left_time").text(currentTime_str);
				
			},
			//给下一首按钮绑定事件
			$(".next_song").bind("click",function(){
				audio.audioDom.currentTime=0;
	    		$(".play").attr("class","iconfont icon-044caozuo_bofang play");
	    		$.when(autoplay.auto_play()).done(function(){
					$(".play").click();
				});
	    	});
			
			//给play按钮绑定事件
		    $(".play").click(function(){
		    	if($(".play").hasClass("icon-044caozuo_bofang")){
		    		audio.ispaused=false;
		    		var time=0;
		    		var settime=setInterval(function(){
		    			if(audio.audioDom.readyState!=4){
		    				if(time>10000){
		    					clearInterval(settime);
		    				}else{
		    					time+=200;
		    					return;
		    				}
		    			}
		    			audio.play();
		    			$(".play").attr("class","iconfont icon-046caozuo_tingzhi play");
		    			clearInterval(settime);
		    		},100);
		    	}else{
		    		audio.ispaused=true;
		    		audio.pause();
		    		$(".play").attr("class","iconfont icon-044caozuo_bofang play");
		    	}
		    });
			
		    //歌词样式初始化
		    $(".lyric").mCustomScrollbar({
		    	axis: "y",
		    	mouseWheel:{enable:true},
		    	theme:"dark"
		    });
		    
		    //音量控制器
		    audio.volume();
		    
		    //音乐进度控制器
		    audio.music();
		    
		    
		    
		    
		},
		//播放方法
		play:function(){
			if(audio.audioDom!=null){
				audio.audioDom.play();
			}else{
				console.log("播放器还未初始化");
			}
		},
		//暂停方法
		pause:function(){
			if(audio.audioDom!=null){
				audio.audioDom.pause();
			}else{
				console.log("播放器还未初始化");
			}
		},
		//声音控制器
		volume:function(){
			$(".voice_thumb").mousedown(function(e){
				var $dom=$(this);
				var event=e||window.event;
				//获取鼠标的X位置
				var m_x=event.clientX-4;
				//获取当前dom距父元素的left距离
				var dom_left=this.offsetLeft;
				//获取最大可调距离
				var max_change_length=$(".voice_background").width();
				//获取鼠标移动事件
				document.onmousemove=function(e){
					var event=e||window.event;
					var length=e.clientX-4-m_x+dom_left;//调距=当前鼠标位置-上次鼠标位置+之前音量按钮的left偏移量
					if(length<0){
						length=0;
					}
					if(length>max_change_length){
						length=max_change_length;
					}
					$dom.css("left",length+"px");
					var parcent=length/80;
					$(".voice_track").width(parcent*100+"%");
					audio.audioDom.volume=parcent;
				};
				document.onmouseup=function(){
					document.onmousemove=null;
					document.onmouseup=null;
				};
			});
			
			$(".voice_background").click(function(e){
				var $dom=$(this);
				var event=e||window.event;
				//鼠标点击位置
				var m_x=event.clientX-4;
				//获得当前元素左边框距浏览器左边框距离
				var left_parent=0;
				var parent=this.parentElement;
				while(parent!=document.body){
					left_parent+=parent.offsetLeft;
					parent=parent.parentElement;
				}
				var length=m_x-left_parent;
				var parcent=length/80;
				if(length<0)length=0;
				if(length>80)length=80;
				$(".voice_track").width(parcent*100+"%");
				$(".voice_thumb").css("left",length+"px");
				audio.audioDom.volume=parcent;
			});
			
		},
		
		//初始化上下文
		audioContext:function(){//ie11以上的浏览器才支持 
			//1:音频上下文===html5+ajax+audioContext   html5+audio+audioContext  
			window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
			/*动画执行的兼容写法*/
			window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
			//2:初始化音轨对象
			var audioContext = new window.AudioContext();
			return audioContext;
		},
		
		
		//音乐进度控制器
		music:function(){
			$(".music_thumb").mousedown(function(e){
				var $dom=$(this);
				var event=e||window.event;
				//获取鼠标的X位置
				var m_x=event.clientX-4;
				//获取当前dom距父元素的left距离
				var dom_left=this.offsetLeft;
				//获取最大可调距离
				var max_change_length=$(".music_background").width();
				//获取鼠标移动事件
				document.onmousemove=function(e){
					var event=e||window.event;
					var length=e.clientX-m_x+dom_left;//调距=当前鼠标位置-上次鼠标位置+之前音量按钮的left偏移量
					if(length<0){
						length=0;
					}
					if(length>max_change_length){
						length=max_change_length;
					}
					$dom.css("left",length+"px");
					var parcent=length/450;
					audio.audioDom.currentTime=(audio.audioDom.duration*parcent).toFixed(6);
					$(".music_track").width(parcent*100+"%");
				};
				document.onmouseup=function(){
					document.onmousemove=null;
					document.onmouseup=null;
				};
			});
			
			$(".music_background").click(function(e){
				var $dom=$(this);
				var event=e||window.event;
				//鼠标点击位置
				var m_x=event.clientX-4;
				//获得当前元素左边框距浏览器左边框距离
				var left_parent=0;
				var parent=this.parentElement;
				while(parent!=document.body){
					left_parent+=parent.offsetLeft;
					parent=parent.parentElement;
				}
				var length=m_x-left_parent;
				var parcent=length/450;
				audio.audioDom.currentTime=(audio.audioDom.duration*parcent).toFixed(6);
				if(length<0)length=0;
				if(length>450)length=450;
				$(".music_track").width(parcent*100+"%");
				$(".music_thumb").css("left",length+"px");
			});
			
		},
		
		//音频加载进度
		music_load:function(){
			if(audio.audioDom!=null){
				var times=0;
				while(times<1){
					//获取已经加载的资源的TimeRange
					var timeRanges=audio.audioDom.buffered;
					//获取已缓存的时间
					times=timeRanges.end(timeRanges.length-1);
					//获得加载资源的百分比
					var percent=times/audio.audioDom.duration;
					$(".music_background_load").width(percent+"%");
				}
			}else{
				console.log("播放器为初始化");
			}
		},
		
		//歌词滚动
		lyric_run:function(){
			
		},
}



//音轨
var sound_track={
		$dom:null,
		min_width:40,
		sound_track_items:[],
		//初始化
		init:function(){
			this.$dom=$(".sound_track");
			var box_width=this.$dom.width();
			var items_num=box_width/this.min_width;
			console.log(box_width);
			for(var i=0;i<items_num;i++){
				var item=$("<span class='sound_track_item' style='left:"+i*this.min_width+"'></span>");
				this.sound_track_items.push(item);
				this.$dom.append(item);
			}
		},
		//动态获取窗口大小
		
		mark:false,
		
		parse:function(audioContext,audioDom,callback){
			try{
				//拿到播放器去解析你音乐文件
				var audioBufferSouceNode = audioContext.createMediaElementSource(audioDom);
				/*//创建解析对象
				var analyser = audioContext.createAnalyser();
				//将source与分析器连接
				audioBufferSouceNode.connect(analyser); 
				//将分析器与destination连接，这样才能形成到达扬声器的通路
				analyser.connect(audioContext.destination);
				//调用解析音频的方法
				sound_track.data(analyser,callback);*/
			}catch(e){
				
			}
		},
		
		data:function(analyser,callback){
			if(this.mark){
				//讲音频转换一个数组
				var array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				//通过回调函数返回
				if(callback)callback(array);
				requestAnimationFrame(function(){
					sound_track.data(analyser,callback);
				});
			}
		}
		
	}




//播放列表
var playsheet={
	playsheet:null,//列表id数组
	
	//初始化播放列表
	init:function(){
		if(user==null){
			//没有登录
			$(".control_big_bar_left").hide();
			$(".login_alert").show();
			$(".login_alert").bind("click",function(){
				$(".login").show();
			});
		}else if(user!=null&&user.account_type==1){
			//登录成功，判断为网易云用户还是本站用户
			$(".login_alert").hide();
			$(".login_alert").unbind("click");
			$(".control_big_bar_left").show();
			playsheet.getsheet();
		}
	},
	//获取歌单列表
	getsheet:function(){
		$.ajax({
			url:"/ajax/sheet",
			type:"post",
			data:myFunc(JSON.stringify({"offset":0,"uid":user.uid,"limit":1001,"csrf_token": ""})),
			resultType: "json",
			success:function(data){
				var playsheets=data.playlist;
				playsheet.playsheet=playsheets;
				console.log(playsheets);
				$("#playsheet").html("");
				for(var i=0;i<playsheets.length;i++){
					var dom=$("<li id='"+playsheets[i].sheet_id+"'><div class=\"sheet_item\" style=\"padding:8px 6px;border-left:4px solid #fff;border-bottom:1px solid #f8f8f8;text-align:left;\"><img alt=\""+playsheets[i].sheet_name+"\" src='"+playsheets[i].cover_img_urlString+"' style=\"width:30px;height:30px;vertical-align: middle;\"><span style=\"font-size:12px;display: -webkit-box;-webkit-box-orient: horizontal;-webkit-box-align: center;width:170px;height:30px;float:right;\">"+playsheets[i].sheet_name+"</span></div></li>");
					//为歌单绑定事件
					dom.bind("click",function(){
						//获取歌单详细信息并显示,并添加歌曲到播放列表
						
						playsheet.sheetinfo(this);
						//绑定下一首事件
						$(".next_song").unbind("click");
						$(".next_song").bind("click",function(){
							audio.audioDom.currentTime=0;
				    		$(".play").attr("class","iconfont icon-044caozuo_bofang play");
				    		$.when(song.next()).done(function(){
								$(".play").click();
							});
				    	});
					});
					$("#playsheet").append(dom);
				}
			}
		});
	},
	
	//获取歌单详细信息
	sheetinfo:function(object){
		var sheet_id=$(object).attr("id");
		$.ajax({
			url:"/ajax/sheetinfo",
			type:"post",
			data:myFunc(JSON.stringify({"n":1000,"total":true,"id":sheet_id,"limit":1000,"csrf_token": ""})),
			resultType: "json",
			success:function(data){
				var cover_img_url=data.playlist.coverImgUrl;
				var sheet_name=data.playlist.name;
				var playlist_num=data.playlist.trackCount;
				var plaied_count=data.playlist.playCount;
				var sheet_master_icon=data.playlist.creator.backgroundUrl;
				var sheet_master_name=data.playlist.creator.nickname;
				var time=new Date(data.playlist.createTime);
				var sheet_create_time=time.toLocaleDateString().replace(/\//g, "-") + " " + time.toTimeString().substr(0, 8);
				var tracks=data.playlist.tracks;
				song.playlist=tracks;
				var $playlist=$(".playlist>table>tbody");
				$playlist.children("tr").not(":first").remove();
				for(var i=0;i<tracks.length;i++){
					var id=tracks[i].id;
					var ars=tracks[i].ar;
					var ars_str="";
					for(var j=0;j<ars.length;j++){
						ars_str+=ars[j].name;
					}
					var alia=tracks[i].alia[0]!=null?"("+tracks[i].alia[0]+")":"";
					var al=tracks[i].al.name;
					var minute=parseInt(tracks[i].dt/1000/60);
					var second=parseInt(tracks[i].dt/1000%60);
					var time=(minute<10?("0"+minute):minute)+":"+(second<10?("0"+second):second);
					var $dom=$("<tr id=\"_"+i+"\"><td>"+i+"</td><td><div style='width:250px;height:30px;overflow:hidden;text-overflow: ellipsis;word-break: keep-all;white-space: nowrap;'>"+tracks[i].name+alia+"</div></td><td><div style='width:120px;height:30px;overflow:hidden;text-overflow: ellipsis;word-break: keep-all;white-space: nowrap;'>"+ars_str+"</div></td><td><div style='width:120px;height:30px;overflow:hidden;text-overflow: ellipsis;word-break: keep-all;white-space: nowrap;'>"+al+"</div></td><td>"+time+"</td></tr>");
					//为歌曲绑定事件
					$dom.bind("click",function(){
						var id=parseInt($(this).attr("id").replace("_",""));
						song.songclicked(id);
					});
					$playlist.append($dom);
				}
				$("#cover-img-url").attr("src",cover_img_url);
				$("#sheet-name").text(sheet_name);
				$("#playlist-num>div").text(playlist_num);
				$("#plaied-count>div").text(plaied_count);
				$("#sheet-master-icon").attr("src",sheet_master_icon);
				$("#sheet-master-name").text(sheet_master_name);
				$("#sheet-create-time").text(sheet_create_time);
			}
		});
		$(".song_info").hide();
    	$(".comments").hide();
    	$(".sheet-list-info img")[0].onload=function(){$(".sheet-list").show(300)};
	},
}



//解析歌曲详细信息，绑定事件（歌词、歌曲地址、评论）
var song={
		//当前播放歌曲指针
		pointer:0,
		//当前歌曲列表(json)
		playlist:null,
		//上一首
		prev:function(){
			if(song.pointer<=0){
				return;
			}else if(song.pointer>song.playlist.length-1){
				return;
			}else{
				console.log("上一首");
			}
		},
		//下一首
		next:function(){
			if(song.pointer>song.playlist.length-1){
				
			}else{
				console.log("下一首");
				console.log(song.playlist[song.pointer]);
				song.pointer+=1;
				return song.songclicked(song.pointer);
			}
		},

		//为歌曲绑定点击事件
		songclicked:function(id){
			//从playlist集合中获取id歌曲的信息
			var song_info=song.playlist[id];
			console.log(song_info);
			var alia=song_info.alia[0]!=null?"("+song_info.alia[0]+")":"";
			$(".song_name").text(song_info.name+alia);
			$("#album_name").text(song_info.al.name);
			var ars=song_info.ar;
			var ars_str="";
			for(var j=0;j<ars.length;j++){
				ars_str+=ars[j].name;
			}
			$("#singer").text(ars_str);
			$(".song_img_url").attr("src",song_info.al.picUrl);
			//背景更换为歌曲背景
			background.ChangeBackgroundAnimate(song_info.al.picUrl);
			//获取歌曲详细信息
			song.songinfo(song_info.id);
			//播放
			$(".play").click();
		},
		
		//异步获取歌曲详细信息
		songinfo:function(songid){
			var defer=$.Deferred();
			$.ajax({
				url:"/ajax/lyric",
				type:"post",
				data:myFunc(JSON.stringify({"id":parseInt(songid),"lv":-1,"tv":-1,"csrf_token": ""})),
				resultType: "json",
				success:function(data){
					var lyrics=data.lrc.lyric.match(/[\d+:\d+\\.\d+].+/g);
					var $lyric=$(".lyric ul");
					var $lyric_page=$(".lyric_page ul");
					$lyric.html("");
					$lyric_page.html("");
					lyric.lis_array=null;
					if(lyrics!=null&&lyrics.length!=0){
						lyric.lis_array=new Array();
						for(var i=0 ;i<lyrics.length;i++){
							var lyric_item=lyrics[i].split("]");
							if(lyric_item[1]==null||lyric_item[1]=="")continue;
							var time_m=parseInt((lyric_item[0].split(":"))[0]);
							var time_s=parseInt(lyric_item[0].split(":")[1]);
							var time_ms=parseInt((lyric_item[0].split("."))[1]);
							var time=(time_m*60+time_s*1)*1000+time_ms;
							$lyric.append("<li class='"+time+"'>"+lyric_item[1]+"</li>");
							$lyric_page.append("<li class='"+time+"'>"+lyric_item[1]+"</li>");
							lyric.lis_array.push(time);
						}
					}
				}
			});
			$.ajax({
				url:"/ajax/song_resource",
				type:"post",
				data:myFunc(JSON.stringify({"ids":"["+songid+"]","br":128000,"csrf_token": ""})),
				resultType: "json",
				success:function(data){
					var song_url=data.data[0].url;
					console.log(song_url);
					if(song_url!=null&&song_url!=""){
						audio.audioDom.src=data.data[0].url;
						defer.resolve(data);
					}else{
						
						//歌曲已下架，重写代码
						
						autoplay.auto_play();
					}
				}
			});
			//评论
			/*$.ajax({
				url:"/ajax/comment",
				type:"post",
				data:{"key":JSON.stringify(myFunc(JSON.stringify({"rid":"R_SO_4_"+songid,"offset":"0","total":"true","limit": "20", "csrf_token": ""}))),"song_id":songid},
				resultType: "json",
				success:function(data){
					var comments=data.comments;
					var hotComments=data.hotComments;
					$("#comments").html("");
					$("#hotComments").html("");
					for(var i=0;i<comments.length;i++){
						var time=new Date(comments[i].time);
						var time_str=time.toLocaleDateString().replace(/\//g, "-") + " " + time.toTimeString().substr(0, 8)
						var icon_url=comments[i].user.avatarUrl.trim();
						$("#comments").append("<li><div class=\"comment_item\"><div class=\"comment_item_img\" style=\"float:left;width:30px;height:30px;border-radius: 15px;    margin-left: 8px;\"><img src='"+icon_url+"' width=\"30px\" height=\"30px\" style=\"border-radius: 15px;\"></div><div class=\"comment_item_content\" style=\"width:580px;\"><p style=\"padding-left:60px\"><a style=\"color:#2196f3\">"+comments[i].user.nickname+"</a>:"+comments[i].content+"</p><div style=\"padding-left:60px;margin-top: 10px;color: #8d8a8a;\"><span class=\"time\" style=\"float:left;\">"+time_str+"</span></div></div></div></li>");
					}
					for(var i=0;i<hotComments.length;i++){
						var time=new Date(hotComments[i].time);
						var time_str=time.toLocaleDateString().replace(/\//g, "-") + " " + time.toTimeString().substr(0, 8)
						$("#hotComments").append("<li><div class=\"comment_item\"><div class=\"comment_item_img\" style=\"float:left;width:30px;    margin-left: 8px;height:30px;border-radius: 15px;\"><img src=\""+hotComments[i].user.avatarUrl.trim()+"\" width=\"30px\" height=\"30px\"style=\"border-radius: 15px;\"></div><div class=\"comment_item_content\" style=\"width:580px;\"><p style=\"padding-left:60px\"><a style=\"color:#2196f3\">"+hotComments[i].user.nickname+"</a>:"+hotComments[i].content+"</p><div style=\"padding-left:60px;margin-top: 10px;color: #8d8a8a;\"><span class=\"time\" style=\"float:left;\">"+time_str+"</span><span class=\"iconfont icon-custom-praise praise_num\" style=\"float:right;font-size: 12px;\">"+hotComments[i].likedCount+"</span></div></div></div></li>");
					}
				}
			});*/
			return defer;
		}
}


//歌词
var lyric={
		//歌词记录
		lis_array:null,
		last_or_this:null,
		
		//歌词调整
		jump:function(nowtime){
			
			if(this.lis_array==null||this.lis_array.length<=1)return;
		
			var li_id=parseInt(nowtime.toFixed(3)*1000);
			//当前id对象
			var this_dom=null;
			this_dom=this.lis_array[0];
			//遍历array
			for(var i=this.lis_array.length-1;i>0 ;i--){
				if(nowtime>=this.lis_array[i]){
					this_dom=this.lis_array[i];
					break;
				}
			}
			if(this.last_or_this==null){
				this.last_or_this=this_dom;
			}else if(this.last_or_this!=this_dom){
				$(".lyric_page ."+this.last_or_this+"").css({"color":"rgba(255, 255, 255, 0.9)","font-size":"12px"});
				this.last_or_this=this_dom;
			}else{
				return;
			}
			console.log(this_dom);
			var dom=$(".lyric_page ."+this_dom);
			dom.css({"color":"rgba(255, 0, 0, 0.68)","font-size":"14px"});
			if(dom[0].previousElementSibling!=null){
				dom.prev().css({"color":"rgba(255, 255, 255, 0.9)","font-size":"12px"});
			}
			$(".lyric_page ul").css({"top":150-dom[0].offsetTop+"px"});
			
		},	
}


//随机播放（电台）
var autoplay={
		init:function(){
			//默认电台方式播放音乐
			this.auto_play();
			
			//当电台按钮点击时绑定下一首按钮播放方式
			$("#radio_button").click(function(){
		    	$(".next_song").unbind("click");
		    	$(".next_song").bind("click",function(){
		    		$(".play").attr("class","iconfont icon-044caozuo_bofang play");
		    		$.when(autoplay.auto_play()).done(function(){
						$(".play").click();
					});
		    	});
		    	autoplay.auto_play();
		    	$(".song_info").ready(function(){$(".song_info").show(1000)});
		    	$(".comments").ready(function(){$(".comments").show(1000)});
		    	$(".sheet-list").hide();
		    });
			
		},
		auto_play:function(){
			var defer=$.Deferred();
			$.ajax({
				url:"/ajax/auto_play",
				type:"post",
				resultType: "json",
				success:function(data){
					defer.resolve(data);
					var alia=(data.alia!=null&&data.alia!="[]")?("("+((data.alia.replace("[","")).replace("\"","")).replace("]","")+")"):"";
					$(".song_name").text(data.song_name+alia);
					$("#album_name").text(data.album_name);
					$("#singer").text(data.singer_name.replace("[","").replace("]",""));
					//更改封面
					$(".song_img_url").attr("src",data.album_pic_url);
					//更改歌曲名
					$(".song_name").text(data.song_name);
					//背景更换为歌曲背景
					background.ChangeBackgroundAnimate(data.album_pic_url);
					//获取歌曲详细信息（解析歌曲地址、封面、评论）
					song.songinfo(data.song_id);
				}
			});
			return defer;
		}
}


$(function(){
	//播放器初始化
	audio.init();
	/*//音轨初始化
	sound_track.init();*/
	//如果用户登录，获取播放列表
	playsheet.init();
	//随机播放
	autoplay.init();
    
    $(".song_img_url").click(function(){
    	$(".song_info").toggle();
    	$(".comments").toggle();
    	$(".sheet-list").toggle();
    });
});