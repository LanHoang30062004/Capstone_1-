package com.mahala.khiemthinh.service;

import org.springframework.stereotype.Service;

@Service
public interface TranslateService {
    String translate(String inputText);
}
