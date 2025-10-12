package com.sammyibrahim20.playground.controller;

import com.sammyibrahim20.playground.model.Band;
import com.sammyibrahim20.playground.repository.BandRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bands")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
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
