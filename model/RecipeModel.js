"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataAccess_1 = require("../DataAccess");
var mongoose = DataAccess_1.default.mongooseInstance;
var mongooseConnection = DataAccess_1.default.mongooseConnection;
class RecipeModel {
    constructor() {
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        this.schema = mongoose.Schema({
            recipeTitle: String,
            recipeId: Number,
            ingredients: String,
            instructions: String,
            calories: Number,
            protein: Number,
            fat: Number,
            carbs: Number,
            sugar: Number,
            created_by: String
        }, { collection: 'recipes' });
    }
    createModel() {
        this.model = mongooseConnection.model("Recipes", this.schema);
    }
    retrieveAllRecipes(response) {
        var query = this.model.find({});
        query.exec((err, itemArray) => {
            response.json(itemArray);
        });
    }
    retrieveSingleRecipe(response, filter) {
        var query = this.model.findOne(filter);
        query.exec((err, itemArray) => {
            response.json(itemArray);
        });
    }
    retrieveUserRecipe(response, filter) {
        var query = this.model.find(filter);
        query.exec((err, itemArray) => {
            response.json(itemArray);
        });
    }
}
exports.default = RecipeModel;
