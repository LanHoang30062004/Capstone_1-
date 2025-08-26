package com.mahala.khiemthinh.repository;

import com.mahala.khiemthinh.model.FlashCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FlashCardRepository extends JpaRepository<FlashCard, Long> , JpaSpecificationExecutor<FlashCard> {
    @Query("select f from FlashCard f where lower(f.result) = LOWER(:result) ")
    Optional<FlashCard> findByResultIgnoreCase(@Param("result") String result);
}
