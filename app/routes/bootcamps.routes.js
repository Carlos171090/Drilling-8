const express = require("express");
const middleware = require("../middleware/index");
const { verifyToken } = middleware.authMiddleware;
const {
  createBootcamp,
  addUser,
  findById,
  findAll,
} = require("../controllers/bootcamp.controller");

const routerBootcamp = express.Router();

routerBootcamp.post("/api/bootcamp", verifyToken, createBootcamp);
routerBootcamp.post("/api/bootcamp/adduser", verifyToken, addUser);
routerBootcamp.get("/api/bootcamp/:id", verifyToken, findById);
routerBootcamp.get("/api/bootcamp", verifyToken, findAll);

module.exports = routerBootcamp;
