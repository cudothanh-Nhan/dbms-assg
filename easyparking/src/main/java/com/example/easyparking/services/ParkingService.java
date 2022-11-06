package com.example.easyparking.services;

import com.example.easyparking.entites.Feedback;
import com.example.easyparking.entites.ParkingEntity;
import com.example.easyparking.entites.ParkingType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ParkingService {
  @Autowired
  private NamedParameterJdbcTemplate jdbcTemplate;

  public List<ParkingEntity> getParkingByCity(String cityId) {
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("cityId", cityId);
    String sql = "SELECT * FROM parking p INNER JOIN city c ON p.city = c.id" +
        " WHERE c.id = (:cityId)";
    Map<String, ParkingEntity> map = new HashMap<>();
    List<ParkingEntity> entities = jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      String id = rs.getString("id");
      map.putIfAbsent(id, new ParkingEntity());
      ParkingEntity entity =  map.get(id);
      entity.setId(rs.getString("id"));
      entity.setName(rs.getString("name"));
      return entity;
    });

    this.fillImages(map);
    this.fillParkingType(map);

    return entities;
  }

  public void fillImages(Map<String, ParkingEntity> map) {
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("ids", map.keySet());

    final String sql = "SELECT * FROM parking p INNER JOIN PARK_IMAGE i ON p.id = i.parking" +
        " WHERE p.id IN (:ids)";

    jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      String id = rs.getString("id");
      ParkingEntity entity = map.get(id);
      entity.addImage(rs.getString("url"));
      return null;
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

  public void fillParkingType(Map<String, ParkingEntity> map) {
    MapSqlParameterSource parameters = new MapSqlParameterSource();
    parameters.addValue("ids", map.keySet());

    final String sql = "SELECT p.id, t.id as tid, t.name as tName, pt.price FROM parking p INNER JOIN PARKING_TYPE pt ON p.id = pt.parking" +
        " INNER JOIN TYPE t ON t.id = pt.type" +
        " WHERE p.id IN (:ids)";

    jdbcTemplate.query(sql, parameters, (rs, rowNum) -> {
      String id = rs.getString("id");
      ParkingEntity entity = map.get(id);

      ParkingType parkingType = new ParkingType();
      parkingType.setId(rs.getString("tid"));
      parkingType.setName(rs.getString("tName"));
      parkingType.setPrice(rs.getInt("price"));

      entity.addParkingType(parkingType);
      return null;
    });
  }




}
