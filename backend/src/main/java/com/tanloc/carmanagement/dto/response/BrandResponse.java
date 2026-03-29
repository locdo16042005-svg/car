package com.tanloc.carmanagement.dto.response;

public class BrandResponse {
    private Long id;
    private String name;
    private String logoUrl;
    private String description;
    private int carCount;

    public BrandResponse() {}

    public BrandResponse(Long id, String name, String logoUrl, String description, int carCount) {
        this.id = id;
        this.name = name;
        this.logoUrl = logoUrl;
        this.description = description;
        this.carCount = carCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getCarCount() { return carCount; }
    public void setCarCount(int carCount) { this.carCount = carCount; }
}
