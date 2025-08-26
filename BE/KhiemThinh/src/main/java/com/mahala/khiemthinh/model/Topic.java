package com.mahala.khiemthinh.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "topic")
@Data
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    @Column(name = "content")
    private String content ;

    @Column(name = "duration_minutes")
    private int durationMinutes ;

    @Column(name = "number_of_question")
    private int numberOfQuestion ;

    @OneToMany(fetch = FetchType.EAGER , cascade = CascadeType.ALL , mappedBy = "topic" , orphanRemoval = true)
    private List<Question> questions;



    public void addQuestion(Question question) {
        if (this.questions == null) {
            this.questions = new ArrayList<>();
        }
        this.questions.add(question);
        question.setTopic(this);
    }

}
