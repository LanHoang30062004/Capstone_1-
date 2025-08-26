package com.mahala.khiemthinh.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Builder
public class TextDTO implements Serializable {
    private String message;
}
