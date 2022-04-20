const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        min:3,
        max:25,
        unique:true
    },
    email: {
        type:String,
        required:true,
        max:50,
        unique:true
    },
    password: {
        type:String,
        required:true,
        max:50,
        min:6
    },
    profilePicture:{
        type:String,
        default:'',
    },
    coverPicture:{
        type:String,
        default:'',
    },
    followers : {
        type:Array,
        default : [],
    },
    following : {
        type:Array,
        default : [],

    },
    isAdmin : {
        type : Boolean,
        default : false,
    },
    desc:{
        type:String,
        max:50
    },
    city:{
        type:String,
        max:50
    },
    birthDate:{
        type:Date,
    },
    from:{
        type:String,
        max:50
    },
    relationship:{
        type:Number,
        enum: [1,2,3],
    },
    studiesAt:{
        type:String,
        max:60
    },
    worksAt:{
        type:String,
        max:60
    },
},


{ timestamps: true }

);
module.exports = User = mongoose.model("User", UserSchema);


