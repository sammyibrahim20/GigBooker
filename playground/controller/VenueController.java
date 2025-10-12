package com.sammyibrahim20.playground.controller;

import com.sammyibrahim20.playground.model.Venue;
import com.sammyibrahim20.playground.repository.VenueRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = "http://localhost:3000")
public class VenueController {
    private final VenueRepository venueRepository;
    public VenueController(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @GetMapping
    public List<Venue> getAll() { return venueRepository.findAll(); }

    @PostMapping
    public Venue create(@RequestBody Venue venue) { return venueRepository.save(venue); }
}
