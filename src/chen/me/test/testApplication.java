package chen.me.test;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import chen.me.dao.Users;

public class testApplication {

	@Test
	public void test() {
		ApplicationContext context = new ClassPathXmlApplicationContext("classpath:conf/spring/applicationContext.xml");
		ComboPooledDataSource source = context.getBean(ComboPooledDataSource.class);
		SqlSessionFactory sqlSessionFactory = context.getBean(SqlSessionFactory.class);
		SqlSession session = sqlSessionFactory.openSession(true);
		Users users = (Users) context.getBean(Users.class);

		// users.Check(user);

		// List<User> users = session.selectList("chen.me.dao.Users.users");
		// Users users = (Users) context.getBean("users");
		// for (User user : users.users()) {
		// System.out.println(user.getId() + " ----- " + user.getNickname());
		// }
	}
}
