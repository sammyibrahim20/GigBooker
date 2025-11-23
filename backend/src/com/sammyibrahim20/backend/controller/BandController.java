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
import java.util.Optional;

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

    // ----- READ -----

    @GetMapping
    public List<Band> getAllBands() {
        return bandRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBandById(@PathVariable Long id) {
        Optional<Band> optionalBand = bandRepository.findById(id);
        if (optionalBand.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Band not found"));
        }
        return ResponseEntity.ok(optionalBand.get());
    }

    // ----- CREATE -----

    @PostMapping
    public ResponseEntity<?> createBand(@RequestBody Map<String, String> body) {
        String username = trimOrNull(body.get("username"));
        String email = trimOrNull(body.get("email"));
        String password = trimOrNull(body.get("password"));
        String genre = trimOrNull(body.get("genre"));
        String members = trimOrNull(body.get("members"));
        String links = trimOrNull(body.get("links"));

        if (username == null || email == null || password == null ||
                genre == null || members == null || links == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Missing required fields."));
        }

        // Use users table to enforce unique username (used for login)
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already taken."));
        }

        try {
            // 1) Create User row for authentication
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);     // TODO: hash in production
            user.setRole("BAND");
            userRepository.save(user);

            // 2) Create Band profile row
            Band band = new Band();
            band.setUsername(username);
            band.setEmail(email);
            band.setPassword(password);
            band.setGenre(genre);
            band.setMembers(members);
            band.setLinks(links);

            Band savedBand = bandRepository.save(band);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedBand);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create band account"));
        }
    }

    // ----- Helpers -----

    private String trimOrNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}
