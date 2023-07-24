import express from "express";
// import user controllers
import { getUser, getUsers,  userFriends, newUser, toggleFriend, editUser, deleteUser } from "../endpoints/UsersController.js";
// import middlewares
import { verifyToken } from "../middlewares/authMiddleware.js";

// router instance
const router = express.Router();

//^________________//
//^______GET______// 
//^______________//

// GET ONE
router.get("/:id", verifyToken, getUser);

// GET ALL
router.get("/", getUsers);

// GET ALL FRIENDS BY USER ID
router.get("/:id/friends", verifyToken, userFriends);


//^_________________//
//^______POST______// 
//^_______________//

// USER CREATE
router.post("/new", newUser)


//^______________________//
//^______PUT/PATCH______// 
//^____________________//

// FRIEND TOGGLE 
router.patch("/:id/:friendId", verifyToken, toggleFriend);

// USER UPDATE
router.patch("/:id/edit", editUser)


//^___________________//
//^______DELETE______// 
//^_________________//

// USER DELETE by ID
router.delete("/:id/delete", deleteUser)



export default router;