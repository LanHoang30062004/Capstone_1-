package com.mahala.khiemthinh.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "question")
@Data
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;
    
    @OneToMany(fetch = FetchType.EAGER , cascade = CascadeType.ALL, mappedBy = "question")
    private List<Option> options ;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "word_id")
    private Word word ;
}
