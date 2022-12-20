package com.example.easyparking.services;

import com.example.easyparking.entites.Feedback;
import com.example.easyparking.entites.ParkingEntity;
import com.example.easyparking.entites.ParkingType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ParkingService {
  @Autowired
  private NamedParameterJdbcTemplate jdbcTemplate;
  public List<Map<String, Object>> getParkingBySearch(String searchText) {
    final String sql = "SELECT * \n" +
        "FROM parking p\n" +
        "WHERE contains(p.name, (:regex), 0) > 1\n" +
        "ORDER BY SCORE(0) DESC\n" +
        "OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY";
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    final String regex = String.join(" | ", Arrays.stream(searchText.split(" ")).map(s -> "%"+s+"%").collect(Collectors.toList()));
    parameters.addValue("regex", searchText);
    return jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      String id = rs.getString("id");
      Map<String, Object> map = new HashMap<>();
      map.put("_id", id);
      map.putAll(this.getParkingAddress(id));
      return map;
    });
  }

  public List<Map<String, Object>> getParkingByCity(String cityId) {
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("cityId", cityId);
    String sql = "SELECT * FROM parking p INNER JOIN city c ON p.city = c.id" +
        " WHERE c.id = (:cityId)";
    return jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      Map<String, Object> map = new HashMap<>();
      String id = rs.getString("id");
      return this.getParkingById(id);
    });
  }


  public List<Feedback> getParkingFeedback(String parkingId) {
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("parkingId", parkingId);

    final String sql = "SELECT * FROM parking p INNER JOIN FEEDBACK f ON p.id = f.parking" +
        " WHERE p.id = (:parkingId)";

    return jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      Feedback feedback = new Feedback();
      feedback.setUserId(rs.getString("userid"));
      feedback.setTime(rs.getTimestamp("time"));
      feedback.setUserName(rs.getString("userid"));
      feedback.setText(rs.getString("text"));
      return feedback;
    });
  }


  public List<Map<String, Object>> summaryProvince() {
    final String sql = "SELECT c.id, c.name, COUNT(*) as c\n" +
        "FROM parking p INNER JOIN city c ON p.city = c.id\n" +
        "GROUP BY c.name, c.id";
    return jdbcTemplate.query(sql, (rs, rowNum) -> {
      Map<String, Object> map =new HashMap<>();
      map.put("province", rs.getString("name"));
      map.put("count", rs.getInt("c"));
      map.put("rate", rs.getInt("c"));
      map.put("id", rs.getString("id"));
      return map;
    });
  }

  public List<Map<String, Object>> getPopularParking() {
    final String sql = "SELECT *\n" +
        "FROM (\n" +
        "SELECT f.parking, avg(f.rate) as rate, count(f.rate) as nFeedback\n" +
        "FROM feedback f\n" +
        "GROUP BY f.parking\n" +
        "ORDER BY avg(f.rate) DESC)\n" +
        "WHERE ROWNUM <= 20";

    return jdbcTemplate.query(sql, (rs, rowNum) -> {
      Map<String, Object> map =new HashMap<>();
      final String id = rs.getString("parking");
      map.put("_id", id);
      map.put("rate", rs.getFloat("rate"));
      map.put("nFeedback", rs.getInt("nFeedback"));

      map.putAll(this.getParkingAddress(id));
      map.put("img", this.getParkingImgs(id));
      map.put("type", this.getParkingType(id));

      return map;
    });
  }

  public Map<String, Object> getParkingById(String id) {
    Map<String, Object> map = new HashMap<>();
    map.putAll(this.getParkingAddress(id));
    map.put("img", this.getParkingImgs(id));
    map.put("type", this.getParkingType(id));
    map.put("feedback", this.getFeedback(id));
    map.put("_id", id);
    return map;
  }

  public Map<String, Object> getParkingAddress(String id) {
    Map<String, Object> map = new HashMap<>();
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("id", id);
    final String findDetailSql = "SELECT p.id, p.description, p.name, p.address, c.name as city, d.name as district\n" +
        "FROM parking p \n" +
        "INNER JOIN city c \n" +
        "ON p.city = c.id \n" +
        "INNER JOIN district d ON p.district = d.id\n" +
        "WHERE p.id = (:id)";
    jdbcTemplate.query(findDetailSql, parameters, (rs1, rowNum1) -> {
      map.put("province", rs1.getString("city"));
      map.put("name", rs1.getString("name"));
      map.put("description", rs1.getString("description"));
      map.put("address", rs1.getString("address"));
      map.put("district", rs1.getString("district"));
      map.put("ward", "");
      return null;
    });
    return map;
  }

  public List<String> getParkingImgs(String id) {
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("id", id);
    final String findImage = "SELECT i.url\n" +
        "FROM park_image i\n" +
        "WHERE i.parking = (:id)";
    List<String> urls = new ArrayList<>();
    jdbcTemplate.query(findImage, parameters, (rs2, rowNum2) -> {
      urls.add(rs2.getString("url"));
      return null;
    });

    if (urls.isEmpty()) {
      urls.add("https://hanoimoi.com.vn/Uploads/anhthu/2018/1/17/baove-xe.jpg");
    }
    return urls;
  }

  public List<Map<String, Object>> getParkingType(String id) {
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("id", id);

    final String sql = "SELECT t.*\n" +
        "FROM parking p\n" +
        "INNER JOIN vehicle_type t ON p.id = t.parking\n" +
        "WHERE p.id = (:id)";

    List<Map<String, Object>> types = new ArrayList<>();

    return jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      Map<String, Object> map = new HashMap<>();
      map.put("name", rs.getString("type"));
      map.put("capacity", rs.getInt("capacity"));
      map.put("available", rs.getInt("available"));
      map.put("price", rs.getInt("price"));
      return map;
    });
  }

  public List<Map<String, Object>> getFeedback(String id) {
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("id", id);

    final String sql = "SELECT f.*\n" +
        "FROM feedback f\n" +
        "WHERE f.parking = (:id)";

    List<Map<String, Object>> types = new ArrayList<>();

    return jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      Map<String, Object> map = new HashMap<>();
      map.put("userName", rs.getString("userid"));
      map.put("content", rs.getString("text"));
      map.put("rate", rs.getInt("rate"));
      map.put("time", rs.getTimestamp("time"));
      return map;
    });
  }
}
