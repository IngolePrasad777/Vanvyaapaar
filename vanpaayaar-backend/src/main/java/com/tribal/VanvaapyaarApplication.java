package com.tribal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.tribal")
public class VanvaapyaarApplication {

	public static void main(String[] args) {
		SpringApplication.run(VanvaapyaarApplication.class, args);
        System.out.println("Running");
	}
}
