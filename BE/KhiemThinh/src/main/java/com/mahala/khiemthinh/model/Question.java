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

    @Column(name = "answer")
    private String answer ;

    @Column(name = "video_url")
    private String videoUrl ;

    @ManyToOne(fetch = FetchType.EAGER)
    private Category category ;

    @OneToMany(fetch = FetchType.EAGER , cascade = CascadeType.ALL, mappedBy = "question")
    private List<Option> options ;
}
