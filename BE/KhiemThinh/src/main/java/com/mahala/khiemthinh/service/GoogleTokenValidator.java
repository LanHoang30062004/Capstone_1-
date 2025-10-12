package com.mahala.khiemthinh.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.stereotype.Service;

@Service
public interface GoogleTokenValidator {
    GoogleIdToken.Payload verifyToken(String idTokenString) ;
}
