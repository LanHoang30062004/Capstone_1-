package com.mahala.khiemthinh.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "question")
@Data
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    @Column(name = "question_url")
    private String questionUrl;

    @OneToMany(fetch = FetchType.EAGER , cascade = CascadeType.ALL, mappedBy = "question" ,orphanRemoval = true)
    private List<Option> options ;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id")
    private Topic topic ;

    public void addOption(Option option) {
        if (options == null) {
            options = new ArrayList<>();
        }
        this.options.add(option) ;
        option.setQuestion(this);
    }
}
