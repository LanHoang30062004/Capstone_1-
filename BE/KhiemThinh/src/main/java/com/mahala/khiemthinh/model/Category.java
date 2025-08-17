package com.mahala.khiemthinh.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "category")
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    @Column(name = "category_name")
    private String categoryName ;

    @OneToMany(fetch = FetchType.EAGER , cascade = CascadeType.REMOVE , mappedBy = "category")
    private List<Question> questions ;
}
