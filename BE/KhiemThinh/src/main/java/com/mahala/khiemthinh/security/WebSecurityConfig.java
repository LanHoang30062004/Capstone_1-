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
    private final CustomOAuth2SuccessHandler oAuth2SuccessHandler; // 👈 thêm success handler

    @Value("${api.prefix}")
    private String path;

    @Bean
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**") // 👈 chỉ áp dụng cho API
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(Arrays.asList(
                            "http://localhost:3000",
                            "http://localhost:5173",
                            "http://localhost:63645"
                    ));
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("Content-Type", "Authorization", "x-auth-token"));
                    config.addExposedHeader("x-auth-token");
                    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                    source.registerCorsConfiguration("/**", config);
                    cors.configurationSource(source);
                })
                .authorizeHttpRequests(auth -> auth
                        // swagger permitAll
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                path + "/password/**"
                        ).permitAll()

                        // login/register
                        .requestMatchers(HttpMethod.POST, path + "/user/login").permitAll()
                        .requestMatchers(HttpMethod.POST, path + "/user/register").permitAll()

                        // user/email
                        .requestMatchers(HttpMethod.GET, path + "/user/email").permitAll()

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

                        // user
                        .requestMatchers(HttpMethod.POST, path + "/user/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, path + "/user/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.DELETE, path + "/user/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, path + "/user/**").hasAnyRole("ADMIN", "USER")

                        // flash card
                        .requestMatchers(HttpMethod.POST, path + "/flash-card/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, path + "/flash-card/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, path + "/flash-card/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, path + "/flash-card/**").hasAnyRole("ADMIN", "USER")

                        // translate
                        .requestMatchers(HttpMethod.POST, path + "/translate/**").hasAnyRole("ADMIN", "USER")

                        .anyRequest().authenticated()
                )
                .authenticationProvider(this.authProvider)
                .addFilterBefore(this.jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public SecurityFilterChain oauth2SecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/oauth2/**", "/login/oauth2/**")
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(endpoint -> endpoint.baseUri("/oauth2/authorization"))
                        .redirectionEndpoint(endpoint -> endpoint.baseUri("/login/oauth2/code/*"))
                        .successHandler(oAuth2SuccessHandler)
                );
        return http.build();
    }

}
