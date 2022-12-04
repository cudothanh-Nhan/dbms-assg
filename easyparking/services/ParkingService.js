const ParkingModel = require('../models/ParkingModel');

module.exports = {
  getAllParkings: async () => {
    console.log(456);
    return await ParkingModel.getAll();
  },
  getParking: async (parkingId) => {
    console.log(parkingId);
    const parking = await ParkingModel.getParkingById(parkingId);
    return parking;
  },
  insertOneParking: async (parking) => {
    return await ParkingModel.insertOne(parking);
  },
  getAllParkingBy: async (username) => {
    let data = await ParkingModel.find(username);
    return data;
  },
  summaryProvince: async () => {
    return await ParkingModel.summaryProvince();
  },
  getParkingByCity: async (cityId) => {
    let data = await ParkingModel.getParkingByCity(cityId);
    return data;
  },

  getPopularParking: async () => {
    let data = await ParkingModel.getPopularParking();
    return data;
  },
};
