package com.mahala.khiemthinh.mapper;

import com.mahala.khiemthinh.dto.request.TopicDTO;
import com.mahala.khiemthinh.model.Topic;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TopicMapper {
    TopicMapper INSTANCE = Mappers.getMapper(TopicMapper.class) ;

    TopicDTO toTopicDTO(Topic topic);
    Topic toTopicEntity(TopicDTO topicDTO);
}
