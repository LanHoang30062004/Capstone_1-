package com.mahala.khiemthinh.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Builder
public class WordDTO implements Serializable {
    private Long wordId ;

    private Long userId ;

    @NotBlank(message = "Word name must not be blank")
    private String wordName ;

    @NotBlank(message = "Word meaning must not be blank")
    private String wordMeaning ;

    @NotBlank(message = "Video url must not be blank")
    private String videoUrl ;

}
