package com.sammyibrahim20.playground;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PlaygroundApplication {
    private static final Logger log = LoggerFactory.getLogger(PlaygroundApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(PlaygroundApplication.class, args);
        log.info("Gig Booking App started...");
    }
}
