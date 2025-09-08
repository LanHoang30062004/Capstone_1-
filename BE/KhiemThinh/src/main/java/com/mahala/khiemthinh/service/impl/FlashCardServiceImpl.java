package com.mahala.khiemthinh.service.impl;

import com.mahala.khiemthinh.dto.request.CardDTO;
import com.mahala.khiemthinh.dto.request.FlashCardDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import com.mahala.khiemthinh.exception.NotFoundException;
import com.mahala.khiemthinh.model.FlashCard;
import com.mahala.khiemthinh.model.TopicFlashCard;
import com.mahala.khiemthinh.model.Word;
import com.mahala.khiemthinh.repository.FlashCardRepository;
import com.mahala.khiemthinh.repository.TopicFlashCardRepository;
import com.mahala.khiemthinh.repository.WordRepository;
import com.mahala.khiemthinh.service.FlashCardService;
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
@RequiredArgsConstructor
@Transactional
public class FlashCardServiceImpl implements FlashCardService {
    private final TopicFlashCardRepository topicFlashCardRepository;
    private final FlashCardRepository flashCardRepository;
    private final WordRepository wordRepository;

    @Override
    public PageResponse<?> getAllFlashCard(int page, int size, String search) {
        page = page > 1 ? page - 1 : 0;
        Pageable pageable = PageRequest.of(page, size);
        Specification<TopicFlashCard> specification = (root, query, cb) -> {
            if (search != null && !search.isEmpty()) {
                String pattern = "%" + search.toLowerCase() + "%";
                return cb.like(cb.lower(root.get("content")), pattern);
            }
            return cb.conjunction();
        };
        Page<TopicFlashCard> result = this.topicFlashCardRepository.findAll(specification, pageable);
        List<FlashCardDTO> flashCards = result.getContent().stream().map(item -> FlashCardDTO.builder()
                .content(item.getContent())
                .id(item.getId())
                .build()).collect(Collectors.toList());
        return PageResponse.builder()
                .pageSize(size)
                .pageNo(page + 1)
                .totalPages(result.getTotalPages())
                .items(flashCards)
                .build();
    }

    @Override
    public FlashCardDTO getFlashCardById(Long id) throws NotFoundException {
        TopicFlashCard topicFlashCard = this.topicFlashCardRepository.findById(id).orElseThrow(() -> new NotFoundException("Can not find this topic"));
        return FlashCardDTO.builder()
                .content(topicFlashCard.getContent())
                .id(topicFlashCard.getId())
                .cards(topicFlashCard.getFlashCards().stream().map(item -> CardDTO.builder().result(item.getResult()).videoUrl(item.getVideoUrl()).build()).toList())
                .build();
    }

    @Override
    public FlashCardDTO addNewFlashCard(FlashCardDTO flashCardDTO) {
        TopicFlashCard topicFlashCard = new TopicFlashCard();
        topicFlashCard.setContent(flashCardDTO.getContent());
        topicFlashCard.setFlashCards(flashCardDTO.getCards().stream().map(item -> {
            try {
                Word word = this.wordRepository.findByWordNameIgnoreCase(item.getResult()).orElseThrow(() -> new NotFoundException("Can not find word"));
                FlashCard flashCard = new FlashCard();
                flashCard.setResult(word.getWordName());
                flashCard.setVideoUrl(word.getVideoUrl());
                topicFlashCard.addFlashCard(flashCard);
                return flashCard;
            } catch (NotFoundException e) {
                throw new RuntimeException(e);
            }
        }).toList());
        this.topicFlashCardRepository.save(topicFlashCard);
        return flashCardDTO;
    }

    @Override
    public void updateFlashCard(Long id, FlashCardDTO flashCardDTO) throws NotFoundException {
        TopicFlashCard topicFlashCard = topicFlashCardRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cannot find this topic"));

        topicFlashCard.setContent(flashCardDTO.getContent());

        // Xóa flashcards cũ
        topicFlashCard.getFlashCards().clear();

        // Thêm flashcards mới
        for (CardDTO item : flashCardDTO.getCards()) {
            Word word = wordRepository.findByWordNameIgnoreCase(item.getResult())
                    .orElseThrow(() -> new NotFoundException("Cannot find word: " + item.getResult()));

            FlashCard flashCard = new FlashCard();
            flashCard.setResult(word.getWordName());
            flashCard.setVideoUrl(word.getVideoUrl());

            topicFlashCard.addFlashCard(flashCard);
        }

        topicFlashCardRepository.save(topicFlashCard);
    }


    @Override
    public void deleteFlashCard(Long id) throws NotFoundException {
        TopicFlashCard topicFlashCard = this.topicFlashCardRepository.findById(id).orElseThrow(() -> new NotFoundException("Can not find this topic"));
        this.topicFlashCardRepository.delete(topicFlashCard);
    }
}
