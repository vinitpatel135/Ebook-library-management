const { Router } = require("express");
const asyncHandeler =require("express-async-handler");
const userController = require("../Users/UserController");
const ebookController = require("./EbookController");
const multer = require('multer');

const ebookRouter =Router()

const upload = multer({ dest: 'public/' });

ebookRouter.post("/add", userController.AuthGard, upload.single('file'),asyncHandeler(ebookController.addEbook))
ebookRouter.delete("/delete/:id", userController.AuthGard, asyncHandeler(ebookController.deleteEbook))
ebookRouter.get("/", asyncHandeler(ebookController.listEbooks))
ebookRouter.put("/edit/:id", userController.AuthGard, upload.single('file'), asyncHandeler(ebookController.updateEbook))
ebookRouter.get("/userebook/:id", userController.AuthGard, asyncHandeler(ebookController.getEbooksByUserId))


module.exports = ebookRouter