const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const helmet   = require('helmet');
const morgan   = require('morgan');
const multer = require("multer");
const path = require("path");
//const router = express.Router();
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const cors = require('cors');

app.use(cors());



dotenv.config();

mongoose.connect(process.env.Mongo_URL, {useNewUrlParser: true,useUnifiedTopology: true},()=>{
    console.log("Connected to MONGODB");
});

// to  not make any request , just using the folder::
app.use("/postPictures", express.static(path.join(__dirname, "public/postPictures")));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/postPictures");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });

const upload = multer({ storage: storage }); //multer : midlleware for uploading files

//uploading files:
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
        return res.status(200);
    }
    catch(err){
       console.log(err);
    }
});


app.use("/api/users" ,userRoute);
app.use("/api/auth" ,authRoute);
app.use("/api/posts" ,postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);


app.listen(3001,()=> {
    console.log('server running')
})