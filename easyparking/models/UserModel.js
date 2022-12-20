const { v4: uuidv4 } = require('uuid');
const conn = require('../Conn');
const IgniteClient = require('apache-ignite-client');
const SqlFieldsQuery = IgniteClient.SqlFieldsQuery;

exports.getUserByUsername = async function (userName) {
  const userCache = await conn.getOrCreateCache('PUBLIC');
  const query = new SqlFieldsQuery(
    `SELECT * FROM User WHERE username = '${userName}'`
  );
  const cursor = await userCache.query(query);
  console.log(cursor);
  const result = [];
  do {
    let row = await cursor.getValue();
    result.push({
      id: row[0],
      username: row[1],
      password: row[2],
      displayName: row[3],
      email: row[4],
      phone: row[5],
    });
  } while (cursor.hasMore());
  return result;
};

exports.insertOne = async function (user) {
  const userCache = await conn.getOrCreateCache('PUBLIC');
  const id = uuidv4();
  console.log(user);
  const initUser = {
    username: '',
    displayname: '',
    email: '',
    password: '',
    phone: '',
  };

  if (user.userName) {
    initUser.username = user.userName;
  }

  if (user.displayname) {
    initUser.displayname = user.displayname;
  }

  if (user.email) {
    initUser.email = user.email;
  }

  if (user.password) {
    initUser.password = user.password;
  }

  if (user.phone) {
    initUser.phone = user.phone;
  }
console.log(initUser)
  const userQuery =
    new SqlFieldsQuery(`INSERT INTO user(ID, username, displayname, email, password, phone)
  VALUES ('${id}','${initUser.username}', '${initUser.displayname}', '${initUser.email}', '${initUser.password}',
  '${initUser.phone}')`);
  const cursor = await userCache.query(userQuery).catch((e) => console.log(e));
  console.log('Data are inserted');
};
