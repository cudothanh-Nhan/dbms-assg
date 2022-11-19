const ParkingModel = require("../models/ParkingModel");
const { ParkingSchema } = require("../models/ParkingModel");

module.exports = {
  getAllParkings: async () => {
    console.log(456);
    return await ParkingModel.getAll();
  },
  getParking: async (parkingId) => {
    console.log(parkingId);
    const parking = await ParkingModel.findOne(parkingId);
    console.log(parking);
    return parking;
  },
  insertOneParking: async (parking) => {
    // const newParking = {
    //   name: parking.name,
    //   street: parking.street,
    //   ward: parking.ward,
    //   district: parking.district,
    //   province: parking.province,
    //   img: parking.img,
    //   price: parking.price,
    //   userName: parking.userName,
    // };
    return await ParkingModel.insertOne(parking);
  },
  getAllParkingBy: async (username) => {
    let data = await ParkingModel.find(username);
    return data;
  },
};
