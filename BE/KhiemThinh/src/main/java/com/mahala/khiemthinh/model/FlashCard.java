package com.mahala.khiemthinh.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flash_card")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlashCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_flash_card_id")
    private TopicFlashCard topicFlashCard;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "result")
    private String result;
}
