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
            return new ResponseData<>(HttpStatus.OK.value(), "Find all word by search successfully", result);
        } catch (Exception e) {
            log.error("Find all word by search successfully : {}" , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Find all word by search unsuccessfully", null);
        }
    }

    @PostMapping("/upload")
    @Operation(summary = "Upload video", description = "Upload video sau do lay url de thuc hien them ky hieu")
    public ResponseData<?> uploadVideo(@RequestParam(name = "file") MultipartFile file) {
        try {
            String result = this.wordService.uploadVideo(file);
            log.info("Upload video successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Upload video successfully", result);
        } catch (Exception e) {
            log.error("Upload video unsuccessfully : {}" , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Upload video unsuccessfully", null);
        }
    }

    @PostMapping("")
    @Operation(summary = "Them moi ky hieu", description = "Them moi ky hieu")
    public ResponseData<?> addWord(@Valid @RequestBody WordDTO wordDTO) {
        try {
            WordDTO result = this.wordService.addWord(wordDTO);
            log.info("Add word successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Add word successfully", result);
        } catch (Exception e) {
            log.error("Add word unsuccessful : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Add word unsuccessful", null);
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cap nhat ky hieu dua vao ID cua ky hieu", description = "Cap nhat ky hieu")
    public ResponseData<?> updateWord(@PathVariable Long id, @Valid @RequestBody WordDTO wordDTO) {
        try {
            this.wordService.updateWord(id, wordDTO);
            log.info("Update word successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Update word successfully", wordDTO);
        } catch (Exception e) {
            log.error("Update word unsuccessful : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Update word unsuccessful", null);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xoa ky hieu dua tren ID cua ky hieu", description = "Xoa ky hieu")
    public ResponseData<?> deleteWord(@PathVariable Long id) {
        try {
            this.wordService.deleteWord(id);
            log.info("Delete word successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Delete word successfully");
        } catch (Exception e) {
            log.error("Delete word unsuccessful : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Delete word unsuccessful", null);
        }
    }
}
