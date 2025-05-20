// package com.realestatemarket.listingservice.configure;

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
//         CorsConfiguration config = new CorsConfiguration();

//         // // Cho phép CORS cho các dịch vụ frontend và Docker internal
//         // config.setAllowedOriginPatterns(List.of(
//         //     // "http://localhost:5173"  // Thêm frontend vào CORS
//         //     "http://localhost:8200"
//         //     // "http://real-estate-gateway:8200"
//         // ));
        
//         // config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//         // config.setAllowedHeaders(List.of("*"));
//         // config.setExposedHeaders(List.of("Authorization"));
//         // config.setAllowCredentials(true);

//         // UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         // source.registerCorsConfiguration("/**", config);

//         // http
//         //     .csrf(csrf -> csrf.disable())  // Tắt CSRF cho các API stateless
//         //     .cors(cors -> cors.configurationSource(source))
//         //     .authorizeHttpRequests(auth -> auth
//         //         .anyRequest().permitAll()  // Hoặc .authenticated() nếu cần xác thực
//         //     );
//         http
//     .csrf(csrf -> csrf.disable())
//     .authorizeHttpRequests(auth -> auth
//         .anyRequest().permitAll()
//     );

//         return http.build();
//     }
// }

// package com.realestatemarket.listingservice.configure;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable())
//             .authorizeHttpRequests(auth -> auth
//                 .anyRequest().permitAll()
//             );
//         return http.build();
//     }
// }