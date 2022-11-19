const { v4: uuidv4 } = require('uuid');
const conn = require('../Conn');
const PARKING_CACHE_NAME = 'Parking';
const IgniteClient = require('apache-ignite-client');

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
  console.log(cursor, 234);
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
  const query = new SqlFieldsQuery(`SELECT * FROM Parking WHERE id = '${id}'`);
  console.log(query);
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

exports.insertOne = async function (parking) {
  const id = uuidv4();
  console.log(id);
  const initParking = {
    name: '',
    street: '',
    ward: '',
    district: '',
    province: '',
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
    new SqlFieldsQuery(`INSERT INTO Parking(ID, Name, Street, Ward, District, Province, Img, Price, Username)
  VALUES ('${id}','${initParking.name}', '${initParking.street}', '${initParking.ward}', 
  '${initParking.district}', '${initParking.province}', '${initParking.img}','${initParking.price}','${initParking.username}')`);
  const cursor = await parkingCache
    .query(parkingQuery)
    .catch((e) => console.log(e));
  console.log(cursor, 123);
  console.log('Data are inserted');
};
