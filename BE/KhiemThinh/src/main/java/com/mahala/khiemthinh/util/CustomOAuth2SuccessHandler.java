package com.mahala.khiemthinh.util;

import com.mahala.khiemthinh.model.Role;
import com.mahala.khiemthinh.model.User;
import com.mahala.khiemthinh.repository.RoleRepository;
import com.mahala.khiemthinh.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Null;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JWTToken jwtToken ;
    private final UserRepository userRepository;
    private  final RoleRepository roleRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String state = request.getParameter("state");

        String email = oAuth2User.getAttribute("email"); // Google có email
        if (email == null) {
            email = oAuth2User.getAttribute("login"); // GitHub có "login"
        }
        if (email == null || email.isEmpty()) {
            Role role = this.roleRepository.findById(1L).orElse(null);
            User oldUser = this.userRepository.findByEmail(email).orElse(null);
            if (oldUser == null) {
                User newUser = new User();
                newUser.setRole(role);
                newUser.setEmail(email);
                newUser.setRole(role);
                userRepository.save(newUser);
                String token = jwtToken.generateToken(newUser);
                if ("app".equalsIgnoreCase(state)) {
                    response.sendRedirect("myapp://callback?token=" + token);
                } else {
                    response.getWriter().write("{\"token\": \"" + token + "\"}");
                }

            } else {
                Optional<User> user = userRepository.findByEmail(email);
                String token = jwtToken.generateToken(user.get());
                if ("app".equalsIgnoreCase(state)) {
                    response.sendRedirect("myapp://callback?token=" + token);
                } else {
                    response.getWriter().write("{\"token\": \"" + token + "\"}");
                }
            }
        }
    }
}

