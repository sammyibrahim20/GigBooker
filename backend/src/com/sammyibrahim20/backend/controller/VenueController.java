package com.sammyibrahim20.backend.controller;

import com.sammyibrahim20.backend.model.Venue;
import com.sammyibrahim20.backend.repository.VenueRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://gigbooker-1.onrender.com"
})
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
