package com.sammyibrahim20.backend.controller;

import com.sammyibrahim20.backend.model.Band;
import com.sammyibrahim20.backend.model.User;
import com.sammyibrahim20.backend.repository.BandRepository;
import com.sammyibrahim20.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bands")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://gigbooker-1.onrender.com"
})
public class BandController {
    private final BandRepository bandRepository;
    private final UserRepository userRepository;
    
    public BandController(BandRepository bandRepository, UserRepository userRepository) {
        this.bandRepository = bandRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Band> getAll() { return bandRepository.findAll(); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> request) {
        String username = trimOrNull(request.get("username"));
        String email = trimOrNull(request.get("email"));
        String password = trimOrNull(request.get("password"));
        String genre = trimOrNull(request.get("genre"));
        String members = trimOrNull(request.get("members"));
        String links = trimOrNull(request.get("links"));

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
            user.setRole("BAND");
            userRepository.save(user);

            // Create Band entity with additional info
            Band band = new Band();
            band.setUsername(username);
            band.setEmail(email);
            band.setPassword(password);
            band.setRole("BAND");
            band.setGenre(genre);
            band.setMembers(members);
            band.setLinks(links);
            
            Band savedBand = bandRepository.save(band);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBand);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create band account"));
        }
    }

    private String trimOrNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}
