// BandService.java
package com.sammyibrahim20.backend.service;

import com.sammyibrahim20.backend.model.Band;
import com.sammyibrahim20.backend.repository.BandRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BandService {
    private final BandRepository bandRepository;

    public BandService(BandRepository bandRepository) {
        this.bandRepository = bandRepository;
    }

    public List<Band> getAllBands() {
        return bandRepository.findAll();
    }

    public Band createBand(Band band) {
        return bandRepository.save(band);
    }

    public void deleteBand(Long id) {
        bandRepository.deleteById(id);
    }
}
