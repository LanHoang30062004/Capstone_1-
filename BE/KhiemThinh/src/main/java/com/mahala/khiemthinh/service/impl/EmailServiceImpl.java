package com.mahala.khiemthinh.service.impl;


import com.mahala.khiemthinh.dto.request.PasswordDTO;
import com.mahala.khiemthinh.exception.NotFoundException;
import com.mahala.khiemthinh.model.User;
import com.mahala.khiemthinh.repository.UserRepository;
import com.mahala.khiemthinh.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    private static String generatePassword() {
        Random random = new Random();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 6; i++) {
            int digit = random.nextInt(10); // sinh số từ 0 - 9
            password.append(digit);
        }

        return password.toString();
    }


    @Override
    public void sendSimpleEmail(String to) throws MessagingException, NotFoundException {
        User user = this.userRepository.findByEmail(to).orElseThrow(() -> new NotFoundException("Can not find user with email :" + to));
        String newPassword = generatePassword();
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
        mimeMessageHelper.setTo(to);
        mimeMessageHelper.setSubject("Verification code");
        mimeMessageHelper.setText("Code : " + newPassword, true);
        user.setPassword(this.passwordEncoder.encode(newPassword));
        this.userRepository.save(user);
        mailSender.send(mimeMessage);
    }

    @Override
    public void changePassword(PasswordDTO passwordDTO) throws NotFoundException {
        User user = this.userRepository.findByEmail(passwordDTO.getEmail()).orElseThrow(() -> new NotFoundException("Can not find user with email :" + passwordDTO.getEmail()));
        user.setPassword(this.passwordEncoder.encode(passwordDTO.getPassword()));
        this.userRepository.save(user);
    }

    @Override
    public Boolean checkOTP(PasswordDTO passwordDTO) throws Exception {
        User user = this.userRepository.findByEmail(passwordDTO.getEmail()).orElseThrow(() -> new NotFoundException("Can not find user with email :" + passwordDTO.getEmail()));
        if (this.passwordEncoder.matches(passwordDTO.getCode(), user.getPassword())) {
            return true;
        } else {
            return false;
        }
    }

}
