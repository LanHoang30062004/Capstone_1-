package com.mahala.khiemthinh.service;

import com.mahala.khiemthinh.dto.request.PasswordDTO;
import com.mahala.khiemthinh.exception.NotFoundException;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    public void sendSimpleEmail(String to) throws MessagingException, NotFoundException;

    public void changePassword(PasswordDTO passwordDTO) throws NotFoundException;

    Boolean checkOTP(PasswordDTO passwordDTO) throws Exception;
}
