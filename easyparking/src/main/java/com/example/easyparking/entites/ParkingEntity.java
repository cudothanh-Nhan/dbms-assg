package com.example.easyparking.entites;

import java.util.ArrayList;
import java.util.List;

public class ParkingEntity {

  private String id;
  private String name;
  private List<String> images = new ArrayList<>();
  private List<ParkingType> parkingTypes = new ArrayList<>();

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
  public void setName(String name) {
    this.name = name;
  }

  public void addImage(String val) {
    this.images.add(val);
  }

  public void addParkingType(ParkingType val) {
    this.parkingTypes.add(val);
  }

  public String getName() {
    return name;
  }


  public List<String> getImages() {
    return images;
  }

  public List<ParkingType> getParkingTypes() {
    return parkingTypes;
  }

}
