package chen.me.listener;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import chen.me.bean.ImageInfo;
import chen.me.bean.ServerConfiger;
import chen.me.util.ResizeImage;

public class ServerInitListener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {

	}

	/*
	 * 
	 * 服务器初始化
	 * 
	 */

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		/*
		 * 
		 * 初始化资源
		 * 
		 */
		// ServletContext域对象
		ServletContext servletContext = arg0.getServletContext();
		// 服务器配置been
		ServerConfiger serverConfiger = ServerConfiger.serverConfiger;

		// 1.获取服务器xml配置文件，并读取
		String root_path = null;
		try {
			root_path = URLDecoder.decode(servletContext.getRealPath("/"), "utf-8");
			if (root_path == null) {
				System.err.println("服务器路径错误，即将退出。。。");
				System.exit(0);
			} else {
				URL xml_path = servletContext.getResource("/config/index.xml");
				if (xml_path != null) {
					File index_xml = new File(URLDecoder.decode(xml_path.getPath(), "utf-8"));
					SAXReader xmlReader = new SAXReader();
					Document dom = xmlReader.read(index_xml);
					Element root_element = dom.getRootElement();
					// 读取图片资源的路径
					serverConfiger.setBackground_Src_Path(root_element.element("Background-Path").getTextTrim());
					// 读取音乐资源的路径
					serverConfiger.setMusic_Src_Path(root_element.element("Music-Path").getTextTrim());
				} else {
					System.err.println("服务器配置文件未找到，即将退出。。。");
					System.exit(0);
				}
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (DocumentException e) {
			e.printStackTrace();
		}

		// 2.读取图片资源文件夹,存储到ServletContext域
		File background_folder = new File(servletContext.getRealPath(serverConfiger.getBackground_Src_Path()));

		if (background_folder.exists() && background_folder.isDirectory()) {
			HashMap<String, ArrayList<ImageInfo>> background_map = new HashMap<String, ArrayList<ImageInfo>>();
			// 压缩图片并存储
			int toWidth = 220;
			int toHeight = 220;

			File[] files = background_folder.listFiles();
			for (File f : files) {
				if (f.isDirectory()) {
					File[] itemFiles = f.listFiles();
					ArrayList<ImageInfo> list = new ArrayList<ImageInfo>();
					for (File item : itemFiles) {
						if (item.isFile()) {
							ImageInfo imageInfo = new ImageInfo();
							imageInfo.setOriginal_Image(f.getName() + "/" + item.getName());

							String toName = item.getName().split("\\.")[0] + ".thu";
							String toPath = f.getPath() + "/Thumb/";

							File dir = new File(f.getPath() + "/Thumb/");
							if (!dir.exists()) {
								dir.mkdir();
							}
							ResizeImage resizeImage = new ResizeImage(item.getPath(), toName, toPath, toWidth, toHeight, new String[] { "jpg", "png", "gif" });
							ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
							cachedThreadPool.execute(resizeImage);
							imageInfo.setThumbNail_Image(f.getName() + "/Thumb/" + toName);
							list.add(imageInfo);
						}
					}
					background_map.put(f.getName(), list);
				}
			}
			servletContext.setAttribute("background_map", background_map);

		}

	}

}
