package com.sammyibrahim20.backend.repository;

import com.sammyibrahim20.backend.model.Band;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BandRepository extends JpaRepository<Band, Long> {}
