package com.mahala.khiemthinh.mapper;

import com.mahala.khiemthinh.dto.request.FlashCardDTO;
import com.mahala.khiemthinh.model.FlashCard;
import com.mahala.khiemthinh.model.TopicFlashCard;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface FlashCardMapper {
    FlashCardMapper INSTANCE = Mappers.getMapper(FlashCardMapper.class);
    TopicFlashCard toFlashCardEntity(FlashCardDTO flashCardDTO);

    FlashCardDTO toFlashCardDTO(TopicFlashCard flashCard);
}
