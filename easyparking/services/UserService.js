// const UserModel = require("../models/UserModel.js");

// module.exports = {
// createUser: async (user) => {
//   const userModel = new UserModel(user);
//   const newUser = await userModel.save();
//   return newUser;
// },

//   authenticate: async (userName, password) => {
//     const userExist = await UserModel.exists({ $and: [{userName: userName}, {password: password}]});
//     console.log(userExist)
//     return userExist;
//   },

//   getUserInfo: async(userName) => {
//     const userInfo = await UserModel.findOne({userName: userName});
//     return userInfo;
//   }
// }

const UserModel = require('../models/UserModel.js');

module.exports = {
  createUser: async (user) => {
    return await UserModel.insertOne(user);
  },
  getUserInfo: async (userName) => {
    const userInfo = await UserModel.getUserByUsername(userName);
    return userInfo;
  },
  authenticate: async (userName, password) => {
    const userInfo = await UserModel.getUserByUsername(userName);
    console.log(userInfo[0].password,'@@');
    if (password !== userInfo[0].password) return false;

    return true;
  },
};
