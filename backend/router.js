const express = require("express");
const { CreateTask,GetTask,DeleteTask,UpdateTask } = require("./Controllers/Task");
const Router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

Router.post("/task",upload.fields([]), CreateTask);
Router.get('/task',GetTask)
Router.delete('/task/:id', DeleteTask);
Router.get('/task/:id', GetTask);
Router.put('/task/:id',upload.fields([]), UpdateTask);
module.exports = Router;
