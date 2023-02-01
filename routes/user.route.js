
//midleware
const {uploadFile} = require('./../middleware/uploadFile');
const {validation} = require("./../middleware/validation");

//validation
const validationSchema = require("./../validation/userValidation");

//import controller
const userController = require("./../controller/user.controller");

//Router
const Route = require("express").Router();

// GET
Route.get(
    "/", 
    userController.getAllUser,
    userController.endHandler
);

Route.get(
    "/role/admin",
    userController.getAllAdmin,
    userController.endHandler
);

Route.get(
    "/role/resepsionis",
    userController.getAllResepsionis,
    userController.endHandler
);

Route.get(
    "/username/:username",
    userController.getUserByUsername,
    userController.endHandler
);

Route.get(
    "/:id",
    userController.getUser,
    userController.endHandler
);



// // POST
// Route.post(
//     "/", 
//     // uploadFile("foto"),
//     (req,res,next)=>{
//         console.log("anjing cuuk")
//         return res.json({data : "anjing asuuu"})
//     }, 
//     validation(validationSchema.createUserSchema), 
//     userController.createUser,
//     userController.endHandler
// );

// PUT
Route.put(
    "/:id", 
    uploadFile("foto"), 
    validation(validationSchema.updateUserSchema), 
    userController.updateUser
);

// DElETE
Route.delete(
    "/:id",
    userController.getUser,
    userController.deleteUser
)





module.exports = Route;



