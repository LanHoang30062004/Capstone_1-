package com.mahala.khiemthinh.service.impl;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.mahala.khiemthinh.service.GoogleTokenValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
@Service
public class GoogleTokenValidatorImpl implements GoogleTokenValidator {

    private static final String CLIENT_ID = "891153081600-rd86f3i1a8t10k6akkqps2crvjqj7t94.apps.googleusercontent.com";

    public GoogleIdToken.Payload verifyToken(String idTokenString) {
        System.out.println("Received token: " + idTokenString);
        System.out.println("Client ID: " + CLIENT_ID);
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new JacksonFactory())
                    .setAudience(Arrays.asList(
                            "891153081600-rd86f3i1a8t10k6akkqps2crvjqj7t94.apps.googleusercontent.com", // web
                            "891153081600-lq7kvr532fb58fhsf9s72v4k541mc4pl.apps.googleusercontent.com"  // android
                    ))
                    .build();


            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                System.out.println("User email: " + payload.getEmail());
                return payload;
            } else {
                System.out.println("Invalid ID token.");
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
