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

const IgniteClient = require('apache-ignite-client');
const ObjectType = IgniteClient.ObjectType;
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;
const CacheConfiguration = IgniteClient.CacheConfiguration;
const SqlFieldsQuery = IgniteClient.SqlFieldsQuery;
const SqlQuery = IgniteClient.SqlQuery;

const CACHE_NAME = 'EasyParking';

const CITY_CACHE_NAME = 'CITY';
const DISTRICT_CACHE_NAME = 'DISTRICT';
const FEEDBACK_CACHE_NAME = 'FEEDBACK';
const ORDER_STATUS_CACHE_NAME = 'ORDER_STATUS';
const ORDER_VEHICLE_CACHE_NAME = 'ORDER_VEHICLE';
const PARKING_CACHE_NAME = 'PARKING';
const PERSON_CACHE_NAME = 'PERSON';
const PARK_IMAGE_CACHE_NAME = 'PARK_IMAGE';
const P_ORDER_CACHE_NAME = 'P_ORDER';
const U_PARKING_CACHE_NAME = 'U_PARKING';
const VEHICLE_TYPE_CACHE_NAME = 'VEHICLE_TYPE';

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
        'e20ae279-d590-4d02-9357-46f7cadb7fc4.gridgain-nebula.com:10800'
      )
        .setUserName('easyparking')
        .setPassword('zNUaRx6rhUJcpEz')
        .setConnectionOptions(true);
      await igniteClient.connect(igniteClientConfiguration);

      const cache = await igniteClient.getOrCreateCache(
        CACHE_NAME,
        new CacheConfiguration().setSqlSchema('EasyParking')
      );

      await this.deleteDatabaseObjects(cache);
      await this.createDatabaseObjects(cache);
    } catch (err) {
      console.log('ERROR: ' + err);
    } finally {
      igniteClient.disconnect();
    }
  }

  async createDatabaseObjects(cache) {
    const createCityTable = `CREATE TABLE CITY (
        ID VARCHAR(40),
        NAME VARCHAR(100),
        PRIMARY KEY (ID),
    ) WITH "template=partitioned, backups=1, CACHE_NAME=${CITY_CACHE_NAME}"`;

    const createDistrictTable = `CREATE TABLE DISTRICT (
        ID VARCHAR(20),
        NAME VARCHAR(20),
        CITY VARCHAR(20),
        PRIMARY KEY (ID, city),
    ) WITH "template=partitioned, backups=1, affinity_key=city, CACHE_NAME=${DISTRICT_CACHE_NAME}"`;

    const createFeedbackTable = `CREATE TABLE FEEDBACK (
        ID VARCHAR(20),
        USERID VARCHAR(20),
        PARKING VARCHAR(60),
        TEXT VARCHAR(1024),
        TIME TIMESTAMP(6),
        RATE DOUBLE,
        PRIMARY KEY (ID,PARKING),
    ) WITH "template=partitioned, backups=1, affinity_key=PARKING, CACHE_NAME=${FEEDBACK_CACHE_NAME}"`;

    const createOrderStatusTable = `CREATE TABLE ORDER_STATUS (
        ORDER_ID VARCHAR(20),
        STATUS INT,
        TIME TIMESTAMP(6),
        PRIMARY KEY (ORDER_ID, STATUS),
    ) WITH "template=partitioned, backups=1, affinity_key=order_id, CACHE_NAME=${ORDER_STATUS_CACHE_NAME}"`;

    const createOrderVehicleTable = `CREATE TABLE ORDER_VEHICLE (
        ORDER_ID VARCHAR(20),
        VEHICLE VARCHAR(20),
        QUANTITY INT,
        PRIMARY KEY (ORDER_ID, VEHICLE),
    ) WITH "template=partitioned, backups=1, affinity_key=order_id, CACHE_NAME=${ORDER_VEHICLE_CACHE_NAME}"`;

    const createParkingTable = `CREATE TABLE PARKING (
        ID VARCHAR(60),
        NAME VARCHAR(100),
        CITY VARCHAR(20),
        ADDRESS VARCHAR(100),
        DESCRIPTION VARCHAR(1024),
        DISTRICT VARCHAR(20),
        PRIMARY KEY (ID,CITY),
    ) WITH "template=partitioned, backups=1, affinity_key=CITY, CACHE_NAME=${PARKING_CACHE_NAME}"`;

    const createParkImageTable = `CREATE TABLE PARK_IMAGE (
        PARKING VARCHAR(20),
        URL VARCHAR(1024),
        IDX DECIMAL,
        PRIMARY KEY (PARKING, IDX),
    ) WITH "template=partitioned, backups=1, affinity_key=parking, CACHE_NAME=${PARK_IMAGE_CACHE_NAME}"`;

    const createPersonTable = `CREATE TABLE PERSON (
        ID VARCHAR(20),
        NAME VARCHAR(40),
        PRIMARY KEY (ID),
    ) WITH "template=partitioned, backups=1, CACHE_NAME=${PERSON_CACHE_NAME}"`;

    const createPOrderTable = `CREATE TABLE P_ORDER (
        NANE VARCHAR(254),
        EMAIL VARCHAR(254),
        PHONE VARCHAR(20),
        PARKING VARCHAR(20),
        START_TIME TIMESTAMP(6),
        END_TIME TIMESTAMP(6),
        CUSTOMER VARCHAR(20),
        ID VARCHAR(20),
        PRIMARY KEY (ID, customer),
    ) WITH "template=partitioned, backups=1, affinity_key=customer, CACHE_NAME=${P_ORDER_CACHE_NAME}"`;

    const createUParkingTable = `CREATE TABLE U_PARKING (
        ID VARCHAR(20),
        USERID VARCHAR(20),
        PARKING VARCHAR(20),
        PRIMARY KEY (PARKING, USERID),
    ) WITH "template=partitioned, backups=1, affinity_key=userid, CACHE_NAME=${U_PARKING_CACHE_NAME}"`;

    const createVehicleTypeTable = `CREATE TABLE VEHICLE_TYPE (
        PARKING VARCHAR(254),
        TYPE VARCHAR(254),
        CAPACITY INT,
        PRICE DOUBLE,
        AVAILABLE INT,
        PRIMARY KEY (PARKING, TYPE),
    ) WITH "template=partitioned, backups=1, affinity_key=PARKING, CACHE_NAME=${VEHICLE_TYPE_CACHE_NAME}"`;

    (await cache.query(new SqlFieldsQuery(createCityTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createDistrictTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createFeedbackTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createOrderStatusTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createOrderVehicleTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createParkingTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createParkImageTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createPersonTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createPOrderTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createUParkingTable))).getAll();
    (await cache.query(new SqlFieldsQuery(createVehicleTypeTable))).getAll();

    console.log('Database objects created');
  }

  async deleteDatabaseObjects(cache) {
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS CITY'))
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS DISTRICT'))
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS FEEDBACK'))
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS ORDER_STATUS'))
    ).getAll();
    (
      await cache.query(
        new SqlFieldsQuery('DROP TABLE IF EXISTS ORDER_VEHICLE')
      )
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS PARKING'))
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS PERSON'))
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS PARK_IMAGE'))
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS P_ORDER'))
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS U_PARKING'))
    ).getAll();
    (
      await cache.query(new SqlFieldsQuery('DROP TABLE IF EXISTS VEHICLE_TYPE'))
    ).getAll();
    console.log('Database objects dropped');
  }

  onStateChanged(state, reason) {
    if (state === IgniteClient.STATE.CONNECTED)
      console.log('Client is started');
    else if (state === IgniteClient.STATE.DISCONNECTED) {
      console.log('Client is stopped');
      if (reason) {
        console.log(reason);
      }
    }
  }
}

const sqlExample = new SqlExample();
sqlExample.start();
