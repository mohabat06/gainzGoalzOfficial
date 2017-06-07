var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Gainz Goalz Recipe List Results', function () {
//	this.timeout(15000);

	var requestResult;
	var response;
		 
    before(function (done) {
        chai.request("http://gainzgoalzzz.azurewebsites.net")
			.get("/app/recipe")
			.end(function (err, res) {
				requestResult = res.body;
				response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
				done();
			});
        });
    
    it('Should return an array object with more than 1 object', function (){
		expect(response).to.have.status(200);
		expect(response.body).to.have.length.above(2);
        expect(response.body).to.be.instanceof(Array);
    });
    
	it('The first entry in the array has known properties', function(){
	    expect(requestResult[0]).to.have.property('recipeTitle');
	    expect(requestResult[0]).to.have.property('_id');
		expect(response.body).to.not.be.a.string;
	});
	it('The elements in the array have the expected properties', function(){
		expect(response.body).to.satisfy(
			function (body) {
				for (var i = 0; i < body.length; i++) {
					expect(body[i]).to.have.property('_id');
					expect(body[i]).to.have.property('recipeTitle');
					expect(body[i]).to.have.property('recipeId');
					expect(body[i]).to.have.property('ingredients');
                    expect(body[i]).to.have.property('instructions');
                    expect(body[i]).to.have.property('calories');
                    expect(body[i]).to.have.property('protein');
                    expect(body[i]).to.have.property('fat');
                    expect(body[i]).to.have.property('carbs');
                    expect(body[i]).to.have.property('sugar');
                    expect(body[i]).to.have.property('created_by');
                }
				return true;
			});
	});	
	
});


describe('Gainz Goalz User Recipe List Results', function () {
//	this.timeout(15000);

	var requestResult;
	var response;
		 
    before(function (done) {
        chai.request("http://gainzgoalzzz.azurewebsites.net")
			.get("/app/usersrecipes/118149660158688004769")
			.end(function (err, res) {
				requestResult = res.body;
				response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
				done();
			});
        });
    
    it('Should return an array object with more than 0 object', function (){
		expect(response).to.have.status(200);
		expect(response.body).to.have.length.above(0);
        expect(response.body).to.be.instanceof(Array);
    });
    
	it('The first entry in the array has known properties', function(){
	    expect(requestResult[0]).to.have.property('recipeTitle');
	    expect(requestResult[0]).to.have.property('_id');
		expect(response.body).to.not.be.a.string;
	});
	it('The elements in the array have the expected properties', function(){
		expect(response.body).to.satisfy(
			function (body) {
				for (var i = 0; i < body.length; i++) {
					expect(body[i]).to.have.property('_id');
					expect(body[i]).to.have.property('recipeTitle');
					expect(body[i]).to.have.property('recipeId');
					expect(body[i]).to.have.property('ingredients');
                    expect(body[i]).to.have.property('instructions');
                    expect(body[i]).to.have.property('calories');
                    expect(body[i]).to.have.property('protein');
                    expect(body[i]).to.have.property('fat');
                    expect(body[i]).to.have.property('carbs');
                    expect(body[i]).to.have.property('sugar');
                    expect(body[i]).to.have.property('created_by');
                }
				return true;
			});
	});	
	
});










    describe('Test Create Recipe', function () {
    var requestResult;
	var response;

    //POST TEST
    it('Get an object of a recipe that was created',() => {
        let account = {
			recipeTitle: 'Coffee',
    		recipeId: 400,
    		ingredients: 'Coffee Beans, 2% Milk',
    		instructions: 'Mix and Drink',
    		calories: 500,
    		protein: 30,
    		fat: 20,
    		carbs: 10,
    		sugar: 10,
    		created_by: 'testuser'
        }
        chai.request('http://gainzgoalzzz.azurewebsites.net/')
        .post('/add_recipe')
        .send(account)
        .end((err, res) => {
            res.body.should.be.a('object');
            res.body.should.have.property('recipeTitle').eql('Coffee');
            res.body.should.have.property('recipeId').eql(400);
            res.body.should.have.property('ingredients').eql('Coffee Beans, 2% Milk');
            res.body.should.have.property('instructions').eql('Mix and Drink');
            res.body.should.have.property('calories').eql(500);
            res.body.should.have.property('protein').eql(30);
            res.body.should.have.property('fat').eql(20);
            res.body.should.have.property('carbs').eql(10);
            res.body.should.have.property('sugar').eql(10);      
            done();
        });
    });
});