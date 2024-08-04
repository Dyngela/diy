package kroely.diy.mystock.datasources;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

import javax.sql.DataSource;
import java.io.File;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import com.moandjiezana.toml.Toml;
import java.util.List;

@Configuration
public class MultitenantConfiguration {

    @Value("${defaultTenant}")
    private String defaultTenant;

    @Bean
    @ConfigurationProperties(prefix = "tenants")
    public DataSource dataSource() {
        File tomlFile = Paths.get("services/database-provider.toml").toFile();
        Map<Object, Object> resolvedDataSources = new HashMap<>();

        if (tomlFile.exists()) {
            Toml toml = new Toml().read(tomlFile);
            List<Map<String, String>> databases = toml.getList("databases");

            for (Map<String, String> dbConfig : databases) {
                String tenantId = dbConfig.get("uuid");
                DataSourceBuilder<?> dataSourceBuilder = DataSourceBuilder.create();

                dataSourceBuilder.driverClassName("org.postgresql.Driver");
                dataSourceBuilder.url(String.format("jdbc:postgresql://%s:%s/%s", dbConfig.get("host"), dbConfig.get("port"), dbConfig.get("dbname")));
                dataSourceBuilder.username(dbConfig.get("user"));
                dataSourceBuilder.password(dbConfig.get("password"));
                resolvedDataSources.put(tenantId, dataSourceBuilder.build());
            }
        } else {
            throw new RuntimeException("TOML file not found at path: " + tomlFile.getAbsolutePath());
        }

        AbstractRoutingDataSource dataSource = new MultitenantDataSource();
        dataSource.setDefaultTargetDataSource(resolvedDataSources.get(defaultTenant));
        dataSource.setTargetDataSources(resolvedDataSources);

        dataSource.afterPropertiesSet();
        return dataSource;
    }
}
