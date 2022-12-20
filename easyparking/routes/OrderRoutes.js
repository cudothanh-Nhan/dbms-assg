const express = require("express");
const OrderModel = require("../models/OrderModels.js");
const UserModel = require("../models/UserModel.js");
const OrderService = require("../services/OrderService.js");

const router = express.Router();


router.post('/add-order', async function(req, res){
    try {
      await OrderService.createOrder(req.body);
      res.status(200).send(`Sucessfully created order`);
    } catch (error) {
      res.status(500).send(error);
    }
});


router.post('/addOrder', async function (req, res) {
  const order = new OrderModel(req.body);
  try {
    await order.save();
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post("/add-user", async function (req, res) {
  const user = new UserModel(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
})

router.get("/order-management/:userName", async function (req, res) {
  try {
    const orders = await OrderService.getAllOrderBy(req.params.userName);
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
})

router.put("/change-state/:id", async function (req, res) {
  try {
    const lastestOrder = await OrderService.updateNextState(req.params.id, req.body);
    res.status(200).send(lastestOrder);
  } catch (error) {
    res.status(500).send(error);
  }
})

router.get("/order-history/:userName", async function (req, res) {
  try {
    const orders = await OrderService.getOrderHistory(req.params.userName);
    res.status(200).send(orders);
  }
  catch (error) {
    res.status(500).send(error);
  }
})

router.get("/:orderId", async function(req, res) {
  console.log(req.params.orderId);
  try {
    const order = await OrderService.getOrder(req.params.orderId);
    res.status(200).send(order);
  }
  catch(error) {
    res.status(500).send(error);
  }

});


module.exports = router;
