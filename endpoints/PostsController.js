// import Models
import UsersModel from "../models/UsersModel.js";
import PostsModel from "../models/PostsModel.js";

//^________________//
//^______GET______// 
//^______________//

// ALL POSTS 
export const allPosts = async (req, res) => {
    try {
        // return news feed
        const post = await PostsModel.find().sort('-createdAt')
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({
            message: `Posts not found: ${err.message}`
        })
    }
}


// USER POSTS
export const userPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await PostsModel.find({ userId }).sort('-createdAt')

        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({
            message: `Posts not found: ${err.message}`
        })
    }
}

// NEW POST
export const newPost = async (req, res) => {
    try {
        // extract from body req
        const { userId, description, picturePath } = req.body;

        //  search user
        const user = await UsersModel.findById(userId);

        // create new post
        const newPost = new PostsModel({ 
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes: {},
            comments: [] 
        })
        
        // save post
        await newPost.save()
        
        // return news feed updated
        const posts = await PostsModel.find().sort('-createdAt')
        res.status(201).json(posts) 
    } catch (err) {
        res.status(409).json({
            message: `Conflict error: ${err.message}`
        })
    }
}


// POST LIKES
export const postLikes = async (req, res) => {
    try {
        // extract id from req params
        const { id } = req.params;
        
        // extract user id from req body
        const { userId } = req.body;
        
        // search post info
        const post = await PostsModel.findById(id); 
        
        // search user likes
        const postLiked = post.likes.get(userId); 

        if (postLiked) {
            // if already exists, delete user id
            post.likes.delete(userId)
        } else {
            // if doesn't exist, set it true
            post.likes.set(userId, true)
        }

        // search updated post
        const updatedPost = await PostsModel.findByIdAndUpdate(id, { likes: post.likes }, { new: true })
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404).json({
            message: `Posts not found: ${err.message}`
        })
    }
}