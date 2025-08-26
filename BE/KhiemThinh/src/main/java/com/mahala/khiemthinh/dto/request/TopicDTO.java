package com.mahala.khiemthinh.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
public class TopicDTO implements Serializable {
    private Long id;

    private String content;

    private int durationMinutes;

    private int numberOfQuestion;

    private List<QuestionDTO> questions;

}
