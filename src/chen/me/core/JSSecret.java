package chen.me.core;

import java.io.File;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.HashMap;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import jdk.nashorn.api.scripting.ScriptObjectMirror;

/*
 * 
 * 读取js文件
 * 
 */

public class JSSecret {
	private static Invocable inv;
	public static final String encText = "encText";
	public static final String encSecKey = "encSecKey";

	/**
	 * 从本地加载修改后的 js 文件到 scriptEngine
	 */
	static {
		try {
			String filepath = JSSecret.class.getResource("/core.js").getPath();
			filepath = URLDecoder.decode(filepath, "utf-8");
			File file = new File(filepath);
			Path path = file.toPath();
			byte[] bytes = Files.readAllBytes(path);
			String js = new String(bytes);
			ScriptEngineManager factory = new ScriptEngineManager();
			ScriptEngine engine = factory.getEngineByName("JavaScript");
			engine.eval(js);
			inv = (Invocable) engine;

			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			System.out.println(simpleDateFormat.format(System.currentTimeMillis()) + "：netease init completed");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static ScriptObjectMirror get_params(String paras) throws Exception {
		ScriptObjectMirror so = (ScriptObjectMirror) inv.invokeFunction("myFunc", paras);
		return so;
	}

	public static HashMap<String, String> getDatas(String paras) {
		try {
			ScriptObjectMirror so = (ScriptObjectMirror) inv.invokeFunction("myFunc", paras);
			HashMap<String, String> datas = new HashMap<>();
			datas.put("params", so.get(JSSecret.encText).toString());
			datas.put("encSecKey", so.get(JSSecret.encSecKey).toString());

			return datas;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
