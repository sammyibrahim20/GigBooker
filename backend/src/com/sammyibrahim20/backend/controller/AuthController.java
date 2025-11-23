package com.sammyibrahim20.backend.controller;

import com.sammyibrahim20.backend.model.Band;
import com.sammyibrahim20.backend.model.User;
import com.sammyibrahim20.backend.model.Venue;
import com.sammyibrahim20.backend.repository.BandRepository;
import com.sammyibrahim20.backend.repository.UserRepository;
import com.sammyibrahim20.backend.repository.VenueRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BandRepository bandRepository;
    private final VenueRepository venueRepository;

    public AuthController(UserRepository userRepository,
                          BandRepository bandRepository,
                          VenueRepository venueRepository) {
        this.userRepository = userRepository;
        this.bandRepository = bandRepository;
        this.venueRepository = venueRepository;
    }

    // ---------- DTOs ----------

    public static class SignupRequest {
        private String role; // "BAND" or "VENUE"
        private String username;
        private String password;

        // shared
        private String email;

        // band-specific
        private String genre;
        private String members;
        private String links;

        // venue-specific
        private String companyName;
        private String contact;
        private String description;

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getGenre() {
            return genre;
        }

        public void setGenre(String genre) {
            this.genre = genre;
        }

        public String getMembers() {
            return members;
        }

        public void setMembers(String members) {
            this.members = members;
        }

        public String getLinks() {
            return links;
        }

        public void setLinks(String links) {
            this.links = links;
        }

        public String getCompanyName() {
            return companyName;
        }

        public void setCompanyName(String companyName) {
            this.companyName = companyName;
        }

        public String getContact() {
            return contact;
        }

        public void setContact(String contact) {
            this.contact = contact;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class AuthResponse {
        private Long id;
        private String username;
        private String role;

        public AuthResponse(Long id, String username, String role) {
            this.id = id;
            this.username = username;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public String getUsername() {
            return username;
        }

        public String getRole() {
            return role;
        }
    }

    // ---------- SIGNUP ----------

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        String username = safeTrim(request.getUsername());
        String password = safeTrim(request.getPassword());
        String roleRaw = safeTrim(request.getRole());

        if (username.isEmpty() || password.isEmpty() || roleRaw.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Username, password and role are required."));
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username is already taken."));
        }

        User.Role role;
        try {
            role = User.Role.valueOf(roleRaw.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid role. Must be BAND or VENUE."));
        }

        // Create User
        User user = new User(username, password, role);
        userRepository.save(user);

        // Also create Band or Venue profile so your dashboards work
        if (role == User.Role.BAND) {
            Band band = new Band();
            band.setUsername(username);
            band.setEmail(request.getEmail());
            band.setGenre(request.getGenre());
            band.setMembers(request.getMembers());
            band.setLinks(request.getLinks());
            bandRepository.save(band);
        } else if (role == User.Role.VENUE) {
            Venue venue = new Venue();
            venue.setUsername(username);
            venue.setEmail(request.getEmail());
            venue.setCompanyName(request.getCompanyName());
            venue.setContact(request.getContact());
            venue.setDescription(request.getDescription());
            venueRepository.save(venue);
        }

        AuthResponse response = new AuthResponse(user.getId(), user.getUsername(), user.getRole().name());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ---------- LOGIN ----------

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String username = safeTrim(request.getUsername());
        String password = safeTrim(request.getPassword());

        if (username.isEmpty() || password.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Username and password are required."));
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password."));
        }

        User user = userOpt.get();

        // Plain-text check (replace with BCrypt for production)
        if (!user.getPassword().equals(password)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password."));
        }

        AuthResponse response = new AuthResponse(user.getId(), user.getUsername(), user.getRole().name());
        return ResponseEntity.ok(response);
    }

    // ---------- Helpers ----------

    private String safeTrim(String s) {
        return s == null ? "" : s.trim();
    }
}
