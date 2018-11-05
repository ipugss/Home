package chen.me.bean;

import java.sql.Timestamp;
import java.util.ArrayList;

public class SongSheet {
	private int id;
	private String sheet_id;
	private String sheet_name;
	private String user_id;
	private Timestamp create_time;
	private Timestamp modify_time;
	private String cover_img_url;
	private String song;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getSheet_id() {
		return sheet_id;
	}

	public void setSheet_id(String sheet_id) {
		this.sheet_id = sheet_id;
	}

	public String getSheet_name() {
		return sheet_name;
	}

	public void setSheet_name(String sheet_name) {
		this.sheet_name = sheet_name;
	}

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public Timestamp getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Timestamp create_time) {
		this.create_time = create_time;
	}

	public Timestamp getModify_time() {
		return modify_time;
	}

	public void setModify_time(Timestamp modify_time) {
		this.modify_time = modify_time;
	}

	public String getCover_img_urlString() {
		return cover_img_url;
	}

	public void setCover_img_urlString(String cover_img_url) {
		this.cover_img_url = cover_img_url;
	}

	public String getSong() {
		return song;
	}

	public void setSong(ArrayList<String> song) {
		this.song = song.toString();
	}
}
