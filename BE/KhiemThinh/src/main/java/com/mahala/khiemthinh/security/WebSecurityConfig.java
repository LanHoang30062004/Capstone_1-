package com.mahala.khiemthinh.security;

import com.mahala.khiemthinh.filter.JwtTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
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
    @Value("${api.prefix}")
    private String path;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                // swagger permitAll
                .requestMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                ).permitAll()

                // login and register
                .requestMatchers(HttpMethod.POST, path + "/user/login").permitAll()
                .requestMatchers(HttpMethod.POST, path + "/user/register").permitAll()

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

                //user
                .requestMatchers(HttpMethod.POST , path+"/user/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH , path+"/user/**").hasAnyRole("ADMIN" , "USER")
                .requestMatchers(HttpMethod.DELETE , path+"/user/**").hasRole("ADMIN")

                // flash card
                .requestMatchers(HttpMethod.POST, path + "/flash-card/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, path + "/flash-card/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, path + "/flash-card/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, path + "/flash-card/**").hasAnyRole("ADMIN", "USER")

                // translate
                .requestMatchers(HttpMethod.POST , path+"/translate/**").hasAnyRole("ADMIN" , "USER")


                .anyRequest().authenticated()
        );
        http.addFilterBefore(this.jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
        http.authenticationProvider(this.authProvider);
        http.csrf(csrf -> csrf.disable());
        http.cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
            @Override
            public void customize(CorsConfigurer<HttpSecurity> corsConfigurer) {
                CorsConfiguration cors = new CorsConfiguration();
                cors.setAllowedOrigins(Arrays.asList("http://localhost:3000" , "http://localhost:63645" , "http://localhost:5173"));
                cors.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                cors.setAllowedHeaders(List.of("Content-Type", "Authorization", "x-auth-token"));
                cors.addExposedHeader("x-auth-token");
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", cors);
                corsConfigurer.configurationSource(source);
            }
        });

        return http.build();
    }
}
