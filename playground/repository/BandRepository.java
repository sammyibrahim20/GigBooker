package com.sammyibrahim20.playground.repository;

import com.sammyibrahim20.playground.model.Band;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BandRepository extends JpaRepository<Band, Long> {}
