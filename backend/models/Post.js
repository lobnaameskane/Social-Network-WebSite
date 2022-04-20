const mongoose = require("mongoose");
const commentSchema = require("./Comment.js");
const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max:500
    },
    img:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    },
    heart:{
        type:Array,
        default:[]
    },
    comments: [],
    

},


{ timestamps: true }

);
module.exports = Post = mongoose.model("Post", PostSchema);


