package com.mahala.khiemthinh.repository;

import com.mahala.khiemthinh.model.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
}
