/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Util = require('util');
const IgniteClient = require('apache-ignite-client');
const ObjectType = IgniteClient.ObjectType;
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;
const CacheConfiguration = IgniteClient.CacheConfiguration;
const SqlFieldsQuery = IgniteClient.SqlFieldsQuery;
const SqlQuery = IgniteClient.SqlQuery;

const PARKING_CACHE_NAME = 'Parking';
const ORDER_CACHE_NAME = 'ParkingOrder';
const USER_CACHE_NAME = 'User';
const CACHE_NAME = 'EasyParking';

// This example shows primary APIs to use with Ignite as with an SQL database:
// - connects to a node
// - creates a cache, if it doesn't exist
// - creates tables (CREATE TABLE)
// - creates indices (CREATE INDEX)
// - writes data of primitive types into the tables (INSERT INTO table)
// - reads data from the tables (SELECT ...)
// - deletes tables (DROP TABLE)
// - destroys the cache
class SqlExample {
  async start() {
    const igniteClient = new IgniteClient();
    try {
      const igniteClientConfiguration = new IgniteClientConfiguration(
        '53e22b07-8ae5-4b42-aefd-090d769ae8a2.gridgain-nebula.com:10800'
      )
        .setUserName('bang')
        .setPassword('tYLOyZVk50Kid0S')
        .setConnectionOptions(true);

      await igniteClient.connect(igniteClientConfiguration);

      const cache = await igniteClient.getOrCreateCache(
        CACHE_NAME,
        new CacheConfiguration().setSqlSchema('EasyParking')
      );

      await this.deleteDatabaseObjects(cache);

      await this.createDatabaseObjects(cache);
      // await this.insertData(cache);

      const parkingCache = igniteClient.getCache(PARKING_CACHE_NAME);
      const orderCache = igniteClient.getCache(ORDER_CACHE_NAME);
      const userCache = igniteClient.getCache(USER_CACHE_NAME);

      // await this.getMostPopulatedCities(countryCache);
      // await this.getTopCitiesInThreeCountries(cityCache);
      // await this.getCityDetails(cityCache, 5);

      // await this.deleteDatabaseObjects(cache);
      // await igniteClient.destroyCache(DUMMY_CACHE_NAME);
    } catch (err) {
      console.log('ERROR: ' + err);
    } finally {
      igniteClient.disconnect();
    }
  }

  // async getConnection() {
  //     const igniteClient = new IgniteClient();
  //     await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800', '127.0.0.1:10801', '127.0.0.1:10802'));
  //     return igniteClient
  // }

  async createDatabaseObjects(cache) {
    const createParkingTable = `CREATE TABLE Parking (
            ID CHAR(50) PRIMARY KEY,
            Name CHAR(52),
            Street CHAR(50),
            Ward CHAR(50),
            District CHAR(50),
            Province CHAR(50),
            Description CHAR(50),
            Img CHAR(50),
            Price CHAR(50),
            Username CHAR(50),
        ) WITH "template=partitioned, backups=1, CACHE_NAME=${PARKING_CACHE_NAME}"`;

    const createUserTable = `CREATE TABLE User (
            ID CHAR(50) PRIMARY KEY,
            Username CHAR(50),
            DisplayNAme CHAR(50),
            Email CHAR(50),
            Phone CHAR(20),
        ) WITH "template=partitioned, backups=1, CACHE_NAME=${USER_CACHE_NAME}"`;

    const createOrderTable = `CREATE TABLE ParkingOrder (
            ID CHAR(50) PRIMARY KEY,
            Times DATE,
            Customer CHAR(30),
            PaymentMethod CHAR(30),
            StartTime DATE,
            EndTime DATE,
            Price CHAR(50),
            ParkingId CHAR(50),
            Username CHAR(50),
        ) WITH "template=partitioned, backups=1, CACHE_NAME=${ORDER_CACHE_NAME}"`;

    // create tables
    (await cache.query(new SqlFieldsQuery(createParkingTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createUserTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createOrderTable))).getAll();

    console.log('Database objects created');
  }

  async deleteDatabaseObjects(cache) {
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS Parking'))
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS User'))
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS ParkingOrder'))
    ).getAll();
    console.log('Database objects dropped');
  }

  onStateChanged(state, reason) {
    if (state === IgniteClient.STATE.CONNECTED) {
      console.log('Client is started');
    } else if (state === IgniteClient.STATE.DISCONNECTED) {
      console.log('Client is stopped');
      if (reason) {
        console.log(reason);
      }
    }
  }
}

const sqlExample = new SqlExample();
sqlExample.start();
