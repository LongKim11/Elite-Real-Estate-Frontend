// package com.realestatemarket.salesservice.configure;

// import java.util.List;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         // Create a CORS configuration
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         CorsConfiguration config = new CorsConfiguration();
        
//         // Add allowed origins
//         config.setAllowedOrigins(List.of(
//             "http://localhost:8200",    
//             "http://api-gateway:8200"    
//         ));
        
//         // Allow credentials (cookies, authorization headers, etc.)
//         config.addAllowedMethod("*");
//         config.addAllowedHeader("*");
//         config.setAllowCredentials(true);
        
//         // Apply the CORS configuration to all endpoints
//         source.registerCorsConfiguration("/**", config);
        
//         // Configure the security filter chain
//         http
//             .csrf(csrf -> csrf.disable()) 
//             .cors(cors -> cors.configurationSource(source)) 
//             .authorizeHttpRequests(auth -> auth
//                 .anyRequest().permitAll()
//             );
        
//         return http.build();
//     }
    
// }

