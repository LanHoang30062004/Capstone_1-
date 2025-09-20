package com.mahala.khiemthinh.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class AdminDTO {
    private Long id ;

    @Email
    @NotBlank(message = "Can not leave email is blank")
    private String email;

    private String fullName;

    private String address;

    @Pattern(regexp = "^\\d{10,11}$", message = "Phone must be 10-11 digits and only contain numbers")
    private String phone;

    private String gender ;

    private LocalDate dateOfBirth;
}
