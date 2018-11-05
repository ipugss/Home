package chen.me.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class Index {

	@RequestMapping("/index")
	public String go(HttpServletRequest request, HttpServletResponse response) {

		System.out.println("进来了");
		return "index";
	}
}
