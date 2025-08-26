package com.mahala.khiemthinh.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
public class FlashCardDTO implements Serializable {
    private String content ;
    private List<CardDTO> cards;
}
