package com.mahala.khiemthinh.controller;

import com.mahala.khiemthinh.dto.request.TopicDTO;
import com.mahala.khiemthinh.dto.response.ResponseData;
import com.mahala.khiemthinh.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/topic")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "API Topic", description = "API danh cho Topic")
public class TopicController {
    private final TopicService topicService;

    @GetMapping("")
    @Operation(summary = "Lay tat ca danh sach cac Topic", description = "Lay tat ca danh sach cac Topic")
    public ResponseData<?> getAllTopic(@RequestParam int page,
                                       @RequestParam int size,
                                       @RequestParam(required = false) String search ,
                                       @RequestParam(required = false) String content
    ) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get all topic name successful", this.topicService.getAllTopics(page, size , search , content));
    }

    @GetMapping("/content")
    @Operation(summary = "Lay tat ca danh sach cac content cua topic", description = "Lay tat ca danh sach cac content cua topic")
    public ResponseData<?> getAllContent() {
        log.info("Get all content successful");
        return new ResponseData<>(HttpStatus.OK.value(), "Get all content successful" , this.topicService.getAllContent());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lay ra danh sach cac cau hoi dua tren ID topic")
    public ResponseData<?> getAllTopicContent(@PathVariable(name = "id") Long id) {
        try {
            TopicDTO result = this.topicService.getAllTopicContent(id);
            log.info("Get all topic content successful");
            return new ResponseData<>(HttpStatus.OK.value(), "Get all topic content successful", result);
        } catch (Exception e) {
            log.error("Get all topic content failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Get all topic content failed :" + e.getMessage(), null);
        }
    }

    @PostMapping("")
    @Operation(summary = "Them moi topic", description = "Them moi bao gom topic , danh sach cac cau hoi")
    public ResponseData<?> addTopic(@Valid @RequestBody TopicDTO topicDTO) {
        try {
            TopicDTO result = this.topicService.addNewTOPIC(topicDTO);
            log.info("Add topic successful");
            return new ResponseData<>(HttpStatus.OK.value(), "Add topic successful", result);
        } catch (Exception e) {
            log.error("Add topic failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Add topic failed :" + e.getMessage() , null);
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update topic dua tren id topic")
    public ResponseData<?> updateTopic(@PathVariable Long id, @Valid @RequestBody TopicDTO topicDTO) {
        try {
            this.topicService.updateTopic(id, topicDTO);
            log.info("Update topic successful");
            return new ResponseData<>(HttpStatus.OK.value(), "Update topic successful :" , null);
        } catch (Exception e) {
            log.error("Update topic failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Update topic failed :" + e.getMessage(), null);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete topic dua tren id topic")
    public ResponseData<?> deleteTopic(@PathVariable Long id) {
        try {
            this.topicService.deleteTopic(id);
            log.info("Delete topic successful");
            return new ResponseData<>(HttpStatus.OK.value(), "Delete topic successful", null);
        } catch (Exception e) {
            log.error("Delete topic failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Delete topic failed :" + e.getMessage(), null);
        }
    }
}
