package com.example.easyparking.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class OrderService {
  @Autowired
  private NamedParameterJdbcTemplate jdbcTemplate;

  @Autowired
  private ParkingService parkingService;

  public Map<String, Object> getOrderDetail(String id) {
    final String sql = "SELECT *\n" +
        "FROM p_order po\n" +
        "WHERE po.id = (:id)";

    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("id", id);

    Map<String, Object> map =new HashMap<>();
    jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      Map<String, Object> user = new HashMap<>();
      user.put("email", rs.getString("email"));
      user.put("name", rs.getString("name"));
      user.put("phone", rs.getString("phone"));

      map.put("customer", user);
      map.put("endTime", rs.getTimestamp("end_time").toLocalDateTime().toString());
      map.put("startTime", rs.getTimestamp("start_time").toLocalDateTime().toString());
      map.put("userName", rs.getString("customer"));

      map.put("_id", id);
      return null;
    });

    List<Timestamp> times = Arrays.asList(null, null, null, null, null);

    final String timeSql = "SELECT *\n" +
        "FROM order_status os\n" +
        "WHERE os.order_id = (:id)";
    jdbcTemplate.query(timeSql, parameters, (rs, rowNum) -> {
      times.set(rs.getInt("status"), rs.getTimestamp("time"));
      return null;
    });

    map.put("times", times);

    final String vehicleSql = "SELECT *\n" +
        "FROM order_vehicle ov\n" +
        "INNER JOIN p_order po ON ov.order_id = po.id\n" +
        "INNER JOIN vehicle_type v ON v.parking = po.parking\n" +
        "WHERE ov.order_id = (:id)";
    AtomicReference<String> parkingId = new AtomicReference<>();
    map.put("vehicles", jdbcTemplate.query(vehicleSql, parameters, (rs, rowNum) -> {
      HashMap<String, Object> vehicle = new HashMap<>();
      vehicle.put("name", rs.getString("vehicle"));
      vehicle.put("quantity", rs.getInt("quantity"));
      vehicle.put("unitPrice", rs.getInt("price"));
      parkingId.set(rs.getString("parking"));
      return vehicle;
    }));

    Map<String, Object> parking = new HashMap<>();
    parking.putAll(parkingService.getParkingAddress(parkingId.get()));
    parking.put("img", parkingService.getParkingImgs(parkingId.get()).get(0));
    parking.put("id", parkingId.get());

    map.put("parking", parking);


    return map;
  }

  public List<Map<String, Object>> getOrderHistory(String userName) {
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("id", userName);
    final String sql = "SELECT *\n" +
        "FROM p_order po\n" +
        "WHERE po.customer = (:id)";

    return jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      return this.getOrderDetail(rs.getString("id"));
    });
  }

  public List<List<Object>> getManagedOrder(String userName) {
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("id", userName);
    final String sql = "SELECT po.id as id\n" +
        "FROM parking p\n" +
        "INNER JOIN u_parking u_p ON p.id = u_p.parking\n" +
        "INNER JOIN p_order po ON p.id = po.parking\n" +
        "WHERE u_p.userid = (:id)";

    HashMap<String, Object> map = new HashMap<>();
    jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      Map<String, Object> order = this.getOrderDetail(rs.getString("id"));
      Map<String, Object> parking = (Map) order.get("parking");
      order.put("parkingId", parking.get("id"));
      map.putIfAbsent((String) parking.get("name"), new ArrayList<>());
      List<Object> obj = (List) map.get((String) parking.get("name"));
      obj.add(order);
      return null;
    });

    return map.entrySet().stream().map(e -> {
      List<Object> lst = new ArrayList<>();
      lst.add(e.getKey());
      lst.add(e.getValue());
      return lst;
    }).collect(Collectors.toList());
  }
}
