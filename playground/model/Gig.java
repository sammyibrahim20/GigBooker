package com.sammyibrahim20.playground.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Gig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;         // indoor / outdoor
    private int capacity;
    private double price;

    private LocalDateTime dateTime;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @ManyToMany
    @JoinTable(
            name = "gig_interested_bands",
            joinColumns = @JoinColumn(name = "gig_id"),
            inverseJoinColumns = @JoinColumn(name = "band_id")
    )
    private Set<Band> interestedBands = new HashSet<>();

    public Gig() {}

    public Gig(String location, int capacity, double price, LocalDateTime dateTime, Venue venue) {
        this.location = location;
        this.capacity = capacity;
        this.price = price;
        this.dateTime = dateTime;
        this.venue = venue;
    }

    public Long getId() {
        return id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public Set<Band> getInterestedBands() {
        return interestedBands;
    }

    public void addInterestedBand(Band band) {
        this.interestedBands.add(band);
    }
}
