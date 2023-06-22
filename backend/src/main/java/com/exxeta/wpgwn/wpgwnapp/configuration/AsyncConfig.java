package com.exxeta.wpgwn.wpgwnapp.configuration;

import java.lang.reflect.Method;
import java.util.concurrent.Executor;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableAsync
@Slf4j
public class AsyncConfig implements AsyncConfigurer {

    private final int maxPoolSize = 10;
    private final int corePoolSize = 5;
    private final int queueCapacity = 10;
    private final int awaitTerminationSeconds = 900;

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix("Async-Executor");
        executor.setMaxPoolSize(maxPoolSize);
        executor.setCorePoolSize(corePoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(awaitTerminationSeconds);
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {

        return new AsyncUncaughtExceptionHandler() {
            @Override
            public void handleUncaughtException(Throwable ex, Method method, Object... params) {
                log.error("Exception in asynchronous execution - " + ex.getMessage(), ex);
                log.error("Method name - " + method.getName());
                for (Object param : params) {
                    log.error("Parameter value - " + param);
                }

            }
        };
    }
}
