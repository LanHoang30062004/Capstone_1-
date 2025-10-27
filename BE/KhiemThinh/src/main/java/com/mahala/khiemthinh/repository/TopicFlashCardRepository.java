package com.mahala.khiemthinh.repository;

import com.mahala.khiemthinh.model.TopicFlashCard;
import com.mahala.khiemthinh.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicFlashCardRepository extends JpaRepository<TopicFlashCard, Long>  , JpaSpecificationExecutor<TopicFlashCard> {
    List<TopicFlashCard> findByUserId(Long userId);
}
