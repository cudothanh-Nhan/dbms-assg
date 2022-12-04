const { v4: uuidv4 } = require('uuid');
const conn = require('../Conn');
const PARKING_CACHE_NAME = 'PARKING';
const IgniteClient = require('apache-ignite-client');
const { map } = require('../app');

const SqlFieldsQuery = IgniteClient.SqlFieldsQuery;
const CacheConfiguration = IgniteClient.CacheConfiguration;
const parkingCache = conn.getCache(
  PARKING_CACHE_NAME,
  new CacheConfiguration().setSqlSchema('EasyParking')
);

exports.getAll = async function () {
  const cursor = await parkingCache.query(
    new SqlFieldsQuery('SELECT * FROM Parking')
  );
  const result = [];
  do {
    let row = await cursor.getValue();
    result.push({
      id: row[0],
      name: row[1],
      street: row[2],
      ward: row[3],
      district: row[4],
      province: row[5],
      description: row[6],
      img: row[7],
      price: row[8],
      username: row[9],
    });
  } while (cursor.hasMore());
  return result;
};

exports.findOne = async function (id) {
  const query = new SqlFieldsQuery(`SELECT * FROM Parking WHERE id = '${id}'`);
  const cursor = await parkingCache.query(query);
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
      img: row[7],
      price: row[8],
      username: row[9],
    });
  } while (cursor.hasMore());
  return result[0];
};

exports.find = async function (username) {
  const query = new SqlFieldsQuery(
    `SELECT * FROM Parking WHERE username = '${username}'`
  );
  const cursor = await parkingCache.query(query);
  const result = [];
  do {
    let row = await cursor.getValue();
    result.push({
      name: row[1],
      street: row[2],
      ward: row[3],
      district: row[4],
      province: row[5],
      description: row[6],
      img: row[7],
      price: row[8],
      username: row[9],
    });
  } while (cursor.hasMore());
  return result;
};

exports.insertOne = async function (parking) {
  const id = uuidv4();
  console.log(id);
  const initParking = {
    name: '',
    street: '',
    ward: '',
    district: '',
    province: '',
    description: '',
    img: [],
    price: [],
    username: '',
  };

  if (parking.name) {
    initParking.name = parking.name;
  }

  if (parking.street) {
    initParking.street = parking.street;
  }

  if (parking.ward) {
    initParking.ward = parking.ward;
  }

  if (parking.district) {
    initParking.district = parking.district;
  }

  if (parking.province) {
    initParking.province = parking.province;
  }

  if (parking.description) {
    initParking.description = parking.description;
  }

  if (parking.img) {
    initParking.img = parking.img;
  }

  if (parking.price) {
    initParking.price = parking.price;
  }

  if (parking.username) {
    initParking.username = parking.username;
  }

  const parkingQuery =
    new SqlFieldsQuery(`INSERT INTO Parking(ID, Name, Street, Ward, District, Province, Description, Img, Price, Username)
  VALUES ('${id}','${initParking.name}', '${initParking.street}', '${initParking.ward}', 
  '${initParking.district}', '${initParking.province}', '${initParking.description}', '${initParking.img}','${initParking.price}','${initParking.username}')`);
  const cursor = await parkingCache
    .query(parkingQuery)
    .catch((e) => console.log(e));
  console.log('Data are inserted');
};

exports.getParkingAddress = async function (id) {
  const query = new SqlFieldsQuery(
    `SELECT p.id, p.description, p.name, p.address, c.name as city, d.name as district FROM parking p INNER JOIN city c ON p.city = c.id INNER JOIN district d ON p.district = d.id WHERE p.id = '${id}'`
  ).setDistributedJoins(true);
  const cursor = await parkingCache.query(query).catch((e) => console.log(e));
  const result = [];
  do {
    let row = await cursor.getValue();
    result.push({
      description: row[1],
      name: row[2],
      address: row[3],
      province: row[4],
      district: row[5],
      ward: '',
    });
  } while (cursor.hasMore());
  return result;
};

