package chen.me.bean;

public class ServerConfiger {
	public static ServerConfiger serverConfiger = new ServerConfiger();
	private String background_Src_Path;
	private String music_Src_Path;

	private ServerConfiger() {
	}

	public String getBackground_Src_Path() {
		return background_Src_Path;
	}

	public void setBackground_Src_Path(String background_Src_Path) {
		this.background_Src_Path = background_Src_Path;
	}

	public String getMusic_Src_Path() {
		return music_Src_Path;
	}

	public void setMusic_Src_Path(String music_Src_Path) {
		this.music_Src_Path = music_Src_Path;
	}

}
