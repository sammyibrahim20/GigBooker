package com.sammyibrahim20.playground.repository;

import com.sammyibrahim20.playground.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {}
