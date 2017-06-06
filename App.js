"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const UserModel_1 = require("./model/UserModel");
const RecipeModel_1 = require("./model/RecipeModel");
const GooglePassport_1 = require("./GooglePassport");
let passport = require('passport');
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.idGenerator = 100;
        this.recipes = new RecipeModel_1.default();
        this.Users = new UserModel_1.default();
        this.googlePassportObj = new GooglePassport_1.default;
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(session({ secret: 'keyboard cat' }));
        this.express.use(passport.initialize());
        this.express.use(passport.session());
    }
    validateAuth(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }
    // Configure API endpoints.
    routes() {
        let router = express.Router();
        /* router.use( (req, res, next) => {
             res.header("Access-Control-Allow-Origin", "*");
             res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
             next();
         }); */
        router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));
        router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/recipe', failureRedirect: '/'
        }));
        router.get('/auth/userdata', this.validateAuth, (req, res) => {
            console.log('user object:' + JSON.stringify(req.user));
            res.json(req.user);
        });
        router.post('/app/recipe/', (req, res) => {
            console.log(req.body);
            var jsonObj = req.body;
            jsonObj.recipeId = this.idGenerator;
            this.recipes.model.create([jsonObj], (err) => {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send(this.idGenerator.toString());
            this.idGenerator++;
        });
        router.get('/app/recipe/:recipeId', (req, res) => {
            var id = req.params.recipeId;
            console.log('Query single recipe with id: ' + id);
            this.recipes.retrieveSingleRecipe(res, { recipeId: id });
        });
        router.get('/app/recipe/', this.validateAuth, (req, res) => {
            console.log('Query All recipe');
            this.recipes.retrieveAllRecipes(res);
        });
        router.get('*', (req, res) => {
            res.sendFile(__dirname + '/dist/index.html');
        });
        router.get('/auth/userdata', this.validateAuth, (req, res) => {
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
    }
}
exports.default = new App().express;
