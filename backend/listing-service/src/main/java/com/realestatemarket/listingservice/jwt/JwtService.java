// package com.realestatemarket.listingservice.jwt;

// import java.util.ArrayList;
// import java.util.Base64;
// import java.util.Collection;
// import java.util.Collections;
// import java.util.List;
// import java.util.Map;

// import javax.crypto.SecretKey;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service
// ;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.JwtException;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.security.Keys;

// @Service
// public class JwtService {
//     @Value("${jwt.secret}")
//     private String secretKey;

//     @Value("${jwt.issuer}")
//     private String issuer;

//     @Value("${jwt.audience}")
//     private String audience;

//     private SecretKey getSigningKey() {
//         if (secretKey == null || secretKey.trim().isEmpty()) {
//             throw new IllegalStateException("JWT secret key is not configured properly");
//         }
//         return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey));
//     }

//     public Claims decodeToken(String token) throws JwtException {
//         try {
//             Claims claims = Jwts.parser()
//                     .verifyWith(getSigningKey())
//                     .build()
//                     .parseSignedClaims(token)
//                     .getPayload();

//             validateIssuer(claims);
//             validateAudience(claims);

//             return claims;
//         } catch (JwtException e) {
//             throw new JwtException("Invalid JWT token", e);
//         }
//     }

//     private void validateIssuer(Claims claims) {
//         if (!issuer.equals(claims.getIssuer())) {
//             throw new JwtException("Invalid Issuer");
//         }
//     }

//     private void validateAudience(Claims claims) {
//         Object audienceObj = claims.getAudience();
//         if (audienceObj == null) {
//             throw new JwtException("Missing Audience");
//         }
        
//         boolean audienceValid = switch(audienceObj) {
//             case String s -> s.equals(audience);
//             case Collection<?> coll -> coll.contains(audience);
//             default -> false;
//         };
        
//         if (!audienceValid) {
//             throw new JwtException("Invalid Audience");
//         }
//     }
    
//     public List<String> getAuthoritiesFromToken(String token) {
//         Claims claims = decodeToken(token);
//         // Get authorities
//         List<?> authoritiesRaw = claims.get("authorities", List.class);

//         if (authoritiesRaw == null || authoritiesRaw.isEmpty()) {
//             return Collections.emptyList();
//         }

//         List<String> authorities = new ArrayList<>();
//         for (Object item : authoritiesRaw) {
//             if (item instanceof Map) {
//                 // Case map
//                 String authority = ((Map<?, ?>) item).get("authority").toString();
//                 authorities.add(authority);
//             } else if (item instanceof String) {
//                 // Case string
//                 authorities.add((String) item);
//             }
//         }

//         return authorities;
//     }

//     public String getUsernameFromToken(String token) {
//         Claims claims = decodeToken(token);
//         return claims.getSubject(); 
//     }
// }