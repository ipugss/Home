package chen.me.bean;

import java.sql.Timestamp;

public class Song {
	private int id;
	private String song_id;
	private String song_name;
	private String singer_id;
	private String singer_name;
	private String alia;
	private int pop;
	private String album_id;
	private String album_name;
	private String album_pic_url;
	private Timestamp create_time;
	private String dt;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getSong_id() {
		return song_id;
	}

	public void setSong_id(String song_id) {
		this.song_id = song_id;
	}

	public String getSong_name() {
		return song_name;
	}

	public void setSong_name(String song_name) {
		this.song_name = song_name;
	}

	public String getSinger_id() {
		return singer_id;
	}

	public void setSinger_id(String singer_id) {
		this.singer_id = singer_id;
	}

	public String getSinger_name() {
		return singer_name;
	}

	public void setSinger_name(String singer_name) {
		this.singer_name = singer_name;
	}

	public String getAlia() {
		return alia;
	}

	public void setAlia(String alia) {
		this.alia = alia;
	}

	public int getPop() {
		return pop;
	}

	public void setPop(int pop) {
		this.pop = pop;
	}

	public String getAlbum_id() {
		return album_id;
	}

	public void setAlbum_id(String album_id) {
		this.album_id = album_id;
	}

	public String getAlbum_name() {
		return album_name;
	}

	public void setAlbum_name(String album_name) {
		this.album_name = album_name;
	}

	public String getAlbum_pic_url() {
		return album_pic_url;
	}

	public void setAlbum_pic_url(String album_pic_url) {
		this.album_pic_url = album_pic_url;
	}

	public Timestamp getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Timestamp create_time) {
		this.create_time = create_time;
	}

	public String getDt() {
		return dt;
	}

	public void setDt(String dt) {
		this.dt = dt;
	}

}
