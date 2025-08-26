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

    @NotBlank(message = "Can not leave full name is blank")
    private String fullName;

    @NotBlank(message = "Can not leave address is blank")
    private String address;

    @NotBlank(message = "Can not leave phone is blank")
    @Pattern(regexp = "^\\d{10,11}$", message = "Phone must be 10-11 digits and only contain numbers")
    private String phone;


    @NotBlank(message = "Can not leave gender is blank")
    private String gender ;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dateOfBirth;
}
