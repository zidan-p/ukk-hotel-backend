const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer")

//midleware
const {uploadFile} = require('./../middleware/uploadFile');
const {validation} = require("./../middleware/validation");

//validation
const {createUserSchema} = require("./../validation/userValidation");

//import controller
const userController = require("./../controller/user.controller");


//Config
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
// app.use(multer().any()); //cara kasar untuk menghandle form data

//Router
const userRouter = express.Router();


app.use("/user", userRouter
    .post("/",uploadFile(["foto"]), userController.createUser)
)

// app.post("/user",(req,res) => {
//     console.log(req.body);
//     console.log(req);
//     return res.json({body : req.body})
// })

app.get("/tes",(req,res)=>{
    res.send("hello!")
})




module.exports = app;