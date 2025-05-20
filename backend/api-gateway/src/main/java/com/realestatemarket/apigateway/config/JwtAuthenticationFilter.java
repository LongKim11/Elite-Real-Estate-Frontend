package com.realestatemarket.apigateway.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    @Value("${jwt.secret}")
    private String secretKey;

    private final ServerSecurityContextRepository securityContextRepository = new WebSessionServerSecurityContextRepository();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = extractToken(exchange.getRequest());
        if (token == null || !isValidToken(token)) {
            return chain.filter(exchange);
        }

        Claims claims = extractClaims(token);
        String username = claims.getSubject();

        // Add claims to security context
        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
            .header("X-User-Id", username)
            .build();

        ServerWebExchange mutatedExchange = exchange.mutate().request(mutatedRequest).build();

        // Handle roles more safely
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        Object rolesClaim = claims.get("authorities");

        if (rolesClaim instanceof String) {
            String roles = ((String) rolesClaim).trim();
            if (!roles.isEmpty()) {
                authorities.add(new SimpleGrantedAuthority(roles));
            }
        } else if (rolesClaim instanceof List) {
            ((List<?>) rolesClaim).stream()
                .filter(Objects::nonNull)
                .map(roleObj -> {
                    if (roleObj instanceof String) {
                        return new SimpleGrantedAuthority((String) roleObj);
                    } else if (roleObj instanceof Map<?, ?> map) {
                        Object authority = map.get("authority");
                        return new SimpleGrantedAuthority(authority.toString());
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .forEach(authorities::add);
                }

                // Create authentication and security context
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        username, null, authorities);

                SecurityContext securityContext = new SecurityContextImpl(authentication);

                // Save to both the repository and reactive context
                return this.securityContextRepository.save(mutatedExchange, securityContext)
                        .then().defer(() -> chain.filter(mutatedExchange)
                                .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(securityContext))));
            }

    private String extractToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        return (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
    }

    private boolean isValidToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
