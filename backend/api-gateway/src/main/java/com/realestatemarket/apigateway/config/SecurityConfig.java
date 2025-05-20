// package com.realestatemarket.apigateway.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
// import org.springframework.security.config.web.server.ServerHttpSecurity;
// import org.springframework.security.web.server.SecurityWebFilterChain;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

// @Configuration
// @EnableWebFluxSecurity
// public class SecurityConfig {

// @Bean
// public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
//     return http
//             .csrf(ServerHttpSecurity.CsrfSpec::disable)
//             .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//             .authorizeExchange(exchanges -> exchanges.anyExchange().permitAll())
//             .build();
// }

// @Bean
// public UrlBasedCorsConfigurationSource corsConfigurationSource() {
//     CorsConfiguration config = new CorsConfiguration();
//     config.setAllowCredentials(true);
//     config.addAllowedOrigin("http://localhost:5173"); // CHỈ 1 origin duy nhất
//     config.addAllowedHeader("*");
//     config.addAllowedMethod("*");
    
//     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//     source.registerCorsConfiguration("/**", config);
//     return source;
// }
// }

package com.realestatemarket.apigateway.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtFilter;
    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(corsSpec -> corsSpec.configurationSource(request -> {
                    var cors = new org.springframework.web.cors.CorsConfiguration();
                    cors.setAllowedOrigins(List.of("http://localhost:5173"));
                    cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    cors.setAllowedHeaders(List.of("*"));
                    cors.setAllowCredentials(true);
                    return cors;
                }))
                .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION) 
                .authorizeExchange(exchanges -> {
                    List<String> publicEndpoints = List.of(
                        "/api/v1/auth/**",
                        "/api/v1/tiers/**",
                        "/api/v1/properties/search",
                        "/api/v1/properties/details/**",
                        "/api/v1/overview-statistics"
                    );                 

                    exchanges
                        .pathMatchers(publicEndpoints.toArray(new String[0])).permitAll()
                        .pathMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/view-schedule").permitAll()
                        .pathMatchers("/api/v1/payment").access((authentication, context) -> 
                            authentication.map(auth -> auth.getAuthorities().stream()
                                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("Admin")) 
                            ).map(AuthorizationDecision::new)
                        )
                        // .pathMatchers("/api/v1/post-payments").access((authentication, context) -> 
                        //     authentication.map(auth -> auth.getAuthorities().stream()
                        //         .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("Admin")) 
                        //     ).map(AuthorizationDecision::new)
                        // )
                        .pathMatchers(HttpMethod.GET, "/api/v1/post-payments").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/view-schedule").access((authentication, context) ->
                            authentication.map(auth -> auth.getAuthorities().stream()
                                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("Admin"))
                            ).map(AuthorizationDecision::new)
                        )
                        .pathMatchers(HttpMethod.DELETE, "/api/v1/view-schedule/*/cancel").authenticated()
                        .pathMatchers(HttpMethod.DELETE, "/api/v1/view-schedule/*").access((authentication, context) ->
                            authentication.map(auth -> auth.getAuthorities().stream()
                                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("Admin"))
                            ).map(AuthorizationDecision::new)
                        )
                        .pathMatchers(HttpMethod.DELETE,"/api/v1/properties/**").access((authentication, context) ->
                            authentication.map(auth -> auth.getAuthorities().stream()
                                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("Admin"))
                            ).map(AuthorizationDecision::new)
                        )
                        .pathMatchers(HttpMethod.GET,"/api/v1/properties/search-by-admin").access((authentication, context) ->
                            authentication.map(auth -> auth.getAuthorities().stream()
                                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("Admin"))
                            ).map(AuthorizationDecision::new)
                        )
                        .pathMatchers(HttpMethod.GET,"/api/v1/user-post-quotas/all").access((authentication, context) ->
                            authentication.map(auth -> auth.getAuthorities().stream()
                                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("Admin"))
                            ).map(AuthorizationDecision::new)
                        )
                        .pathMatchers("/api/v1/post-payments/**").authenticated()
                        .pathMatchers("/api/v1/user-post-quotas/**").authenticated()
                        .pathMatchers("/api/v1/payment/**").authenticated() 
                        .pathMatchers("/api/v1/properties/**").authenticated()
                        .pathMatchers("/api/v1/command/**").authenticated()
                        .pathMatchers("/api/v1/view-schedule/**").authenticated()

                        .anyExchange().authenticated();
                })
                .build();
    }
}
