package com.mahala.khiemthinh.repository;

import com.mahala.khiemthinh.model.TopicFlashCard;
import com.mahala.khiemthinh.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicFlashCardRepository extends JpaRepository<TopicFlashCard, Long>  , JpaSpecificationExecutor<TopicFlashCard> {
}
