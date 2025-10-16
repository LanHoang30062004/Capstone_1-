package com.mahala.khiemthinh.service;

import com.mahala.khiemthinh.dto.request.FlashCardDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import com.mahala.khiemthinh.exception.NotFoundException;
import org.springframework.stereotype.Service;

@Service
public interface FlashCardService {
    PageResponse<?> getAllFlashCard(int page , int size , String search) ;
    PageResponse<?> getAllFlashCardByUserId(int page , int size , Long userID , String search) throws NotFoundException;

    FlashCardDTO getFlashCardById(Long id) throws NotFoundException;
    FlashCardDTO addNewFlashCard(FlashCardDTO flashCardDTO) throws NotFoundException;

    void updateFlashCard(Long id , FlashCardDTO flashCardDTO) throws NotFoundException;

    void deleteFlashCard(Long id) throws NotFoundException;
}
