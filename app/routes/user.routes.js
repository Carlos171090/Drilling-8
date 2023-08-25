const express = require("express");
const middleware = require("../middleware/index");
const { verifySignUp } = middleware.verifySignUpMiddleware;
const { verifyToken, generateToken } = middleware.authMiddleware;

const {
  createUser,
  loginUser,
  findUserById,
  findAll,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controller");

const routerUser = express.Router();

routerUser.post("/api/signup", verifySignUp, createUser);
routerUser.post("/api/signin", loginUser);
routerUser.get("/api/user/:id", verifyToken, findUserById);
routerUser.get("/api/user/", verifyToken, findAll);
routerUser.put("/api/user/:id", verifyToken, updateUserById);
routerUser.delete("/api/user/:id", verifyToken, deleteUserById);

module.exports = routerUser;
