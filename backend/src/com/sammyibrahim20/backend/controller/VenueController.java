package com.sammyibrahim20.backend.controller;

import com.sammyibrahim20.backend.model.Venue;
import com.sammyibrahim20.backend.model.User;
import com.sammyibrahim20.backend.repository.VenueRepository;
import com.sammyibrahim20.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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

    @GetMapping
    public List<Venue> getAll() { return venueRepository.findAll(); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> request) {
        String username = trimOrNull(request.get("username"));
        String email = trimOrNull(request.get("email"));
        String password = trimOrNull(request.get("password"));
        String companyName = trimOrNull(request.get("companyName"));
        String contact = trimOrNull(request.get("contact"));
        String description = trimOrNull(request.get("description"));

        if (username == null || email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Missing required fields: username, email, password"));
        }

        // Check if username already exists
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already taken"));
        }

        try {
            // Create User entity for authentication
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password); // In production, hash this!
            user.setRole("VENUE");
            userRepository.save(user);

            // Create Venue entity with additional info
            Venue venue = new Venue();
            venue.setUsername(username);
            venue.setEmail(email);
            venue.setPassword(password);
            venue.setRole("VENUE");
            venue.setCompanyName(companyName);
            venue.setContact(contact);
            venue.setDescription(description);
            
            Venue savedVenue = venueRepository.save(venue);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVenue);
        } catch (Exception e) {
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
