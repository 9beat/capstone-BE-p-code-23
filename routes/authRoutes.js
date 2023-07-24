import express from "express";
// endpoints
import { userLogin } from "../endpoints/AuthController.js";

// create router
const router = express.Router();


// LOGIN POST
router.post("/login", userLogin);

// // users GET
// // router.get('/users', async(req, res) => {
// // try {
// //     const user = await UserModel.find();
// //     res.status(200).send(user);
// // } catch (err) {
// //     res.status(500).json({ error: err.message });
// // }
// // });
// // router.get("/login-get", userLogin);

export default router;