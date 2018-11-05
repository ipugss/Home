package chen.me.core;

import java.sql.Timestamp;
import java.util.ArrayList;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import chen.me.bean.Song;
import chen.me.bean.SongSheet;
import chen.me.bean.User;
import chen.me.dao.SongSheets;
import chen.me.dao.Songs;
import chen.me.dao.Users;

public class SolveNeteaseUser {
	static ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:conf/spring/applicationContext.xml");

	public static boolean IsLoginSuccess(JSONObject body) {
		if (body != null) {
			int code = body.getIntValue("code");
			switch (code) {
			case 200:
				System.out.println("登录成功");
				return true;
			case 502:
				System.out.println("密码错误");
				return false;
			default:
				System.out.println("登录失败");
				return false;
			}
		} else {
			System.out.println("登录失败");
			return false;
		}
	}

	// 解析用户信息
	public static User SolveUserInfo(JSONObject body, String username, String password) {
		JSONObject account = body.getJSONObject("account");
		String uid = account.getString("id");
		JSONObject profile = body.getJSONObject("profile");
		String head_icon = profile.getString("backgroundUrl");
		String nickname = profile.getString("nickname");
		String city = profile.getString("city");
		JSONArray bindings = body.getJSONArray("bindings");
		JSONObject bind1 = (JSONObject) bindings.getJSONObject(0);
		JSONObject bind2 = (JSONObject) bindings.getJSONObject(1);
		JSONObject tokenJsonStr0 = bind1.getJSONObject("tokenJsonStr");
		JSONObject tokenJsonStr1 = bind2.getJSONObject("tokenJsonStr");
		String phone = tokenJsonStr0.getString("cellphone");
		String qqnickname = tokenJsonStr1.getString("nickname");

		Users users = applicationContext.getBean(Users.class);
		User user = users.CheckUserByNeteaseByUid(uid);
		if (user != null) {
			// 有此网易云用户
			users.UpdateUserByNetease(uid, username, password, phone, head_icon, nickname, qqnickname, city, body.toJSONString());
		} else {
			// 没有此网易云用户
			users.AddUserByNetease(1, username, password, uid, phone, head_icon, nickname, qqnickname, city, body.toJSONString());
		}
		return users.CheckUserByNeteaseByUid(uid);
	}

	// 解析用户歌单信息
	public static ArrayList<SongSheet> SolveUserSongSheet(JSONObject body, String uid) {
		JSONArray array = body.getJSONArray("playlist");
		ArrayList<String> songlist = new ArrayList<String>();
		ArrayList<SongSheet> list = new ArrayList<SongSheet>();
		for (Object object : array) {
			JSONObject o = (JSONObject) object;
			String name = o.getString("name");
			long id = o.getLongValue("id");
			long user_id = o.getLongValue("userId");
			Timestamp create_time = o.getTimestamp("createTime");
			Timestamp modify_time = o.getTimestamp("updateTime");
			String url = o.getString("coverImgUrl");
			SongSheets songSheets = applicationContext.getBean(SongSheets.class);
			SongSheet songSheet = songSheets.CheckSheet(id + "");
			if (songSheet != null) {
				songSheets.UpdateSheet(id + "", name, modify_time, url);
			} else {
				songSheets.AddSheet(id + "", name, user_id + "", create_time, modify_time, url);
			}
			list.add(songSheets.CheckSheet(id + ""));
			songlist.add(id + "");
		}
		Users users = applicationContext.getBean(Users.class);
		users.UpdateUserSongSheetByNetease(uid, songlist.toString());
		return list;
	}

	// 解析歌单歌曲信息
	public static void SolveUserSongInfo(JSONObject playListObject, String sheet_id) {
		ArrayList<String> songlist = new ArrayList<String>();
		JSONArray song_items = playListObject.getJSONObject("playlist").getJSONArray("tracks");
		for (Object songobject : song_items) {
			JSONObject body = (JSONObject) songobject;
			String song_name = body.getString("name");
			String song_id = body.getString("id");
			JSONArray singers = body.getJSONArray("ar");
			ArrayList<String> singer_id = new ArrayList<String>();
			ArrayList<String> singer_name = new ArrayList<String>();
			for (Object object : singers) {
				singer_id.add(((JSONObject) object).getString("id"));
				singer_name.add(((JSONObject) object).getString("name"));
			}
			String alia = body.getString("alia");
			double pop = body.getDoubleValue("pop");
			JSONObject al = body.getJSONObject("al");
			String album_id = al.getString("id");
			String album_name = al.getString("name");
			String album_pic_url = al.getString("picUrl");
			int dt = body.getIntValue("dt");
			Timestamp create_time = body.getTimestamp("createTime");
			Songs songs = applicationContext.getBean(Songs.class);
			Song song = songs.CheckSong(song_id);
			if (song != null) {
				songs.UpdateSong(song_id, song_name, singer_id.toString(), singer_name.toString(), alia, pop, album_id, album_name, album_pic_url, dt);
			} else {
				songs.AddSong(song_id, song_name, singer_id.toString(), singer_name.toString(), alia, pop, album_id, album_name, album_pic_url, create_time, dt);
			}
			songlist.add(song_id);
		}
		SongSheets songSheets = applicationContext.getBean(SongSheets.class);
		songSheets.UpdateSheetSong(sheet_id, songlist);
	}

}
