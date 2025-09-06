package com.mahala.khiemthinh.controller;

import com.mahala.khiemthinh.dto.request.PasswordDTO;
import com.mahala.khiemthinh.dto.response.ResponseData;
import com.mahala.khiemthinh.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/password")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "API cho Password" )
public class PasswordController {
    private final EmailService emailService;
    @PostMapping("/forgot")
    @Operation(summary = "Quên mật khẩu")
    public ResponseData<?> forgotPassword (@RequestParam("email") String email) {
        try {
            log.info("Send email verification successfully");
            this.emailService.sendSimpleEmail(email);
            return new ResponseData<>(HttpStatus.OK.value(),"Send email verification successfully") ;
        }
        catch (Exception e) {
            log.error("User not found with email {}", email);
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),e.getMessage());
        }
    }
    @PostMapping("/change")
    @Operation(summary = "Thay đổi mật khẩu")
    public ResponseData<?> changePassword (@RequestBody PasswordDTO passwordDTO) {
        try {
            this.emailService.changePassword(passwordDTO);
            log.info("Change password successful with email : {}" );
            return new ResponseData<>(HttpStatus.OK.value(),"Change password successful with email :" + passwordDTO.getEmail()) ;
        }
        catch (Exception e) {
            log.error("Verification code not true {}");
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),e.getMessage());
        }
    }
}
