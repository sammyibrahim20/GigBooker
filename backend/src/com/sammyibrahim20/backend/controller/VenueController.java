package com.sammyibrahim20.backend.controller;

import com.sammyibrahim20.backend.model.User;
import com.sammyibrahim20.backend.model.Venue;
import com.sammyibrahim20.backend.repository.UserRepository;
import com.sammyibrahim20.backend.repository.VenueRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://gigbooker-1.onrender.com"
})
public class VenueController {

    private final VenueRepository venueRepository;
    private final UserRepository userRepository;

    public VenueController(VenueRepository venueRepository, UserRepository userRepository) {
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
    }

    // ----- READ -----

    @GetMapping
    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVenueById(@PathVariable Long id) {
        Optional<Venue> optionalVenue = venueRepository.findById(id);
        if (optionalVenue.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Venue not found"));
        }
        return ResponseEntity.ok(optionalVenue.get());
    }

    // ----- CREATE -----

    @PostMapping
    public ResponseEntity<?> createVenue(@RequestBody Map<String, String> body) {
        String username = trimOrNull(body.get("username"));
        String email = trimOrNull(body.get("email"));
        String password = trimOrNull(body.get("password"));
        String companyName = trimOrNull(body.get("companyName"));
        String contact = trimOrNull(body.get("contact"));
        String description = trimOrNull(body.get("description"));

        if (username == null || email == null || password == null ||
                companyName == null || contact == null || description == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Missing required fields."));
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already taken."));
        }

        try {
            // 1) Create User row for authentication
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);
            user.setRole("VENUE");
            userRepository.save(user);

            // 2) Create Venue profile row
            Venue venue = new Venue();
            venue.setUsername(username);
            venue.setEmail(email);
            venue.setPassword(password);
            venue.setCompanyName(companyName);
            venue.setContact(contact);
            venue.setDescription(description);

            Venue savedVenue = venueRepository.save(venue);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedVenue);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create venue account"));
        }
    }

    private String trimOrNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}
