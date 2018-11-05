package chen.me.web;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.imageio.stream.FileImageInputStream;
import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;

import com.alibaba.fastjson.JSONObject;

import chen.me.bean.ImageInfo;
import chen.me.bean.ServerConfiger;
import chen.me.bean.Song;
import chen.me.bean.SongSheet;
import chen.me.bean.User;
import chen.me.core.NeteaseApi;
import chen.me.core.SolveNeteaseUser;
import chen.me.dao.Songs;
import chen.me.dao.Users;

@Controller
public class Ajax {
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/load_img_resource")
	public Object backgroundimg(HttpServletRequest request, HttpServletResponse response) throws Exception {
		try {
			// 获取域对象
			ServletContext servletContext = request.getServletContext();
			HttpSession session = request.getSession();

			request.setCharacterEncoding("utf-8");
			String type = request.getParameter("type");
			if (type != null) {
				type = URLDecoder.decode(request.getParameter("type"), "utf-8");
			} else {
				return null;
			}
			String name = request.getParameter("filename");
			if (name != null) {
				name = URLDecoder.decode(request.getParameter("filename"), "utf-8");
			}
			if (name != null && !"".equals(name)) { // 获取单张图片或者是略缩图
				String path = ServerConfiger.serverConfiger.getBackground_Src_Path() + type + "/" + name;
				File img_file = new File(path);
				if (img_file.exists()) {// 文件存在
					response.setContentType("image/jpeg");
					OutputStream outputStream = response.getOutputStream();
					FileImageInputStream fileImageInputStream = new FileImageInputStream(img_file);
					byte[] b = new byte[1024];
					int length = 0;
					while ((length = fileImageInputStream.read(b)) != -1) {
						outputStream.write(b, 0, length);
					}
					fileImageInputStream.close();
					outputStream.flush();
					outputStream.close();
				} else {// 文件不存在
					response.setContentType("image/jpeg");
					response.setContentLength(0);
				}
			} else { // 获取略缩图集合
				HashMap<String, ArrayList<ImageInfo>> map = (HashMap<String, ArrayList<ImageInfo>>) servletContext.getAttribute("background_map");
				ArrayList<ImageInfo> list = map.get(type);
				Object obj = session.getAttribute("index");
				int index = obj != null ? (Integer) obj : 0;
				if (!(index < 0 || index >= list.size())) { // 当index小于数组长度时获取数据，并存入session
					List<ImageInfo> subArrayList = null;
					if ((index + 10) <= list.size()) {
						subArrayList = list.subList(index, index + 10);
						session.setAttribute("index", index + 10);
					} else if (index < list.size() - 1 && (index + 10 > list.size())) {
						subArrayList = list.subList(index, list.size() - 1);
						session.setAttribute("index", list.size() - 1);
					} else {
						System.out.println("没有更多了");
					}
					if (subArrayList != null) {
						JSONObject jsonObject = new JSONObject();
						jsonObject.put("val", subArrayList);
						jsonObject.put("index", session.getAttribute("index"));
						System.out.println(jsonObject.toString());
						response.setCharacterEncoding("utf-8");
						response.setContentType("application/json");
						PrintWriter pWriter = response.getWriter();
						pWriter.write(jsonObject.toString());
						pWriter.flush();
						pWriter.close();
						return null;
					}
				} else { // 当超出范围时
					System.out.println("err");
				}
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	/*
	 * 
	 * 获取图片
	 * 
	 * 
	 */
	@ResponseBody
	@RequestMapping(method = RequestMethod.POST, value = "/load_img")
	public void load_img(HttpServletRequest request, HttpServletResponse response) {

		System.out.println("-----!!!!!------");
		response.setCharacterEncoding("utf-8");
		ServletContext servletContext = request.getServletContext();
		HttpSession session = request.getSession();
		HashMap<String, ArrayList<ImageInfo>> map = (HashMap<String, ArrayList<ImageInfo>>) servletContext.getAttribute("background_map");
		ArrayList<ImageInfo> list = map.get("自然风景");
		Object object = session.getAttribute("index");
		int i = 0;
		if (object != null) {
			i = (Integer) object < list.size() - 1 ? (Integer) object + 1 : 0;
		}
		session.setAttribute("index", i);
		String path = "/source/background/" + list.get(i).getOriginal_Image();
		try {
			response.getWriter().write(path);
			response.getWriter().flush();
			response.getWriter().close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	/*
	 * 
	 * 登录
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/login")
	@ResponseBody
	public JSONObject Login(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		// spring工具MD5加密：password =
		// DigestUtils.md5DigestAsHex(password.getBytes());
		// 登录方式：默认用户名登录（0），手机号登录（1），邮箱（2）
		int login_type = Integer.parseInt(request.getParameter("login_type"));
		// 账户类型：默认本站登录（0），表示网易云登录（1）
		int account_type = Integer.parseInt(request.getParameter("account_type"));
		// 是否保持登录
		boolean flag = false;
		flag = Boolean.parseBoolean(request.getParameter("issave"));
		ApplicationContext applicationContext = (ApplicationContext) request.getServletContext().getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);
		Users users = applicationContext.getBean(Users.class);
		User user = null;
		JSONObject object = new JSONObject();
		if (flag) {
			System.out.println("---------保存用户登录------");
			Cookie cookie = new Cookie("username", username);
			cookie.setMaxAge(20 * 24 * 60);
			cookie.setPath("/");
			Cookie cookie2 = new Cookie("password", password);
			cookie2.setMaxAge(20 * 24 * 60);
			cookie2.setPath("/");
			Cookie cookie3 = new Cookie("accounttype", account_type + "");
			cookie3.setMaxAge(20 * 24 * 60);
			cookie3.setPath("/");
			Cookie cookie4 = new Cookie("logintype", login_type + "");
			cookie4.setMaxAge(20 * 24 * 60);
			cookie4.setPath("/");
			response.addCookie(cookie);
			response.addCookie(cookie2);
			response.addCookie(cookie3);
			response.addCookie(cookie4);
		}
		if (account_type == 1 && login_type == 1) {// 网易云用户登录
			try {
				String key = request.getParameter("key");
				object = JSONObject.parseObject(key);
				String params = object.getString("encText");
				String encSecKey = object.getString("encSecKey");
				JSONObject object2 = NeteaseApi.getNeteaseUser(params, encSecKey);// 获取登录信息
				if (SolveNeteaseUser.IsLoginSuccess(object2)) {// 判断是否登录成功
					user = SolveNeteaseUser.SolveUserInfo(object2, username, password);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else if (account_type == 0) {// 本站登录:默认用户名登录（0），手机号登录（1），邮箱（2）
			switch (login_type) {
			case 0:
				System.out.println("username:" + username + "     password:" + password);
				user = users.CheckUserByUsername(username, password);
				break;
			case 1:
				user = users.CheckUserByPhone(username, password);
				break;
			case 2:
				user = users.CheckUserByEmail(username, password);
				break;
			default:

			}
		}
		if (user != null) {
			session.setAttribute("user", user);
			session.setAttribute("loginState", 1);
			session.setAttribute("login_type", login_type);
			session.setAttribute("account_type", account_type);
			object.put("code", 200);
			object.put("account", user);
		} else {
			object.put("code", 502);
			object.put("msg", "");
		}
		return object;
	}

	/*
	 * 
	 * 注册
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/register")
	@ResponseBody
	public Object Register(HttpServletRequest request, HttpServletResponse response) {
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		int register_type = Integer.parseInt(request.getParameter("register_type"));
		ApplicationContext applicationContext = (ApplicationContext) request.getServletContext().getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);
		Users users = (Users) applicationContext.getBean(Users.class);
		int id = 0;
		switch (register_type) {
		case 0:
			id = users.AddUserByUsername(username, password);
			break;
		case 1:
			id = users.AddUserByPhone(username, password);
			break;
		case 2:
			id = users.AddUserByEmail(username, password);
			break;
		default:
			break;
		}
		JSONObject object = new JSONObject();
		if (id == 1) {
			object.put("code", 200);
		} else {
			object.put("code", 502);
		}

		System.out.println("-----------------------------------------------------------");
		return object;
	}

	/*
	 * 
	 * 获取用户的歌单
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/sheet")
	@ResponseBody
	public JSONObject getSongSheet(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();
		JSONObject object = new JSONObject();
		// 判断为什么用户
		int account_type = (Integer) session.getAttribute("account_type");
		if (account_type == 1) {
			String uid = ((User) session.getAttribute("user")).getUid();
			String params = request.getParameter("encText");
			String encSecKey = request.getParameter("encSecKey");
			System.out.println("收到：" + params);
			if (params != null && encSecKey != null) {
				try {
					object = NeteaseApi.getPlaylistOfUser(params, encSecKey);
					ArrayList<SongSheet> list = SolveNeteaseUser.SolveUserSongSheet(object, uid);
					object.put("playlist", list);
				} catch (Exception e) {
					e.printStackTrace();
				}
			} else {
				object.put("code", 502);
				object.put("msg", "");
			}
		} else if (account_type == 0) {

		}

		return object;
	}
	
	/*
	 * 
	 * 获取歌单信息 
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/sheetinfo")
	@ResponseBody
	public JSONObject getSheetInfo(HttpServletRequest request, HttpServletResponse response) {
		String params = request.getParameter("encText");
		String encSecKey = request.getParameter("encSecKey");
		JSONObject object = null;
		try {
			object = NeteaseApi.getDetailOfPlaylist(params, encSecKey);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return object;
	}
	

	/*
	 * 
	 * 随机播放
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/auto_play")
	@ResponseBody
	public Song AutoPlay(HttpServletRequest request, HttpServletResponse response) {
		ApplicationContext applicationContext = (ApplicationContext) request.getServletContext().getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);
		Songs songs = applicationContext.getBean(Songs.class);
		Song song = songs.CheckHotSong((int) Math.ceil(Math.random() * 800));
		return song;
	}

	/*
	 * 
	 * 获取歌词
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/lyric")
	@ResponseBody
	public JSONObject getLyric(HttpServletRequest request, HttpServletResponse response) {
		String params = request.getParameter("encText");
		String encSecKey = request.getParameter("encSecKey");
		JSONObject object = null;
		try {
			object = NeteaseApi.getLyric(params, encSecKey);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return object;
	}

	/*
	 * 
	 * 获取歌曲资源地址
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/song_resource")
	@ResponseBody
	public JSONObject getSongResource(HttpServletRequest request, HttpServletResponse response) {
		String params = request.getParameter("encText");
		String encSecKey = request.getParameter("encSecKey");
		JSONObject object = null;
		try {
			object = NeteaseApi.getSongUrl(params, encSecKey);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return object;
	}

	/*
	 * 
	 * 获取歌曲评论
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/comment")
	@ResponseBody
	public JSONObject getComment(HttpServletRequest request, HttpServletResponse response) {
		JSONObject key = JSONObject.parseObject(request.getParameter("key"));
		String params = key.getString("encText");
		String encSecKey = key.getString("encSecKey");
		String songId = request.getParameter("song_id");
		JSONObject object = null;
		try {
			object = NeteaseApi.getComments(params, encSecKey, songId);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return object;
	}
}
