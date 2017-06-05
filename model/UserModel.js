"use strict";
exports.__esModule = true;
var DataAccess_1 = require("../DataAccess");
var mongoose = DataAccess_1["default"].mongooseInstance;
var mongooseConnection = DataAccess_1["default"].mongooseConnection;
var UserModel = (function () {
    function UserModel() {
        this.createSchema();
        this.createModel();
    }
    UserModel.prototype.createSchema = function () {
        this.schema = mongoose.Schema({
            userId: String,
            name: String,
            password: String
        }, { collection: 'user' });
    };
    UserModel.prototype.createModel = function () {
        this.model = mongooseConnection.model("User", this.schema);
    };
    UserModel.prototype.retrieveUserDetails = function (response, filter) {
        var query = this.model.findOne(filter);
        query.exec(function (err, user) {
            response.json(user.userId);
        });
    };
    UserModel.prototype.retrieveAllUsers = function (response, filter) {
        var query = this.model.find(filter);
        query.exec(function (err, userList) {
            response.json(userList);
        });
    };
    return UserModel;
}());
exports["default"] = UserModel;
