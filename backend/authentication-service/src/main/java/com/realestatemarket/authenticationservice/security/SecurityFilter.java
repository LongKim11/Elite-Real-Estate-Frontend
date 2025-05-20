package com.realestatemarket.authenticationservice.security;

import com.realestatemarket.authenticationservice.enums.Role;
import com.realestatemarket.authenticationservice.jwt.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityFilter {

    private final AuthenticationProvider authenticationProvider;
    private final JwtFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        HttpMethod [] authorizedMethods =  new HttpMethod[]{HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE};

        // http.cors(cors -> cors
        //         .configurationSource(request -> {
        //             CorsConfiguration config = new CorsConfiguration();
        //             config.setAllowedOrigins(List.of("http://localhost:8200"));
        //             config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        //             config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        //             config.setAllowCredentials(true);
        //             return config;
        //         }));

        http.authorizeHttpRequests(configure -> configure
                .requestMatchers("api/v1/auth/admin/**").hasAuthority(Role.Admin.name())
                .requestMatchers("api/v1/overview-statistics").hasAuthority(Role.Admin.name())
                .requestMatchers("api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/tiers/**").hasAuthority(Role.Admin.name())
                .anyRequest().permitAll()
        );

        http.authenticationProvider(authenticationProvider).addFilterBefore(jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class);

        // disable CSRF
        http.csrf(AbstractHttpConfigurer::disable);

        return http.build();
    }

}