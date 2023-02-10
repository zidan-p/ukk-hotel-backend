

const authController = require("./../controller/authorization.controller");

//ROuter
const Route = require("express").Router()


Route.post(
    "/login",
    authController.login
)


module.exports = Route





