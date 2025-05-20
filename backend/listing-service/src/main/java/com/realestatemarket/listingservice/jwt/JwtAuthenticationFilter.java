// package com.realestatemarket.listingservice.jwt;

// import java.io.IOException;
// import java.util.List;
// import java.util.stream.Collectors;

// import org.springframework.beans.factory.annotation.Configurable;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.web.filter.OncePerRequestFilter;

// import io.jsonwebtoken.JwtException;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;

// @Configurable
// @RequiredArgsConstructor
// public class JwtAuthenticationFilter extends OncePerRequestFilter {
//     private final JwtService jwtService;


//     @Override
//     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
//         throws ServletException, IOException {
        
//         String token = getTokenFromRequest(request);

//         if (token != null && !token.isBlank()) {
//             try {
//                 List<String> authorities = jwtService.getAuthoritiesFromToken(token);
//                 if (authorities != null && !authorities.isEmpty()) {
//                     UsernamePasswordAuthenticationToken authentication = 
//                         new UsernamePasswordAuthenticationToken(
//                             jwtService.getUsernameFromToken(token), 
//                             null, 
//                             authorities.stream()
//                                 .map(SimpleGrantedAuthority::new)
//                                 .collect(Collectors.toList()));
//                     SecurityContextHolder.getContext().setAuthentication(authentication);
//                 }
//             } catch (JwtException e) {
//                 response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Token");
//                 return;
//             }
//         }
        
//         filterChain.doFilter(request, response);
//     }

//     private String getTokenFromRequest(HttpServletRequest request) {
//         String header = request.getHeader("Authorization");
//         if (header != null && header.startsWith("Bearer ")) {
//             return header.substring(7); 
//         }
//         return null;
//     }
// }
