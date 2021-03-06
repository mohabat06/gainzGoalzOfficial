import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as url from 'url';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';


import UserModel from './model/UserModel';
import RecipeModel from './model/RecipeModel';

import DataAccess from './DataAccess';
import GooglePassportObj from './GooglePassport';


let passport = require('passport');
let randomID = require('random-int');

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;
  public recipes:RecipeModel;
  public idGenerator:number;
  public Users: UserModel;
  public idGeneratorUser: number;
  public googlePassportObj:GooglePassportObj;
 

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.idGenerator = randomID(99999999999999);
    this.recipes = new RecipeModel();
    this.Users = new UserModel();
    this.googlePassportObj = new GooglePassportObj;
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(session({secret: 'keyboard cat'}));
    this.express.use(passport.initialize());
    this.express.use(passport.session());
  }

    private validateAuth(req, res, next):void {
    if (req.isAuthenticated()) { return next(); }
        res.redirect('/login');
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();
    
   /* router.use( (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }); */
    
    router.get('/auth/google', 
        passport.authenticate('google', 
            { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }
        )
    );

    router.get('/auth/google/callback', 
        passport.authenticate('google', 
            { successRedirect: '/recipe', failureRedirect: '/'
            }
        )
    );

    router.get('/auth/userdata', this.validateAuth, (req, res) => {
        console.log('user object:' + JSON.stringify(req.user));
        res.json(req.user);
    });

    router.post('/app/recipe/', this.validateAuth, (req, res) => {
        console.log(req.body);
        var jsonObj = req.body;
        jsonObj.recipeId = this.idGenerator;
        jsonObj.created_by = req.user.id;
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
        this.recipes.retrieveSingleRecipe(res, {recipeId: id});
    });

    router.get('/app/usersrecipes/:created_by', (req, res) => {
        var createdId = req.params.created_by;
        console.log('Query All recipes by user Id: ' + createdId);
        this.recipes.retrieveUserRecipe(res, {created_by: createdId});
    });

    router.get('/app/recipe/', (req, res) => {
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

    this.express.use('/', express.static(__dirname+'/dist'));

        this.express.use('/', router);


  }

}

export default new App().express;
