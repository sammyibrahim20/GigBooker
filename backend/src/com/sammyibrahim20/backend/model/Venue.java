package com.sammyibrahim20.backend.model;

import jakarta.persistence.Entity;

@Entity
public class Venue extends User {
    private String companyName;
    private String contact;
    private String description;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
