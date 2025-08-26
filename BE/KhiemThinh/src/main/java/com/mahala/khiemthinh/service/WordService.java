package com.mahala.khiemthinh.service;

import com.mahala.khiemthinh.dto.request.WordDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import com.mahala.khiemthinh.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface WordService {
    PageResponse<?> findAllWord(int page, int size, String search);
    String uploadVideo(MultipartFile file) throws IOException;
    WordDTO addWord (WordDTO word) throws NotFoundException;

    void updateWord (Long wordId , WordDTO wordDTO) throws NotFoundException;

    void deleteWord(Long wordId) throws NotFoundException;
}
