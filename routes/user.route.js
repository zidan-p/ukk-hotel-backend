
//midleware
const {uploadFile} = require('./../middleware/uploadFile');
const {validation} = require("./../middleware/validation");

//validation
const validationSchema = require("./../validation/userValidation");

//import controller
const userController = require("./../controller/user.controller");
const multer = require('multer');

const upload = multer();

//Router
const Route = require("express").Router();

// GET
Route.get(
    "/",
    userController.firstHandler, 
    userController.getAllUser,
    userController.endHandler
);

Route.get(
    "/role/admin",
    userController.firstHandler,
    userController.getAllAdmin,
    userController.endHandler
);

Route.get(
    "/role/resepsionis",
    userController.firstHandler,
    userController.getAllResepsionis,
    userController.endHandler
);

Route.get(
    "/username/:username",
    userController.firstHandler,
    userController.getUserByUsername,
    userController.endHandler
);

Route.get(
    "/:id",
    userController.firstHandler,
    userController.getUser,
    userController.endHandler
);



// POST
Route.post(
    "/",
    userController.firstHandler,                    //initial request value
    uploadFile("foto"),                             //upload file
    validation(validationSchema.createUserSchema),  //validate
    userController.createUser,                      //add to database
    userController.endHandler                       //handle output
);

// PUT
Route.put(
    "/:id",
    userController.firstHandler, 
    uploadFile("foto"), 
    validation(validationSchema.updateUserSchema), 
    userController.updateUser
);

// DElETE
Route.delete(
    "/:id",
    userController.firstHandler,
    userController.getUser,
    userController.deleteUser
)





module.exports = Route;



