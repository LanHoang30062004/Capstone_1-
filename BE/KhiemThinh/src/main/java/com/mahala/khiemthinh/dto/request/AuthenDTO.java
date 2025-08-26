package com.mahala.khiemthinh.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenDTO {
    @Email
    @NotBlank(message = "Can not leave email is blank")
    private String email;

    @NotBlank(message = "Can not leave password is blank")
    private String password;
}
