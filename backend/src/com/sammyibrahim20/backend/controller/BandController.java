package com.sammyibrahim20.backend.controller;

import com.sammyibrahim20.backend.model.Band;
import com.sammyibrahim20.backend.repository.BandRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bands")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://gigbooker-1.onrender.com"
})
public class BandController {
    private final BandRepository bandRepository;
    public BandController(BandRepository bandRepository) {
        this.bandRepository = bandRepository;
    }

    @GetMapping
    public List<Band> getAll() { return bandRepository.findAll(); }

    @PostMapping
    public Band create(@RequestBody Band band) { return bandRepository.save(band); }
}
