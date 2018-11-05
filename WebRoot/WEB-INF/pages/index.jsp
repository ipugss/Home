<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@page import="com.fasterxml.jackson.core.JsonGenerator"%>
<%@page import="com.alibaba.fastjson.JSONObject"%>
<%@page import="chen.me.bean.User"%>
<%@page import="javax.sound.midi.SysexMessage"%>
<%@page import="chen.me.bean.ImageInfo"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>It's me -- Home</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="chen'sir">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()+"/css/index.css"%>">
	<link rel="stylesheet" type="text/css" href="css/jquery.mCustomScrollbar.css">
	<script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="js/index.js"></script>
	<script type="text/javascript" src="js/core.js"></script>
	<script type="text/javascript" src="js/md5.js"></script>
	<script type="text/javascript" src="js/musi_index.js"></script>
	<script type="text/javascript" src="js/jquery.mCustomScrollbar.js"></script>
	<link rel="stylesheet" type="text/css" href="http://at.alicdn.com/t/font_837114_pk5opmq2ydp.css">
	<script type="text/javascript" src="http://at.alicdn.com/t/font_837114_pk5opmq2ydp.js"></script>
  </head>
  
  <body>
    <%
    	/*  随机释放壁纸   */
    	ServletContext servletContext=request.getServletContext();
    	HashMap<String, ArrayList<ImageInfo>> map=(HashMap<String, ArrayList<ImageInfo>>)application.getAttribute("background_map");
		ArrayList<ImageInfo> list=map.get("自然风景");   	
    	int index=(int) Math.ceil(Math.random()*list.size()-1);
    	String index_background="/source/background/"+list.get(index).getOriginal_Image();
    	/*  获取用户对象，判断是否已登录  */
    	Object object=session.getAttribute("user");
    	User user=null;
		out.write("<script type=\"text/javascript\">\n");
    	if(object!=null){
    		user=(User)object;
    		/*  往js中放入用户信息  */
			out.write("var user="+JSONObject.toJSONString(user));
    	}else{
    		out.write("var user=null");
    	}
		out.write("</script>");
     %>
  	<!-- 背景 start-->
  	<div class="background">
  		<div class="img-src" style="background-image:url(<%=index_background %>);"></div>
  		<div class="hidden-bar"></div>
		<div class="bj-dot-bar">
			<div class="application">
    			<ul>
    				<li id="home"><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-icon-home"></use></svg></li>
    				<li id="music"><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-yinle1"></use></svg></li>
    				<li id="translate"><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-alimt"></use></svg></li>
    				<li><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-social-qq"></use></svg></li>
    				<li><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-social-pengyou"></use></svg></li>
    				<li><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-social-renren"></use></svg></li>
    				<li><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-social-wechat"></use></svg></li>
    				<li><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-social-yelp"></use></svg></li>
    				<li><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-social-tumblr"></use></svg></li>
    				<li><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-social-wordpress"></use></svg></li>
    				<li><svg class="icon-symbol" aira-hidden="true"><use xlink:href="#icon-icon-test"></use></svg></li>
    			</ul>
    		</div>
			<ul>
			</ul>
		</div>
		<div class="lyric_page">
   			<ul>
   			</ul>
   		</div>
   		<!-- <div class="sound_track">
   			
   		</div> -->
  	</div>
  	<!-- 背景 end -->
  	<!-- header start -->
    <div class="header">
    	<div class="header-content">
    		<div class="header-content-left">
    			<ul>
	    			<li><i>C _ Q</i></li>
    				<li><i class="iconfont icon-vertical_line"></i></li>
    				<li><a href="javascript:void(0)"  class="iconfont icon-bokeyuan">博客</a></li>
    				<li><i class="iconfont icon-vertical_line"></i></li>
    				<li><a href="javascript:void(0)" class="iconfont icon-github">Github</a></li>
    				<li><i class="iconfont icon-vertical_line"></i></li>
 					<li><a href="javascript:void(0)" class="iconfont icon-zhihu">乎</a></li>   				
    			</ul>
    		</div>
    		<div class="header-content-right">
    			<ul id="enlarge">
    				<!-- <li><a href="javascript:void(0)"  class="iconfont icon-fanyi" id="translate">翻译</a></li>
    				<li><i class="iconfont icon-vertical_line"></i></li>
    				<li><a href="javascript:void(0)"  class="iconfont icon-yinlemusic217" id="music_access">音乐</a></li>
    				<li><i class="iconfont icon-vertical_line"></i></li> -->
    				
    				<c:choose>
    					<c:when test="${ empty user }">
		    				<li class="can-hide"><a href="javascript:void(0)"  class="iconfont icon-denglu" id="login_access">登录</a></li>
		    				<li class="can-hide"><i class="iconfont icon-vertical_line"></i></li>
		    				<li class="can-hide"><a href="javascript:void(0)" class="iconfont icon-register" id="register_access">注册</a></li>
    					</c:when>
    					
    					<c:otherwise>
							<li><a href='javascript:void(0)'><img class='head_icon' src='${ user.head_icon }'>${ user.nickname }</a></li>	
    					</c:otherwise>
    				</c:choose>
    				
    				<li><i class="iconfont icon-vertical_line"></i></li>
    				<li><a href="javascript:void(0)" class="iconfont icon-shezhi1" id="setting">设置</a></li>
    			</ul>
    			<ul id="narrow">
    				<c:if test="${ not empty user }"><li><a href='javascript:void(0)'><img class='head_icon' src='${ user.head_icon }'>${ user.nickname }</a></li></c:if>
    				<li><i class="iconfont icon-menu2"></i></li>
    			</ul>
    		</div>
    	</div>
    </div>
    <!-- header end -->
    <!-- page-content start -->
   	<div class="page-content">
   		<div class="first_page">
	   		<div class="search-content">
	   			<div class="baidu" style="">
	    			<div class="search-img-content">
	    				<img class="search-img" alt="search-img" src="image/baidu.png">
	    				<div class="select">
	    					<img alt="baidu" src="image/baidu.png">
	    					<img alt="sougou" src="image/sougou.png">
	    					<img alt="biying" src="image/biying.png">
	    				</div>
	    			</div>
	    			<div class="search-input">
	    				<input type="text" name="search-input" />
	    				<i class="iconfont icon-search" style="position:absolute;line-height: 56px;top:0;right:100px;"></i>
	    				<button id="do_search">百度一下</button>
	    			</div>
		    		<div class="key-word"></div>
	   			</div>
	   		</div>
   		</div>
   		<div class="second_page"><h1 align="center">翻译</h1></div>
   		<div class="third_page">
   			<audio id="audio"></audio>
			<div class="song_list_page">
				<div class="radio_station">
					<button class="iconfont icon-xianxing_diantai" id="radio_button">音乐电台</button>
					<ul id="playsheet">
						<li>
							<div class="sheet_item" style="position:relative;">
								<span style="position:absolute;top:3px;left:0px;right:0px;text-align:center;font-size:12px;vertical-align: middle;line-height: 60px;">列表空空如也，去听听电台吧</span>
							</div>
						</li>
					</ul>
					<div class="login_alert">
						<span class="iconfont icon-exclamation" id="alert_icon"></span>
						<span id="alert_msg">您还未登录呦点击登录</span>
					</div>
					<div class="control_big_bar_left">
						<div class="m1">
							<img class="song_img_url" alt="" src="" style="width:42px;height:42px;padding:6px;margin-left: 4px;vertical-align: middle;cursor:pointer;">
							<i class="song_name" style="color:#999;"></i>
						</div>
						<div class="m2">
							<span class="iconfont icon-044caozuo_bofang play"></span>
							<span class="iconfont icon-49xiayishou next_song" style="font-size:16px;"></span>
						</div>
					</div>
				</div>
				<div class="sheet_info">
					<div class="song_info">
						<div class="control_bar">
							<img class="song_img_url" src="" style="">
							<ul id="control_bar">
								<li class="iconfont icon-heart" id="love"></li>
								<li class="iconfont icon-044caozuo_bofang play"></li>
								<li class="iconfont icon-49xiayishou next_song"></li>
								<li class="iconfont icon-menu3" id="more"></li>
							</ul>
						</div>
						<div class="song_more_info">
							<div>
								<table cellspacing="10px;" cellpadding="10px;" >
									<tr>
										<th style="width:20px"></th>
										<th style="width:44px"></th>
										<th style="width:270px"></th>
									</tr>
									<tr>
										<td class="iconfont icon-yinletianchong" style="color: #6f6f6f;font-size: 20px;"></td>
										<td style="color: #6f6f6f;font-size: 12px;">曲名：</td>
										<td class="song_name" style="color: #6f6f6f;font-size: 12px;">Changing [Goldsmyth Edition]</td>
									</tr>
									<tr>
										<td class="iconfont icon-zhuanji" style="color: #6f6f6f;font-size: 20px;"></td>
										<td style="color: #6f6f6f;font-size: 12px;">专辑：</td>
										<td id="album_name" style="color: #6f6f6f;font-size: 12px;"></td>
									</tr>
									<tr>
										<td class="iconfont icon-huatong1" style="color: #6f6f6f;font-size: 20px;"></td>
										<td style="color: #6f6f6f;font-size: 12px;">歌手：</td>
										<td id="singer" style="color: #6f6f6f;font-size: 12px;"></td></tr>
								</table>
								<div class="lyric content">
									<ul>
										
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="comments">
						<span>精彩评论</span>
						<div class="comments_content">
							<ul id="comments">
								
							</ul>
						</div>
						
						<span>最新评论</span><span style="font-size: 8px;"></span>
						<div class="comments_content">
							<ul id="hotComments">
								
							</ul>
						</div>
					</div>
					<div class="sheet-list" style="display:none;">
						<div class="sheet-list-info">
							<img alt="" src="" id="cover-img-url">
							<div class="sheet-list-more-info">
								<div style="height:80px;margin-top: 25px;">
									<div style="float:left;width:200px;height:80px;">
										<span style="width:50px;height:40px;border:1px solid #ae2121;border-radius: 2px;font-size:12px;padding:0px 3px;color:#ae2121;vertical-align: middle;">歌单</span>
										<span id="sheet-name"></span>
									</div>
									<div style="width:120px;height:80px;float:right;padding-top:4px;margin-right: 20px;">
										<table style="font-size: 12px;text-align: right;color:#797979;" cellspacing="0">
											<tr>
												<th style="width:50px;"></th>
												<th style="width:50px;"></th>
											</tr>
											<tr>
												<td style="border:none;border-right:1px solid #ffcfcf;padding-right:6px;">歌曲数</td>
												<td style="padding-left:6px;">播放数</td>
											</tr>
											<tr>
												<td id="playlist-num"><div style="width:50px;height:30px;overflow:hidden;text-overflow: ellipsis;word-break: keep-all;white-space: nowrap;"></div></td>
												<td id="plaied-count"><div style="width:50px;height:30px;overflow:hidden;text-overflow: ellipsis;word-break: keep-all;white-space: nowrap;"></div></td>
											</tr>
										</table>
									</div>
								</div>
								
								<div style="height:20px;font-size:10px;">
									<img id="sheet-master-icon" alt="" src="">
									<span id="sheet-master-name"></span>
									<span id="sheet-create-time"></span>
								</div>
								
								<div style="height:50px;margin-top:30px;">
									<button class="iconfont icon-tubiaozhizuomoban" style="border:1px solid #fff;cursor:pointer;width:100px;height:30px;border-radius:4px;text-align: center;color:#fff;font-size:12px;outline:none;background:#da3b3b">全部播放</button>
								</div>
							</div>
						</div>
						
						<div class="playlist">
							<table cellspacing="0">
								<tr style="height:30px;">
									<th style="width:40px;text-align:left;">序号</th>
									<th style="width:250px;text-align:left;">歌曲名</th>
									<th style="width:120px;text-align:left;">歌手</th>
									<th style="width:120px;text-align:left;">专辑</th>
									<th style="width:50px;text-align:left;">时长</th>
								</tr>
							</table>
						</div>
					</div>
				</div>
				<div class="seekbar">
					<div class="left_time">
						00:00
					</div>
					<div class="music_bar">
						<div class="music_background">
							<div class="music_background_load"></div>
							<div class="music_track"></div>
							<div class="music_thumb"></div>
						</div>
					</div>
					<div class="right_time">
						04:30
					</div>
					<div class="voice_bar iconfont icon-shengyin">
						<div style="width:80px;height:40px;position:absolute;top:0px;left:18px;">
							<div class="voice_background">
								<div class="voice_track"></div>
								<div class="voice_thumb"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
   	</div>
    <!-- page-content end -->
    
    <!-- login start -->
    <div class="login">
    	<div class="login-hidden"></div>
    	<div class="login-content">
    		<i class="iconfont icon-shanchu close"></i>
    		<div style="line-height:40px;text-align:center;margin:auto;color:#a7a7a7;font-weight:600;">登录</div>
    		<div class="login-content-input" style="margin-top:44px;">
    			<span class="login-alert">用户名/手机号码/邮箱</span>
				<span class="iconfont icon-close clear"></span>
	   			<input type="text" name="username" autocomplete="off" id="login-username"/>
    		</div>
    		<div class="login-content-input">
    			<span class="login-alert">密码</span>
				<span class="iconfont icon-close clear"></span>
	   			<input type="text" name="password" autocomplete="off" id="login-password"/>
    		</div>
    		<div class="login-other">
    			<span class="login-other-left">
    				没有账号？<a href="javascript:void(0)">去注册</a>
    			</span>
    			<input type="checkbox" name="issave" checked="checked" style="float: left;margin: 3px 0;">
    			<span class="login-other-right">记住密码</span>
	    		<button id="login-go">登  录</button>
    		</div>
    		<div class="fast_login_bar">
    			<span>
	    			<a href="javascript:void(0)" class="iconfont icon-CN_NetEasemusic" id="netease_login"></a><br>
	    			<span style="font-size: 8px;color: rgba(109, 5, 5, 0.71);">网易云账号登录</span>
    			</span>
    		</div>
    		
    	</div>
    </div>
    <!-- login end -->
    
    
    <!-- register start  -->
    <div class="register" style="display:none;">
    	<div class="register-hidden"></div>
    	<div class="register-content">
    		<i class="iconfont icon-shanchu close"></i>
    		<div style="line-height:40px;text-align:center;margin:auto;color:#a7a7a7;font-weight:600;">注册</div>
    		<div class="register-content-input">
    			<span class="register-alert">支持手机号码或者邮箱</span>
				<span class="iconfont icon-close clear"></span>
	   			<input type="text" name="username" autocomplete="off"/>
    		</div>
    		<div class="register-content-input">
    			<span class="register-alert">请输入密码</span>
				<span class="iconfont icon-close clear"></span>
	   			<input type="text" name="password" autocomplete="off"/>
    		</div>
    		<div class="register-content-input">
    			<span class="register-alert">确认密码</span>
				<span class="iconfont icon-close clear"></span>
	   			<input type="text" name="password" autocomplete="off"/>
    		</div>
    		<div class="register-other">
    			<span class="register-other-left">
    				已有账号？<a href="javascript:void(0)">去登录</a>
    			</span>
	    		<button id="register-go">注  册</button>
    		</div>
    		
    	</div>
    </div>
    <!-- register end  -->
    
    <!-- setting start  -->
    <div class="setting">
    	<div class="background-setting">
    		<div>外观设置</div>
    		<ul>
    			<li id="background-setting-item-use-opacity">
    				<div class="background-setting-item-left">
	    				透明度
	    			</div>
	    			<div class="background-setting-item-right">
	    				<div class="opacity-bar-background">
	    					<div class="opacity-bar-track"></div>
	    					<div class="opacity-bar-thumb"></div>
	    				</div>
	    			</div>
    			
    			</li>
    			<li id="background-setting-item-use-blur">
    				<div class="background-setting-item-left">
	    				模糊度
	    			</div>
	    			<div class="background-setting-item-right">
	    				<div class="blur-bar-background">
	    					<div class="blur-bar-track"></div>
	    					<div class="blur-bar-thumb"></div>
	    				</div>
	    			</div>
    			</li>
    			<li id="background-setting-item-use-coverUrl">
    				<div class="background-setting-item-left">
	    				使用音乐可视化壁纸
	    			</div>
	    			<div class="background-setting-item-right iconfont icon-big-circle" style="width:50px;"></div>
    			</li>
    		</ul>
    		
    	</div>
    
    
    	<div class="search-setting">
    		<div>搜索页设置</div>
	    	<ul>
	    		<li id="search-setting-item-choice">
	    			<div class="search-setting-item-left">
	    				默认搜索引擎
	    			</div>
	    			<div class="search-setting-item-right">
	    				<div class="choiced">百度</div>
	    				<div class="unchoiced">搜狗</div>
	    				<div class="unchoiced">必应</div>
	    			</div>
	    		</li>
	    	</ul>
    	</div>
    </div>
    <!-- setting end  -->
  </body>
</html>
