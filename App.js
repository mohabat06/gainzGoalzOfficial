"use strict";
exports.__esModule = true;
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var session = require("express-session");
var UserModel_1 = require("./model/UserModel");
var RecipeModel_1 = require("./model/RecipeModel");
var GooglePassport_1 = require("./GooglePassport");
var passport = require('passport');
// Creates and configures an ExpressJS web server.
var App = (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
        this.idGenerator = 100;
        this.recipes = new RecipeModel_1["default"]();
        this.Users = new UserModel_1["default"]();
        this.googlePassportObj = new GooglePassport_1["default"];
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(session({ secret: 'keyboard cat' }));
        this.express.use(passport.initialize());
        this.express.use(passport.session());
    };
    App.prototype.validateAuth = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        /* router.use( (req, res, next) => {
             res.header("Access-Control-Allow-Origin", "*");
             res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
             next();
         }); */
        router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));
        router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/recipe', failureRedirect: '/'
        }));
        router.get('/auth/userdata', this.validateAuth, function (req, res) {
            console.log('user object:' + JSON.stringify(req.user));
            res.json(req.user);
        });
        router.post('/app/recipe/', this.validateAuth, function (req, res) {
            console.log(req.body);
            var jsonObj = req.body;
            jsonObj.recipeId = _this.idGenerator;
            _this.recipes.model.create([jsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send(_this.idGenerator.toString());
            _this.idGenerator++;
        });
        router.get('/app/recipe/:recipeId', function (req, res) {
            var id = req.params.recipeId;
            console.log('Query single recipe with id: ' + id);
            _this.recipes.retrieveSingleRecipe(res, { recipeId: id });
        });
        router.get('/app/recipe/', function (req, res) {
            console.log('Query All recipe');
            _this.recipes.retrieveAllRecipes(res);
        });
        router.get('*', function (req, res) {
            res.sendFile(__dirname + '/dist/index.html');
        });
        router.get('/auth/userdata', this.validateAuth, function (req, res) {
            console.log('user object:' + JSON.stringify(req.user));
            res.json(req.user);
        });
        /*
            this.express.use('/app/json/', express.static(__dirname+'/app/json'));
            this.express.use('/images', express.static(__dirname+'/Images'));
            this.express.use('/styles', express.static(__dirname+'/Styles'));
            this.express.use('/', express.static(__dirname+'/pages')); */
        this.express.use('/', express.static(__dirname + '/dist'));
        this.express.use('/', router);
    };
    return App;
}());
exports["default"] = new App().express;
