package com.mahala.khiemthinh.service;

import com.mahala.khiemthinh.dto.request.TopicDTO;
import com.mahala.khiemthinh.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TopicService {
    List<TopicDTO> getAllTopics();
    TopicDTO getAllTopicContent(Long topicID) throws NotFoundException;

    TopicDTO addNewTOPIC(TopicDTO topicDTO) throws NotFoundException ;

    void updateTopic(Long idTopic ,TopicDTO topicDTO) throws NotFoundException;
    void deleteTopic(Long idTopic) throws NotFoundException;
}
