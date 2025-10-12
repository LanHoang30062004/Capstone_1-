package com.mahala.khiemthinh.controller;

import com.mahala.khiemthinh.dto.response.ResponseData;
import com.mahala.khiemthinh.model.User;
import com.mahala.khiemthinh.repository.UserRepository;
import com.mahala.khiemthinh.service.GoogleTokenValidator;
import com.mahala.khiemthinh.util.JWTToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final GoogleTokenValidator googleTokenValidator;
    private final UserRepository userRepository;
    private final JWTToken jwtToken;

    @PostMapping("/google")
    public ResponseData<?> googleLogin(@RequestParam String token) {
        var payload = googleTokenValidator.verifyToken(token);

        if (payload != null) {
            String email = payload.getEmail();
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> userRepository.save(User.builder().email(email).build()));
            String jwt = jwtToken.generateToken(user);
            return new ResponseData<>(HttpStatus.OK.value(), "Oauth2 with google successful", jwt);
        } else {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Oauth2 with google unsuccessful");
        }
    }
}

