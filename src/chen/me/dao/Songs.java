package chen.me.dao;

import java.sql.Timestamp;

import org.apache.ibatis.annotations.Param;

import chen.me.bean.Song;

public interface Songs {
	public Song CheckSong(@Param("song_id") String song_id);

	public int AddSong(@Param("song_id") String song_id, @Param("song_name") String song_name, @Param("singer_id") String singer_id, @Param("singer_name") String singer_name, @Param("alia") String alia, @Param("pop") double pop, @Param("album_id") String album_id, @Param("album_name") String album_name,
			@Param("album_pic_url") String album_pic_url, @Param("create_time") Timestamp create_time, @Param("dt") int dt);

	public int UpdateSong(@Param("song_id") String song_id, @Param("song_name") String song_name, @Param("singer_id") String singer_id, @Param("singer_name") String singer_name, @Param("alia") String alia, @Param("pop") double pop, @Param("album_id") String album_id, @Param("album_name") String album_name,
			@Param("album_pic_url") String album_pic_url, @Param("dt") int dt);

	public Song CheckHotSong(@Param("position") int position);
}
