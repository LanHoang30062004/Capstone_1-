package com.mahala.khiemthinh.controller;

import com.mahala.khiemthinh.dto.request.WordDTO;
import com.mahala.khiemthinh.dto.response.PageResponse;
import com.mahala.khiemthinh.dto.response.ResponseData;
import com.mahala.khiemthinh.service.WordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("${api.prefix}/word")
@Tag(name = "Word API", description = "API danh cho word")
@Slf4j
@RequiredArgsConstructor
@Validated
public class WordController {
    private final WordService wordService;

    @GetMapping("")
    @Operation(summary = "Lay tat ca danh sach cac ky hieu dua tren search", description = "Tra ve danh sach cac ky hieu")
    public ResponseData<?> findAllWordBySearch(@RequestParam(name = "page") int page,
                                               @RequestParam(name = "size") int size,
                                               @RequestParam(required = false) String search

    ) {
        try {
            PageResponse<?> result = this.wordService.findAllWord(page, size, search);
            log.info("Find all word by search successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Tìm tất cả từ theo tìm kiếm thành công", result);
        } catch (Exception e) {
            log.error("Find all word by search successfully : {}" , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Tìm tất cả từ theo tìm kiếm thất bại", null);
        }
    }

    @PostMapping("/upload")
    @Operation(summary = "Upload video", description = "Upload video sau do lay url de thuc hien them ky hieu")
    public ResponseData<?> uploadVideo(@RequestParam(name = "file") MultipartFile file) {
        try {
            String result = this.wordService.uploadVideo(file);
            log.info("Upload video successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Tải video lên thành công", result);
        } catch (Exception e) {
            log.error("Upload video unsuccessfully : {}" , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Tải video lên thất bại", null);
        }
    }

    @PostMapping("")
    @Operation(summary = "Them moi ky hieu", description = "Them moi ky hieu")
    public ResponseData<?> addWord(@Valid @RequestBody WordDTO wordDTO) {
        try {
            WordDTO result = this.wordService.addWord(wordDTO);
            log.info("Add word successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Thêm từ thành công", result);
        } catch (Exception e) {
            log.error("Add word unsuccessful : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Thêm từ thất bại", null);
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cap nhat ky hieu dua vao ID cua ky hieu", description = "Cap nhat ky hieu")
    public ResponseData<?> updateWord(@PathVariable Long id, @Valid @RequestBody WordDTO wordDTO) {
        try {
            this.wordService.updateWord(id, wordDTO);
            log.info("Update word successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Cập nhật từ thành công", wordDTO);
        } catch (Exception e) {
            log.error("Update word unsuccessful : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Cập nhật từ thất bại", null);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xoa ky hieu dua tren ID cua ky hieu", description = "Xoa ky hieu")
    public ResponseData<?> deleteWord(@PathVariable Long id) {
        try {
            this.wordService.deleteWord(id);
            log.info("Delete word successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Xóa từ thành công");
        } catch (Exception e) {
            log.error("Delete word unsuccessful : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Xóa từ thất bại", null);
        }
    }
}
