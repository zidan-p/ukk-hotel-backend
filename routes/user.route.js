
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
Route.get("/", userController.getAllUser);
Route.get("/role/admin", userController.getAllAdmin);
Route.get("/role/resepsionis", userController.getAllResepsionis);
Route.get("/username/:username", userController.getUserByUsername);
Route.get("/:id", userController.getUser);


// POST
Route.post("/", uploadFile("foto"), validation(validationSchema.createUserSchema), userController.createUser);

// PUT
Route.put("/:id", uploadFile("foto"), validation(validationSchema.updateUserSchema), userController.updateUser);

// DElETE
Route.delete("/:id")





module.exports = app;



