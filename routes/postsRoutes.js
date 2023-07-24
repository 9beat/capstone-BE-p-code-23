import express from "express";
import { allPosts, userPosts, postLikes 
} from "../endpoints/PostsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

//^________________//
//^______GET______// 
//^______________//

// GET ALL
router.get("/", verifyToken, allPosts)

// GET ONE
router.get("/:userId", verifyToken, userPosts)


//^____________________//
//^_____PUT_PATCH_____// 
//^__________________//

// LIKES
router.patch("/:id/like", verifyToken, postLikes) 


export default router;



// async (req, res) => {
//     try {
//         const posts = await PostsModel.find()
//         res.status(200).send(posts)
//     } catch (error) {
//         res.status(500).send({
//             message: `Server internal error (GET/router/posts): ${error}`
//         })
//     }
// }


// CREATE POST

//* router.post("/posts/new", verifyToken, postCreate)

//                     async (req, res) => {
//     const newPost = new PostsModel({
//         user: req.body.title,
//         filePath: req.body.filePath,
//         postText: req.body.postText,
//         likes: req.body.likes,
//         comments: req.body.comments,
//     })
//     try {
//         const savedPost = await newPost.save()
//         res.status(200).send(savedPost)
//     } catch (error) {
//         res.status(500).send({
//             message: `Server internal error (POST/router/posts): ${error}`
//         })
//     }
// }


