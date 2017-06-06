"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataAccess_1 = require("../DataAccess");
var mongoose = DataAccess_1.default.mongooseInstance;
var mongooseConnection = DataAccess_1.default.mongooseConnection;
class UserModel {
    constructor() {
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        this.schema = mongoose.Schema({
            userId: String,
            name: String,
            password: String
        }, { collection: 'user' });
    }
    createModel() {
        this.model = mongooseConnection.model("User", this.schema);
    }
    retrieveUserDetails(response, filter) {
        var query = this.model.findOne(filter);
        query.exec((err, user) => {
            response.json(user.userId);
        });
    }
    retrieveAllUsers(response, filter) {
        var query = this.model.find(filter);
        query.exec((err, userList) => {
            response.json(userList);
        });
    }
}
exports.default = UserModel;
