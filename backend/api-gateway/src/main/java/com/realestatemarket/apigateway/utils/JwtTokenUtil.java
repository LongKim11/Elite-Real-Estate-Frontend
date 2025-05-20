//package com.realestatemarket.apigateway.utils;
//
//import io.jsonwebtoken.*;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import java.util.Date;
//
//@Component
//public class JwtTokenUtil {
//
//    @Value("${jwt.secret}")
//    private String jwtSecret;
//
//    @Value("${jwt.expiration.access}")
//    private long accessTokenExpirationMinutes;
//
//    @Value("${jwt.expiration.refresh}")
//    private long refreshTokenExpirationMinutes;
//
//    @Value("${jwt.issuer}")
//    private String issuer;
//
//    @Value("${jwt.audience}")
//    private String audience;
//
//    public String generateAccessToken(String username, String role) {
//        return generateToken(username, role, accessTokenExpirationMinutes);
//    }
//
//    public String generateRefreshToken(String username) {
//        return generateToken(username, null, refreshTokenExpirationMinutes);
//    }
//
//    private String generateToken(String username, String role, long expirationMinutes) {
//        JwtBuilder builder = Jwts.builder()
//                .setSubject(username)
//                .setIssuer(issuer)
//                .setAudience(audience)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + expirationMinutes * 60 * 1000))
//                .signWith(SignatureAlgorithm.HS512, jwtSecret);
//
//        if (role != null) {
//            builder.claim("role", role);
//        }
//
//        return builder.compact();
//    }
//
//    public Claims getClaimsFromToken(String token) {
//        return Jwts.parser()
//                .setSigningKey(jwtSecret)
//                .parseClaimsJws(token)
//                .getBody();
//    }
//
//    public String getUsernameFromToken(String token) {
//        return getClaimsFromToken(token).getSubject();
//    }
//
//    public String getRoleFromToken(String token) {
//        return getClaimsFromToken(token).get("role", String.class);
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            Claims claims = getClaimsFromToken(token);
//            return issuer.equals(claims.getIssuer()) && audience.equals(claims.getAudience());
//        } catch (JwtException | IllegalArgumentException ex) {
//            return false;
//        }
//    }
//}