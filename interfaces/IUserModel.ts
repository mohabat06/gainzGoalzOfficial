import Mongoose= require('mongoose');

interface IUserModel extends Mongoose.Document{
    userId: string;
    name: string;
    password: string;
}

export default IUserModel;