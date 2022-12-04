const express = require('express');
const ParkingService = require('../services/ParkingService.js');
const OrderService = require('../services/OrderService');
const ParkingModel = require('../models/ParkingModel.js');
const router = express.Router();

const cors = require('cors');
router.use(cors());

router.post('/add-parking', async function (req, res) {
  console.log('POST add new parking');
  try {
    const parking = await ParkingService.insertOneParking(req.body);
    res.status(201).send(parking);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/addfeedback', async function (req, res) {
  console.log('POST add new feedback');
  const parking = await ParkingService.addFeedback(req.body);
  try {
    await parking.save();
    res.status(201).send(parking.feedback);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/parking-management/:user', async function (req, res) {
  console.log('GET all parking by user');
  try {
    const listParking = await ParkingService.getAllParkingBy(req.params.user);
    let uncheck = [];
    for (let ele of listParking) {
      uncheck.push(
        (await OrderService.getNumOfUncheckOrderBy(ele.id)).toString()
      );
    }
    res.status(200).send([listParking, uncheck]);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/', async function (req, res) {
  console.log('GET parking by cityId');
  try {
    const parking = await ParkingService.getParkingByCity(req.query.cityId);
    res.status(200).send(parking);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/parking-searching', async function (req, res) {
  console.log('GET all parking');
  try {
    const parkingId = req.query.id;
    console.log(parkingId);
    let result = {};
    if (parkingId) {
      result = await ParkingService.getParking(parkingId);
    } else result = await ParkingService.getAllParkings();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/summary', async function (req, res) {
  console.log('GET all parking');
  try {
    const result = await ParkingService.summaryProvince();

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/popular', async function (req, res) {
  console.log('GET popular parking');
  try {
    const result = await ParkingService.getPopularParking();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
