package com.mahala.khiemthinh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "option")
@Data
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    @Column(name = "option_answer")
    private String optionAnswer;

    @ManyToOne(fetch = FetchType.EAGER)
    private Question question;


}
