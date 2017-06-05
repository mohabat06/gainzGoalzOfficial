import Mongoose= require('mongoose');
import DataAccess from '../DataAccess';
import IUserModel from '..interfaces/IUserModel';

var mongoose= DataAccess.mongooseInstance;
var mongooseConnection= DataAccess.mongooseConnection;

export default class UserModel{
    public schema: Mongoose.Schema;
    public model:any

    public constructor(){
        this.createSchema();
        this.createModel();
    }

    public.createSchema(): void{
        this.schema=mongoose.Schema(
            {
                userId: String,
                name: String,
                password: String,
            }, {collection: 'user'}
        );
    }

    public createModel(): void{
        this.model=mongooseConnection..model<IUserModel>("User", this.schema);
    }

    public retrieveUserDetails(response: any, filter:Object){
        var query= this.model.findOne(filter);
        query.exec( (err, user) => {
            response.json(user.userId);
        });
    }

    public retrieveAllUsers(reponse:any, filter:Object){
        var query= this.model.find(filter);
        query.exec( (err, userList) => {
            response.json(userList);
        });
    }




}