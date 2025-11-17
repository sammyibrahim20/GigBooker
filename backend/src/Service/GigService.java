// GigService.java
package com.sammyibrahim20.backend.Service;

import com.sammyibrahim20.backend.model.Gig;
import com.sammyibrahim20.backend.repository.GigRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GigService {
    private final GigRepository gigRepository;

    public GigService(GigRepository gigRepository) {
        this.gigRepository = gigRepository;
    }

    public List<Gig> getAllGigs() {
        return gigRepository.findAll();
    }

    public Gig createGig(Gig gig) {
        return gigRepository.save(gig);
    }

    public void deleteGig(Long id) {
        gigRepository.deleteById(id);
    }
}
