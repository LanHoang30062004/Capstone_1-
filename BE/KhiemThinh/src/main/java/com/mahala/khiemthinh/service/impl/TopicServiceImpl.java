package com.mahala.khiemthinh.service.impl;

import com.mahala.khiemthinh.dto.request.OptionDTO;
import com.mahala.khiemthinh.dto.request.QuestionDTO;
import com.mahala.khiemthinh.dto.request.TopicDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import com.mahala.khiemthinh.exception.NotFoundException;
import com.mahala.khiemthinh.mapper.TopicMapper;
import com.mahala.khiemthinh.model.Option;
import com.mahala.khiemthinh.model.Question;
import com.mahala.khiemthinh.model.Topic;
import com.mahala.khiemthinh.model.Word;
import com.mahala.khiemthinh.repository.TopicRepository;
import com.mahala.khiemthinh.repository.WordRepository;
import com.mahala.khiemthinh.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {
    private final TopicRepository topicRepository;
    private final WordRepository wordRepository;
    private final TopicMapper topicMapper;

    @Override
    public PageResponse<?> getAllTopics(int page, int size, String search, String content) {
        page = page > 0 ? page - 1 : page;
        Pageable pageable = PageRequest.of(page, size);
        Specification<Topic> specification = (root, query, criteriaBuilder) -> {
            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search + "%";
                return criteriaBuilder.or(criteriaBuilder.like(root.get("content"), searchPattern));
            }
            if (content != null && !content.isEmpty()) {
                return criteriaBuilder.or(criteriaBuilder.equal(root.get("content"), content));
            }
            return criteriaBuilder.conjunction();
        };
        Page<Topic> topics = topicRepository.findAll(specification, pageable);
        List<TopicDTO> result = topics.getContent().stream().map((item) ->
                TopicDTO.builder()
                        .id(item.getId())
                        .numberOfQuestion(item.getNumberOfQuestion())
                        .durationMinutes(item.getDurationMinutes())
                        .content(item.getContent())
                        .build()

        ).collect(Collectors.toList());
        return PageResponse.builder()
                .items(result)
                .totalPages(topics.getTotalPages())
                .pageNo(page + 1)
                .pageSize(size)
                .build();
    }

    @Override
    public TopicDTO getAllTopicContent(Long topicID) throws NotFoundException {
        Topic topic = this.topicRepository.findById(topicID).orElseThrow(() -> new NotFoundException("Can not find content topic with topic id :" + topicID));
        return TopicDTO.builder()
                .id(topic.getId())
                .content(topic.getContent())
                .questions(topic.getQuestions().stream().map(item -> QuestionDTO.builder()
                        .options(item.getOptions().stream().map(option -> OptionDTO.builder().correct(option.getCorrect()).option(option.getOptionAnswer()).build()).collect(Collectors.toList()))
                        .questionUrl(item.getQuestionUrl())
                        .build()).collect(Collectors.toList()))
                .build();
    }

    @Override
    public TopicDTO addNewTOPIC(TopicDTO topicDTO) throws NotFoundException {
        Topic topic = new Topic();
        topic.setContent(topicDTO.getContent());
        topic.setDurationMinutes(topicDTO.getDurationMinutes());
        topic.setNumberOfQuestion(topicDTO.getNumberOfQuestion());
        topic.setQuestions(topicDTO.getQuestions().stream().map(item -> {
            Question question = new Question();
            OptionDTO optionDTO = null;
            try {
                optionDTO = item.getOptions().stream().filter(o -> o.getCorrect()).findAny().orElseThrow(() -> new NotFoundException("Can not find correct option"));
            } catch (NotFoundException e) {
                throw new RuntimeException(e);
            }
            Word word = new Word();
            try {
                word = this.wordRepository.findByWordNameIgnoreCase(optionDTO.getOption()).get(0);
            }
            catch (Exception e) {
                throw new RuntimeException("Can not find any correct word");
            }
            question.setQuestionUrl(word.getVideoUrl());
            question.setOptions(item.getOptions().stream().map(option -> {
                Option optionAnswer = new Option();
                optionAnswer.setOptionAnswer(option.getOption());
                optionAnswer.setCorrect(option.getCorrect());
                question.addOption(optionAnswer);
                return optionAnswer;
            }).collect(Collectors.toList()));
            topic.addQuestion(question);
            return question;
        }).collect(Collectors.toList()));
        Topic newTopic = this.topicRepository.save(topic);
        return this.topicMapper.toTopicDTO(newTopic);
    }

    @Override
    public void updateTopic(Long idTopic, TopicDTO topicDTO) throws NotFoundException {
        Topic topic = topicRepository.findById(idTopic)
                .orElseThrow(() -> new NotFoundException("Can not found topic with id " + idTopic));

        topic.setContent(topicDTO.getContent());
        topic.setDurationMinutes(topicDTO.getDurationMinutes());
        topic.setNumberOfQuestion(topicDTO.getNumberOfQuestion());

        // Xóa hết question cũ
        topic.getQuestions().clear();

        // Thêm question mới trực tiếp vào collection đã được Hibernate quản lý
        for (QuestionDTO item : topicDTO.getQuestions()) {
            Question question = new Question();

            // tìm word cho câu hỏi
            OptionDTO optionDTO = item.getOptions().stream()
                    .filter(OptionDTO::getCorrect)
                    .findAny()
                    .orElseThrow(() -> new NotFoundException("Can not find correct option"));

            Word word = new Word();
            try {
                word = this.wordRepository.findByWordNameIgnoreCase(optionDTO.getOption()).get(0);
            }
            catch (Exception e) {
                throw new RuntimeException("Can not find any correct word");
            }
            question.setQuestionUrl(word.getVideoUrl());
            // thêm option
            for (OptionDTO option : item.getOptions()) {
                Option optionAnswer = new Option();
                optionAnswer.setOptionAnswer(option.getOption());
                optionAnswer.setCorrect(option.getCorrect());
                question.addOption(optionAnswer); // đảm bảo addOption() set lại quan hệ 2 chiều
            }

            topic.addQuestion(question); // đảm bảo setTopic cho question
        }

        topicRepository.save(topic);
    }


    @Override
    public void deleteTopic(Long idTopic) throws NotFoundException {
        Topic topic = this.topicRepository.findById(idTopic).orElseThrow(() -> new NotFoundException("Can not found topic with id " + idTopic));
        this.topicRepository.delete(topic);
    }

    @Override
    public List<String> getAllContent() {
        return this.topicRepository.findAll().stream().map((item) -> item.getContent()).collect(Collectors.toList());
    }
}
