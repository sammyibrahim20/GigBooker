package com.sammyibrahim20.backend.controller;

import com.sammyibrahim20.backend.model.User;
import com.sammyibrahim20.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://gigbooker-1.onrender.com"
})
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ---------- SIGN UP ----------
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User incoming) {
        if (userRepository.existsByUsername(incoming.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already taken"));
        }

        // ⚠️ For real production you should hash the password with BCrypt.
        // For now we just save it as-is so it's easy to wire up.
        User user = new User();
        user.setUsername(incoming.getUsername());
        user.setPassword(incoming.getPassword());
        user.setRole(incoming.getRole()); // "BAND" or "VENUE"

        User saved = userRepository.save(user);

        // Don't send password back
        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "username", saved.getUsername(),
                "role", saved.getRole()
        ));
    }

    // ---------- LOGIN ----------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        return userRepository.findByUsername(username)
                .map(user -> {
                    if (!user.getPassword().equals(password)) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("message", "Invalid credentials"));
                    }

                    // success
                    return ResponseEntity.ok(Map.of(
                            "id", user.getId(),
                            "username", user.getUsername(),
                            "role", user.getRole()
                    ));
                })
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("message", "Invalid credentials"))
                );
    }
}
