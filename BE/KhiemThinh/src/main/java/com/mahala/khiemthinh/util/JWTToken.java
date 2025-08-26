package com.mahala.khiemthinh.util;

import com.mahala.khiemthinh.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JWTToken {
    @Value("${jwt.expiration}")
    private Integer expiration;

    @Value("${jwt.secretKey}")
    private String secretKey;

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("fullName", user.getFullName());
        claims.put("role", user.getRole().getRoleName());
        try {
            String token = Jwts.builder()
                    .setClaims(claims)
                    .setSubject(user.getEmail())
                    .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000L))
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();
            return token;
        } catch (Exception e) {
            log.error("Can not generate token , error = {} ", e.getMessage());
            return null;
        }
    }

    public Key getSignInKey() {
        byte[] bytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(bytes);
    }

    private Claims extractToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractToken(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenExpired(String token) {
        final Date expirationDate = this.extractClaim(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }

    public String extractEmail(String token) {
        return this.extractClaim(token, Claims::getSubject);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String email = this.extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
