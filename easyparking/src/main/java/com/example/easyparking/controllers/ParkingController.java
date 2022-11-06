package com.example.easyparking.controllers;


import com.example.easyparking.entites.Feedback;
import com.example.easyparking.entites.ParkingEntity;
import com.example.easyparking.services.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "/parkings")
public class ParkingController {
  @Autowired
  ParkingService parkingService;

  @GetMapping("")
  public List<ParkingEntity> getParkingByCity(@RequestParam String cityId) {
    return parkingService.getParkingByCity(cityId);
  }

  @GetMapping("/feedback")
  public List<Feedback> getFeedback(@RequestParam String parkingId) {
    return parkingService.getParkingFeedback(parkingId);
  }
}
