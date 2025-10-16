package com.mahala.khiemthinh.repository;

import com.mahala.khiemthinh.model.TopicFlashCard;
import com.mahala.khiemthinh.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TopicFlashCardRepository extends JpaRepository<TopicFlashCard, Long>  , JpaSpecificationExecutor<TopicFlashCard> {
  @Query(
          "select t from TopicFlashCard  t " +
          "where t.user.id = :user_id"
  )
   Optional<TopicFlashCard> findByUserId(@Param("user_id") Long userId);
}
