package com.mahala.khiemthinh.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
public class QuestionDTO implements Serializable {
    private List<OptionDTO> options;
    private String questionUrl ;
}
