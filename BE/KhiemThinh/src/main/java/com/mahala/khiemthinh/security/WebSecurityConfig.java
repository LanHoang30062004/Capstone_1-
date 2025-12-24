package com.mahala.khiemthinh.security;

import com.mahala.khiemthinh.filter.JwtTokenFilter;
import com.mahala.khiemthinh.util.CustomOAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final DaoAuthenticationProvider authProvider;
    private final JwtTokenFilter jwtTokenFilter;
    private final CustomOAuth2SuccessHandler oAuth2SuccessHandler;

    @Value("${api.prefix}")
    private String path;

    @Bean
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher(path + "/**", "/oauth2/**", "/login/oauth2/**")
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(Arrays.asList(
                            "http://localhost:3000",
                            "http://localhost:5173",
                            "http://localhost:5174",
                            "http://localhost:63645"
                    ));
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("Content-Type", "Authorization", "x-auth-token", "x-requested-with"));
                    config.addExposedHeader("x-auth-token");
                    config.setAllowCredentials(true);
                    config.setMaxAge(3600L);
                    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                    source.registerCorsConfiguration("/**", config);
                    cors.configurationSource(source);
                })

                // QUAN TRỌNG: Thêm session management
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth
                        // CÁC ENDPOINTS PUBLIC - THÊM OAuth2 endpoints
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                path + "/password/**",

                                // QUAN TRỌNG: Thêm OAuth2 endpoints
                                "/oauth2/**",
                                "/login/oauth2/**",

                                // Static resources cho OAuth2
                                "/error",
                                "/favicon.ico"
                        ).permitAll()

                        // login/register
                        .requestMatchers(HttpMethod.POST, path + "/user/login").permitAll()
                        .requestMatchers(HttpMethod.POST, path + "/user/register").permitAll()

                        // user/email - CORRECTED: có 2 dòng giống nhau, sửa lại
                        .requestMatchers(HttpMethod.GET, path + "/user/email").permitAll()

                        // user/check-phone - THÊM endpoint này nếu có
                        .requestMatchers(HttpMethod.GET, path + "/user/check-phone").permitAll()

                        // login with Google API
                        .requestMatchers(HttpMethod.POST, path + "/auth/google").permitAll()

                        // OAuth2 callback từ frontend
                        .requestMatchers(HttpMethod.GET, path + "/auth/oauth2/callback").permitAll()

                        // user profile - cần authenticated
                        .requestMatchers(HttpMethod.GET, path + "/user/profile").hasAnyRole("ADMIN", "USER")

                        // user/email với authentication - chỉ giữ 1 dòng
                        // .requestMatchers(HttpMethod.GET, path + "/user/email").hasAnyRole("ADMIN", "USER")

                        // word
                        .requestMatchers(HttpMethod.POST, path + "/word/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, path + "/word/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, path + "/word/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, path + "/word/**").hasAnyRole("ADMIN", "USER")

                        // topic
                        .requestMatchers(HttpMethod.POST, path + "/topic/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, path + "/topic/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, path + "/topic/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, path + "/topic/**").hasAnyRole("ADMIN", "USER")

                        // user management
                        .requestMatchers(HttpMethod.POST, path + "/user/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, path + "/user/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.DELETE, path + "/user/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, path + "/user/**").hasAnyRole("ADMIN", "USER")

                        // flash card
                        .requestMatchers(HttpMethod.POST, path + "/flash-card/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.PUT, path + "/flash-card/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.DELETE, path + "/flash-card/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.GET, path + "/flash-card/**").hasAnyRole("ADMIN", "USER")

                        // translate
                        .requestMatchers(HttpMethod.POST, path + "/translate/**").hasAnyRole("ADMIN", "USER")

                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(endpoint -> endpoint.baseUri("/oauth2/authorization"))
                        .redirectionEndpoint(endpoint -> endpoint.baseUri("/login/oauth2/code/*"))
                        .successHandler(oAuth2SuccessHandler)
                        .failureUrl("/login?error=true") // Thêm failure handler
                )

                // Xử lý exception cho 403
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.getWriter().write("Access Denied: " + accessDeniedException.getMessage());
                        })
                )

                .authenticationProvider(this.authProvider)
                .addFilterBefore(this.jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}