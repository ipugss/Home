package chen.me.dao;

import org.apache.ibatis.annotations.Param;

import chen.me.bean.User;

public interface Users {
	/*
	 * 检查数据库是否存在此用户名用户
	 */
	public User CheckUserByUsername(@Param("username") String username, @Param("password") String password);

	/*
	 * 检查数据库是否存在此手机号用户
	 */
	public User CheckUserByPhone(@Param("phone") String phone, @Param("password") String password);

	/*
	 * 检查数据库是否存在此邮箱用户
	 */
	public User CheckUserByEmail(@Param("email") String email, @Param("password") String password);

	/*
	 * 检查数据库是否存在此网易用户
	 */
	public User CheckUserByNeteaseByUid(@Param("uid") String uid);

	/*
	 * 添加用户名用户
	 */
	public int AddUserByUsername(@Param("username") String username, @Param("password") String password);

	/*
	 * 添加手机号用户
	 */
	public int AddUserByPhone(@Param("phone") String phone, @Param("password") String password);

	/*
	 * 添加邮箱用户
	 */
	public int AddUserByEmail(@Param("email") String email, @Param("password") String password);

	/*
	 * 添加网易云用户
	 */
	public int AddUserByNetease(@Param("account_type") int account_type, @Param("netease_username") String username, @Param("netease_password") String password, @Param("uid") String uid, @Param("netease_phone") String phone, @Param("head_icon") String head_icon, @Param("netease_nickname") String nickname,
			@Param("qqnickname") String qqnickname, @Param("city") String city, @Param("netease_info") String netease_info);

	/*
	 * 更新网易云用户账号信息
	 */
	public void UpdateUserByNetease(@Param("uid") String uid, @Param("netease_username") String username, @Param("netease_password") String password, @Param("netease_phone") String phone, @Param("head_icon") String head_icon, @Param("netease_nickname") String nickname, @Param("qqnickname") String qqnickname,
			@Param("city") String city, @Param("netease_info") String netease_info);

	/*
	 * 更新网易云用户账号信息
	 */
	public void UpdateUserSongSheetByNetease(@Param("uid") String uid, @Param("song_sheet_id") String song_sheet_id);

}
