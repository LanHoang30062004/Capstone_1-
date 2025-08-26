package com.mahala.khiemthinh.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> implements Serializable {
    private T items;
    private int pageNo;
    private int pageSize;
    private int totalPages;
}
