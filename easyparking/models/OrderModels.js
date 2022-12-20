const { v4: uuidv4 } = require('uuid');
const conn = require('../Conn');
const IgniteClient = require('apache-ignite-client');

const SqlFieldsQuery = IgniteClient.SqlFieldsQuery;
const ParkingModel = require('../models/ParkingModel');

exports.getOrderDetail = async function (id) {
  const orderCache = await conn.getOrCreateCache('PUBLIC');
  const query = new SqlFieldsQuery(`SELECT * FROM p_order WHERE id = '${id}'`);
  const cursor = await orderCache.query(query).catch((e) => console.log(e));

  const result = {};
  do {
    let row = await cursor.getValue();
    result['customer'] = {
      email: row[1],
      name: row[0],
      phone: row[2],
    };
    result['userName'] = row[6];
    result['startTime'] = row[4];
    result['endTime'] = row[5];
    result['_id'] = row[7];
  } while (cursor.hasMore());

  times = [null, null, null, null, null];
  const query_order_status = new SqlFieldsQuery(
    `SELECT * FROM order_status os WHERE os.order_id = '${id}'`
  );
  const cursor_order_status = await orderCache.query(query_order_status);
  do {
    let row = await cursor_order_status.getValue();
    times[row[1]] = row[2];
  } while (cursor_order_status.hasMore());
  result['times'] = times;

  const query_vehicle = new SqlFieldsQuery(
    `SELECT * FROM order_vehicle ov INNER JOIN p_order po ON ov.order_id = po.id INNER JOIN vehicle_type v ON v.parking = po.parking and ov.vehicle = v.type WHERE ov.order_id = '${id}'`
  ).setDistributedJoins(true);
  const cursor_vehicle = await orderCache.query(query_vehicle);
  vehicle = [];
  var parkingId;
  let row = await cursor_vehicle.getValue();
  vehicle.push({
    name: row[1],
    quantity: row[3],
    unitPrice: row[14],
  });
  parkingId = row[6];
  result['vehicles'] = vehicle;

  parkingAdress = await ParkingModel.getParkingAddress(parkingId);
  parkingImg = await ParkingModel.getParkingImgs(parkingId);
  parking = parkingAdress[0];
  (parking['id'] = parkingId), (parking['img'] = parkingImg[0]);

  result['parking'] = parking;

  return result;
};

exports.getOrderHistory = async function (userName) {
  const orderCache = await conn.getOrCreateCache('PUBLIC');
  const query = new SqlFieldsQuery(`SELECT * FROM p_order WHERE customer = '${userName}'`);
  const cursor = await orderCache.query(query);

  let row = await cursor.getValue();
  result = this.getOrderDetail(row[7]);
  return result;
};

exports.getAllOrderBy = async function (userName) {
  const orderCache = await conn.getOrCreateCache('PUBLIC');
  const query = new SqlFieldsQuery(`SELECT po.id as id FROM parking p INNER JOIN u_parking u_p ON p.id = u_p.parking INNER JOIN p_order po ON p.id = po.parking WHERE u_p.userid = '${userName}'`)
  .setDistributedJoins(true);
  const cursor = await orderCache.query(query);

  result = [];
  let row = await cursor.getValue();
  order = await this.getOrderDetail(row[0]);
  parking = order['parking'];
  order['parkingId'] = parking['id'];
  map = {};
  map[parking['name']] = order;
  result.push(map);

  return result;
};

exports.updateNextState = async function (id) {
  const orderCache = await conn.getOrCreateCache('PUBLIC');
  const query = new SqlFieldsQuery(`SELECT MAX(os.status) as m FROM order_status os WHERE os.order_id = '${id}'`);
  const cursor = await orderCache.query(query);

  let row = await cursor.getValue();
  let curStatus = row[0];
  order = await this.getOrderDetail(id);
  vehicles = order['vehicles'];
  parking = order['parking'];

  if (curStatus == 0) {
    vehicles.forEach((v) => {
      const minusAvailableSql = new SqlFieldsQuery(
        `UPDATE vehicle_type SET available = available - ${v['quantity']} WHERE available - ${v['quantity']} >= 0 and parking = ${parking['id']} and type = ${v['name']}`
      );
      const cursorMA = orderCache.query(minusAvailableSql);
      let rowMA = cursorMA.getValue();
      if (rowMA[0] == 0) {
        throw new Error('RUN TIME ERROR');
      }
    });
  } else if (curStatus == 4) {
    return;
  }

  const query_IS = new SqlFieldsQuery(
    `INSERT INTO ORDER_STATUS VALUES(${id}, ${
      curStatus + 1
    }, CURRENT_TIMESTAMP())`
  );
  await orderCache.query(query_IS);

  if (curStatus == 2) {
    vehicles.forEach((v) => {
      const query_PS = new SqlFieldsQuery(
        `UPDATE vehicle_type SET available = available + ${v['quantity']} WHERE parking = ${parking['id']} and type = ${v['name']}`
      );
      const cursorPS = orderCache.query(query_PS);
      let rowPS = cursorPS.getValue();
      if (rowPS[0] == 0) {
        throw new Error('RUN TIME ERROR');
      }
    });
  }

  return result;
};

exports.addOrder = async function (order) {
  const orderCache = await conn.getOrCreateCache('PUBLIC');
  const id = uuidv4();
  const startTime = order['startTime'];
  const startTimeStr =
  startTime.getFullYear() +
    '-' +
    ('00' + (startTime.getMonth() + 1)).slice(-2) +
    '-' +
    ('00' + startTime.getDate()).slice(-2) +
    ' ' +
    ('00' + startTime.getHours()).slice(-2) +
    ':' +
    ('00' + startTime.getMinutes()).slice(-2) +
    ':' +
    ('00' + startTime.getSeconds()).slice(-2);

  console.log(startTimeStr);

  const endTime = order['endTime'];
  const endTimeStr =
  endTime.getFullYear() +
    '-' +
    ('00' + (endTime.getMonth() + 1)).slice(-2) +
    '-' +
    ('00' + endTime.getDate()).slice(-2) +
    ' ' +
    ('00' + endTime.getHours()).slice(-2) +
    ':' +
    ('00' + endTime.getMinutes()).slice(-2) +
    ':' +
    ('00' + endTime.getSeconds()).slice(-2);

  const query_order = new SqlFieldsQuery(
    `INSERT INTO P_ORDER (name, email, phone, parking, start_time, end_time, customer, id) VALUES ('${order['name']}' , '${order['email']}', '${order['phone']}', '${order['parking']}', '${startTimeStr}', '${endTimeStr}', '${order['customer']}', '${id}')`
  );
  // const query_order = new SqlFieldsQuery(`INSERT INTO P_ORDER (name, email, phone, parking, start_time, end_time, customer, id) VALUES ('${order['name']}' , '${order['email']}', '${order['phone']}', '${order['parking']}', TO_DATE((${order['startTime']}), 'yyyy-mm-dd hh24:mi:ss'), TO_DATE((${order['endTime']}), 'yyyy-mm-dd hh24:mi:ss'), '${order['customer']}', '${id}')`);
  await orderCache.query(query_order).catch((e) => console.log(e));

  const query_order_vehicle = new SqlFieldsQuery(
    `INSERT INTO ORDER_VEHICLE (order_id, vehicle, quantity) VALUES('${id}', '${
      Object.keys(order['type'])[0]
    }', '${Object.values(order['type'])[0]}')`
  );
  await orderCache.query(query_order_vehicle).catch((e) => console.log(e));
};
