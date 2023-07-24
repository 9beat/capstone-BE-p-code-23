import mongoose  from "mongoose";

  //^____________________________//
 //^_________POST MODEL_________//
//^____________________________//

const PostSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath : String,
        userPicturePath: String,
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: {
            type: Array,
            default: []
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
        }
    }, { 
        timestamps: true,
        // strict: true
    }
);

// passing schema to the model 
const PostsModel = mongoose.model("PostsModel", PostSchema, 'posts');
// console.log(PostsModel); 

export default PostsModel;