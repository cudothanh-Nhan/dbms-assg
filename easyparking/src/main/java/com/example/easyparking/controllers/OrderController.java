package com.example.easyparking.controllers;


import com.example.easyparking.entites.Feedback;
import com.example.easyparking.services.OrderService;
import com.example.easyparking.services.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/orders")
public class OrderController {
  @Autowired
  OrderService orderService;

  @GetMapping("/{id}")
  public Map<String, Object> getOrderDetail(@PathVariable("id") String id) {
    return orderService.getOrderDetail(id);
  }

  @GetMapping("/order-history/{userName}")
  public List<Map<String, Object>> getOrderHistory(@PathVariable("userName") String userName) {
    return orderService.getOrderHistory(userName);
  }

  @GetMapping("/order-management/{userName}")
  public List<List<Object>> getManagedOrder(@PathVariable("userName") String userName) {
    return orderService.getManagedOrder(userName);
  }


}
