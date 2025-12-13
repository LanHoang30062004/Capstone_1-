package com.mahala.khiemthinh.controller;

import com.mahala.khiemthinh.dto.request.FlashCardDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import com.mahala.khiemthinh.dto.response.ResponseData;
import com.mahala.khiemthinh.service.FlashCardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/flash-card")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "API cho flash card")
public class FlashCardController {
    private final FlashCardService flashCardService;

    @GetMapping("")
    @Operation(summary = "Lay ra danh sach cac flash card co phan trang", description = "Danh sach cac topic flash card co phan trang va tim kiem (optional)")
    public ResponseData<?> getAllFlashCards(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) String search) {
        try {
            PageResponse result = this.flashCardService.getAllFlashCard(page, size, search);
            log.info("Get all flash card successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Lấy tất cả flashcard thành công", result);
        } catch (Exception e) {
            log.error("Get all flash card failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lấy tất cả flashcard thất bại: " + e.getMessage(), null);
        }
    }
    @GetMapping("/user/{id}")
    @Operation(summary = "Lay ra danh sach cac flash card co phan trang theo user id", description = "Danh sach cac topic flash card co phan trang va tim kiem (optional) theo user id")
    public ResponseData<?> getAllFlashCardsByUserId(
            @PathVariable Long id,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) String search) {
        try {
            PageResponse result = this.flashCardService.getAllFlashCardByUserId(page, size , id, search);
            log.info("Get all flash card by user id successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Lấy tất cả flashcard theo user id thành công", result);
        } catch (Exception e) {
            log.error("Get all flash card by user id failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lấy tất cả flashcard theo user id thất bại: " + e.getMessage(), null);
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lay ra chi tiet flash card")
    public ResponseData<?> getFlashCard(@PathVariable Long id) {
        try {
            FlashCardDTO result = this.flashCardService.getFlashCardById(id);
            log.info("Get flash card successfully with id : {}", id);
            return new ResponseData<>(HttpStatus.OK.value(), "Lấy flashcard thành công", result);
        } catch (Exception e) {
            log.error("Get flash card failed with id : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lấy flashcard thất bại:" + e.getMessage(), null);
        }
    }

    @PostMapping("")
    @Operation(summary = "Them moi 1 flash card")
    public ResponseData<?> addFlashCard(@RequestBody FlashCardDTO flashCardDTO) {
        try {
            FlashCardDTO result = this.flashCardService.addNewFlashCard(flashCardDTO);
            log.info("Add new flash card successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Thêm flashcard mới thành công", result);
        } catch (Exception e) {
            log.error("Add new flash card failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Thêm flashcard mới thất bại : " + e.getMessage(), null);
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cap nhat flash card dua tren id")
    public ResponseData<?> updateFlashCard(@PathVariable Long id, @RequestBody FlashCardDTO flashCardDTO) {
        try {
            this.flashCardService.updateFlashCard(id, flashCardDTO);
            log.info("Update flash card successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Cập nhật flashcard thành công", true);
        } catch (Exception e) {
            log.error("Update flash card failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Cập nhật flashcard thất bại : " + e.getMessage(), false);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xoa flash card dua tren id")
    public ResponseData<?> deleteFlashCard(@PathVariable Long id) {
        try {
            this.flashCardService.deleteFlashCard(id);
            log.info("Delete flash card successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Xóa flashcard thành công", true);
        } catch (Exception e) {
            log.error("Delete flash card failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Xóa flashcard thất bại : " + e.getMessage(), false);
        }
    }
}
