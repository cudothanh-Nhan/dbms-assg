const orderModel = require('../models/OrderModels');


module.exports = {
  getOrder: async (id) => {
    console.log("GET - /orders/{id}");
    return await orderModel.getOrderDetail(id);
  },
  getOrderHistory: async (userName) => {
    console.log("GET - /orders/order-history/{userName}");
    return await orderModel.getOrderHistory(userName);
  },
  getAllOrderBy: async function (userName) {
    console.log("GET - /orders/order-management/{userName}");
    return await orderModel.getAllOrderBy(userName);
  },
  updateNextState: async function (id, newStatus) {
    console.log("PUT - /orders/change-state/{id}");
    if (newStatus['cmd'] == 'update')
      return await orderModel.updateNextState(id);
    else return;
  },
  createOrder: async function (body) {
    console.log("POST - /orders/add-order")
    return await orderModel.addOrder(body);
  },
};
