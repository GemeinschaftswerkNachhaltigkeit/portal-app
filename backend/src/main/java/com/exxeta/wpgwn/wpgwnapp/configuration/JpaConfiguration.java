package com.exxeta.wpgwn.wpgwnapp.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.envers.repository.config.EnableEnversRepositories;
import org.springframework.data.envers.repository.support.EnversRevisionRepositoryFactoryBean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.exxeta.wpgwn.wpgwnapp.WpgwnAppApplication;

@Configuration
@EnableJpaAuditing
@EnableTransactionManagement
@EnableJpaRepositories(repositoryFactoryBeanClass = EnversRevisionRepositoryFactoryBean.class,
        basePackageClasses = WpgwnAppApplication.class)
@EnableEnversRepositories
public class JpaConfiguration {
}
