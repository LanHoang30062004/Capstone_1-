package com.mahala.khiemthinh.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "word")
@Data
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    @Column(name = "word_name")
    private String wordName ;

    @Column(name = "word_meaning")
    private String wordMeaning ;

    @Column(name = "video_url")
    private String videoUrl ;

    @ManyToMany
    @JoinTable(
            name = "user_word"  ,
            joinColumns = @JoinColumn(name = "word_id") ,
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> users ;
    @ManyToOne(fetch = FetchType.EAGER)
    private Category category ;
}
