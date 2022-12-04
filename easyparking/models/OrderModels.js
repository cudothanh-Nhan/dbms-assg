const { v4: uuidv4 } = require('uuid');
const conn = require('../Conn');
const ORDER_CACHE_NAME = 'ParkingOrder';
const IgniteClient = require('apache-ignite-client');

const SqlFieldsQuery = IgniteClient.SqlFieldsQuery;
const CacheConfiguration = IgniteClient.CacheConfiguration;
const orderCache = conn.getCache(
  ORDER_CACHE_NAME,
  new CacheConfiguration().setSqlSchema('EasyParking')
);

exports.getAll = async function () {
  const cursor = await orderCache.query(
    new SqlFieldsQuery('SELECT * FROM ParkingOrder')
  );

  const result = [];
  do {
    let row = await cursor.getValue();
    console.log(row);
    result.push({
      id: row[0],
      name: row[1],
      street: row[2],
      ward: row[3],
      district: row[4],
      province: row[5],
      description: row[6],
    });
  } while (cursor.hasMore());
  return result;
};

exports.findOne = async function (id) {
  const query = new SqlFieldsQuery(
    `SELECT * FROM ParkingOrder WHERE id = '${id}'`
  );
  console.log(query);
  const cursor = await orderCache.query(query);
  const result = [];
  do {
    let row = await cursor.getValue();
    console.log(row);
    result.push({
      id: row[0],
      times: row[1],
      customers: row[2],
      paymentMethod: row[3],
      startTime: row[4],
      endTime: row[5],
      price: row[6],
      parkingId: row[6],
      username: row[6],
    });
  } while (cursor.hasMore());
  return result[0];
};

exports.find = async function (username) {
  const query = new SqlFieldsQuery(
    `SELECT * FROM ParkingOrder WHERE username = ${username}`
  );
  const cursor = await orderCache.query(query);
  const result = [];
  do {
    let row = await cursor.getValue();
    console.log(row);
    result.push({
      name: row[1],
      street: row[2],
      ward: row[3],
      district: row[4],
    });
  } while (cursor.hasMore());
  return result;
};

exports.insertOne = async function (order) {
  const id = uuidv4();
  console.log(id);
  const initOrder = {
    times: '',
    customers: '',
    paymentMethod: '',
    startTime: '',
    endTime: '',
    price: '',
    parkingId: '',
    username: '',
  };

  if (order.times) {
    initOrder.name = order.times;
  }

  if (order.customers) {
    initOrder.customers = order.customers;
  }

  if (order.paymentMethod) {
    initOrder.paymentMethod = order.paymentMethod;
  }

  if (order.startTime) {
    initOrder.startTime = order.startTime;
  }

  if (order.endTime) {
    initOrder.endTime = order.endTime;
  }

  if (order.price) {
    initOrder.price = order.price;
  }

  if (order.parkingId) {
    initOrder.parkingId = order.parkingId;
  }

  if (order.username) {
    initOrder.username = order.username;
  }

  const orderQuery =
    new SqlFieldsQuery(`INSERT INTO ParkingOrder(ID, Times, Customers, PaymentMethod, StartTime, EndTime, Price, ParkingId, Username)
  VALUES ('${id}','${initOrder.times}', '${initOrder.customers}', '${initOrder.paymentMethod}', 
  '${initOrder.startTime}', '${initOrder.endTime}', '${initOrder.price}','${initOrder.parkingId}','${initOrder.username}')`);
  const cursor = await orderCache
    .query(orderQuery)
    .catch((e) => console.log(e));
  console.log(cursor);
  console.log('Data are inserted');
};