exports.getParkingImgs = async function (id) {
  const query = new SqlFieldsQuery(
    `SELECT i.url FROM park_image i WHERE i.parking = '${id}'`
  ).setDistributedJoins(true);
  const cursor = await parkingCache.query(query).catch((e) => console.log(e));
  const result = [];
  do {
    let row = await cursor.getValue();
    console.log(row);
    if (row) result.push(row[0]);
  } while (cursor.hasMore());

  if (result.length == 0) {
    result.push(
      'https://hanoimoi.com.vn/Uploads/anhthu/2018/1/17/baove-xe.jpg'
    );
  }

  return result;
};

exports.getParkingType = async function (id) {
  const query = new SqlFieldsQuery(
    `SELECT t.* FROM parking p INNER JOIN vehicle_type t ON p.id = t.parking WHERE p.id = '${id}'`
  ).setDistributedJoins(true);
  const cursor = await parkingCache.query(query);
  const result = [];
  do {
    let row = await cursor.getValue();
    if (!row) {
      result.push({
        name: '',
        capacity: '',
        price: '',
        available: '',
      });
      continue;
    }

    result.push({
      name: row[1],
      capacity: row[2],
      price: row[3],
      available: row[4],
    });
  } while (cursor.hasMore());
  return result;
};

exports.getFeedback = async function (id) {
  const query = new SqlFieldsQuery(
    `SELECT f.* FROM feedback f WHERE f.parking = '${id}'`
  ).setDistributedJoins(true);
  const cursor = await parkingCache.query(query);
  const result = [];
  do {
    let row = await cursor.getValue();
    if (!row) {
      result.push({
        userName: '',
        content: '',
        time: '',
        rate: '',
      });
      continue;
    }

    result.push({
      userName: row[1],
      content: row[3],
      time: row[4],
      rate: row[5],
    });
  } while (cursor.hasMore());

  return result;
};

exports.getParkingById = async function (id) {
  const address = await this.getParkingAddress(id);
  const img = await this.getParkingImgs(id);
  const type = await this.getParkingType(id);
  const feedback = await this.getFeedback(id);

  const result = {
    address,
    img,
    type,
    feedback,
  }

  return result;
};

exports.summaryProvince = async function () {
  const query = new SqlFieldsQuery(
    'SELECT c.id, c.name, COUNT(*) FROM parking p INNER JOIN city c ON p.city = c.id GROUP BY c.name, c.id'
  ).setDistributedJoins(true);
  const cursor = await parkingCache.query(query);
  console.log(cursor, 3);
  const result = [];
  do {
    let row = await cursor.getValue();
    console.log(row);
    result.push({
      id: row[0],
      province: row[1],
      count: row[2],
      rate: row[2],
    });
  } while (cursor.hasMore());

  return result;
};

exports.getParkingByCity = async function (cityId) {
  const query = new SqlFieldsQuery(
    `SELECT * FROM parking p INNER JOIN city c ON p.city = c.id WHERE c.id = '${cityId}'`
  ).setDistributedJoins(true);
  const cursor = await parkingCache.query(query).catch((e) => console.log(e));
  const result = [];
  do {
    let row = await cursor.getValue();
    console.log(row);
    const id = row[0];
    const parking = await this.getParkingById(id);
    result.push({
      feedback: parking.feedback,
      img: parking.img,
      type: parking.type,
      address: parking.address.address,
      province: parking.address[0].province,
      district: parking.address[0].district,
      name: parking.address[0].name,
      description: parking.address[0].description,
      ward: parking.address[0].ward,
    });
  } while (cursor.hasMore());
  return result;
};

exports.getPopularParking = async function () {
  const query = new SqlFieldsQuery(
    'SELECT * FROM (SELECT f.parking, avg(f.rate) as rate, count(f.rate) as nFeedback FROM feedback f GROUP BY f.parking ORDER BY avg(f.rate) DESC)'
  ).setDistributedJoins(true);
  const cursor = await parkingCache.query(query).catch((e) => console.log(e));
  const result = [];
  do {
    let row = await cursor.getValue();
    console.log(row);
    const id = row[0];
    const address = await this.getParkingAddress(id);
    const img = await this.getParkingImgs(id);
    const type = await this.getParkingType(id);
    result.push({
      _id: id,
      rate: row[1],
      nFeedback: row[2],
      img: img,
      address: address[0].address,
      province: address[0].province,
      district: address[0].district,
      name: address[0].name,
      description: address[0].description,
      ward: '',
      type: type,
    });

    if (result.length >= 4) {
      break;
    }
  } while (cursor.hasMore());
  return result;
};
