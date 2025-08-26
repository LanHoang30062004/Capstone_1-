package com.mahala.khiemthinh.controller;

import com.mahala.khiemthinh.dto.request.TextDTO;
import com.mahala.khiemthinh.dto.response.ResponseData;
import com.mahala.khiemthinh.service.TranslateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/translate")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "API danh cho viec convert tu text sang video")
public class TranslateController {
    private final TranslateService translateService;

    @PostMapping("")
    @Operation(summary = "Chuyen text to video")
    public ResponseData<?> translate(@RequestParam(name = "text") String text) {
        try {
            String translatedText = translateService.translate(text);
            log.info("Translated text successful: {}", translatedText);
            return new ResponseData<>(HttpStatus.OK.value(), "Translated text successful" , translatedText);
        }
        catch (Exception e) {
           log.error("Translated text unsuccessful : {}" , e.getMessage());
           return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Translated text unsuccessful", null);
        }
    }
}
