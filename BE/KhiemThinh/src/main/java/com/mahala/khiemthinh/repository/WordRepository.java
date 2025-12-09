package com.mahala.khiemthinh.repository;

import com.mahala.khiemthinh.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WordRepository extends JpaRepository<Word, Long>  , JpaSpecificationExecutor<Word> {
    Optional<Word> findByWordName(String wordName);

    @Query(
            value = "SELECT * FROM word WHERE LOWER(word_name) = LOWER(:wordName) LIMIT 1",
            nativeQuery = true
    )
    List<Word> findByWordNameIgnoreCase(@Param("wordName") String wordName);
}
