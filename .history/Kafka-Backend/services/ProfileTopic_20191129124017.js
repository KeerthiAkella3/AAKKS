const express = require('express');

var app = express();
app.set('view engine', 'ejs');

var Users = require('../models/UserSchema');

router = express.Router();
var exports = module.exports = {};

exports.profileTopicService = function profileTopicService(msg, callback) {
    console.log("e path:", msg.path);
    switch (msg.path) {
        case "getProfileDetails":
            getProfileDetails(msg, callback);
            break;
        case "updateProfile":
            updateProfile(msg, callback);
            break;
    }
};


async function getProfileDetails(msg, callback) {

    console.log("In user getProfileDetails topic service. Msg: ", msg);

    Users.findOne({ username: msg.data }, async function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            console.log(" got user ");
            callback(null, { status: 200, rows });
        }
    });

}


async function updateProfile(msg, callback) {

    console.log("In user updateProfile topic service. Msg: ", msg);
    console.log(msg)
    let con = await dbConnection();
    Users.findOneAndUpdate({ username: msg.data.profileDetails.username }, {
        $set: {
            "firstName": msg.data.profileDetails.firstName,
            "lastName": msg.data.profileDetails.lastName,
            "description": msg.data.profileDetails.description,
            "state": msg.data.profileDetails.state,
            "city": msg.data.profileDetails.city,
            "zipcode": msg.data.profileDetails.zipcode,
        }
    })
    try {
        await con.query("START TRANSACTION");
        let savedUser = await con.query('UPDATE userMysql SET firstname = ?, lastName= ?', [msg.data.profileDetails.firstName, msg.data.profileDetails.lastName]);
        await con.query("COMMIT");
        console.log(savedUser)
    } catch (ex) {
        console.log(ex);
        await con.query("ROLLBACK");
        console.log(ex);
        //callback(null, { status: 500 });
        throw ex;
    } finally {
        await con.release();
        await con.destroy();
    }

}
