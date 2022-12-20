package com.example.easyparking.controllers;


import com.example.easyparking.entites.Feedback;
import com.example.easyparking.entites.ParkingEntity;
import com.example.easyparking.services.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/parkings")
public class ParkingController {
  @Autowired
  ParkingService parkingService;

  @GetMapping("")
  public List<Map<String, Object>> getParkingByCity(@RequestParam String cityId) {
    return parkingService.getParkingByCity(cityId);
  }

  @GetMapping("/feedback")
  public List<Feedback> getFeedback(@RequestParam String parkingId) {
    return parkingService.getParkingFeedback(parkingId);
  }

  @GetMapping("summary")
  public List<Map<String, Object>> summaryProvince() {
    return parkingService.summaryProvince();
  }

  @GetMapping("popular")
  public List<Map<String, Object>> getPopularParking() {
    return parkingService.getPopularParking();
  }

  @GetMapping("parking-searching")
  public Map<String, Object> getParkingById(@RequestParam String id) {
    return parkingService.getParkingById(id);
  }

  @GetMapping("parking-text-search")
  public List<Map<String, Object>> getParkingByTextSearch(@RequestParam String textSearch) {
    return parkingService.getParkingBySearch(textSearch);
  }


}
