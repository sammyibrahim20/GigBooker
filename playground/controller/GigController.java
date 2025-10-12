package com.sammyibrahim20.playground.controller;

import com.sammyibrahim20.playground.model.Venue;
import com.sammyibrahim20.playground.model.Gig;
import com.sammyibrahim20.playground.model.Band;
import com.sammyibrahim20.playground.repository.BandRepository;
import com.sammyibrahim20.playground.repository.GigRepository;
import com.sammyibrahim20.playground.repository.VenueRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gigs")
@CrossOrigin(origins = "http://localhost:3000")
public class GigController {

    private final GigRepository gigRepository;
    private final VenueRepository venueRepository;
    private final BandRepository bandRepository;

    public GigController(GigRepository gigRepository, VenueRepository venueRepository, BandRepository bandRepository) {
        this.gigRepository = gigRepository;
        this.venueRepository = venueRepository;
        this.bandRepository = bandRepository;
    }

    // Create a gig
    @PostMapping
    public ResponseEntity<?> createGig(@RequestBody Gig gig) {
        if (gig.getVenue() == null || gig.getVenue().getId() == null) {
            return ResponseEntity.badRequest().body("Venue is required");
        }

        Venue venue = venueRepository.findById(gig.getVenue().getId()).orElse(null);
        if (venue == null) {
            return ResponseEntity.badRequest().body("Invalid venue");
        }

        gig.setVenue(venue);
        Gig saved = gigRepository.save(gig);
        return ResponseEntity.ok(saved);
    }

    // Get all gigs
    @GetMapping
    public List<Gig> getAllGigs() {
        return gigRepository.findAll();
    }

    // Get gigs by venue
    @GetMapping("/venue/{venueId}")
    public List<Gig> getGigsByVenue(@PathVariable Long venueId) {
        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) return List.of();
        return gigRepository.findByVenue(venue);
    }

    // Band expresses interest in a gig
    @PostMapping("/{gigId}/interest/{bandId}")
    public ResponseEntity<?> showInterest(@PathVariable Long gigId, @PathVariable Long bandId) {
        Gig gig = gigRepository.findById(gigId).orElse(null);
        Band band = bandRepository.findById(bandId).orElse(null);

        if (gig == null || band == null) {
            return ResponseEntity.badRequest().body("Invalid gig or band");
        }

        gig.addInterestedBand(band);
        gigRepository.save(gig);
        return ResponseEntity.ok("Interest registered");
    }

    // Get interested bands for a gig
    @GetMapping("/{gigId}/interested-bands")
    public ResponseEntity<?> getInterestedBands(@PathVariable Long gigId) {
        Gig gig = gigRepository.findById(gigId).orElse(null);
        if (gig == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(gig.getInterestedBands());
    }
}
