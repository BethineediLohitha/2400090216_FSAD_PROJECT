package com.loan.config;

import com.loan.entity.User;
import com.loan.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                userRepository.save(new User("admin", "admin@loan.com", encoder.encode("admin123"), "ROLE_ADMIN"));
            }
            if (!userRepository.existsByUsername("lender1")) {
                userRepository.save(new User("lender1", "lender1@loan.com", encoder.encode("lender123"), "ROLE_LENDER"));
            }
            if (!userRepository.existsByUsername("borrower1")) {
                userRepository.save(new User("borrower1", "borrower1@loan.com", encoder.encode("borrower123"), "ROLE_BORROWER"));
            }
            if (!userRepository.existsByUsername("analyst1")) {
                userRepository.save(new User("analyst1", "analyst1@loan.com", encoder.encode("analyst123"), "ROLE_ANALYST"));
            }
        };
    }
}
