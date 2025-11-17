package com.sammyibrahim20.backend.repository;

import com.sammyibrahim20.backend.model.Gig;
import com.sammyibrahim20.backend.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GigRepository extends JpaRepository<Gig, Long> {
    List<Gig> findByVenue(Venue venue);
}
