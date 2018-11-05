package chen.me.dao;

import java.sql.Timestamp;
import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import chen.me.bean.SongSheet;

public interface SongSheets {
	public SongSheet CheckSheet(@Param("sheet_id") String sheet_id);

	public int AddSheet(@Param("sheet_id") String sheet_id, @Param("sheet_name") String sheet_name, @Param("user_id") String user_id, @Param("create_time") Timestamp create_time, @Param("modify_time") Timestamp modify_time, @Param("cover_img_url") String cover_img_url);

	public int UpdateSheet(@Param("sheet_id") String sheet_id, @Param("sheet_name") String sheet_name, @Param("modify_time") Timestamp modify_time, @Param("cover_img_url") String cover_img_url);

	public int UpdateSheetSong(@Param("sheet_id") String sheet_id, @Param("song") ArrayList<String> song);
}
