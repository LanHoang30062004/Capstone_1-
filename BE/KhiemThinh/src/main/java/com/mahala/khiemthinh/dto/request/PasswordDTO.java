package com.mahala.khiemthinh.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Builder
public class PasswordDTO implements Serializable {
    private String code  ;
    private String email ;
    private String password ;
}
