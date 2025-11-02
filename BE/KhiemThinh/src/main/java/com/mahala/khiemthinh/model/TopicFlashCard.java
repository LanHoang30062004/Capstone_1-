package com.mahala.khiemthinh.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "topic_flash_card")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicFlashCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    private String content ;

    @OneToMany(fetch = FetchType.LAZY  , mappedBy = "topicFlashCard" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<FlashCard> flashCards ;

    @ManyToOne(fetch = FetchType.EAGER)
    private User user ;

    public void addFlashCard(FlashCard flashCard) {
        if (flashCards == null) {
            flashCards = new ArrayList<>();
        }
        flashCards.add(flashCard);
        flashCard.setTopicFlashCard(this);
    }
}
