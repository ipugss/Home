package chen.me.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.WebApplicationContext;

import com.alibaba.fastjson.JSONObject;

import chen.me.bean.User;
import chen.me.core.NeteaseApi;
import chen.me.core.SolveNeteaseUser;
import chen.me.dao.Users;

public class AutoLoginFilter implements Filter {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest arg0, ServletResponse arg1, FilterChain arg2) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) arg0;
		HttpServletResponse response = (HttpServletResponse) arg1;
		HttpSession session = request.getSession();

		// 查找session中是否有user对象,有对象即用户已登录
		Object object = session.getAttribute("user");
		if (object != null) {

			arg2.doFilter(request, response);
			return;
		}

		Cookie[] cookies = request.getCookies();
		Integer account_type = null;
		Integer login_type = null;
		String username = null;
		String password = null;
		if (cookies != null) {
			for (Cookie c : cookies) {
				if ("username".equals(c.getName())) {
					username = c.getValue();
					continue;
				}
				if ("password".equals(c.getName())) {
					password = c.getValue();
					continue;
				}
				if ("accounttype".equals(c.getName())) {
					account_type = Integer.parseInt(c.getValue());
					continue;
				}
				if ("logintype".equals(c.getName())) {
					login_type = Integer.parseInt(c.getValue());
				}
			}
		}
		// cookie判断
		if (username != null && password != null && account_type != null && login_type != null) {
			ApplicationContext applicationContext = (ApplicationContext) request.getServletContext().getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);
			Users users = applicationContext.getBean(Users.class);
			User user = null;
			if (account_type == 1 && login_type == 1) {
				try {
					JSONObject object2 = NeteaseApi.getNeteaseUserByPhone(username, password);
					if (SolveNeteaseUser.IsLoginSuccess(object2)) {
						user = SolveNeteaseUser.SolveUserInfo(object2, username, password);
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			} else if (account_type == 0) {
				switch (login_type) {
				case 0:
					user = users.CheckUserByUsername(username, password);
					break;
				case 1:
					user = users.CheckUserByPhone(username, password);
					break;
				case 2:
					user = users.CheckUserByEmail(username, password);
					break;
				default:

				}
			}
			// 自动登录成功，在session里面存放user信息
			if (user != null) {
				session.setAttribute("user", user);
				session.setAttribute("loginState", 1);
				session.setAttribute("login_type", login_type);
				session.setAttribute("account_type", account_type);
			} else {
				System.out.println("自动登录失败");
			}
		} else {
			session.setAttribute("loginState", 0);
			session.setAttribute("login_type", -1);
			session.setAttribute("account_type", -1);
			System.out.println("没有保存用户名密码");
		}
		arg2.doFilter(request, response);
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub

	}

}
