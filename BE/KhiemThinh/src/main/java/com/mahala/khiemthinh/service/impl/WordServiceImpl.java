package com.mahala.khiemthinh.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.mahala.khiemthinh.dto.request.WordDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import com.mahala.khiemthinh.exception.NotFoundException;
import com.mahala.khiemthinh.model.User;
import com.mahala.khiemthinh.model.Word;
import com.mahala.khiemthinh.repository.UserRepository;
import com.mahala.khiemthinh.repository.WordRepository;
import com.mahala.khiemthinh.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class WordServiceImpl implements WordService {
    private final WordRepository wordRepository;
    private final Cloudinary cloudinary;
    private final UserRepository userRepository;

    @Override
    public PageResponse<?> findAllWord(int page, int size, String search) {
        if (page > 0) page = page - 1;
        Pageable pageable = PageRequest.of(page, size);
        Specification<Word> spec = (root, query, criteriaBuilder) -> {
            if (search != null && !search.equals("")) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                return criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("wordName")), searchPattern)
                );
            }
            return criteriaBuilder.conjunction();
        };
        Page<Word> words = wordRepository.findAll(spec, pageable);
        List<WordDTO> wordDTOList = words.getContent().stream().map(item -> {
            return WordDTO.builder()
                    .wordName(item.getWordName())
                    .wordMeaning(item.getWordMeaning())
                    .videoUrl(item.getVideoUrl())
                    .wordId(item.getId())
                    .build();
        }).collect(Collectors.toList());
        return PageResponse.builder()
                .items(wordDTOList)
                .pageNo(page + 1)
                .pageSize(size)
                .totalPages(words.getTotalPages())
                .build();
    }

    @Override
    public String uploadVideo(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("resource_type", "video"));
        return uploadResult.get("secure_url").toString();
    }

    @Override
    public WordDTO addWord(WordDTO word) throws NotFoundException {
        User user = this.userRepository.findById(word.getUserId()).orElseThrow(() -> new NotFoundException("Can not find user with id :" + word.getUserId()));
        Word result = new Word();
        result.setWordName(word.getWordName());
        result.setWordMeaning(word.getWordMeaning());
        result.setVideoUrl(word.getVideoUrl());
        result.addUser(user);
        this.wordRepository.save(result);
        return word;
    }

    @Override
    public void updateWord(Long wordId, WordDTO wordDTO) throws NotFoundException {
        Word word = this.wordRepository.findById(wordId).orElseThrow(() -> new NotFoundException("Can not find word with id :" + wordId));
        word.setWordName(wordDTO.getWordName());
        word.setWordMeaning(wordDTO.getWordMeaning());
        word.setVideoUrl(wordDTO.getVideoUrl());
        this.wordRepository.save(word);
    }

    @Override
    public void deleteWord(Long wordId) throws NotFoundException {
        Word word = this.wordRepository.findById(wordId).orElseThrow(() -> new NotFoundException("Can not find word with id :" + wordId));
        word.getUsers().clear();
        wordRepository.delete(word);
    }
}
