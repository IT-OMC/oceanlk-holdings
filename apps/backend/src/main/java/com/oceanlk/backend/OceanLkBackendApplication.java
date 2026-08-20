package com.oceanlk.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OceanLkBackendApplication {

	public static void main(String[] args) {
		try {
			String envPath = new java.io.File(".env").exists() ? "./" : 
					(new java.io.File("apps/backend/.env").exists() ? "./apps/backend/" : null);
			
			if (envPath != null) {
				Dotenv dotenv = Dotenv.configure()
						.directory(envPath)
						.ignoreIfMissing()
						.load();
				dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
			}
		} catch (Exception e) {
			System.err.println(
					"Warning: .env file could not be loaded. Falling back to environment variables and defaults. "
							+ e.getMessage());
		}

		SpringApplication.run(OceanLkBackendApplication.class, args);
	}

}
