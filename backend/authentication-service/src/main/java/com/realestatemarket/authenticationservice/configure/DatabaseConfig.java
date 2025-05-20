package com.realestatemarket.authenticationservice.configure;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.io.IOException;
import java.util.Properties;

@Configuration
public class DatabaseConfig {
    private static DataSource dataSource;

    // Singleton Pattern
    @Bean
    public static DataSource getDataSource() throws IOException {
        if (dataSource == null) {
            synchronized (DatabaseConfig.class) {
                if (dataSource == null) {
                    // Read data
                    Properties props = new Properties();
                    Resource resource = new ClassPathResource("db.properties");
                    props.load(resource.getInputStream());

                    // Create database
                    DriverManagerDataSource ds = new DriverManagerDataSource();
                    ds.setUrl(props.getProperty("db.url"));
                    ds.setUsername(props.getProperty("db.username"));
                    ds.setPassword(props.getProperty("db.password"));
                    ds.setDriverClassName(props.getProperty("db.driver"));

                    dataSource = ds;
                }
            }
        }
        return dataSource;
    }
}
