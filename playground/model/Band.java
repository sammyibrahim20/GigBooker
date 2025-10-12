package com.sammyibrahim20.playground.model;

import jakarta.persistence.Entity;

@Entity
public class Band extends User {
    private String genre;
    private String members;
    private String links;

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getMembers() { return members; }
    public void setMembers(String members) { this.members = members; }

    public String getLinks() { return links; }
    public void setLinks(String links) { this.links = links; }
}
