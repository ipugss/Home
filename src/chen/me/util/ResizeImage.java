package chen.me.util;

import java.awt.Image;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGEncodeParam;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

//将图片转换为略缩图
public class ResizeImage implements Runnable {
	String path;
	String toName;
	String toPath;
	int toWidth;
	int toHeight;
	String[] type;

	public ResizeImage(String path, String toName, String toPath, int toWidth, int toHeight, String[] type) {
		this.path = path;
		this.toName = toName;
		this.toPath = toPath;
		this.toWidth = toWidth;
		this.toHeight = toHeight;
		this.type = type;
	}

	/**
	 * @Description: 取得图片对象
	 * @param 要转化的图像的文件夹,就是存放图像的文件夹路径
	 * @date 2017年5月7日10:48:27
	 */
	public BufferedImage zoomImage(String imgName, int toWidth, int toHeight) {

		Map<String, Boolean> map = new HashMap<String, Boolean>();
		for (String s : type) {
			map.put(s, true);
		}
		BufferedImage bufferedImage = null;
		File file = new File(imgName);
		long size = file.length();
		try {
			if (size != 0 && map.get(getExtension(file.getName())) != null) {
				bufferedImage = javax.imageio.ImageIO.read(file);
			}
		} catch (Exception e) {
			bufferedImage = null;
		}
		Double rate = 0.2; // 获取长宽缩放比例
		Image Itemp = bufferedImage.getScaledInstance(bufferedImage.getWidth(), bufferedImage.getHeight(),
				BufferedImage.TYPE_INT_RGB);

		AffineTransformOp ato = new AffineTransformOp(AffineTransform.getScaleInstance(rate, rate), null);
		Itemp = ato.filter(bufferedImage, null);

		return (BufferedImage) Itemp;

	}

	/**
	 * 
	 * @Description: 生成图片
	 * @param String
	 *            path , BufferedImage im, String fileFullPath
	 * @date 2017年5月7日10:48:27
	 */
	public boolean writeHighQuality(String path, BufferedImage im, String fileFullPath) throws IOException {
		// return true;
		FileOutputStream newimage = null;
		try {
			// 输出到文件流
			File file = new File(fileFullPath + path);
			if (file.exists()) {
				return false;
			}
			newimage = new FileOutputStream(file);
			JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(newimage);
			JPEGEncodeParam jep = JPEGCodec.getDefaultJPEGEncodeParam(im);
			// 压缩质量
			jep.setQuality(1f, true);
			encoder.encode(im, jep);
			// 近JPEG编码
			newimage.close();
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 
	 * @Description: 取文件名的后缀
	 * @param String
	 *            fileName 格式如：cn1100000213EA_1_xnl.jpg
	 * @date 2017年5月7日10:48:27
	 */
	public String getExtension(String fileName) {
		try {
			return fileName.split("\\.")[fileName.split("\\.").length - 1];
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public void run() {
		// TODO Auto-generated method stub
		try {
			writeHighQuality(this.toName, zoomImage(path, toWidth, toHeight), toPath);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
