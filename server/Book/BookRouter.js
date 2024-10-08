const { Router } = require("express");
const asyncHandeler =require("express-async-handler");
const bookController = require("./BookController");
const userController = require("../Users/UserController");

const bookRouter =Router()


bookRouter.post("/add", userController.AuthGard, asyncHandeler(bookController.addBooking))
bookRouter.delete("/:id", userController.AuthGard, asyncHandeler(bookController.deleteBooking))
bookRouter.get("/:id", userController.AuthGard, asyncHandeler(bookController.listByUser))


module.exports = bookRouter