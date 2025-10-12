package com.sammyibrahim20.playground.repository;

import com.sammyibrahim20.playground.model.Gig;
import com.sammyibrahim20.playground.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GigRepository extends JpaRepository<Gig, Long> {
    List<Gig> findByVenue(Venue venue);
}
