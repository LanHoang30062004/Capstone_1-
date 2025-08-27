package com.mahala.khiemthinh.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class UserDTO implements Serializable {
    private Long id ;

    @Email
    @NotBlank(message = "Can not leave email is blank")
    private String email;

    @NotBlank(message = "Can not leave password is blank")
    private String password;

    private String fullName;

    private String address;

    @Pattern(regexp = "^\\d{10,11}$", message = "Phone must be 10-11 digits and only contain numbers")
    private String phone;


    private String gender ;


    private LocalDate dateOfBirth;
}
